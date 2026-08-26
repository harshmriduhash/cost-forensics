import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { sendNotificationEmail } from "@/lib/email";
import { z } from "zod";
import {
  isNeonConfigured,
  neonDeleteAlert,
  neonDeleteApiKey,
  neonGetProfile,
  neonInsertAlert,
  neonInsertApiKey,
  neonListAlerts,
  neonListApiKeys,
  neonListNotifications,
  neonMarkNotificationsRead,
  neonToggleAlert,
  neonUpdateProfile,
} from "@/integrations/neon/db";

export const listAlerts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (isNeonConfigured()) return await neonListAlerts(context.userId);
    if (!context.supabase) return [];
    try {
      const { data, error } = await context.supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return [];
      return data ?? [];
    } catch {
      return [];
    }
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (isNeonConfigured()) return await neonGetProfile(context.userId);
    if (!context.supabase) {
      return {
        profile: { id: context.userId, full_name: "Demo User", email: "user@example.com", onboarded: true },
        subscription: { plan: "free", status: "active" },
      };
    }
    try {
      const [{ data: profile }, { data: sub }] = await Promise.all([
        context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
        context.supabase.from("subscriptions").select("*").eq("user_id", context.userId).maybeSingle(),
      ]);
      return {
        profile: profile ?? { id: context.userId, full_name: "Demo User", email: "user@example.com", onboarded: true },
        subscription: sub ?? { plan: "free", status: "active" },
      };
    } catch {
      return {
        profile: { id: context.userId, full_name: "Demo User", email: "user@example.com", onboarded: true },
        subscription: { plan: "free", status: "active" },
      };
    }
  });

const alertSchema = z.object({
  name: z.string().min(1).max(120),
  type: z.enum(["daily_spend", "weekly_change", "model_usage"]),
  threshold: z.number().positive(),
  model: z.string().nullable().optional(),
  channel_email: z.boolean().default(true),
});

export const createAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => alertSchema.parse(v))
  .handler(async ({ data, context }) => {
    if (isNeonConfigured()) {
      await neonInsertAlert(context.userId, data.name, data.type, data.threshold, data.model, data.channel_email);
      return { ok: true };
    }
    const { error } = await context.supabase.from("alerts").insert({
      user_id: context.userId,
      name: data.name,
      type: data.type,
      threshold: data.threshold,
      model: data.model ?? null,
      channel_email: data.channel_email,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("alerts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid(), active: z.boolean() }).parse(v))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("alerts").update({ active: data.active }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export async function createInAppNotification(
  supabaseAdmin: any,
  userId: string,
  title: string,
  body: string,
  kind = "info",
) {
  const { error } = await supabaseAdmin.from("notifications").insert({
    user_id: userId,
    title,
    body,
    kind,
    read: false,
  });
  if (error) {
    console.error("[notifications] insert failed", error.message);
    return;
  }

  try {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("slack_webhook_url")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.slack_webhook_url) {
      await sendSlackNotification(profile.slack_webhook_url, title, body, kind);
    }
  } catch (err) {
    console.error("[notifications] Slack notification failed", err);
  }

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = userData.user?.email;
  if (email) {
    await sendNotificationEmail({ to: email, title, body });
  }
}

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (isNeonConfigured()) return await neonListNotifications(context.userId);
    if (!context.supabase) return [];
    try {
      const { data, error } = await context.supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) return [];
      return data ?? [];
    } catch {
      return [];
    }
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (isNeonConfigured()) {
      await neonMarkNotificationsRead(context.userId);
      return { ok: true };
    }
    if (!context.supabase) return { ok: true };
    const { error } = await context.supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", context.userId)
      .eq("read", false);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// -------- profile & subscription --------

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ full_name: z.string().max(120), slack_webhook_url: z.string().nullable().optional() }).parse(v))
  .handler(async ({ data, context }) => {
    if (isNeonConfigured()) {
      await neonUpdateProfile(context.userId, data.full_name, data.slack_webhook_url);
      return { ok: true };
    }
    if (!context.supabase) return { ok: true };
    const updates: Record<string, any> = { full_name: data.full_name };
    if (data.slack_webhook_url !== undefined) {
      updates.slack_webhook_url = data.slack_webhook_url;
    }
    const { error } = await context.supabase.from("profiles").update(updates).eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Helper to post to Slack
export async function sendSlackNotification(webhookUrl: string, title: string, body: string, kind = "info") {
  const emoji = kind === "warning" ? "⚠️" : kind === "error" ? "🚨" : "ℹ️";
  const color = kind === "warning" ? "#F59E0B" : kind === "error" ? "#EF4444" : "#3B82F6";
  const payload = {
    attachments: [
      {
        color,
        fallback: `${emoji} ${title}: ${body}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${emoji} ${title}*`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: body
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `LLM Cost Forensics · _${new Date().toLocaleString()}_`
              }
            ]
          }
        ]
      }
    ]
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error("[Slack] Webhook request error", err);
    return false;
  }
}

export const testSlackWebhook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ url: z.string().url() }).parse(v))
  .handler(async ({ data }) => {
    const ok = await sendSlackNotification(
      data.url,
      "Slack Integration Active",
      "This is a test notification from LLM Cost Forensics. Your integration is configured correctly!",
      "info"
    );
    if (!ok) throw new Error("Slack webhook failed to send. Check URL.");
    return { ok: true };
  });

// ---------------- Developer API Keys ----------------

export const listApiKeys = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (isNeonConfigured()) return await neonListApiKeys(context.userId);
    if (!context.supabase) return [];
    try {
      const { data, error } = await context.supabase
        .from("api_keys")
        .select("id, name, key_prefix, created_at, last_used_at, active")
        .order("created_at", { ascending: false });
      if (error) return [];
      return data ?? [];
    } catch {
      return [];
    }
  });

export const generateApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ name: z.string().min(1).max(60) }).parse(v))
  .handler(async ({ data, context }) => {
    const crypto = await import("crypto");
    const rawKey = "cf_key_" + crypto.randomBytes(24).toString("hex");
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.slice(0, 11);

    if (isNeonConfigured()) {
      await neonInsertApiKey(context.userId, data.name, keyHash, keyPrefix);
      return { rawKey };
    }

    if (!context.supabase) return { rawKey };

    const { error } = await context.supabase.from("api_keys").insert({
      user_id: context.userId,
      name: data.name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
    });
    if (error) throw new Error(error.message);

    return { rawKey };
  });

export const revokeApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    if (isNeonConfigured()) {
      await neonDeleteApiKey(context.userId, data.id);
      return { ok: true };
    }
    if (!context.supabase) return { ok: true };
    const { error } = await context.supabase.from("api_keys").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
