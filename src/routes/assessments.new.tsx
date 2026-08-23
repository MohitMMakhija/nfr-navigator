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
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { DemoBadge, VerdictBadge } from "@/components/status";
import { sampleReport } from "@/lib/mock/artefacts";
import { frameworks, getFramework } from "@/lib/mock/frameworks";
import { profileForFramework } from "@/lib/mock/profiles";
import type { ArtefactKind, ArtefactMeta } from "@/lib/mock/types";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessments/new")({
  validateSearch: (search: Record<string, unknown>): { ref?: string } => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  head: () => ({
    meta: [
      { title: "New Governance Assessment — Automated Governance Artifacts Review System POC" },
      {
        name: "description",
        content:
          "Configure and run a simulated governance assessment: project details, framework, artefacts, review & run. POC demo mode.",
      },
      { property: "og:title", content: "New Governance Assessment — Automated Governance Artifacts Review System POC" },
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
  "Identifying applicable policies",
  "Assessing governance requirements",
  "Identifying potential gaps",
  "Generating recommendations",
];

type UploadStatus = "uploading" | "processing" | "indexed";
interface UploadItem extends ArtefactMeta {
  status: UploadStatus;
}

function kindFor(name: string): ArtefactKind | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "doc" || ext === "docx") return "docx";
  if (ext === "xls" || ext === "xlsx") return "xlsx";
  if (ext === "zip") return "zip";
  return null;
}

const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.zip";

function stripStatus(files: UploadItem[]): ArtefactMeta[] {
  return files.map(({ id, name, sizeMb, kind, source }) => ({
    id,
    name,
    sizeMb,
    kind,
    source,
  }));
}

function NewAssessmentWizard() {
  const { ref: searchRef } = Route.useSearch();
  const { hydrated, assessments, createDraft, updateDraft, completeAssessment } =
    useDemo();
  const navigate = useNavigate();
  const draft = assessments.find((a) => a.ref === searchRef);

  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [programme, setProgramme] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [frameworkId, setFrameworkId] = useState("");
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runStep, setRunStep] = useState(0);
  const [runDone, setRunDone] = useState(false);
  const [syncedRef, setSyncedRef] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const counter = useRef(0);
  const ensuring = useRef(false);

  // "+ New Assessment" creates the draft up front and lands here with its
  // ref. Direct visits (or stale refs after a demo reset) get a fresh draft;
  // already-assessed refs open their result page instead.
  useEffect(() => {
    if (!hydrated || ensuring.current) return;
    const rec = searchRef ? assessments.find((a) => a.ref === searchRef) : undefined;
    if (rec && rec.status === "draft") return;
    ensuring.current = true;
    if (rec) {
      navigate({
        to: "/assessments/$assessmentId",
        params: { assessmentId: rec.ref },
        replace: true,
      });
      return;
    }
    const d = createDraft();
    navigate({ to: "/assessments/new", search: { ref: d.ref }, replace: true });
  }, [hydrated, searchRef, assessments, createDraft, navigate]);

  // Copy the persisted draft into the form once it resolves (refresh-safe).
  if (draft && syncedRef !== draft.ref) {
    setSyncedRef(draft.ref);
    setProjectName(draft.projectName);
    setProgramme(draft.programme);
    setProjectManager(draft.projectManager);
    setSponsor(draft.sponsor);
    setFrameworkId(draft.frameworkId);
    setFiles(draft.artefacts.map((a) => ({ ...a, status: "indexed" as UploadStatus })));
  }

  const framework = frameworkId ? getFramework(frameworkId) : undefined;
  // Deterministic simulated result for the selected framework — only shown
  // after the run, and only persisted to the record at that point.
  const runResult = frameworkId ? profileForFramework(frameworkId).result : null;
  const allIndexed = files.length > 0 && files.every((f) => f.status === "indexed");

  const missing: string[] = [];
  if (!projectName.trim()) missing.push("a project name");
  if (!programme.trim()) missing.push("a programme");
  if (!projectManager.trim()) missing.push("a project manager");
  if (!sponsor.trim()) missing.push("a sponsor");
  if (!frameworkId) missing.push("a framework");
  if (files.length === 0) missing.push("at least one artefact");
  const canRun = missing.length === 0 && allIndexed;

  const canNext =
    step === 0
      ? projectName.trim().length > 0
      : step === 1
        ? frameworkId !== ""
        : step === 3
          ? canRun
          : true;

  if (!hydrated || !draft || draft.status !== "draft") {
    return (
      <div className="mx-auto max-w-[900px]">
        <p className="text-sm text-muted-foreground">Preparing draft assessment…</p>
      </div>
    );
  }

  const persist = (patch: Parameters<typeof updateDraft>[1]) =>
    updateDraft(draft.ref, patch);

  const applyFiles = (next: UploadItem[]) => {
    setFiles(next);
    persist({ artefacts: stripStatus(next) });
  };

  // Simulated local progression only — file contents never leave the browser.
  const simulateProgress = (id: string) => {
    window.setTimeout(
      () =>
        setFiles((s) =>
          s.map((f) => (f.id === id ? { ...f, status: "processing" } : f)),
        ),
      800,
    );
    window.setTimeout(
      () =>
        setFiles((s) => {
          const next = s.map((f) => (f.id === id ? { ...f, status: "indexed" as UploadStatus } : f));
          persist({ artefacts: stripStatus(next) });
          return next;
        }),
      1800,
    );
  };

  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list).slice(0, 10);
    if (incoming.length === 0) return;
    const supported = incoming.filter((f) => kindFor(f.name) !== null);
    const rejected = incoming.filter((f) => kindFor(f.name) === null);
    if (rejected.length > 0) {
      setUploadError(
        `Unsupported file type: ${rejected.map((f) => f.name).join(", ")}. This POC accepts PDF, DOCX, XLSX or ZIP files only.`,
      );
      toast.error("Unsupported file type", {
        description: "This POC accepts PDF, DOCX, XLSX or ZIP files only.",
      });
    } else {
      setUploadError(null);
    }
    if (supported.length === 0) return;
    const items: UploadItem[] = supported.map((f) => {
      counter.current += 1;
      return {
        id: `up-${Date.now()}-${counter.current}`,
        name: f.name,
        sizeMb: Math.max(0.1, Math.round((f.size / (1024 * 1024)) * 10) / 10),
        kind: kindFor(f.name) ?? "pdf",
        source: "upload",
        status: "uploading",
      };
    });
    applyFiles([...files, ...items]);
    for (const item of items) simulateProgress(item.id);
  };

  // Insert the pre-populated demo report — behaves identically to an upload.
  const addDemoReport = () => {
    if (files.some((f) => f.name === sampleReport.fileName)) {
      toast.info("Demo SCADA report already added");
      return;
    }
    setUploadError(null);
    counter.current += 1;
    const item: UploadItem = {
      id: `demo-report-${counter.current}`,
      name: sampleReport.fileName,
      sizeMb: sampleReport.sizeMb,
      kind: "pdf",
      source: "demo",
      status: "uploading",
    };
    applyFiles([...files, item]);
    simulateProgress(item.id);
  };

  const runAssessment = () => {
    if (!canRun || running) return;
    setRunning(true);
    setRunDone(false);
    setRunStep(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < RUN_STEPS.length) {
        setRunStep(i);
        window.setTimeout(tick, 750);
        return;
      }
      // Simulated assessment complete — only now does the draft receive its
      // deterministic framework-based result and leave Draft status.
      setRunDone(true);
      window.setTimeout(() => {
        const record = completeAssessment(draft.ref, {
          projectName: projectName.trim(),
          programme: programme.trim(),
          projectManager: projectManager.trim(),
          sponsor: sponsor.trim(),
          frameworkId,
          artefacts: stripStatus(files),
        });
        toast.success("Assessment complete (simulated)", {
          description: `${record?.ref ?? draft.ref} assessed — results are illustrative POC output.`,
        });
        navigate({
          to: "/assessments/$assessmentId",
          params: { assessmentId: draft.ref },
        });
      }, 1500);
    };
    window.setTimeout(tick, 750);
  };

  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        breadcrumbs={[
          { label: "Assessments", to: "/assessments" },
          { label: "New Governance Assessment" },
        ]}
        title="New Governance Assessment"
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
                  ["Project name", projectName, setProjectName, "projectName", "e.g. Smart Grid Modernisation"],
                  ["Programme", programme, setProgramme, "programme", "e.g. SCADA Migration"],
                  ["Project manager", projectManager, setProjectManager, "projectManager", "e.g. Mohit M Makhija"],
                  ["Sponsor", sponsor, setSponsor, "sponsor", "e.g. Siobhan Edgar"],
                ] as const
              ).map(([label, value, setter, key, placeholder]) => (
                <div key={label}>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {label}
                  </label>
                  <input
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => {
                      setter(e.target.value);
                      persist({ [key]: e.target.value });
                    }}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Assessment reference
                </label>
                <input
                  value={draft.ref}
                  readOnly
                  aria-readonly
                  className="w-full cursor-not-allowed rounded-md border border-input bg-muted/50 px-3 py-2 font-mono text-sm text-muted-foreground"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Auto-generated when this draft was created.
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
                      onChange={() => {
                        setFrameworkId(f.id);
                        persist({ frameworkId: f.id });
                      }}
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

            {!framework && (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                Select a framework above to see the policies it applies.
              </div>
            )}

            {framework && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-wide uppercase">
                  <span className="rounded-md bg-primary px-2.5 py-1 text-primary-foreground">
                    Framework
                  </span>
                  <ChevronRight className="size-3.5 text-primary" />
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">
                    Applicable policies
                  </span>
                  <ChevronRight className="size-3.5 text-primary" />
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">
                    Governance assessment
                  </span>
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
            <h2 className="text-sm font-semibold text-foreground">
              Project artefacts ({files.length})
            </h2>

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
              <div className="mt-1 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => fileInput.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <UploadCloud className="size-3.5" /> Upload Artefacts
                </button>
                <button
                  onClick={addDemoReport}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <FileText className="size-3.5" /> Use Demo SCADA Report
                </button>
              </div>
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

            {uploadError && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {uploadError}
              </p>
            )}

            {/* Downloadable sample report */}
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
                        {f.kind.toUpperCase()} · {f.sizeMb} MB ·{" "}
                        {f.source === "demo"
                          ? "POC demo report"
                          : "Selected in this browser"}
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
                      onClick={() => applyFiles(files.filter((x) => x.id !== f.id))}
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
              <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                No artefacts uploaded yet — use Upload Artefacts or the demo SCADA
                report to add at least one file before running the assessment.
              </div>
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
                      {projectName.trim() || "—"} · {programme.trim() || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Assessment reference</dt>
                    <dd className="font-mono font-medium text-foreground">{draft.ref}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Project manager</dt>
                    <dd className="font-medium text-foreground">
                      {projectManager.trim() || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Sponsor</dt>
                    <dd className="font-medium text-foreground">{sponsor.trim() || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Framework</dt>
                    <dd className="font-medium text-foreground">
                      {framework
                        ? `${framework.name} (${framework.policies.length} policies)`
                        : "Not selected"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Artefacts</dt>
                    <dd className="font-medium text-foreground">
                      {files.length === 0
                        ? "None uploaded"
                        : `${files.length} file${files.length === 1 ? "" : "s"} · ${files
                            .reduce((m, f) => m + f.sizeMb, 0)
                            .toFixed(1)} MB`}
                    </dd>
                  </div>
                </dl>
                {missing.length > 0 ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    This assessment is not ready to run — go back and add{" "}
                    {missing.join(", ")} before running the governance assessment.
                  </div>
                ) : !allIndexed ? (
                  <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-xs text-warning-foreground">
                    Files are still being processed — the Run button enables once
                    every artefact shows Indexed.
                  </div>
                ) : (
                  <div className="rounded-lg border border-info/30 bg-info/5 p-4 text-sm text-info">
                    Running the assessment plays a simulated AI review — no real
                    analysis, indexing or storage takes place. Results are
                    illustrative POC output.
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {runDone ? (
                    <Check className="size-4 text-success" />
                  ) : (
                    <Loader2 className="size-4 animate-spin text-primary" />
                  )}
                  {runDone
                    ? "Simulated assessment complete"
                    : "Simulated assessment in progress…"}
                </div>
                <ol className="space-y-2">
                  {RUN_STEPS.map((label, i) => (
                    <li key={label} className="flex items-center gap-2.5 text-sm">
                      {runDone || i < runStep ? (
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
                          runDone || i <= runStep
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {label}
                      </span>
                    </li>
                  ))}
                </ol>
                {runDone && runResult && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-success/30 bg-success/5 px-4 py-3">
                    <span className="text-sm font-semibold text-foreground">
                      Assessment complete
                    </span>
                    <VerdictBadge verdict={runResult.verdict} category={runResult.category} />
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {runResult.overall}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Opening results…
                    </span>
                  </div>
                )}
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
              disabled={!canRun || running}
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
