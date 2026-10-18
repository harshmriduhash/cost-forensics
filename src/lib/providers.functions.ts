import { createServerFn } from '@tanstack/react-start';
import { verifiedAuth } from '@/lib/verified-auth';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AppDatabase } from '@/lib/database';
import type { Json } from '@/integrations/supabase/types';

export const connectProvider = createServerFn({ method: 'POST' }).middleware([verifiedAuth])
  .inputValidator((v: unknown) => z.object({ type: z.enum(['openai','anthropic']), api_key: z.string().trim().min(10), label: z.string().trim().max(120).optional() }).parse(v))
  .handler(async ({ data, context }) => {
    const { fetchUsage } = await import('@/lib/providers.server');
    const { encryptSecret, last4 } = await import('@/lib/crypto.server');
    // Validate permission before storing a connection. An empty real report is valid.
    const events = await fetchUsage(data.type, data.api_key, 90);
    const { data: provider, error } = await context.supabase.from('providers').insert({ user_id: context.userId, type: data.type, label: data.label || data.type, encrypted_key: await encryptSecret(data.api_key), key_last4: last4(data.api_key), status: 'connecting' }).select('id').single();
    if (error) throw new Error(error.message);
    const { error: syncError } = await context.supabase.rpc('replace_provider_snapshot', { p_provider: provider.id, p_events: events as unknown as Json });
    if (syncError) {
      await context.supabase.from('providers').update({ status: 'error', last_error: syncError.message }).eq('id', provider.id);
      throw new Error('Provider saved, but initial sync failed. Retry from Providers.');
    }
    await evaluateAlerts(context.supabase, context.userId);
    return { id: provider.id, synced: events.length };
  });

export const listProviders = createServerFn({ method: 'GET' }).middleware([verifiedAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from('providers').select('id,type,label,key_last4,status,last_synced_at,last_error,created_at').eq('user_id', context.userId).order('created_at', { ascending: false });
  if (error) throw new Error(error.message); return data ?? [];
});
export const deleteProvider = createServerFn({ method: 'POST' }).middleware([verifiedAuth]).inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v)).handler(async ({ data, context }) => {
  // Empty snapshot clears financial rows and rollups atomically before deleting the key.
  const { error: clearError } = await context.supabase.rpc('replace_provider_snapshot', { p_provider: data.id, p_events: [] });
  if (clearError) throw new Error(clearError.message);
  const { error } = await context.supabase.from('providers').delete().eq('id', data.id).eq('user_id', context.userId);
  if (error) throw new Error(error.message); return { ok: true };
});
export const resyncProvider = createServerFn({ method: 'POST' }).middleware([verifiedAuth]).inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v)).handler(async ({ data, context }) => {
  const { data: provider, error } = await context.supabase.from('providers').select('encrypted_key,type').eq('id', data.id).eq('user_id', context.userId).single();
  if (error) throw new Error('Provider not found');
  try {
    const { decryptSecret } = await import('@/lib/crypto.server'); const { fetchUsage } = await import('@/lib/providers.server');
    const events = await fetchUsage(provider.type, await decryptSecret(provider.encrypted_key), 90);
    const { error: syncError } = await context.supabase.rpc('replace_provider_snapshot', { p_provider: data.id, p_events: events as unknown as Json });
    if (syncError) throw new Error(syncError.message);
    await evaluateAlerts(context.supabase, context.userId); return { synced: events.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    await context.supabase.from('providers').update({ status: 'error', last_error: message }).eq('id', data.id).eq('user_id', context.userId);
    throw new Error(message);
  }
});

async function allEvents(client: SupabaseClient<AppDatabase>, userId: string, since: string) {
  type Event = AppDatabase['public']['Tables']['cost_events']['Row'];
  const rows: Event[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from('cost_events').select('*').eq('user_id', userId).gte('occurred_at', since).order('occurred_at').order('id').range(offset, offset + 999);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? [])); if ((data?.length ?? 0) < 1000) return rows;
  }
}
async function evaluateAlerts(client: SupabaseClient<AppDatabase>, userId: string) {
  const { data: alerts, error } = await client.from('alerts').select('*').eq('user_id',userId).eq('active',true);
  if (error) throw new Error(error.message); if (!alerts?.length) return;
  const rows = await allEvents(client,userId,new Date(Date.now()-14*86400000).toISOString());
  const now = Date.now(); const sum = (from: number, to: number, model?: string | null) => rows.filter(r => { const t = Date.parse(r.occurred_at); return t >= from && t < to && (!model || r.model === model); }).reduce((s,r) => s+Number(r.cost_usd),0);
  for (const a of alerts) {
    const today = new Date(); today.setUTCHours(0,0,0,0);
    const recent = sum(today.getTime(),now+1,a.type === 'model_usage' ? a.model : null);
    const week = sum(now-7*86400000,now+1), prev = sum(now-14*86400000,now-7*86400000);
    const value = a.type === 'weekly_change' ? (prev > 0 ? (week-prev)/prev*100 : week > 0 ? 100 : 0) : recent;
    if (value < Number(a.threshold)) continue;
    const message = a.type === 'weekly_change' ? `Weekly spend increased ${value.toFixed(1)}%.` : `${a.model || 'Daily spend'} reached $${value.toFixed(2)} today (UTC).`;
    const { data: eventId, error: eventError } = await client.rpc('record_alert_breach',{ p_alert:a.id,p_value:value,p_message:message });
    if (eventError) throw new Error(eventError.message);
    if (eventId && a.channel_email) {
      const { data: user } = await client.auth.getUser();
      if (user.user?.email) { const { sendNotificationEmail } = await import('@/lib/email'); await sendNotificationEmail({ to:user.user.email,title:a.name,body:message }); }
    }
  }
}

export const getDashboard = createServerFn({ method:'POST' }).middleware([verifiedAuth]).inputValidator((v:unknown) => z.object({ days:z.number().int().min(1).max(90).default(30) }).parse(v ?? {})).handler(async ({data,context}) => {
  const end = new Date(); const since = new Date(end); since.setUTCDate(since.getUTCDate()-data.days); since.setUTCHours(0,0,0,0);
  const previous = new Date(since); previous.setUTCDate(previous.getUTCDate()-data.days);
  const all = await allEvents(context.supabase,context.userId,previous.toISOString());
  const rows = all.filter(r => r.occurred_at >= since.toISOString());
  const prevCost = all.filter(r => r.occurred_at < since.toISOString()).reduce((s,r) => s+Number(r.cost_usd),0);
  let cost=0, requests=0, inputTokens=0, outputTokens=0;
  const byDay = new Map<string,number>(), byModel = new Map<string,number>(), byProvider = new Map<string,number>();
  for (const r of rows) {
    const value=Number(r.cost_usd); cost+=value;requests+=r.requests;inputTokens+=r.input_tokens;outputTokens+=r.output_tokens;
    const day=r.occurred_at.slice(0,10);byDay.set(day,(byDay.get(day)??0)+value);byModel.set(r.model,(byModel.get(r.model)??0)+value);byProvider.set(r.provider_type,(byProvider.get(r.provider_type)??0)+value);
  }
  return { totals:{ cost,requests,inputTokens,outputTokens,prevCost,deltaPct:prevCost>0?(cost-prevCost)/prevCost*100:0,projected:cost/data.days*30 }, series:{ byDay:[...byDay].map(([day,cost])=>({day,cost})).sort((a,b)=>a.day.localeCompare(b.day)),byModel:[...byModel].filter(([,c])=>c>0).map(([name,cost])=>({name,cost})).sort((a,b)=>b.cost-a.cost),byProvider:[...byProvider].map(([name,cost])=>({name,cost})),byEndpoint:[],byHour:[] } };
});
export const getRecentCalls = createServerFn({method:'POST'}).middleware([verifiedAuth]).inputValidator((v:unknown)=>z.object({model:z.string().optional(),days:z.number().int().min(1).max(90).default(30),limit:z.number().int().min(1).max(10000).default(100)}).parse(v??{})).handler(async({data,context})=>{
  const since=new Date();since.setUTCDate(since.getUTCDate()-data.days);since.setUTCHours(0,0,0,0);
  const rows=await allEvents(context.supabase,context.userId,since.toISOString());
  return rows.filter(r=>!data.model||r.model===data.model).sort((a,b)=>b.occurred_at.localeCompare(a.occurred_at)).slice(0,data.limit);
});
