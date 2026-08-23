import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { DemoBadge } from "@/components/status";
import { demoArtefacts, sampleReport } from "@/lib/mock/artefacts";
import { frameworks, getFramework } from "@/lib/mock/frameworks";
import type { ArtefactKind, ArtefactMeta } from "@/lib/mock/types";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessments/new")({
  head: () => ({
    meta: [
      { title: "New Assessment — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content:
          "Configure and run a simulated governance assessment: project details, framework, artefacts, review & run. POC demo mode.",
      },
      { property: "og:title", content: "New Assessment — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "Configure and run a simulated governance assessment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewAssessmentWizard,
});

const STEPS = ["Project details", "Frameworks", "Artefacts", "Review & run"];

const FILE_ICON: Record<ArtefactKind, React.ReactNode> = {
  pdf: <FileText className="size-5 text-destructive" />,
  docx: <FileText className="size-5 text-info" />,
  xlsx: <FileSpreadsheet className="size-5 text-success" />,
  zip: <FileArchive className="size-5 text-warning" />,
};

const RUN_STEPS = [
  "Reviewing project artefacts",
  "Reading documents",
  "Identifying applicable policies",
  "Assessing requirements",
  "Identifying gaps",
  "Generating recommendations",
];

type UploadStatus = "uploading" | "processing" | "indexed";
interface UploadItem extends ArtefactMeta {
  status: UploadStatus;
}

function kindFor(name: string): ArtefactKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "doc" || ext === "docx") return "docx";
  if (ext === "xls" || ext === "xlsx") return "xlsx";
  return "zip";
}

const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.zip";

function NewAssessmentWizard() {
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("Smart Grid Modernisation");
  const [programme, setProgramme] = useState("SCADA Migration");
  const [projectManager, setProjectManager] = useState("Mohit M Makhija");
  const [sponsor, setSponsor] = useState("Siobhan Edgar");
  const [frameworkId, setFrameworkId] = useState("arch-gov");
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [running, setRunning] = useState(false);
  const [runStep, setRunStep] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const counter = useRef(0);
  const navigate = useNavigate();
  const { nextRef, createAssessment } = useDemo();

  const framework = getFramework(frameworkId);
  const allIndexed = files.length > 0 && files.every((f) => f.status === "indexed");
  const canNext =
    step === 0
      ? projectName.trim().length > 0
      : step === 3
        ? allIndexed
        : true;

  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list).slice(0, 10);
    if (incoming.length === 0) return;
    const items: UploadItem[] = incoming.map((f) => {
      counter.current += 1;
      return {
        id: `up-${Date.now()}-${counter.current}`,
        name: f.name,
        sizeMb: Math.max(0.1, Math.round((f.size / (1024 * 1024)) * 10) / 10),
        kind: kindFor(f.name),
        source: "upload",
        status: "uploading",
      };
    });
    setFiles((s) => [...s, ...items]);
    // Simulated local progression only — file contents never leave the browser.
    for (const item of items) {
      window.setTimeout(
        () =>
          setFiles((s) =>
            s.map((f) => (f.id === item.id ? { ...f, status: "processing" } : f)),
          ),
        900,
      );
      window.setTimeout(
        () =>
          setFiles((s) =>
            s.map((f) => (f.id === item.id ? { ...f, status: "indexed" } : f)),
          ),
        2000,
      );
    }
  };

  const addDemoArtefacts = () => {
    setFiles((s) => {
      const existing = new Set(s.map((f) => f.name));
      const fresh = demoArtefacts
        .filter((d) => !existing.has(d.name))
        .map((d) => ({ ...d, status: "indexed" as UploadStatus }));
      if (fresh.length === 0) {
        toast.info("Demo artefacts already added");
        return s;
      }
      return [...s, ...fresh];
    });
  };

  const runAssessment = () => {
    if (!allIndexed || running) return;
    setRunning(true);
    setRunStep(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < RUN_STEPS.length) {
        setRunStep(i);
        window.setTimeout(tick, 750);
      } else {
        const record = createAssessment({
          projectName: projectName.trim(),
          programme: programme.trim(),
          projectManager: projectManager.trim(),
          sponsor: sponsor.trim(),
          frameworkId,
          artefacts: files.map(({ id, name, sizeMb, kind, source }) => ({
            id,
            name,
            sizeMb,
            kind,
            source,
          })),
        });
        toast.success("Assessment complete (simulated)", {
          description: `${record.ref} created — results are illustrative POC output.`,
        });
        navigate({
          to: "/assessments/$assessmentId",
          params: { assessmentId: record.ref },
        });
      }
    };
    window.setTimeout(tick, 750);
  };

  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        breadcrumbs={[{ label: "Assessments", to: "/assessments" }, { label: "New Assessment" }]}
        title="New governance assessment"
        subtitle="Upload artefacts, choose a framework, and run a simulated AI assessment. No real AI, storage or document processing takes place."
        actions={<DemoBadge />}
      />

      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
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
            </span>
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
              {(
                [
                  ["Project name", projectName, setProjectName],
                  ["Programme", programme, setProgramme],
                  ["Project manager", projectManager, setProjectManager],
                  ["Sponsor", sponsor, setSponsor],
                ] as const
              ).map(([label, value, setter]) => (
                <div key={label}>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {label}
                  </label>
                  <input
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Assessment reference
                </label>
                <input
                  value={nextRef}
                  readOnly
                  aria-readonly
                  className="w-full cursor-not-allowed rounded-md border border-input bg-muted/50 px-3 py-2 font-mono text-sm text-muted-foreground"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Auto-generated when the assessment is created.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Select framework</h2>
            <p className="text-xs text-muted-foreground">
              The selected framework determines the applicable policies the simulated
              assessment checks against.
            </p>
            <div className="space-y-3">
              {frameworks.map((f) => {
                const checked = frameworkId === f.id;
                return (
                  <label
                    key={f.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                      checked ? "border-primary/50 bg-primary/5" : "border-border hover:bg-muted/40",
                    )}
                  >
                    <input
                      type="radio"
                      name="framework"
                      checked={checked}
                      onChange={() => setFrameworkId(f.id)}
                      className="mt-1"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
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

            {framework && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  <span>Framework</span>
                  <ChevronRight className="size-3" />
                  <span>Applicable policies</span>
                  <ChevronRight className="size-3" />
                  <span>Assessment</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {framework.policies.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2"
                    >
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {p.id}
                      </span>
                      <span className="flex-1 text-sm text-foreground">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.version}</span>
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success capitalize">
                        {p.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                Project artefacts ({files.length})
              </h2>
              <button
                onClick={addDemoArtefacts}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                <Plus className="size-3.5" /> Add demo artefacts (POC demo data)
              </button>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                addFiles(e.dataTransfer.files);
              }}
              className={cn(
                "flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 transition-colors",
                dragging
                  ? "border-primary/60 bg-primary/5 text-foreground"
                  : "border-border bg-muted/30 text-muted-foreground",
              )}
            >
              <UploadCloud className="size-8" />
              <span className="text-sm font-medium">Drag & drop files here</span>
              <span className="text-xs">PDF, DOCX, XLSX or ZIP</span>
              <button
                onClick={() => fileInput.current?.click()}
                className="mt-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                Browse files
              </button>
              <input
                ref={fileInput}
                type="file"
                multiple
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <span className="text-[11px] text-muted-foreground/80">
                Demo only: file metadata is kept in this browser — contents are never
                uploaded or stored.
              </span>
            </div>

            {/* Sample report */}
            <div className="flex items-center gap-3 rounded-lg border border-info/30 bg-info/5 px-4 py-3">
              <FileText className="size-5 shrink-0 text-info" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">
                  {sampleReport.name}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Downloadable demo report ({sampleReport.fileName}) — illustrative POC
                  content, not a real project document.
                </div>
              </div>
              <a
                href={sampleReport.url}
                download={sampleReport.fileName}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                <Download className="size-3.5" /> Download sample
              </a>
            </div>

            {files.length > 0 && (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 px-4 py-3">
                    {FILE_ICON[f.kind]}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-xs font-medium text-foreground">
                        {f.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {f.sizeMb} MB · {f.source === "demo" ? "POC demo data" : "Selected in this browser"}
                      </div>
                    </div>
                    {f.status === "indexed" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                        <Check className="size-3" /> Indexed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-[11px] font-medium text-info">
                        <Loader2 className="size-3 animate-spin" />
                        {f.status === "uploading" ? "Uploading" : "Processing"}
                      </span>
                    )}
                    <button
                      onClick={() => setFiles((s) => s.filter((x) => x.id !== f.id))}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={`Remove ${f.name}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {files.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Add at least one artefact (your own file or the demo artefacts) to run
                the assessment.
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Review & run</h2>
            {!running ? (
              <>
                <dl className="grid gap-3 rounded-lg bg-muted/40 p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Project</dt>
                    <dd className="font-medium text-foreground">
                      {projectName} · {programme}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Assessment reference</dt>
                    <dd className="font-mono font-medium text-foreground">{nextRef}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Framework</dt>
                    <dd className="font-medium text-foreground">
                      {framework?.name} ({framework?.policies.length} policies)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Artefacts</dt>
                    <dd className="font-medium text-foreground">
                      {files.length} file{files.length === 1 ? "" : "s"} ·{" "}
                      {files.reduce((m, f) => m + f.sizeMb, 0).toFixed(1)} MB
                    </dd>
                  </div>
                </dl>
                <div className="rounded-lg border border-info/30 bg-info/5 p-4 text-sm text-info">
                  Running the assessment plays a simulated AI review — no real
                  analysis, indexing or storage takes place. Results are illustrative
                  POC output.
                </div>
              </>
            ) : (
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  Simulated assessment in progress…
                </div>
                <ol className="space-y-2">
                  {RUN_STEPS.map((label, i) => (
                    <li key={label} className="flex items-center gap-2.5 text-sm">
                      {i < runStep ? (
                        <span className="flex size-5 items-center justify-center rounded-full bg-success text-success-foreground">
                          <Check className="size-3" />
                        </span>
                      ) : i === runStep ? (
                        <span className="flex size-5 items-center justify-center rounded-full border border-primary">
                          <Loader2 className="size-3 animate-spin text-primary" />
                        </span>
                      ) : (
                        <span className="size-5 rounded-full border border-border" />
                      )}
                      <span
                        className={cn(
                          i <= runStep ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {label}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || running}
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
              onClick={runAssessment}
              disabled={!allIndexed || running}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              <Sparkles className="size-4" /> Run Governance Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
