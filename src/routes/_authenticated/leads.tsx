import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads — GS One" }] }),
  component: () => <ComingSoon title="Leads" />,
});
