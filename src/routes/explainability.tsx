import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, Scale, ShieldQuestion } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge } from "@/components/status";
import { artefacts, assessment, assessmentSteps } from "@/lib/services/governance-service";

export const Route = createFileRoute("/explainability")({
  head: () => ({
    meta: [
      { title: "AI Explainability — NGET AI Governance Assurance POC" },
      { name: "description", content: "How the simulated AI assessment works: pipeline, scoring model, confidence and limitations. POC demo mode." },
      { property: "og:title", content: "AI Explainability — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "How the simulated AI assessment works: pipeline, scoring, confidence, limitations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExplainabilityPage,
});

function ExplainabilityPage() {
  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Assessment #001", to: "/assessments/A-001" },
          { label: "AI Explainability" },
        ]}
        title="AI explainability"
        subtitle="How Assessment #001 reached its conclusions — pipeline, scoring model, confidence calibration and stated limitations."
        actions={<DemoBadge />}
      />

      <div className="space-y-5">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <BrainCircuit className="size-4 text-info" /> Model & pipeline
          </h2>
          <div className="mb-4 rounded-lg bg-muted/50 p-3 font-mono text-xs text-muted-foreground">
            {assessment.model} · retrieval-grounded assessment over 6 artefacts · temperature 0.1 ·
            no training on project data
          </div>
          <ol className="space-y-2">
            {assessmentSteps.map((s) => (
              <li key={s.key} className="flex items-start gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] font-semibold text-primary">
                  {s.n}
                </span>
                <div>
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className="text-muted-foreground"> — {s.description}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Scale className="size-4 text-primary" /> Scoring model
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium text-foreground">Compliance (RAG)</dt>
                <dd className="text-muted-foreground">
                  Each requirement: compliant = 1, partial = 0.5, gap = 0. Framework and overall
                  scores are the weighted mean × 100. Green ≥ 80%, amber 60–79%, red &lt; 60%.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Risk</dt>
                <dd className="text-muted-foreground">
                  Likelihood (1–5) × impact (1–5). Red ≥ 15, amber 8–14, green ≤ 7. Derived from
                  gap criticality, exposure breadth and evidence strength.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Confidence</dt>
                <dd className="text-muted-foreground">
                  0–100, calibrated from evidence recency, directness (explicit statement vs
                  inference) and the number of corroborating artefacts. Below 70 the call is routed
                  for human review by default.
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldQuestion className="size-4 text-warning" /> Limitations (stated)
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>All AI output in this POC is simulated mock data — no documents are parsed.</li>
              <li>Scores reflect submitted artefacts only; un submitted evidence is invisible.</li>
              <li>Contradiction detection depends on artefact quality and section structure.</li>
              <li>Confidence is a calibration aid, not a probability of correctness.</li>
              <li>Every AI call requires human approval before it takes effect.</li>
            </ul>
            <div className="mt-4 border-t border-border pt-3">
              <h3 className="text-xs font-semibold text-foreground">Input artefacts</h3>
              <ul className="mt-1.5 space-y-1">
                {artefacts.map((a) => (
                  <li key={a.id} className="font-mono text-[11px] text-muted-foreground">
                    {a.name} · sha {a.sha}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/trace"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View the full assessment trace <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/evidence"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Browse cited evidence
          </Link>
        </div>
      </div>
    </div>
  );
}
