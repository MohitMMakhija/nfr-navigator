// Shared domain types for the NGET AI Governance Assurance POC.
// These mirror the shapes a real integration API would return.

export type RagStatus = "compliant" | "partial" | "gap";
export type RagColor = "green" | "amber" | "red";
export type Criticality = "critical" | "high" | "medium" | "low";

export interface Framework {
  id: string;
  code: string;
  name: string;
  version: string;
  owner: string;
  description: string;
  sourceRef: string;
}

export interface Policy {
  id: string;
  frameworkId: string;
  code: string;
  name: string;
  description: string;
  sourceRef: string;
}

export interface Requirement {
  id: string;
  code: string;
  policyId: string;
  frameworkId: string;
  title: string;
  description: string;
  criticality: Criticality;
  status: RagStatus;
  /** Simulated AI confidence, 0-100. POC DEMO only. */
  confidence: number;
  owner: string;
  /** Static simulated AI reasoning. POC DEMO only. */
  reasoning: string;
  gaps: string[];
  sourceRef: string;
  lastAssessed: string;
}

export interface Artefact {
  id: string;
  name: string;
  kind: "pdf" | "docx" | "xlsx" | "zip";
  sizeMb: number;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  status: "uploaded" | "indexed";
  sha: string;
  pages: number;
  description: string;
}

export interface Evidence {
  id: string;
  artefactId: string;
  title: string;
  excerpt: string;
  location: string;
  requirementIds: string[];
  confidence: number;
  extractedBy: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  frameworkCode: string;
  requirementIds: string[];
  likelihood: number; // 1-5
  impact: number; // 1-5
  owner: string;
  status: "open" | "mitigating" | "accepted";
  trend: "rising" | "stable" | "falling";
  identifiedBy: string;
  dueDate: string;
}

export type MitigationDecision =
  | "proposed"
  | "accepted"
  | "modified"
  | "rejected"
  | "implemented";

export interface Mitigation {
  id: string;
  riskId: string;
  title: string;
  action: string;
  rationale: string;
  effort: "S" | "M" | "L";
  owner: string;
  dueDate: string;
  confidence: number;
}

export interface ApprovalItem {
  id: string;
  title: string;
  type: "stage-gate" | "risk-treatment" | "summary" | "risk-acceptance";
  requestedBy: string;
  requestedAt: string;
  context: string;
  linkedIds: string[];
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  entity: string;
  detail: string;
  kind: "ai" | "human" | "system";
}

export type PersonaId = "pm" | "compliance" | "architect" | "pmo" | "exec";

export type DashboardWidget =
  | "kpis"
  | "frameworks"
  | "risks"
  | "matrix"
  | "approvals"
  | "activity"
  | "gate"
  | "artefacts"
  | "value";

export interface Persona {
  id: PersonaId;
  label: string;
  role: string;
  focus: string;
  widgets: DashboardWidget[];
}

export interface AssessmentStep {
  n: number;
  key: string;
  name: string;
  description: string;
  durationMs: number;
  stats: string[];
}

export interface TraceEntry {
  step: number;
  at: string;
  event: string;
  detail: string;
  tokensIn: number;
  tokensOut: number;
}
