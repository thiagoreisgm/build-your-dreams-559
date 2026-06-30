import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Sparkles,
  Radar,
  Send,
  Inbox,
  Shield,
  BarChart3,
  Workflow,
  MessageCircle,
  PenLine,
  X,
  Menu,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE = "https://leadpost.ai";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeadPost.ai — IA para gerar demanda no LinkedIn" },
      {
        name: "description",
        content:
          "Publique com IA, capture quem comenta e reage em cada post, e transforme esse sinal em conexão e DM no automático. Mais pipeline, zero garimpo.",
      },
      { property: "og:title", content: "LeadPost.ai — IA para gerar demanda no LinkedIn" },
      {
        property: "og:description",
        content:
          "Conteúdo e prospecção no LinkedIn, num só loop. Demanda Infinita, no automático.",
      },
      { property: "og:url", content: SITE },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "LeadPost.ai — IA para gerar demanda no LinkedIn" },
      {
        name: "twitter:description",
        content: "Você posta. A máquina prospecta. Mais pipeline, zero garimpo.",
      },
    ],
    links: [{ rel: "canonical", href: SITE }],
  }),
  component: Landing,
});

/* ─────────────────────────── tokens ─────────────────────────── */

const BG = "#FFFFFF";
const SURFACE = "#F7F8FA";
const SURFACE_2 = "#EEF1F6";
const BORDER = "rgba(10,10,10,0.08)";
const INK = "#0A0A0A";
const INK_2 = "#1A1A1A";
const SUB = "#5B6472";
const ORANGE = "#1B57FF";
const GOLD = "#0A3FCC";

const fDisplay = { fontFamily: "'Archivo Black', sans-serif", letterSpacing: "-0.02em" };
const fEyebrow = { fontFamily: "'Syne', sans-serif", letterSpacing: "0.18em" };
const fBody = { fontFamily: "'DM Sans', sans-serif" };

/* ─────────────────────────── primitives ─────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-xs sm:text-sm font-semibold uppercase"
      style={{ ...fEyebrow, color: GOLD }}
    >
      {children}
    </div>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="text-[44px] leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[88px]"
      style={{ ...fDisplay, color: INK }}
    >
      {children}
    </h1>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.05]"
      style={fDisplay}
    >
      {children}
    </h2>
  );
}

function CTAPrimary({
  children,
  href = "/auth",
  size = "md",
}: {
  children: React.ReactNode;
  href?: string;
  size?: "md" | "lg";
}) {
  return (
    <Link
      to={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all duration-200 shadow-[0_8px_24px_-8px_rgba(249,101,0,0.6)] hover:shadow-[0_12px_32px_-8px_rgba(249,101,0,0.85)] hover:-translate-y-0.5 ${
        size === "lg" ? "px-8 py-4 text-base sm:text-lg" : "px-5 py-3 text-sm sm:text-base"
      }`}
      style={{ background: ORANGE }}
    >
      {children}
    </Link>
  );
}

function CTAGhost({
  children,
  href = "#como-funciona",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm sm:text-base font-semibold transition-colors hover:bg-white/5"
      style={{ color: INK, border: `1px solid ${BORDER}` }}
    >
      {children}
    </a>
  );
}

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  // Pure CSS fade-up. Plays on first paint; cheap and SSR-safe.
  return (
    <div
      className={`gs-fadeup ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: BG, color: INK_2, ...fBody }} className="min-h-screen">
      <style>{`
        .gs-fadeup { opacity: 0; transform: translateY(12px); animation: gsFadeUp .7s cubic-bezier(.2,.6,.2,1) forwards; }
        @keyframes gsFadeUp { to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .gs-fadeup { animation: none; opacity: 1; transform: none; } }
        .lp-card { transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
        .lp-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.18); box-shadow: 0 12px 40px -16px rgba(249,101,0,.18); }
      `}</style>

      {/* Announcement bar */}
      <div
        className="w-full text-center text-xs sm:text-sm py-2 px-4"
        style={{ background: SURFACE_2, borderBottom: `1px solid ${BORDER}`, color: INK_2 }}
      >
        🔥 Novo: a IA agora prospecta quem comenta seu post — automaticamente.{" "}
        <a
          href="#como-funciona"
          className="font-semibold underline underline-offset-4"
          style={{ color: GOLD }}
        >
          Ver como funciona
        </a>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled ? "py-2 backdrop-blur" : "py-4"
        }`}
        style={{
          background: scrolled ? "rgba(10,10,10,0.85)" : "rgba(10,10,10,0.6)",
          borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-2" style={fDisplay}>
            <span className="text-xl sm:text-2xl text-white">
              LeadPost<span style={{ color: ORANGE }}>.ai</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: INK_2 }}>
            <a href="#produto" className="hover:text-white text-[color:var(--sub)]" style={{ color: SUB }}>
              Produto
            </a>
            <a href="#como-funciona" className="hover:opacity-90" style={{ color: SUB }}>
              Como funciona
            </a>
            <a href="#recursos" className="hover:opacity-90" style={{ color: SUB }}>
              Recursos
            </a>
            <a href="#precos" className="hover:opacity-90" style={{ color: SUB }}>
              Preços
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/auth"
              className="text-sm font-semibold px-3 py-2 rounded-lg hover:bg-white/5"
              style={{ color: INK }}
            >
              Entrar
            </Link>
            <CTAPrimary>Começar grátis</CTAPrimary>
          </div>
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: INK, border: `1px solid ${BORDER}` }}
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {menuOpen && (
          <div
            className="md:hidden mx-4 mt-2 rounded-xl p-4 flex flex-col gap-3"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <a href="#produto" onClick={() => setMenuOpen(false)}>Produto</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#recursos" onClick={() => setMenuOpen(false)}>Recursos</a>
            <a href="#precos" onClick={() => setMenuOpen(false)}>Preços</a>
            <Link to="/auth" className="font-semibold">Entrar</Link>
            <CTAPrimary>Começar grátis</CTAPrimary>
          </div>
        )}
      </header>

      <main id="top">
        <Hero />
        <SocialProof />
        <Problema />
        <Solucao />
        <ComoFunciona />
        <Recursos />
        <Diferencial />
        <Depoimentos />
        <Seguranca />
        <Precos />
        <FAQ />
        <CTAFinal />
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, rgba(249,101,0,0.18) 0%, rgba(10,10,10,0) 60%), radial-gradient(40% 35% at 10% 30%, rgba(212,175,55,0.10) 0%, rgba(10,10,10,0) 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-20 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <FadeUp>
            <Eyebrow>IA PARA GERAR DEMANDA NO LINKEDIN</Eyebrow>
          </FadeUp>
          <FadeUp delay={80} className="mt-5">
            <H1>
              O LinkedIn não é vitrine.
              <br />
              É a sua <span style={{ color: ORANGE }}>máquina de demanda</span>.
            </H1>
            {/*
              A/B alternativas (manter em comentário):
              "Mais reunião. Menos trabalho. Saindo do conteúdo que você já publica."
              "Você está deixando dinheiro na mesa toda vez que alguém comenta no seu post."
            */}
          </FadeUp>
          <FadeUp delay={160} className="mt-6">
            <p className="text-base sm:text-lg max-w-2xl" style={{ color: SUB }}>
              O LeadPost publica com IA, captura quem comenta e reage em cada post,
              e transforma esse sinal em conexão e conversa na DM — sozinho. Você
              posta. A máquina prospecta. Mais pipeline, zero garimpo.
            </p>
          </FadeUp>
          <FadeUp delay={220} className="mt-7 space-y-3 max-w-xl">
            {[
              "Quem comenta ou reage vira lead e entra na cadência sozinho",
              "O mesmo conteúdo gerando mais conversa, sem mais esforço",
              "DM, conexão e follow-up no automático — enquanto você dorme",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3">
                <span
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(212,175,55,0.12)", border: `1px solid ${GOLD}` }}
                >
                  <Check size={12} style={{ color: GOLD }} />
                </span>
                <span className="text-[15px] sm:text-base" style={{ color: INK_2 }}>
                  {t}
                </span>
              </div>
            ))}
          </FadeUp>
          <FadeUp delay={280} className="mt-8 flex flex-wrap gap-3">
            <CTAPrimary size="lg">
              Começar grátis <ArrowRight size={18} />
            </CTAPrimary>
            <CTAGhost>
              Ver como funciona <ArrowRight size={16} />
            </CTAGhost>
          </FadeUp>
          <FadeUp delay={340}>
            <p className="mt-4 text-xs sm:text-sm" style={{ color: SUB }}>
              Feito para o B2B brasileiro. Sem cartão pra testar.
            </p>
          </FadeUp>
        </div>

        {/* Mock visual */}
        <FadeUp delay={200} className="lg:col-span-5">
          <HeroMock />
        </FadeUp>
      </div>
    </section>
  );
}

function HeroMock() {
  return (
    <div className="relative">
      {/* Feed card */}
      <div
        className="lp-card rounded-2xl p-5 sm:p-6"
        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full"
            style={{ background: "linear-gradient(135deg,#F96500,#D4AF37)" }}
          />
          <div>
            <div className="text-sm font-semibold" style={{ color: INK }}>
              Você • Founder
            </div>
            <div className="text-xs" style={{ color: SUB }}>
              Agora · LinkedIn
            </div>
          </div>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: INK_2 }}>
          A maioria dos posts no LinkedIn não vende porque para no like.
          <br />
          O ponto não é postar mais — é fechar o loop entre quem engajou e a sua DM.
        </p>
        <div className="mt-4 flex items-center gap-5 text-xs" style={{ color: SUB }}>
          <span>👍 248</span>
          <span>💬 42 comentários</span>
          <span>🔁 11</span>
        </div>
        <div
          className="mt-4 rounded-xl px-3 py-2 text-xs flex items-center gap-2"
          style={{ background: "rgba(249,101,0,0.10)", border: `1px solid rgba(249,101,0,0.35)`, color: INK_2 }}
        >
          <Radar size={14} style={{ color: ORANGE }} />
          LeadPost capturou <strong className="mx-1">42 sinais</strong> deste post.
        </div>
      </div>

      {/* Floating DM card */}
      <div
        className="lp-card absolute -bottom-8 -right-2 sm:-right-6 w-[78%] sm:w-[70%] rounded-2xl p-4 shadow-2xl"
        style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: INK }}>
            <MessageCircle size={14} style={{ color: GOLD }} /> DM enviada
          </div>
          <span className="text-[10px]" style={{ color: SUB }}>
            há 2 min
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-snug" style={{ color: INK_2 }}>
          "Oi Marina, vi que você comentou pedindo o playbook — segue o link.
          Faz sentido marcarmos 15min essa semana?"
        </p>
        <div className="mt-2 text-[11px]" style={{ color: GOLD }}>
          ✓ automático · cadência ativa
        </div>
      </div>

      {/* Floating signal card */}
      <div
        className="lp-card absolute -top-6 -left-2 sm:-left-6 rounded-xl p-3"
        style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: INK }}>
          <Sparkles size={14} style={{ color: ORANGE }} /> Lead quente
        </div>
        <div className="text-[11px]" style={{ color: SUB }}>
          Diretor de Marketing · SaaS B2B
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── SOCIAL PROOF ─────────────────────────── */

function SocialProof() {
  return (
    <section className="py-16" style={{ borderTop: `1px solid ${BORDER}`, background: SURFACE }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <p className="text-sm sm:text-base" style={{ color: SUB }}>
          Operadores de vendas B2B que pararam de postar pra ego — e começaram a
          postar pra pipeline.
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center opacity-50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-md"
              style={{
                background:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 12px, rgba(255,255,255,0.06) 12px 24px)",
              }}
              aria-hidden
            />
          ))}
        </div>
        <p className="mt-8 text-xs sm:text-sm" style={{ color: SUB }}>
          Mais de <span style={{ color: INK }}>[X] posts publicados</span> ·{" "}
          <span style={{ color: INK }}>[Y] leads</span> capturados de comentários ·{" "}
          <span style={{ color: INK }}>[Z] reuniões</span> geradas.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────── PROBLEMA ─────────────────────────── */

function Problema() {
  return (
    <section id="produto" className="py-24" style={{ background: BG }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <FadeUp>
          <H2>
            Você gera demanda toda semana.{" "}
            <span style={{ color: ORANGE }}>E joga ela fora toda semana.</span>
          </H2>
        </FadeUp>
        <FadeUp delay={100} className="mt-8 space-y-5 text-[17px] leading-relaxed" >
          <p style={{ color: INK_2 }}>
            Seu post deu certo. 40 comentários, gente pedindo o material, decisor
            curtindo. E aí? <strong>Morreu ali.</strong> Porque pra transformar aquilo
            em conversa você teria que abrir perfil por perfil, mandar convite,
            esperar aceitar, mandar DM, lembrar do follow-up — pra cada um.
          </p>
          <p style={{ color: INK_2 }}>
            Você não faz porque é insano fazer na mão. Então a demanda que você suou
            pra criar evapora. <strong style={{ color: GOLD }}>Toda. Semana.</strong>
          </p>
          <p style={{ color: SUB }}>
            Não é falta de conteúdo. É um ralo aberto entre o like e a venda — e é
            por ele que seu faturamento está escorrendo.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────── SOLUÇÃO ─────────────────────────── */

function Solucao() {
  const rows = [
    ["Posta e torce pra alguém chamar na DM", "Quem engaja é capturado e abordado sozinho"],
    ["Prospecção em massa pra lista fria", "Prospecção só pra quem demonstrou interesse"],
    ["Conteúdo de um lado, vendas do outro", "Conteúdo e prospecção no mesmo loop"],
    ["Conta queimando por excesso de convite", "Limites seguros automáticos por conta"],
    [
      "Métrica de vaidade (curtida, seguidor)",
      "Métrica de pipeline (lead, conexão, resposta)",
    ],
  ];

  return (
    <section className="py-24" style={{ background: SURFACE }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeUp>
          <H2>
            Conheça o LeadPost:{" "}
            <span style={{ color: ORANGE }}>o conteúdo vira pipeline sozinho.</span>
          </H2>
        </FadeUp>
        <FadeUp delay={80}>
          <p className="mt-6 text-[17px] max-w-3xl" style={{ color: INK_2 }}>
            O LeadPost fecha o loop que ninguém fechou. Você publica com IA. A
            plataforma lê quem comentou e reagiu. Conecta com quem não é da sua
            rede. Puxa pra DM quem levantou a mão. E acompanha até virar reunião —
            sem você tocar em nada.
          </p>
          <p className="mt-3 text-[15px]" style={{ color: SUB }}>
            Não é agendador. Não é disparador de spam. É a sua operação de{" "}
            <strong style={{ color: GOLD }}>Demanda Infinita</strong> no piloto automático.
          </p>
        </FadeUp>

        {/* Mobile: cards; Desktop: tabela */}
        <FadeUp delay={140} className="mt-12">
          <div className="hidden md:grid grid-cols-2 rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
            <div className="p-5 text-sm font-semibold uppercase" style={{ background: SURFACE_2, color: SUB, ...fEyebrow, letterSpacing: "0.15em" }}>
              ❌ O jeito antigo
            </div>
            <div className="p-5 text-sm font-semibold uppercase" style={{ background: "rgba(212,175,55,0.10)", color: GOLD, ...fEyebrow, letterSpacing: "0.15em" }}>
              ✅ Com o LeadPost
            </div>
            {rows.map(([a, b], i) => (
              <div key={i} className="contents">
                <div className="p-5 text-[15px]" style={{ borderTop: `1px solid ${BORDER}`, color: SUB }}>
                  {a}
                </div>
                <div
                  className="p-5 text-[15px]"
                  style={{ borderTop: `1px solid ${BORDER}`, background: "rgba(212,175,55,0.04)", color: INK }}
                >
                  <Check size={14} style={{ color: GOLD, display: "inline", marginRight: 8, verticalAlign: "middle" }} />
                  {b}
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-4">
            {rows.map(([a, b], i) => (
              <div key={i} className="rounded-xl p-4 lp-card" style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}>
                <div className="text-xs uppercase" style={{ color: SUB, ...fEyebrow }}>❌ Antigo</div>
                <p className="text-[14px] mt-1" style={{ color: SUB }}>{a}</p>
                <div className="text-xs uppercase mt-3" style={{ color: GOLD, ...fEyebrow }}>✅ LeadPost</div>
                <p className="text-[14px] mt-1" style={{ color: INK }}>{b}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────── COMO FUNCIONA ─────────────────────────── */

function ComoFunciona() {
  const steps = [
    {
      n: "01",
      icon: PenLine,
      title: "Publica com IA",
      body: "Escolha gancho e formato. A IA escreve o post pra gerar demanda e agenda no melhor horário.",
      reframe: "O post não é o fim. É o gatilho.",
    },
    {
      n: "02",
      icon: Radar,
      title: "Captura o sinal",
      body: "Quem comenta ou reage vira lead com nome, cargo e empresa.",
      reframe: "Curtida não é vaidade. É intenção de compra esperando ser abordada.",
    },
    {
      n: "03",
      icon: Send,
      title: "Prospecta no automático",
      body: "Conexão pra quem não é da rede, DM pra quem aceitou, follow-up encadeado — no limite seguro.",
      reframe: "Quem pediu o material no comentário recebe na DM em minutos — antes de esfriar.",
    },
    {
      n: "04",
      icon: Inbox,
      title: "Acompanha o pipeline",
      body: "Respondeu? A conversa para a cadência e cai no inbox unificado.",
      reframe: "Você gasta seu tempo fechando, não garimpando.",
    },
  ];

  return (
    <section id="como-funciona" className="py-24" style={{ background: BG }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeUp>
          <Eyebrow>COMO FUNCIONA</Eyebrow>
        </FadeUp>
        <FadeUp delay={80} className="mt-4">
          <H2>
            Você faz uma coisa: <span style={{ color: ORANGE }}>publicar</span>.
            <br />
            A máquina faz o resto.
          </H2>
        </FadeUp>

        <div className="mt-14 grid sm:grid-cols-2 gap-5">
          {steps.map((s, i) => (
            <FadeUp key={s.n} delay={i * 80}>
              <div
                className="lp-card h-full rounded-2xl p-6"
                style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="text-xs px-2 py-1 rounded-md font-bold"
                    style={{ background: "rgba(249,101,0,0.10)", color: ORANGE, ...fEyebrow, letterSpacing: "0.12em" }}
                  >
                    {s.n}
                  </div>
                  <s.icon size={20} style={{ color: GOLD }} />
                </div>
                <h3 className="mt-4 text-2xl" style={fDisplay}>
                  {s.title}
                </h3>
                <p className="mt-2 text-[15px]" style={{ color: INK_2 }}>
                  {s.body}
                </p>
                <p className="mt-4 text-[14px] italic" style={{ color: GOLD }}>
                  "{s.reframe}"
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={120}>
          <p className="mt-12 text-center text-[16px] max-w-3xl mx-auto" style={{ color: SUB }}>
            Repare onde seu nome aparece: <strong style={{ color: INK }}>passo 1</strong> e{" "}
            <strong style={{ color: INK }}>passo 4</strong>. O meio inteiro — a parte que dá
            trabalho — roda sem você.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────── RECURSOS ─────────────────────────── */

function Recursos() {
  const items = [
    { icon: Sparkles, title: "IA treinada pra gerar demanda", body: "Ganchos e CTA pensados pra puxar comentário de quem compra, não like de quem passa." },
    { icon: Radar, title: "Captura de sinal", body: "Todo engajamento vira lead enriquecido. O que morria na tela agora alimenta seu funil." },
    { icon: Workflow, title: "Auto-connect", body: "Comentou e não é conexão? O convite sai sozinho, com nota personalizada." },
    { icon: Send, title: "DM disparada por comentário", body: "Quem pediu o material recebe em minutos, no automático. Zero lead perdido, zero copiar-e-colar." },
    { icon: MessageCircle, title: "Cadência multi-passo com ramificação", body: "Aquecer → conectar → esperar → mensagem → follow-up, com desvio por comportamento. Salve como template." },
    { icon: Inbox, title: "Inbox unificado", body: "Toda resposta num só lugar. A cadência para sozinha quando o lead responde." },
    { icon: Shield, title: "Motor de segurança", body: "Limites diários, intervalos aleatórios, pausa no risco. A gente protege a conta como se fosse a nossa." },
    { icon: BarChart3, title: "Analytics de pipeline", body: "Leads, convites, conexões, respostas e conversões. O caminho da curtida até a reunião." },
  ];

  return (
    <section id="recursos" className="py-24" style={{ background: SURFACE }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeUp><Eyebrow>RECURSOS</Eyebrow></FadeUp>
        <FadeUp delay={80} className="mt-4">
          <H2>
            Tudo que você precisa pra fazer o LinkedIn{" "}
            <span style={{ color: ORANGE }}>vender</span>.
          </H2>
        </FadeUp>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <FadeUp key={it.title} delay={(i % 4) * 70}>
              <div
                className="lp-card h-full rounded-2xl p-5"
                style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}
              >
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "rgba(249,101,0,0.12)", color: ORANGE, border: `1px solid rgba(249,101,0,0.35)` }}
                >
                  <it.icon size={18} />
                </div>
                <h3 className="mt-4 text-lg" style={{ ...fDisplay, color: INK }}>
                  {it.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: SUB }}>
                  {it.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── DIFERENCIAL ─────────────────────────── */

function Diferencial() {
  const caps = [
    ["Publica com IA", true, false, true],
    ["Captura quem engaja no post", false, "parcial", true],
    ["Conecta com quem comentou", false, false, true],
    ["DM disparada por comentário", false, false, true],
    ["Cadência multi-passo com desvio", false, true, true],
    ["Limites de segurança por conta", false, "parcial", true],
    ["Pipeline num só lugar", false, false, true],
  ] as const;

  const Mark = ({ v }: { v: true | false | "parcial" }) =>
    v === true ? (
      <Check size={16} style={{ color: GOLD }} />
    ) : v === "parcial" ? (
      <span className="text-xs" style={{ color: SUB }}>parcial</span>
    ) : (
      <span style={{ color: SUB }}>—</span>
    );

  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeUp>
          <H2>
            Não é um agendador. Não é um disparador.{" "}
            <span style={{ color: ORANGE }}>É o loop inteiro.</span>
          </H2>
        </FadeUp>

        <FadeUp delay={100} className="mt-10">
          {/* Desktop table */}
          <div
            className="hidden md:block rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: SURFACE_2 }}>
                  <th className="text-left p-4 font-semibold" style={{ color: INK }}>Capacidade</th>
                  <th className="p-4 font-semibold" style={{ color: SUB }}>Ferramenta de conteúdo</th>
                  <th className="p-4 font-semibold" style={{ color: SUB }}>Ferramenta de prospecção</th>
                  <th
                    className="p-4 font-semibold"
                    style={{ color: ORANGE, background: "rgba(249,101,0,0.08)", borderLeft: `2px solid ${ORANGE}`, borderRight: `2px solid ${ORANGE}` }}
                  >
                    LeadPost
                  </th>
                </tr>
              </thead>
              <tbody>
                {caps.map(([label, a, b, c], i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td className="p-4" style={{ color: INK_2 }}>{label}</td>
                    <td className="p-4 text-center"><Mark v={a as never} /></td>
                    <td className="p-4 text-center"><Mark v={b as never} /></td>
                    <td
                      className="p-4 text-center"
                      style={{ background: "rgba(249,101,0,0.06)", borderLeft: `2px solid ${ORANGE}`, borderRight: `2px solid ${ORANGE}` }}
                    >
                      <Mark v={c as never} />
                    </td>
                  </tr>
                ))}
                <tr style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td />
                  <td />
                  <td />
                  <td
                    className="p-3 text-center text-xs font-bold uppercase"
                    style={{
                      background: "rgba(249,101,0,0.10)",
                      color: ORANGE,
                      borderLeft: `2px solid ${ORANGE}`,
                      borderRight: `2px solid ${ORANGE}`,
                      borderBottom: `2px solid ${ORANGE}`,
                      ...fEyebrow,
                      letterSpacing: "0.12em",
                    }}
                  >
                    o loop inteiro
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile stacked */}
          <div className="md:hidden grid gap-3">
            {caps.map(([label, , , c], i) => (
              <div key={i} className="rounded-xl p-4 flex items-center justify-between" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <span className="text-[14px]" style={{ color: INK_2 }}>{label}</span>
                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: ORANGE }}>
                  LeadPost <Mark v={c as never} />
                </span>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={140}>
          <p className="mt-8 text-[16px] max-w-3xl" style={{ color: SUB }}>
            Você não precisa de duas assinaturas e um Zapier no meio rezando pra não
            quebrar. Precisa de uma plataforma onde o post e a prospecção vivem no{" "}
            <strong style={{ color: INK }}>mesmo lugar</strong>.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────── DEPOIMENTOS ─────────────────────────── */

function Depoimentos() {
  const items = [
    {
      quote:
        "Antes eu postava e esperava. Agora cada post vira fila de conversa na DM. Saímos de [X] pra [Y] reuniões por mês — com o mesmo volume de conteúdo.",
      name: "[Nome]",
      role: "[Cargo] na [Empresa]",
    },
    {
      quote:
        "Eu pagava um agendador e uma ferramenta de prospecção separados. O LeadPost matou os dois e conectou o que eu nunca consegui: quem comentou virou pipeline sozinho.",
      name: "[Nome]",
      role: "[Cargo] na [Empresa]",
    },
    {
      quote:
        "O que me convenceu foi a segurança. Rodei [X] campanhas e a conta nunca tomou restrição. Feito por quem entende de LinkedIn no Brasil.",
      name: "[Nome]",
      role: "[Cargo] na [Empresa]",
    },
  ];

  return (
    <section className="py-24" style={{ background: SURFACE }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeUp>
          <H2>
            Quem fechou o loop,{" "}
            <span style={{ color: ORANGE }}>parou de depender de sorte.</span>
          </H2>
        </FadeUp>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <FadeUp key={i} delay={i * 80}>
              <figure
                className="lp-card h-full rounded-2xl p-6 flex flex-col"
                style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}
              >
                <blockquote className="text-[15px] leading-relaxed" style={{ color: INK_2 }}>
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <div
                    className="h-10 w-10 rounded-full"
                    style={{ background: "linear-gradient(135deg,#D4AF37,#F96500)" }}
                    aria-hidden
                  />
                  <div className="text-sm">
                    <div style={{ color: INK }}>{t.name}</div>
                    <div style={{ color: SUB }}>{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── SEGURANÇA ─────────────────────────── */

function Seguranca() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <FadeUp>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ border: `1px solid ${GOLD}`, color: GOLD }}>
            <Shield size={14} /> Segurança da conta
          </div>
        </FadeUp>
        <FadeUp delay={80} className="mt-5">
          <H2>"Mas isso não derruba minha conta?"</H2>
        </FadeUp>
        <FadeUp delay={140}>
          <p className="mt-6 text-[17px] leading-relaxed" style={{ color: INK_2 }}>
            É a pergunta certa — e a maioria das ferramentas foge dela. A gente
            encara. O LeadPost opera dentro de <strong>limites humanos plausíveis</strong>:
            teto diário de convites e mensagens, intervalos aleatórios, janela de
            horário comercial e pausa automática no sinal de alerta.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed" style={{ color: INK_2 }}>
            Sua sessão é <strong>isolada</strong> — nunca compartilhamos IP nem conta.
            A gente prioriza a saúde da sua conta acima do volume. E você tem
            controle total: configura os limites, pausa quando quiser, revisa cada
            cadência antes de publicar.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────── PREÇOS ─────────────────────────── */

function Precos() {
  const plans = [
    { name: "Starter", price: "R$ XX", per: "/mês", featured: false, points: ["1 conta LinkedIn", "Publicação com IA", "Captura de sinal"] },
    { name: "Pro", price: "R$ XX", per: "/mês", featured: true, points: ["Tudo do Starter", "Auto-connect + DM", "Cadência com ramificação", "Inbox unificado"] },
    { name: "Agência", price: "sob consulta", per: "", featured: false, points: ["Múltiplas contas", "Templates compartilhados", "Suporte dedicado"] },
  ];

  return (
    <section id="precos" className="py-24" style={{ background: SURFACE }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeUp>
          <H2>
            Comece a transformar conteúdo em{" "}
            <span style={{ color: ORANGE }}>pipeline</span> hoje.
          </H2>
        </FadeUp>
        <FadeUp delay={80}>
          <p className="mt-4 text-[16px]" style={{ color: SUB }}>
            Sem cartão pra testar. Sem fidelidade. Cancela em dois cliques.
          </p>
        </FadeUp>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <FadeUp key={p.name} delay={i * 80}>
              <div
                className="lp-card h-full rounded-2xl p-6 flex flex-col"
                style={{
                  background: p.featured ? "rgba(249,101,0,0.06)" : SURFACE_2,
                  border: p.featured ? `1px solid ${ORANGE}` : `1px solid ${BORDER}`,
                  boxShadow: p.featured ? "0 20px 60px -30px rgba(249,101,0,0.6)" : "none",
                }}
              >
                {p.featured && (
                  <div className="self-start mb-3 text-[10px] uppercase font-bold px-2 py-1 rounded-md" style={{ background: ORANGE, color: "#fff", ...fEyebrow }}>
                    Mais popular
                  </div>
                )}
                <h3 className="text-2xl" style={{ ...fDisplay, color: INK }}>{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl" style={{ ...fDisplay, color: INK }}>{p.price}</span>
                  <span className="text-sm" style={{ color: SUB }}>{p.per}</span>
                </div>
                <ul className="mt-5 space-y-2 text-[14px] flex-1" style={{ color: INK_2 }}>
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <Check size={14} style={{ color: GOLD, marginTop: 4 }} /> {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <CTAPrimary>Começar grátis</CTAPrimary>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={160}>
          <div
            className="mt-12 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${GOLD}` }}
          >
            <Shield size={32} style={{ color: GOLD }} />
            <p className="text-[15px] sm:text-base" style={{ color: INK_2 }}>
              <strong>Garantia.</strong> Teste por [X] dias. Se o LeadPost não te entregar a primeira
              conversa qualificada saída de um comentário, devolvemos seu dinheiro.{" "}
              <strong style={{ color: GOLD }}>Sem perguntas.</strong>
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────── FAQ ─────────────────────────── */

function FAQ() {
  const items = [
    { q: "O que é o LeadPost, em uma frase?", a: "É a plataforma que publica seu conteúdo no LinkedIn com IA e transforma quem engaja em pipeline — conectando e mandando DM no automático, no limite seguro da sua conta." },
    { q: "Preciso ter audiência grande?", a: "Não. Funciona com o engajamento que você já tem. Mesmo poucos comentários viram fila de prospecção qualificada, porque você aborda só quem levantou a mão." },
    { q: "Isso é seguro? Vai banir minha conta?", a: "A segurança é o coração do produto: limites diários, intervalos aleatórios, pausa no risco e sessão isolada. Você controla tudo." },
    { q: "Preciso de Sales Navigator?", a: "Não é obrigatório, mas potencializa: filtra os decisores certos e deixa a prospecção rodar no automático." },
    { q: "Funciona pra time / agência?", a: "Sim. Várias contas, cadências como template, cada conta isolada e segura." },
    { q: "Quanto custa?", a: "Teste grátis sem cartão. Planos a partir de [R$ XX/mês]." },
    { q: "Posso cancelar quando quiser?", a: "A qualquer momento, em dois cliques, nas configurações." },
  ];

  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <FadeUp>
          <H2>Perguntas frequentes.</H2>
        </FadeUp>
        <FadeUp delay={100} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {items.map((it, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                style={{ borderColor: BORDER }}
              >
                <AccordionTrigger className="text-left text-[16px] sm:text-lg font-semibold text-white hover:no-underline">
                  {it.q}
                </AccordionTrigger>
                <AccordionContent className="text-[15px]" style={{ color: SUB }}>
                  {it.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA FINAL ─────────────────────────── */

function CTAFinal() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 50%, rgba(249,101,0,0.20) 0%, rgba(212,175,55,0.08) 40%, rgba(10,10,10,0) 75%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <FadeUp>
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl leading-[1.02]"
            style={{ ...fDisplay, color: INK }}
          >
            Pare de postar pra likes.
            <br />
            <span style={{ color: ORANGE }}>Comece a postar pra pipeline.</span>
          </h2>
        </FadeUp>
        <FadeUp delay={100}>
          <p className="mt-7 text-[17px] max-w-2xl mx-auto" style={{ color: INK_2 }}>
            A demanda você já está gerando. A pergunta é se vai continuar deixando
            ela morrer na curtida — ou se vai botar uma máquina pra recolher cada
            centavo, enquanto você cuida de fechar.
          </p>
        </FadeUp>
        <FadeUp delay={160} className="mt-9">
          <CTAPrimary size="lg">
            Começar grátis <ArrowRight size={20} />
          </CTAPrimary>
          <p className="mt-3 text-xs" style={{ color: SUB }}>
            Sem cartão. Cancela quando quiser.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ─────────────────────────── */

function Footer() {
  return (
    <footer style={{ background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="text-xl" style={fDisplay}>
            LeadPost<span style={{ color: ORANGE }}>.ai</span>
          </div>
          <p className="mt-2 text-sm max-w-xs" style={{ color: SUB }}>
            IA para gerar demanda no LinkedIn.
          </p>
        </div>
        <FooterCol title="Produto" links={[
          ["Como funciona", "#como-funciona"],
          ["Recursos", "#recursos"],
          ["Preços", "#precos"],
          ["Entrar", "/auth"],
        ]} />
        <FooterCol title="Recursos" links={[
          ["Blog", "#"],
          ["Casos", "#"],
          ["Central de ajuda", "#"],
        ]} />
        <FooterCol title="Empresa" links={[
          ["Sobre", "#"],
          ["Contato", "#"],
        ]} />
      </div>
      <div
        className="py-5 text-center text-xs"
        style={{ color: SUB, borderTop: `1px solid ${BORDER}` }}
      >
        © 2026 LeadPost.ai — Demanda Infinita, no automático. ·{" "}
        <a href="#" className="hover:text-white">Termos</a> ·{" "}
        <a href="#" className="hover:text-white">Privacidade</a> ·{" "}
        <a href="#" className="hover:text-white">LGPD</a>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div
        className="text-xs font-bold uppercase mb-3"
        style={{ ...fEyebrow, color: GOLD, letterSpacing: "0.18em" }}
      >
        {title}
      </div>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="hover:text-white" style={{ color: SUB }}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
