import type { Persona } from "./types";

// The five demo personas. The dashboard re-orders and re-emphasises its
// panels according to the active persona's priorities.
export const personas: Persona[] = [
  {
    id: "pm",
    label: "Project Manager",
    role: "M. Makhija — TP500 Delivery",
    focus:
      "Overall posture, gate readiness and the actions that keep Stage Gate A on schedule.",
    widgets: ["kpis", "gate", "risks", "frameworks", "approvals", "activity"],
  },
  {
    id: "compliance",
    label: "Risk & Compliance Lead",
    role: "S. Whitfield — IT Assurance",
    focus:
      "Framework posture, red risks, policy gaps and the treatment plan awaiting approval.",
    widgets: ["kpis", "risks", "frameworks", "matrix", "approvals", "activity"],
  },
  {
    id: "architect",
    label: "IT Security Architect",
    role: "R. Okafor — Cyber Security",
    focus:
      "Security controls, encryption and credential gaps, and the evidence behind every call.",
    widgets: ["kpis", "frameworks", "risks", "artefacts", "matrix", "activity"],
  },
  {
    id: "pmo",
    label: "PMO / Stage Gate Authority",
    role: "J. Osei — Portfolio PMO",
    focus:
      "Gate criteria, conditions precedent, pending approvals and a defensible audit trail.",
    widgets: ["gate", "approvals", "kpis", "activity", "risks", "frameworks"],
  },
  {
    id: "exec",
    label: "Executive Sponsor",
    role: "D. Trevelyan — Programme Sponsor",
    focus:
      "The headline verdict, value delivered by the POC, and the decisions needed from the steering group.",
    widgets: ["kpis", "value", "gate", "risks", "activity"],
  },
];
