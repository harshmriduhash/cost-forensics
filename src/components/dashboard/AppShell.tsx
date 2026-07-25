import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Activity, BarChart3, Bell, FileText, Lightbulb, Plug, Settings, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/dashboard/providers", label: "Providers", icon: Plug },
  { to: "/dashboard/recommendations", label: "Recommendations", icon: Lightbulb },
  { to: "/dashboard/reports", label: "Reports", icon: FileText },
  { to: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="sticky top-0 h-screen border-r border-border bg-card/40 backdrop-blur">
        <div className="flex h-full flex-col p-4">
          <Link to="/" className="mb-8 flex items-center gap-2 px-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/25">
              <Activity className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg">Cost Forensics</span>
          </Link>
          <nav className="space-y-0.5">
            {items.map((it) => {
              const active = path === it.to || (it.to !== "/dashboard" && path.startsWith(it.to));
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                    active && "bg-accent text-foreground",
                  )}
                >
                  <it.icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3">
            <Link to="/pricing" className="block rounded-md border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground hover:bg-primary/10">
              <div className="mb-1 flex items-center gap-1.5 font-medium text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Upgrade to Pro
              </div>
              Unlimited providers, alerts & AI recs.
            </Link>
            <div className="rounded-md border border-border/60 p-3">
              <div className="mb-2 truncate text-xs text-muted-foreground">{email}</div>
              <Button variant="ghost" size="sm" className="w-full justify-start px-2" onClick={signOut}>
                <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
              </Button>
            </div>
          </div>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}

export function PageHeader({
  title, description, action,
}: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 px-8 py-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
