export type PostStatus = "idea" | "draft" | "ready" | "scheduled" | "published";

const TRANSITIONS: Record<PostStatus, PostStatus[]> = {
  idea: ["draft", "ready"],
  draft: ["idea", "ready", "scheduled"],
  ready: ["idea", "draft", "scheduled"],
  scheduled: ["ready", "draft", "published"],
  published: ["ready"],
};

export function canTransition(from: PostStatus, to: PostStatus): boolean {
  if (from === to) return true;
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateSchedule(
  status: PostStatus,
  scheduledAt: Date | null,
): { ok: boolean; error?: string } {
  if (status !== "scheduled") return { ok: true };
  if (!scheduledAt) {
    return { ok: false, error: "Selecione uma data e horário para agendar." };
  }
  if (scheduledAt.getTime() <= Date.now()) {
    return { ok: false, error: "A data de agendamento deve ser no futuro." };
  }
  return { ok: true };
}

export const STATUS_LABEL: Record<PostStatus, string> = {
  idea: "Ideias",
  draft: "Em progresso",
  ready: "Pronto",
  scheduled: "Agendado",
  published: "Publicado",
};
