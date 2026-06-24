import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/funil")({
  head: () => ({ meta: [{ title: "Funil — GS One" }] }),
  component: () => <ComingSoon title="Funil" />,
});
