import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/assessments/$assessmentId")({
  component: AssessmentLayout,
});

function AssessmentLayout() {
  return <Outlet />;
}
