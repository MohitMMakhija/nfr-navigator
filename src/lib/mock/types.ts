export type Severity = "high" | "medium" | "low";
export type ArtefactKind = "pdf" | "docx" | "xlsx" | "zip";
export type AssessmentStatus = "draft" | "in-review" | "completed";
export type OutcomeCategory = "aligned" | "conditional" | "gaps";

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
  category: OutcomeCategory;
  compliant: number;
  partial: number;
  gaps: number;
  narrative: string;
  findings: Finding[];
}

// A fixed, deterministic demo result profile. Every assessment points at one
// of these, so scores, outcomes and findings never change between refreshes.
export interface AssessmentProfile {
  id: string;
  ref: string;
  projectName: string;
  programme: string;
  projectManager: string;
  sponsor: string;
  frameworkId: string;
  status: AssessmentStatus;
  createdAt: string;
  artefacts: ArtefactMeta[];
  result: AssessmentResult;
}

export interface AssessmentRecord {
  ref: string;
  projectName: string;
  programme: string;
  projectManager: string;
  sponsor: string;
  // "" while a draft has not selected a framework yet.
  frameworkId: string;
  // null while the record is a draft — no result exists until the
  // simulated assessment has been run.
  profileId: string | null;
  status: AssessmentStatus;
  createdAt: string;
  artefacts: ArtefactMeta[];
  isPocDemo?: boolean;
}
