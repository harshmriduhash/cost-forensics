import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/dashboard/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateRecommendations, listRecommendations, updateRecommendation } from "@/lib/recommendations.functions";
import { toast } from "sonner";
import { Sparkles, Check, X, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/recommendations")({
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const listFn = useServerFn(listRecommendations);
  const genFn = useServerFn(generateRecommendations);
  const updFn = useServerFn(updateRecommendation);
  const { data, isLoading } = useQuery({ queryKey: ["recs"], queryFn: () => listFn({}) });

  const generate = useMutation({
    mutationFn: () => genFn({}),
    onSuccess: (res) => {
      toast.success(`Generated ${res.count} recommendations`);
      qc.invalidateQueries({ queryKey: ["recs"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const update = useMutation({
    mutationFn: (v: { id: string; status: "implemented" | "dismissed" }) => updFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recs"] }),
  });

  const totalSavings = (data ?? [])
    .filter((r) => r.status === "pending")
    .reduce((s, r) => s + Number(r.predicted_savings_usd ?? 0), 0);

  return (
    <AppShell>
      <PageHeader
        title="Optimization recommendations"
        description="AI-powered analysis of your spend patterns."
        action={
          <Button onClick={() => generate.mutate()} disabled={generate.isPending}>
            <Sparkles className="mr-1 h-4 w-4" />
            {generate.isPending ? "Analyzing..." : "Run analysis"}
          </Button>
        }
      />

      <div className="space-y-6 px-8 py-6">
        {(data?.length ?? 0) > 0 && (
          <Card className="border-primary/30 bg-primary/5 p-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Potential monthly savings</div>
                <div className="font-display text-3xl text-primary">${totalSavings.toFixed(2)}</div>
              </div>
            </div>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40" />)}</div>
        ) : (data?.length ?? 0) === 0 ? (
          <Card className="p-10 text-center">
            <Sparkles className="mx-auto mb-2 h-6 w-6 text-primary" />
            <h3 className="font-display text-xl">No recommendations yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Once you've connected a provider and have usage data, run an analysis to get specific optimization tips for your traffic.
            </p>
            <Button className="mt-4" onClick={() => generate.mutate()} disabled={generate.isPending}>
              {generate.isPending ? "Analyzing..." : "Run analysis"}
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {data!.map((r) => (
              <Card key={r.id} className={`p-6 ${r.status !== "pending" ? "opacity-50" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg">{r.title}</h3>
                      <Badge variant="outline" className="capitalize">{r.difficulty}</Badge>
                      <Badge variant="outline" className={r.risk === "low" ? "border-primary/40 text-primary" : r.risk === "high" ? "border-destructive/40 text-destructive" : ""}>
                        {r.risk} risk
                      </Badge>
                      {r.status !== "pending" && <Badge>{r.status}</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.summary}</p>
                    <p className="mt-3 text-sm text-foreground/80">{r.detail}</p>
                    {r.code_snippet && (
                      <pre className="mt-3 overflow-x-auto rounded-md bg-black/40 p-3 text-xs font-mono ring-1 ring-border/60">
                        <code>{r.code_snippet}</code>
                      </pre>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Est. savings</div>
                    <div className="font-display text-2xl text-primary">${Number(r.predicted_savings_usd ?? 0).toFixed(0)}<span className="text-sm text-muted-foreground">/mo</span></div>
                    <div className="mt-1 text-xs text-muted-foreground">{r.confidence}% confidence</div>
                  </div>
                </div>
                {r.status === "pending" && (
                  <div className="mt-4 flex gap-2 border-t border-border/60 pt-4">
                    <Button size="sm" onClick={() => update.mutate({ id: r.id, status: "implemented" })}>
                      <Check className="mr-1 h-3.5 w-3.5" /> Mark implemented
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => update.mutate({ id: r.id, status: "dismissed" })}>
                      <X className="mr-1 h-3.5 w-3.5" /> Dismiss
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
