import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AuditEvent, MitigationDecision, PersonaId } from "./mock/types";
import { seedAudit } from "./mock/audit";
import { personas } from "./mock/personas";

/*
 * Demo session state: persona, human-in-the-loop decisions and the running
 * audit trail. Persisted to localStorage so the demo survives refreshes;
 * the Reset Demo action clears it back to the scripted starting point.
 * POC only — no authentication, no backend.
 */

const STORAGE_KEY = "nget-governance-poc-v1";

export type ApprovalDecision = "pending" | "approved" | "rejected";

interface MitigationState {
  status: MitigationDecision;
  note?: string;
}

interface DemoState {
  persona: PersonaId;
  mitigationDecisions: Record<string, MitigationState>;
  approvals: Record<string, ApprovalDecision>;
  audit: AuditEvent[];
  assessmentCompleted: boolean;
  summaryGenerated: number; // generation counter; 0 = not yet generated
}

interface DemoContextValue extends DemoState {
  hydrated: boolean;
  personaLabel: string;
  setPersona: (p: PersonaId) => void;
  decideMitigation: (id: string, decision: MitigationDecision, note?: string) => void;
  decideApproval: (id: string, decision: Exclude<ApprovalDecision, "pending">, note?: string) => void;
  markAssessmentComplete: () => void;
  generateSummary: () => void;
  addAudit: (e: Omit<AuditEvent, "id" | "at">) => void;
  resetDemo: () => void;
}

const DEFAULT_STATE: DemoState = {
  persona: "pm",
  mitigationDecisions: {},
  approvals: {},
  audit: seedAudit,
  assessmentCompleted: false,
  summaryGenerated: 0,
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const counter = useRef(100);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch {
      // ignore corrupt demo state
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable — demo continues in memory
    }
  }, [state, hydrated]);

  const addAudit = useCallback((e: Omit<AuditEvent, "id" | "at">) => {
    counter.current += 1;
    const event: AuditEvent = {
      ...e,
      id: `AUD-D${String(counter.current).padStart(4, "0")}`,
      at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, audit: [...s.audit, event] }));
  }, []);

  const actorFor = useCallback(
    (persona: PersonaId) => personas.find((p) => p.id === persona)?.label ?? "Demo User",
    [],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      hydrated,
      personaLabel: actorFor(state.persona),
      setPersona: (persona) =>
        setState((s) => ({ ...s, persona })),
      decideMitigation: (id, decision, note) => {
        setState((s) => ({
          ...s,
          mitigationDecisions: {
            ...s.mitigationDecisions,
            [id]: { status: decision, note },
          },
        }));
        addAudit({
          actor: actorFor(state.persona),
          action: `Mitigation ${decision}`,
          entity: id,
          detail: note ? `${id} marked ${decision}. Note: ${note}` : `${id} marked ${decision}.`,
          kind: "human",
        });
      },
      decideApproval: (id, decision, note) => {
        setState((s) => ({
          ...s,
          approvals: { ...s.approvals, [id]: decision },
        }));
        addAudit({
          actor: actorFor(state.persona),
          action: `Approval ${decision}`,
          entity: id,
          detail: note ? `${id} ${decision}. Comment: ${note}` : `${id} ${decision}.`,
          kind: "human",
        });
      },
      markAssessmentComplete: () => {
        setState((s) =>
          s.assessmentCompleted ? s : { ...s, assessmentCompleted: true },
        );
      },
      generateSummary: () => {
        setState((s) => ({ ...s, summaryGenerated: s.summaryGenerated + 1 }));
        addAudit({
          actor: actorFor(state.persona),
          action: "Executive summary generated",
          entity: "A-001",
          detail: "Mock executive summary generated (POC DEMO MODE).",
          kind: "human",
        });
      },
      addAudit,
      resetDemo: () => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        setState({ ...DEFAULT_STATE, audit: seedAudit });
      },
    }),
    [state, hydrated, addAudit, actorFor],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
