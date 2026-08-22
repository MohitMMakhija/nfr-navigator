import type { Evidence } from "./types";

const EXTRACTOR = "AI evidence extraction (POC DEMO)";

// Static evidence snippets "extracted" from the six artefacts during the
// simulated Assessment #001. No real parsing occurs in this POC.
export const evidence: Evidence[] = [
  {
    id: "EV-001",
    artefactId: "art-2",
    title: "Encryption standard statement",
    excerpt:
      "AES-256 encryption is applied to all primary operational datastores. Legacy reporting replicas remain on AES-128 pending platform upgrade.",
    location: "p.9 §4.1",
    requirementIds: ["BSR-ENC-02"],
    confidence: 88,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-002",
    artefactId: "art-1",
    title: "Unencrypted archive tier",
    excerpt:
      "The historical meter archive (HMA) resides on the shared NAS tier; encryption at rest is not enabled for this tier.",
    location: "p.22 §6.3",
    requirementIds: ["BSR-ENC-01"],
    confidence: 93,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-003",
    artefactId: "art-2",
    title: "Key custody arrangement",
    excerpt:
      "Key custody: encryption keys are held in the application configuration repository; rotation is performed annually on an ad-hoc basis.",
    location: "p.11 §4.4",
    requirementIds: ["BSR-ENC-03"],
    confidence: 91,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-004",
    artefactId: "art-1",
    title: "Field tablet session timeout",
    excerpt:
      "Session timeout for field-force tablets is configured at 60 minutes to reduce re-authentication burden during shift work.",
    location: "p.17 §5.2",
    requirementIds: ["BSR-SES-01"],
    confidence: 95,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-005",
    artefactId: "art-6",
    title: "Privileged access review cadence",
    excerpt:
      "Quarterly access review extract shows the last privileged account review was completed 11 months ago.",
    location: "access-reviews/2025-Q3.xlsx",
    requirementIds: ["BSR-CRE-02", "ITC-ACC-04"],
    confidence: 89,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-006",
    artefactId: "art-4",
    title: "Hardcoded API credentials",
    excerpt:
      "Static analysis identified 14 hardcoded API credentials within integration adapters connecting to the head-end system.",
    location: "p.6 Finding PT-11",
    requirementIds: ["BSR-CRE-04"],
    confidence: 96,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-007",
    artefactId: "art-4",
    title: "Overdue penetration test findings",
    excerpt:
      "28 findings remain open beyond 90 days, of which 6 are rated critical and 11 high.",
    location: "p.4 Executive summary",
    requirementIds: ["BSR-PEN-02"],
    confidence: 94,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-008",
    artefactId: "art-3",
    title: "DR failover test overdue",
    excerpt:
      "The last full DR failover test was executed in June 2025; RTO achieved was 9h 40m against a 4h target.",
    location: "p.13 §5.1",
    requirementIds: ["NFR-DR-04"],
    confidence: 92,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-009",
    artefactId: "art-3",
    title: "Backup key management",
    excerpt:
      "Backups are encrypted using platform-managed keys; the key backup is co-located with the backup repository in the same region.",
    location: "p.8 §3.4",
    requirementIds: ["BSR-ENC-06", "ITC-BKP-02"],
    confidence: 86,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-010",
    artefactId: "art-1",
    title: "Load test below forecast",
    excerpt:
      "Load test evidence demonstrates 2,400 concurrent users against a 2030 forecast peak of 6,000 concurrent field and office users.",
    location: "p.19 §7.2",
    requirementIds: ["NFR-PERF-02"],
    confidence: 87,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-011",
    artefactId: "art-5",
    title: "DPIA coverage gap",
    excerpt:
      "This DPIA covers customer portal data flows. Smart-meter telemetry PII flows are out of scope and not yet assessed.",
    location: "p.3 §1.2",
    requirementIds: ["NFR-DAT-02"],
    confidence: 90,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-012",
    artefactId: "art-2",
    title: "TLS enforcement",
    excerpt:
      "All internet-facing endpoints enforce TLS 1.2 or higher; the internal service mesh uses mutual TLS between services.",
    location: "p.10 §4.2",
    requirementIds: ["BSR-ENC-04"],
    confidence: 97,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-013",
    artefactId: "art-6",
    title: "Rollback plans missing",
    excerpt:
      "Sample of change records CHG-2201–CHG-2340: 18% lack a documented rollback plan, concentrated in database schema changes.",
    location: "change-records/sample-review.pdf",
    requirementIds: ["ITC-CHG-02"],
    confidence: 84,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-014",
    artefactId: "art-2",
    title: "Central log pipeline scope",
    excerpt:
      "The central log pipeline forwards authentication and administrative events to the NG SOC SIEM; field devices are currently excluded.",
    location: "p.14 §5.1",
    requirementIds: ["BSR-LOG-01"],
    confidence: 88,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-015",
    artefactId: "art-1",
    title: "Availability achievement",
    excerpt:
      "Measured availability is 99.97% over the trailing 12 months; planned maintenance windows are published quarterly in advance.",
    location: "p.15 §6.1",
    requirementIds: ["NFR-REL-01"],
    confidence: 95,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-016",
    artefactId: "art-1",
    title: "Response time achievement",
    excerpt:
      "p95 transaction response time is 380ms against a 500ms target under nominal load conditions.",
    location: "p.18 §7.1",
    requirementIds: ["NFR-PERF-01"],
    confidence: 93,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-017",
    artefactId: "art-5",
    title: "Non-prod refresh without anonymisation",
    excerpt:
      "The non-production refresh procedure copies production extracts into test environments without an anonymisation step.",
    location: "p.7 §3.3",
    requirementIds: ["ITC-NPD-01"],
    confidence: 91,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-018",
    artefactId: "art-2",
    title: "MFA coverage",
    excerpt:
      "MFA is enforced for all workforce accounts via the corporate IdP; the contractor legacy portal is exempted pending migration.",
    location: "p.12 §4.6",
    requirementIds: ["BSR-CRE-05"],
    confidence: 89,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-019",
    artefactId: "art-4",
    title: "Contrast ratio failure",
    excerpt:
      "The outage map layer renders at a 3.8:1 contrast ratio against the WCAG 2.1 AA minimum of 4.5:1.",
    location: "p.9 Finding PT-19",
    requirementIds: ["NFR-ACC-01"],
    confidence: 85,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-020",
    artefactId: "art-3",
    title: "Restore testing cadence",
    excerpt:
      "Backup restore tests are performed monthly for tier-1 systems; the last failure occurred in March 2026 and was resolved within the SLA.",
    location: "p.9 §3.6",
    requirementIds: ["NFR-DAT-05"],
    confidence: 90,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-021",
    artefactId: "art-6",
    title: "Alert threshold documentation",
    excerpt:
      "Monitoring thresholds are documented for 62% of critical alerts; the remainder is maintained as operational knowledge by the service team.",
    location: "monitoring/alert-catalogue.csv",
    requirementIds: ["NFR-PERF-04"],
    confidence: 78,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-022",
    artefactId: "art-1",
    title: "EU data residency",
    excerpt:
      "Production workloads are hosted in EU data centres (Dublin primary, Frankfurt secondary) with no processing outside the EEA.",
    location: "p.5 §2.1",
    requirementIds: ["NFR-HST-01"],
    confidence: 96,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-023",
    artefactId: "art-6",
    title: "Incident SLA attainment",
    excerpt:
      "P1 incident response SLA attainment is 98.2% across the trailing four quarters; two breaches were subject to service credits.",
    location: "itsm/sla-attainment-Q2.pdf",
    requirementIds: ["ITC-INC-02"],
    confidence: 92,
    extractedBy: EXTRACTOR,
  },
  {
    id: "EV-024",
    artefactId: "art-2",
    title: "SSO integration",
    excerpt:
      "The platform integrates with corporate SSO via SAML 2.0; local accounts are disabled except for two break-glass accounts.",
    location: "p.12 §4.5",
    requirementIds: ["BSR-CRE-01"],
    confidence: 94,
    extractedBy: EXTRACTOR,
  },
];
