import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/dashboard/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlert, deleteAlert, listAlerts, toggleAlert } from "@/lib/account.functions";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/alerts")({
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAlerts);
  const createFn = useServerFn(createAlert);
  const delFn = useServerFn(deleteAlert);
  const togFn = useServerFn(toggleAlert);
  const { data, isLoading } = useQuery({ queryKey: ["alerts"], queryFn: () => listFn({}) });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"daily_spend" | "weekly_change" | "model_usage">("daily_spend");
  const [threshold, setThreshold] = useState("100");

  const create = useMutation({
    mutationFn: () => createFn({ data: { name, type, threshold: Number(threshold), channel_email: true } }),
    onSuccess: () => {
      toast.success("Alert created");
      setOpen(false); setName(""); setThreshold("100");
      qc.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });

  const toggle = useMutation({
    mutationFn: (v: { id: string; active: boolean }) => togFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });

  const typeLabels = {
    daily_spend: "Daily spend exceeds",
    weekly_change: "Weekly change exceeds",
    model_usage: "Model usage exceeds",
  } as const;

  return (
    <AppShell>
      <PageHeader
        title="Alerts"
        description="Get notified when spend crosses your thresholds."
        action={<Button onClick={() => setOpen((v) => !v)}><Plus className="mr-1 h-4 w-4" />New alert</Button>}
      />

      <div className="space-y-6 px-8 py-6">
        {open && (
          <Card className="p-6">
            <h3 className="font-display text-lg">Create alert</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="an">Name</Label>
                <Input id="an" placeholder="Prod spend cap" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                >
                  <option value="daily_spend">Daily spend exceeds ($)</option>
                  <option value="weekly_change">Weekly change exceeds (%)</option>
                  <option value="model_usage">Model usage exceeds ($)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="th">Threshold</Label>
                <Input id="th" type="number" min={1} value={threshold} onChange={(e) => setThreshold(e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => create.mutate()} disabled={!name || !threshold || create.isPending}>Create</Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </Card>
        )}

        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (data?.length ?? 0) === 0 ? (
          <Card className="p-10 text-center">
            <Bell className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No alerts yet. Create one to get notified of spend anomalies.</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {data!.map((a) => (
              <Card key={a.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg">{a.name}</span>
                    <Badge variant="outline">{typeLabels[a.type as keyof typeof typeLabels]}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Threshold: <span className="font-mono">{a.type === "weekly_change" ? `${a.threshold}%` : `$${a.threshold}`}</span>
                    {a.last_triggered_at && <> · Last triggered {new Date(a.last_triggered_at).toLocaleString()}</>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={a.active ?? false} onCheckedChange={(v) => toggle.mutate({ id: a.id, active: v })} />
                  <Button variant="ghost" size="sm" onClick={() => remove.mutate(a.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
