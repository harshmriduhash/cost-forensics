import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/dashboard/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateProfile } from "@/lib/account.functions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const meFn = useServerFn(getMe);
  const updFn = useServerFn(updateProfile);
  const { data, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => meFn({}) });
  const [name, setName] = useState("");
  useEffect(() => { if (data?.profile?.full_name) setName(data.profile.full_name); }, [data]);

  const save = useMutation({
    mutationFn: () => updFn({ data: { full_name: name } }),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const plan = data?.subscription?.plan ?? "free";
  const status = data?.subscription?.status ?? "active";

  return (
    <AppShell>
      <PageHeader title="Settings" description="Manage your account and subscription." />
      <div className="grid gap-6 px-8 py-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-lg">Profile</h3>
          {isLoading ? <Skeleton className="mt-4 h-24" /> : (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="fn">Full name</Label>
                <Input id="fn" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
              <Button onClick={() => save.mutate()} disabled={save.isPending}>Save</Button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">Subscription</h3>
            <Badge className="capitalize">{plan}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Status: {status}</p>
          {plan === "free" ? (
            <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 font-medium">
                <Sparkles className="h-4 w-4 text-primary" /> Upgrade to Pro
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Unlimited providers, unlimited alerts, weekly AI analysis, Slack integration.
              </p>
              <Link to="/pricing">
                <Button className="mt-3" size="sm">View plans</Button>
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Manage billing from the customer portal (coming soon).
            </p>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
