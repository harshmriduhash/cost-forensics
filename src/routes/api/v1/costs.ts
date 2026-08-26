import { createFileRoute } from "@tanstack/react-router";
import crypto from "crypto";

export const Route = createFileRoute("/api/v1/costs")({
  server: {
    handlers: {
      GET: async ({ request }) => handleCostsApi(request),
    },
  },
});

async function handleCostsApi(request: Request) {
  const apiKeyHeader =
    request.headers.get("x-api-key") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!apiKeyHeader) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Missing x-api-key header" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const keyHash = crypto.createHash("sha256").update(apiKeyHeader).digest("hex");

  try {
    const { isNeonConfigured, neonGetApiKeyByHash, neonGetDashboard } = await import("@/integrations/neon/db");
    
    // Parse query params
    const url = new URL(request.url);
    const daysParam = parseInt(url.searchParams.get("days") || "30", 10);
    const days = Math.min(Math.max(isNaN(daysParam) ? 30 : daysParam, 1), 90);
    const startDate = new Date(Date.now() - days * 86400 * 1000).toISOString().slice(0, 10);

    let userId: string | undefined;

    if (isNeonConfigured()) {
      const keyRecord = await neonGetApiKeyByHash(keyHash);
      if (!keyRecord) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Invalid or revoked API key" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
      userId = keyRecord.user_id;

      const dash = await neonGetDashboard(userId, days);
      return new Response(
        JSON.stringify({
          period_days: days,
          since: startDate,
          totals: dash.totals,
          series: dash.series,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Validate API key against database
    const { data: keyRecord, error: keyErr } = await supabaseAdmin
      .from("api_keys")
      .select("id, user_id, active")
      .eq("key_hash", keyHash)
      .eq("active", true)
      .maybeSingle();

    if (keyErr || !keyRecord) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid or revoked API key" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Touch last_used_at
    await supabaseAdmin
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyRecord.id);

    // Fetch rollups for the user
    const { data: rollups, error: rollupErr } = await supabaseAdmin
      .from("daily_cost_rollups")
      .select("day, provider_type, model, total_cost_usd, total_input_tokens, total_output_tokens, request_count")
      .eq("user_id", keyRecord.user_id)
      .gte("day", startDate)
      .order("day", { ascending: false });

    if (rollupErr) {
      throw new Error(`Error loading metrics: ${rollupErr.message}`);
    }

    const rows = rollups ?? [];
    const totalCost = rows.reduce((sum, r) => sum + Number(r.total_cost_usd || 0), 0);
    const totalRequests = rows.reduce((sum, r) => sum + Number(r.request_count || 0), 0);
    const totalInputTokens = rows.reduce((sum, r) => sum + Number(r.total_input_tokens || 0), 0);
    const totalOutputTokens = rows.reduce((sum, r) => sum + Number(r.total_output_tokens || 0), 0);

    return new Response(
      JSON.stringify({
        period_days: days,
        since: startDate,
        totals: {
          cost_usd: Number(totalCost.toFixed(4)),
          requests: totalRequests,
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
        },
        rollups: rows,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("[api/v1/costs] Error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Internal Server Error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
