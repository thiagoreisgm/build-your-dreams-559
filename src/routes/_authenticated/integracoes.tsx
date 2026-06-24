import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/integracoes")({
  beforeLoad: () => {
    throw redirect({ to: "/configuracoes", search: { tab: "integracoes" } });
  },
});
