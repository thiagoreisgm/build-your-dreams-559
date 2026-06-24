import { CheckCircle2, Link2, Plug } from "lucide-react";
import { Card } from "./primitives";

const SMALL = [
  { name: "GS Engage", desc: "Cadências automatizadas no LinkedIn", status: "Conectado" },
  { name: "Prospct.ia", desc: "Banco de leads B2B brasileiro", status: "Conectar" },
  { name: "Enriquecimento BR (Speedio)", desc: "CNPJ, faturamento, headcount", status: "Conectar" },
  { name: "WhatsApp via Z-API", desc: "Mensagens 1:1 a partir dos sinais", status: "Conectar" },
];

export function IntegracoesTab() {
  return (
    <div>
      <p className="mb-6 text-sm text-[var(--color-sub)]">
        Tudo via APIs oficiais e OAuth. Conecte uma vez e mantenha o app em sincronia.
      </p>

      <div className="rounded-2xl border border-[var(--color-orange)]/25 bg-[var(--color-surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-elevated)]">
              <Link2 className="h-6 w-6 text-[var(--color-orange)]" strokeWidth={1.6} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-head text-base font-bold">LinkedIn</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-400">
                  <CheckCircle2 className="h-3 w-3" /> Conectado
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[var(--color-sub)]">thiago@growthmachine.com.br</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button className="cursor-pointer rounded-lg border border-[var(--color-border)] px-3 py-2 text-[12px] text-[var(--color-sub)] hover:text-[var(--color-ink)]">
              Reconectar
            </button>
            <button className="cursor-pointer rounded-lg border border-[var(--color-border)] px-3 py-2 text-[12px] text-[var(--color-sub)] hover:text-[var(--color-ink)]">
              Desconectar
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Publicar posts", v: "Permitido" },
            { label: "Ler engajamento", v: "Permitido" },
            { label: "Saúde da conta", v: "Saudável" },
          ].map((p) => (
            <div
              key={p.label}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-3"
            >
              <div className="text-[11px] text-[var(--color-muted)]">{p.label}</div>
              <div className="mt-0.5 text-[13px] font-medium">{p.v}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12px] text-[var(--color-muted)]">
          Extensão opcional de captura de sinal — instale para capturar engajamento privado em
          posts seus.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {SMALL.map((s) => {
          const connected = s.status === "Conectado";
          return (
            <Card key={s.name} title={s.name} hint={s.desc}>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    connected
                      ? "bg-green-500/10 text-green-400"
                      : "bg-[var(--color-elevated)] text-[var(--color-muted)]"
                  }`}
                >
                  {connected ? <CheckCircle2 className="h-3 w-3" /> : <Plug className="h-3 w-3" />}
                  {s.status}
                </span>
                <button className="cursor-pointer rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12px] text-[var(--color-sub)] hover:text-[var(--color-ink)]">
                  {connected ? "Gerenciar" : "Conectar"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-[12px] text-[var(--color-muted)]">
        100% via APIs oficiais e OAuth, nunca por cookie — é o que mantém a conta longe de
        restrições.
      </p>
    </div>
  );
}
