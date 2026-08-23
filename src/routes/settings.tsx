import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
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
import { DemoBadge } from "@/components/status";
import { useDemo } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NGET AI Governance Assurance POC" },
      {
        name: "description",
        content: "POC demo settings: what is simulated, where demo data lives, and demo reset.",
      },
      { property: "og:title", content: "Settings — NGET AI Governance Assurance POC" },
      { property: "og:description", content: "POC demo settings and reset." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { resetDemo, assessments } = useDemo();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[800px]">
      <PageHeader
        title="Settings"
        subtitle="Demo configuration for the POC concept demonstrator."
        actions={<DemoBadge />}
      />

      <div className="space-y-4">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">About this POC</h2>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              All AI behaviour is simulated — no real AI models, indexing, document
              parsing or backend services are used.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              Files you select in the assessment wizard never leave your browser; only
              their names and sizes are shown. Nothing is uploaded or stored remotely.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              Assessment results (72% Conditional, findings and recommendations) are
              fixed illustrative data to demonstrate the concept.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Demo data</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Assessments you create are kept in this browser's local storage so the demo
            survives refreshes. There are currently{" "}
            <span className="font-medium text-foreground">{assessments.length}</span>{" "}
            assessment{assessments.length === 1 ? "" : "s"} in this workspace. Resetting
            clears them and restores the single seeded POC demo assessment
            (AGR-2026-001).
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <RotateCcw className="size-3.5" />
                Reset demo
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset the demo?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes all assessments created in this browser and restores the
                  seeded POC demo assessment (AGR-2026-001).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    resetDemo();
                    toast.success("Demo reset to the seeded POC assessment");
                    navigate({ to: "/" });
                  }}
                >
                  Reset demo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
}
