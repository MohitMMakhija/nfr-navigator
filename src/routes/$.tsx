import { createFileRoute, Navigate } from "@tanstack/react-router";

// Graceful fallback for routes removed during the POC simplification
// (e.g. /risks, /heatmap, /stage-gate): redirect to the dashboard.
export const Route = createFileRoute("/$")({
  component: () => <Navigate to="/" />,
});
