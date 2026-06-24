import { useRouterState } from "@tanstack/react-router";
import { Plus, Sparkles } from "lucide-react";
import { useOpenComposer } from "./composer-context";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/posts-virais": "Posts Virais",
  "/planejamento": "Planejamento",
  "/sinais": "Sinais",
  "/cadencias": "Cadências",
  "/revisar": "Revisar & Enviar",
  "/funil": "Funil",
  "/leads": "Leads",
  "/integracoes": "Integrações",
  "/icp": "ICP",
  "/conteudo": "Conteúdo",
};

export function Topbar() {
  const openComposer = useOpenComposer();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = TITLES[pathname] ?? "GS One";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/70 px-10 backdrop-blur-xl">
      <h1 className="font-head text-lg font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2.5">
        <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-[13px] text-[var(--color-sub)] transition hover:border-[var(--color-faint)] hover:text-[var(--color-ink)]">
          <Sparkles className="h-[15px] w-[15px]" strokeWidth={1.6} />
          Ajustar IA
        </button>
        <button
          onClick={openComposer}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-orange)] px-3.5 py-2 text-[13px] font-semibold text-[var(--color-bg)] transition hover:opacity-90"
        >
          <Plus className="h-[15px] w-[15px]" strokeWidth={2} />
          Novo post
        </button>
      </div>
    </header>
  );
}
