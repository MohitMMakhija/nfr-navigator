import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/mock/types";

const SEV_STYLE: Record<Severity, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-warning/15 text-warning-foreground border-warning/40",
  low: "bg-info/10 text-info border-info/30",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        SEV_STYLE[severity],
      )}
    >
      {severity}
    </span>
  );
}

export function VerdictBadge({ verdict }: { verdict: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/15 px-2.5 py-0.5 text-xs font-semibold text-warning-foreground">
      <span className="size-1.5 rounded-full bg-warning" />
      {verdict}
    </span>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary uppercase",
        className,
      )}
    >
      <span className="size-1.5 animate-pulse rounded-full bg-brand-mid" />
      POC Demo · Simulated AI
    </span>
  );
}
