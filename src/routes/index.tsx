import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  Library,
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
      { title: "Dashboard — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content:
          "Concept demonstrator for AI-assisted governance assessment of project artefacts. Simulated AI, POC demo mode.",
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
    icon: <UploadCloud className="size-5 text-primary" />,
    title: "Upload project artefacts",
    text: "Add the documents that describe your project — architecture reports, security assessments, NFR workbooks and plans.",
  },
  {
    icon: <Library className="size-5 text-primary" />,
    title: "Select framework & policies",
    text: "Choose the governance framework to assess against; the applicable policies are selected with it.",
  },
  {
    icon: <BrainCircuit className="size-5 text-primary" />,
    title: "Simulated AI assesses",
    text: "The demonstrator simulates an AI review of your artefacts against the selected policies. No real AI runs in this POC.",
  },
  {
    icon: <ListChecks className="size-5 text-primary" />,
    title: "Findings & recommendations",
    text: "Review a concise compliance result with prioritised findings and a recommended action for each.",
  },
];

function DashboardPage() {
  const { assessments, hydrated } = useDemo();
  const recent = [...assessments].slice(-3).reverse();

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="AI Governance Assurance"
        subtitle="A concept demonstrator for AI-assisted project governance assessment: upload project artefacts, select a framework, and see simulated findings and recommendations."
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

      {/* Concept explainer */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">How it works</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          A lightweight flow from project documents to governance insight. All AI
          behaviour in this POC is simulated and clearly labelled.
        </p>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                  {s.icon}
                </span>
                <span className="font-mono text-xs text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Recent assessments */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
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
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((a) => (
              <li key={a.ref}>
                <Link
                  to="/assessments/$assessmentId"
                  params={{ assessmentId: a.ref }}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40"
                >
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {a.ref}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {a.projectName}
                      {a.isPocDemo && (
                        <span className="ml-2 rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground uppercase">
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
      </div>
    </div>
  );
}
