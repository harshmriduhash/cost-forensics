import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("recommendations")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Recommendation not found");
    return row;
  });

export const deleteRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("recommendations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2).max(200).optional(),
  summary: z.string().min(2).max(500).optional(),
  detail: z.string().max(4000).optional().nullable(),
  code_snippet: z.string().max(6000).optional().nullable(),
  notes: z.string().max(4000).optional().nullable(),
  actual_savings_usd: z.number().min(0).optional().nullable(),
  status: z.enum(["pending", "implemented", "dismissed"]).optional(),
});

export const editRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => updateSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const finalPatch: Record<string, unknown> = { ...patch };
    if (patch.status === "implemented") finalPatch.implemented_at = new Date().toISOString();
    const { error } = await context.supabase.from("recommendations").update(finalPatch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const createSchema = z.object({
  title: z.string().min(2).max(200),
  summary: z.string().min(2).max(500),
  detail: z.string().max(4000).optional().nullable(),
  code_snippet: z.string().max(6000).optional().nullable(),
  notes: z.string().max(4000).optional().nullable(),
  current_cost_usd: z.number().min(0).default(0),
  predicted_savings_usd: z.number().min(0).default(0),
  confidence: z.number().int().min(0).max(100).default(70),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  risk: z.enum(["low", "medium", "high"]).default("low"),
});

export const createRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => createSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("recommendations")
      .insert({
        ...data,
        user_id: context.userId,
        status: "pending",
        generated_from_snapshot: new Date().toISOString().slice(0, 10),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });
