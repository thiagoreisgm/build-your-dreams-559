import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/icp")({
  beforeLoad: () => {
    throw redirect({ to: "/configuracoes", search: { tab: "icp" } });
  },
});
