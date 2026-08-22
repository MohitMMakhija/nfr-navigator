import type { Artefact } from "./types";

// The six project artefacts submitted for Assessment #001.
// Files are mock records only — no documents are stored or parsed in this POC.
export const artefacts: Artefact[] = [
  {
    id: "art-1",
    name: "TP500-ARCH-System-Architecture-v3.2.pdf",
    kind: "pdf",
    sizeMb: 4.8,
    version: "v3.2",
    uploadedBy: "M. Makhija",
    uploadedAt: "18 Aug 2026, 09:41",
    status: "uploaded",
    sha: "9f2c…a41d",
    pages: 64,
    description:
      "Solution architecture for the Smart Grid Modernisation platform: hosting topology, integration layer, session handling and performance test evidence.",
  },
  {
    id: "art-2",
    name: "TP500-SEC-Security-Design-Response-v1.4.docx",
    kind: "docx",
    sizeMb: 2.1,
    version: "v1.4",
    uploadedBy: "R. Okafor",
    uploadedAt: "18 Aug 2026, 10:02",
    status: "uploaded",
    sha: "77b1…e90c",
    pages: 41,
    description:
      "Supplier response to the Business Security Requirements: encryption, key management, logging, SSO/MFA and session control design statements.",
  },
  {
    id: "art-3",
    name: "TP500-DR-Disaster-Recovery-Plan-v2.0.pdf",
    kind: "pdf",
    sizeMb: 3.3,
    version: "v2.0",
    uploadedBy: "S. Whitfield",
    uploadedAt: "18 Aug 2026, 10:15",
    status: "uploaded",
    sha: "c5d8…02f7",
    pages: 28,
    description:
      "Disaster recovery strategy, backup schedule, replication design and the results of the most recent failover exercise.",
  },
  {
    id: "art-4",
    name: "TP500-PENTEST-CREST-Report-2026-Q2.pdf",
    kind: "pdf",
    sizeMb: 6.7,
    version: "2026-Q2",
    uploadedBy: "R. Okafor",
    uploadedAt: "19 Aug 2026, 14:22",
    status: "uploaded",
    sha: "1a3e…b8b2",
    pages: 37,
    description:
      "CREST-accredited penetration test report for the TP500 platform, including findings, severity ratings and remediation status.",
  },
  {
    id: "art-5",
    name: "TP500-DPIA-Data-Protection-Impact-Assessment-v1.1.pdf",
    kind: "pdf",
    sizeMb: 1.9,
    version: "v1.1",
    uploadedBy: "L. Fernandes",
    uploadedAt: "19 Aug 2026, 15:03",
    status: "uploaded",
    sha: "e04a…7c66",
    pages: 19,
    description:
      "Data protection impact assessment covering personal-data flows, retention, non-production refresh and GDPR alignment.",
  },
  {
    id: "art-6",
    name: "TP500-ITC-Change-and-Access-Control-Evidence.zip",
    kind: "zip",
    sizeMb: 12.4,
    version: "Aug-2026",
    uploadedBy: "S. Whitfield",
    uploadedAt: "20 Aug 2026, 08:57",
    status: "uploaded",
    sha: "3d9f…51aa",
    pages: 212,
    description:
      "Exported change records, access-review extracts and IT general control operating evidence for the last four quarters.",
  },
];
