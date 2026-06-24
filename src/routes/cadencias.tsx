import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/cadencias")({
  head: () => ({ meta: [{ title: "Cadências — GS One" }] }),
  component: () => <ComingSoon title="Cadências" />,
});
