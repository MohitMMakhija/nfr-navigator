import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { FrameworkBadge, RagBadge } from "@/components/status";
import { frameworks, policies, policyStats } from "@/lib/services/governance-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/policies/")({
  head: () => ({
    meta: [
      { title: "Policy Library — NGET AI Governance Assurance POC" },
      { name: "description", content: "All NFR, BSR and ITC policies with requirement posture. POC demo mode." },
      { property: "og:title", content: "Policy Library — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "All NFR, BSR and ITC policies with requirement posture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PolicyLibraryPage,
});

function PolicyLibraryPage() {
  const [q, setQ] = useState("");
  const [fw, setFw] = useState<string>("all");

  const filtered = useMemo(
    () =>
      policies.filter(
        (p) =>
          (fw === "all" || p.frameworkId === fw) &&
          (q === "" ||
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.code.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, fw],
  );

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Policy Library" }]}
        title="Policy library"
        subtitle="17 policies · 94 requirements. Select a policy for requirement-level detail, evidence and AI reasoning."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search policies…"
            className="w-64 rounded-md border border-input bg-card py-2 pr-3 pl-8 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          {["all", ...frameworks.map((f) => f.id)].map((id) => (
            <button
              key={id}
              onClick={() => setFw(id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                fw === id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {id === "all" ? "All" : frameworks.find((f) => f.id === id)!.code}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Policy</th>
              <th className="px-4 py-2.5 font-medium">Framework</th>
              <th className="px-4 py-2.5 text-right font-medium">Reqs</th>
              <th className="px-4 py-2.5 text-right font-medium">Gaps</th>
              <th className="px-4 py-2.5 text-right font-medium">Compliance</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => {
              const s = policyStats(p.id);
              return (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      to="/policies/$policyId"
                      params={{ policyId: p.id }}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {p.name}
                    </Link>
                    <div className="font-mono text-[11px] text-muted-foreground">{p.code}</div>
                  </td>
                  <td className="px-4 py-3">
                    <FrameworkBadge
                      code={frameworks.find((f) => f.id === p.frameworkId)!.code}
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{s.total}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">
                    <span className={s.counts.gap > 0 ? "text-destructive" : "text-muted-foreground"}>
                      {s.counts.gap}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RagBadge color={s.rag} label={`${s.compliance}%`} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/policies/$policyId"
                      params={{ policyId: p.id }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Open <ArrowRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No policies match your search.
          </div>
        )}
      </div>
    </div>
  );
}
