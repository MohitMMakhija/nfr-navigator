import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ArtefactMeta, AssessmentRecord } from "./mock/types";
import { computeNextRef, seedAssessments } from "./mock/assessments";
import { profileForFramework } from "./mock/profiles";

/*
 * Demo app state: the list of governance assessments created in this
 * browser. Persisted to localStorage so the demo survives refreshes;
 * Reset Demo restores the three seeded POC demo assessments.
 *
 * New assessments start as empty drafts (no framework, artefacts, score or
 * outcome) and only receive a deterministic simulated result when the user
 * completes the wizard and presses "Run Governance Assessment".
 * POC only — no backend, no real AI, no uploaded file content leaves
 * the browser (only file metadata is kept).
 */

const STORAGE_KEY = "governance-artifacts-review-poc-v1";

interface DemoState {
  assessments: AssessmentRecord[];
}

export interface AssessmentInput {
  projectName: string;
  programme: string;
  projectManager: string;
  sponsor: string;
  frameworkId: string;
  artefacts: ArtefactMeta[];
}

interface DemoContextValue extends DemoState {
  hydrated: boolean;
  nextRef: string;
  createDraft: () => AssessmentRecord;
  updateDraft: (
    ref: string,
    patch: Partial<Omit<AssessmentRecord, "ref" | "profileId" | "status" | "createdAt">>,
  ) => void;
  completeAssessment: (ref: string, input: AssessmentInput) => AssessmentRecord | null;
  resetDemo: () => void;
}

const DEFAULT_STATE: DemoState = {
  assessments: seedAssessments,
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

  // "+ New Assessment" creates a truly fresh, empty draft immediately, so it
  // appears in the assessment collection (and the dashboard total) straight
  // away. It carries no demo values, framework, artefacts, profile or score.
  const createDraft = useCallback((): AssessmentRecord => {
    const record: AssessmentRecord = {
      ref: computeNextRef(state.assessments),
      projectName: "",
      programme: "",
      projectManager: "",
      sponsor: "",
      frameworkId: "",
      profileId: null,
      status: "draft",
      createdAt: new Date().toISOString(),
      artefacts: [],
    };
    setState((s) => ({ assessments: [...s.assessments, record] }));
    return record;
  }, [state.assessments]);

  const updateDraft = useCallback(
    (
      ref: string,
      patch: Partial<Omit<AssessmentRecord, "ref" | "profileId" | "status" | "createdAt">>,
    ) => {
      setState((s) => ({
        assessments: s.assessments.map((a) =>
          a.ref === ref && a.status === "draft" ? { ...a, ...patch } : a,
        ),
      }));
    },
    [],
  );

  // Runs the simulated assessment on a draft: the selected framework fixes
  // which deterministic profile the run resolves to, so results are stable
  // across refreshes. Only now does the record get a score and outcome.
  const completeAssessment = useCallback(
    (ref: string, input: AssessmentInput): AssessmentRecord | null => {
      const draft = state.assessments.find((a) => a.ref === ref);
      if (!draft || draft.status !== "draft") return null;
      const profile = profileForFramework(input.frameworkId);
      const record: AssessmentRecord = {
        ...draft,
        ...input,
        profileId: profile.id,
        status: "in-review",
      };
      setState((s) => ({
        assessments: s.assessments.map((a) => (a.ref === ref ? record : a)),
      }));
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
    () => ({
      ...state,
      hydrated,
      nextRef,
      createDraft,
      updateDraft,
      completeAssessment,
      resetDemo,
    }),
    [state, hydrated, nextRef, createDraft, updateDraft, completeAssessment, resetDemo],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
