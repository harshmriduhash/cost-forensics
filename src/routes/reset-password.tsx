import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — LLM Cost Forensics" },
      { name: "description", content: "Set a new password for your Cost Forensics account." },
      { property: "og:title", content: "Reset password — LLM Cost Forensics" },
      { property: "og:description", content: "Set a new password for your Cost Forensics account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase drops the recovery session automatically when the recovery link
    // is opened; just wait a tick.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="surface-panel w-full p-8">
        <h1 className="font-display text-3xl">Set new password</h1>
        {!ready ? (
          <p className="mt-4 text-sm text-muted-foreground">
            This link looks invalid or expired. Request a new one from the sign-in page.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="pw">New password</Label>
              <Input id="pw" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              Update password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
