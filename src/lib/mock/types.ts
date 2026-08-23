export type Severity = "high" | "medium" | "low";
export type ArtefactKind = "pdf" | "docx" | "xlsx" | "zip";

export interface ArtefactMeta {
  id: string;
  name: string;
  sizeMb: number;
  kind: ArtefactKind;
  source: "demo" | "upload";
}

export interface Policy {
  id: string;
  name: string;
  version: string;
  status: "active" | "draft";
  owner: string;
  purpose: string;
  keyPoints: string[];
}

export interface Framework {
  id: string;
  code: string;
  name: string;
  description: string;
  owner: string;
  version: string;
  status: "active" | "draft";
  policies: Policy[];
}

export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  policyRef: string;
  detail: string;
  recommendation: string;
}

export interface AssessmentResult {
  overall: number;
  verdict: string;
  compliant: number;
  partial: number;
  gaps: number;
  findings: Finding[];
}

export interface AssessmentRecord {
  ref: string;
  projectName: string;
  programme: string;
  projectManager: string;
  sponsor: string;
  frameworkId: string;
  createdAt: string;
  artefacts: ArtefactMeta[];
  isPocDemo?: boolean;
}
