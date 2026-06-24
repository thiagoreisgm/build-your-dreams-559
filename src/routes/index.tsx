import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { GSPage } from "@/components/gs/page";

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
  { value: "18", label: "Posts no mês" },
  { value: "143", label: "Leads quentes", highlight: true },
  { value: "11%", label: "Taxa de resposta" },
  { value: "2.840", label: "Engajamentos" },
  { value: "7", label: "Para revisar" },
];

const LOOP = [
  { label: "Conteúdo", value: "18" },
  { label: "Planejamento", value: "6" },
  { label: "Sinal", value: "143", accent: true },
  { label: "Prospecção", value: "9" },
  { label: "Funil", value: "R$ 340k" },
];

const CADENCES = [
  { name: "Desafio 5 a 50 — onda 3", leads: 42, resp: 7, prog: "68%" },
  { name: 'Engajou "Demanda Infinita"', leads: 25, resp: 4, prog: "31%" },
  { name: "Reativação PEC", leads: 24, resp: 3, prog: "13%" },
  { name: "CRO — pós-webinar", leads: 14, resp: 0, prog: "9%" },
];

const SIGNALS = [
  {
    name: "Mariana Costa",
    role: "Head de Vendas, TechCorp",
    action: 'comentou em "Por que seu funil vaza"',
    hot: true,
  },
  {
    name: "Rafael Lima",
    role: "CEO, Logística BR",
    action: 'curtiu "O SDR que opera por sinais"',
    hot: false,
  },
  {
    name: "Júlia Andrade",
    role: "Dir. Comercial, SaaSX",
    action: 'comentou em "Cold calling não morreu"',
    hot: true,
  },
];

function Dashboard() {
  return (
    <GSPage subtitle="O loop em movimento — conteúdo gera sinal, sinal vira pipeline.">
      <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div
              className={`font-head text-[26px] leading-none font-bold ${
                s.highlight ? "text-[var(--color-orange)]" : ""
              }`}
            >
              {s.value}
            </div>
            <div className="mt-2 text-xs text-[var(--color-muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
        <h2 className="mb-5 text-xs tracking-[0.12em] text-[var(--color-muted)] uppercase">
          O loop GS One
        </h2>
        <div className="flex items-center gap-3 text-center text-[13px]">
          {LOOP.map((step, i) => (
            <div key={step.label} className="flex flex-1 items-center gap-3">
              <div
                className={`flex-1 rounded-xl py-4 ${
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
                  className={`font-head text-lg font-bold ${
                    step.accent ? "text-[var(--color-orange)]" : ""
                  }`}
                >
                  {step.value}
                </div>
              </div>
              {i < LOOP.length - 1 && (
                <ArrowRight
                  className="h-[18px] w-[18px] shrink-0 text-[var(--color-faint)]"
                  strokeWidth={1.6}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h3 className="font-head mb-5 text-sm font-bold">Cadências ativas</h3>
          <table className="w-full text-[13px]">
            <thead className="text-xs text-[var(--color-muted)]">
              <tr>
                <th className="pb-3 text-left font-medium">Nome</th>
                <th className="pb-3 text-right font-medium">Leads</th>
                <th className="pb-3 text-right font-medium">Resp.</th>
                <th className="pb-3 text-right font-medium">Progr.</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-sub)]">
              {CADENCES.map((c) => (
                <tr key={c.name}>
                  <td className="py-2.5 text-[var(--color-ink)]">{c.name}</td>
                  <td className="text-right">{c.leads}</td>
                  <td
                    className={`text-right ${
                      c.resp ? "text-[var(--color-orange)]" : "text-[var(--color-muted)]"
                    }`}
                  >
                    {c.resp || "—"}
                  </td>
                  <td className="text-right">{c.prog}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h3 className="font-head mb-5 text-sm font-bold">Sinais recentes</h3>
          <div className="space-y-4 text-[13px]">
            {SIGNALS.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-elevated)]" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {s.name} · {s.role}
                  </div>
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
    </GSPage>
  );
}
