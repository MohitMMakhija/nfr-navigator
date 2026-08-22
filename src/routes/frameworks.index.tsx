import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Library } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RagBadge } from "@/components/status";
import { frameworks, frameworkStats } from "@/lib/services/governance-service";

export const Route = createFileRoute("/frameworks/")({
  head: () => ({
    meta: [
      { title: "Compliance Frameworks — NGET AI Governance Assurance POC" },
      { name: "description", content: "NFR, BSR and ITC framework posture for Assessment #001. POC demo mode." },
      { property: "og:title", content: "Compliance Frameworks — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "NFR, BSR and ITC framework posture for Assessment #001." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FrameworksPage,
});

function FrameworksPage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Frameworks" }]}
        title="Compliance frameworks"
        subtitle="Three policy frameworks drive the 94 requirements assessed in Assessment #001."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {frameworks.map((f) => {
          const s = frameworkStats(f.id);
          return (
            <Link
              key={f.id}
              to="/frameworks/$frameworkId"
              params={{ frameworkId: f.id }}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Library className="size-5 text-primary" />
                </div>
                <RagBadge color={s.rag} label={`${s.compliance}%`} />
              </div>
              <h2 className="mt-3 text-sm font-semibold text-foreground">
                <span className="mr-2 font-mono text-xs text-muted-foreground">{f.code}</span>
                {f.name}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted">
                <div className="bg-success" style={{ width: `${(s.counts.compliant / s.total) * 100}%` }} />
                <div className="bg-warning" style={{ width: `${(s.counts.partial / s.total) * 100}%` }} />
                <div className="bg-destructive" style={{ width: `${(s.counts.gap / s.total) * 100}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  {s.total} requirements · {s.counts.gap} gaps · {s.redRisks} red risks
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  Drill down <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Owner: {f.owner} · {f.version}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
