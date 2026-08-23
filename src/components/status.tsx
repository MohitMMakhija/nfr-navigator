import { cn } from "@/lib/utils";
import type { AssessmentStatus, OutcomeCategory, Severity } from "@/lib/mock/types";

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

const OUTCOME_STYLE: Record<OutcomeCategory, string> = {
  aligned: "border-success/40 bg-success/10 text-success",
  conditional: "border-warning/40 bg-warning/15 text-warning-foreground",
  gaps: "border-destructive/40 bg-destructive/10 text-destructive",
};

const OUTCOME_DOT: Record<OutcomeCategory, string> = {
  aligned: "bg-success",
  conditional: "bg-warning",
  gaps: "bg-destructive",
};

export function VerdictBadge({
  verdict,
  category = "conditional",
}: {
  verdict: string;
  category?: OutcomeCategory;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        OUTCOME_STYLE[category],
      )}
    >
      <span className={cn("size-1.5 rounded-full", OUTCOME_DOT[category])} />
      {verdict}
    </span>
  );
}

const STATUS_STYLE: Record<AssessmentStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  "in-review": "bg-info/10 text-info border-info/30",
  completed: "bg-success/10 text-success border-success/30",
};

const STATUS_LABEL: Record<AssessmentStatus, string> = {
  draft: "Draft",
  "in-review": "In Review",
  completed: "Completed",
};

export function StatusBadge({ status }: { status: AssessmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        STATUS_STYLE[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

// Shown wherever an outcome would appear for a draft that has not been run yet.
export function NotAssessedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
      <span className="size-1.5 rounded-full bg-muted-foreground/50" />
      Not Assessed
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
