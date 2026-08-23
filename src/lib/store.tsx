import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AssessmentRecord } from "./mock/types";
import { computeNextRef, seedAssessment } from "./mock/assessments";

/*
 * Demo app state: the list of governance assessments created in this
 * browser. Persisted to localStorage so the demo survives refreshes;
 * Reset Demo restores the single seeded POC demo assessment.
 * POC only — no backend, no real AI, no uploaded file content leaves
 * the browser (only file metadata is kept).
 */

const STORAGE_KEY = "nget-governance-poc-v2";

interface DemoState {
  assessments: AssessmentRecord[];
}

interface DemoContextValue extends DemoState {
  hydrated: boolean;
  nextRef: string;
  createAssessment: (
    input: Omit<AssessmentRecord, "ref" | "createdAt">,
  ) => AssessmentRecord;
  resetDemo: () => void;
}

const DEFAULT_STATE: DemoState = {
  assessments: [seedAssessment],
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DemoState;
        if (Array.isArray(parsed.assessments) && parsed.assessments.length > 0) {
          setState({ assessments: parsed.assessments });
        }
      }
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

  const nextRef = computeNextRef(state.assessments);

  const createAssessment = useCallback(
    (input: Omit<AssessmentRecord, "ref" | "createdAt">): AssessmentRecord => {
      const record: AssessmentRecord = {
        ...input,
        ref: computeNextRef(state.assessments),
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({ assessments: [...s.assessments, record] }));
      return record;
    },
    [state.assessments],
  );

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(DEFAULT_STATE);
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({ ...state, hydrated, nextRef, createAssessment, resetDemo }),
    [state, hydrated, nextRef, createAssessment, resetDemo],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
