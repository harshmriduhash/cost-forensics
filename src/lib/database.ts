import type { Database } from '@/integrations/supabase/types';
// Additive application schema declarations; generated integration files stay untouched.
type ApiKey = { id: string; user_id: string; name: string; key_hash: string; key_prefix: string; created_at: string; last_used_at: string | null; active: boolean };
export type AppDatabase = Omit<Database, 'public'> & {
  public: Omit<Database['public'], 'Tables' | 'Functions'> & {
    Tables: Omit<Database['public']['Tables'], 'profiles'> & {
      profiles: {
        Row: Database['public']['Tables']['profiles']['Row'] & { slack_webhook_url: string | null };
        Insert: Database['public']['Tables']['profiles']['Insert'] & { slack_webhook_url?: string | null };
        Update: Database['public']['Tables']['profiles']['Update'] & { slack_webhook_url?: string | null };
        Relationships: [];
      };
      api_keys: { Row: ApiKey; Insert: Pick<ApiKey, 'user_id' | 'name' | 'key_hash' | 'key_prefix'>; Update: Partial<ApiKey>; Relationships: [] };
    };
    Functions: Database['public']['Functions'] & {
      replace_provider_snapshot: { Args: { p_provider: string; p_events: import('@/integrations/supabase/types').Json }; Returns: number };
      record_alert_breach: { Args: { p_alert: string; p_value: number; p_message: string }; Returns: string | null };
    };
  };
};
