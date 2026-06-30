import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GSPage } from "@/components/gs/page";
import { PerfilTab } from "@/components/gs/settings/perfil-tab";
import { ConteudoTab } from "@/components/gs/settings/conteudo-tab";
import { ICPTab } from "@/components/gs/settings/icp-tab";
import { IntegracoesTab } from "@/components/gs/settings/integracoes-tab";
import { CobrancaTab } from "@/components/gs/settings/cobranca-tab";
import { EquipeTab } from "@/components/gs/settings/equipe-tab";

type Tab = "perfil" | "conteudo" | "icp" | "integracoes" | "cobranca" | "equipe";
const TABS: { id: Tab; label: string }[] = [
  { id: "perfil", label: "Perfil" },
  { id: "conteudo", label: "Conteúdo" },
  { id: "icp", label: "ICP" },
  { id: "integracoes", label: "Integrações" },
  { id: "cobranca", label: "Cobrança" },
  { id: "equipe", label: "Equipe" },
];

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — postai" }] }),
  validateSearch: (s: Record<string, unknown>): { tab?: Tab } => {
    const t = String(s.tab ?? "");
    return TABS.some((x) => x.id === t) ? { tab: t as Tab } : {};
  },
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const current: Tab = tab ?? "perfil";

  return (
    <GSPage>
      <h1 className="font-head mb-6 text-2xl font-bold tracking-tight">Configurações</h1>
      <div className="mb-8 -mx-1 overflow-x-auto">
        <div
          role="tablist"
          aria-label="Seções de configurações"
          className="flex min-w-max gap-1 border-b border-[var(--color-border)] px-1"
        >
          {TABS.map((t) => {
            const active = current === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() =>
                  navigate({ to: "/configuracoes", search: { tab: t.id }, replace: true })
                }
                className={`cursor-pointer border-b-2 px-4 py-3 text-[13px] font-medium transition focus-visible:outline-none focus-visible:text-[var(--color-ink)] ${
                  active
                    ? "border-[var(--color-orange)] text-[var(--color-orange)]"
                    : "border-transparent text-[var(--color-sub)] hover:text-[var(--color-ink)]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {current === "perfil" && <PerfilTab />}
      {current === "conteudo" && <ConteudoTab />}
      {current === "icp" && <ICPTab />}
      {current === "integracoes" && <IntegracoesTab />}
      {current === "cobranca" && <CobrancaTab />}
      {current === "equipe" && <EquipeTab />}
    </GSPage>
  );
}
