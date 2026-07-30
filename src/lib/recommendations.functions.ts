import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createInAppNotification } from "@/lib/account.functions";
import { z } from "zod";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  return createOpenAICompatible({
    name: "lovable-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": key },
  });
}

const RecSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      summary: z.string(),
      detail: z.string(),
      code_snippet: z.string().nullable(),
      current_cost_usd: z.number(),
      predicted_savings_usd: z.number(),
      confidence: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      risk: z.enum(["low", "medium", "high"]),
    }),
  ),
});

export const generateRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Aggregate last 30 days
    const since = new Date(Date.now() - 30 * 86400 * 1000).toISOString();
    const { data: events } = await context.supabase
      .from("cost_events")
      .select("provider_type, model, endpoint, cost_usd, input_tokens, output_tokens, requests, occurred_at")
      .gte("occurred_at", since);
    if (!events || events.length === 0) {
      throw new Error("No cost data yet. Connect a provider first.");
    }

    const byModel: Record<string, { cost: number; requests: number; input: number; output: number; endpoint: string | null }> = {};
    let total = 0;
    for (const e of events) {
      const cost = Number(e.cost_usd);
      total += cost;
      const k = `${e.provider_type}:${e.model}`;
      const cur = byModel[k] ?? { cost: 0, requests: 0, input: 0, output: 0, endpoint: e.endpoint };
      cur.cost += cost;
      cur.requests += e.requests ?? 1;
      cur.input += e.input_tokens ?? 0;
      cur.output += e.output_tokens ?? 0;
      byModel[k] = cur;
    }

    const summary = Object.entries(byModel)
      .map(([k, v]) => `${k}: $${v.cost.toFixed(2)} across ${v.requests} req (in=${v.input}, out=${v.output})`)
      .join("\n");

    const prompt = `You are an LLM cost optimization expert. Given this 30-day usage of an application, produce 5 to 8 specific, actionable optimization recommendations. Focus on: (1) model downgrades where quality equivalence is likely, (2) prompt caching opportunities, (3) batching/embedding cache, (4) reducing output tokens with schema/max_tokens, (5) routing simple queries to cheaper models.

Total 30-day cost: $${total.toFixed(2)}
By model:
${summary}

For each recommendation:
- title: short imperative (e.g. "Route classification traffic to gpt-4o-mini")
- summary: one-line impact
- detail: 2-4 sentence explanation of WHY it saves money and HOW to implement
- code_snippet: JS or Python snippet (or null if not applicable)
- current_cost_usd: current 30-day cost of the affected traffic
- predicted_savings_usd: realistic monthly saving in USD (numeric)
- confidence: 0-100 integer
- difficulty: easy | medium | hard
- risk: low | medium | high

Be concrete and numeric — use the actual numbers above. Do not invent models not present in the data.`;

    const provider = gateway();
    let recs: z.infer<typeof RecSchema>["recommendations"] = [];
    try {
      const { output } = await generateText({
        model: provider("openai/gpt-5.5"),
        output: Output.object({ schema: RecSchema }),
        prompt,
      });
      recs = output.recommendations;
    } catch (err) {
      if (NoObjectGeneratedError.isInstance(err)) {
        try {
          const parsed = JSON.parse((err as { text?: string }).text ?? "{}");
          recs = RecSchema.parse(parsed).recommendations;
        } catch {
          throw new Error("The AI response could not be parsed. Please try again.");
        }
      } else if (err instanceof Error && /402/.test(err.message)) {
        throw new Error("AI credits exhausted. Please add credits in your workspace billing.");
      } else if (err instanceof Error && /429/.test(err.message)) {
        throw new Error("Rate limited. Try again in a minute.");
      } else {
        throw err;
      }
    }

    // Clear previous pending recs for a fresh snapshot
    await context.supabase.from("recommendations").delete().eq("status", "pending");

    const today = new Date().toISOString().slice(0, 10);
    const rows = recs.map((r) => ({
      user_id: context.userId,
      title: r.title.slice(0, 200),
      summary: r.summary.slice(0, 500),
      detail: r.detail,
      code_snippet: r.code_snippet,
      current_cost_usd: Math.max(0, r.current_cost_usd),
      predicted_savings_usd: Math.max(0, r.predicted_savings_usd),
      confidence: Math.min(100, Math.max(0, Math.round(r.confidence))),
      difficulty: r.difficulty,
      risk: r.risk,
      status: "pending" as const,
      generated_from_snapshot: today,
    }));

    if (rows.length) {
      await context.supabase.from("recommendations").insert(rows);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await createInAppNotification(
        supabaseAdmin,
        context.userId,
        "Recommendations ready",
        `We generated ${rows.length} cost-saving recommendations from your latest usage data.`,
        "info",
      );
    }
    return { count: rows.length };
  });

export const listRecommendations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("recommendations")
      .select("*")
      .order("predicted_savings_usd", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["pending", "implemented", "dismissed"]) }).parse(v),
  )
  .handler(async ({ data, context }) => {
  const patch: { status: "pending" | "implemented" | "dismissed"; implemented_at?: string } = { status: data.status };
    if (data.status === "implemented") patch.implemented_at = new Date().toISOString();
    const { error } = await context.supabase.from("recommendations").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
