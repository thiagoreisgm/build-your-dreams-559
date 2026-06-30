import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Pencil, Plus, X } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin";
import { GSPage } from "@/components/gs/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdminTab = "biblioteca" | "usuarios";
type LibSub = "exemplos" | "templates" | "hooks";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: u, error } = await supabase.auth.getUser();
    if (error || !u.user) throw redirect({ to: "/auth" });
    const ok = await checkIsAdmin(u.user.id);
    if (!ok) throw redirect({ to: "/" });
    return { adminId: u.user.id };
  },
  validateSearch: (s: Record<string, unknown>): { tab?: AdminTab; sub?: LibSub } => {
    const t = String(s.tab ?? "");
    const sub = String(s.sub ?? "");
    return {
      tab: t === "usuarios" || t === "biblioteca" ? (t as AdminTab) : undefined,
      sub:
        sub === "templates" || sub === "hooks" || sub === "exemplos"
          ? (sub as LibSub)
          : undefined,
    };
  },
  head: () => ({ meta: [{ title: "Admin — postai" }] }),
  component: AdminPage,
});

const FORMAT_OPTS = [
  "historia",
  "lista",
  "contrarian",
  "caso",
  "dados",
  "como_fazer",
  "hard_truth",
  "checklist",
  "inspiracao",
  "principios",
  "sucesso",
] as const;

const CTA_TYPES = ["convite", "pergunta", "outro"] as const;
const HOOK_TYPES = ["contrarian", "confissao", "dado", "lista", "pergunta"] as const;

function AdminPage() {
  const { tab, sub } = Route.useSearch();
  const navigate = useNavigate();
  const current: AdminTab = tab ?? "biblioteca";
  const currentSub: LibSub = sub ?? "exemplos";

  return (
    <GSPage>
      <h1 className="font-head mb-6 text-2xl font-bold tracking-tight">Admin</h1>

      <div className="mb-6 flex gap-1 border-b border-[var(--color-border)]">
        {(["biblioteca", "usuarios"] as AdminTab[]).map((t) => {
          const active = current === t;
          return (
            <button
              key={t}
              onClick={() =>
                navigate({ to: "/admin", search: { tab: t }, replace: true })
              }
              className={`cursor-pointer border-b-2 px-4 py-3 text-[13px] font-medium transition ${
                active
                  ? "border-[var(--color-orange)] text-[var(--color-orange)]"
                  : "border-transparent text-[var(--color-sub)] hover:text-[var(--color-ink)]"
              }`}
            >
              {t === "biblioteca" ? "Biblioteca" : "Usuários"}
            </button>
          );
        })}
      </div>

      {current === "biblioteca" && (
        <BibliotecaSection
          sub={currentSub}
          onSubChange={(s) =>
            navigate({ to: "/admin", search: { tab: "biblioteca", sub: s }, replace: true })
          }
        />
      )}
      {current === "usuarios" && <UsuariosSection />}
    </GSPage>
  );
}

/* ──────────────────────── BIBLIOTECA ──────────────────────── */

function BibliotecaSection({
  sub,
  onSubChange,
}: {
  sub: LibSub;
  onSubChange: (s: LibSub) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex gap-1">
        {(["exemplos", "templates", "hooks"] as LibSub[]).map((s) => {
          const active = sub === s;
          return (
            <button
              key={s}
              onClick={() => onSubChange(s)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                active
                  ? "bg-[var(--color-orange)]/15 text-[var(--color-orange)]"
                  : "text-[var(--color-sub)] hover:bg-[var(--color-surface)]"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {sub === "exemplos" && <InspirationsAdmin />}
      {sub === "templates" && <TemplatesAdmin />}
      {sub === "hooks" && <HooksAdmin />}
    </div>
  );
}

/* ── inspirations ── */

type Inspiration = {
  id: string;
  author: string | null;
  content: string;
  hook: string | null;
  structure_steps: string[];
  cta: string | null;
  cta_type: string | null;
  format: string | null;
  topic: string[];
  language: string | null;
  source_url: string | null;
  likes_count: number | null;
  comments_count: number | null;
  followers_count: number | null;
};

const emptyInsp: Inspiration = {
  id: "",
  author: "",
  content: "",
  hook: "",
  structure_steps: [],
  cta: "",
  cta_type: "outro",
  format: "historia",
  topic: [],
  language: "pt-BR",
  source_url: "",
  likes_count: 0,
  comments_count: 0,
  followers_count: 0,
};

function InspirationsAdmin() {
  const [rows, setRows] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Inspiration | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase
      .from("inspirations")
      .select(
        "id, author, content, hook, structure_steps, cta, cta_type, format, topic, language, source_url, likes_count, comments_count, followers_count",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) toast.error("Falha ao carregar exemplos: " + error.message);
    setRows((data ?? []) as Inspiration[]);
    setLoading(false);
  }
  useEffect(() => {
    reload();
  }, []);

  async function handleDelete() {
    if (!deletingId) return;
    const { error } = await supabase.from("inspirations").delete().eq("id", deletingId);
    if (error) toast.error("Erro ao excluir: " + error.message);
    else toast.success("Exemplo excluído.");
    setDeletingId(null);
    reload();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--color-sub)]">
          {loading ? "Carregando…" : `${rows.length} exemplo(s)`}
        </p>
        <Button onClick={() => setEditing({ ...emptyInsp })}>
          <Plus className="mr-1 h-4 w-4" /> Novo exemplo
        </Button>
      </div>

      <div className="rounded-lg border border-[var(--color-border)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>Hook</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Passos</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.author || "—"}</TableCell>
                <TableCell className="max-w-xs truncate">{r.hook || "—"}</TableCell>
                <TableCell>{r.format || "—"}</TableCell>
                <TableCell>{r.structure_steps?.length ?? 0}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingId(r.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <InspirationDialog
          value={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir exemplo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é permanente. O exemplo sai imediatamente da biblioteca.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InspirationDialog({
  value,
  onClose,
  onSaved,
}: {
  value: Inspiration;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [v, setV] = useState<Inspiration>(value);
  const [newStep, setNewStep] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof Inspiration>(k: K, val: Inspiration[K]) {
    setV((prev) => ({ ...prev, [k]: val }));
  }

  async function handleSave() {
    if (!v.hook?.trim() || !v.content?.trim()) {
      toast.error("Hook e conteúdo são obrigatórios.");
      return;
    }
    if (v.structure_steps.length === 0) {
      toast.warning("Sem passos de estrutura — esse exemplo terá pouco valor para a IA.");
    }
    setSaving(true);
    const payload = {
      author: v.author?.trim() || null,
      content: v.content.trim(),
      hook: v.hook.trim(),
      structure_steps: v.structure_steps,
      cta: v.cta?.trim() || null,
      cta_type: v.cta_type || null,
      format: v.format || null,
      topic: v.topic,
      language: v.language || "pt-BR",
      source_url: v.source_url?.trim() || null,
      likes_count: v.likes_count ?? 0,
      comments_count: v.comments_count ?? 0,
      followers_count: v.followers_count ?? 0,
      metrics: {
        likes: v.likes_count ?? 0,
        comments: v.comments_count ?? 0,
        followers: v.followers_count ?? 0,
      },
    };
    const res = v.id
      ? await supabase.from("inspirations").update(payload).eq("id", v.id)
      : await supabase.from("inspirations").insert(payload);
    setSaving(false);
    if (res.error) {
      toast.error("Erro ao salvar: " + res.error.message);
      return;
    }
    toast.success(v.id ? "Exemplo atualizado." : "Exemplo criado.");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{v.id ? "Editar exemplo" : "Novo exemplo"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <div>
              <Label>Autor</Label>
              <Input
                value={v.author ?? ""}
                onChange={(e) => update("author", e.target.value)}
              />
            </div>
            <div>
              <Label>Hook *</Label>
              <Input value={v.hook ?? ""} onChange={(e) => update("hook", e.target.value)} />
            </div>
            <div>
              <Label>Conteúdo *</Label>
              <Textarea
                value={v.content}
                onChange={(e) => update("content", e.target.value)}
                rows={8}
              />
            </div>

            <div>
              <Label>Passos da estrutura</Label>
              <div className="mb-2 flex flex-wrap gap-1">
                {v.structure_steps.map((s, i) => (
                  <span
                    key={`${s}-${i}`}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-xs"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "structure_steps",
                          v.structure_steps.filter((_, j) => j !== i),
                        )
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="ex: Confissão"
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newStep.trim()) {
                      e.preventDefault();
                      update("structure_steps", [...v.structure_steps, newStep.trim()]);
                      setNewStep("");
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!newStep.trim()) return;
                    update("structure_steps", [...v.structure_steps, newStep.trim()]);
                    setNewStep("");
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>CTA</Label>
                <Input
                  value={v.cta ?? ""}
                  onChange={(e) => update("cta", e.target.value)}
                />
              </div>
              <div>
                <Label>Tipo de CTA</Label>
                <Select
                  value={v.cta_type ?? "outro"}
                  onValueChange={(val) => update("cta_type", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CTA_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Formato</Label>
                <Select
                  value={v.format ?? "historia"}
                  onValueChange={(val) => update("format", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAT_OPTS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Idioma</Label>
                <Select
                  value={v.language ?? "pt-BR"}
                  onValueChange={(val) => update("language", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">pt-BR</SelectItem>
                    <SelectItem value="en">en</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Tópicos</Label>
              <div className="mb-2 flex flex-wrap gap-1">
                {v.topic.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-xs"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "topic",
                          v.topic.filter((_, j) => j !== i),
                        )
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="ex: vendas"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTopic.trim()) {
                      e.preventDefault();
                      update("topic", [...v.topic, newTopic.trim()]);
                      setNewTopic("");
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!newTopic.trim()) return;
                    update("topic", [...v.topic, newTopic.trim()]);
                    setNewTopic("");
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </div>

            <div>
              <Label>URL da fonte</Label>
              <Input
                value={v.source_url ?? ""}
                onChange={(e) => update("source_url", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Likes</Label>
                <Input
                  type="number"
                  value={v.likes_count ?? 0}
                  onChange={(e) => update("likes_count", Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Comentários</Label>
                <Input
                  type="number"
                  value={v.comments_count ?? 0}
                  onChange={(e) => update("comments_count", Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Seguidores</Label>
                <Input
                  type="number"
                  value={v.followers_count ?? 0}
                  onChange={(e) => update("followers_count", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="mb-3 text-[10px] tracking-[0.15em] text-[var(--color-faint)] uppercase">
              Anatomia
            </p>
            <div className="mb-3">
              <p className="text-[10px] text-[var(--color-sub)]">Hook</p>
              <p className="text-sm font-medium">{v.hook || "—"}</p>
            </div>
            <div className="mb-3">
              <p className="mb-1 text-[10px] text-[var(--color-sub)]">Arco</p>
              <div className="flex flex-wrap gap-1">
                {v.structure_steps.length === 0 ? (
                  <span className="text-xs text-[var(--color-faint)]">(vazio)</span>
                ) : (
                  v.structure_steps.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[var(--color-bg)] px-2 py-0.5 text-[11px]"
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-sub)]">CTA</p>
              <p className="text-sm">{v.cta || "—"}</p>
            </div>
          </aside>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── templates ── */

type TemplateRow = { id: string; title: string; body: string; format: string | null };
const emptyTpl: TemplateRow = { id: "", title: "", body: "", format: "historia" };

function TemplatesAdmin() {
  const [rows, setRows] = useState<TemplateRow[]>([]);
  const [editing, setEditing] = useState<TemplateRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase
      .from("templates")
      .select("id, title, body, format")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as TemplateRow[]);
    setLoading(false);
  }
  useEffect(() => {
    reload();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.body.trim()) {
      toast.error("Título e corpo obrigatórios.");
      return;
    }
    const payload = {
      title: editing.title.trim(),
      body: editing.body,
      format: editing.format || null,
    };
    const res = editing.id
      ? await supabase.from("templates").update(payload).eq("id", editing.id)
      : await supabase.from("templates").insert(payload);
    if (res.error) toast.error(res.error.message);
    else {
      toast.success("Template salvo.");
      setEditing(null);
      reload();
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    const { error } = await supabase.from("templates").delete().eq("id", deletingId);
    if (error) toast.error(error.message);
    else toast.success("Excluído.");
    setDeletingId(null);
    reload();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--color-sub)]">
          {loading ? "Carregando…" : `${rows.length} template(s)`}
        </p>
        <Button onClick={() => setEditing({ ...emptyTpl })}>
          <Plus className="mr-1 h-4 w-4" /> Novo template
        </Button>
      </div>

      <div className="rounded-lg border border-[var(--color-border)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell>{r.format || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingId(r.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <Dialog open onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing.id ? "Editar template" : "Novo template"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Título</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Corpo (use [Gancho] e [CTA] como placeholders)</Label>
                <Textarea
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  rows={10}
                />
              </div>
              <div>
                <Label>Formato</Label>
                <Select
                  value={editing.format ?? "historia"}
                  onValueChange={(v) => setEditing({ ...editing, format: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAT_OPTS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button onClick={save}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir template?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação é permanente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ── hooks ── */

type HookRow = { id: string; type: string; text: string };
const emptyHook: HookRow = { id: "", type: "contrarian", text: "" };

function HooksAdmin() {
  const [rows, setRows] = useState<HookRow[]>([]);
  const [editing, setEditing] = useState<HookRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase
      .from("hooks")
      .select("id, type, text")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as HookRow[]);
    setLoading(false);
  }
  useEffect(() => {
    reload();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.text.trim()) {
      toast.error("Texto obrigatório.");
      return;
    }
    const payload = { type: editing.type, text: editing.text.trim() };
    const res = editing.id
      ? await supabase.from("hooks").update(payload).eq("id", editing.id)
      : await supabase.from("hooks").insert(payload);
    if (res.error) toast.error(res.error.message);
    else {
      toast.success("Hook salvo.");
      setEditing(null);
      reload();
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    const { error } = await supabase.from("hooks").delete().eq("id", deletingId);
    if (error) toast.error(error.message);
    else toast.success("Excluído.");
    setDeletingId(null);
    reload();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--color-sub)]">
          {loading ? "Carregando…" : `${rows.length} hook(s)`}
        </p>
        <Button onClick={() => setEditing({ ...emptyHook })}>
          <Plus className="mr-1 h-4 w-4" /> Novo hook
        </Button>
      </div>

      <div className="rounded-lg border border-[var(--color-border)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Texto</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="capitalize">{r.type}</TableCell>
                <TableCell>{r.text}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingId(r.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <Dialog open onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing.id ? "Editar hook" : "Novo hook"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Tipo</Label>
                <Select
                  value={editing.type}
                  onValueChange={(v) => setEditing({ ...editing, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOOK_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Texto</Label>
                <Textarea
                  value={editing.text}
                  onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button onClick={save}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir hook?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação é permanente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ──────────────────────── USUÁRIOS ──────────────────────── */

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  niche: string | null;
  onboarding_completed: boolean;
  created_at: string;
  monthly_ai_limit: number;
};

type UserView = ProfileRow & {
  isAdmin: boolean;
  used: number;
};

function UsuariosSection() {
  const [rows, setRows] = useState<UserView[]>([]);
  const [loading, setLoading] = useState(true);
  const [meId, setMeId] = useState<string | null>(null);
  const [editingLimit, setEditingLimit] = useState<{ id: string; value: number } | null>(
    null,
  );

  async function reload() {
    setLoading(true);
    const me = await supabase.auth.getUser();
    setMeId(me.data.user?.id ?? null);

    const [profilesRes, rolesRes] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, full_name, email, niche, onboarding_completed, created_at, monthly_ai_limit",
        )
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role").eq("role", "admin"),
    ]);

    if (profilesRes.error) {
      toast.error(profilesRes.error.message);
      setLoading(false);
      return;
    }
    const adminIds = new Set((rolesRes.data ?? []).map((r) => r.user_id));

    // Usage this month
    const monthStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
    ).toISOString();
    const { data: genData } = await supabase
      .from("ai_generations")
      .select("user_id")
      .gte("created_at", monthStart);
    const usedMap = new Map<string, number>();
    (genData ?? []).forEach((g) => {
      usedMap.set(g.user_id, (usedMap.get(g.user_id) ?? 0) + 1);
    });

    const merged: UserView[] = (profilesRes.data ?? []).map((p) => ({
      ...(p as ProfileRow),
      isAdmin: adminIds.has(p.id),
      used: usedMap.get(p.id) ?? 0,
    }));
    setRows(merged);
    setLoading(false);
  }
  useEffect(() => {
    reload();
  }, []);

  async function promote(id: string) {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: id, role: "admin" });
    if (error) toast.error(error.message);
    else {
      toast.success("Promovido a admin.");
      reload();
    }
  }
  async function demote(id: string) {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", id)
      .eq("role", "admin");
    if (error) toast.error(error.message);
    else {
      toast.success("Admin removido.");
      reload();
    }
  }
  async function saveLimit() {
    if (!editingLimit) return;
    const { error } = await supabase
      .from("profiles")
      .update({ monthly_ai_limit: editingLimit.value })
      .eq("id", editingLimit.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Cota atualizada.");
      setEditingLimit(null);
      reload();
    }
  }

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-sub)]">
        {loading ? "Carregando…" : `${rows.length} usuário(s)`}
      </p>

      <div className="rounded-lg border border-[var(--color-border)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nicho</TableHead>
              <TableHead>Onb.</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Uso/Cota</TableHead>
              <TableHead className="w-48" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => {
              const isMe = u.id === meId;
              return (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                  <TableCell className="text-xs">{u.email || "—"}</TableCell>
                  <TableCell>{u.niche || "—"}</TableCell>
                  <TableCell>
                    {u.onboarding_completed ? (
                      <span className="text-[var(--color-orange)]">✓</span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        u.isAdmin
                          ? "bg-[var(--color-orange)]/15 text-[var(--color-orange)]"
                          : "bg-[var(--color-surface)] text-[var(--color-sub)]"
                      }`}
                    >
                      {u.isAdmin ? "admin" : "user"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">
                    {u.used} / {u.monthly_ai_limit}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditingLimit({ id: u.id, value: u.monthly_ai_limit })
                        }
                      >
                        Cota
                      </Button>
                      {!isMe && !u.isAdmin && (
                        <Button size="sm" variant="outline" onClick={() => promote(u.id)}>
                          Promover
                        </Button>
                      )}
                      {!isMe && u.isAdmin && (
                        <Button size="sm" variant="ghost" onClick={() => demote(u.id)}>
                          Rebaixar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {editingLimit && (
        <Dialog open onOpenChange={(o) => !o && setEditingLimit(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Editar cota mensal de IA</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Limite mensal de gerações</Label>
              <Input
                type="number"
                min={0}
                value={editingLimit.value}
                onChange={(e) =>
                  setEditingLimit({ ...editingLimit, value: Number(e.target.value) })
                }
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingLimit(null)}>
                Cancelar
              </Button>
              <Button onClick={saveLimit}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
