import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { FrameworkBadge, RiskScoreChip } from "@/components/status";
import {
  amberRisks,
  greenRisks,
  redRisks,
  riskColor,
  riskScore,
  risks,
} from "@/lib/services/governance-service";
import type { RagColor } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risks")({
  head: () => ({
    meta: [
      { title: "Risk Cockpit — NGET AI Governance Assurance POC" },
      { name: "description", content: "18 synthesised risks on a likelihood × impact matrix: 8 red, 7 amber, 3 green. POC demo mode." },
      { property: "og:title", content: "Risk Cockpit — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "18 synthesised risks on a likelihood × impact matrix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RiskCockpitPage,
});

const CELL_BG: Record<RagColor, string> = {
  red: "bg-destructive/15",
  amber: "bg-warning/15",
  green: "bg-success/10",
};

function RiskCockpitPage() {
  const [filter, setFilter] = useState<RagColor | "all">("all");
  const navigate = useNavigate();

  const byCell = new Map<string, typeof risks>();
  for (const r of risks) {
    const k = `${r.likelihood}-${r.impact}`;
    byCell.set(k, [...(byCell.get(k) ?? []), r]);
  }

  const filtered = risks
    .filter((r) => filter === "all" || riskColor(r) === filter)
    .sort((a, b) => riskScore(b) - riskScore(a));

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Risk Cockpit" }]}
        title="Risk cockpit"
        subtitle="18 risks synthesised from assessment gaps. Score = likelihood × impact (5×5). Red ≥ 15, amber 8–14, green ≤ 7."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {/* Matrix */}
        <section className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Likelihood × impact</h2>
          <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1">
            <div />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="pb-1 text-center font-mono text-[10px] text-muted-foreground">
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
                  const color: RagColor = score >= 15 ? "red" : score >= 8 ? "amber" : "green";
                  const cellRisks = byCell.get(`${l}-${i}`) ?? [];
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex min-h-12 flex-wrap items-center justify-center gap-1 rounded p-1",
                        CELL_BG[color],
                      )}
                    >
                      {cellRisks.map((r) => (
                        <button
                          key={r.id}
                          onClick={() =>
                            navigate({ to: "/risks/$riskId", params: { riskId: r.id } })
                          }
                          title={`${r.id}: ${r.title}`}
                          className="rounded bg-card px-1 py-0.5 font-mono text-[9px] font-semibold text-foreground shadow-sm ring-1 ring-border hover:ring-primary"
                        >
                          {r.id.replace("RSK-0", "R")}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-destructive" /> {redRisks.length} red
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-warning" /> {amberRisks.length} amber
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-success" /> {greenRisks.length} green
            </span>
          </div>
        </section>

        {/* Register */}
        <section className="rounded-xl border border-border bg-card xl:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">Risk register</h2>
            <div className="flex gap-1">
              {(["all", "red", "amber", "green"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize",
                    filter === f
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.id}>
                <Link
                  to="/risks/$riskId"
                  params={{ riskId: r.id }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30"
                >
                  <RiskScoreChip score={riskScore(r)} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{r.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono">{r.id}</span>
                      <FrameworkBadge code={r.frameworkCode} />
                      <span>{r.owner}</span>
                      <span>due {r.dueDate}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                      r.status === "open"
                        ? "bg-destructive/10 text-destructive"
                        : r.status === "mitigating"
                          ? "bg-info/10 text-info"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {r.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
