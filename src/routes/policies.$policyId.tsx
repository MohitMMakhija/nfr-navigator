import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ConfidenceMeter, CriticalityBadge, RagBadge, RagStatusBadge } from "@/components/status";
import { getFramework, getPolicy, policyStats, requirementsForPolicy } from "@/lib/services/governance-service";

export const Route = createFileRoute("/policies/$policyId")({
  head: () => ({
    meta: [
      { title: "Policy Detail — NGET AI Governance Assurance POC" },
      { name: "description", content: "Policy requirements, RAG status and AI confidence. POC demo mode." },
      { property: "og:title", content: "Policy Detail — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Policy requirements, RAG status and AI confidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PolicyDetailPage,
});

function PolicyDetailPage() {
  const { policyId } = Route.useParams();
  const policy = getPolicy(policyId);

  if (!policy) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="text-xl font-semibold text-foreground">Policy not found</h1>
        <Link to="/policies" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Back to policy library
        </Link>
      </div>
    );
  }

  const s = policyStats(policy.id);
  const reqs = requirementsForPolicy(policy.id);
  const framework = getFramework(policy.frameworkId)!;

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Policy Library", to: "/policies" },
          { label: policy.code },
        ]}
        title={policy.name}
        subtitle={`${policy.description} Framework: ${framework.name} ${framework.version} · Source: ${policy.sourceRef}.`}
        actions={<RagBadge color={s.rag} label={`${s.compliance}% compliant`} />}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          ["Requirements", String(s.total)],
          ["Compliant", String(s.counts.compliant)],
          ["Partial", String(s.counts.partial)],
          ["Gaps", String(s.counts.gap)],
          ["Mean AI confidence", `${s.meanConfidence}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xl font-bold text-foreground">{value}</div>
            <div className="text-[11px] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Requirement</th>
              <th className="px-4 py-2.5 font-medium">Criticality</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">AI confidence</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reqs.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link
                    to="/requirements/$requirementId"
                    params={{ requirementId: r.id }}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {r.title}
                  </Link>
                  <div className="font-mono text-[11px] text-muted-foreground">{r.id}</div>
                </td>
                <td className="px-4 py-3">
                  <CriticalityBadge level={r.criticality} />
                </td>
                <td className="px-4 py-3">
                  <RagStatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <ConfidenceMeter value={r.confidence} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/requirements/$requirementId"
                    params={{ requirementId: r.id }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Detail <ArrowRight className="size-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
