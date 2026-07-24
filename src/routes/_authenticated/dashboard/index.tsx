import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, PageHeader } from "@/components/dashboard/AppShell";
import { getDashboard } from "@/lib/providers.functions";
import { listProviders } from "@/lib/providers.functions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, DollarSign, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Page,
});

const COLORS = ["#22d3ee", "#a78bfa", "#f472b6", "#fbbf24", "#34d399", "#f87171", "#60a5fa"];

function Page() {
  const navigate = useNavigate();
  const [days, setDays] = useState(30);
  const load = useServerFn(getDashboard);
  const providersFn = useServerFn(listProviders);

  const providersQ = useQuery({
    queryKey: ["providers"],
    queryFn: () => providersFn({}),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", days],
    queryFn: () => load({ data: { days } }),
    enabled: (providersQ.data?.length ?? 0) > 0,
  });

  const hasProviders = (providersQ.data?.length ?? 0) > 0;

  return (
    <AppShell>
      <PageHeader
        title="Cost dashboard"
        description="Visibility into every dollar spent on LLM APIs."
        action={
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <Button key={d} variant={d === days ? "default" : "outline"} size="sm" onClick={() => setDays(d)}>
                {d}d
              </Button>
            ))}
          </div>
        }
      />

      <div className="px-8 py-6">
        {!providersQ.isLoading && !hasProviders && (
          <Card className="border-primary/30 bg-primary/5 p-8 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-display text-2xl">Connect your first provider</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Add an OpenAI or Anthropic API key to see your last 30 days of spend, model mix, and optimization opportunities.
            </p>
            <Button className="mt-6" onClick={() => navigate({ to: "/dashboard/providers" })}>
              Connect a provider
            </Button>
          </Card>
        )}

        {hasProviders && (isLoading || !data) ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <Skeleton className="h-80" />
          </div>
        ) : hasProviders && data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Stat label="Total spend" value={fmt(data.totals.cost)} icon={DollarSign} delta={data.totals.deltaPct} />
              <Stat label="Requests" value={data.totals.requests.toLocaleString()} icon={Zap} />
              <Stat label="Tokens (in/out)" value={`${short(data.totals.inputTokens)} / ${short(data.totals.outputTokens)}`} icon={TrendingUp} />
              <Stat label="Projected month" value={fmt(data.totals.projected)} icon={AlertTriangle} accent />
            </div>

            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg">Daily spend</h3>
                  <p className="text-xs text-muted-foreground">Cost per day, all providers</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart data={data.series.byDay}>
                    <defs>
                      <linearGradient id="sp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.72 0.19 165)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="oklch(0.72 0.19 165)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 250)" }} tickFormatter={(d) => d.slice(5)} />
                    <YAxis tick={{ fontSize: 11, fill: "oklch(0.7 0.02 250)" }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip contentStyle={{ background: "oklch(0.16 0.02 250)", border: "1px solid oklch(0.28 0.02 250)", borderRadius: 8 }} formatter={(v: number) => fmt(v)} />
                    <Area type="monotone" dataKey="cost" stroke="oklch(0.78 0.19 165)" strokeWidth={2} fill="url(#sp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="font-display text-lg">By model</h3>
                <p className="mb-4 text-xs text-muted-foreground">Where your dollars go</p>
                <div className="h-64">
                  <ResponsiveContainer>
                    <BarChart data={data.series.byModel.slice(0, 8)} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 250)" }} tickFormatter={(v) => `$${v}`} />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "oklch(0.7 0.02 250)" }} />
                      <Tooltip contentStyle={{ background: "oklch(0.16 0.02 250)", border: "1px solid oklch(0.28 0.02 250)", borderRadius: 8 }} formatter={(v: number) => fmt(v)} />
                      <Bar dataKey="cost" fill="oklch(0.72 0.19 165)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-display text-lg">By provider</h3>
                <p className="mb-4 text-xs text-muted-foreground">Provider distribution</p>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={data.series.byProvider} dataKey="cost" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                        {data.series.byProvider.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "oklch(0.16 0.02 250)", border: "1px solid oklch(0.28 0.02 250)", borderRadius: 8 }} formatter={(v: number) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-transparent p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg">Ready to cut costs?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Run our AI forensic analysis on your usage.</p>
                </div>
                <Link to="/dashboard/recommendations">
                  <Button>Get recommendations <ArrowUpRight className="ml-1 h-4 w-4" /></Button>
                </Link>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function Stat({ label, value, icon: Icon, delta, accent }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; delta?: number; accent?: boolean }) {
  return (
    <Card className={`p-5 ${accent ? "border-primary/30 bg-primary/5" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 font-display text-2xl">{value}</div>
      {delta !== undefined && Number.isFinite(delta) && (
        <div className={`mt-1 flex items-center gap-1 text-xs ${delta >= 0 ? "text-destructive" : "text-primary"}`}>
          {delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta).toFixed(1)}% vs previous period
        </div>
      )}
    </Card>
  );
}

function fmt(n: number) { return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function short(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return `${n}`;
}
