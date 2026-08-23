import type { AssessmentProfile, AssessmentRecord, AssessmentResult } from "./types";
import { demoArtefacts } from "./artefacts";

/*
 * Deterministic demo result profiles — the single shared dataset behind the
 * Dashboard, Assessment Detail, Findings & Recommendations and simulated runs.
 * Nothing here is random: every assessment resolves to one fixed profile, so
 * results are identical across refreshes and demo sessions.
 */

export const profiles: AssessmentProfile[] = [
  {
    id: "p-sgm",
    ref: "AGR-2026-001",
    projectName: "Smart Grid Modernisation",
    programme: "SCADA Migration",
    projectManager: "Mohit M Makhija",
    sponsor: "Siobhan Edgar",
    frameworkId: "arch-gov",
    status: "in-review",
    createdAt: "2026-08-21T09:30:00.000Z",
    artefacts: demoArtefacts,
    result: {
      overall: 72,
      verdict: "Conditional Alignment",
      category: "conditional",
      compliant: 18,
      partial: 7,
      gaps: 5,
      narrative:
        "The SCADA Migration artefacts are broadly aligned with the Architecture Governance Framework. Alignment is conditional on closing the four high-severity findings — principally design sign-off and integration-pattern deviations — before the next governance checkpoint.",
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
          severity: "high",
          title: "Non-functional requirements not traceable to verification",
          policyRef: "SDP-002",
          detail:
            "The NFR compliance workbook lists mandatory non-functional requirements, but the artefacts contain no mapping from each requirement to the test or acceptance evidence that will demonstrate it.",
          recommendation:
            "Add a requirements-to-verification traceability matrix to the compliance workbook and link it from the architecture report.",
        },
        {
          id: "F-04",
          severity: "high",
          title: "Hosting topology deviates from approved platform standards",
          policyRef: "TSP-003",
          detail:
            "The proposed hosting topology for the migrated SCADA platform uses components outside the approved platform standards, and no technology exception has been registered.",
          recommendation:
            "Align the topology to approved platform standards or register a justified, time-bound technology exception.",
        },
        {
          id: "F-05",
          severity: "medium",
          title: "Technology standard exceptions not time-bound",
          policyRef: "TSP-003",
          detail:
            "The NFR compliance workbook lists three technology exceptions, none of which carry an expiry or review date as required by the exception process.",
          recommendation:
            "Register each exception with a time-bound expiry and schedule periodic reviews until retired.",
        },
        {
          id: "F-06",
          severity: "medium",
          title: "Architecture decision records incomplete",
          policyRef: "AGP-001",
          detail:
            "Key migration decisions (hosting topology, session handling) are described in narrative form but are not captured as architecture decision records.",
          recommendation:
            "Backfill the ADR log for all material migration decisions and link it from the architecture report.",
        },
        {
          id: "F-07",
          severity: "medium",
          title: "Interface register not updated for migrated interfaces",
          policyRef: "IAP-004",
          detail:
            "The integration register does not yet include the interfaces introduced by the migrated SCADA platform, so interface ownership and data contracts are unclear.",
          recommendation:
            "Catalogue all migrated interfaces in the integration register with owning team and canonical data model references.",
        },
        {
          id: "F-08",
          severity: "medium",
          title: "Operational acceptance criteria missing from design",
          policyRef: "SDP-002",
          detail:
            "The solution design does not define the operational acceptance criteria that the migrated service must meet before handover to operations.",
          recommendation:
            "Define measurable operational acceptance criteria and have them agreed with IT Operations before cutover planning.",
        },
        {
          id: "F-09",
          severity: "medium",
          title: "Reuse of enterprise services not assessed",
          policyRef: "AGP-001",
          detail:
            "The artefacts do not record an assessment of existing enterprise services that could be reused instead of building new components.",
          recommendation:
            "Document a reuse assessment against the enterprise service catalogue and record the outcome as an ADR.",
        },
        {
          id: "F-10",
          severity: "low",
          title: "Architecture repository not refreshed post-baseline",
          policyRef: "AGP-001",
          detail:
            "Repository artefacts referenced by the project pre-date the latest architecture baseline by two review cycles.",
          recommendation:
            "Refresh the architecture repository at the next governance checkpoint and confirm version alignment.",
        },
        {
          id: "F-11",
          severity: "low",
          title: "Technology version references inconsistent across artefacts",
          policyRef: "TSP-003",
          detail:
            "Component versions cited in the architecture report and the NFR workbook differ for two shared platform components.",
          recommendation:
            "Reconcile version references across artefacts to a single approved component list.",
        },
        {
          id: "F-12",
          severity: "low",
          title: "Architecture diagrams not at current baseline version",
          policyRef: "SDP-002",
          detail:
            "Two diagrams in the architecture report are marked as draft and do not reflect the approved baseline.",
          recommendation:
            "Update the diagrams to the approved baseline and re-issue the architecture report.",
        },
      ],
    },
  },
  {
    id: "p-noi",
    ref: "AGR-2026-002",
    projectName: "NOI Project",
    programme: "Network Operations Infrastructure (NOI)",
    projectManager: "Rita Okafor",
    sponsor: "Simon Whitfield",
    frameworkId: "arch-gov",
    status: "completed",
    createdAt: "2026-08-14T10:05:00.000Z",
    artefacts: [
      { id: "noi-1", name: "NOI-Architecture-Overview-v2.0.pdf", sizeMb: 3.1, kind: "pdf", source: "demo" },
      { id: "noi-2", name: "NOI-Solution-Design-v1.8.pdf", sizeMb: 4.4, kind: "pdf", source: "demo" },
      { id: "noi-3", name: "NOI-Integration-Catalogue-v1.2.xlsx", sizeMb: 0.8, kind: "xlsx", source: "demo" },
      { id: "noi-4", name: "NOI-Governance-Checklist-v1.0.docx", sizeMb: 0.6, kind: "docx", source: "demo" },
    ],
    result: {
      overall: 84,
      verdict: "Aligned with Minor Actions",
      category: "aligned",
      compliant: 22,
      partial: 5,
      gaps: 3,
      narrative:
        "The NOI Project artefacts demonstrate strong alignment with the Architecture Governance Framework. No high-severity findings were identified; a small set of minor actions remains to keep the record complete and current.",
      findings: [
        {
          id: "F-01",
          severity: "medium",
          title: "ADR log missing two late-stage decisions",
          policyRef: "AGP-001",
          detail:
            "Two decisions taken during detailed design (failover approach, monitoring stack) are not yet captured in the architecture decision record log.",
          recommendation:
            "Record both decisions as ADRs before the next governance checkpoint.",
        },
        {
          id: "F-02",
          severity: "medium",
          title: "One interface pending catalogue registration",
          policyRef: "IAP-004",
          detail:
            "The new interface to the outage management system is implemented but not yet registered in the integration catalogue.",
          recommendation:
            "Register the interface with its owning team and data contract in the integration catalogue.",
        },
        {
          id: "F-03",
          severity: "medium",
          title: "Design re-approval for scope change in progress",
          policyRef: "SDP-002",
          detail:
            "A material scope change (additional regional site) requires design re-approval; the re-approval request is drafted but not yet submitted.",
          recommendation:
            "Submit the re-approval request to the Design Authority and record the outcome.",
        },
        {
          id: "F-04",
          severity: "low",
          title: "Component version drift in non-production environment",
          policyRef: "TSP-003",
          detail:
            "The test environment runs a component version one patch behind the approved standard.",
          recommendation:
            "Bring the test environment to the approved component version at the next maintenance window.",
        },
        {
          id: "F-05",
          severity: "low",
          title: "Repository cross-references need refresh",
          policyRef: "AGP-001",
          detail:
            "Two cross-references in the architecture repository point to superseded document versions.",
          recommendation:
            "Update the cross-references to current versions at the next repository refresh.",
        },
        {
          id: "F-06",
          severity: "low",
          title: "Traceability annex formatting inconsistent",
          policyRef: "SDP-002",
          detail:
            "The requirements traceability annex uses two different numbering conventions across sections.",
          recommendation:
            "Standardise the annex numbering convention when the document is next revised.",
        },
        {
          id: "F-07",
          severity: "low",
          title: "Canonical model usage note requires clarification",
          policyRef: "IAP-004",
          detail:
            "A note on canonical model usage in the integration catalogue is ambiguous about which entity version applies.",
          recommendation:
            "Clarify the canonical entity version in the catalogue entry.",
        },
      ],
    },
  },
  {
    id: "p-gdp",
    ref: "AGR-2026-003",
    projectName: "Grid Data Platform",
    programme: "Enterprise Data Modernisation",
    projectManager: "Lena Fernandes",
    sponsor: "Marcus Hale",
    frameworkId: "data-gov",
    status: "in-review",
    createdAt: "2026-08-19T14:20:00.000Z",
    artefacts: [
      { id: "gdp-1", name: "GDP-Data-Platform-Architecture-v1.5.pdf", sizeMb: 4.9, kind: "pdf", source: "demo" },
      { id: "gdp-2", name: "GDP-Data-Catalogue-Extract-v0.9.xlsx", sizeMb: 1.2, kind: "xlsx", source: "demo" },
      { id: "gdp-3", name: "GDP-DPIA-Screening-v1.0.docx", sizeMb: 0.7, kind: "docx", source: "demo" },
      { id: "gdp-4", name: "GDP-Retention-Schedule-Draft-v0.4.xlsx", sizeMb: 0.5, kind: "xlsx", source: "demo" },
      { id: "gdp-5", name: "GDP-Platform-Security-Overview-v1.1.pdf", sizeMb: 2.8, kind: "pdf", source: "demo" },
    ],
    result: {
      overall: 61,
      verdict: "Significant Gaps",
      category: "gaps",
      compliant: 8,
      partial: 7,
      gaps: 10,
      narrative:
        "The Grid Data Platform artefacts show significant gaps against the Data Governance Framework. Core classification, retention and sharing controls are not yet evidenced, and several foundational data governance artefacts are still in draft.",
      findings: [
        {
          id: "F-01",
          severity: "high",
          title: "Data classification scheme not applied to platform datasets",
          policyRef: "DGP-201",
          detail:
            "The data catalogue extract shows most platform datasets without a recorded classification tier, so handling controls cannot be confirmed.",
          recommendation:
            "Classify all platform datasets and record the classification in the data catalogue before onboarding further data.",
        },
        {
          id: "F-02",
          severity: "high",
          title: "Retention schedule undefined for telemetry data",
          policyRef: "DGP-202",
          detail:
            "High-volume grid telemetry data has no agreed retention schedule; the draft schedule does not cover this data domain.",
          recommendation:
            "Agree and publish a retention schedule for telemetry data, aligned to regulatory and operational needs.",
        },
        {
          id: "F-03",
          severity: "high",
          title: "Personal data inventory incomplete for customer analytics",
          policyRef: "DGP-201",
          detail:
            "The DPIA screening identifies customer analytics use cases, but the inventory of personal data elements feeding them is incomplete.",
          recommendation:
            "Complete the personal data inventory and refresh the DPIA screening before analytics work proceeds.",
        },
        {
          id: "F-04",
          severity: "high",
          title: "Disposal evidence process not established",
          policyRef: "DGP-202",
          detail:
            "No process exists to evidence disposal of data at end of retention, as required by the retention policy.",
          recommendation:
            "Define and operate a disposal process that produces auditable evidence per data class.",
        },
        {
          id: "F-05",
          severity: "high",
          title: "Data sharing agreements missing for third-party feeds",
          policyRef: "DGP-201",
          detail:
            "Two inbound third-party data feeds are live in the platform without recorded data sharing agreements.",
          recommendation:
            "Put data sharing agreements in place for all third-party feeds and record them in the data catalogue.",
        },
        {
          id: "F-06",
          severity: "medium",
          title: "Catalogue entries missing data stewards",
          policyRef: "DGP-201",
          detail:
            "Over half of the catalogue entries reviewed do not name an accountable data steward.",
          recommendation:
            "Assign a named data steward to every catalogue entry for critical data domains.",
        },
        {
          id: "F-07",
          severity: "medium",
          title: "Archive tiering not aligned to retention classes",
          policyRef: "DGP-202",
          detail:
            "Storage tiering rules move data to archive on age alone, without reference to retention classes.",
          recommendation:
            "Align archive tiering rules to the retention classes in the published schedule.",
        },
        {
          id: "F-08",
          severity: "medium",
          title: "Classification labels not propagated to derived datasets",
          policyRef: "DGP-201",
          detail:
            "Derived datasets created by platform pipelines do not inherit the classification of their source data.",
          recommendation:
            "Implement classification inheritance in pipelines so derived datasets carry source classifications.",
        },
        {
          id: "F-09",
          severity: "medium",
          title: "Legal hold process undocumented",
          policyRef: "DGP-202",
          detail:
            "The artefacts do not describe how legal holds suspend normal retention and disposal schedules.",
          recommendation:
            "Document the legal hold process and its interaction with retention schedules.",
        },
        {
          id: "F-10",
          severity: "medium",
          title: "Data quality rules undefined for critical elements",
          policyRef: "DGP-201",
          detail:
            "Critical data elements listed in the catalogue have no defined data quality rules or thresholds.",
          recommendation:
            "Define measurable quality rules for critical data elements and monitor them in the platform.",
        },
        {
          id: "F-11",
          severity: "medium",
          title: "Backup retention exceeds policy limits",
          policyRef: "DGP-202",
          detail:
            "Backup retention for two data domains exceeds the maximum period allowed by the retention policy.",
          recommendation:
            "Reconfigure backup retention to comply with policy limits, or register a time-bound exception.",
        },
        {
          id: "F-12",
          severity: "low",
          title: "Glossary terms out of sync with catalogue",
          policyRef: "DGP-201",
          detail:
            "Business glossary terms referenced by catalogue entries use outdated definitions.",
          recommendation:
            "Synchronise glossary definitions with the catalogue at the next governance review.",
        },
        {
          id: "F-13",
          severity: "low",
          title: "Retention schedule draft references superseded version",
          policyRef: "DGP-202",
          detail:
            "The draft retention schedule references a superseded corporate schedule version in its header.",
          recommendation:
            "Update the reference to the current corporate schedule version before publication.",
        },
      ],
    },
  },
];

/*
 * Deterministic mapping: the framework selected in the wizard decides which
 * fixed profile the simulated run returns. Architecture assessments reuse the
 * SCADA profile, data assessments the Grid Data Platform profile, and the
 * remaining frameworks reuse the aligned NOI profile. Results therefore never
 * vary between refreshes.
 */
const FRAMEWORK_PROFILE: Record<string, string> = {
  "arch-gov": "p-sgm",
  "cyber-sec": "p-noi",
  "data-gov": "p-gdp",
  "ops-gov": "p-noi",
};

export function getProfile(id: string): AssessmentProfile | undefined {
  return profiles.find((p) => p.id === id);
}

export function profileForFramework(frameworkId: string): AssessmentProfile {
  const profileId = FRAMEWORK_PROFILE[frameworkId] ?? "p-sgm";
  return profiles.find((p) => p.id === profileId) ?? profiles[0]!;
}

// Resolve the deterministic result for any assessment record, with a safe
// fallback derived from its framework for legacy demo records.
export function resultForAssessment(
  assessment: Pick<AssessmentRecord, "profileId" | "frameworkId">,
): AssessmentResult {
  return (
    getProfile(assessment.profileId)?.result ??
    profileForFramework(assessment.frameworkId).result
  );
}
