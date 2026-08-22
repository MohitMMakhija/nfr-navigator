import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { MitigationCard } from "@/components/mitigation-card";
import { FrameworkBadge, RagBadge, RagStatusBadge, RiskScoreChip } from "@/components/status";
import {
  evidenceForRequirement,
  getRequirement,
  getRisk,
  mitigationsForRisk,
  riskColor,
  riskScore,
} from "@/lib/services/governance-service";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/risks/$riskId")({
  head: () => ({
    meta: [
      { title: "Risk Detail — NGET AI Governance Assurance POC" },
      { name: "description", content: "Risk detail with linked requirements, evidence and mitigations. POC demo mode." },
      { property: "og:title", content: "Risk Detail — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Risk detail with linked requirements, evidence and mitigations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RiskDetailPage,
});

const TREND = {
  rising: <TrendingUp className="size-4 text-destructive" />,
  stable: <Minus className="size-4 text-muted-foreground" />,
  falling: <TrendingDown className="size-4 text-success" />,
};

function RiskDetailPage() {
  const { riskId } = Route.useParams();
  const risk = getRisk(riskId);
  const { audit } = useDemo();

  if (!risk) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="text-xl font-semibold text-foreground">Risk not found</h1>
        <Link to="/risks" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Back to risk cockpit
        </Link>
      </div>
    );
  }

  const score = riskScore(risk);
  const color = riskColor(risk);
  const mits = mitigationsForRisk(risk.id);
  const linkedReqs = risk.requirementIds
    .map(getRequirement)
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const relatedEvidence = [
    ...new Map(
      linkedReqs.flatMap((r) => evidenceForRequirement(r.id)).map((e) => [e.id, e]),
    ).values(),
  ];
  const riskAudit = audit.filter((a) => a.detail.includes(risk.id) || a.entity === risk.id);

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Risk Cockpit", to: "/risks" },
          { label: risk.id },
        ]}
        title={risk.title}
        subtitle={risk.description}
        actions={
          <>
            <RiskScoreChip score={score} />
            <RagBadge color={color} label={`${color} risk`} />
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-6">
        {[
          ["Likelihood", `L${risk.likelihood}`],
          ["Impact", `I${risk.impact}`],
          ["Score", String(score)],
          ["Owner", risk.owner],
          ["Due", risk.dueDate],
          ["Status", risk.status],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-1 text-sm font-semibold text-foreground capitalize">
              {value}
              {label === "Score" && TREND[risk.trend]}
            </div>
            <div className="text-[11px] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Linked requirements ({linkedReqs.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {linkedReqs.map((r) => (
            <Link
              key={r.id}
              to="/requirements/$requirementId"
              params={{ requirementId: r.id }}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs hover:border-primary/40"
            >
              <span className="font-mono text-muted-foreground">{r.id}</span>
              <span className="font-medium text-foreground">{r.title}</span>
              <RagStatusBadge status={r.status} />
            </Link>
          ))}
        </div>
        {relatedEvidence.length > 0 && (
          <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
            Supporting evidence:{" "}
            {relatedEvidence.map((e, i) => (
              <span key={e.id}>
                {i > 0 && ", "}
                <Link to="/evidence" className="font-mono text-primary hover:underline">
                  {e.id}
                </Link>
              </span>
            ))}
          </div>
        )}
        <div className="mt-2 text-[11px] text-muted-foreground">
          Identified by {risk.identifiedBy} · <FrameworkBadge code={risk.frameworkCode} />
        </div>
      </div>

      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recommended mitigations ({mits.length})
          </h2>
          <Link
            to="/mitigations"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            All mitigations <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {mits.map((m) => (
            <MitigationCard key={m.id} mitigation={m} />
          ))}
        </div>
      </section>

      {riskAudit.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Risk audit history</h2>
          <ul className="space-y-2 text-xs">
            {riskAudit.map((e) => (
              <li key={e.id} className="flex gap-2">
                <span className="font-mono text-muted-foreground">{e.id}</span>
                <span className="text-foreground">{e.detail}</span>
                <span className="ml-auto shrink-0 text-muted-foreground">{e.actor}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
