import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Flag, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { RagBadge, RagDot } from "@/components/status";
import {
  assessment,
  gateConditions,
  gateCriteria,
  overallCompliance,
  redRisks,
} from "@/lib/services/governance-service";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/stage-gate")({
  head: () => ({
    meta: [
      { title: "Stage Gate A Readiness — NGET AI Governance Assurance POC" },
      { name: "description", content: "Stage Gate A conditional readiness: criteria, conditions precedent and human approval. POC demo mode." },
      { property: "og:title", content: "Stage Gate A Readiness — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Conditional readiness verdict with four conditions precedent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StageGatePage,
});

function StageGatePage() {
  const { approvals, decideApproval, personaLabel } = useDemo();
  const gateState = approvals["APR-001"] ?? "pending";

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Stage Gate A" }]}
        title="Stage Gate A — readiness review"
        subtitle={`${assessment.project} · ${assessment.programme}. Recommendation from ${assessment.label}, subject to human approval.`}
        actions={
          <RagBadge
            color={gateState === "approved" ? "green" : gateState === "rejected" ? "red" : "amber"}
            label={
              gateState === "approved"
                ? "Conditionally approved"
                : gateState === "rejected"
                  ? "Rejected"
                  : "Awaiting decision"
            }
          />
        }
      />

      <div className="mb-6 rounded-xl border border-warning/40 bg-warning/5 p-5">
        <div className="flex items-center gap-2">
          <Flag className="size-5 text-warning" />
          <h2 className="text-lg font-semibold text-foreground">
            Verdict: CONDITIONALLY READY
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Weighted compliance {overallCompliance}% with {redRisks.length} red risks open. The
          simulated assessment recommends proceeding to Stage Gate A only with the four conditions
          precedent below formally tracked. This verdict is advisory until approved here or in the{" "}
          <Link to="/approvals" className="text-primary hover:underline">approval queue</Link>.
        </p>
      </div>

      <section className="mb-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">Gate criteria</h2>
        </div>
        <ul className="divide-y divide-border">
          {gateCriteria.map((c) => (
            <li key={c.id} className="flex items-start gap-3 px-4 py-3">
              <RagDot color={c.rag} className="mt-1.5" />
              <div>
                <div className="text-sm font-medium text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.note}</div>
              </div>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">{c.id}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">Conditions precedent (4)</h2>
        </div>
        <ul className="divide-y divide-border">
          {gateConditions.map((c) => (
            <li key={c.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  <span className="mr-2 font-mono text-[11px] text-muted-foreground">{c.id}</span>
                  {c.title}
                </span>
                <Link
                  to="/mitigations"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {c.linkedId}
                </Link>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {gateState === "pending" ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-5">
          <span className="text-sm text-muted-foreground">
            Decide as <span className="font-medium text-foreground">{personaLabel}</span>:
          </span>
          <button
            onClick={() => {
              decideApproval("APR-001", "approved", "Conditionally approved with COND-1…4 tracked.");
              toast.success("Stage Gate A conditionally approved");
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-success px-4 py-2 text-sm font-medium text-success-foreground hover:bg-success/90"
          >
            <Check className="size-4" /> Approve with conditions
          </button>
          <button
            onClick={() => {
              decideApproval("APR-001", "rejected");
              toast.success("Stage Gate A rejected");
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <X className="size-4" /> Reject — return to delivery
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Decision recorded by {personaLabel}: <span className="font-semibold text-foreground">{gateState}</span>.{" "}
          <Link to="/approvals" className="text-primary hover:underline">View in audit trail</Link>.
        </div>
      )}
    </div>
  );
}
