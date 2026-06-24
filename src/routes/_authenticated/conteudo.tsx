import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/conteudo")({
  beforeLoad: () => {
    throw redirect({ to: "/configuracoes", search: { tab: "conteudo" } });
  },
});
