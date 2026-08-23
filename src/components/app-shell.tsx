import { Link } from "@tanstack/react-router";
import {
  ClipboardCheck,
  LayoutDashboard,
  Library,
  ListChecks,
  Rocket,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { DemoBadge } from "@/components/status";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
}

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard className="size-4" />, exact: true },
  { to: "/assessments", label: "Assessments", icon: <ClipboardCheck className="size-4" /> },
  { to: "/frameworks", label: "Framework & Policy Library", icon: <Library className="size-4" /> },
  { to: "/findings", label: "Findings & Recommendations", icon: <ListChecks className="size-4" /> },
  { to: "/future", label: "Future Enhancements", icon: <Rocket className="size-4" /> },
  { to: "/settings", label: "Settings", icon: <Settings className="size-4" /> },
];

const linkBase =
  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors";
const linkInactive =
  "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
const linkActive = "bg-sidebar-accent text-sidebar-accent-foreground font-medium";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <ShieldCheck className="size-5 text-sidebar-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">
              NGET AI Governance Assurance
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Concept POC · Simulated AI
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => (
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
        </nav>

        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Concept demonstrator. All AI behaviour is simulated and labelled. No
            data leaves this browser.
          </p>
        </div>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur md:pr-8 md:pl-[17rem]">
        <div className="flex items-center gap-2 md:hidden">
          <ShieldCheck className="size-5 text-primary" />
          <span className="text-sm font-semibold">NGET AI Governance Assurance</span>
        </div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
          <span className="font-medium text-foreground">Smart Grid Modernisation</span>
          <span className="text-border">|</span>
          <span>Programme SCADA Migration</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DemoBadge />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8 md:pr-10 md:pl-72">
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 text-xs text-primary md:hidden">
          <DemoBadge /> Simulated demo — no real AI or backend.
        </div>
        {children}
      </main>
    </div>
  );
}
