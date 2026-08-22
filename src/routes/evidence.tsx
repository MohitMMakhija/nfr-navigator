import { createFileRoute, Link } from "@tanstack/react-router";
import { FileArchive, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ConfidenceMeter } from "@/components/status";
import {
  artefacts,
  evidence,
  evidenceForArtefact,
  getArtefact,
} from "@/lib/services/governance-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Traceability — NGET AI Governance Assurance POC" },
      { name: "description", content: "Every AI call traces to cited artefact evidence. POC demo mode." },
      { property: "og:title", content: "Evidence Traceability — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Every AI call traces to cited artefact evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EvidencePage,
});

const FILE_ICON = {
  pdf: <FileText className="size-4 text-destructive" />,
  docx: <FileText className="size-4 text-info" />,
  xlsx: <FileSpreadsheet className="size-4 text-success" />,
  zip: <FileArchive className="size-4 text-warning" />,
};

function EvidencePage() {
  const [artefactId, setArtefactId] = useState<string>("all");
  const items = artefactId === "all" ? evidence : evidenceForArtefact(artefactId);

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Evidence Traceability" }]}
        title="Evidence traceability"
        subtitle="Every requirement score and risk traces back to a cited snippet from the six submitted artefacts. Extraction is simulated for this POC."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-6">
        {artefacts.map((a) => (
          <button
            key={a.id}
            onClick={() => setArtefactId(artefactId === a.id ? "all" : a.id)}
            className={cn(
              "rounded-xl border p-3 text-left transition-colors",
              artefactId === a.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="flex items-center gap-1.5">{FILE_ICON[a.kind]}</div>
            <div className="mt-1.5 line-clamp-2 font-mono text-[10px] leading-tight text-foreground">
              {a.name}
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">
              {evidenceForArtefact(a.id).length} citations · {a.pages} pages
            </div>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Evidence</th>
              <th className="px-4 py-2.5 font-medium">Source</th>
              <th className="px-4 py-2.5 font-medium">Linked requirements</th>
              <th className="px-4 py-2.5 font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((e) => {
              const art = getArtefact(e.artefactId)!;
              return (
                <tr key={e.id} className="align-top hover:bg-muted/30">
                  <td className="max-w-md px-4 py-3">
                    <div className="font-mono text-[11px] font-semibold text-info">{e.id}</div>
                    <div className="mt-0.5 text-xs font-medium text-foreground">{e.title}</div>
                    <blockquote className="mt-1 border-l-2 border-primary/40 pl-2 text-xs text-muted-foreground italic">
                      “{e.excerpt}”
                    </blockquote>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-foreground">
                      {FILE_ICON[art.kind]} {art.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{e.location}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {e.requirementIds.map((rid) => (
                        <Link
                          key={rid}
                          to="/requirements/$requirementId"
                          params={{ requirementId: rid }}
                          className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-foreground hover:border-primary/50 hover:text-primary"
                        >
                          {rid}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceMeter value={e.confidence} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {items.length} snippets shown · extracted by AI evidence extraction (POC DEMO) during
        Assessment #001 · checksums verified against the artefact manifest.
      </p>
    </div>
  );
}
