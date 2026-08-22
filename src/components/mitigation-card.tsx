import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfidenceMeter } from "@/components/status";
import type { Mitigation, MitigationDecision } from "@/lib/mock/types";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

const DECISION_STYLE: Record<MitigationDecision, string> = {
  proposed: "bg-info/10 text-info border-info/30",
  accepted: "bg-success/10 text-success border-success/30",
  modified: "bg-warning/15 text-warning-foreground border-warning/40",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  implemented: "bg-success text-success-foreground border-success",
};

export function MitigationCard({ mitigation }: { mitigation: Mitigation }) {
  const { mitigationDecisions, decideMitigation } = useDemo();
  const state = mitigationDecisions[mitigation.id];
  const status = state?.status ?? "proposed";
  const [dialog, setDialog] = useState<"modify" | "reject" | null>(null);
  const [note, setNote] = useState("");

  const decide = (d: MitigationDecision, n?: string) => {
    decideMitigation(mitigation.id, d, n);
    toast.success(`Mitigation ${mitigation.id} ${d}`, {
      description: "Decision recorded in the audit trail.",
    });
    setDialog(null);
    setNote("");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">{mitigation.id}</span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
                DECISION_STYLE[status],
              )}
            >
              {status}
            </span>
          </div>
          <h3 className="mt-1 text-sm font-semibold text-foreground">{mitigation.title}</h3>
        </div>
        <ConfidenceMeter value={mitigation.confidence} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{mitigation.action}</p>
      <p className="mt-2 text-xs text-muted-foreground italic">
        AI rationale (simulated): {mitigation.rationale}
      </p>
      {state?.note && (
        <p className="mt-2 rounded-md bg-muted/60 px-2.5 py-1.5 text-xs text-foreground">
          Reviewer note: {state.note}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span>Effort: {mitigation.effort}</span>
        <span>Owner: {mitigation.owner}</span>
        <span>Due: {mitigation.dueDate}</span>
      </div>
      <div className="mt-3 flex gap-2 border-t border-border pt-3">
        <button
          onClick={() => decide("accepted")}
          disabled={status === "accepted"}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-success px-2 py-1.5 text-xs font-medium text-success-foreground hover:bg-success/90 disabled:opacity-40"
        >
          <Check className="size-3.5" /> Accept
        </button>
        <button
          onClick={() => setDialog("modify")}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-warning/50 bg-warning/10 px-2 py-1.5 text-xs font-medium text-warning-foreground hover:bg-warning/20"
        >
          <Pencil className="size-3.5" /> Modify
        </button>
        <button
          onClick={() => setDialog("reject")}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-destructive/40 bg-destructive/5 px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
        >
          <X className="size-3.5" /> Reject
        </button>
      </div>

      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog === "modify" ? "Modify mitigation" : "Reject mitigation"} — {mitigation.id}
            </DialogTitle>
            <DialogDescription>
              {dialog === "modify"
                ? "Record how you are changing the AI recommendation. The decision and note are written to the audit trail."
                : "Record the reason for rejection. Rejected recommendations remain visible for audit."}
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={
              dialog === "modify"
                ? "e.g. Accept, but extend due date to 15 Oct and reassign to J. Osei…"
                : "e.g. Rejected — compensating control already in place via MDM…"
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
          />
          <DialogFooter>
            <button
              onClick={() => setDialog(null)}
              className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={() => decide(dialog === "modify" ? "modified" : "rejected", note || undefined)}
              disabled={!note.trim()}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              Confirm {dialog}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
