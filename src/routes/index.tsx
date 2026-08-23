import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  FileSearch,
  ListChecks,
  Plus,
  UploadCloud,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge, VerdictBadge } from "@/components/status";
import { getFramework } from "@/lib/mock/frameworks";
import { mockResult } from "@/lib/mock/findings";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NGET AI Governance Assurance — Concept POC" },
      {
        name: "description",
        content:
          "AI-assisted governance assessment for project artefacts. Upload artefacts, select a framework, and see simulated AI findings and recommendations. Concept POC.",
      },
      { property: "og:title", content: "NGET AI Governance Assurance — Concept POC" },
      {
        property: "og:description",
        content:
          "Upload project artefacts, select a framework, and get simulated AI governance findings and recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const STEPS = [
  {
    n: "01",
    icon: <UploadCloud className="size-4 text-primary" />,
    title: "Upload",
    text: "Add the project artefacts — architecture reports, security assessments, NFR workbooks and plans. In this POC, files never leave your browser.",
  },
  {
    n: "02",
    icon: <BrainCircuit className="size-4 text-primary" />,
    title: "Assess",
    text: "Choose a governance framework; simulated AI assesses the artefacts against its applicable policies and requirements.",
  },
  {
    n: "03",
    icon: <FileSearch className="size-4 text-primary" />,
    title: "Review",
    text: "Review a clear overall result with prioritised findings, each linked to the policy it relates to.",
  },
  {
    n: "04",
    icon: <ListChecks className="size-4 text-primary" />,
    title: "Act",
    text: "Follow the recommended action for each finding to strengthen governance before formal review.",
  },
];

function DashboardPage() {
  const { assessments, hydrated } = useDemo();
  const recent = [...assessments].slice(-3).reverse();

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="NGET AI Governance Assurance"
        subtitle="AI-assisted governance assessment for project artefacts"
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

      {/* Concept description */}
      <div className="mb-10 max-w-3xl">
        <p className="text-sm leading-relaxed text-muted-foreground">
          A concept demonstrator for AI-assisted project governance assessment:
          upload project artefacts, select a framework, and see simulated AI
          findings and recommendations. All AI behaviour in this POC is simulated
          and clearly labelled — no real AI, backend, or document processing
          takes place.
        </p>
      </div>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-foreground">How it works</h2>
        <ol className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n}>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-semibold text-brand-mid">
                  {s.n}
                </span>
                <span className="flex size-7 items-center justify-center rounded-md bg-primary/5">
                  {s.icon}
                </span>
                <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Why this matters */}
      <section className="mb-10 rounded-xl bg-accent/60 px-6 py-5">
        <h2 className="text-sm font-semibold text-foreground">Why this matters</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Manual governance reviews of project artefacts are time-consuming,
          inconsistent, and often happen too late to influence delivery.
          AI-assisted assessment gives project teams an early, consistent read of
          their governance posture — surfacing gaps and recommended actions while
          there is still time to act.
        </p>
      </section>

      {/* Recent assessments */}
      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold text-foreground">Recent assessments</h2>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        {!hydrated ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
        ) : recent.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-foreground">No assessments yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Run your first simulated governance assessment to see it here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((a) => (
              <li key={a.ref}>
                <Link
                  to="/assessments/$assessmentId"
                  params={{ assessmentId: a.ref }}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
                >
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {a.ref}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {a.projectName}
                      {a.isPocDemo && (
                        <span className="ml-2 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                          POC Demo Assessment
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {a.programme} · {getFramework(a.frameworkId)?.name ?? a.frameworkId}
                    </span>
                  </span>
                  <span className="hidden items-center gap-2 sm:flex">
                    <span className="font-mono text-xs text-muted-foreground">
                      {mockResult.overall}%
                    </span>
                    <VerdictBadge verdict={mockResult.verdict} />
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
