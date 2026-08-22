import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/risks")({
  component: RisksLayout,
});

function RisksLayout() {
  return <Outlet />;
}
