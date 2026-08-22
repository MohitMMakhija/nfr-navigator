import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, FileText, Flag } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import {
  ConfidenceMeter,
  CriticalityBadge,
  FrameworkBadge,
  RagStatusBadge,
  RiskScoreChip,
} from "@/components/status";
import {
  evidenceForRequirement,
  getArtefact,
  getFramework,
  getPolicy,
  getRequirement,
  risksForRequirement,
  riskScore,
} from "@/lib/services/governance-service";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/requirements/$requirementId")({
  head: () => ({
    meta: [
      { title: "Requirement Detail — NGET AI Governance Assurance POC" },
      { name: "description", content: "Requirement evidence, simulated AI reasoning, confidence and gaps. POC demo mode." },
      { property: "og:title", content: "Requirement Detail — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Requirement evidence, simulated AI reasoning, confidence and gaps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RequirementDetailPage,
});

function RequirementDetailPage() {
  const { requirementId } = Route.useParams();
  const req = getRequirement(requirementId);
  const { addAudit, personaLabel } = useDemo();

  if (!req) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="text-xl font-semibold text-foreground">Requirement not found</h1>
        <Link to="/policies" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Back to policy library
        </Link>
      </div>
    );
  }

  const policy = getPolicy(req.policyId)!;
  const framework = getFramework(req.frameworkId)!;
  const ev = evidenceForRequirement(req.id);
  const linkedRisks = risksForRequirement(req.id);

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Policy Library", to: "/policies" },
          { label: policy.name, to: `/policies/${policy.id}` },
          { label: req.id },
        ]}
        title={req.title}
        subtitle={req.description}
        actions={
          <>
            <CriticalityBadge level={req.criticality} />
            <RagStatusBadge status={req.status} />
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground">
        <span className="font-mono">{req.id}</span>
        <FrameworkBadge code={framework.code} />
        <span>{policy.name}</span>
        <span>Source: {req.sourceRef}</span>
        <span>Owner: {req.owner}</span>
        <span>Assessed: {req.lastAssessed}</span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* AI reasoning */}
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BrainCircuit className="size-4 text-info" /> AI assessment reasoning
              </h2>
              <span className="rounded-full border border-info/30 bg-info/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-info uppercase">
                Simulated — POC demo
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{req.reasoning}</p>
            <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">AI confidence</span>
              <ConfidenceMeter value={req.confidence} />
              <span className="ml-auto text-[11px] text-muted-foreground">
                Calibrated from evidence recency, directness and corroboration
              </span>
            </div>
          </section>

          {/* Gaps */}
          {req.gaps.length > 0 && (
            <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
              <h2 className="mb-2 text-sm font-semibold text-destructive">Identified gaps</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
                {req.gaps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Evidence */}
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Evidence ({ev.length})
              </h2>
              <Link to="/evidence" className="text-xs font-medium text-primary hover:underline">
                Evidence traceability
              </Link>
            </div>
            {ev.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No direct evidence linked — see the{" "}
                <Link to="/trace" className="text-primary hover:underline">assessment trace</Link>{" "}
                for retrieval details.
              </p>
            ) : (
              <ul className="space-y-3">
                {ev.map((e) => {
                  const art = getArtefact(e.artefactId)!;
                  return (
                    <li key={e.id} className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold text-info">{e.id}</span>
                        <ConfidenceMeter value={e.confidence} />
                      </div>
                      <blockquote className="mt-2 border-l-2 border-primary/40 pl-3 text-sm text-foreground italic">
                        “{e.excerpt}”
                      </blockquote>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <FileText className="size-3" />
                        <span className="font-mono">{art.name}</span>
                        <span>· {e.location}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-5">
          {/* Linked risks */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Linked risks ({linkedRisks.length})
            </h2>
            {linkedRisks.length === 0 ? (
              <p className="text-xs text-muted-foreground">No risks raised against this requirement.</p>
            ) : (
              <ul className="space-y-2">
                {linkedRisks.map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/risks/$riskId"
                      params={{ riskId: r.id }}
                      className="flex items-center gap-2 rounded-lg border border-border p-2.5 hover:border-primary/40"
                    >
                      <RiskScoreChip score={riskScore(r)} />
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                        {r.title}
                      </span>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Human action */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-2 text-sm font-semibold text-foreground">Human review</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              AI calls are advisory. Flag this requirement for human re-review and the decision is
              written to the audit trail.
            </p>
            <button
              onClick={() => {
                addAudit({
                  actor: personaLabel,
                  action: "Flagged for human review",
                  entity: req.id,
                  detail: `${req.id} (${req.title}) flagged for human re-review.`,
                  kind: "human",
                });
                toast.success("Flagged for human review", {
                  description: "The action was recorded in the audit trail.",
                });
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Flag className="size-4" /> Flag for human review
            </button>
            <Link
              to="/approvals"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Go to approvals
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
