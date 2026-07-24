export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alert_events: {
        Row: {
          alert_id: string
          id: string
          message: string
          triggered_at: string
          user_id: string
          value: number
        }
        Insert: {
          alert_id: string
          id?: string
          message: string
          triggered_at?: string
          user_id: string
          value: number
        }
        Update: {
          alert_id?: string
          id?: string
          message?: string
          triggered_at?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "alert_events_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          active: boolean
          channel_email: boolean
          created_at: string
          id: string
          last_triggered_at: string | null
          model: string | null
          name: string
          threshold: number
          type: Database["public"]["Enums"]["alert_type"]
          user_id: string
        }
        Insert: {
          active?: boolean
          channel_email?: boolean
          created_at?: string
          id?: string
          last_triggered_at?: string | null
          model?: string | null
          name: string
          threshold: number
          type: Database["public"]["Enums"]["alert_type"]
          user_id: string
        }
        Update: {
          active?: boolean
          channel_email?: boolean
          created_at?: string
          id?: string
          last_triggered_at?: string | null
          model?: string | null
          name?: string
          threshold?: number
          type?: Database["public"]["Enums"]["alert_type"]
          user_id?: string
        }
        Relationships: []
      }
      cost_events: {
        Row: {
          cost_usd: number
          created_at: string
          endpoint: string | null
          id: string
          input_tokens: number
          model: string
          occurred_at: string
          output_tokens: number
          provider_id: string
          provider_type: Database["public"]["Enums"]["provider_type"]
          requests: number
          user_id: string
        }
        Insert: {
          cost_usd?: number
          created_at?: string
          endpoint?: string | null
          id?: string
          input_tokens?: number
          model: string
          occurred_at: string
          output_tokens?: number
          provider_id: string
          provider_type: Database["public"]["Enums"]["provider_type"]
          requests?: number
          user_id: string
        }
        Update: {
          cost_usd?: number
          created_at?: string
          endpoint?: string | null
          id?: string
          input_tokens?: number
          model?: string
          occurred_at?: string
          output_tokens?: number
          provider_id?: string
          provider_type?: Database["public"]["Enums"]["provider_type"]
          requests?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_events_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_cost_rollups: {
        Row: {
          day: string
          id: string
          model: string
          provider_type: Database["public"]["Enums"]["provider_type"]
          request_count: number
          total_cost_usd: number
          total_input_tokens: number
          total_output_tokens: number
          user_id: string
        }
        Insert: {
          day: string
          id?: string
          model: string
          provider_type: Database["public"]["Enums"]["provider_type"]
          request_count?: number
          total_cost_usd?: number
          total_input_tokens?: number
          total_output_tokens?: number
          user_id: string
        }
        Update: {
          day?: string
          id?: string
          model?: string
          provider_type?: Database["public"]["Enums"]["provider_type"]
          request_count?: number
          total_cost_usd?: number
          total_input_tokens?: number
          total_output_tokens?: number
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          onboarded: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          onboarded?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          onboarded?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          created_at: string
          encrypted_key: string
          id: string
          key_last4: string | null
          label: string | null
          last_error: string | null
          last_synced_at: string | null
          status: Database["public"]["Enums"]["provider_status"]
          type: Database["public"]["Enums"]["provider_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          encrypted_key: string
          id?: string
          key_last4?: string | null
          label?: string | null
          last_error?: string | null
          last_synced_at?: string | null
          status?: Database["public"]["Enums"]["provider_status"]
          type: Database["public"]["Enums"]["provider_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          encrypted_key?: string
          id?: string
          key_last4?: string | null
          label?: string | null
          last_error?: string | null
          last_synced_at?: string | null
          status?: Database["public"]["Enums"]["provider_status"]
          type?: Database["public"]["Enums"]["provider_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          actual_savings_usd: number | null
          code_snippet: string | null
          confidence: number | null
          created_at: string
          current_cost_usd: number | null
          detail: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          generated_from_snapshot: string | null
          id: string
          implemented_at: string | null
          predicted_savings_usd: number | null
          risk: Database["public"]["Enums"]["risk_level"]
          status: Database["public"]["Enums"]["recommendation_status"]
          summary: string
          title: string
          user_id: string
        }
        Insert: {
          actual_savings_usd?: number | null
          code_snippet?: string | null
          confidence?: number | null
          created_at?: string
          current_cost_usd?: number | null
          detail?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          generated_from_snapshot?: string | null
          id?: string
          implemented_at?: string | null
          predicted_savings_usd?: number | null
          risk?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["recommendation_status"]
          summary: string
          title: string
          user_id: string
        }
        Update: {
          actual_savings_usd?: number | null
          code_snippet?: string | null
          confidence?: number | null
          created_at?: string
          current_cost_usd?: number | null
          detail?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          generated_from_snapshot?: string | null
          id?: string
          implemented_at?: string | null
          predicted_savings_usd?: number | null
          risk?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["recommendation_status"]
          summary?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_type: "daily_spend" | "weekly_change" | "model_usage"
      app_role: "admin" | "user"
      difficulty_level: "easy" | "medium" | "hard"
      provider_status: "connecting" | "active" | "error" | "disabled"
      provider_type: "openai" | "anthropic"
      recommendation_status: "pending" | "implemented" | "dismissed"
      risk_level: "low" | "medium" | "high"
      subscription_plan: "free" | "pro"
      subscription_status:
        | "active"
        | "past_due"
        | "canceled"
        | "trialing"
        | "incomplete"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_type: ["daily_spend", "weekly_change", "model_usage"],
      app_role: ["admin", "user"],
      difficulty_level: ["easy", "medium", "hard"],
      provider_status: ["connecting", "active", "error", "disabled"],
      provider_type: ["openai", "anthropic"],
      recommendation_status: ["pending", "implemented", "dismissed"],
      risk_level: ["low", "medium", "high"],
      subscription_plan: ["free", "pro"],
      subscription_status: [
        "active",
        "past_due",
        "canceled",
        "trialing",
        "incomplete",
      ],
    },
  },
} as const
