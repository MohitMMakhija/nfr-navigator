import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { DemoBadge } from "@/components/status";
import { artefacts, frameworks } from "@/lib/services/governance-service";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessments/new")({
  head: () => ({
    meta: [
      { title: "New Assessment — NGET AI Governance Assurance POC" },
      { name: "description", content: "Configure and launch a simulated AI governance assessment. POC demo mode." },
      { property: "og:title", content: "New Assessment — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Configure and launch a simulated AI governance assessment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewAssessmentWizard,
});

const STEPS = ["Project details", "Frameworks", "Artefacts", "Review & run"];

const FILE_ICON = {
  pdf: <FileText className="size-5 text-destructive" />,
  docx: <FileText className="size-5 text-info" />,
  xlsx: <FileSpreadsheet className="size-5 text-success" />,
  zip: <FileArchive className="size-5 text-warning" />,
};

function NewAssessmentWizard() {
  const [step, setStep] = useState(0);
  const [selectedFw, setSelectedFw] = useState<string[]>(["nfr", "bsr", "itc"]);
  const navigate = useNavigate();
  const { addAudit } = useDemo();

  const canNext = step === 1 ? selectedFw.length > 0 : true;

  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "New Assessment" }]}
        title="New project assessment"
        subtitle="Configure a governance assessment for Smart Grid Modernisation / TP500. Fields are pre-populated for the demo; no data is uploaded or processed."
        actions={<DemoBadge />}
      />

      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                i < step
                  ? "border-success bg-success text-success-foreground"
                  : i === step
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground",
              )}
              aria-label={`Step ${i + 1}: ${label}`}
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </button>
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                i === step ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
          </li>
        ))}
      </ol>

      <div className="rounded-xl border border-border bg-card p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Project details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Project name", "Smart Grid Modernisation"],
                ["Programme", "TP500"],
                ["Stage gate", "Stage Gate A — Concept & Feasibility"],
                ["Assessment reference", "Assessment #001"],
                ["Project manager", "M. Makhija"],
                ["Executive sponsor", "D. Trevelyan"],
              ].map(([label, value]) => (
                <div key={label}>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {label}
                  </label>
                  <input
                    defaultValue={value}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Pre-populated for the executive demo scenario. Edits are not persisted in POC demo mode.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Compliance frameworks</h2>
            <p className="text-xs text-muted-foreground">
              Select the policy frameworks to assess against (94 requirements in total).
            </p>
            <div className="space-y-3">
              {frameworks.map((f) => {
                const checked = selectedFw.includes(f.id);
                return (
                  <label
                    key={f.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                      checked ? "border-primary/50 bg-primary/5" : "border-border hover:bg-muted/40",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedFw((s) =>
                          checked ? s.filter((x) => x !== f.id) : [...s, f.id],
                        )
                      }
                      className="mt-1"
                    />
                    <span>
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <span className="font-mono text-xs">{f.code}</span> {f.name}
                        <span className="text-xs text-muted-foreground">{f.version}</span>
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {f.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Project artefacts (6)</h2>
              <span className="text-xs text-success">All files uploaded</span>
            </div>
            <button
              onClick={() =>
                toast.info("POC demo mode", {
                  description: "Artefacts are pre-populated for the demo. No files are uploaded.",
                })
              }
              className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <UploadCloud className="size-8" />
              <span className="text-sm font-medium">Drop files here or browse (demo)</span>
              <span className="text-xs">PDF, DOCX, XLSX, ZIP — pre-populated for this POC</span>
            </button>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {artefacts.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                  {FILE_ICON[a.kind]}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-xs font-medium text-foreground">
                      {a.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {a.sizeMb} MB · {a.pages} pages · {a.uploadedBy} · {a.uploadedAt}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                    <Check className="size-3" /> Uploaded
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Review & run</h2>
            <dl className="grid gap-3 rounded-lg bg-muted/40 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Project</dt>
                <dd className="font-medium text-foreground">Smart Grid Modernisation · TP500</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Gate</dt>
                <dd className="font-medium text-foreground">Stage Gate A</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Frameworks</dt>
                <dd className="font-medium text-foreground">
                  {selectedFw.map((id) => frameworks.find((f) => f.id === id)?.code).join(", ")} —
                  94 requirements
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Artefacts</dt>
                <dd className="font-medium text-foreground">6 files · 212 pages · 27.2 MB</dd>
              </div>
            </dl>
            <div className="rounded-lg border border-info/30 bg-info/5 p-4 text-sm text-info">
              The assessment runs a simulated seven-step AI pipeline: ingestion, indexing, policy
              mapping, evidence extraction, compliance scoring, risk synthesis and recommendation
              generation. All output is mock data labelled POC DEMO MODE.
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="size-4" /> Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              Continue <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                addAudit({
                  actor: "M. Makhija",
                  action: "Assessment launched",
                  entity: "A-001",
                  detail: "Assessment #001 launched from the wizard (POC DEMO MODE).",
                  kind: "human",
                });
                navigate({ to: "/assessments/$assessmentId/run", params: { assessmentId: "A-001" } });
              }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="size-4" /> Run AI assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
