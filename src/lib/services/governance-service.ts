/*
 * Mock service boundary.
 *
 * Every page reads through this module rather than touching the mock data
 * directly. During real integration, replace each function body with a
 * createServerFn call or REST fetch — the signatures and return shapes are
 * the contract. No network, AI or parsing happens anywhere in this POC.
 */
import type {
  ApprovalItem,
  Artefact,
  Evidence,
  Framework,
  Mitigation,
  Policy,
  RagColor,
  RagStatus,
  Requirement,
  Risk,
} from "../mock/types";
import { frameworks, policies, requirements } from "../mock/frameworks";
import { artefacts } from "../mock/artefacts";
import { evidence } from "../mock/evidence";
import { mitigations, risks } from "../mock/risks";
import { APPROVALS, ASSESSMENT, GATE_CONDITIONS, GATE_CRITERIA, POC_METRICS, SEVEN_STEPS, TRACE } from "../mock/assessment";
import { personas } from "../mock/personas";

export const assessment = ASSESSMENT;
export const assessmentSteps = SEVEN_STEPS;
export const assessmentTrace = TRACE;
export const gateCriteria = GATE_CRITERIA;
export const gateConditions = GATE_CONDITIONS;
export const pocMetrics = POC_METRICS;
export { personas, artefacts, frameworks, policies, requirements, risks, mitigations, evidence };

export function getArtefact(id: string): Artefact | undefined {
  return artefacts.find((a) => a.id === id);
}
export function getFramework(id: string): Framework | undefined {
  return frameworks.find((f) => f.id === id);
}
export function getPolicy(id: string): Policy | undefined {
  return policies.find((p) => p.id === id);
}
export function getRequirement(id: string): Requirement | undefined {
  return requirements.find((r) => r.id === id);
}
export function getRisk(id: string): Risk | undefined {
  return risks.find((r) => r.id === id);
}
export function requirementsForPolicy(policyId: string): Requirement[] {
  return requirements.filter((r) => r.policyId === policyId);
}
export function policiesForFramework(frameworkId: string): Policy[] {
  return policies.filter((p) => p.frameworkId === frameworkId);
}
export function evidenceForRequirement(requirementId: string): Evidence[] {
  return evidence.filter((e) => e.requirementIds.includes(requirementId));
}
export function evidenceForArtefact(artefactId: string): Evidence[] {
  return evidence.filter((e) => e.artefactId === artefactId);
}
export function mitigationsForRisk(riskId: string): Mitigation[] {
  return mitigations.filter((m) => m.riskId === riskId);
}
export function risksForRequirement(requirementId: string): Risk[] {
  return risks.filter((r) => r.requirementIds.includes(requirementId));
}
export function getApprovals(): ApprovalItem[] {
  return APPROVALS;
}

// ---- Scoring model (consistent across the whole POC) ----
// Risk: likelihood (1-5) x impact (1-5). Red >= 15, amber 8-14, green <= 7.
// Compliance: weighted (compliant=1, partial=0.5, gap=0). RAG: >=80 green,
// 60-79 amber, <60 red.

export function riskScore(risk: Risk): number {
  return risk.likelihood * risk.impact;
}
export function riskColor(risk: Risk): RagColor {
  const s = riskScore(risk);
  return s >= 15 ? "red" : s >= 8 ? "amber" : "green";
}
export function ragOfPercent(pct: number): RagColor {
  return pct >= 80 ? "green" : pct >= 60 ? "amber" : "red";
}
export function weightedCompliance(reqs: Requirement[]): number {
  if (reqs.length === 0) return 0;
  const w = reqs.reduce(
    (acc, r) => acc + (r.status === "compliant" ? 1 : r.status === "partial" ? 0.5 : 0),
    0,
  );
  return Math.round((w / reqs.length) * 100);
}
export function statusCounts(reqs: Requirement[]): Record<RagStatus, number> {
  return {
    compliant: reqs.filter((r) => r.status === "compliant").length,
    partial: reqs.filter((r) => r.status === "partial").length,
    gap: reqs.filter((r) => r.status === "gap").length,
  };
}
export interface FrameworkStats {
  framework: Framework;
  total: number;
  counts: Record<RagStatus, number>;
  compliance: number;
  rag: RagColor;
  risks: number;
  redRisks: number;
}
export function frameworkStats(frameworkId: string): FrameworkStats {
  const framework = getFramework(frameworkId)!;
  const reqs = requirements.filter((r) => r.frameworkId === frameworkId);
  const fwRisks = risks.filter((r) => r.frameworkCode === framework.code);
  const compliance = weightedCompliance(reqs);
  return {
    framework,
    total: reqs.length,
    counts: statusCounts(reqs),
    compliance,
    rag: ragOfPercent(compliance),
    risks: fwRisks.length,
    redRisks: fwRisks.filter((r) => riskColor(r) === "red").length,
  };
}
export interface PolicyStats {
  policy: Policy;
  total: number;
  counts: Record<RagStatus, number>;
  compliance: number;
  rag: RagColor;
  meanConfidence: number;
}
export function policyStats(policyId: string): PolicyStats {
  const policy = getPolicy(policyId)!;
  const reqs = requirementsForPolicy(policyId);
  const compliance = weightedCompliance(reqs);
  return {
    policy,
    total: reqs.length,
    counts: statusCounts(reqs),
    compliance,
    rag: ragOfPercent(compliance),
    meanConfidence: Math.round(
      reqs.reduce((a, r) => a + r.confidence, 0) / Math.max(reqs.length, 1),
    ),
  };
}
export const redRisks = risks.filter((r) => riskColor(r) === "red");
export const amberRisks = risks.filter((r) => riskColor(r) === "amber");
export const greenRisks = risks.filter((r) => riskColor(r) === "green");
export const overallCompliance = weightedCompliance(requirements);
