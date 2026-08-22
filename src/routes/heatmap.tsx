import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { RagDot } from "@/components/status";
import {
  frameworks,
  frameworkStats,
  policiesForFramework,
  policyStats,
} from "@/lib/services/governance-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Compliance Heatmap — NGET AI Governance Assurance POC" },
      { name: "description", content: "Clickable compliance heatmap across NFR, BSR and ITC policies. POC demo mode." },
      { property: "og:title", content: "Compliance Heatmap — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Clickable compliance heatmap across NFR, BSR and ITC policies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HeatmapPage,
});

const CELL: Record<string, string> = {
  green: "bg-success/80 hover:bg-success text-success-foreground",
  amber: "bg-warning/80 hover:bg-warning text-warning-foreground",
  red: "bg-destructive/80 hover:bg-destructive text-destructive-foreground",
};

function HeatmapPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Compliance Heatmap" }]}
        title="Compliance heatmap"
        subtitle="Every policy across the three frameworks, coloured by weighted requirement compliance (green ≥ 80%, amber 60–79%, red < 60%). Click a cell to open the policy."
      />

      <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><RagDot color="green" /> ≥ 80% compliant</span>
        <span className="flex items-center gap-1.5"><RagDot color="amber" /> 60–79%</span>
        <span className="flex items-center gap-1.5"><RagDot color="red" /> &lt; 60%</span>
      </div>

      <div className="space-y-6">
        {frameworks.map((f) => {
          const fs = frameworkStats(f.id);
          return (
            <section key={f.id} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{f.code}</span>
                  {f.name}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">{f.version}</span>
                </h2>
                <button
                  onClick={() =>
                    navigate({ to: "/frameworks/$frameworkId", params: { frameworkId: f.id } })
                  }
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {fs.compliance}% · open framework
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {policiesForFramework(f.id).map((p) => {
                  const s = policyStats(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() =>
                        navigate({ to: "/policies/$policyId", params: { policyId: p.id } })
                      }
                      className={cn(
                        "rounded-lg p-3 text-left transition-transform hover:scale-[1.02]",
                        CELL[s.rag],
                      )}
                      title={`${p.name}: ${s.compliance}% (${s.counts.gap} gaps)`}
                    >
                      <div className="font-mono text-[10px] opacity-80">{p.code}</div>
                      <div className="mt-0.5 line-clamp-2 text-xs font-semibold leading-tight">
                        {p.name}
                      </div>
                      <div className="mt-1.5 font-mono text-xs font-bold">{s.compliance}%</div>
                      <div className="text-[10px] opacity-80">
                        {s.total} reqs · {s.counts.gap} gaps
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
