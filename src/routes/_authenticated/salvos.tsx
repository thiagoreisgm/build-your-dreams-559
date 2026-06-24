import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, Copy, Search, Star, Trash2 } from "lucide-react";
import { GSPage } from "@/components/gs/page";
import { useOpenComposer } from "@/components/gs/composer-context";
import { loadSavedPosts, toggleSavedPost, type SavedViralPost } from "@/lib/gs-storage";
import { MOCK_VIRAL_POSTS, type ViralPost } from "@/lib/viral-posts";

export const Route = createFileRoute("/_authenticated/salvos")({
  head: () => ({
    meta: [
      { title: "Posts Salvos — GS One" },
      { name: "description", content: "Sua biblioteca pessoal de posts virais salvos." },
    ],
  }),
  component: SalvosPage,
});

type SortKey = "recent" | "oldest" | "engagement";

function SalvosPage() {
  const [saved, setSaved] = useState<SavedViralPost[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const openComposer = useOpenComposer();

  useEffect(() => {
    setSaved(loadSavedPosts());
  }, []);

  function onRemove(postId: string) {
    setSaved(toggleSavedPost(postId));
  }

  function onCopy(p: ViralPost) {
    void navigator.clipboard?.writeText(p.text);
  }

  const items = useMemo(() => {
    const joined = saved
      .map((s) => {
        const post = MOCK_VIRAL_POSTS.find((p) => p.id === s.post_id);
        return post ? { ...post, saved_at: s.saved_at } : null;
      })
      .filter((x): x is ViralPost & { saved_at: string } => x !== null);

    const q = query.trim().toLowerCase();
    const filtered = q
      ? joined.filter(
          (p) =>
            p.text.toLowerCase().includes(q) ||
            p.author.toLowerCase().includes(q) ||
            p.structure.toLowerCase().includes(q),
        )
      : joined;

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "recent") return b.saved_at.localeCompare(a.saved_at);
      if (sort === "oldest") return a.saved_at.localeCompare(b.saved_at);
      return b.likes + b.comments - (a.likes + a.comments);
    });
    return sorted;
  }, [saved, query, sort]);

  return (
    <GSPage>
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[var(--color-orange)]">
            <Star className="h-4 w-4" strokeWidth={1.8} />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase">Biblioteca</span>
          </div>
          <h2 className="font-head text-2xl font-bold tracking-tight">Posts Salvos</h2>
          <p className="mt-1 text-[13px] text-[var(--color-sub)]">
            {saved.length} {saved.length === 1 ? "post salvo" : "posts salvos"} para inspirar suas próximas criações.
          </p>
        </div>
        <Link
          to="/posts-virais"
          className="shrink-0 cursor-pointer rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-[13px] text-[var(--color-sub)] transition hover:border-[var(--color-faint)] hover:text-[var(--color-ink)]"
        >
          Descobrir mais
        </Link>
      </div>

      {/* Busca + ordenação */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search
            className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
            strokeWidth={1.6}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por texto, autor ou estrutura"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pr-4 pl-10 text-sm outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-faint)]"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 text-[13px]">
          <SortChip active={sort === "recent"} onClick={() => setSort("recent")} icon={<ArrowDownAZ className="h-[14px] w-[14px]" />}>
            Mais recentes
          </SortChip>
          <SortChip active={sort === "oldest"} onClick={() => setSort("oldest")} icon={<ArrowUpAZ className="h-[14px] w-[14px]" />}>
            Mais antigos
          </SortChip>
          <SortChip active={sort === "engagement"} onClick={() => setSort("engagement")} icon={<Star className="h-[14px] w-[14px]" />}>
            Engajamento
          </SortChip>
        </div>
      </div>

      {/* Lista */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
          <Star className="mx-auto mb-3 h-6 w-6 text-[var(--color-muted)]" strokeWidth={1.4} />
          <p className="text-sm text-[var(--color-sub)]">
            {query
              ? "Nenhum post salvo bate com essa busca."
              : "Você ainda não salvou nenhum post."}
          </p>
          {!query && (
            <Link
              to="/posts-virais"
              className="mt-4 inline-block cursor-pointer text-[13px] font-medium text-[var(--color-orange)] hover:underline"
            >
              Explorar Posts Virais →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-faint)]"
            >
              <div className="mb-4 flex items-center gap-2.5">
                <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-elevated)]" />
                <span className="text-[13px] font-medium">{p.author}</span>
                <span className="ml-auto rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-muted)]">
                  {p.structure}
                </span>
              </div>
              <p className="flex-1 text-[13px] leading-relaxed text-[var(--color-sub)]">{p.text}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-xs">
                <span className="text-[var(--color-muted)]">
                  Salvo {formatRelative(p.saved_at)} · {p.likes} ♥
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onCopy(p)}
                    aria-label="Copiar"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[var(--color-sub)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-ink)]"
                  >
                    <Copy className="h-[14px] w-[14px]" strokeWidth={1.8} />
                  </button>
                  <button
                    onClick={() => onRemove(p.id)}
                    aria-label="Remover dos salvos"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[var(--color-sub)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-ink)]"
                  >
                    <Trash2 className="h-[14px] w-[14px]" strokeWidth={1.8} />
                  </button>
                  <button
                    onClick={openComposer}
                    className="ml-1 cursor-pointer px-2 text-[13px] font-medium text-[var(--color-orange)] hover:underline"
                  >
                    Adaptar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GSPage>
  );
}

function SortChip({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
        active
          ? "bg-[var(--color-elevated)] font-medium text-[var(--color-ink)]"
          : "text-[var(--color-sub)] hover:text-[var(--color-ink)]"
      }`}
    >
      <span className={active ? "text-[var(--color-orange)]" : ""}>{icon}</span>
      {children}
    </button>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "há pouco";
  const diff = Date.now() - then;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `há ${d}d`;
  return new Date(iso).toLocaleDateString("pt-BR");
}
