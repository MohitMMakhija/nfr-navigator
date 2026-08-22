import { cn } from "@/lib/utils";
import type { Criticality, RagColor, RagStatus } from "@/lib/mock/types";

const RAG_DOT: Record<RagColor, string> = {
  green: "bg-success",
  amber: "bg-warning",
  red: "bg-destructive",
};

const RAG_BADGE: Record<RagColor, string> = {
  green: "bg-success/10 text-success border-success/30",
  amber: "bg-warning/15 text-warning-foreground border-warning/40",
  red: "bg-destructive/10 text-destructive border-destructive/30",
};

export function RagDot({ color, className }: { color: RagColor; className?: string }) {
  return (
    <span className={cn("inline-block size-2.5 rounded-full", RAG_DOT[color], className)} />
  );
}

const STATUS_LABEL: Record<RagStatus, string> = {
  compliant: "Compliant",
  partial: "Partial",
  gap: "Gap",
};
const STATUS_COLOR: Record<RagStatus, RagColor> = {
  compliant: "green",
  partial: "amber",
  gap: "red",
};

export function RagStatusBadge({ status }: { status: RagStatus }) {
  const color = STATUS_COLOR[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        RAG_BADGE[color],
      )}
    >
      <RagDot color={color} className="size-1.5" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function RagBadge({ color, label }: { color: RagColor; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        RAG_BADGE[color],
      )}
    >
      <RagDot color={color} className="size-1.5" />
      {label}
    </span>
  );
}

export function RiskScoreChip({ score }: { score: number }) {
  const color: RagColor = score >= 15 ? "red" : score >= 8 ? "amber" : "green";
  return (
    <span
      className={cn(
        "inline-flex min-w-8 items-center justify-center rounded-md border px-1.5 py-0.5 font-mono text-xs font-semibold",
        RAG_BADGE[color],
      )}
      title="Likelihood × impact. Red ≥ 15, amber 8–14, green ≤ 7."
    >
      {score}
    </span>
  );
}

const CRIT_STYLE: Record<Criticality, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-warning/15 text-warning-foreground border-warning/40",
  medium: "bg-info/10 text-info border-info/30",
  low: "bg-muted text-muted-foreground border-border",
};

export function CriticalityBadge({ level }: { level: Criticality }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        CRIT_STYLE[level],
      )}
    >
      {level}
    </span>
  );
}

const FW_STYLE: Record<string, string> = {
  NFR: "bg-info/10 text-info border-info/30",
  BSR: "bg-destructive/10 text-destructive border-destructive/30",
  ITC: "bg-chart-5/10 text-chart-5 border-chart-5/30",
};

export function FrameworkBadge({ code }: { code: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold",
        FW_STYLE[code] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      {code}
    </span>
  );
}

export function ConfidenceMeter({ value, showLabel = true }: { value: number; showLabel?: boolean }) {
  const color = value >= 85 ? "bg-success" : value >= 70 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
      {showLabel && (
        <span className="font-mono text-xs text-muted-foreground">{value}%</span>
      )}
    </div>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-warning/50 bg-warning/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-warning-foreground uppercase",
        className,
      )}
    >
      <span className="size-1.5 animate-pulse rounded-full bg-warning" />
      POC Demo Mode
    </span>
  );
}
