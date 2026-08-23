import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  FileSearch,
  Flag,
  GitBranch,
  Radar,
  ScrollText,
  ShieldCheck,
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

interface FutureCard {
  icon: React.ReactNode;
  title: string;
  text: string;
  featured?: boolean;
}

const GROUPS: { label: string; items: FutureCard[] }[] = [
  {
    label: "Human Oversight & Governance",
    items: [
      {
        icon: <ShieldCheck className="size-5 text-primary" />,
        title: "Human-in-the-Loop Approval",
        text: "AI provides findings and recommendations; designated governance stakeholders review, approve, reject, or request further action. Final governance decisions always remain with people.",
        featured: true,
      },
      {
        icon: <Flag className="size-5 text-primary" />,
        title: "Stage Gate Integration",
        text: "Integrate governance outcomes with existing project stage-gate processes and decision points.",
      },
    ],
  },
  {
    label: "Document & Knowledge Management",
    items: [
      {
        icon: <BookOpen className="size-5 text-primary" />,
        title: "Document Versioning",
        text: "Maintain awareness of artefact versions so an assessment is tied to the version assessed. See which version was reviewed, when, whether a newer version exists, and whether a reassessment is appropriate.",
      },
      {
        icon: <GitBranch className="size-5 text-primary" />,
        title: "Potential SharePoint Integration",
        text: "A possible future connection to an approved SharePoint library for browsing folders, selecting project artefacts, and respecting metadata, access permissions, and latest versions.",
      },
      {
        icon: <FileSearch className="size-5 text-primary" />,
        title: "Evidence-Level Traceability",
        text: "Link findings back to source sections, pages, and excerpts so reviewers can verify AI conclusions against original evidence.",
      },
    ],
  },
  {
    label: "Intelligence & Automation",
    items: [
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
        icon: <BarChart3 className="size-5 text-primary" />,
        title: "Advanced Risk Analytics",
        text: "Portfolio-level dashboards showing compliance trends, recurring gap themes, and risk concentration across programmes and frameworks.",
      },
      {
        icon: <Workflow className="size-5 text-primary" />,
        title: "Automated Mitigation Tracking",
        text: "Turn recommended actions into owned, dated tasks and track them through to verified closure with reminders and escalation.",
      },
    ],
  },
  {
    label: "Enterprise Reporting & Assurance",
    items: [
      {
        icon: <ScrollText className="size-5 text-primary" />,
        title: "Enterprise Audit & Reporting",
        text: "Advanced assessment and decision history, audit exports, reporting, and portfolio-level insights.",
      },
    ],
  },
];

function FuturePage() {
  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        title="Future Enhancements"
        subtitle="Capabilities a production version of this concept could offer. These are future possibilities — none of them are implemented in this POC."
      />

      <div className="mb-6 space-y-4 rounded-lg border border-info/30 bg-info/5 px-4 py-4 text-sm text-info">
        <p>
          The current POC demonstrates the core concept. These are potential future
          extensions if the capability proves valuable.
        </p>
        <p className="font-medium">
          AI recommends. Human decides.
        </p>
        <p>
          AI never makes final governance decisions. It can surface evidence, suggest
          findings, and propose recommendations, but accountability and approval stay
          with people.
        </p>
      </div>

      <div className="space-y-8">
        {GROUPS.map((group) => (
          <section key={group.label}>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-foreground uppercase">
              {group.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.items.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-xl border bg-card p-5 ${
                    item.featured
                      ? "border-primary/25 shadow-sm"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`flex size-9 items-center justify-center rounded-md ${item.featured ? "bg-primary/10" : "bg-muted"}`}>
                      {item.icon}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                    Future — not in POC
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Concept: document versioning flow
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-lg border border-border bg-muted px-3 py-2 font-medium text-foreground">
            Document
          </span>
          <span aria-hidden="true">→</span>
          <span className="rounded-lg border border-border bg-muted px-3 py-2">
            v1.0
          </span>
          <span className="rounded-lg border border-border bg-muted px-3 py-2">
            v1.1
          </span>
          <span className="rounded-lg border border-border bg-muted px-3 py-2">
            v2.0
          </span>
          <span aria-hidden="true">→</span>
          <span className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 font-medium text-primary">
            Governance Assessment
          </span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          A future version could track which artefact version was assessed, when, and whether a newer version needs review.
        </p>
      </div>
    </div>
  );
}
