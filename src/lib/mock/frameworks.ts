import type { Framework } from "./types";

// Mock framework & policy library for the POC concept demonstrator.
// Not connected to any real policy repository.
export const frameworks: Framework[] = [
  {
    id: "arch-gov",
    code: "AGF",
    name: "NGET Architecture Governance Framework",
    description:
      "Defines how solution architectures are governed, reviewed and approved across NGET programmes, from concept through to delivery.",
    owner: "Enterprise Architecture",
    version: "v4.2",
    status: "active",
    policies: [
      {
        id: "AGP-001",
        name: "Architecture Governance Policy",
        version: "v3.1",
        status: "active",
        owner: "Enterprise Architecture",
        purpose:
          "Sets the mandatory governance checkpoints, design authority engagement and architecture decision recording required for all change programmes.",
        keyPoints: [
          "All programmes must maintain an up-to-date architecture decision record (ADR) log.",
          "Design authority engagement is required at each defined governance checkpoint.",
          "Architecture repositories must be refreshed at every baseline.",
        ],
      },
      {
        id: "SDP-002",
        name: "Solution Design Policy",
        version: "v2.4",
        status: "active",
        owner: "Enterprise Architecture",
        purpose:
          "Defines the required content, review and sign-off of solution design documents before build may proceed.",
        keyPoints: [
          "Solution designs require documented design authority sign-off.",
          "Designs must demonstrate traceability to approved requirements.",
          "Material design changes require re-approval.",
        ],
      },
      {
        id: "TSP-003",
        name: "Technology Standards Policy",
        version: "v1.8",
        status: "active",
        owner: "Technology Strategy",
        purpose:
          "Lists the approved technology stack and the exception process for any deviation from published standards.",
        keyPoints: [
          "Only technologies on the approved standards list may be used by default.",
          "Exceptions must be registered, justified and time-bound.",
          "Exceptions require periodic review until retired.",
        ],
      },
      {
        id: "IAP-004",
        name: "Integration Architecture Policy",
        version: "v2.0",
        status: "active",
        owner: "Integration Architecture",
        purpose:
          "Mandates the use of canonical integration patterns and the enterprise integration layer for system-to-system interfaces.",
        keyPoints: [
          "Point-to-point interfaces require an approved derogation.",
          "Canonical data models must be used for shared entities.",
          "Interfaces must be catalogued in the integration register.",
        ],
      },
    ],
  },
  {
    id: "cyber-sec",
    code: "CSF",
    name: "Cyber Security Framework",
    description:
      "Cyber security policies and control expectations for NGET operational and corporate technology, aligned to recognised industry standards.",
    owner: "Cyber Security Office",
    version: "v2.1",
    status: "active",
    policies: [
      {
        id: "SEC-101",
        name: "Information Security Policy",
        version: "v5.0",
        status: "active",
        owner: "Cyber Security Office",
        purpose: "Top-level statement of security responsibilities and control expectations.",
        keyPoints: ["Annual security risk assessment required.", "Security incidents must be reported within 24 hours."],
      },
      {
        id: "SEC-102",
        name: "Access Control Policy",
        version: "v3.2",
        status: "active",
        owner: "Cyber Security Office",
        purpose: "Defines authentication, authorisation and access review requirements.",
        keyPoints: ["MFA required for all privileged access.", "Quarterly access recertification."],
      },
      {
        id: "SEC-103",
        name: "Incident Response Policy",
        version: "v2.6",
        status: "active",
        owner: "Cyber Security Office",
        purpose: "Sets the incident classification, response and post-incident review process.",
        keyPoints: ["Documented response playbooks per severity.", "Post-incident reviews within 10 working days."],
      },
    ],
  },
  {
    id: "data-gov",
    code: "DGF",
    name: "Data Governance Framework",
    description:
      "Policies governing data classification, quality, retention and sharing across NGET data platforms and programmes.",
    owner: "Chief Data Office",
    version: "v1.9",
    status: "active",
    policies: [
      {
        id: "DGP-201",
        name: "Data Classification Policy",
        version: "v2.2",
        status: "active",
        owner: "Chief Data Office",
        purpose: "Requires all data assets to be classified and handled according to their classification.",
        keyPoints: ["Four classification tiers.", "Classification recorded in the data catalogue."],
      },
      {
        id: "DGP-202",
        name: "Data Retention Policy",
        version: "v1.5",
        status: "active",
        owner: "Chief Data Office",
        purpose: "Defines retention schedules and disposal requirements per data class.",
        keyPoints: ["Retention schedule per data domain.", "Disposal must be evidenced."],
      },
    ],
  },
  {
    id: "ops-gov",
    code: "OGF",
    name: "Operational Governance Framework",
    description:
      "Operational policies covering change management, service continuity and operational readiness for live services.",
    owner: "IT Operations",
    version: "v3.0",
    status: "active",
    policies: [
      {
        id: "OGP-301",
        name: "Change Management Policy",
        version: "v4.1",
        status: "active",
        owner: "IT Operations",
        purpose: "Controls how changes to live services are raised, assessed, approved and implemented.",
        keyPoints: ["CAB approval for normal changes.", "Emergency change process with retrospective approval."],
      },
      {
        id: "OGP-302",
        name: "Service Continuity Policy",
        version: "v2.3",
        status: "active",
        owner: "IT Operations",
        purpose: "Requires continuity and recovery plans for all critical services, tested on a defined cycle.",
        keyPoints: ["Annual continuity test for critical services.", "Documented RTO/RPO per service."],
      },
    ],
  },
];

export function getFramework(id: string): Framework | undefined {
  return frameworks.find((f) => f.id === id);
}
