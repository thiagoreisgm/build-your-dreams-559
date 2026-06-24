import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/integracoes")({
  head: () => ({ meta: [{ title: "Integrações — GS One" }] }),
  component: () => <ComingSoon title="Integrações" />,
});
