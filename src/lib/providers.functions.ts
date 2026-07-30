import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createInAppNotification } from "@/lib/account.functions";
import { z } from "zod";

// ---------------- Providers CRUD ----------------

const connectSchema = z.object({
  type: z.enum(["openai", "anthropic"]),
  api_key: z.string().min(20),
  label: z.string().optional(),
});

export const connectProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => connectSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { encryptSecret, last4 } = await import("@/lib/crypto.server");
    const { fetchUsage } = await import("@/lib/providers.server");

    const encrypted = await encryptSecret(data.api_key);
    const { data: inserted, error } = await context.supabase
      .from("providers")
      .insert({
        user_id: context.userId,
        type: data.type,
        label: data.label ?? data.type,
        encrypted_key: encrypted,
        key_last4: last4(data.api_key),
        status: "active",
        last_synced_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    // Immediate first sync
    try {
      const events = await fetchUsage(data.type, data.api_key, 30);
      if (events.length) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const rows = events.map((e) => ({ ...e, user_id: context.userId, provider_id: inserted.id }));
        await supabaseAdmin.from("cost_events").insert(rows);
        await rebuildRollups(context.userId);
        await evaluateAlerts(context.userId);
        await createInAppNotification(
          supabaseAdmin,
          context.userId,
          "Provider connected",
          `We synced ${events.length} usage events from ${data.type}. Your dashboard is ready.`,
          "info",
        );
      }
      await context.supabase
        .from("profiles")
        .update({ onboarded: true })
        .eq("id", context.userId);
    } catch (e) {
      console.error("[connect] initial sync failed", e);
    }

    return { id: inserted.id };
  });

export const listProviders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("providers")
      .select("id, type, label, key_last4, status, last_synced_at, last_error, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("providers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const resyncProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    const { decryptSecret } = await import("@/lib/crypto.server");
    const { fetchUsage } = await import("@/lib/providers.server");

    // Fetch encrypted key via admin (encrypted_key not in default select for
    // safety, but we need it here for decryption).
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: provider, error: pErr } = await supabaseAdmin
      .from("providers")
      .select("encrypted_key, type")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (pErr || !provider) throw new Error("Provider not found");

    const apiKey = await decryptSecret(provider.encrypted_key);
    const events = await fetchUsage(provider.type, apiKey, 30);
    if (events.length) {
      const rows = events.map((e) => ({ ...e, user_id: context.userId, provider_id: data.id }));
      await supabaseAdmin.from("cost_events").insert(rows);
      await rebuildRollups(context.userId);
      await evaluateAlerts(context.userId);
      await createInAppNotification(
        supabaseAdmin,
        context.userId,
        "Provider synced",
        `We added ${events.length} recent usage events to your dashboard.`,
        "info",
      );
    }
    await supabaseAdmin
      .from("providers")
      .update({ status: "active", last_synced_at: new Date().toISOString(), last_error: null })
      .eq("id", data.id);
    return { synced: events.length };
  });

async function evaluateAlerts(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: alerts, error: alertsErr } = await supabaseAdmin
    .from("alerts")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true);
  if (alertsErr || !alerts?.length) return;

  const now = Date.now();
  const last24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const last14d = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: recent }, { data: weekly }, { data: prevWeek }] = await Promise.all([
    supabaseAdmin.from("cost_events").select("cost_usd, model").eq("user_id", userId).gte("occurred_at", last24h),
    supabaseAdmin.from("cost_events").select("cost_usd").eq("user_id", userId).gte("occurred_at", last7d),
    supabaseAdmin.from("cost_events").select("cost_usd").eq("user_id", userId).gte("occurred_at", last14d).lt("occurred_at", last7d),
  ]);

  const recentTotal = (recent ?? []).reduce((sum, row) => sum + Number(row.cost_usd ?? 0), 0);
  const weeklyTotal = (weekly ?? []).reduce((sum, row) => sum + Number(row.cost_usd ?? 0), 0);
  const prevWeekTotal = (prevWeek ?? []).reduce((sum, row) => sum + Number(row.cost_usd ?? 0), 0);

  for (const alert of alerts) {
    const triggeredAt = alert.last_triggered_at ? new Date(alert.last_triggered_at).getTime() : 0;
    if (triggeredAt && triggeredAt > now - 24 * 60 * 60 * 1000) continue;

    let value = 0;
    let message = "";
    let shouldTrigger = false;

    if (alert.type === "daily_spend") {
      value = recentTotal;
      shouldTrigger = value >= Number(alert.threshold ?? 0);
      message = `Daily spend reached $${value.toFixed(2)}, above your ${alert.name} threshold.`;
    } else if (alert.type === "weekly_change") {
      const deltaPct = prevWeekTotal > 0 ? ((weeklyTotal - prevWeekTotal) / prevWeekTotal) * 100 : weeklyTotal > 0 ? 100 : 0;
      value = deltaPct;
      shouldTrigger = deltaPct >= Number(alert.threshold ?? 0);
      message = `Spend climbed ${deltaPct.toFixed(1)}% over the prior week, above your ${alert.name} threshold.`;
    } else if (alert.type === "model_usage" && alert.model) {
      value = (recent ?? []).filter((row) => row.model === alert.model).reduce((sum, row) => sum + Number(row.cost_usd ?? 0), 0);
      shouldTrigger = value >= Number(alert.threshold ?? 0);
      message = `${alert.model} usage reached $${value.toFixed(2)} in the last 24 hours.`;
    }

    if (!shouldTrigger) continue;

    const { error: eventError } = await supabaseAdmin.from("alert_events").insert({
      alert_id: alert.id,
      user_id: userId,
      value,
      message,
      triggered_at: new Date().toISOString(),
    });
    if (eventError) {
      console.error("[alerts] insert failed", eventError.message);
      continue;
    }

    await supabaseAdmin.from("alerts").update({ last_triggered_at: new Date().toISOString() }).eq("id", alert.id);
    await createInAppNotification(supabaseAdmin, userId, alert.name, message, "warning");
  }
}

async function rebuildRollups(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Simple recompute: aggregate cost_events into daily_cost_rollups.
  const { data: events } = await supabaseAdmin
    .from("cost_events")
    .select("provider_type, model, cost_usd, input_tokens, output_tokens, requests, occurred_at")
    .eq("user_id", userId);
  if (!events) return;
  const map = new Map<string, {
    day: string; provider_type: "openai" | "anthropic"; model: string;
    cost: number; input: number; output: number; count: number;
  }>();
  for (const e of events) {
    const day = new Date(e.occurred_at).toISOString().slice(0, 10);
    const key = `${day}|${e.provider_type}|${e.model}`;
    const cur = map.get(key) ?? { day, provider_type: e.provider_type, model: e.model, cost: 0, input: 0, output: 0, count: 0 };
    cur.cost += Number(e.cost_usd);
    cur.input += e.input_tokens ?? 0;
    cur.output += e.output_tokens ?? 0;
    cur.count += e.requests ?? 1;
    map.set(key, cur);
  }
  await supabaseAdmin.from("daily_cost_rollups").delete().eq("user_id", userId);
  const rows = [...map.values()].map((r) => ({
    user_id: userId,
    day: r.day,
    provider_type: r.provider_type,
    model: r.model,
    total_cost_usd: r.cost,
    total_input_tokens: r.input,
    total_output_tokens: r.output,
    request_count: r.count,
  }));
  if (rows.length) await supabaseAdmin.from("daily_cost_rollups").insert(rows);
}

// ---------------- Dashboard data ----------------

const dashSchema = z.object({ days: z.number().int().min(1).max(365).default(30) });

export const getDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => dashSchema.parse(v ?? { days: 30 }))
  .handler(async ({ data, context }) => {
    const since = new Date(Date.now() - data.days * 86400 * 1000).toISOString();
    const { data: events, error } = await context.supabase
      .from("cost_events")
      .select("provider_type, model, endpoint, cost_usd, input_tokens, output_tokens, requests, occurred_at")
      .gte("occurred_at", since)
      .order("occurred_at", { ascending: true })
      .limit(5000);
    if (error) throw new Error(error.message);

    const rows = events ?? [];
    let total = 0, requests = 0, inputTok = 0, outputTok = 0;
    const byDay = new Map<string, number>();
    const byModel = new Map<string, number>();
    const byEndpoint = new Map<string, number>();
    const byHour = new Array(24).fill(0);
    const byProvider = new Map<string, number>();

    for (const e of rows) {
      const cost = Number(e.cost_usd);
      total += cost;
      requests += e.requests ?? 1;
      inputTok += e.input_tokens ?? 0;
      outputTok += e.output_tokens ?? 0;
      const day = e.occurred_at.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + cost);
      byModel.set(e.model, (byModel.get(e.model) ?? 0) + cost);
      byEndpoint.set(e.endpoint ?? "unknown", (byEndpoint.get(e.endpoint ?? "unknown") ?? 0) + cost);
      byProvider.set(e.provider_type, (byProvider.get(e.provider_type) ?? 0) + cost);
      byHour[new Date(e.occurred_at).getUTCHours()] += cost;
    }

    // Previous period comparison
    const prevSince = new Date(Date.now() - 2 * data.days * 86400 * 1000).toISOString();
    const { data: prev } = await context.supabase
      .from("cost_events")
      .select("cost_usd")
      .gte("occurred_at", prevSince)
      .lt("occurred_at", since);
    const prevTotal = (prev ?? []).reduce((s, r) => s + Number(r.cost_usd), 0);

    await evaluateAlerts(context.userId);

    return {
      totals: {
        cost: total,
        requests,
        inputTokens: inputTok,
        outputTokens: outputTok,
        prevCost: prevTotal,
        deltaPct: prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0,
        projected: (total / data.days) * 30,
      },
      series: {
        byDay: [...byDay.entries()].map(([day, cost]) => ({ day, cost })).sort((a, b) => a.day.localeCompare(b.day)),
        byModel: [...byModel.entries()].map(([name, cost]) => ({ name, cost })).sort((a, b) => b.cost - a.cost),
        byEndpoint: [...byEndpoint.entries()].map(([name, cost]) => ({ name, cost })).sort((a, b) => b.cost - a.cost),
        byProvider: [...byProvider.entries()].map(([name, cost]) => ({ name, cost })),
        byHour: byHour.map((cost, hour) => ({ hour, cost })),
      },
    };
  });

// Sample calls (drill-down)
export const getRecentCalls = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ model: z.string().optional(), limit: z.number().int().max(500).default(100) }).parse(v ?? {}))
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("cost_events")
      .select("occurred_at, provider_type, model, endpoint, input_tokens, output_tokens, cost_usd, requests")
      .order("occurred_at", { ascending: false })
      .limit(data.limit);
    if (data.model) q = q.eq("model", data.model);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
