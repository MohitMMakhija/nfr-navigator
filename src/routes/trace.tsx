import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, History } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { assessment, assessmentSteps, assessmentTrace } from "@/lib/services/governance-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trace")({
  head: () => ({
    meta: [
      { title: "Assessment Trace — NGET AI Governance Assurance POC" },
      { name: "description", content: "Step-by-step trace of simulated Assessment #001 with timings and token counts. POC demo mode." },
      { property: "og:title", content: "Assessment Trace — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Step-by-step trace of simulated Assessment #001." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TracePage,
});

function TracePage() {
  const totalIn = assessmentTrace.reduce((a, t) => a + t.tokensIn, 0);
  const totalOut = assessmentTrace.reduce((a, t) => a + t.tokensOut, 0);

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Assessment #001", to: "/assessments/A-001" },
          { label: "Trace" },
        ]}
        title="Assessment trace"
        subtitle={`${assessment.label} · ${assessment.model} · ${assessment.startedAt} → ${assessment.completedAt}. All entries are mock data.`}
        actions={
          <button
            onClick={() =>
              toast.info("POC demo mode", { description: "Trace export is illustrative only." })
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Download className="size-4" /> Export trace
          </button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Pipeline steps", "7"],
          ["Trace events", String(assessmentTrace.length)],
          ["Tokens in (mock)", totalIn.toLocaleString()],
          ["Tokens out (mock)", totalOut.toLocaleString()],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xl font-bold text-foreground">{value}</div>
            <div className="text-[11px] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {assessmentSteps.map((step) => {
          const events = assessmentTrace.filter((t) => t.step === step.n);
          return (
            <div key={step.key} className="border-b border-border last:border-b-0">
              <div className="flex items-center gap-3 bg-muted/40 px-4 py-2.5">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-semibold text-primary-foreground">
                  {step.n}
                </span>
                <span className="text-sm font-semibold text-foreground">{step.name}</span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                  {(step.durationMs / 1000).toFixed(1)}s
                </span>
              </div>
              <ul className="divide-y divide-border/60">
                {events.map((e, i) => (
                  <li key={i} className="flex flex-wrap items-baseline gap-x-3 px-4 py-2 pl-13 text-xs">
                    <span className="font-mono text-muted-foreground">{e.at}</span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                        e.event.includes("contradiction")
                          ? "bg-destructive/10 text-destructive"
                          : e.event.includes("complete") || e.event.includes("verified")
                            ? "bg-success/10 text-success"
                            : "bg-info/10 text-info",
                      )}
                    >
                      {e.event}
                    </span>
                    <span className="min-w-0 flex-1 text-foreground">{e.detail}</span>
                    {(e.tokensIn > 0 || e.tokensOut > 0) && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {e.tokensIn.toLocaleString()}→{e.tokensOut.toLocaleString()} tok
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <History className="size-3.5" />
        Decision log: RSK-004 raised from EV-004 + BSR-SES-01 gap · RSK-001 raised from EV-002 +
        BSR-ENC-01 gap · all decisions reviewable in the{" "}
        <Link to="/approvals" className="text-primary hover:underline">audit trail</Link>.
      </p>
    </div>
  );
}
