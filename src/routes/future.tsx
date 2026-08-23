import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  FileSearch,
  Flag,
  GitBranch,
  Radar,
  ScrollText,
  Workflow,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/future")({
  head: () => ({
    meta: [
      { title: "Future Enhancements — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content: "Roadmap of possible future capabilities for the governance assurance concept. Not implemented in this POC.",
      },
      { property: "og:title", content: "Future Enhancements — NGET AI Governance Assurance POC" },
      {
        property: "og:description",
        content: "Possible future capabilities — not implemented in this POC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FuturePage,
});

const ITEMS = [
  {
    icon: <FileSearch className="size-5 text-primary" />,
    title: "Evidence-level Traceability",
    text: "Link every finding back to the exact document, page and paragraph that supports it, so reviewers can verify AI conclusions against source evidence.",
  },
  {
    icon: <BarChart3 className="size-5 text-primary" />,
    title: "Advanced Risk & Governance Analytics",
    text: "Portfolio-level dashboards showing compliance trends, recurring gap themes and risk concentration across programmes and frameworks.",
  },
  {
    icon: <Flag className="size-5 text-primary" />,
    title: "Stage Gate Integration",
    text: "Feed assessment results directly into stage-gate decisions, with readiness criteria and conditional-pass actions tracked to closure.",
  },
  {
    icon: <GitBranch className="size-5 text-primary" />,
    title: "Automated Policy / Control Mapping",
    text: "Automatically map framework policies to internal controls and external standards, highlighting overlaps and unmapped obligations.",
  },
  {
    icon: <Radar className="size-5 text-primary" />,
    title: "Continuous Governance Monitoring",
    text: "Re-assess projects as artefacts change, alerting owners when new document versions introduce compliance drift.",
  },
  {
    icon: <Workflow className="size-5 text-primary" />,
    title: "Automated Mitigation Tracking",
    text: "Turn recommended actions into owned, dated tasks and track them through to verified closure with reminders and escalation.",
  },
  {
    icon: <ScrollText className="size-5 text-primary" />,
    title: "Enterprise Audit & Reporting",
    text: "Immutable audit trails, steering-pack generation and regulator-ready reporting across all assessments and decisions.",
  },
];

function FuturePage() {
  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        title="Future Enhancements"
        subtitle="Capabilities a production version of this concept could offer. These are future possibilities — none of them are implemented in this POC."
      />

      <div className="mb-6 rounded-lg border border-info/30 bg-info/5 px-4 py-3 text-sm text-info">
        Everything on this page is a roadmap idea only. The current POC demonstrates
        the core flow — upload artefacts, select a framework, simulated assessment,
        findings and recommendations — with no real AI or backend.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                {item.icon}
              </span>
              <h2 className="text-sm font-semibold text-foreground">{item.title}</h2>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              {item.text}
            </p>
            <span className="mt-3 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              Future possibility — not in POC
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
