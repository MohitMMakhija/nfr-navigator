import type {
  ApprovalItem,
  AssessmentStep,
  TraceEntry,
} from "./types";

export const ASSESSMENT = {
  id: "A-001",
  label: "Assessment #001",
  project: "Smart Grid Modernisation",
  programme: "TP500",
  gate: "Stage Gate A",
  status: "Complete",
  startedAt: "22 Aug 2026, 09:14:02",
  completedAt: "22 Aug 2026, 09:14:40",
  duration: "38s",
  model: "gov-assure-sim v0.9 (simulated — POC DEMO MODE)",
  assessor: "AI Assessment Engine (POC DEMO)",
  sponsor: "D. Trevelyan",
};

// The simulated seven-step AI assessment pipeline.
export const SEVEN_STEPS: AssessmentStep[] = [
  {
    n: 1,
    key: "ingest",
    name: "Artefact Ingestion",
    description: "Registering and verifying the six submitted project artefacts.",
    durationMs: 1400,
    stats: ["6 artefacts verified", "Checksums matched 6/6", "212 pages queued"],
  },
  {
    n: 2,
    key: "chunk",
    name: "Document Chunking & Indexing",
    description: "Segmenting artefacts into retrievable, cited evidence units.",
    durationMs: 1800,
    stats: ["1,284 chunks created", "Semantic index built", "Section map resolved"],
  },
  {
    n: 3,
    key: "map",
    name: "Policy Mapping",
    description: "Mapping 94 requirements across NFR, BSR and ITC to artefact sections.",
    durationMs: 1600,
    stats: ["94 requirements mapped", "3 frameworks loaded", "17 policies linked"],
  },
  {
    n: 4,
    key: "extract",
    name: "Evidence Extraction",
    description: "Extracting and classifying supporting and contradicting evidence.",
    durationMs: 2200,
    stats: ["128 evidence snippets", "24 high-relevance citations", "9 contradictions flagged"],
  },
  {
    n: 5,
    key: "score",
    name: "Compliance Scoring",
    description: "Scoring each requirement with RAG status and confidence.",
    durationMs: 1900,
    stats: ["59 compliant", "18 partial", "17 gaps", "Weighted score 72%"],
  },
  {
    n: 6,
    key: "risk",
    name: "Risk Synthesis",
    description: "Consolidating gaps and contradictions into a scored risk register.",
    durationMs: 1700,
    stats: ["18 risks raised", "8 red", "7 amber", "3 green"],
  },
  {
    n: 7,
    key: "recommend",
    name: "Recommendation Generation",
    description: "Drafting mitigations, gate conditions and the executive summary.",
    durationMs: 1800,
    stats: ["22 mitigations drafted", "4 gate conditions", "Summary ready for review"],
  },
];

export const TRACE: TraceEntry[] = [
  { step: 1, at: "09:14:02.114", event: "ingest.start", detail: "Artefact manifest received: 6 files, 27.2 MB total.", tokensIn: 0, tokensOut: 0 },
  { step: 1, at: "09:14:02.908", event: "ingest.verified", detail: "SHA checksums verified for all 6 artefacts; versions matched to manifest.", tokensIn: 0, tokensOut: 0 },
  { step: 2, at: "09:14:03.301", event: "chunk.build", detail: "1,284 evidence chunks created across 212 pages; section hierarchy resolved for 6/6 artefacts.", tokensIn: 0, tokensOut: 0 },
  { step: 2, at: "09:14:04.552", event: "chunk.index", detail: "Semantic index built; retrieval smoke test passed on 12 probe queries.", tokensIn: 0, tokensOut: 0 },
  { step: 3, at: "09:14:05.011", event: "map.frameworks", detail: "Frameworks loaded: NFR v4.2.1 (40), BSR v2.3 (30), ITC v3.1 (24) — 94 requirements.", tokensIn: 4210, tokensOut: 388 },
  { step: 3, at: "09:14:06.207", event: "map.complete", detail: "94/94 requirements mapped to candidate artefact sections; 0 unmapped.", tokensIn: 8112, tokensOut: 1204 },
  { step: 4, at: "09:14:06.880", event: "extract.pass1", detail: "128 evidence snippets extracted; 24 classified high-relevance.", tokensIn: 52044, tokensOut: 9317 },
  { step: 4, at: "09:14:08.402", event: "extract.contradiction", detail: "Contradiction: EV-002 (archive unencrypted) vs BSR-ENC-01 scope statement. Flagged for scoring.", tokensIn: 12008, tokensOut: 642 },
  { step: 4, at: "09:14:08.994", event: "extract.contradiction", detail: "Contradiction: EV-004 (60-min tablet timeout) vs BSR-SES-01 (15-min policy). Flagged.", tokensIn: 9912, tokensOut: 511 },
  { step: 5, at: "09:14:09.401", event: "score.rag", detail: "RAG thresholds applied: green ≥ 80, amber 60–79, red < 60. Weighted compliance 72%.", tokensIn: 31204, tokensOut: 2880 },
  { step: 5, at: "09:14:10.755", event: "score.confidence", detail: "Confidence calibrated from evidence recency, directness and corroboration count. Mean 84%.", tokensIn: 18412, tokensOut: 1109 },
  { step: 6, at: "09:14:11.203", event: "risk.synthesise", detail: "17 gaps + 9 contradictions consolidated into 18 risks; scored likelihood × impact (5×5).", tokensIn: 22140, tokensOut: 3902 },
  { step: 6, at: "09:14:12.486", event: "risk.register", detail: "Register written: 8 red, 7 amber, 3 green. Top: RSK-001 (20), RSK-002/003/004/006 (16).", tokensIn: 6208, tokensOut: 1440 },
  { step: 7, at: "09:14:13.002", event: "recommend.draft", detail: "22 mitigations drafted with effort sizing, owners and due dates.", tokensIn: 26810, tokensOut: 6614 },
  { step: 7, at: "09:14:14.118", event: "recommend.gate", detail: "Stage Gate A verdict drafted: CONDITIONALLY READY with 4 conditions precedent.", tokensIn: 14976, tokensOut: 2210 },
  { step: 7, at: "09:14:14.806", event: "recommend.complete", detail: "Assessment #001 complete in 38s. Awaiting human review and approval.", tokensIn: 0, tokensOut: 0 },
];

export const APPROVALS: ApprovalItem[] = [
  {
    id: "APR-001",
    title: "Stage Gate A — Conditional Readiness",
    type: "stage-gate",
    requestedBy: "AI Assessment Engine (POC DEMO)",
    requestedAt: "22 Aug 2026, 09:15",
    context:
      "Assessment #001 recommends CONDITIONAL readiness for Stage Gate A, subject to four conditions precedent. Weighted compliance 72% with 8 red risks open.",
    linkedIds: ["A-001"],
  },
  {
    id: "APR-002",
    title: "Red Risk Treatment Plan (RSK-001 … RSK-008)",
    type: "risk-treatment",
    requestedBy: "AI Assessment Engine (POC DEMO)",
    requestedAt: "22 Aug 2026, 09:15",
    context:
      "Treatment plan covering the 8 red risks: 16 recommended mitigations with owners and dates. Requires Risk & Compliance Lead approval before Stage Gate A submission.",
    linkedIds: ["RSK-001", "RSK-002", "RSK-003", "RSK-004", "RSK-005", "RSK-006", "RSK-007", "RSK-008"],
  },
  {
    id: "APR-003",
    title: "Executive Summary — Sign-off for Distribution",
    type: "summary",
    requestedBy: "M. Makhija",
    requestedAt: "22 Aug 2026, 09:20",
    context:
      "Generated executive summary of Assessment #001 for the TP500 steering group. Requires Project Manager sign-off before distribution.",
    linkedIds: ["A-001"],
  },
  {
    id: "APR-004",
    title: "Residual Risk Acceptance — RSK-012 Backup Key Custody",
    type: "risk-acceptance",
    requestedBy: "R. Okafor",
    requestedAt: "22 Aug 2026, 10:02",
    context:
      "Proposal to accept residual amber risk RSK-012 for 90 days while MIT-020 (regional key separation) is delivered.",
    linkedIds: ["RSK-012", "MIT-020"],
  },
];

export const GATE_CRITERIA = [
  {
    id: "GC-1",
    name: "Policy baseline assessed",
    note: "94/94 requirements assessed across NFR, BSR and ITC with cited evidence.",
    rag: "green" as const,
  },
  {
    id: "GC-2",
    name: "No unremediated critical security gaps",
    note: "6 critical penetration-test findings open > 90 days; remediation sprint proposed (MIT-011).",
    rag: "red" as const,
  },
  {
    id: "GC-3",
    name: "Data protection obligations met",
    note: "DPIA excludes telemetry PII flows; non-prod refresh uses unmasked production data.",
    rag: "red" as const,
  },
  {
    id: "GC-4",
    name: "Recovery capability demonstrated",
    note: "No full failover in 14 months; last exercise missed the 4h RTO by 5h 40m.",
    rag: "amber" as const,
  },
  {
    id: "GC-5",
    name: "Risk register and treatment plan approved",
    note: "18 risks synthesised; treatment plan pending Risk & Compliance Lead approval (APR-002).",
    rag: "amber" as const,
  },
  {
    id: "GC-6",
    name: "Evidence traceability maintained",
    note: "128 evidence snippets linked to requirements and risks; full trace retained.",
    rag: "green" as const,
  },
];

export const GATE_CONDITIONS = [
  {
    id: "COND-1",
    title: "Close critical penetration-test findings",
    detail: "Remediate the 6 critical findings (or apply approved mitigations) before Gate A submission. Owner: R. Okafor. Due: 19 Sep 2026.",
    linkedId: "MIT-011",
  },
  {
    id: "COND-2",
    title: "Encrypt the meter archive tier",
    detail: "Enable at-rest encryption on the HMA tier and migrate key custody to the managed KMS. Owner: R. Okafor. Due: 30 Sep 2026.",
    linkedId: "MIT-001",
  },
  {
    id: "COND-3",
    title: "Complete DPIA addendum and mask non-prod data",
    detail: "Extend the DPIA to telemetry PII flows and add anonymisation to the non-prod refresh. Owner: L. Fernandes. Due: 26 Sep 2026.",
    linkedId: "MIT-015",
  },
  {
    id: "COND-4",
    title: "Demonstrate DR failover within RTO",
    detail: "Execute a full failover exercise achieving the 4h RTO before Gate B. Owner: J. Osei. Due: 31 Oct 2026.",
    linkedId: "MIT-005",
  },
];

export const POC_METRICS = [
  {
    id: "pm-1",
    label: "Time to full assessment",
    value: "38s",
    baseline: "≈ 4.5 working days manual",
    desc: "End-to-end AI assessment of 94 requirements across 6 artefacts, vs typical manual review effort for a Stage Gate A submission.",
  },
  {
    id: "pm-2",
    label: "Requirement coverage",
    value: "100%",
    baseline: "94 / 94 requirements",
    desc: "Every requirement in the NFR, BSR and ITC frameworks was mapped, scored and given a confidence rating — no sampling.",
  },
  {
    id: "pm-3",
    label: "Evidence traceability",
    value: "128",
    baseline: "24 high-relevance citations",
    desc: "Evidence snippets extracted with artefact, page and section references, each linked back to requirements and risks.",
  },
  {
    id: "pm-4",
    label: "Simulated precision",
    value: "92%",
    baseline: "POC target ≥ 85%",
    desc: "Agreement between AI RAG calls and the human review panel on the validated sample (mock figure for the POC).",
  },
  {
    id: "pm-5",
    label: "Analyst effort saved",
    value: "≈ 99%",
    baseline: "36h → 38s machine time",
    desc: "Human effort shifts from first-pass review to judgement: approval, challenge and treatment decisions.",
  },
  {
    id: "pm-6",
    label: "Cost avoided per gate",
    value: "£42k",
    baseline: "Estimated, per stage gate",
    desc: "Indicative avoided cost of external compliance review per stage gate, assuming two assessments per gate cycle.",
  },
];
