import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/_authenticated/icp")({
  head: () => ({ meta: [{ title: "ICP — GS One" }] }),
  component: () => <ComingSoon title="ICP" />,
});
