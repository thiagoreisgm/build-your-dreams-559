// Biblioteca compartilhada (inspirations/templates/hooks) + coleção pessoal
// (saved_items). Leitura direta via supabase-js — RLS já garante que a
// biblioteca é lida por qualquer usuário autenticado, e saved_items é por
// usuário (auth.uid() = user_id).

import { supabase } from "@/integrations/supabase/client";

export type Inspiration = {
  id: string;
  author: string | null;
  hook: string | null;
  content: string;
  structure_steps: string[];
  format: string | null;
  cta: string | null;
  cta_type: string | null;
  topic: string[];
  language: string | null;
  source_url: string | null;
  metrics: { likes?: number; comments?: number; followers?: number };
  created_at: string;
};

export type InspirationFilters = {
  query?: string;
  format?: string | null;
  language?: string | null;
  minLikes?: number;
  minComments?: number;
  maxFollowers?: number;
};

export async function fetchInspirations(filters: InspirationFilters = {}): Promise<Inspiration[]> {
  let q = supabase.from("inspirations").select("*");

  if (filters.query && filters.query.trim()) {
    q = q.textSearch("search_tsv", filters.query.trim(), {
      type: "websearch",
      config: "portuguese",
    });
  }
  if (filters.format) q = q.eq("format", filters.format);
  if (filters.language) q = q.eq("language", filters.language);

  // Filtros numéricos aplicados no banco via colunas geradas + índices,
  // ANTES do limit, para evitar resultados incompletos quando o corpus crescer.
  if (filters.minLikes && filters.minLikes > 0) {
    q = q.gte("likes_count", filters.minLikes);
  }
  if (filters.minComments && filters.minComments > 0) {
    q = q.gte("comments_count", filters.minComments);
  }
  if (filters.maxFollowers && filters.maxFollowers < 500_000) {
    q = q.lte("followers_count", filters.maxFollowers);
  }

  const { data, error } = await q.order("created_at", { ascending: false }).limit(60);
  if (error) throw error;
  return (data ?? []) as Inspiration[];
}

export async function fetchInspirationsByIds(ids: string[]): Promise<Inspiration[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("inspirations")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return (data ?? []) as Inspiration[];
}

// ---------------------------------------------------------------------------
// saved_items (por usuário)
// ---------------------------------------------------------------------------

export type SavedItem = {
  id: string;
  item_type: "inspiration" | "template" | "hook";
  item_id: string;
  created_at: string;
};

export async function fetchSavedInspirationIds(): Promise<{ id: string; saved_at: string }[]> {
  const { data, error } = await supabase
    .from("saved_items")
    .select("item_id, created_at")
    .eq("item_type", "inspiration");
  if (error) throw error;
  return (data ?? []).map((r) => ({ id: r.item_id as string, saved_at: r.created_at as string }));
}

export async function toggleSavedInspiration(inspirationId: string): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) throw new Error("Não autenticado");

  const { data: existing } = await supabase
    .from("saved_items")
    .select("id")
    .eq("item_type", "inspiration")
    .eq("item_id", inspirationId)
    .eq("user_id", uid)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("saved_items").delete().eq("id", existing.id);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase
    .from("saved_items")
    .insert({ user_id: uid, item_type: "inspiration", item_id: inspirationId });
  // 23505 = unique_violation — clique duplo rápido, considera já salvo.
  if (error && (error as { code?: string }).code !== "23505") throw error;
  return true;
}

// ---------------------------------------------------------------------------
// Helpers de apresentação
// ---------------------------------------------------------------------------

export function inspirationLangShort(language: string | null | undefined): "pt" | "en" | "other" {
  if (!language) return "other";
  if (language.toLowerCase().startsWith("pt")) return "pt";
  if (language.toLowerCase() === "en") return "en";
  return "other";
}
