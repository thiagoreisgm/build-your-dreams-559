import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/_authenticated/cadencias")({
  head: () => ({ meta: [{ title: "Cadências — postai" }] }),
  component: () => <ComingSoon title="Cadências" />,
});
