import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/revisar")({
  head: () => ({ meta: [{ title: "Revisar & Enviar — GS One" }] }),
  component: () => <ComingSoon title="Revisar & Enviar" />,
});
