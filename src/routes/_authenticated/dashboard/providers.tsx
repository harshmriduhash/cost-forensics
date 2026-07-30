import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/dashboard/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectProvider, deleteProvider, listProviders, resyncProvider } from "@/lib/providers.functions";
import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw, Trash2, Plus, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard/providers")({
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const listFn = useServerFn(listProviders);
  const connectFn = useServerFn(connectProvider);
  const delFn = useServerFn(deleteProvider);
  const syncFn = useServerFn(resyncProvider);

  const { data, isLoading } = useQuery({ queryKey: ["providers"], queryFn: () => listFn({}) });

  const [type, setType] = useState<"openai" | "anthropic">("openai");
  const [apiKey, setApiKey] = useState("");
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);

  const connect = useMutation({
    mutationFn: () => connectFn({ data: { type, api_key: apiKey, label: label || undefined } }),
    onSuccess: () => {
      toast.success("Provider connected — pulling your usage now.");
      setApiKey(""); setLabel(""); setOpen(false);
      qc.invalidateQueries({ queryKey: ["providers"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to connect"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Provider removed");
      qc.invalidateQueries({ queryKey: ["providers"] });
    },
  });

  const sync = useMutation({
    mutationFn: (id: string) => syncFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Synced");
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Sync failed"),
  });

  return (
    <AppShell>
      <PageHeader
        title="Providers"
        description="Connect your LLM API keys to track spend."
        action={<Button onClick={() => setOpen((v) => !v)}><Plus className="mr-1 h-4 w-4" />Connect provider</Button>}
      />

      <div className="space-y-6 px-8 py-6">
        {open && (
          <Card className="p-6">
            <h3 className="font-display text-lg">Connect a new provider</h3>
            <div className="mt-4 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              Your API key is encrypted with AES-GCM before storage. It never leaves our backend and we only make read-only usage calls.
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <Label>Provider</Label>
                <div className="mt-1.5 flex gap-2">
                  {(["openai", "anthropic"] as const).map((t) => (
                    <Button key={t} type="button" variant={type === t ? "default" : "outline"} onClick={() => setType(t)} className="capitalize">
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="label">Label (optional)</Label>
                <Input id="label" placeholder="Production" value={label} onChange={(e) => setLabel(e.target.value)} className="mt-1.5" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="key">API key</Label>
                <Input id="key" type="password" placeholder={type === "openai" ? "sk-..." : "sk-ant-..."} value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="mt-1.5 font-mono" />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  For OpenAI, use an <em>admin</em> key for full usage history. Standard keys still work; we'll estimate from a baseline.
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button onClick={() => connect.mutate()} disabled={apiKey.length < 20 || connect.isPending}>
                {connect.isPending ? "Connecting..." : "Connect & sync"}
              </Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </Card>
        )}

        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (data?.length ?? 0) === 0 ? (
          <Card className="p-10 text-center">
            <ShieldCheck className="mx-auto mb-3 h-6 w-6 text-primary" />
            <h3 className="font-display text-xl">Connect your first provider</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Add an OpenAI or Anthropic API key to start seeing spend, model mix, and saving opportunities in your dashboard.
            </p>
            <Button className="mt-4" onClick={() => setOpen(true)}>Connect provider</Button>
          </Card>
        ) : (
          <div className="grid gap-3">
            {data!.map((p) => (
              <Card key={p.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg capitalize">{p.label ?? p.type}</span>
                    <Badge variant="outline" className="uppercase text-xs">{p.type}</Badge>
                    <Badge className={p.status === "active" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}>
                      {p.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Key: <span className="font-mono">••••{p.key_last4}</span>
                    {p.last_synced_at && <> · Last synced {new Date(p.last_synced_at).toLocaleString()}</>}
                  </div>
                  {p.last_error && <div className="mt-1 text-xs text-destructive">{p.last_error}</div>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => sync.mutate(p.id)} disabled={sync.isPending}>
                    <RefreshCw className={`mr-1 h-3.5 w-3.5 ${sync.isPending ? "animate-spin" : ""}`} /> Resync
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove.mutate(p.id)}>
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
