import { useEffect, useRef, useState } from "react";
import {
  X,
  Sparkles,
  PencilLine,
  TrendingUp,
  Check,
  Send,
  Image as ImageIcon,
  List,
  BarChart3,
  Smile,
  Monitor,
  Smartphone,
  Eye,
  Plus,
  Activity,
  Shield,
  Loader2,
} from "lucide-react";
import { useComposer } from "./composer-context";
import { useServerFn } from "@tanstack/react-start";
import { generateComposerContent, type ComposerAction } from "@/lib/composer-ai.functions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Tab = "ia" | "rascunhos" | "midia" | "alcance";

export function ComposerModal() {
  const { open, setOpen, inspirationId, consumeAutoAction } = useComposer();
  const [tab, setTab] = useState<Tab>("ia");
  const [briefing, setBriefing] = useState("");
  const [loadingAction, setLoadingAction] = useState<ComposerAction | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const generate = useServerFn(generateComposerContent);
  const [text, setText] = useState(
    `A maioria das empresas B2B não está atrasada em IA por falta de ferramenta.

Está atrasada porque não tem sistema.

Ferramenta sem método é custo. Método sem ferramenta é teoria.

No fim, vence quem transforma demanda em processo — não em sorte.`,
  );

  async function runAction(action: ComposerAction) {
    if (loadingAction) return;
    if (action === "improve" && !text.trim()) {
      toast.error("Escreva um rascunho primeiro para a IA melhorar.");
      return;
    }
    setLoadingAction(action);
    try {
      const res = await generate({
        data: {
          action,
          briefing,
          draft: text,
          ...(inspirationId ? { inspirationId } : {}),
        },
      });
      if (res.usage) {
        setUsage(res.usage);
        setLimitReached(res.usage.used >= res.usage.limit);
      }
      if (action === "improve") {
        setText(res.text);
        toast.success("Rascunho melhorado.");
      } else {
        setText((prev) => (prev.trim() ? `${prev}\n\n${res.text}` : res.text));
        toast.success(
          action === "ideas"
            ? "5 ideias geradas."
            : action === "hooks"
              ? "10 hooks gerados."
              : "Post gerado.",
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao gerar conteúdo.";
      if (msg.includes("limite de") && msg.includes("gerações")) {
        setLimitReached(true);
      }
      toast.error(msg);
    } finally {
      setLoadingAction(null);
    }
  }

  // Auto-dispara a ação solicitada ao abrir (ex.: "Adaptar com IA" da biblioteca).
  const autoFiredRef = useRef(false);
  useEffect(() => {
    if (!open) {
      autoFiredRef.current = false;
      return;
    }
    if (autoFiredRef.current) return;
    const pending = consumeAutoAction();
    if (pending) {
      autoFiredRef.current = true;
      void runAction(pending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);



  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Escrever post"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur"
    >
      <div className="gs-composer-card grid h-[min(86vh,720px)] w-full max-w-[1080px] grid-cols-1 overflow-auto rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_30px_80px_rgba(0,0,0,.6)] lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col border-r border-[var(--color-border)]">
          <div className="flex items-center gap-1 border-b border-[var(--color-border)] bg-[var(--color-elevated)]/40 p-2">
            <ComposerTab id="ia" active={tab} setTab={setTab} icon={<Sparkles className="h-3.5 w-3.5" />}>
              IA Assist
            </ComposerTab>
            <ComposerTab id="rascunhos" active={tab} setTab={setTab}>
              Rascunhos
            </ComposerTab>
            <ComposerTab id="midia" active={tab} setTab={setTab}>
              Mídia
            </ComposerTab>
            <ComposerTab
              id="alcance"
              active={tab}
              setTab={setTab}
              icon={<Activity className="h-3.5 w-3.5 text-[var(--color-orange)]" />}
            >
              Alcance
            </ComposerTab>
          </div>

          {tab === "ia" && (
            <div className="flex flex-1 flex-col p-6">
              <div className="flex-1">
                <h3 className="font-head mb-1 text-base font-bold">Assistente Demanda Infinita</h3>
                <p className="mb-6 text-[13px] text-[var(--color-sub)]">
                  Gere posts, hooks e respostas no seu método — não genérico.
                </p>
                <div className="space-y-2.5">
                  {([
                    { icon: Sparkles, label: "Achar ideias", action: "ideas" as const },
                    { icon: PencilLine, label: "Escrever um post", action: "write_post" as const },
                    { icon: TrendingUp, label: "Gerar 10 hooks", action: "hooks" as const },
                    { icon: Check, label: "Melhorar meu rascunho", action: "improve" as const },
                  ]).map((a) => {
                    const isLoading = loadingAction === a.action;
                    const disabled = loadingAction !== null;
                    return (
                      <button
                        key={a.label}
                        disabled={disabled}
                        onClick={() => runAction(a.action)}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-3 text-left text-[13px] transition hover:border-[var(--color-faint)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="h-[18px] w-[18px] animate-spin text-[var(--color-orange)]" strokeWidth={1.6} />
                        ) : (
                          <a.icon className="h-[18px] w-[18px] text-[var(--color-orange)]" strokeWidth={1.6} />
                        )}
                        {a.label}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["skill: viralidade-linkedin", "hooks-dr", "copywriter-dr"].map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-elevated)] px-2.5 py-1 text-[11px] text-[var(--color-sub)]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                {(usage || limitReached) && (
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-[11px]">
                    <span className={limitReached ? "text-[var(--color-orange)]" : "text-[var(--color-sub)]"}>
                      {usage
                        ? `${usage.used} de ${usage.limit} gerações usadas este mês`
                        : "Limite mensal atingido"}
                    </span>
                    {limitReached && (
                      <a
                        href="/configuracoes?tab=cobranca"
                        className="font-medium text-[var(--color-orange)] hover:underline"
                      >
                        Ver planos →
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-5">
                <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2.5">
                  <input
                    value={briefing}
                    onChange={(e) => setBriefing(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loadingAction) runAction("write_post");
                    }}
                    className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--color-muted)]"
                    placeholder="Sobre o que? (opcional)"
                  />
                  <button
                    onClick={() => runAction("write_post")}
                    disabled={loadingAction !== null}
                    className="cursor-pointer text-[var(--color-orange)] disabled:opacity-50"
                  >
                    {loadingAction ? (
                      <Loader2 className="h-[18px] w-[18px] animate-spin" strokeWidth={1.6} />
                    ) : (
                      <Send className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "rascunhos" && (
            <div className="flex-1 space-y-2.5 p-6">
              {[
                { t: "Cold calling não morreu", d: "Todo mundo enterrou a ligação cedo demais..." },
                { t: "O custo do SDR de volume", d: "Cada e-mail extra vale menos que o anterior..." },
                { t: "Carrossel — BANT na prática", d: "7 slides · rascunho" },
              ].map((r) => (
                <div
                  key={r.t}
                  className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-4 hover:border-[var(--color-faint)]"
                >
                  <div className="text-[13px] font-medium">{r.t}</div>
                  <div className="mt-1 truncate text-xs text-[var(--color-muted)]">{r.d}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "midia" && (
            <div className="flex-1 p-6">
              <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-muted)]">
                <ImageIcon className="h-7 w-7 text-[var(--color-faint)]" strokeWidth={1.6} />
                Arraste imagem, PDF de carrossel ou vídeo
              </div>
              <button className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-[13px] hover:border-[var(--color-faint)]">
                <Sparkles className="h-[15px] w-[15px] text-[var(--color-orange)]" strokeWidth={1.6} />
                Gerar carrossel com IA
              </button>
            </div>
          )}

          {tab === "alcance" && (
            <div className="flex-1 space-y-3 overflow-y-auto p-6">
              <ToggleRow
                title="Preview de link"
                desc="Mostra o preview da URL — ajuda no alcance"
                on
              />
              <ToggleRow
                title="Comentário programado"
                desc="1º comentário no seu próprio post (CTA / link)"
              />
              <div className="flex items-center justify-between rounded-xl border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/5 p-4">
                <div className="pr-3">
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-orange)]">
                    <Activity className="h-3.5 w-3.5" strokeWidth={1.6} />
                    Capturar engajadores → Sinais
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--color-sub)]">
                    Quem curtir/comentar entra na fila de Sinais, enriquecido e com mensagem pronta pra você revisar e enviar.
                  </div>
                </div>
                <SwitchOn on />
              </div>
              <ToggleRow
                title="Reciclar se performar"
                desc="Re-publica automaticamente os top posts"
              />
              <div className="flex items-start gap-2.5 pt-2 text-xs text-[var(--color-muted)]">
                <Shield className="h-3.5 w-3.5 shrink-0 text-[var(--color-sub)]" strokeWidth={1.6} />
                <p>
                  Sem auto-connect e sem auto-DM. O GS One captura o sinal e te entrega pronto — o último clique é seu. É o que mantém sua conta segura.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-gold)]" />
              Thiago Reis
            </div>
            <div className="flex items-center gap-2">
              <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)] text-xs">
                <button className="flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-[var(--color-sub)]">
                  <PencilLine className="h-3.5 w-3.5" strokeWidth={1.6} />
                  Editar
                </button>
                <button className="flex cursor-pointer items-center gap-1.5 bg-[var(--color-elevated)] px-2.5 py-1.5 text-[var(--color-ink)]">
                  <Eye className="h-3.5 w-3.5" strokeWidth={1.6} />
                  Preview
                </button>
              </div>
              <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)]">
                <button className="cursor-pointer bg-[var(--color-elevated)] px-2 py-1.5 text-[var(--color-ink)]">
                  <Monitor className="h-[15px] w-[15px]" strokeWidth={1.6} />
                </button>
                <button className="cursor-pointer px-2 py-1.5 text-[var(--color-sub)]">
                  <Smartphone className="h-[15px] w-[15px]" strokeWidth={1.6} />
                </button>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[var(--color-sub)] hover:bg-[var(--color-elevated)]"
              >
                <X className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-5">
            <span className="mb-3 inline-flex items-center gap-1.5 text-[11px] text-[var(--color-gold)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
              Voice: Demanda Infinita
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-64 w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-[var(--color-muted)]"
            />
          </div>

          <div className="flex items-center gap-1 border-t border-[var(--color-border)] px-4 py-2.5 text-[var(--color-sub)]">
            <ToolbarBtn>
              <span className="text-sm font-semibold">B</span>
            </ToolbarBtn>
            <ToolbarBtn>
              <List className="h-4 w-4" strokeWidth={1.6} />
            </ToolbarBtn>
            <ToolbarBtn>
              <span className="text-sm">#</span>
            </ToolbarBtn>
            <ToolbarBtn>
              <ImageIcon className="h-4 w-4" strokeWidth={1.6} />
            </ToolbarBtn>
            <ToolbarBtn>
              <BarChart3 className="h-4 w-4" strokeWidth={1.6} />
            </ToolbarBtn>
            <ToolbarBtn>
              <Smile className="h-4 w-4" strokeWidth={1.6} />
            </ToolbarBtn>
            <span className="ml-auto text-xs text-[var(--color-muted)]">{text.length} / 3000</span>
          </div>

          <div className="flex items-center gap-2 border-t border-[var(--color-border)] px-4 py-3">
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer px-2 text-[13px] text-[var(--color-muted)] hover:text-[var(--color-sub)]"
            >
              Cancelar
            </button>
            <button className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-4 py-2 text-[13px] text-[var(--color-sub)] hover:border-[var(--color-faint)] hover:text-[var(--color-ink)]">
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Novo rascunho
            </button>
            <div className="flex overflow-hidden rounded-lg">
              <button className="cursor-pointer bg-[var(--color-orange)] px-4 py-2 text-left text-[13px] leading-tight font-semibold text-[var(--color-bg)]">
                <div>Agendar</div>
                <div className="text-[10px] font-normal opacity-80">24 jun, 12:00</div>
              </button>
              <button className="cursor-pointer border-l border-black/10 bg-[var(--color-orange)] px-2 text-[var(--color-bg)]">
                ▾
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposerTab({
  id,
  active,
  setTab,
  icon,
  children,
}: {
  id: Tab;
  active: Tab;
  setTab: (t: Tab) => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const on = id === active;
  return (
    <button
      onClick={() => setTab(id)}
      className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition ${
        on
          ? "bg-[var(--color-elevated)] text-[var(--color-ink)]"
          : "text-[var(--color-sub)] hover:text-[var(--color-ink)]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ToggleRow({ title, desc, on }: { title: string; desc: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-4">
      <div className="pr-3">
        <div className="text-[13px] font-medium">{title}</div>
        <div className="mt-0.5 text-xs text-[var(--color-muted)]">{desc}</div>
      </div>
      <SwitchOn on={!!on} />
    </div>
  );
}

function SwitchOn({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-block h-5 w-9 shrink-0 rounded-full ${
        on ? "bg-[var(--color-orange)]" : "border border-[var(--color-border)] bg-[var(--color-bg)]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
          on ? "right-0.5 bg-white" : "left-0.5 bg-[var(--color-sub)]"
        }`}
      />
    </span>
  );
}

function ToolbarBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-[var(--color-elevated)]">
      {children}
    </button>
  );
}
