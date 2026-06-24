import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/gs/page";

export const Route = createFileRoute("/posts-virais")({
  head: () => ({ meta: [{ title: "Posts Virais — GS One" }] }),
  component: () => <ComingSoon title="Posts Virais" />,
});
