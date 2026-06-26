import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Plus, LayoutGrid, CalendarDays, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { GSPage } from "@/components/gs/page";
import { useOpenComposer } from "@/components/gs/composer-context";
import { supabase } from "@/integrations/supabase/client";
import {
  canTransition,
  validateSchedule,
  STATUS_LABEL,
  type PostStatus,
} from "@/lib/post-status";

export const Route = createFileRoute("/_authenticated/planejamento")({
  head: () => ({ meta: [{ title: "Planejamento — GS One" }] }),
  component: PlanejamentoPage,
});

type Post = {
  id: string;
  content: string;
  status: PostStatus;
  format: string | null;
  scheduled_at: string | null;
  created_at: string;
};

const KANBAN_COLS: PostStatus[] = ["idea", "draft", "ready", "scheduled"];

function PlanejamentoPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"board" | "agenda">("board");
  const [scheduleModal, setScheduleModal] = useState<{ postId: string; from: PostStatus } | null>(
    null,
  );
  const openComposer = useOpenComposer();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id,content,status,format,scheduled_at,created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Falha ao carregar posts.");
    } else {
      setPosts((data ?? []) as Post[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const byStatus = useMemo(() => {
    const m: Record<PostStatus, Post[]> = {
      idea: [],
      draft: [],
      ready: [],
      scheduled: [],
      published: [],
    };
    for (const p of posts) m[p.status].push(p);
    m.scheduled.sort((a, b) =>
      (a.scheduled_at ?? "").localeCompare(b.scheduled_at ?? ""),
    );
    return m;
  }, [posts]);

  async function updatePost(id: string, patch: Partial<Post>) {
    const prev = posts;
    setPosts((cur) => cur.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    const { error } = await supabase.from("posts").update(patch).eq("id", id);
    if (error) {
      setPosts(prev);
      toast.error("Não foi possível atualizar o post.");
    }
  }

  async function handleDragEnd(r: DropResult) {
    if (!r.destination) return;
    const from = r.source.droppableId as PostStatus;
    const to = r.destination.droppableId as PostStatus;
    if (from === to) return;
    const post = posts.find((p) => p.id === r.draggableId);
    if (!post) return;
    if (!canTransition(from, to)) {
      toast.error(`Transição inválida: ${STATUS_LABEL[from]} → ${STATUS_LABEL[to]}`);
      return;
    }
    if (to === "scheduled") {
      setScheduleModal({ postId: post.id, from });
      return;
    }
    await updatePost(post.id, { status: to, scheduled_at: null });
  }

  return (
    <GSPage subtitle="Quadro e agenda dos seus posts.">
      <h1 className="font-display mb-6 text-3xl text-[var(--color-ink)]">Planejamento</h1>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="inline-flex overflow-hidden rounded-lg border border-[var(--color-border)]">
          <ViewBtn active={view === "board"} onClick={() => setView("board")} icon={<LayoutGrid className="h-4 w-4" />}>
            Quadro
          </ViewBtn>
          <ViewBtn active={view === "agenda"} onClick={() => setView("agenda")} icon={<CalendarDays className="h-4 w-4" />}>
            Agenda
          </ViewBtn>
        </div>
        <button
          onClick={() => openComposer()}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-orange)] px-3.5 py-2 text-[13px] font-semibold text-[var(--color-bg)] hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
          Escrever post
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[var(--color-sub)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
        </div>
      ) : view === "board" ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {KANBAN_COLS.map((status) => (
              <Column
                key={status}
                status={status}
                posts={byStatus[status]}
                onAdd={() => openComposer()}
              />
            ))}
          </div>
        </DragDropContext>
      ) : (
        <Agenda posts={byStatus.scheduled} onAdd={() => openComposer()} />
      )}

      {scheduleModal && (
        <ScheduleModal
          onClose={() => setScheduleModal(null)}
          onConfirm={async (date) => {
            const r = validateSchedule("scheduled", date);
            if (!r.ok) {
              toast.error(r.error ?? "Data inválida.");
              return;
            }
            await updatePost(scheduleModal.postId, {
              status: "scheduled",
              scheduled_at: date!.toISOString(),
            });
            setScheduleModal(null);
            toast.success("Post agendado.");
          }}
        />
      )}
    </GSPage>
  );
}

function ViewBtn({
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
      className={`flex cursor-pointer items-center gap-1.5 px-3 py-2 text-[13px] transition ${
        active
          ? "bg-[var(--color-elevated)] text-[var(--color-ink)]"
          : "text-[var(--color-sub)] hover:text-[var(--color-ink)]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Column({
  status,
  posts,
  onAdd,
}: {
  status: PostStatus;
  posts: Post[];
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-head text-sm font-bold">{STATUS_LABEL[status]}</span>
          <span className="text-xs text-[var(--color-muted)]">{posts.length}</span>
        </div>
        <button
          onClick={onAdd}
          aria-label="Escrever post"
          className="cursor-pointer text-[var(--color-sub)] hover:text-[var(--color-orange)]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snap) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex min-h-[200px] flex-1 flex-col gap-2 p-3 transition ${
              snap.isDraggingOver ? "bg-[var(--color-elevated)]/40" : ""
            }`}
          >
            {posts.length === 0 && (
              <div className="rounded-lg border border-dashed border-[var(--color-border)] p-4 text-center text-xs text-[var(--color-muted)]">
                Sem posts
              </div>
            )}
            {posts.map((p, i) => (
              <Draggable key={p.id} draggableId={p.id} index={i}>
                {(prov, s) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] p-3 text-[13px] transition ${
                      s.isDragging ? "border-[var(--color-orange)] shadow-lg" : ""
                    }`}
                  >
                    <div className="line-clamp-3 whitespace-pre-wrap text-[var(--color-ink)]">
                      {p.content || <span className="text-[var(--color-muted)]">(vazio)</span>}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
                      {p.format && (
                        <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5">
                          {p.format}
                        </span>
                      )}
                      {p.status === "scheduled" && p.scheduled_at && (
                        <span className="inline-flex items-center gap-1 text-[var(--color-orange)]">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(new Date(p.scheduled_at))}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function Agenda({ posts, onAdd }: { posts: Post[]; onAdd: () => void }) {
  const groups = useMemo(() => groupByDay(posts), [posts]);

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center">
        <p className="text-[var(--color-sub)]">Nada agendado.</p>
        <button
          onClick={onAdd}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px] hover:border-[var(--color-faint)]"
        >
          <Plus className="h-3.5 w-3.5" /> Escrever post
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.key}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-head text-sm font-bold text-[var(--color-ink)]">{g.label}</h3>
            <button
              onClick={onAdd}
              className="cursor-pointer text-xs text-[var(--color-sub)] hover:text-[var(--color-orange)]"
            >
              + post
            </button>
          </div>
          <div className="space-y-2">
            {g.items.map((p) => (
              <div
                key={p.id}
                className="flex gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="w-20 shrink-0 text-[var(--color-orange)]">
                  <div className="font-head text-lg font-bold">
                    {formatTime(new Date(p.scheduled_at!))}
                  </div>
                  {p.format && (
                    <div className="text-[11px] text-[var(--color-muted)]">{p.format}</div>
                  )}
                </div>
                <div className="line-clamp-3 flex-1 whitespace-pre-wrap text-[13px] text-[var(--color-ink)]">
                  {p.content || <span className="text-[var(--color-muted)]">(vazio)</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduleModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (d: Date | null) => void | Promise<void>;
}) {
  const [value, setValue] = useState(defaultScheduleValue());
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="font-head text-base font-bold">Agendar post</h3>
        <p className="mt-1 text-xs text-[var(--color-sub)]">
          Escolha data e horário (precisa ser no futuro).
        </p>
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--color-orange)]"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="cursor-pointer px-3 py-2 text-[13px] text-[var(--color-sub)] hover:text-[var(--color-ink)]"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(value ? new Date(value) : null)}
            className="cursor-pointer rounded-lg bg-[var(--color-orange)] px-4 py-2 text-[13px] font-semibold text-[var(--color-bg)] hover:opacity-90"
          >
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
}

function defaultScheduleValue() {
  const d = new Date(Date.now() + 60 * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTime(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDateTime(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${formatTime(d)}`;
}

function groupByDay(posts: Post[]) {
  const groups = new Map<string, { key: string; label: string; date: Date; items: Post[] }>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60_000);
  for (const p of posts) {
    if (!p.scheduled_at) continue;
    const d = new Date(p.scheduled_at);
    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    let label: string;
    if (dayStart.getTime() === today.getTime()) label = "Hoje";
    else if (dayStart.getTime() === tomorrow.getTime()) label = "Amanhã";
    else
      label = d.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
    const g = groups.get(dayKey) ?? { key: dayKey, label, date: dayStart, items: [] };
    g.items.push(p);
    groups.set(dayKey, g);
  }
  return Array.from(groups.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((g) => ({
      ...g,
      items: g.items.sort((a, b) =>
        (a.scheduled_at ?? "").localeCompare(b.scheduled_at ?? ""),
      ),
    }));
}
