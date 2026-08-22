import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, FastForward, Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge } from "@/components/status";
import { assessment, assessmentSteps } from "@/lib/services/governance-service";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessments/$assessmentId/run")({
  head: () => ({
    meta: [
      { title: "Running Assessment #001 — NGET AI Governance Assurance POC" },
      { name: "description", content: "Simulated seven-step AI assessment pipeline. POC demo mode." },
      { property: "og:title", content: "Running Assessment — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Simulated seven-step AI assessment pipeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RunAssessmentPage,
});

const TOTAL_MS = assessmentSteps.reduce((a, s) => a + s.durationMs, 0);

function RunAssessmentPage() {
  const { assessmentId } = Route.useParams();
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const { markAssessmentComplete } = useDemo();
  const completedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const started = Date.now();
    const t = window.setInterval(() => {
      const e = Date.now() - started;
      setElapsed(e);
      if (e >= TOTAL_MS) {
        window.clearInterval(t);
        setFinished(true);
        if (!completedRef.current) {
          completedRef.current = true;
          markAssessmentComplete();
        }
      }
    }, 50);
    return () => window.clearInterval(t);
  }, [markAssessmentComplete]);

  const skip = () => {
    setElapsed(TOTAL_MS);
    setFinished(true);
    if (!completedRef.current) {
      completedRef.current = true;
      markAssessmentComplete();
    }
  };

  // cumulative boundaries
  let acc = 0;
  const bounds = assessmentSteps.map((s) => {
    const start = acc;
    acc += s.durationMs;
    return { start, end: acc };
  });
  const currentIdx = finished
    ? assessmentSteps.length
    : bounds.findIndex((b) => elapsed < b.end);
  const overall = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));

  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "New Assessment", to: "/assessments/new" },
          { label: `Running ${assessment.label}` },
        ]}
        title={`AI assessment in progress — ${assessment.label}`}
        subtitle={`${assessment.project} · ${assessment.programme} · ${assessment.gate}. Simulated pipeline; all output is mock data.`}
        actions={
          <>
            <DemoBadge />
            {!finished && (
              <button
                onClick={skip}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <FastForward className="size-3.5" /> Skip animation
              </button>
            )}
          </>
        }
      />

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {finished
              ? "Assessment complete — results ready for human review"
              : `Step ${Math.min(currentIdx + 1, 7)} of 7`}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{overall}%</span>
        </div>
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-100"
            style={{ width: `${overall}%` }}
          />
        </div>

        <ol className="space-y-3">
          {assessmentSteps.map((s, i) => {
            const b = bounds[i];
            if (!b) return null;
            const done = finished || elapsed >= b.end;
            const active = !finished && !done && elapsed >= b.start;
            return (
              <li
                key={s.key}
                className={cn(
                  "rounded-lg border p-4 transition-all",
                  done
                    ? "border-success/30 bg-success/5"
                    : active
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-border bg-card opacity-60",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      done
                        ? "bg-success text-success-foreground"
                        : active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? (
                      <Check className="size-4" />
                    ) : active ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      s.n
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.description}</div>
                  </div>
                  {done && (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {(s.durationMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
                {(done || active) && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pl-10">
                    {s.stats.map((stat, si) => {
                      const reveal = done || elapsed > b.start + (si + 1) * 350;
                      return (
                        <span
                          key={stat}
                          className={cn(
                            "rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-opacity",
                            reveal ? "opacity-100" : "opacity-0",
                          )}
                        >
                          {stat}
                        </span>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <button
            onClick={() => navigate({ to: "/assessments/new" })}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Back to wizard
          </button>
          {finished ? (
            <Link
              to="/assessments/$assessmentId"
              params={{ assessmentId }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="size-4" /> View assessment results
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground">
              Simulated AI — no documents are actually processed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
