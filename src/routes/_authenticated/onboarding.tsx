import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { connectProvider, listProviders } from "@/lib/providers.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Activity, ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started · Cost Forensics" },
      { name: "description", content: "Connect your first provider in under a minute." },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["Welcome", "Connect provider", "You're set"] as const;

function Onboarding() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<"openai" | "anthropic">("openai");
  const [apiKey, setApiKey] = useState("");
  const [label, setLabel] = useState("");

  const providersFn = useServerFn(listProviders);
  useQuery({ queryKey: ["providers"], queryFn: () => providersFn({}) });

  const connectFn = useServerFn(connectProvider);
  const connect = useMutation({
    mutationFn: () => connectFn({ data: { type, api_key: apiKey, label: label || undefined } }),
    onSuccess: () => {
      toast.success("Connected. Pulling your usage now.");
      qc.invalidateQueries({ queryKey: ["providers"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setStep(2);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to connect"),
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
        <div className="mb-8 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/25">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg">Cost Forensics</span>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs uppercase tracking-wider text-muted-foreground">
            <span>{STEPS[step]}</span>
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {step === 0 && (
          <Card className="p-8">
            <div className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              <Sparkles className="mr-1 h-3 w-3" /> Welcome
            </div>
            <h1 className="font-display text-4xl leading-tight">Cut your LLM bill by 30–70%.</h1>
            <p className="mt-3 text-muted-foreground">
              In three minutes you'll see every dollar you spend on OpenAI and Anthropic, plus AI-generated optimizations
              tailored to your traffic.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {[
                "Read-only access — we never send prompts or send calls on your behalf.",
                "Your API key is encrypted (AES-GCM) at rest.",
                "Delete your data any time from Settings.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Button onClick={() => setStep(1)}>
                Get started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>
                Skip for now
              </Button>
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card className="p-8">
            <h2 className="font-display text-3xl">Connect a provider</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Paste an API key with usage-read permission. We only make read-only usage/billing calls.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              Encrypted with AES-GCM before storage. Decrypted only inside our backend for your syncs.
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Label>Provider</Label>
                <div className="mt-1.5 flex gap-2">
                  {(["openai", "anthropic"] as const).map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={type === t ? "default" : "outline"}
                      onClick={() => setType(t)}
                      className="capitalize"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="label">Label (optional)</Label>
                <Input
                  id="label"
                  className="mt-1.5"
                  placeholder="Production"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="key">API key</Label>
                <Input
                  id="key"
                  type="password"
                  className="mt-1.5 font-mono"
                  placeholder={type === "openai" ? "sk-..." : "sk-ant-..."}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button onClick={() => connect.mutate()} disabled={apiKey.length < 20 || connect.isPending}>
                {connect.isPending ? "Connecting..." : "Connect & sync"}
              </Button>
              <Button variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>
                I'll do this later
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-8 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="font-display text-3xl">You're set.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We're syncing your usage now. Head to the dashboard to see your spend, then run an AI analysis for
              optimization tips.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={() => navigate({ to: "/dashboard" })}>
                Go to dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/dashboard/recommendations" })}>
                Run AI analysis
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
