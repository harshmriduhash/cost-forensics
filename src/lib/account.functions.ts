import { createServerFn } from '@tanstack/react-start';
import { verifiedAuth } from '@/lib/verified-auth';
import { alertInput, isPro } from '@/lib/mvp-rules';
import { z } from 'zod';

export const getMe = createServerFn({method:'GET'}).middleware([verifiedAuth]).handler(async({context})=>{
 const [{data:profile,error:p},{data:subscription,error:s}]=await Promise.all([context.supabase.from('profiles').select('*').eq('id',context.userId).maybeSingle(),context.supabase.from('subscriptions').select('*').eq('user_id',context.userId).maybeSingle()]);
 if(p||s)throw new Error(p?.message||s?.message);return {profile,subscription};
});
export const updateProfile=createServerFn({method:'POST'}).middleware([verifiedAuth]).inputValidator((v:unknown)=>z.object({full_name:z.string().trim().max(120),slack_webhook_url:z.string().nullable().optional()}).parse(v)).handler(async({data,context})=>{
 if(data.slack_webhook_url){const u=new URL(data.slack_webhook_url);if(u.protocol!=='https:'||u.hostname!=='hooks.slack.com'||!u.pathname.startsWith('/services/'))throw new Error('Use a valid Slack incoming webhook URL.');}
 const {error}=await context.supabase.from('profiles').update(data).eq('id',context.userId);if(error)throw new Error(error.message);return {ok:true};
});
export const completeOnboarding=createServerFn({method:'POST'}).middleware([verifiedAuth]).handler(async({context})=>{
 const {error}=await context.supabase.from('profiles').update({onboarded:true}).eq('id',context.userId);if(error)throw new Error(error.message);return {ok:true};
});
export const listAlerts=createServerFn({method:'GET'}).middleware([verifiedAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.from('alerts').select('*').eq('user_id',context.userId).order('created_at',{ascending:false});if(error)throw new Error(error.message);return data??[];
});
export const createAlert=createServerFn({method:'POST'}).middleware([verifiedAuth]).inputValidator((v:unknown)=>alertInput.parse(v)).handler(async({data,context})=>{
 const {error}=await context.supabase.from('alerts').insert({...data,user_id:context.userId});if(error)throw new Error(error.message);return {ok:true};
});
export const editAlert=createServerFn({method:'POST'}).middleware([verifiedAuth]).inputValidator((v:unknown)=>z.object({id:z.string().uuid(),alert:alertInput}).parse(v)).handler(async({data,context})=>{
 const {error}=await context.supabase.from('alerts').update(data.alert).eq('id',data.id).eq('user_id',context.userId);if(error)throw new Error(error.message);return {ok:true};
});
export const deleteAlert=createServerFn({method:'POST'}).middleware([verifiedAuth]).inputValidator((v:unknown)=>z.object({id:z.string().uuid()}).parse(v)).handler(async({data,context})=>{
 const {error}=await context.supabase.from('alerts').delete().eq('id',data.id).eq('user_id',context.userId);if(error)throw new Error(error.message);return {ok:true};
});
export const toggleAlert=createServerFn({method:'POST'}).middleware([verifiedAuth]).inputValidator((v:unknown)=>z.object({id:z.string().uuid(),active:z.boolean()}).parse(v)).handler(async({data,context})=>{
 const {error}=await context.supabase.from('alerts').update({active:data.active}).eq('id',data.id).eq('user_id',context.userId);if(error)throw new Error(error.message);return {ok:true};
});
export const listAlertEvents=createServerFn({method:'GET'}).middleware([verifiedAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.from('alert_events').select('*').eq('user_id',context.userId).order('triggered_at',{ascending:false}).limit(100);if(error)throw new Error(error.message);return data??[];
});
export const listNotifications=createServerFn({method:'GET'}).middleware([verifiedAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.from('notifications').select('*').eq('user_id',context.userId).order('created_at',{ascending:false}).limit(20);if(error)throw new Error(error.message);return data??[];
});
export const markNotificationsRead=createServerFn({method:'POST'}).middleware([verifiedAuth]).handler(async({context})=>{
 const {error}=await context.supabase.from('notifications').update({read:true}).eq('user_id',context.userId).eq('read',false);if(error)throw new Error(error.message);return {ok:true};
});
export const deleteAccount=createServerFn({method:'POST'}).middleware([verifiedAuth]).handler(async({context})=>{
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const {error}=await supabaseAdmin.auth.admin.deleteUser(context.userId);if(error)throw new Error(error.message);return {ok:true};
});
export async function createInAppNotification(client:any,userId:string,title:string,body:string,kind='info'){
 const {error}=await client.from('notifications').insert({user_id:userId,title,body,kind,read:false});if(error)throw new Error(error.message);
}
export const testSlackWebhook=createServerFn({method:'POST'}).middleware([verifiedAuth]).inputValidator((v:unknown)=>z.object({url:z.string().url()}).parse(v)).handler(async({data})=>{
 const u=new URL(data.url);if(u.protocol!=='https:'||u.hostname!=='hooks.slack.com'||!u.pathname.startsWith('/services/'))throw new Error('Use a valid Slack incoming webhook URL.');
 const response=await fetch(u,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'Cost Forensics: integration test successful.'})});if(!response.ok)throw new Error(`Slack test failed (${response.status}).`);return {ok:true};
});
export const listApiKeys=createServerFn({method:'GET'}).middleware([verifiedAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.from('api_keys').select('id,name,key_prefix,created_at,last_used_at,active').eq('user_id',context.userId).order('created_at',{ascending:false});if(error)throw new Error(error.message);return data??[];
});
export const generateApiKey=createServerFn({method:'POST'}).middleware([verifiedAuth]).inputValidator((v:unknown)=>z.object({name:z.string().trim().min(1).max(60)}).parse(v)).handler(async({data,context})=>{
 const {data:sub,error:subError}=await context.supabase.from('subscriptions').select('plan,status').eq('user_id',context.userId).maybeSingle();if(subError)throw new Error(subError.message);if(!isPro(sub))throw new Error('Developer API access requires an active Pro subscription.');
 const crypto=await import('node:crypto');const rawKey='cf_key_'+crypto.randomBytes(24).toString('hex');const key_hash=crypto.createHash('sha256').update(rawKey).digest('hex');
 const {error}=await context.supabase.from('api_keys').insert({user_id:context.userId,name:data.name,key_hash,key_prefix:rawKey.slice(0,11)});if(error)throw new Error(error.message);return {rawKey};
});
export const revokeApiKey=createServerFn({method:'POST'}).middleware([verifiedAuth]).inputValidator((v:unknown)=>z.object({id:z.string().uuid()}).parse(v)).handler(async({data,context})=>{
 const {error}=await context.supabase.from('api_keys').delete().eq('id',data.id).eq('user_id',context.userId);if(error)throw new Error(error.message);return {ok:true};
});
