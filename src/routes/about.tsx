import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BrainCircuit,
  FileSearch,
  ListChecks,
  UploadCloud,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoBadge } from "@/components/status";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the POC — NGET AI Governance Assurance" },
      {
        name: "description",
        content:
          "What the NGET AI Governance Assurance concept POC demonstrates, how it works, and its current scope. POC demo with simulated AI.",
      },
      { property: "og:title", content: "About the POC — NGET AI Governance Assurance" },
      {
        property: "og:description",
        content:
          "Concept, how it works, and current scope of the POC demo with simulated AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
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

function AboutPage() {
  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        title="About the POC"
        subtitle="What this concept demonstrator shows, how it works, and what it deliberately does not do."
        actions={<DemoBadge />}
      />

      {/* What is this */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-foreground">What is this?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          NGET AI Governance Assurance is a concept demonstrator for AI-assisted
          project governance assessment: upload project artefacts, select a
          framework, and see simulated AI findings and recommendations. All AI
          behaviour in this POC is simulated and clearly labelled — no real AI,
          backend, or document processing takes place.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-8">
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
      <section className="mb-8 rounded-xl bg-accent/60 px-6 py-5">
        <h2 className="text-sm font-semibold text-foreground">Why this matters</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Manual governance reviews of project artefacts are time-consuming,
          inconsistent, and often happen too late to influence delivery.
          AI-assisted assessment gives project teams an early, consistent read of
          their governance posture — surfacing gaps and recommended actions while
          there is still time to act.
        </p>
      </section>

      {/* Current POC scope */}
      <section className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">Current POC scope</h2>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
          <li className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            Artefact assessment — register project artefacts and run a simulated
            assessment against them (file contents never leave your browser).
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            Framework selection — assess against a chosen framework from the
            Framework & Policy Library.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            AI-assisted findings — simulated, deterministic findings linked to the
            policies they relate to.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            Recommendations — a recommended action for every finding.
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Everything else — integrations, real AI analysis, audit exports,
          portfolio reporting — is roadmap only. See{" "}
          <Link to="/future" className="font-medium text-primary hover:underline">
            Future Enhancements
          </Link>
          .
        </p>
      </section>

      {/* Transparency statement */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-2">
          <DemoBadge />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          This is a proof-of-concept demo. All AI behaviour is simulated and every
          result is fixed illustrative data — no real AI models, document parsing,
          indexing, storage or backend services are involved. Assessments you
          create are kept only in this browser's local storage, and Reset Demo in{" "}
          <Link to="/settings" className="font-medium text-primary hover:underline">
            Settings
          </Link>{" "}
          restores the seeded demo assessments at any time.
        </p>
      </section>
    </div>
  );
}
