import { z } from 'zod';

export const alertInput = z.object({
  name: z.string().trim().min(1).max(120), type: z.enum(['daily_spend','weekly_change','model_usage']),
  threshold: z.number().finite().positive(), model: z.string().trim().max(200).nullable().optional(),
  channel_email: z.boolean().default(true),
}).superRefine((v, ctx) => {
  if (v.type === 'model_usage' && !v.model) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select a model for this alert.', path: ['model'] });
});
export function conservativeSavings(current: number, proposed: number) {
  return Math.max(0, Math.min(current, proposed)) * 0.8;
}
export function isPro(subscription: { plan: string; status: string } | null | undefined) {
  return subscription?.plan === 'pro' && ['active','trialing'].includes(subscription.status);
}
export function csvCell(value: unknown) {
  const text = String(value ?? '');
  const safe = /^[\s]*[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}
export function safeRedirect(value: string | undefined) {
  return value?.startsWith('/') && !value.startsWith('//') && !value.includes('\\') ? value : '/dashboard';
}
