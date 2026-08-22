import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  FileText,
  Flag,
  Grid3x3,
  History,
  ListChecks,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  ConfidenceMeter,
  DemoBadge,
  RagBadge,
  RagStatusBadge,
  RiskScoreChip,
} from "@/components/status";
import {
  assessment,
  frameworks,
  frameworkStats,
  overallCompliance,
  redRisks,
  requirements,
  riskScore,
  statusCounts,
} from "@/lib/services/governance-service";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/assessments/$assessmentId")({
  head: () => ({
    meta: [
      { title: "Assessment #001 Results — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content:
          "Results of simulated AI Assessment #001: 72% weighted compliance, 94 requirements, 18 risks with 8 red. POC demo mode.",
      },
      { property: "og:title", content: "Assessment #001 Results — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "72% weighted compliance, 94 requirements, 18 risks with 8 red." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssessmentResultsPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl py-20 text-center">
      <h1 className="text-xl font-semibold text-foreground">Assessment not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Only Assessment #001 exists in this POC demo.
      </p>
      <Link to="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
        Back to dashboard
      </Link>
    </div>
  ),
});

const NEXT_STEPS = [
  {
    to: "/heatmap",
    icon: <Grid3x3 className="size-5 text-info" />,
    title: "Explore the compliance heatmap",
    desc: "Locate exactly which policies are driving amber and red posture.",
  },
  {
    to: "/risks",
    icon: <ShieldAlert className="size-5 text-destructive" />,
    title: "Open the risk cockpit",
    desc: "Review the 18 synthesised risks on the likelihood × impact matrix.",
  },
  {
    to: "/mitigations",
    icon: <ListChecks className="size-5 text-success" />,
    title: "Decide on 22 mitigations",
    desc: "Accept, modify or reject each AI-recommended treatment action.",
  },
  {
    to: "/approvals",
    icon: <FileText className="size-5 text-warning" />,
    title: "Clear the approval queue",
    desc: "Human-in-the-loop sign-off with a full audit trail.",
  },
  {
    to: "/stage-gate",
    icon: <Flag className="size-5 text-primary" />,
    title: "Review Stage Gate A readiness",
    desc: "Conditional readiness verdict and the four conditions precedent.",
  },
  {
    to: "/executive-summary",
    icon: <FileText className="size-5 text-chart-5" />,
    title: "Generate the executive summary",
    desc: "Mock one-click steering-group summary generation.",
  },
];

function AssessmentResultsPage() {
  const { assessmentId } = Route.useParams();
  if (assessmentId !== "A-001") {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="text-xl font-semibold text-foreground">Assessment not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only Assessment #001 exists in this POC demo.
        </p>
        <Link
          to="/assessments/$assessmentId"
          params={{ assessmentId: "A-001" }}
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Open Assessment #001
        </Link>
      </div>
    );
  }

  const counts = statusCounts(requirements);
  const gaps = requirements
    .filter((r) => r.status === "gap")
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Assessment #001" }]}
        title="Assessment #001 — Results"
        subtitle={`${assessment.project} · ${assessment.programme} · ${assessment.gate} · completed ${assessment.completedAt} in ${assessment.duration}`}
        actions={
          <>
            <DemoBadge />
            <Link
              to="/trace"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <History className="size-4" /> Trace
            </Link>
            <Link
              to="/explainability"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <BrainCircuit className="size-4" /> Explainability
            </Link>
          </>
        }
      />

      {/* Verdict banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-warning/40 bg-warning/5 p-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">{overallCompliance}%</span>
            <RagBadge color="amber" label="Conditionally compliant" />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {counts.compliant} compliant, {counts.partial} partial, {counts.gap} gaps across 94
            requirements. 8 red risks require treatment before Stage Gate A. Verdict and scores are
            simulated AI output pending human approval.
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>Model: {assessment.model}</div>
          <div>Run: {formatDate("2026-08-22T09:14:02Z")}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Framework breakdown */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Framework breakdown</h2>
          <div className="space-y-4">
            {frameworks.map((f) => {
              const s = frameworkStats(f.id);
              return (
                <Link
                  key={f.id}
                  to="/frameworks/$frameworkId"
                  params={{ frameworkId: f.id }}
                  className="block rounded-lg border border-border p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      <span className="mr-2 font-mono text-xs text-muted-foreground">{f.code}</span>
                      {f.name}
                    </span>
                    <RagBadge color={s.rag} label={`${s.compliance}%`} />
                  </div>
                  <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-muted">
                    <div className="bg-success" style={{ width: `${(s.counts.compliant / s.total) * 100}%` }} />
                    <div className="bg-warning" style={{ width: `${(s.counts.partial / s.total) * 100}%` }} />
                    <div className="bg-destructive" style={{ width: `${(s.counts.gap / s.total) * 100}%` }} />
                  </div>
                  <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
                    <span>{s.counts.compliant} met</span>
                    <span>{s.counts.partial} partial</span>
                    <span>{s.counts.gap} gaps</span>
                    <span className="ml-auto">{s.redRisks} red risks</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Top gaps */}
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Highest-confidence gaps ({counts.gap} total)
            </h2>
            <Link to="/policies" className="text-xs font-medium text-primary hover:underline">
              Policy library
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {gaps.map((r) => (
              <li key={r.id}>
                <Link
                  to="/requirements/$requirementId"
                  params={{ requirementId: r.id }}
                  className="flex items-center gap-3 py-2.5 hover:bg-muted/40"
                >
                  <RagStatusBadge status={r.status} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{r.title}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{r.id}</div>
                  </div>
                  <ConfidenceMeter value={r.confidence} />
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Red risks */}
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Red risks (8)</h2>
            <Link to="/risks" className="text-xs font-medium text-primary hover:underline">
              Risk cockpit
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {redRisks.map((r) => (
              <li key={r.id}>
                <Link
                  to="/risks/$riskId"
                  params={{ riskId: r.id }}
                  className="flex items-center gap-3 py-2.5 hover:bg-muted/40"
                >
                  <RiskScoreChip score={riskScore(r)} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{r.title}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {r.id} · {r.owner}
                    </div>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Next steps */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Continue the review</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {NEXT_STEPS.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
              >
                {s.icon}
                <span>
                  <span className="block text-sm font-medium text-foreground">{s.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{s.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
