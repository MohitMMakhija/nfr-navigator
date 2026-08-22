import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/frameworks")({
  component: FrameworksLayout,
});

function FrameworksLayout() {
  return <Outlet />;
}
