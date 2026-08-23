import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge } from "@/components/status";
import { frameworks } from "@/lib/mock/frameworks";

export const Route = createFileRoute("/frameworks/")({
  head: () => ({
    meta: [
      { title: "Framework & Policy Library — Automated Governance Artifacts Review System POC" },
      {
        name: "description",
        content: "Governance frameworks and their applicable policies used by the POC demonstrator.",
      },
      { property: "og:title", content: "Framework & Policy Library — Automated Governance Artifacts Review System POC" },
      { property: "og:description", content: "Governance frameworks and applicable policies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FrameworksPage,
});

function FrameworksPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="Framework & Policy Library"
        subtitle="The governance frameworks available to assess against, and the policies each one applies. Mock library — not connected to a live policy repository."
        actions={<DemoBadge />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {frameworks.map((f) => (
          <Link
            key={f.id}
            to="/frameworks/$frameworkId"
            params={{ frameworkId: f.id }}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded border border-info/30 bg-info/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-info">
                {f.code}
              </span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success capitalize">
                {f.status}
              </span>
            </div>
            <h2 className="mt-3 text-sm font-semibold text-foreground group-hover:text-primary">
              {f.name}
            </h2>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
              {f.description}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>
                {f.owner} · {f.version} · {f.policies.length} polic
                {f.policies.length === 1 ? "y" : "ies"}
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-primary">
                View policies <ArrowRight className="size-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
