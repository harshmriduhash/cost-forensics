import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { sendNotificationEmail } from "@/lib/email";
import { z } from "zod";

export const listAlerts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });
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

export async function createInAppNotification(
  supabaseAdmin: { from: (table: string) => { insert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }> } },
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

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = userData.user?.email;
  if (email) {
    await sendNotificationEmail({ to: email, title, body });
  }
}

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
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
