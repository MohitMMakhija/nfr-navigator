import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { MitigationCard } from "@/components/mitigation-card";
import { RiskScoreChip } from "@/components/status";
import { getRisk, mitigations, riskScore } from "@/lib/services/governance-service";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/mitigations")({
  head: () => ({
    meta: [
      { title: "Mitigation Recommendations — NGET AI Governance Assurance POC" },
      { name: "description", content: "22 AI-recommended mitigations with accept / modify / reject decisions. POC demo mode." },
      { property: "og:title", content: "Mitigation Recommendations — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "22 AI-recommended mitigations with accept / modify / reject decisions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MitigationsPage,
});

function MitigationsPage() {
  const { mitigationDecisions } = useDemo();
  const counts = { proposed: 0, accepted: 0, modified: 0, rejected: 0, implemented: 0 };
  for (const m of mitigations) {
    counts[mitigationDecisions[m.id]?.status ?? "proposed"]++;
  }

  const sorted = [...mitigations].sort((a, b) => {
    const ra = getRisk(a.riskId);
    const rb = getRisk(b.riskId);
    return (rb ? riskScore(rb) : 0) - (ra ? riskScore(ra) : 0);
  });

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Mitigations" }]}
        title="Mitigation recommendations"
        subtitle="22 actions drafted by the simulated AI. Accept, modify or reject each one — every decision is human and written to the audit trail."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(
          [
            ["Proposed", counts.proposed, "text-info"],
            ["Accepted", counts.accepted, "text-success"],
            ["Modified", counts.modified, "text-warning-foreground"],
            ["Rejected", counts.rejected, "text-destructive"],
            ["Implemented", counts.implemented, "text-success"],
          ] as const
        ).map(([label, n, cls]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-3 text-center">
            <div className={`text-2xl font-bold ${cls}`}>{n}</div>
            <div className="text-[11px] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {sorted.map((m) => {
          const risk = getRisk(m.riskId)!;
          return (
            <div key={m.id}>
              <div className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                <RiskScoreChip score={riskScore(risk)} />
                <Link
                  to="/risks/$riskId"
                  params={{ riskId: risk.id }}
                  className="truncate hover:text-primary hover:underline"
                >
                  {risk.id}: {risk.title}
                </Link>
              </div>
              <MitigationCard mitigation={m} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
