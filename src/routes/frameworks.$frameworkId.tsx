import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge } from "@/components/status";
import { getFramework } from "@/lib/mock/frameworks";

export const Route = createFileRoute("/frameworks/$frameworkId")({
  head: () => ({
    meta: [
      { title: "Framework Detail — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content: "Framework detail with its applicable policies. POC demo mode.",
      },
      { property: "og:title", content: "Framework Detail — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Framework detail with applicable policies." },
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
      <div className="mx-auto max-w-[700px] rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-lg font-semibold text-foreground">Framework not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This framework isn't in the POC library.
        </p>
        <Link
          to="/frameworks"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        breadcrumbs={[
          { label: "Framework & Policy Library", to: "/frameworks" },
          { label: framework.name },
        ]}
        title={framework.name}
        subtitle={framework.description}
        actions={<DemoBadge />}
      />

      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border bg-card px-5 py-4 text-xs text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">Code:</span>{" "}
          <span className="font-mono">{framework.code}</span>
        </span>
        <span>
          <span className="font-medium text-foreground">Owner:</span> {framework.owner}
        </span>
        <span>
          <span className="font-medium text-foreground">Version:</span> {framework.version}
        </span>
        <span className="rounded-full bg-success/10 px-2 py-0.5 font-medium text-success capitalize">
          {framework.status}
        </span>
        <span className="ml-auto hidden items-center gap-1.5 font-semibold tracking-wide uppercase sm:flex">
          Framework <ChevronRight className="size-3" /> Applicable policies{" "}
          <ChevronRight className="size-3" /> Assessment
        </span>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Applicable policies ({framework.policies.length})
      </h2>
      <div className="space-y-3">
        {framework.policies.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                {p.id}
              </span>
              <span className="text-sm font-semibold text-foreground">{p.name}</span>
              <span className="text-xs text-muted-foreground">{p.version}</span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success capitalize">
                {p.status}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                Owner: {p.owner}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {p.purpose}
            </p>
            <ul className="mt-3 space-y-1.5">
              {p.keyPoints.map((k) => (
                <li key={k} className="flex items-start gap-2 text-xs text-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          to="/assessments/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Assess a project against this framework
        </Link>
      </div>
    </div>
  );
}
