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
import {
  deleteAccount,
  generateApiKey,
  getMe,
  listApiKeys,
  revokeApiKey,
  testSlackWebhook,
  updateProfile,
} from "@/lib/account.functions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Key, Plus, Send, Sparkles, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const meFn = useServerFn(getMe);
  const updFn = useServerFn(updateProfile);
  const delFn = useServerFn(deleteAccount);

  const testSlackFn = useServerFn(testSlackWebhook);
  const listKeysFn = useServerFn(listApiKeys);
  const genKeyFn = useServerFn(generateApiKey);
  const revokeKeyFn = useServerFn(revokeApiKey);

  const { data, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => meFn({}) });
  const { data: apiKeys, isLoading: keysLoading } = useQuery({ queryKey: ["api-keys"], queryFn: () => listKeysFn({}) });

  const [name, setName] = useState("");
  const [slackUrl, setSlackUrl] = useState("");

  const [keyName, setKeyName] = useState("");
  const [createdRawKey, setCreatedRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data?.profile?.full_name) setName(data.profile.full_name);
    if (data?.profile?.slack_webhook_url) setSlackUrl(data.profile.slack_webhook_url);
  }, [data]);

  const saveProfile = useMutation({
    mutationFn: () => updFn({ data: { full_name: name, slack_webhook_url: slackUrl || null } }),
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const testSlack = useMutation({
    mutationFn: () => testSlackFn({ data: { url: slackUrl } }),
    onSuccess: () => toast.success("Slack test notification sent successfully! Check your channel."),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Slack test failed"),
  });

  const createKey = useMutation({
    mutationFn: () => genKeyFn({ data: { name: keyName || "Developer Key" } }),
    onSuccess: (res) => {
      toast.success("API key generated");
      setCreatedRawKey(res.rawKey);
      setKeyName("");
      qc.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to generate key"),
  });

  const deleteKey = useMutation({
    mutationFn: (id: string) => revokeKeyFn({ data: { id } }),
    onSuccess: () => {
      toast.success("API key revoked");
      qc.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to revoke key"),
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const plan = data?.subscription?.plan ?? "free";
  const status = data?.subscription?.status ?? "active";

  const deleteCurrentAccount = useMutation({
    mutationFn: () => delFn({}),
    onSuccess: () => {
      toast.success("Account deleted");
      window.location.href = "/";
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Unable to delete account"),
  });

  return (
    <AppShell>
      <PageHeader title="Settings" description="Manage your account, integrations, and API keys." />
      <div className="grid gap-6 px-8 py-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="p-6">
          <h3 className="font-display text-lg">Profile</h3>
          {isLoading ? (
            <Skeleton className="mt-4 h-24" />
          ) : (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="fn">Full name</Label>
                <Input id="fn" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
              <Button onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending}>
                Save profile
              </Button>
            </div>
          )}
        </Card>

        {/* Subscription Card */}
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
                <Button className="mt-3" size="sm">
                  View plans
                </Button>
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Billing management is being prepared for the next beta release. You can still use the product and share feedback in the meantime.
            </p>
          )}
        </Card>

        {/* Slack Integration Card */}
        <Card className="p-6 md:col-span-2">
          <h3 className="font-display text-lg">Slack Integration</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Receive cost alerts and weekly digests directly in your team's Slack channel.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <Label htmlFor="slack">Slack Webhook URL</Label>
              <Input
                id="slack"
                placeholder="https://hooks.slack.com/services/T000/B000/XXXX"
                value={slackUrl}
                onChange={(e) => setSlackUrl(e.target.value)}
                className="mt-1.5 font-mono text-xs"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending}>
                Save webhook
              </Button>
              {slackUrl && (
                <Button
                  variant="outline"
                  onClick={() => testSlack.mutate()}
                  disabled={testSlack.isPending}
                >
                  <Send className="mr-1 h-3.5 w-3.5" /> Test
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Developer API Keys Card */}
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg">Developer API Keys</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Use API keys to authenticate requests to the LLM Cost Forensics API (`/api/v1/costs`).
              </p>
            </div>
          </div>

          {/* Key Generation Section */}
          <div className="mt-4 rounded-md border p-4 bg-card/50">
            <Label htmlFor="kn">Generate new API key</Label>
            <div className="mt-2 flex gap-2 max-w-md">
              <Input
                id="kn"
                placeholder="e.g. Production Backend"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
              <Button onClick={() => createKey.mutate()} disabled={createKey.isPending}>
                <Plus className="mr-1 h-4 w-4" /> Generate
              </Button>
            </div>

            {createdRawKey && (
              <div className="mt-4 rounded-md border border-primary/40 bg-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">Your new API Key (copy it now, it won't be shown again!):</span>
                  <Button size="sm" variant="ghost" onClick={() => handleCopy(createdRawKey)}>
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-primary" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <code className="mt-2 block rounded bg-background p-2 font-mono text-xs text-foreground break-all select-all">
                  {createdRawKey}
                </code>
              </div>
            )}
          </div>

          {/* Active Keys List */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Active API Keys</h4>
            {keysLoading ? (
              <Skeleton className="h-20" />
            ) : (apiKeys?.length ?? 0) === 0 ? (
              <p className="text-xs text-muted-foreground italic">No active API keys created yet.</p>
            ) : (
              <div className="space-y-2">
                {apiKeys!.map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center justify-between rounded-md border p-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Key className="h-3.5 w-3.5 text-primary" />
                        <span className="font-medium">{k.name}</span>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">{k.key_prefix}...</code>
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        Created {new Date(k.created_at).toLocaleDateString()}
                        {k.last_used_at && <> · Last used {new Date(k.last_used_at).toLocaleTimeString()}</>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteKey.mutate(k.id)}
                      disabled={deleteKey.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive/30 md:col-span-2">
          <h3 className="font-display text-lg text-destructive">Danger zone</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Permanently delete your account and all associated cost history.
          </p>
          <Button
            variant="destructive"
            className="mt-4"
            onClick={() => {
              if (window.confirm("This will permanently delete your account and data. Continue?")) {
                deleteCurrentAccount.mutate();
              }
            }}
            disabled={deleteCurrentAccount.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteCurrentAccount.isPending ? "Deleting account..." : "Delete account"}
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
