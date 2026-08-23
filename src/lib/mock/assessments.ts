import type { AssessmentRecord } from "./types";
import { profiles } from "./profiles";

// The seeded POC demo assessments, always present after a reset. Each record
// points at a fixed deterministic profile, so results never change.
export const seedAssessments: AssessmentRecord[] = profiles.map((p) => ({
  ref: p.ref,
  projectName: p.projectName,
  programme: p.programme,
  projectManager: p.projectManager,
  sponsor: p.sponsor,
  frameworkId: p.frameworkId,
  profileId: p.id,
  status: p.status,
  createdAt: p.createdAt,
  artefacts: p.artefacts,
  isPocDemo: true,
}));

const REF_PREFIX = "AGR-2026-";

export function computeNextRef(list: AssessmentRecord[]): string {
  const max = list.reduce((m, a) => {
    const n = Number.parseInt(a.ref.slice(REF_PREFIX.length), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `${REF_PREFIX}${String(max + 1).padStart(3, "0")}`;
}
