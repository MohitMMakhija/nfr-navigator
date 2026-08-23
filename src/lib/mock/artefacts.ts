import type { ArtefactMeta } from "./types";

// Pre-populated demo artefacts for the POC. Metadata only — no real
// documents are stored, uploaded or processed.
export const demoArtefacts: ArtefactMeta[] = [
  {
    id: "demo-1",
    name: "SCADA-Migration-Architecture-Report-v2.1.pdf",
    sizeMb: 5.2,
    kind: "pdf",
    source: "demo",
  },
  {
    id: "demo-2",
    name: "SCADA-Migration-Security-Assessment-v1.3.pdf",
    sizeMb: 3.8,
    kind: "pdf",
    source: "demo",
  },
  {
    id: "demo-3",
    name: "SCADA-Migration-NFR-Compliance-Workbook-v4.2.xlsx",
    sizeMb: 1.4,
    kind: "xlsx",
    source: "demo",
  },
  {
    id: "demo-4",
    name: "SCADA-Migration-Disaster-Recovery-Plan-v1.0.pdf",
    sizeMb: 2.6,
    kind: "pdf",
    source: "demo",
  },
  {
    id: "demo-5",
    name: "SCADA-Migration-Project-Overview-v1.6.docx",
    sizeMb: 0.9,
    kind: "docx",
    source: "demo",
  },
];

// Downloadable sample input report (static demo file served from /samples).
export const sampleReport = {
  name: "SCADA Migration — Architecture & Governance Assessment Input Report",
  fileName: "SCADA-Migration-Assessment-Input-Report.pdf",
  url: "/samples/SCADA-Migration-Assessment-Input-Report.pdf",
  sizeMb: 0.1,
};
