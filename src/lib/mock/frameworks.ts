import type {
  Criticality,
  Framework,
  Policy,
  RagStatus,
  Requirement,
} from "./types";

/*
 * Requirement catalogue seeded from the structure of the NFR policy workbook
 * (categories such as Performance, Reliability, Security, Encryption,
 * DR, IT general controls). The workbook itself is never exposed to the UI.
 *
 * 94 requirements across 3 frameworks: NFR (40), BSR (30), ITC (24).
 * Status distribution resolves to a 72% weighted compliance score:
 * 59 compliant, 18 partial, 17 gap.
 */

type ReqSeed = [title: string, crit: Criticality];
interface PolicySeed {
  code: string;
  name: string;
  desc: string;
  reqs: ReqSeed[];
}
interface FrameworkSeed extends Framework {
  policies: PolicySeed[];
}

export const frameworks: Framework[] = [
  {
    id: "nfr",
    code: "NFR",
    name: "Non-Functional Requirements Policy",
    version: "v4.2.1",
    owner: "Group Engineering",
    description:
      "Performance, reliability, scalability, interoperability, data management, accessibility, hosting and disaster-recovery obligations for TP500 delivery.",
    sourceRef: "NFR Policy Suite v4.2.1",
  },
  {
    id: "bsr",
    code: "BSR",
    name: "Business Security Requirements",
    version: "v2.3",
    owner: "Cyber Security",
    description:
      "Baseline security controls: encryption, key and credential management, session control, centralised logging, penetration testing and user activity auditing.",
    sourceRef: "BSR Control Catalogue v2.3",
  },
  {
    id: "itc",
    code: "ITC",
    name: "IT General Controls",
    version: "v3.1",
    owner: "IT Assurance",
    description:
      "IT general control objectives covering change, access, incident and SLA management, backup and recovery, GRC, licensing and non-production environments.",
    sourceRef: "ITGC Framework v3.1",
  },
];

const SEEDS: Record<string, PolicySeed[]> = {
  nfr: [
    {
      code: "NFR-PERF",
      name: "Performance",
      desc: "Response-time, load and monitoring obligations for user-facing and batch operations.",
      reqs: [
        ["Transaction Response Time", "high"],
        ["Load Testing Against Forecast Peak", "critical"],
        ["Network Performance & Third-Party APIs", "medium"],
        ["Monitoring & Alerting Coverage", "high"],
        ["Continuous Performance Optimisation", "low"],
      ],
    },
    {
      code: "NFR-REL",
      name: "Reliability",
      desc: "Availability, fault tolerance and planned-downtime management.",
      reqs: [
        ["Availability & Uptime (99.95%)", "critical"],
        ["Fault Tolerance & Degraded Mode", "high"],
        ["Peak-Time Performance Metrics", "medium"],
        ["Planned Downtime Management", "medium"],
      ],
    },
    {
      code: "NFR-SCA",
      name: "Scalability",
      desc: "Horizontal and vertical scaling to meet the 2030 growth forecast.",
      reqs: [
        ["Horizontal Scalability", "high"],
        ["Database Scalability (Sharding/Partitioning)", "high"],
        ["Caching Strategy", "medium"],
        ["Network & Infrastructure Capacity", "medium"],
      ],
    },
    {
      code: "NFR-INT",
      name: "Interoperability",
      desc: "API catalogue, authentication, throttling and browser support.",
      reqs: [
        ["API Catalogue (REST/GraphQL)", "high"],
        ["API Authentication & Authorisation", "critical"],
        ["API Rate Limiting & Throttling", "medium"],
        ["Supported Browser Matrix", "low"],
      ],
    },
    {
      code: "NFR-MNT",
      name: "Maintainability",
      desc: "Documentation, sandbox environments and extensibility of the data model.",
      reqs: [
        ["API Design & Documentation", "medium"],
        ["Sandbox / Developer Environments", "low"],
        ["Data Model Extensibility", "medium"],
      ],
    },
    {
      code: "NFR-DAT",
      name: "Data Management",
      desc: "Data inventory, retention, archival and restore obligations.",
      reqs: [
        ["Data & Artefact Type Inventory", "medium"],
        ["Retention Periods by Data Category", "high"],
        ["Archival Strategy & Migration Plan", "medium"],
        ["Archive Access Controls & Retrieval", "high"],
        ["Periodic Restore Testing", "high"],
      ],
    },
    {
      code: "NFR-ACC",
      name: "Accessibility",
      desc: "WCAG 2.1 AA conformance and assistive-technology compatibility.",
      reqs: [
        ["WCAG 2.1 AA Adherence", "high"],
        ["Assistive Technology Compatibility", "medium"],
        ["Colour Contrast & Design Accessibility", "medium"],
        ["Third-Party Accessibility Audit", "low"],
      ],
    },
    {
      code: "NFR-HST",
      name: "Hosting & Deployment",
      desc: "EU hosting, redundancy and cloud-native deployment requirements.",
      reqs: [
        ["EU Data Centre Hosting", "critical"],
        ["Geographic Redundancy", "high"],
        ["Cloud-Native Architecture", "medium"],
        ["High Availability Deployment", "high"],
      ],
    },
    {
      code: "NFR-RPT",
      name: "Reporting",
      desc: "Granular, auditable and ITIL-aligned service reporting.",
      reqs: [
        ["Granular Reporting Capability", "medium"],
        ["Historical Retention of Audit Data", "high"],
        ["ITIL Service Management Reporting", "medium"],
      ],
    },
    {
      code: "NFR-DR",
      name: "Disaster Recovery",
      desc: "DR strategy, backup automation, replication and exercise cadence.",
      reqs: [
        ["DR Strategy & Plan", "critical"],
        ["Automated Backup Procedures", "high"],
        ["Redundancy & Replication", "high"],
        ["DR Testing & Validation (Annual)", "critical"],
      ],
    },
  ],
  bsr: [
    {
      code: "BSR-ENC",
      name: "Encryption",
      desc: "Encryption scope, standards, key management and protocols for data at rest and in transit.",
      reqs: [
        ["Scope of Data Encryption", "critical"],
        ["Encryption Standard (AES-256)", "high"],
        ["Key Management Practices", "critical"],
        ["Encryption in Transit (TLS 1.2+)", "high"],
        ["Data-at-Rest Encryption Coverage", "high"],
        ["Encryption of Backup Data", "high"],
      ],
    },
    {
      code: "BSR-SES",
      name: "User Session Control",
      desc: "Session termination, lockout and secure session handling.",
      reqs: [
        ["Inactivity Session Termination (15 min)", "high"],
        ["Secure Session Handling", "medium"],
      ],
    },
    {
      code: "BSR-CRE",
      name: "Credentials & Key Management",
      desc: "Password rules, privileged review, API keys, MFA and PKI certificates.",
      reqs: [
        ["Corporate SSO / Password Rules", "high"],
        ["Quarterly Privileged Account Review", "critical"],
        ["API Key Minimisation & Annual Rotation", "high"],
        ["No Hardcoded Credentials", "critical"],
        ["MFA Enforcement", "critical"],
        ["PKI Certificate Lifecycle Management", "medium"],
      ],
    },
    {
      code: "BSR-BAS",
      name: "Security Baseline",
      desc: "Hardened, current and uncompromised component configuration.",
      reqs: [
        ["Latest Component Configuration", "medium"],
        ["No Compromised / Jailbroken Components", "high"],
        ["Secure Configuration Hardening", "medium"],
      ],
    },
    {
      code: "BSR-LOG",
      name: "Centralised Logging",
      desc: "Aggregation of security events and availability to the SOC.",
      reqs: [
        ["Central Log Aggregation", "high"],
        ["Log Availability to SOC", "high"],
      ],
    },
    {
      code: "BSR-PEN",
      name: "Penetration Testing",
      desc: "Annual CREST testing and remediation service levels.",
      reqs: [
        ["Annual CREST Penetration Test", "high"],
        ["Remediation SLA (Critical ≤ 30 days)", "critical"],
      ],
    },
    {
      code: "BSR-EML",
      name: "Secure Email Gateway",
      desc: "Approved-domain sending for system-generated email.",
      reqs: [["Approved Org Domain Sending", "low"]],
    },
    {
      code: "BSR-ADM",
      name: "Dedicated Admin Workstation",
      desc: "Privileged access workstations and admin-plane segmentation.",
      reqs: [
        ["Privileged Access Workstations (PAW)", "high"],
        ["Admin Network Segmentation", "medium"],
      ],
    },
    {
      code: "BSR-AUD",
      name: "User Activity Auditing",
      desc: "Capture, retention, protection and monitoring of user activity events.",
      reqs: [
        ["User Activity Event Capture", "high"],
        ["Audit Log Retention Schedule", "high"],
        ["Audit Log Access Controls", "medium"],
        ["Audit Monitoring & Alerting", "medium"],
      ],
    },
    {
      code: "BSR-REG",
      name: "Regulated Data Controls",
      desc: "Alignment with GDPR, ISO 27001 and NERC CIP obligations.",
      reqs: [
        ["GDPR Alignment", "critical"],
        ["ISO 27001 / NERC CIP Control Mapping", "medium"],
      ],
    },
  ],
  itc: [
    {
      code: "ITC-CHG",
      name: "Change Management",
      desc: "Authorised, recorded and reversible changes to production.",
      reqs: [
        ["Change Records & Approval", "high"],
        ["Documented Rollback Plans", "high"],
        ["Release Versioning & Traceability", "medium"],
        ["Emergency Change Process", "medium"],
      ],
    },
    {
      code: "ITC-ACC",
      name: "Access Management",
      desc: "Role-based access, third-party access and recertification.",
      reqs: [
        ["Role-Based Access Control (RBAC)", "critical"],
        ["Third-Party Access Controls", "high"],
        ["User Provisioning & Deprovisioning", "high"],
        ["Access Recertification", "high"],
      ],
    },
    {
      code: "ITC-INC",
      name: "Incident & SLA Management",
      desc: "ITIL-aligned incident handling, SLA tracking and service credits.",
      reqs: [
        ["ITIL Incident Management", "high"],
        ["Incident SLA Tracking & Attainment", "high"],
        ["Service Credits & Remedies", "medium"],
        ["Escalation Procedures", "medium"],
      ],
    },
    {
      code: "ITC-BKP",
      name: "Backup & Recovery",
      desc: "Automated, encrypted, tested and geographically separated backups.",
      reqs: [
        ["Automated Backup Procedures", "high"],
        ["Backup Encryption & Key Separation", "high"],
        ["Backup Restore Testing", "high"],
        ["Geo-Separated Backup Copies", "medium"],
      ],
    },
    {
      code: "ITC-GRC",
      name: "Governance, Risk & Compliance",
      desc: "Control governance, compliance reporting and exception management.",
      reqs: [
        ["Access Governance Oversight", "high"],
        ["Compliance Reporting Cadence", "medium"],
        ["Policy Exception Management", "medium"],
      ],
    },
    {
      code: "ITC-LIC",
      name: "Licence Management",
      desc: "Metering, provisioning and auditing of software licences.",
      reqs: [
        ["Licence Metering & Usage Tracking", "low"],
        ["Licence Provisioning & Deprovisioning", "low"],
        ["Licence Auditing & Reporting", "medium"],
      ],
    },
    {
      code: "ITC-NPD",
      name: "Non-Production Environments",
      desc: "Data refresh and access control for non-production landscapes.",
      reqs: [
        ["Non-Prod Data Refresh (No Production PII)", "critical"],
        ["Non-Prod Access Controls", "high"],
      ],
    },
  ],
};

const TEMPLATE_REASONING: Record<RagStatus, string> = {
  compliant:
    "AI analysis located direct, consistent evidence across the submitted artefacts confirming this control is implemented and operating. Artefact statements align with the policy wording and no contradictory findings were identified. Residual items are administrative only.",
  partial:
    "AI analysis found evidence of partial implementation. The core control exists, but coverage is incomplete or could not be fully corroborated across the submitted artefacts. Human review is recommended to confirm scope and close the identified gaps.",
  gap: "AI analysis could not locate sufficient evidence that this requirement is met. Artefact statements are absent, ambiguous or contradict the policy obligation. Treat as a compliance gap until remediated and re-assessed.",
};

interface FeaturedOverride {
  status?: RagStatus;
  confidence?: number;
  description?: string;
  reasoning?: string;
  gaps?: string[];
}

// Hand-authored detail for the requirements the demo journey visits.
const FEATURED: Record<string, FeaturedOverride> = {
  "BSR-ENC-01": {
    status: "gap",
    confidence: 91,
    description:
      "All categories of project data — operational, archival and backup — must be encrypted with an approved mechanism.",
    reasoning:
      "The security design response states encryption coverage for primary operational datastores (EV-001), but the architecture document explicitly records that the historical meter archive tier is not encrypted at rest (EV-002). No compensating control is described. The scope requirement is therefore not met for archival data.",
    gaps: [
      "Historical meter archive (NAS tier) is not encrypted at rest",
      "No compensating control or risk acceptance recorded",
      "Encryption scope statement in security design omits archive tier",
    ],
  },
  "BSR-ENC-02": {
    status: "partial",
    confidence: 84,
    description:
      "Encryption must use approved standards (AES-256 or stronger) across all data classifications.",
    reasoning:
      "Primary operational datastores use AES-256 (EV-001); however the same statement records legacy reporting replicas on AES-128 pending a platform upgrade. The standard is met for production primaries but not across the full estate.",
    gaps: ["Legacy reporting replicas remain on AES-128"],
  },
  "BSR-ENC-03": {
    status: "gap",
    confidence: 88,
    description:
      "Keys must be securely generated, distributed, stored, rotated and revoked using an approved key-management service.",
    reasoning:
      "EV-003 records keys held in the application configuration repository with annual, ad-hoc rotation. This conflicts with the requirement for a managed key service with defined rotation and revocation. No HSM/KMS evidence was located in any artefact.",
    gaps: [
      "Keys stored in configuration repository, not a managed KMS/HSM",
      "Rotation annual and ad-hoc rather than policy-driven",
      "No revocation procedure evidenced",
    ],
  },
  "BSR-ENC-06": {
    status: "partial",
    confidence: 82,
    description: "Backup data must be encrypted with keys managed separately from the backup repository.",
    reasoning:
      "Backups are encrypted with platform-managed keys (EV-009), satisfying encryption of backup data. However the key backup is co-located with the backup repository in the same region, weakening key separation.",
    gaps: ["Backup keys co-located with backup repository"],
  },
  "BSR-SES-01": {
    status: "gap",
    confidence: 94,
    description:
      "Inactive sessions must terminate or lock after 15 minutes on all access channels, including field devices.",
    reasoning:
      "The architecture document records a 60-minute inactivity timeout for field-force tablets (EV-004), four times the policy maximum. The stated rationale (reduced re-authentication burden) is not accompanied by a risk acceptance. No evidence of an exception approval was found.",
    gaps: [
      "Field tablets configured at 60-minute timeout vs 15-minute policy",
      "No recorded risk acceptance or exception approval",
    ],
  },
  "BSR-CRE-02": {
    status: "gap",
    confidence: 87,
    description:
      "Administrative accounts and privileges must be reviewed quarterly and evidence retained.",
    reasoning:
      "The access-review extract in the ITC evidence pack shows the last privileged review completed 11 months ago (EV-005). Two quarterly cycles have been missed and no interim attestation is recorded.",
    gaps: [
      "Two quarterly privileged reviews missed",
      "No interim attestation or compensating monitoring evidenced",
    ],
  },
  "BSR-CRE-04": {
    status: "gap",
    confidence: 95,
    description: "Credentials and API keys must never be hardcoded in source, adapters or configuration.",
    reasoning:
      "The Q2 penetration test static analysis identified 14 hardcoded API credentials within integration adapters (EV-006). This directly contravenes the requirement and creates a credential-exposure path to the head-end system.",
    gaps: [
      "14 hardcoded API credentials in integration adapters",
      "No secrets-management vault in integration layer",
    ],
  },
  "BSR-PEN-02": {
    status: "gap",
    confidence: 92,
    description:
      "Critical penetration-test findings must be remediated within 30 days; high findings within 60 days.",
    reasoning:
      "The Q2 CREST report shows 28 findings open beyond 90 days, including 6 critical (EV-007). The 30-day critical remediation SLA is breached and no remediation plan with dates is included in the artefact set.",
    gaps: [
      "6 critical findings open > 90 days",
      "11 high findings open > 90 days",
      "No dated remediation plan submitted",
    ],
  },
  "BSR-LOG-01": {
    status: "partial",
    confidence: 85,
    description:
      "Security-relevant events from all platform components must aggregate to the central logging pipeline.",
    reasoning:
      "Authentication and administrative events forward to the SOC SIEM (EV-014), but field devices are excluded from the pipeline. Aggregation coverage is therefore partial across the platform estate.",
    gaps: ["Field-device events not forwarded to central pipeline"],
  },
  "ITC-CHG-02": {
    status: "partial",
    confidence: 81,
    description: "Every production change must carry a documented, testable rollback plan.",
    reasoning:
      "A sample of 140 change records shows 18% lack a documented rollback plan (EV-013), concentrated in database schema changes. The change process itself is operating; completeness of rollback documentation is the gap.",
    gaps: ["18% of sampled changes lack rollback plans"],
  },
  "ITC-NPD-01": {
    status: "gap",
    confidence: 90,
    description:
      "Non-production refreshes must not copy production personal data without an approved anonymisation step.",
    reasoning:
      "The DPIA records that the non-production refresh procedure copies production extracts into test environments without anonymisation (EV-017). This creates an uncontrolled PII processing environment and a GDPR exposure.",
    gaps: [
      "Production PII copied to non-prod without anonymisation",
      "No data-masking control in refresh procedure",
    ],
  },
  "ITC-ACC-04": {
    status: "partial",
    confidence: 79,
    description: "User access must be recertified on a defined cycle with evidence retained.",
    reasoning:
      "General user recertification is evidenced, but the privileged tier is 11 months overdue (EV-005) and contractor accounts are excluded from the cycle. Recertification operates, but not across the full population.",
    gaps: [
      "Privileged access recertification overdue",
      "Contractor population outside recertification cycle",
    ],
  },
  "NFR-DR-04": {
    status: "gap",
    confidence: 90,
    description:
      "A full DR failover exercise must be executed at least annually, achieving the agreed RTO/RPO.",
    reasoning:
      "The DR plan records the last full failover test in June 2025 — over 14 months ago — with an achieved RTO of 9h 40m against a 4h target (EV-008). Both the cadence and the recovery objective are unmet.",
    gaps: [
      "No full failover test in the last 12 months",
      "Achieved RTO 9h 40m vs 4h target",
    ],
  },
  "NFR-ACC-01": {
    status: "partial",
    confidence: 83,
    description: "User interfaces must conform to WCAG 2.1 AA.",
    reasoning:
      "The penetration/accessibility review found the outage map layer at a 3.8:1 contrast ratio against the 4.5:1 AA minimum (EV-019). Other sampled journeys conform. Conformance is therefore partial.",
    gaps: ["Outage map contrast ratio below WCAG 2.1 AA"],
  },
  "NFR-REL-01": {
    status: "compliant",
    confidence: 95,
    description: "Monthly availability of at least 99.95%, with published planned-downtime windows.",
    reasoning:
      "Measured availability of 99.97% over the trailing 12 months exceeds the 99.95% obligation, and planned maintenance windows are published quarterly (EV-015). Evidence is direct, recent and internally consistent.",
    gaps: [],
  },
  "NFR-PERF-01": {
    status: "compliant",
    confidence: 93,
    description: "p95 transaction response time of 500ms or better under nominal load.",
    reasoning:
      "Reported p95 of 380ms against the 500ms target (EV-016) is direct evidence of conformity under nominal load. Note the separate load-testing gap (NFR-PERF-02) at forecast peak volumes.",
    gaps: [],
  },
};

const TARGETS: Record<RagStatus, number> = { compliant: 59, partial: 18, gap: 17 };
const OWNERS = [
  "M. Makhija",
  "R. Okafor",
  "S. Whitfield",
  "L. Fernandes",
  "J. Osei",
];

function buildCatalogue(): { policies: Policy[]; requirements: Requirement[] } {
  const policies: Policy[] = [];
  const requirements: Requirement[] = [];

  for (const fw of frameworks) {
    for (const p of SEEDS[fw.id] ?? []) {
      const policyId = p.code.toLowerCase();
      policies.push({
        id: policyId,
        frameworkId: fw.id,
        code: p.code,
        name: p.name,
        description: p.desc,
        sourceRef: fw.sourceRef,
      });
      p.reqs.forEach(([title, crit], i) => {
        const id = `${p.code}-${String(i + 1).padStart(2, "0")}`;
        requirements.push({
          id,
          code: id,
          policyId,
          frameworkId: fw.id,
          title,
          description: "",
          criticality: crit,
          status: "compliant",
          confidence: 0,
          owner: OWNERS[(requirements.length * 7 + 3) % OWNERS.length] ?? "M. Makhija",
          reasoning: "",
          gaps: [],
          sourceRef: `${fw.sourceRef} › ${p.name}`,
          lastAssessed: "22 Aug 2026",
        });
      });
    }
  }

  // Allocate statuses to hit 59 / 18 / 17 exactly (featured take precedence).
  const remaining = { ...TARGETS };
  for (const r of requirements) {
    const f = FEATURED[r.id];
    if (f?.status) {
      r.status = f.status;
      remaining[f.status]--;
    }
  }
  const pool: RagStatus[] = [];
  (Object.keys(remaining) as RagStatus[]).forEach((s) => {
    for (let i = 0; i < remaining[s]; i++) pool.push(s);
  });
  let n = 0;
  for (const r of requirements) {
    if (FEATURED[r.id]?.status) continue;
    const idx = (n * 31 + 7) % pool.length;
    r.status = pool.splice(idx, 1)[0] ?? "compliant";
    n++;
  }

  // Descriptions, confidence, reasoning, gaps.
  requirements.forEach((r, i) => {
    const f = FEATURED[r.id];
    const policyName =
      policies.find((p) => p.id === r.policyId)?.name ?? r.policyId;
    r.description =
      f?.description ??
      `${r.title} obligation under the ${policyName} policy, assessed against the TP500 artefact set in Assessment #001.`;
    r.confidence =
      f?.confidence ??
      (r.status === "gap"
        ? 62 + ((i * 37) % 20)
        : r.status === "partial"
          ? 70 + ((i * 29) % 18)
          : 84 + ((i * 23) % 15));
    r.reasoning = f?.reasoning ?? TEMPLATE_REASONING[r.status];
    r.gaps =
      f?.gaps ??
      (r.status === "gap"
        ? ["No corroborating evidence located in the submitted artefacts"]
        : r.status === "partial"
          ? ["Evidence incomplete — scope not fully corroborated"]
          : []);
  });

  return { policies, requirements };
}

const catalogue = buildCatalogue();
export const policies: Policy[] = catalogue.policies;
export const requirements: Requirement[] = catalogue.requirements;
