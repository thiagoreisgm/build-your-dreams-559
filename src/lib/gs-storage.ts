// Mock persistence layer. Each profile lives under its own key so swapping to
// the backend later (content_profile / icp / voice_profile tables) is a 1:1 mapping.

export type ContentProfile = {
  output_language: string;
  industry: string;
  bio: string;
  themes: string[];
  formats: string[];
  reference_handles: string;
  reference_languages: string[];
  creative_freedom: number; // 0-100
};

export const DEFAULT_CONTENT_PROFILE: ContentProfile = {
  output_language: "Português (BR)",
  industry: "Consultoria / Aceleração de vendas B2B",
  bio: "CEO e fundador, especialista em processo comercial B2B, estruturação de operações de vendas e go-to-market para grandes empresas.",
  themes: ["Prospecção B2B", "Processo comercial", "IA em vendas"],
  formats: ["Contrarian", "Lista", "Caso / história"],
  reference_handles: "@jvrancsik, @ravishrivas, @aleshormozi",
  reference_languages: ["PT-BR", "Inglês (traduzir)"],
  creative_freedom: 50,
};

export const ALL_THEMES = [
  "Prospecção B2B",
  "Processo comercial",
  "IA em vendas",
  "Liderança comercial",
];

export const ALL_FORMATS = [
  "Contrarian",
  "Lista",
  "Caso / história",
  "Dados / pesquisa",
  "Como fazer",
];

export const ALL_REF_LANGS = ["PT-BR", "Inglês (traduzir)", "Espanhol"];

const KEY = "gs.content_profile.v1";

export function loadContentProfile(): ContentProfile {
  if (typeof window === "undefined") return DEFAULT_CONTENT_PROFILE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CONTENT_PROFILE;
    return { ...DEFAULT_CONTENT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONTENT_PROFILE;
  }
}

export function saveContentProfile(profile: ContentProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(profile));
}

// ---------------------------------------------------------------------------
// Saved viral posts (favoritos)
// Mock layer pensado para virar tabela `saved_viral_posts` (user_id, post_id,
// saved_at) quando o backend entrar. Estrutura 1:1 com a futura linha.
// ---------------------------------------------------------------------------

export type SavedViralPost = {
  post_id: string;
  saved_at: string; // ISO
};

const SAVED_KEY = "gs.saved_viral_posts.v1";

export function loadSavedPosts(): SavedViralPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedPosts(items: SavedViralPost[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

export function toggleSavedPost(postId: string): SavedViralPost[] {
  const current = loadSavedPosts();
  const exists = current.find((s) => s.post_id === postId);
  const next = exists
    ? current.filter((s) => s.post_id !== postId)
    : [...current, { post_id: postId, saved_at: new Date().toISOString() }];
  saveSavedPosts(next);
  return next;
}

