import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/page-header";
import { DemoBadge } from "@/components/status";
import { pocMetrics } from "@/lib/services/governance-service";

export const Route = createFileRoute("/poc-metrics")({
  head: () => ({
    meta: [
      { title: "POC Success Metrics — NGET AI Governance Assurance POC" },
      { name: "description", content: "POC value metrics: assessment time, coverage, traceability, precision, effort and cost. POC demo mode." },
      { property: "og:title", content: "POC Success Metrics — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "POC value metrics: assessment time, coverage, traceability, precision." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PocMetricsPage,
});

// Hours of manual effort per assessment phase vs simulated AI (seconds → hours).
const PHASES = [
  { phase: "Read artefacts", manual: 14, ai: 0.004 },
  { phase: "Map requirements", manual: 8, ai: 0.004 },
  { phase: "Extract evidence", manual: 7, ai: 0.006 },
  { phase: "Score & RAG", manual: 4, ai: 0.005 },
  { phase: "Risk register", manual: 2, ai: 0.004 },
  { phase: "Recommendations", manual: 1, ai: 0.005 },
];

function PocMetricsPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "POC Success Metrics" }]}
        title="POC success metrics"
        subtitle="Indicative value measures for the proof of concept. All figures are mock data for the demo narrative."
        actions={<DemoBadge />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {pocMetrics.map((m) => (
          <div key={m.id} className="rounded-xl border border-border bg-card p-5">
            <div className="text-3xl font-bold text-primary">{m.value}</div>
            <div className="mt-1 text-sm font-semibold text-foreground">{m.label}</div>
            <div className="text-xs font-medium text-success">{m.baseline}</div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-1 text-sm font-semibold text-foreground">
          Effort per assessment phase — manual vs AI-assisted
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Manual effort in hours (typical Stage Gate A first-pass review). AI bars are seconds,
          shown at near-zero scale. Mock data.
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PHASES} layout="vertical" margin={{ left: 40, right: 16 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} unit="h" />
              <YAxis
                type="category"
                dataKey="phase"
                width={130}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "manual" ? `${value}h` : `${Math.round(value * 3600)}s`,
                  name === "manual" ? "Manual" : "AI (simulated)",
                ]}
              />
              <Bar dataKey="manual" radius={[0, 4, 4, 0]} barSize={14}>
                {PHASES.map((p) => (
                  <Cell key={p.phase} fill="var(--color-muted-foreground)" opacity={0.5} />
                ))}
              </Bar>
              <Bar dataKey="ai" radius={[0, 4, 4, 0]} barSize={14} fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Success criteria for the POC: ≥ 85% simulated precision, 100% requirement coverage, full
        evidence traceability and a human decision on every AI recommendation. All four are met in
        this demo scenario.
      </p>
    </div>
  );
}
