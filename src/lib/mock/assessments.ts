import type { AssessmentRecord } from "./types";
import { demoArtefacts } from "./artefacts";

// The seeded POC demo assessment, always present after a reset.
export const seedAssessment: AssessmentRecord = {
  ref: "AGR-2026-001",
  projectName: "Smart Grid Modernisation",
  programme: "SCADA Migration",
  projectManager: "Mohit M Makhija",
  sponsor: "Siobhan Edgar",
  frameworkId: "arch-gov",
  createdAt: "2026-08-21T09:30:00.000Z",
  artefacts: demoArtefacts,
  isPocDemo: true,
};

const REF_PREFIX = "AGR-2026-";

export function computeNextRef(list: AssessmentRecord[]): string {
  const max = list.reduce((m, a) => {
    const n = Number.parseInt(a.ref.slice(REF_PREFIX.length), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `${REF_PREFIX}${String(max + 1).padStart(3, "0")}`;
}
