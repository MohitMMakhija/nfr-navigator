import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { RagBadge } from "@/components/status";
import { getApprovals } from "@/lib/services/governance-service";
import { useDemo } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Approvals & Audit — NGET AI Governance Assurance POC" },
      { name: "description", content: "Human-in-the-loop approval queue with full audit trail. POC demo mode." },
      { property: "og:title", content: "Approvals & Audit — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Human-in-the-loop approval queue with full audit trail." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ApprovalsPage,
});

const TYPE_ROUTE: Record<string, { to: string; label: string }> = {
  "stage-gate": { to: "/stage-gate", label: "Open gate review" },
  "risk-treatment": { to: "/mitigations", label: "Open mitigations" },
  summary: { to: "/executive-summary", label: "Open summary" },
  "risk-acceptance": { to: "/risks", label: "Open risk" },
};

function ApprovalsPage() {
  const { approvals, decideApproval, audit, personaLabel } = useDemo();
  const items = getApprovals();
  const [comments, setComments] = useState<Record<string, string>>({});

  const decide = (id: string, decision: "approved" | "rejected") => {
    decideApproval(id, decision, comments[id] || undefined);
    toast.success(`Approval ${id} ${decision}`, {
      description: "Decision written to the audit trail.",
    });
  };

  const trail = [...audit].reverse();

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Approvals & Audit" }]}
        title="Human-in-the-loop approvals"
        subtitle={`Acting as ${personaLabel}. No AI output takes effect without a human decision — every action is recorded below.`}
      />

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.map((a) => {
          const state = approvals[a.id] ?? "pending";
          const link = TYPE_ROUTE[a.type];
          return (
            <section
              key={a.id}
              className={cn(
                "rounded-xl border bg-card p-5",
                state === "approved"
                  ? "border-success/40"
                  : state === "rejected"
                    ? "border-destructive/40"
                    : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <span className="font-mono text-[11px] text-muted-foreground">{a.id}</span>
                </div>
                <RagBadge
                  color={state === "approved" ? "green" : state === "rejected" ? "red" : "amber"}
                  label={state === "pending" ? "Awaiting decision" : state}
                />
              </div>
              <h2 className="mt-2 text-sm font-semibold text-foreground">{a.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{a.context}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Requested by {a.requestedBy} · {a.requestedAt}
              </p>
              {link && (
                <Link
                  to={link.to}
                  className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                >
                  {link.label} →
                </Link>
              )}
              {state === "pending" && (
                <>
                  <textarea
                    value={comments[a.id] ?? ""}
                    onChange={(e) =>
                      setComments((c) => ({ ...c, [a.id]: e.target.value }))
                    }
                    rows={2}
                    placeholder="Optional decision comment…"
                    className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => decide(a.id, "approved")}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-success px-2 py-1.5 text-xs font-medium text-success-foreground hover:bg-success/90"
                    >
                      <Check className="size-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => decide(a.id, "rejected")}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-destructive/40 bg-destructive/5 px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                    >
                      <X className="size-3.5" /> Reject
                    </button>
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">Audit trail ({trail.length})</h2>
          <p className="text-xs text-muted-foreground">
            Immutable record of AI actions and human decisions. Newest first.
          </p>
        </div>
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted/60 backdrop-blur">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">When</th>
                <th className="px-4 py-2 font-medium">Actor</th>
                <th className="px-4 py-2 font-medium">Action</th>
                <th className="px-4 py-2 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trail.map((e) => (
                <tr key={e.id} className="align-top hover:bg-muted/30">
                  <td className="px-4 py-2 font-mono whitespace-nowrap text-muted-foreground">
                    {e.id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                    {formatDate(e.at)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        e.kind === "ai"
                          ? "bg-info/10 text-info"
                          : "bg-success/10 text-success",
                      )}
                    >
                      {e.actor}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-foreground">
                    {e.action}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
