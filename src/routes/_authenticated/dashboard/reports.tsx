import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/dashboard/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard, getRecentCalls } from "@/lib/providers.functions";
import { listRecommendations } from "@/lib/recommendations.functions";
import { FileDown, FileText, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/reports")({
  head: () => ({
    meta: [
      { title: "Cost reports · Cost Forensics" },
      { name: "description", content: "Export professional PDF and CSV cost reports for your team." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const [days, setDays] = useState(30);
  const dashFn = useServerFn(getDashboard);
  const callsFn = useServerFn(getRecentCalls);
  const recsFn = useServerFn(listRecommendations);

  const dash = useQuery({ queryKey: ["dashboard", days], queryFn: () => dashFn({ data: { days } }) });
  const calls = useQuery({ queryKey: ["calls", days], queryFn: () => callsFn({ data: { limit: 500 } }) });
  const recs = useQuery({ queryKey: ["recs"], queryFn: () => recsFn({}) });

  const [busy, setBusy] = useState(false);

  async function exportPdf() {
    if (!dash.data) return;
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const now = new Date();

      // Cover
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, W, 120, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("LLM Cost Forensics", 40, 55);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Cost report — last ${days} days`, 40, 78);
      doc.text(`Generated ${now.toLocaleString()}`, 40, 96);

      doc.setTextColor(20, 20, 20);
      let y = 160;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Executive summary", 40, y);
      y += 10;

      const t = dash.data.totals;
      autoTable(doc, {
        startY: y + 6,
        head: [["Metric", "Value"]],
        body: [
          ["Total spend", fmt(t.cost)],
          ["Previous period", fmt(t.prevCost)],
          ["Change vs previous", `${t.deltaPct >= 0 ? "+" : ""}${t.deltaPct.toFixed(1)}%`],
          ["Requests", t.requests.toLocaleString()],
          ["Input tokens", t.inputTokens.toLocaleString()],
          ["Output tokens", t.outputTokens.toLocaleString()],
          ["Projected 30-day spend", fmt(t.projected)],
        ],
        theme: "grid",
        headStyles: { fillColor: [30, 41, 59] },
        margin: { left: 40, right: 40 },
      });

      // Spend by model
      autoTable(doc, {
        head: [["Model", "Spend (USD)"]],
        body: dash.data.series.byModel.slice(0, 15).map((m) => [m.name, fmt(m.cost)]),
        theme: "striped",
        headStyles: { fillColor: [30, 41, 59] },
        margin: { left: 40, right: 40 },
        didDrawPage: (h) => {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text("Spend by model", 40, h.settings.startY ? (h.settings.startY as number) - 10 : 40);
        },
      });

      // Recommendations
      if ((recs.data ?? []).length) {
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Optimization recommendations", 40, 50);
        autoTable(doc, {
          startY: 66,
          head: [["Title", "Savings/mo", "Confidence", "Status"]],
          body: (recs.data ?? []).map((r) => [
            r.title,
            fmt(Number(r.predicted_savings_usd ?? 0)),
            `${r.confidence}%`,
            r.status,
          ]),
          theme: "grid",
          headStyles: { fillColor: [30, 41, 59] },
          margin: { left: 40, right: 40 },
          columnStyles: { 0: { cellWidth: 260 } },
        });
      }

      // Recent calls
      if ((calls.data ?? []).length) {
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Recent activity", 40, 50);
        autoTable(doc, {
          startY: 66,
          head: [["When", "Provider", "Model", "In", "Out", "Cost"]],
          body: (calls.data ?? []).slice(0, 60).map((c) => [
            new Date(c.occurred_at).toLocaleString(),
            c.provider_type,
            c.model,
            (c.input_tokens ?? 0).toLocaleString(),
            (c.output_tokens ?? 0).toLocaleString(),
            fmt(Number(c.cost_usd)),
          ]),
          theme: "striped",
          headStyles: { fillColor: [30, 41, 59] },
          margin: { left: 40, right: 40 },
          styles: { fontSize: 9 },
        });
      }

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(`Cost Forensics · Page ${i} of ${pageCount}`, 40, doc.internal.pageSize.getHeight() - 20);
      }

      doc.save(`cost-forensics-${days}d-${now.toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF exported");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to export");
    } finally {
      setBusy(false);
    }
  }

  function exportCsv() {
    if (!calls.data) return;
    const header = ["occurred_at", "provider", "model", "endpoint", "input_tokens", "output_tokens", "requests", "cost_usd"];
    const rows = calls.data.map((c) => [
      c.occurred_at,
      c.provider_type,
      c.model,
      c.endpoint ?? "",
      c.input_tokens ?? 0,
      c.output_tokens ?? 0,
      c.requests ?? 1,
      c.cost_usd,
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cost-forensics-events-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  }

  const ready = !dash.isLoading && !calls.isLoading;
  const hasData = (dash.data?.totals?.requests ?? 0) > 0;

  return (
    <AppShell>
      <PageHeader
        title="Cost reports"
        description="Board-ready PDF reports and raw CSV exports for finance & engineering."
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

      <div className="grid gap-6 px-8 py-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/15 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg">PDF report</h3>
              <p className="text-xs text-muted-foreground">Cover, KPIs, spend by model, recommendations, activity.</p>
            </div>
          </div>
          {!ready ? (
            <Skeleton className="h-10" />
          ) : (
            <Button onClick={exportPdf} disabled={busy || !hasData} className="w-full">
              <FileDown className="mr-2 h-4 w-4" />
              {busy ? "Building PDF..." : `Download ${days}-day PDF`}
            </Button>
          )}
          {!hasData && ready && (
            <p className="mt-3 text-xs text-muted-foreground">No data in this range. Connect a provider first.</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/15 text-primary">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg">Raw CSV</h3>
              <p className="text-xs text-muted-foreground">Per-call events for BI tools, spreadsheets, and audits.</p>
            </div>
          </div>
          {!ready ? (
            <Skeleton className="h-10" />
          ) : (
            <Button onClick={exportCsv} disabled={!hasData} variant="outline" className="w-full">
              <FileDown className="mr-2 h-4 w-4" /> Download events CSV
            </Button>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

function fmt(n: number) {
  return `$${Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
