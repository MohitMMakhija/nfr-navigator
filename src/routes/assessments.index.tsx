import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge, VerdictBadge } from "@/components/status";
import { getFramework } from "@/lib/mock/frameworks";
import { mockResult } from "@/lib/mock/findings";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/assessments/")({
  head: () => ({
    meta: [
      { title: "Assessments — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content: "All governance assessments created in this POC demo workspace.",
      },
      { property: "og:title", content: "Assessments — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "All governance assessments in this POC demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssessmentsPage,
});

function AssessmentsPage() {
  const { assessments, hydrated } = useDemo();
  const navigate = useNavigate();
  const rows = [...assessments].reverse();

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="Assessments"
        subtitle="Governance assessments created in this workspace. Results are simulated for the POC."
        actions={
          <>
            <DemoBadge />
            <Link
              to="/assessments/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-4" /> New Assessment
            </Link>
          </>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-5 py-3 font-medium">Reference</th>
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="hidden px-5 py-3 font-medium lg:table-cell">Framework</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Created</th>
              <th className="px-5 py-3 font-medium">Overall result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {hydrated &&
              rows.map((a) => (
                <tr
                  key={a.ref}
                  onClick={() =>
                    navigate({
                      to: "/assessments/$assessmentId",
                      params: { assessmentId: a.ref },
                    })
                  }
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {a.ref}
                    </span>
                    {a.isPocDemo && (
                      <span className="mt-1 block w-fit rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground uppercase">
                        POC Demo Assessment
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="block font-medium text-foreground">{a.projectName}</span>
                    <span className="block text-xs text-muted-foreground">{a.programme}</span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-xs text-muted-foreground lg:table-cell">
                    {getFramework(a.frameworkId)?.name ?? a.frameworkId}
                  </td>
                  <td className="hidden px-5 py-3.5 text-xs text-muted-foreground md:table-cell">
                    {new Date(a.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">
                      {mockResult.overall}%
                    </span>
                    <VerdictBadge verdict={mockResult.verdict} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!hydrated && (
          <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
        )}
      </div>
    </div>
  );
}
