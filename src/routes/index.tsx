import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  Flag,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useDemo } from "@/lib/store";
import {
  amberRisks,
  artefacts,
  assessment,
  evidence,
  frameworks,
  frameworkStats,
  gateCriteria,
  greenRisks,
  overallCompliance,
  pocMetrics,
  redRisks,
  requirements,
  riskColor,
  riskScore,
  risks,
  statusCounts,
} from "@/lib/services/governance-service";
import { personas } from "@/lib/mock/personas";
import type { DashboardWidget } from "@/lib/mock/types";
import { RagBadge, RagDot, RiskScoreChip, DemoBadge } from "@/components/status";
import { PageHeader } from "@/components/page-header";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content:
          "Executive control-tower for Smart Grid Modernisation / TP500 Stage Gate A: 72% compliance, 94 requirements, 18 risks. Simulated AI assessment, POC demo mode.",
      },
      { property: "og:title", content: "Dashboard — NGET AI Governance Assurance POC" },
      {
        property: "og:description",
        content: "AI-assisted project governance, compliance and risk assessment — interactive POC demo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const STATUS_COLORS = {
  compliant: "var(--color-success)",
  partial: "var(--color-warning)",
  gap: "var(--color-destructive)",
};

function KpiWidget() {
  const counts = statusCounts(requirements);
  const donut = [
    { name: "Compliant", value: counts.compliant },
    { name: "Partial", value: counts.partial },
    { name: "Gap", value: counts.gap },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="col-span-2 flex items-center gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-1">
        <div className="relative h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donut}
                dataKey="value"
                innerRadius={32}
                outerRadius={46}
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill={STATUS_COLORS.compliant} />
                <Cell fill={STATUS_COLORS.partial} />
                <Cell fill={STATUS_COLORS.gap} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-foreground">{overallCompliance}%</span>
          </div>
        </div>
        <div>
          <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Compliance
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <RagDot color="amber" />
            <span className="text-sm font-medium text-foreground">Conditional</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Weighted across 3 frameworks
          </div>
        </div>
      </div>

      <Link
        to="/policies"
        className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
      >
        <div className="flex items-center justify-between">
          <FileCheck2 className="size-5 text-info" />
          <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="mt-3 text-3xl font-bold text-foreground">{requirements.length}</div>
        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Requirements
        </div>
        <div className="mt-2 flex gap-2 text-[11px] text-muted-foreground">
          <span className="text-success">{counts.compliant} met</span>
          <span className="text-warning-foreground">{counts.partial} partial</span>
          <span className="text-destructive">{counts.gap} gaps</span>
        </div>
      </Link>

      <Link
        to="/risks"
        className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
      >
        <div className="flex items-center justify-between">
          <ShieldAlert className="size-5 text-warning" />
          <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="mt-3 text-3xl font-bold text-foreground">{risks.length}</div>
        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Risks raised
        </div>
        <div className="mt-2 flex gap-2 text-[11px] text-muted-foreground">
          <span className="text-destructive">{redRisks.length} red</span>
          <span>{amberRisks.length} amber</span>
          <span className="text-success">{greenRisks.length} green</span>
        </div>
      </Link>

      <Link
        to="/risks"
        className="group rounded-xl border border-destructive/30 bg-destructive/5 p-5 transition-colors hover:border-destructive/60"
      >
        <div className="flex items-center justify-between">
          <AlertTriangle className="size-5 text-destructive" />
          <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="mt-3 text-3xl font-bold text-destructive">{redRisks.length}</div>
        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Red risks
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          Treatment plan pending approval
        </div>
      </Link>
    </div>
  );
}

function FrameworksWidget() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Framework posture</h2>
        <Link to="/frameworks" className="text-xs font-medium text-primary hover:underline">
          Drill down
        </Link>
      </div>
      <div className="space-y-4">
        {frameworks.map((f) => {
          const s = frameworkStats(f.id);
          return (
            <Link key={f.id} to="/frameworks/$frameworkId" params={{ frameworkId: f.id }} className="block">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{f.code}</span>
                  {f.name}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {s.compliance}% · {s.total} reqs
                  </span>
                  <RagDot color={s.rag} />
                </span>
              </div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-success"
                  style={{ width: `${(s.counts.compliant / s.total) * 100}%` }}
                />
                <div
                  className="bg-warning"
                  style={{ width: `${(s.counts.partial / s.total) * 100}%` }}
                />
                <div
                  className="bg-destructive"
                  style={{ width: `${(s.counts.gap / s.total) * 100}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><RagDot color="green" className="size-2" /> Compliant</span>
        <span className="flex items-center gap-1"><RagDot color="amber" className="size-2" /> Partial</span>
        <span className="flex items-center gap-1"><RagDot color="red" className="size-2" /> Gap</span>
      </div>
    </section>
  );
}

function RedRisksWidget() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Red risks requiring action</h2>
        <Link to="/risks" className="text-xs font-medium text-primary hover:underline">
          Risk cockpit
        </Link>
      </div>
      <ul className="divide-y divide-border">
        {redRisks.map((r) => (
          <li key={r.id}>
            <Link
              to="/risks/$riskId"
              params={{ riskId: r.id }}
              className="flex items-center gap-3 py-2.5 transition-colors hover:bg-muted/40"
            >
              <RiskScoreChip score={riskScore(r)} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{r.title}</div>
                <div className="text-xs text-muted-foreground">
                  {r.id} · {r.owner} · due {r.dueDate}
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MatrixWidget() {
  const cells = new Map<string, number>();
  for (const r of risks) {
    const k = `${r.likelihood}-${r.impact}`;
    cells.set(k, (cells.get(k) ?? 0) + 1);
  }
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Risk matrix (L × I)</h2>
        <Link to="/risks" className="text-xs font-medium text-primary hover:underline">
          Open cockpit
        </Link>
      </div>
      <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1 text-center">
        <div />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="pb-1 font-mono text-[10px] text-muted-foreground">
            I{i}
          </div>
        ))}
        {[5, 4, 3, 2, 1].map((l) => (
          <div key={l} className="contents">
            <div className="flex items-center pr-1 font-mono text-[10px] text-muted-foreground">
              L{l}
            </div>
            {[1, 2, 3, 4, 5].map((i) => {
              const score = l * i;
              const count = cells.get(`${l}-${i}`) ?? 0;
              const bg =
                score >= 15 ? "bg-destructive/15" : score >= 8 ? "bg-warning/15" : "bg-success/10";
              return (
                <div
                  key={i}
                  className={`flex h-8 items-center justify-center rounded ${bg} font-mono text-xs font-semibold text-foreground`}
                >
                  {count > 0 ? count : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function ApprovalsWidget() {
  const { approvals } = useDemo();
  const pending = [
    { id: "APR-001", title: "Stage Gate A — Conditional Readiness", type: "Stage gate" },
    { id: "APR-002", title: "Red Risk Treatment Plan", type: "Risk treatment" },
    { id: "APR-003", title: "Executive Summary Sign-off", type: "Summary" },
    { id: "APR-004", title: "RSK-012 Residual Acceptance", type: "Risk acceptance" },
  ];
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Human-in-the-loop approvals</h2>
        <Link to="/approvals" className="text-xs font-medium text-primary hover:underline">
          Open queue
        </Link>
      </div>
      <ul className="space-y-2.5">
        {pending.map((a) => {
          const state = approvals[a.id] ?? "pending";
          return (
            <li key={a.id} className="flex items-center gap-3">
              <ClipboardCheck className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.type}</div>
              </div>
              <RagBadge
                color={state === "approved" ? "green" : state === "rejected" ? "red" : "amber"}
                label={state === "pending" ? "Pending" : state}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ActivityWidget() {
  const { audit } = useDemo();
  const latest = [...audit].slice(-8).reverse();
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
        <Link to="/approvals" className="text-xs font-medium text-primary hover:underline">
          Full audit trail
        </Link>
      </div>
      <ul className="space-y-3">
        {latest.map((e) => (
          <li key={e.id} className="flex gap-3 text-sm">
            <span
              className={`mt-1.5 size-2 shrink-0 rounded-full ${
                e.kind === "ai" ? "bg-info" : e.kind === "human" ? "bg-success" : "bg-muted-foreground"
              }`}
            />
            <div className="min-w-0">
              <span className="font-medium text-foreground">{e.action}</span>
              <span className="text-muted-foreground"> — {e.detail}</span>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {e.actor} ·{" "}
                {formatDistanceToNow(new Date(e.at), { addSuffix: true })}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GateWidget() {
  const red = gateCriteria.filter((c) => c.rag === "red").length;
  const amber = gateCriteria.filter((c) => c.rag === "amber").length;
  return (
    <section className="rounded-xl border border-warning/40 bg-warning/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Flag className="size-4 text-warning" />
            <h2 className="text-sm font-semibold text-foreground">
              Stage Gate A — Conditionally Ready
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {assessment.label} recommends conditional readiness: {red} criteria red, {amber} amber,
            4 conditions precedent. Human approval outstanding.
          </p>
        </div>
        <RagBadge color="amber" label="Conditional" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to="/stage-gate"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          Review gate readiness <ArrowRight className="size-3.5" />
        </Link>
        <Link
          to="/assessments/$assessmentId"
          params={{ assessmentId: "A-001" }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          View assessment results
        </Link>
      </div>
    </section>
  );
}

function ArtefactsWidget() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Assessment artefact set (6)</h2>
        <Link to="/evidence" className="text-xs font-medium text-primary hover:underline">
          Evidence
        </Link>
      </div>
      <ul className="space-y-2">
        {artefacts.map((a) => (
          <li key={a.id} className="flex items-center gap-3 text-sm">
            <FileCheck2 className="size-4 shrink-0 text-success" />
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
              {a.name}
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {evidence.filter((e) => e.artefactId === a.id).length} citations
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ValueWidget() {
  const featured = [pocMetrics[0], pocMetrics[1], pocMetrics[5]];
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">POC value snapshot</h2>
        <Link to="/poc-metrics" className="text-xs font-medium text-primary hover:underline">
          All metrics
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {featured.map((m) => (
          <div key={m.id} className="rounded-lg bg-muted/50 p-4">
            <div className="text-2xl font-bold text-primary">{m.value}</div>
            <div className="mt-1 text-xs font-medium text-foreground">{m.label}</div>
            <div className="text-[11px] text-muted-foreground">{m.baseline}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const WIDGETS: Record<DashboardWidget, () => React.ReactElement> = {
  kpis: KpiWidget,
  frameworks: FrameworksWidget,
  risks: RedRisksWidget,
  matrix: MatrixWidget,
  approvals: ApprovalsWidget,
  activity: ActivityWidget,
  gate: GateWidget,
  artefacts: ArtefactsWidget,
  value: ValueWidget,
};

function DashboardPage() {
  const { persona } = useDemo();
  const p = personas.find((x) => x.id === persona)!;

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title={`${p.label} dashboard`}
        subtitle={p.focus}
        actions={
          <>
            <DemoBadge className="hidden sm:inline-flex" />
            <Link
              to="/assessments/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="size-4" /> New assessment
            </Link>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">{assessment.project}</span> ·{" "}
          {assessment.programme} · {assessment.gate}
        </span>
        <span>
          {assessment.label} · completed {assessment.completedAt} · {assessment.duration} ·{" "}
          <span className="text-info">simulated AI</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {p.widgets.map((w) => {
          const Widget = WIDGETS[w];
          const full = w === "kpis" || w === "gate" || w === "value";
          return (
            <div key={w} className={full ? "xl:col-span-2" : ""}>
              <Widget />
            </div>
          );
        })}
      </div>
    </div>
  );
}
