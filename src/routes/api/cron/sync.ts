import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cron/sync")({
  server: {
    handlers: {
      GET: async ({ request }) => handleCron(request),
      POST: async ({ request }) => handleCron(request),
    },
  },
});

async function handleCron(request: Request) {
  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization") || request.headers.get("x-cron-secret");
  const secretParam = url.searchParams.get("secret");
  
  const expectedSecret = process.env.CRON_SECRET;
  if (expectedSecret) {
    const provided = authHeader?.replace("Bearer ", "") || secretParam;
    if (provided !== expectedSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid CRON_SECRET" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { decryptSecret } = await import("@/lib/crypto.server");
    const { fetchUsage } = await import("@/lib/providers.server");

    // Fetch all active providers across all users
    const { data: providers, error } = await supabaseAdmin
      .from("providers")
      .select("id, user_id, type, encrypted_key")
      .eq("status", "active");

    if (error) {
      throw new Error(`Failed to query providers: ${error.message}`);
    }

    let syncedCount = 0;
    let eventsCount = 0;

    for (const provider of providers ?? []) {
      try {
        const apiKey = await decryptSecret(provider.encrypted_key);
        const events = await fetchUsage(provider.type as "openai" | "anthropic", apiKey, 3);

        if (events.length > 0) {
          const rows = events.map((e) => ({
            ...e,
            user_id: provider.user_id,
            provider_id: provider.id,
          }));

          await supabaseAdmin.from("cost_events").insert(rows);
          eventsCount += events.length;
        }

        await supabaseAdmin
          .from("providers")
          .update({
            last_synced_at: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", provider.id);

        syncedCount++;
      } catch (err) {
        console.error(`[cron/sync] Provider ${provider.id} sync failed:`, err);
        await supabaseAdmin
          .from("providers")
          .update({
            last_error: err instanceof Error ? err.message : "Sync error",
          })
          .eq("id", provider.id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        syncedProviders: syncedCount,
        newEvents: eventsCount,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("[cron/sync] Error:", err);
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
