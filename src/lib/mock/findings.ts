import type { AssessmentResult } from "./types";

// Simulated assessment output. Identical illustrative result for every
// assessment in this POC — clearly labelled POC Demo Mode in the UI.
export const mockResult: AssessmentResult = {
  overall: 72,
  verdict: "Conditional",
  compliant: 18,
  partial: 7,
  gaps: 5,
  findings: [
    {
      id: "F-01",
      severity: "high",
      title: "Solution design sign-off not evidenced",
      policyRef: "SDP-002",
      detail:
        "The architecture report references design authority review, but no recorded sign-off for the SCADA target architecture is included in the submitted artefacts.",
      recommendation:
        "Obtain and record Design Authority approval for the SCADA target architecture before build proceeds.",
    },
    {
      id: "F-02",
      severity: "high",
      title: "Integration approach deviates from approved patterns",
      policyRef: "IAP-004",
      detail:
        "Two proposed point-to-point interfaces between the migrated SCADA platform and historian components bypass the enterprise integration layer, with no derogation recorded.",
      recommendation:
        "Re-route interfaces through the approved integration patterns or register a formal derogation with Integration Architecture.",
    },
    {
      id: "F-03",
      severity: "medium",
      title: "Technology standard exceptions not time-bound",
      policyRef: "TSP-003",
      detail:
        "The NFR compliance workbook lists three technology exceptions, none of which carry an expiry or review date as required by the exception process.",
      recommendation:
        "Register each exception with a time-bound expiry and schedule periodic reviews until retired.",
    },
    {
      id: "F-04",
      severity: "medium",
      title: "Architecture decision records incomplete",
      policyRef: "AGP-001",
      detail:
        "Key migration decisions (hosting topology, session handling) are described in narrative form but are not captured as architecture decision records.",
      recommendation:
        "Backfill the ADR log for all material migration decisions and link it from the architecture report.",
    },
    {
      id: "F-05",
      severity: "low",
      title: "Architecture repository not refreshed post-baseline",
      policyRef: "AGP-001",
      detail:
        "Repository artefacts referenced by the project pre-date the latest architecture baseline by two review cycles.",
      recommendation:
        "Refresh the architecture repository at the next governance checkpoint and confirm version alignment.",
    },
  ],
};
