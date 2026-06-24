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

// Saved posts: migrado para Supabase — ver `src/lib/library.ts`
// (fetchSavedInspirationIds / toggleSavedInspiration).

// ---------------------------------------------------------------------------
// Account profile (aba Perfil) — preferências de conta/UI
// ---------------------------------------------------------------------------

export type AccountProfile = {
  name: string;
  timezone: string;
  language: string;
  theme: "dark" | "light";
};

export const DEFAULT_ACCOUNT: AccountProfile = {
  name: "Thiago Reis",
  timezone: "GMT-3 Brasília",
  language: "Português (BR)",
  theme: "dark",
};

const ACCOUNT_KEY = "gs.account.v1";

export function loadAccount(): AccountProfile {
  if (typeof window === "undefined") return DEFAULT_ACCOUNT;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return DEFAULT_ACCOUNT;
    return { ...DEFAULT_ACCOUNT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ACCOUNT;
  }
}

export function saveAccount(a: AccountProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(a));
}

// ---------------------------------------------------------------------------
// Billing (aba Cobrança) — só persistimos o e-mail de fatura no mock
// ---------------------------------------------------------------------------

export type BillingProfile = { invoice_email: string };
export const DEFAULT_BILLING: BillingProfile = {
  invoice_email: "financeiro@growthmachine.com.br",
};
const BILLING_KEY = "gs.billing.v1";

export function loadBilling(): BillingProfile {
  if (typeof window === "undefined") return DEFAULT_BILLING;
  try {
    const raw = window.localStorage.getItem(BILLING_KEY);
    if (!raw) return DEFAULT_BILLING;
    return { ...DEFAULT_BILLING, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_BILLING;
  }
}

export function saveBilling(b: BillingProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BILLING_KEY, JSON.stringify(b));
}


// ---------------------------------------------------------------------------
// ICP profile (motor de score de leads + ângulo de mensagem)
// Mock — mapeia 1:1 com a futura tabela `icp` (user_id, payload jsonb).
// ---------------------------------------------------------------------------

export type ICPProfile = {
  target_sectors: string[];
  revenue_range: number; // 0-100 slider posicional
  headcount_range: number; // 0-100
  regions: string[];
  target_roles: string[];
  seniority: string[];
  fit_keywords: string;
  pains: string[];
  buy_triggers: string[];
  qual_budget: string;
  qual_authority: string;
  qual_need: string;
  qual_timing: string;
  approach_angle: string;
  weight_role_fit: number;
  weight_company_fit: number;
  weight_trigger: number;
  weight_engagement: number;
  exclusions: string[];
};

export const DEFAULT_ICP: ICPProfile = {
  target_sectors: ["SaaS B2B", "Serviços profissionais", "Indústria"],
  revenue_range: 60,
  headcount_range: 55,
  regions: ["Sudeste", "Sul"],
  target_roles: ["CEO", "Head de Vendas", "Diretor Comercial"],
  seniority: ["C-level", "Diretoria"],
  fit_keywords: "vendas complexas, ticket alto, ciclo longo",
  pains: ["Time comercial sem processo", "CAC alto", "Pipeline irregular"],
  buy_triggers: [
    "Contratou SDR",
    "Abriu vaga comercial",
    "Trocou liderança de vendas",
    "Rodada de investimento",
    "Expansão geográfica",
  ],
  qual_budget: "R$ 15k–60k/mês em operação comercial",
  qual_authority: "Decisor: CEO/CRO/Head Comercial",
  qual_need: "Estruturar processo e previsibilidade",
  qual_timing: "0–90 dias para começar",
  approach_angle:
    "Falo direto com o decisor, sem rodeio. Mostro caso de B2B parecido, aponto o gargalo do processo e proponho diagnóstico antes da venda.",
  weight_role_fit: 70,
  weight_company_fit: 60,
  weight_trigger: 85,
  weight_engagement: 50,
  exclusions: ["Agências de marketing", "Edtech B2C", "Empresas <10 funcionários"],
};

export const ICP_SECTORS = [
  "SaaS B2B",
  "Serviços profissionais",
  "Indústria",
  "Fintech",
  "Healthtech",
  "Logística",
];
export const ICP_REGIONS = ["Sudeste", "Sul", "Nordeste", "Centro-Oeste", "Norte", "LATAM"];
export const ICP_ROLES = [
  "CEO",
  "CRO",
  "Head de Vendas",
  "Diretor Comercial",
  "Gerente Comercial",
  "Head de RevOps",
];
export const ICP_SENIORITY = ["C-level", "Diretoria", "Gerência", "Coordenação"];
export const ICP_PAINS = [
  "Time comercial sem processo",
  "CAC alto",
  "Pipeline irregular",
  "Ciclo de venda longo demais",
  "Baixa taxa de conversão",
  "Dependência do fundador para vender",
];
export const ICP_TRIGGERS = [
  "Contratou SDR",
  "Abriu vaga comercial",
  "Trocou liderança de vendas",
  "Rodada de investimento",
  "Expansão geográfica",
  "Lançou novo produto",
];

const ICP_KEY = "gs.icp.v1";

export function loadICP(): ICPProfile {
  if (typeof window === "undefined") return DEFAULT_ICP;
  try {
    const raw = window.localStorage.getItem(ICP_KEY);
    if (!raw) return DEFAULT_ICP;
    return { ...DEFAULT_ICP, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ICP;
  }
}

export function saveICP(icp: ICPProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ICP_KEY, JSON.stringify(icp));
}


