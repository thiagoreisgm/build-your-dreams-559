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
