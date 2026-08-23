import { createFileRoute, Link } from "@tanstack/react-router";
import { ListChecks, Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge, SeverityBadge, StatusBadge, VerdictBadge } from "@/components/status";
import { resultForAssessment } from "@/lib/mock/profiles";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/findings")({
  head: () => ({
    meta: [
      { title: "Findings & Recommendations — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content: "Simulated governance findings and recommended actions for a selected assessment. POC demo mode.",
      },
      { property: "og:title", content: "Findings & Recommendations — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Simulated findings and recommended actions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FindingsPage,
});

function FindingsPage() {
  const { assessments, hydrated } = useDemo();
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const assessment =
    assessments.find((a) => a.ref === selectedRef) ?? assessments[assessments.length - 1];

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        title="Findings & Recommendations"
        subtitle="Prioritised findings from a simulated governance assessment, each with a recommended action."
        actions={<DemoBadge />}
      />

      {!hydrated ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !assessment ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-card px-5 py-14 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/5">
            <ListChecks className="size-5 text-primary" />
          </span>
          <p className="mt-3 text-sm font-semibold text-foreground">No findings yet</p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Findings appear once a governance assessment has been run. Create an
            assessment to see simulated findings and recommendations here.
          </p>
          <Link
            to="/assessments/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> New Assessment
          </Link>
        </div>
      ) : (
        (() => {
          const result = resultForAssessment(assessment);
          return (
            <>
              <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
                <label
                  htmlFor="assessment-select"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Assessment
                </label>
                <select
                  id="assessment-select"
                  value={assessment.ref}
                  onChange={(e) => setSelectedRef(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                >
                  {[...assessments].reverse().map((a) => (
                    <option key={a.ref} value={a.ref}>
                      {a.ref} — {a.projectName}
                      {a.isPocDemo ? " (POC Demo)" : ""}
                    </option>
                  ))}
                </select>
                <StatusBadge status={assessment.status} />
                <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary uppercase">
                  AI assessment · POC simulation
                </span>
                <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                  Overall
                  <span className="font-mono font-semibold text-foreground">
                    {result.overall}%
                  </span>
                  <VerdictBadge verdict={result.verdict} category={result.category} />
                </span>
              </div>

              <div className="mb-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-center">
                  <div className="text-2xl font-bold text-success">{result.compliant}</div>
                  <div className="text-xs text-muted-foreground">Meets expectations</div>
                </div>
                <div className="rounded-xl border border-warning/40 bg-warning/15 p-4 text-center">
                  <div className="text-2xl font-bold text-warning-foreground">
                    {result.partial}
                  </div>
                  <div className="text-xs text-muted-foreground">Needs attention</div>
                </div>
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center">
                  <div className="text-2xl font-bold text-destructive">{result.gaps}</div>
                  <div className="text-xs text-muted-foreground">Gap identified</div>
                </div>
              </div>

              <ul className="space-y-3">
                {result.findings.map((f) => (
                  <li key={f.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-muted-foreground">
                        {f.id}
                      </span>
                      <SeverityBadge severity={f.severity} />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {f.policyRef}
                      </span>
                      <span className="text-sm font-medium text-foreground">{f.title}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {f.detail}
                    </p>
                    <p className="mt-2 rounded-md bg-primary/5 px-3 py-2 text-xs text-foreground">
                      <span className="font-semibold">Recommended action: </span>
                      {f.recommendation}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-muted-foreground">
                Simulated output for assessment{" "}
                <Link
                  to="/assessments/$assessmentId"
                  params={{ assessmentId: assessment.ref }}
                  className="font-medium text-primary hover:underline"
                >
                  {assessment.ref}
                </Link>{" "}
                — illustrative only, no real AI analysis performed.
              </p>
            </>
          );
        })()
      )}
    </div>
  );
}
