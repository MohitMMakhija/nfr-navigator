import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RagBadge, RagStatusBadge } from "@/components/status";
import {
  getFramework,
  frameworkStats,
  policiesForFramework,
  policyStats,
  requirementsForPolicy,
} from "@/lib/services/governance-service";

export const Route = createFileRoute("/frameworks/$frameworkId")({
  head: () => ({
    meta: [
      { title: "Framework Detail — NGET AI Governance Assurance POC" },
      { name: "description", content: "Framework drilldown with policy and requirement posture. POC demo mode." },
      { property: "og:title", content: "Framework Detail — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Framework drilldown with policy and requirement posture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FrameworkDetailPage,
});

function FrameworkDetailPage() {
  const { frameworkId } = Route.useParams();
  const framework = getFramework(frameworkId);

  if (!framework) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="text-xl font-semibold text-foreground">Framework not found</h1>
        <Link to="/frameworks" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Back to frameworks
        </Link>
      </div>
    );
  }

  const s = frameworkStats(framework.id);
  const fwPolicies = policiesForFramework(framework.id);

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Frameworks", to: "/frameworks" },
          { label: framework.code },
        ]}
        title={`${framework.name} ${framework.version}`}
        subtitle={`${framework.description} Owner: ${framework.owner}. Source: ${framework.sourceRef}.`}
        actions={<RagBadge color={s.rag} label={`${s.compliance}% compliant`} />}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Requirements", String(s.total)],
          ["Compliant", String(s.counts.compliant)],
          ["Partial", String(s.counts.partial)],
          ["Gaps", String(s.counts.gap)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {fwPolicies.map((p) => {
          const ps = policyStats(p.id);
          return (
            <section key={p.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link
                  to="/policies/$policyId"
                  params={{ policyId: p.id }}
                  className="text-sm font-semibold text-foreground hover:text-primary"
                >
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{p.code}</span>
                  {p.name}
                </Link>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{ps.total} reqs</span>
                  <span className="text-success">{ps.counts.compliant} met</span>
                  <span className="text-warning-foreground">{ps.counts.partial} partial</span>
                  <span className="text-destructive">{ps.counts.gap} gaps</span>
                  <RagBadge color={ps.rag} label={`${ps.compliance}%`} />
                </div>
              </div>
              <ul className="mt-3 divide-y divide-border">
                {requirementsForPolicy(p.id).map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/requirements/$requirementId"
                      params={{ requirementId: r.id }}
                      className="flex items-center gap-3 py-2 hover:bg-muted/40"
                    >
                      <span className="w-24 shrink-0 font-mono text-[11px] text-muted-foreground">
                        {r.id}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {r.title}
                      </span>
                      <RagStatusBadge status={r.status} />
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
