import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/dashboard/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteRecommendation,
  editRecommendation,
  getRecommendation,
} from "@/lib/recommendations-crud.functions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, Save, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/recommendations/$id")({
  head: () => ({
    meta: [
      { title: "Recommendation · Cost Forensics" },
      { name: "description", content: "Review, edit, and track a cost optimization recommendation." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getFn = useServerFn(getRecommendation);
  const editFn = useServerFn(editRecommendation);
  const delFn = useServerFn(deleteRecommendation);

  const { data, isLoading } = useQuery({
    queryKey: ["rec", id],
    queryFn: () => getFn({ data: { id } }),
  });

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [snippet, setSnippet] = useState("");
  const [notes, setNotes] = useState("");
  const [actual, setActual] = useState<string>("");

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? "");
    setSummary(data.summary ?? "");
    setDetail(data.detail ?? "");
    setSnippet(data.code_snippet ?? "");
    setNotes(data.notes ?? "");
    setActual(data.actual_savings_usd != null ? String(data.actual_savings_usd) : "");
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      editFn({
        data: {
          id,
          title,
          summary,
          detail: detail || null,
          code_snippet: snippet || null,
          notes: notes || null,
          actual_savings_usd: actual ? Number(actual) : null,
        },
      }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["rec", id] });
      qc.invalidateQueries({ queryKey: ["recs"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const setStatus = useMutation({
    mutationFn: (status: "pending" | "implemented" | "dismissed") =>
      editFn({ data: { id, status } }),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["rec", id] });
      qc.invalidateQueries({ queryKey: ["recs"] });
    },
  });

  const remove = useMutation({
    mutationFn: () => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["recs"] });
      navigate({ to: "/dashboard/recommendations" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <AppShell>
      <PageHeader
        title={data?.title ?? "Recommendation"}
        description="Edit, add notes, track actual savings, or archive."
        action={
          <Link to="/dashboard/recommendations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-4xl space-y-6 px-8 py-6">
        {isLoading || !data ? (
          <Skeleton className="h-96" />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="capitalize">{data.status}</Badge>
              <Badge variant="outline">Difficulty: {data.difficulty}</Badge>
              <Badge variant="outline">Risk: {data.risk}</Badge>
              <Badge variant="outline">{data.confidence}% confidence</Badge>
              <span className="ml-auto text-sm text-muted-foreground">
                Est. savings{" "}
                <span className="font-display text-lg text-primary">
                  ${Number(data.predicted_savings_usd ?? 0).toFixed(0)}
                </span>{" "}
                / mo
              </span>
            </div>

            <Card className="space-y-4 p-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Input id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="detail">Detail</Label>
                <Textarea
                  id="detail"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={6}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="snippet">Code snippet</Label>
                <Textarea
                  id="snippet"
                  value={snippet}
                  onChange={(e) => setSnippet(e.target.value)}
                  rows={6}
                  className="mt-1.5 font-mono text-xs"
                />
              </div>
              <div>
                <Label htmlFor="notes">Your notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-1.5"
                  placeholder="Tracking ticket, owner, next steps..."
                />
              </div>
              <div>
                <Label htmlFor="actual">Actual savings realized (USD / mo)</Label>
                <Input
                  id="actual"
                  type="number"
                  step="0.01"
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  className="mt-1.5"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => save.mutate()} disabled={save.isPending}>
                  <Save className="mr-1 h-4 w-4" /> {save.isPending ? "Saving..." : "Save changes"}
                </Button>
                {data.status !== "implemented" && (
                  <Button variant="outline" onClick={() => setStatus.mutate("implemented")}>
                    <Check className="mr-1 h-4 w-4" /> Mark implemented
                  </Button>
                )}
                {data.status !== "dismissed" && (
                  <Button variant="outline" onClick={() => setStatus.mutate("dismissed")}>
                    <X className="mr-1 h-4 w-4" /> Dismiss
                  </Button>
                )}
                {data.status !== "pending" && (
                  <Button variant="ghost" onClick={() => setStatus.mutate("pending")}>
                    Reopen
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="ml-auto text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm("Delete this recommendation? This cannot be undone.")) remove.mutate();
                  }}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
