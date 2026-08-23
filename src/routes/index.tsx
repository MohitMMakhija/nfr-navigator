import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge, NotAssessedBadge, StatusBadge, VerdictBadge } from "@/components/status";
import { getFramework } from "@/lib/mock/frameworks";
import { resultForAssessment } from "@/lib/mock/profiles";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Governance Assurance Dashboard — Automated Governance Artifacts Review System" },
      {
        name: "description",
        content:
          "Governance assurance dashboard for the Automated Governance Artifacts Review System concept POC: portfolio metrics, outcomes and simulated assessments.",
      },
      { property: "og:title", content: "Governance Assurance Dashboard — Automated Governance Artifacts Review System" },
      {
        property: "og:description",
        content:
          "Overview of governance assessments and areas requiring attention in this POC demo workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { assessments, hydrated, createDraft } = useDemo();
  const navigate = useNavigate();

  // Drafts count towards the total only — they have no result yet, so they
  // never contribute to status, attention or outcome metrics.
  const assessed = assessments.filter((a) => a.status !== "draft");
  const total = assessments.length;
  const inReview = assessed.filter((a) => a.status === "in-review").length;
  const completed = assessed.filter((a) => a.status === "completed").length;
  const attention = assessed.filter((a) => {
    const r = resultForAssessment(a);
    return r !== null && r.category !== "aligned";
  });

  const outcomeCounts = {
    aligned: assessed.filter((a) => resultForAssessment(a)?.category === "aligned")
      .length,
    conditional: assessed.filter(
      (a) => resultForAssessment(a)?.category === "conditional",
    ).length,
    gaps: assessed.filter((a) => resultForAssessment(a)?.category === "gaps").length,
  };

  const startNewAssessment = () => {
    const draft = createDraft();
    navigate({ to: "/assessments/new", search: { ref: draft.ref } });
  };

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="Governance Assurance Dashboard"
        subtitle="Overview of governance assessments and areas requiring attention."
        actions={
          <>
            <DemoBadge />
            <button
              onClick={startNewAssessment}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-4" /> New Assessment
            </button>
          </>
        }
      />

      {/* Portfolio metrics */}
      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(
          [
            ["Total assessments", total, "text-foreground"],
            ["In Review", inReview, "text-info"],
            ["Completed", completed, "text-success"],
            ["Needs Attention", attention.length, "text-warning-foreground"],
          ] as const
        ).map(([label, value, text]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className={`text-2xl font-bold ${text}`}>{hydrated ? value : "–"}</div>
            <div className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</div>
          </div>
        ))}
      </section>

      {/* Outcome mix */}
      <section className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">Assessment outcomes</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-center">
            <div className="text-2xl font-bold text-success">{outcomeCounts.aligned}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Aligned</div>
          </div>
          <div className="rounded-lg border border-warning/40 bg-warning/15 p-4 text-center">
            <div className="text-2xl font-bold text-warning-foreground">
              {outcomeCounts.conditional}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">Conditional</div>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{outcomeCounts.gaps}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Significant Gaps</div>
          </div>
        </div>
      </section>

      {/* Needs attention */}
      {hydrated && attention.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-foreground">Needs attention</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {attention.map((a) => {
              const result = resultForAssessment(a);
              if (!result) return null;
              const highCount = result.findings.filter(
                (f) => f.severity === "high",
              ).length;
              return (
                <Link
                  key={a.ref}
                  to="/assessments/$assessmentId"
                  params={{ assessmentId: a.ref }}
                  className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {a.ref}
                    </span>
                    <VerdictBadge verdict={result.verdict} category={result.category} />
                  </div>
                  <div className="mt-2 text-sm font-medium text-foreground">
                    {a.projectName}
                  </div>
                  <div className="text-xs text-muted-foreground">{a.programme}</div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground">
                      {result.overall}%
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <AlertTriangle className="size-3.5 text-destructive" />
                      {highCount} high-severity finding{highCount === 1 ? "" : "s"}
                    </span>
                    <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Assessment table */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold text-foreground">Assessments</h2>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-5 py-3 font-medium">Reference</th>
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Programme</th>
              <th className="hidden px-5 py-3 font-medium lg:table-cell">Framework</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Score</th>
              <th className="px-5 py-3 font-medium">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {hydrated &&
              assessments.map((a) => {
                const result = resultForAssessment(a);
                const isDraft = a.status === "draft";
                return (
                  <tr
                    key={a.ref}
                    onClick={() =>
                      navigate(
                        isDraft
                          ? { to: "/assessments/new", search: { ref: a.ref } }
                          : {
                              to: "/assessments/$assessmentId",
                              params: { assessmentId: a.ref },
                            },
                      )
                    }
                    className="cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-foreground">
                      {a.ref}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      {a.projectName || "—"}
                    </td>
                    <td className="hidden px-5 py-3.5 text-xs text-muted-foreground md:table-cell">
                      {a.programme || "—"}
                    </td>
                    <td className="hidden px-5 py-3.5 text-xs text-muted-foreground lg:table-cell">
                      {a.frameworkId
                        ? (getFramework(a.frameworkId)?.name ?? a.frameworkId)
                        : "Not selected"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-foreground">
                      {result ? `${result.overall}%` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {result ? (
                        <VerdictBadge verdict={result.verdict} category={result.category} />
                      ) : (
                        <NotAssessedBadge />
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {!hydrated && (
          <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
        )}
      </section>
    </div>
  );
}
