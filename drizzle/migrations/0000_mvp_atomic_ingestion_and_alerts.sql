ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slack_webhook_url text;
CREATE TABLE IF NOT EXISTS public.api_keys (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, name text NOT NULL, key_hash text NOT NULL UNIQUE, key_prefix text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), last_used_at timestamptz, active boolean NOT NULL DEFAULT true);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read own api_keys" ON public.api_keys;
CREATE POLICY "read own api_keys" ON public.api_keys FOR SELECT TO authenticated USING (user_id=auth.uid());
DROP POLICY IF EXISTS "insert own api_keys" ON public.api_keys;
CREATE POLICY "insert own api_keys" ON public.api_keys FOR INSERT TO authenticated WITH CHECK (user_id=auth.uid());
DROP POLICY IF EXISTS "update own api_keys" ON public.api_keys;
CREATE POLICY "update own api_keys" ON public.api_keys FOR UPDATE TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
DROP POLICY IF EXISTS "delete own api_keys" ON public.api_keys;
CREATE POLICY "delete own api_keys" ON public.api_keys FOR DELETE TO authenticated USING (user_id=auth.uid());
CREATE OR REPLACE FUNCTION public.replace_provider_snapshot(p_provider uuid, p_events jsonb) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE owner_id uuid; provider_kind public.provider_type; inserted_count integer;
BEGIN
 SELECT user_id,type INTO owner_id,provider_kind FROM public.providers WHERE id=p_provider AND user_id=auth.uid() FOR UPDATE;
 IF owner_id IS NULL THEN RAISE EXCEPTION 'Provider not found'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(owner_id::text,0));
 IF jsonb_typeof(p_events) <> 'array' THEN RAISE EXCEPTION 'Invalid snapshot'; END IF;
 DELETE FROM public.cost_events WHERE provider_id=p_provider AND user_id=owner_id;
 INSERT INTO public.cost_events(user_id,provider_id,provider_type,model,endpoint,input_tokens,output_tokens,cost_usd,requests,occurred_at)
 SELECT owner_id,p_provider,provider_kind,e.model,e.endpoint,e.input_tokens,e.output_tokens,e.cost_usd,e.requests,e.occurred_at FROM jsonb_to_recordset(p_events) AS e(model text,endpoint text,input_tokens integer,output_tokens integer,cost_usd numeric,requests integer,occurred_at timestamptz);
 GET DIAGNOSTICS inserted_count=ROW_COUNT;
 DELETE FROM public.daily_cost_rollups WHERE user_id=owner_id;
 INSERT INTO public.daily_cost_rollups(user_id,day,provider_type,model,total_cost_usd,total_input_tokens,total_output_tokens,request_count)
 SELECT owner_id,(occurred_at AT TIME ZONE 'UTC')::date,provider_type,model,sum(cost_usd),sum(input_tokens),sum(output_tokens),sum(requests) FROM public.cost_events WHERE user_id=owner_id GROUP BY 2,3,4;
 UPDATE public.providers SET status='active',last_synced_at=now(),last_error=NULL WHERE id=p_provider AND user_id=owner_id;
 RETURN inserted_count;
END $$;
REVOKE ALL ON FUNCTION public.replace_provider_snapshot(uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.replace_provider_snapshot(uuid,jsonb) TO authenticated;
CREATE OR REPLACE FUNCTION public.record_alert_breach(p_alert uuid,p_value numeric,p_message text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE a public.alerts; event_id uuid;
BEGIN
 SELECT * INTO a FROM public.alerts WHERE id=p_alert AND user_id=auth.uid() AND active FOR UPDATE;
 IF a.id IS NULL OR a.last_triggered_at > now()-interval '24 hours' OR p_value<a.threshold THEN RETURN NULL; END IF;
 INSERT INTO public.alert_events(alert_id,user_id,value,message) VALUES(a.id,a.user_id,p_value,p_message) RETURNING id INTO event_id;
 UPDATE public.alerts SET last_triggered_at=now() WHERE id=a.id;
 INSERT INTO public.notifications(user_id,title,body,kind) VALUES(a.user_id,a.name,p_message,'warning');
 RETURN event_id;
END $$;
REVOKE ALL ON FUNCTION public.record_alert_breach(uuid,numeric,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.record_alert_breach(uuid,numeric,text) TO authenticated;