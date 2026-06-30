import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/_authenticated/sinais")({
  head: () => ({ meta: [{ title: "Sinais — postai" }] }),
  component: () => <ComingSoon title="Sinais" />,
});
