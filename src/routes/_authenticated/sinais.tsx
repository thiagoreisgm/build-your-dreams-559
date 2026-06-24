import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/_authenticated/sinais")({
  head: () => ({ meta: [{ title: "Sinais — GS One" }] }),
  component: () => <ComingSoon title="Sinais" />,
});
