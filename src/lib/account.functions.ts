import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listAlerts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("alerts").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
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

// -------- profile & subscription --------

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: profile }, { data: sub }] = await Promise.all([
      context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
      context.supabase.from("subscriptions").select("*").eq("user_id", context.userId).maybeSingle(),
    ]);
    return { profile, subscription: sub };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ full_name: z.string().max(120) }).parse(v))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("profiles").update({ full_name: data.full_name }).eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
