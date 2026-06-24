import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, FileText, MoreHorizontal, Sliders, Sparkles, Star, TrendingUp } from "lucide-react";
import { GSPage } from "@/components/gs/page";
import { useOpenComposer } from "@/components/gs/composer-context";
import { loadContentProfile, type ContentProfile } from "@/lib/gs-storage";
import {
  fetchInspirations,
  fetchSavedInspirationIds,
  toggleSavedInspiration,
  type Inspiration,
} from "@/lib/library";

export const Route = createFileRoute("/_authenticated/posts-virais")({
  head: () => ({ meta: [{ title: "Posts Virais — GS One" }] }),
  component: PostsViraisPage,
});

function PostsViraisPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"inspiracao" | "salvos">("inspiracao");
  const [profile, setProfile] = useState<ContentProfile | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filtros aplicados (não reativos ao digitar — aplicam no Buscar/Aplicar)
  const [searchInput, setSearchInput] = useState("");
  const [applied, setApplied] = useState({
    query: "",
    minLikes: 0,
    minComments: 0,
    maxFollowers: 500_000,
  });
  // Estado temporário do popover de filtros
  const [minLikes, setMinLikes] = useState(0);
  const [minComments, setMinComments] = useState(0);
  const [maxFollowers, setMaxFollowers] = useState(500_000);
  const [period, setPeriod] = useState(1);

  const openComposer = useOpenComposer();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfile(loadContentProfile());
  }, []);

  // Close popovers on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
        setFiltersOpen(false);
        return;
      }
      const target = e.target as HTMLElement;
      if (!target.closest("[data-card-menu]") && !target.closest("[data-card-menu-trigger]")) {
        setOpenMenu(null);
      }
      if (!target.closest("[data-filters]") && !target.closest("[data-filters-trigger]")) {
        setFiltersOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const inspirationsQuery = useQuery({
    queryKey: ["inspirations", applied],
    queryFn: () =>
      fetchInspirations({
        query: applied.query || undefined,
        minLikes: applied.minLikes,
        minComments: applied.minComments,
        maxFollowers: applied.maxFollowers,
      }),
  });

  const savedQuery = useQuery({
    queryKey: ["saved-inspirations"],
    queryFn: fetchSavedInspirationIds,
  });

  const savedIds = useMemo(
    () => new Set((savedQuery.data ?? []).map((s) => s.id)),
    [savedQuery.data],
  );

  const allPosts = inspirationsQuery.data ?? [];
  const visiblePosts = tab === "salvos" ? allPosts.filter((p) => savedIds.has(p.id)) : allPosts;

  const personalizedSummary = useMemo(() => {
    if (!profile) return "";
    const themes = profile.themes.slice(0, 3).join(", ");
    const formats = profile.formats.slice(0, 2).join(", ").toLowerCase();
    const hasEN = profile.reference_languages.includes("Inglês (traduzir)");
    const langs = `${profile.reference_languages.includes("PT-BR") ? "PT" : ""}${hasEN ? " + EN (traduzido)" : ""}`.trim();
    return `temas: ${themes} · formatos: ${formats} · idioma: ${langs}`;
  }, [profile]);

  function onCopy(p: Inspiration) {
    void navigator.clipboard?.writeText(p.content);
    setCopied(p.id);
    setOpenMenu(null);
    setTimeout(() => setCopied((c) => (c === p.id ? null : c)), 1400);
  }

  async function onSave(p: Inspiration) {
    setOpenMenu(null);
    await toggleSavedInspiration(p.id);
    qc.invalidateQueries({ queryKey: ["saved-inspirations"] });
  }

  function applySearch() {
    setApplied((a) => ({ ...a, query: searchInput.trim() }));
  }

  function applyFilters() {
    setApplied({
      query: searchInput.trim(),
      minLikes,
      minComments,
      maxFollowers,
    });
    setFiltersOpen(false);
  }

  const activeFilterCount =
    (applied.minLikes > 0 ? 1 : 0) +
    (applied.minComments > 0 ? 1 : 0) +
    (applied.maxFollowers < 500_000 ? 1 : 0) +
    (period > 0 ? 1 : 0);

  return (
    <GSPage>
      <div ref={rootRef}>
        {/* Tabs */}
        <div className="mb-5 flex items-center gap-1 text-[13px]">
          <button
            onClick={() => setTab("inspiracao")}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 transition ${
              tab === "inspiracao"
                ? "bg-[var(--color-elevated)] font-medium text-[var(--color-ink)]"
                : "text-[var(--color-sub)] hover:text-[var(--color-ink)]"
            }`}
          >
            <TrendingUp className="h-[15px] w-[15px]" strokeWidth={1.6} /> Inspiração
          </button>
          <button
            onClick={() => setTab("salvos")}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 transition ${
              tab === "salvos"
                ? "bg-[var(--color-elevated)] font-medium text-[var(--color-ink)]"
                : "text-[var(--color-sub)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Star className="h-[15px] w-[15px]" strokeWidth={1.6} /> Salvos
            {savedIds.size > 0 && (
              <span className="rounded-full bg-[var(--color-orange)]/15 px-1.5 text-[10px] font-semibold text-[var(--color-orange)]">
                {savedIds.size}
              </span>
            )}
          </button>
        </div>

        {/* Personalização */}
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-[var(--color-orange)]/25 bg-[var(--color-orange)]/5 px-4 py-3">
          <FileText className="h-4 w-4 shrink-0 text-[var(--color-orange)]" strokeWidth={1.6} />
          <p className="flex-1 text-[13px] text-[var(--color-sub)]">
            Personalizado pelo seu <span className="text-[var(--color-ink)]">Perfil de Conteúdo</span>
            {personalizedSummary && <> — {personalizedSummary}</>}
          </p>
          <Link
            to="/configuracoes"
            search={{ tab: "conteudo" }}
            className="shrink-0 cursor-pointer text-[13px] font-medium text-[var(--color-orange)] hover:underline"
          >
            Ajustar
          </Link>
        </div>

        {/* Busca + filtros */}
        <div className="relative mb-6 flex gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applySearch();
            }}
            placeholder="Buscar tema, @perfil ou estrutura (ex: gancho contrarian sobre preço)"
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-faint)]"
          />
          <button
            data-filters-trigger
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-sub)] transition hover:border-[var(--color-faint)] hover:text-[var(--color-ink)]"
          >
            <Sliders className="h-[15px] w-[15px]" strokeWidth={1.6} /> Filtros
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-[var(--color-orange)]/15 px-1.5 text-[10px] font-semibold text-[var(--color-orange)]">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={applySearch}
            className="cursor-pointer rounded-xl bg-[var(--color-orange)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90"
          >
            Buscar
          </button>

          {filtersOpen && (
            <div
              data-filters
              className="absolute top-12 right-0 z-20 w-80 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-2xl shadow-black/50"
            >
              <div className="mb-4 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[var(--color-sub)]" strokeWidth={1.6} />
                <span className="font-head text-sm font-bold">Filtros avançados</span>
              </div>
              <div className="space-y-5 text-xs">
                <FilterSlider
                  label="Mín. curtidas"
                  value={minLikes}
                  onChange={setMinLikes}
                  min={0}
                  max={500}
                  format={(v) => (v === 0 ? "qualquer" : `ao menos ${v}`)}
                />
                <FilterSlider
                  label="Mín. comentários"
                  value={minComments}
                  onChange={setMinComments}
                  min={0}
                  max={200}
                  format={(v) => (v === 0 ? "qualquer" : `ao menos ${v}`)}
                />
                <FilterSlider
                  label="Máx. seguidores"
                  value={maxFollowers}
                  onChange={setMaxFollowers}
                  min={1000}
                  max={500_000}
                  step={1000}
                  accent
                  hint="acha o replicável"
                  format={(v) => `${Math.round(v / 1000)}k`}
                />
                <FilterSlider
                  label="Período (meses)"
                  value={period}
                  onChange={setPeriod}
                  min={1}
                  max={12}
                  format={(v) => (v === 1 ? "último mês" : `últimos ${v} meses`)}
                />
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => {
                    setMinLikes(0);
                    setMinComments(0);
                    setMaxFollowers(500_000);
                    setPeriod(1);
                  }}
                  className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-[13px] text-[var(--color-sub)] hover:text-[var(--color-ink)]"
                >
                  Limpar
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 cursor-pointer rounded-lg bg-[var(--color-orange)] py-2 text-[13px] font-semibold text-[var(--color-bg)]"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Grid de posts */}
        {inspirationsQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center text-sm text-[var(--color-sub)]">
            Carregando biblioteca…
          </div>
        ) : inspirationsQuery.isError ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center text-sm text-[var(--color-sub)]">
            Não foi possível carregar a biblioteca.
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
            <p className="text-sm text-[var(--color-sub)]">
              {tab === "salvos" ? "Nenhum post salvo ainda." : "Nenhum resultado para esses filtros."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {visiblePosts.map((p) => {
              const menuOpen = openMenu === p.id;
              const isCopied = copied === p.id;
              const isSaved = savedIds.has(p.id);
              const likes = p.metrics?.likes ?? 0;
              const comments = p.metrics?.comments ?? 0;
              return (
                <div
                  key={p.id}
                  className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-faint)]"
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-elevated)]" />
                    <span className="text-[13px] font-medium">{p.author ?? "—"}</span>
                    {p.format && (
                      <span className="ml-auto rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-muted)]">
                        {p.format}
                      </span>
                    )}
                  </div>
                  <p className="flex-1 text-[13px] leading-relaxed text-[var(--color-sub)]">
                    {p.content}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                    <span className="text-xs text-[var(--color-muted)]">
                      {likes} · {comments} coment.
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={openComposer}
                        className="cursor-pointer px-2 text-[13px] font-medium text-[var(--color-orange)] hover:underline"
                      >
                        Adaptar
                      </button>
                      <div className="relative">
                        <button
                          data-card-menu-trigger
                          aria-label="Mais ações"
                          aria-expanded={menuOpen}
                          onClick={() => setOpenMenu(menuOpen ? null : p.id)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[var(--color-sub)] transition hover:bg-[var(--color-elevated)] hover:text-[var(--color-ink)]"
                        >
                          <MoreHorizontal className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                        {menuOpen && (
                          <div
                            data-card-menu
                            role="menu"
                            className="absolute right-0 bottom-9 z-10 w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-1.5 text-[13px] shadow-2xl shadow-black/50"
                          >
                            <MenuItem icon={<Copy className="h-[15px] w-[15px]" />} onClick={() => onCopy(p)}>
                              {isCopied ? "Copiado!" : "Copiar conteúdo"}
                            </MenuItem>
                            <MenuItem
                              icon={<Sparkles className="h-[15px] w-[15px] text-[var(--color-orange)]" />}
                              onClick={() => {
                                setOpenMenu(null);
                                openComposer();
                              }}
                            >
                              Gerar variação
                            </MenuItem>
                            <MenuItem icon={<Star className="h-[15px] w-[15px]" />} onClick={() => onSave(p)}>
                              {isSaved ? "Remover dos salvos" : "Salvar"}
                            </MenuItem>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GSPage>
  );
}

function FilterSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  accent,
  hint,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  accent?: boolean;
  hint?: string;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className={accent ? "text-[var(--color-orange)]" : "text-[var(--color-muted)]"}>
          {label}
          {hint && <span className="ml-2 text-[10px] text-[var(--color-muted)]">({hint})</span>}
        </span>
        <span className={`font-semibold ${accent ? "text-[var(--color-orange)]" : ""}`}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function MenuItem({
  icon,
  children,
  onClick,
  ...rest
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[var(--color-ink)] transition hover:bg-[var(--color-surface)]"
      {...rest}
    >
      <span className="text-[var(--color-sub)]">{icon}</span>
      {children}
    </button>
  );
}
