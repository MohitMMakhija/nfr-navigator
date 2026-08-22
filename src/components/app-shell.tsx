import { Link, useNavigate } from "@tanstack/react-router";
import {
  BrainCircuit,
  ClipboardCheck,
  FileSearch,
  FileText,
  Flag,
  Gauge,
  Grid3x3,
  History,
  LayoutDashboard,
  Library,
  ListChecks,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ScrollText,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/store";
import { personas } from "@/lib/mock/personas";
import type { PersonaId } from "@/lib/mock/types";
import { DemoBadge } from "@/components/status";
import { toast } from "sonner";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/", label: "Dashboard", icon: <LayoutDashboard className="size-4" />, exact: true },
      { to: "/executive-summary", label: "Executive Summary", icon: <FileText className="size-4" /> },
      { to: "/poc-metrics", label: "POC Success Metrics", icon: <Gauge className="size-4" /> },
    ],
  },
  {
    label: "Assessment",
    items: [
      { to: "/assessments/new", label: "New Assessment", icon: <Sparkles className="size-4" /> },
      { to: "/assessments/A-001", label: "Assessment #001", icon: <ClipboardCheck className="size-4" /> },
      { to: "/heatmap", label: "Compliance Heatmap", icon: <Grid3x3 className="size-4" /> },
      { to: "/trace", label: "Assessment Trace", icon: <History className="size-4" /> },
      { to: "/explainability", label: "AI Explainability", icon: <BrainCircuit className="size-4" /> },
    ],
  },
  {
    label: "Compliance",
    items: [
      { to: "/frameworks", label: "Frameworks", icon: <Library className="size-4" /> },
      { to: "/policies", label: "Policy Library", icon: <ScrollText className="size-4" /> },
      { to: "/evidence", label: "Evidence Traceability", icon: <FileSearch className="size-4" /> },
    ],
  },
  {
    label: "Risk & Governance",
    items: [
      { to: "/risks", label: "Risk Cockpit", icon: <ShieldAlert className="size-4" /> },
      { to: "/mitigations", label: "Mitigations", icon: <ListChecks className="size-4" /> },
      { to: "/approvals", label: "Approvals & Audit", icon: <ShieldCheck className="size-4" /> },
      { to: "/stage-gate", label: "Stage Gate A", icon: <Flag className="size-4" /> },
    ],
  },
];

const linkBase =
  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors";
const linkInactive = "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground";
const linkActive = "bg-sidebar-accent text-sidebar-foreground font-medium";

export function AppShell({ children }: { children: ReactNode }) {
  const { persona, setPersona, resetDemo } = useDemo();
  const navigate = useNavigate();
  const activePersona = personas.find((p) => p.id === persona)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <ShieldCheck className="size-5 text-sidebar-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-sidebar-foreground">
              NGET AI Governance
            </div>
            <div className="text-[11px] text-sidebar-foreground/60">
              Assurance Platform
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {NAV.map((group) => (
            <div key={group.label}>
              <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-widest text-sidebar-foreground/50 uppercase">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.exact ?? false }}
                    className={linkBase}
                    activeProps={{ className: `${linkBase} ${linkActive}` }}
                    inactiveProps={{ className: `${linkBase} ${linkInactive}` }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border px-4 py-3">
          <p className="text-[10px] leading-relaxed text-sidebar-foreground/50">
            Static UX prototype. All AI output is simulated and labelled.
            No data leaves this browser.
          </p>
        </div>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur md:pl-[17rem] md:pr-6">
        <div className="flex items-center gap-2 md:hidden">
          <ShieldCheck className="size-5 text-primary" />
          <span className="text-sm font-semibold">NGET Governance</span>
        </div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
          <span className="font-medium text-foreground">Smart Grid Modernisation</span>
          <span className="text-border">|</span>
          <span>Programme TP500</span>
          <span className="text-border">|</span>
          <span>Stage Gate A</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DemoBadge />
          <Select value={persona} onValueChange={(v) => setPersona(v as PersonaId)}>
            <SelectTrigger className="h-8 w-[210px] text-xs" aria-label="Switch persona">
              <SelectValue placeholder="Persona" />
            </SelectTrigger>
            <SelectContent>
              {personas.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-xs">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Reset demo state"
              >
                <RotateCcw className="size-3.5" />
                Reset demo
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset the demo?</AlertDialogTitle>
                <AlertDialogDescription>
                  This clears persona selection, mitigation decisions, approvals and
                  audit entries made during this session, returning the POC to its
                  scripted starting state.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    resetDemo();
                    toast.success("Demo reset to scripted starting state");
                    navigate({ to: "/" });
                  }}
                >
                  Reset demo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 md:pl-72 md:pr-8">
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-info/25 bg-info/5 px-3 py-2 text-xs text-info md:hidden">
          <DemoBadge /> Viewing as {activePersona.label}
        </div>
        {children}
      </main>
    </div>
  );
}
