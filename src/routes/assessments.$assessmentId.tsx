import { createFileRoute, Link } from "@tanstack/react-router";
import { FileArchive, FileSpreadsheet, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge, SeverityBadge, VerdictBadge } from "@/components/status";
import { getFramework } from "@/lib/mock/frameworks";
import { mockResult } from "@/lib/mock/findings";
import type { ArtefactKind } from "@/lib/mock/types";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/assessments/$assessmentId")({
  head: () => ({
    meta: [
      { title: "Assessment Results — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content: "Simulated governance assessment result: overall score, findings and recommendations. POC demo mode.",
      },
      { property: "og:title", content: "Assessment Results — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Simulated governance assessment result. POC demo mode." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssessmentDetailPage,
});

const FILE_ICON: Record<ArtefactKind, React.ReactNode> = {
  pdf: <FileText className="size-4 text-destructive" />,
  docx: <FileText className="size-4 text-info" />,
  xlsx: <FileSpreadsheet className="size-4 text-success" />,
  zip: <FileArchive className="size-4 text-warning" />,
};

function AssessmentDetailPage() {
  const { assessmentId } = Route.useParams();
  const { assessments, hydrated } = useDemo();
  const assessment = assessments.find((a) => a.ref === assessmentId);

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (!assessment) {
    return (
      <div className="mx-auto max-w-[700px] rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-lg font-semibold text-foreground">Assessment not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {assessmentId} isn't in this demo workspace. It may have been cleared by a
          demo reset.
        </p>
        <Link
          to="/assessments"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to assessments
        </Link>
      </div>
    );
  }

  const framework = getFramework(assessment.frameworkId);

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        breadcrumbs={[
          { label: "Assessments", to: "/assessments" },
          { label: assessment.ref },
        ]}
        title={`Governance Assessment — ${assessment.ref}`}
        subtitle={`${assessment.projectName} · ${assessment.programme}. Simulated AI output — illustrative only.`}
        actions={
          <>
            {assessment.isPocDemo && (
              <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-primary uppercase">
                POC Demo Assessment
              </span>
            )}
            <DemoBadge />
          </>
        }
      />

      {/* Result summary */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Overall result
          </div>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-4xl font-bold text-foreground">{mockResult.overall}%</span>
            <VerdictBadge verdict={mockResult.verdict} />
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-warning"
              style={{ width: `${mockResult.overall}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Conditional Alignment: the project is broadly aligned once the
            high-severity findings below are addressed.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 lg:col-span-2">
          {(
            [
              ["Meets expectations", mockResult.compliant, "text-success", "bg-success/10 border-success/30"],
              ["Needs attention", mockResult.partial, "text-warning-foreground", "bg-warning/15 border-warning/40"],
              ["Gap identified", mockResult.gaps, "text-destructive", "bg-destructive/10 border-destructive/30"],
            ] as const
          ).map(([label, value, text, box]) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center rounded-xl border p-5 ${box}`}
            >
              <span className={`text-3xl font-bold ${text}`}>{value}</span>
              <span className="mt-1 text-xs font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
          <div className="col-span-3 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
            {mockResult.compliant + mockResult.partial + mockResult.gaps} policy
            requirements assessed against{" "}
            <span className="font-medium text-foreground">{framework?.name}</span> ·{" "}
            {assessment.artefacts.length} artefacts reviewed · PM{" "}
            {assessment.projectManager} · Sponsor {assessment.sponsor}
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="mb-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">
            Findings & recommended actions ({mockResult.findings.length})
          </h2>
          <Link
            to="/findings"
            className="text-xs font-medium text-primary hover:underline"
          >
            Open in Findings & Recommendations
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {mockResult.findings.map((f) => (
            <li key={f.id} className="px-5 py-4">
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
      </div>

      {/* Artefacts reviewed */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">
            Artefacts reviewed ({assessment.artefacts.length})
          </h2>
        </div>
        <ul className="divide-y divide-border">
          {assessment.artefacts.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-5 py-2.5">
              {FILE_ICON[a.kind]}
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                {a.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {a.sizeMb} MB · {a.source === "demo" ? "POC demo data" : "browser session"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
