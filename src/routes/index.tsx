import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { GSPage } from "@/components/gs/page";
import { useOpenComposer } from "@/components/gs/composer-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — GS One" },
      { name: "description", content: "Visão do loop GS One: conteúdo, sinal, prospecção, funil." },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Seguidores", value: "119.980", delta: "+0,2% vs 30d", deltaClass: "text-green-400" },
  { label: "Impressões", value: "209.244", delta: "+9,6% vs 30d", deltaClass: "text-green-400" },
  {
    label: "Leads quentes",
    value: "143",
    delta: "do seu conteúdo",
    deltaClass: "text-[var(--color-orange)]",
    accent: true,
  },
  { label: "Para revisar", value: "7", delta: "mensagens na fila", deltaClass: "text-[var(--color-sub)]" },
];

const IDEAS = [
  "O maior erro que CEOs cometem ao tentar escalar vendas sem processo...",
  "Como uma mudança de mentalidade transformou minha abordagem de vendas...",
  "O segredo por trás de transformar vendas lideradas por fundadores em máquina...",
];

const LOOP = [
  { label: "Conteúdo", value: "18" },
  { label: "Planejar", value: "6" },
  { label: "Sinal", value: "143", accent: true },
  { label: "Prospec.", value: "9" },
  { label: "Funil", value: "R$ 340k" },
];

const CREATORS = [
  { name: "Jani Vrancsik", followers: "12.132 seguidores" },
  { name: "Ravi Shrivas", followers: "1.411 seguidores" },
  { name: "Aline Souza", followers: "8.940 seguidores" },
];

const ENGAGE_POSTS = [
  { name: "Luke Shalom", desc: '"Alcance é métrica de vaidade..." · 49' },
  { name: "Matt Gray", desc: '"Verdade dura que eu queria saber..." · 188' },
  { name: "Amelia Sordell", desc: '"Conselho de carreira no início..." · 147' },
];

const SIGNALS = [
  { name: "Mariana Costa", action: 'comentou em "Por que seu funil vaza"', hot: true },
  { name: "Rafael Lima", action: 'curtiu "O SDR que opera por sinais"', hot: false },
  { name: "Júlia Andrade", action: 'comentou em "Cold calling não morreu"', hot: true },
];

function Dashboard() {
  const openComposer = useOpenComposer();

  return (
    <GSPage>
      <h1 className="font-head mb-1 text-[22px] font-extrabold">Bem-vindo de volta, Thiago</h1>
      <p className="mb-7 text-sm text-[var(--color-sub)]">
        O loop em movimento — conteúdo gera sinal, sinal vira pipeline.
      </p>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border bg-[var(--color-surface)] p-5 ${
              s.accent ? "border-[var(--color-orange)]/30" : "border-[var(--color-border)]"
            }`}
          >
            <div className="mb-2 text-xs text-[var(--color-muted)]">{s.label}</div>
            <div
              className={`font-head text-[26px] leading-none font-bold ${
                s.accent ? "text-[var(--color-orange)]" : ""
              }`}
            >
              {s.value}
            </div>
            <div className={`mt-2 text-[11px] ${s.deltaClass}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-5 lg:col-span-2">
          {/* Ideias de post */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-head text-sm font-bold">Ideias de post pra você</h3>
              <button className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-sub)]">
                <Sparkles className="h-[13px] w-[13px]" strokeWidth={1.6} />
                Novas ideias
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {IDEAS.map((idea) => (
                <div
                  key={idea}
                  className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-4"
                >
                  <p className="flex-1 text-[13px] leading-relaxed text-[var(--color-sub)]">{idea}</p>
                  <button
                    onClick={openComposer}
                    className="mt-4 flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[var(--color-orange)]"
                  >
                    Gerar post
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Loop */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="font-head mb-5 text-sm font-bold">O loop GS One</h3>
            <div className="flex items-center gap-2 text-center text-xs">
              {LOOP.map((step, i) => (
                <div key={step.label} className="flex flex-1 items-center gap-2">
                  <div
                    className={`flex-1 rounded-xl py-3 ${
                      step.accent
                        ? "border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/5"
                        : ""
                    }`}
                  >
                    <div
                      className={`mb-1 ${
                        step.accent ? "text-[var(--color-orange)]" : "text-[var(--color-sub)]"
                      }`}
                    >
                      {step.label}
                    </div>
                    <div
                      className={`font-head text-base font-bold ${
                        step.accent ? "text-[var(--color-orange)]" : ""
                      }`}
                    >
                      {step.value}
                    </div>
                  </div>
                  {i < LOOP.length - 1 && (
                    <ArrowRight
                      className="h-[15px] w-[15px] shrink-0 text-[var(--color-faint)]"
                      strokeWidth={1.6}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Criadores de referência */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-head text-sm font-bold">Criadores de referência</h3>
              <button className="cursor-pointer text-xs text-[var(--color-muted)] hover:text-[var(--color-sub)]">
                Gerenciar
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {CREATORS.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-4"
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-surface)]" />
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-medium">{c.name}</div>
                      <div className="text-[11px] text-[var(--color-muted)]">{c.followers}</div>
                    </div>
                  </div>
                  <button className="flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[var(--color-orange)]">
                    Adaptar posts
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-5">
          {/* Hub de engajamento */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-head text-sm font-bold">Hub de engajamento</h3>
              <ArrowRight className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.6} />
            </div>
            <div className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-[var(--color-sub)]">Progresso da semana</span>
                <span className="text-[var(--color-muted)]">5/20 comentários</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
                <div className="h-full rounded-full bg-[var(--color-orange)]" style={{ width: "25%" }} />
              </div>
            </div>
            <div className="mb-3 text-xs text-[var(--color-muted)]">Posts pra engajar</div>
            <div className="space-y-3.5 text-[13px]">
              {ENGAGE_POSTS.map((p) => (
                <div key={p.name} className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-elevated)]" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{p.name}</div>
                    <div className="truncate text-xs text-[var(--color-muted)]">{p.desc}</div>
                  </div>
                  <button className="shrink-0 cursor-pointer text-[var(--color-orange)]">
                    <Sparkles className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sinais quentes */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-head text-sm font-bold">Sinais quentes</h3>
              <button className="cursor-pointer text-xs text-[var(--color-orange)]">Ver todos</button>
            </div>
            <div className="space-y-4 text-[13px]">
              {SIGNALS.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-elevated)]" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{s.name}</div>
                    <div className="truncate text-xs text-[var(--color-muted)]">{s.action}</div>
                  </div>
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      s.hot ? "bg-[var(--color-orange)]" : "bg-[var(--color-sub)]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GSPage>
  );
}
