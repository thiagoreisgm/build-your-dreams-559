import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

export type ComposerAction = "ideas" | "write_post" | "hooks" | "improve";

const InputSchema = z.object({
  action: z.enum(["ideas", "write_post", "hooks", "improve"]),
  briefing: z.string().max(4000).optional().default(""),
  draft: z.string().max(6000).optional().default(""),
  inspirationId: z.string().uuid().optional(),
});

const SYSTEM_BASE = `Você é o assistente de copywriting do postai, um SaaS de conteúdo para LinkedIn em português do Brasil.
Voz: direta, autoral, sem clichês corporativos, sem emojis, sem hashtags, sem "afirmações vazias".
Estrutura preferida: gancho forte na primeira linha → desenvolvimento curto em parágrafos de 1-2 linhas → fechamento provocativo ou CTA sutil.
Responda SEMPRE em português do Brasil. Entregue apenas o conteúdo pedido — sem preâmbulo, sem "claro!", sem explicações sobre o que você fez.`;

type VoiceCtx = {
  samplePosts: string | null;
  toneChips: string[];
  niche: string | null;
};

type StructureCtx = {
  hook: string | null;
  structureSteps: string[];
  cta: string | null;
  format: string | null;
};

function buildSystem(voice: VoiceCtx | null): string {
  if (!voice || !voice.samplePosts?.trim()) return SYSTEM_BASE;
  const tone = voice.toneChips.length ? voice.toneChips.join(", ") : "(não informado)";
  const niche = voice.niche?.trim() || "(não informado)";
  return `${SYSTEM_BASE}

Imite fielmente a voz do autor. Aqui estão exemplos reais de como ele escreve — copie o ritmo, o vocabulário e o tom, mas NÃO copie o conteúdo:
<exemplos>
${voice.samplePosts.trim()}
</exemplos>
Tom desejado: ${tone}.
Nicho do autor: ${niche}.`;
}

function buildPrompt(
  action: ComposerAction,
  briefing: string,
  draft: string,
  structure: StructureCtx | null,
): string {
  const structureBlock =
    structure && (structure.hook || structure.structureSteps.length || structure.cta || structure.format)
      ? `

Siga esta ESTRUTURA comprovada (não copie o texto, só o esqueleto):
Formato: ${structure.format ?? "(livre)"}.
Arco: ${structure.structureSteps.length ? structure.structureSteps.join(" → ") : "(livre)"}.
Tipo de gancho inspirado em: ${structure.hook ?? "(livre)"}.
Tipo de CTA: ${structure.cta ?? "(sutil)"}.`
      : "";

  switch (action) {
    case "ideas":
      return `Gere 5 ideias de post para LinkedIn${briefing ? ` sobre: ${briefing}` : ""}.
Formato: lista numerada de 1 a 5. Cada item com 1 linha de tese + 1 linha de ângulo. Nada além disso.`;
    case "write_post":
      return `Escreva 1 post completo para LinkedIn${briefing ? ` sobre: ${briefing}` : ""}.
Entre 120 e 220 palavras. Quebras de linha curtas. Sem hashtags.${structureBlock}`;
    case "hooks":
      return `Gere 10 hooks (primeira linha de post) para LinkedIn${briefing ? ` sobre: ${briefing}` : ""}.
Cada hook em 1 linha, no máximo 12 palavras. Sem numeração, um por linha.`;
    case "improve":
      if (!draft.trim()) return "Sem rascunho para melhorar. Peça um rascunho ao usuário.";
      return `Melhore o rascunho abaixo mantendo a voz do autor. Torne o gancho mais afiado, corte gordura, mantenha o mesmo idioma. Devolva apenas a versão final.

<rascunho>
${draft}
</rascunho>`;
  }
}

export const generateComposerContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada.");

    const { supabase, userId } = context;

    // Carrega voz do usuário + limite mensal (RLS scopa por user_id).
    let voice: VoiceCtx | null = null;
    let monthlyLimit = 100;
    try {
      const [{ data: vp }, { data: prof }] = await Promise.all([
        supabase
          .from("voice_profiles")
          .select("sample_posts, tone_chips")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("niche, monthly_ai_limit")
          .eq("id", userId)
          .maybeSingle(),
      ]);
      voice = {
        samplePosts: vp?.sample_posts ?? null,
        toneChips: (vp?.tone_chips ?? []) as string[],
        niche: prof?.niche ?? null,
      };
      if (typeof prof?.monthly_ai_limit === "number") monthlyLimit = prof.monthly_ai_limit;
    } catch {
      voice = null; // cold start / falha de leitura nunca quebra a geração
    }

    // Cota mensal — conta gerações do mês corrente (UTC) via cliente autenticado.
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
    let usedCount = 0;
    {
      const { count, error: countErr } = await supabase
        .from("ai_generations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", monthStart);
      if (countErr) {
        throw new Error("Não foi possível validar sua cota de gerações. Tente novamente.");
      }
      usedCount = count ?? 0;
    }
    if (usedCount >= monthlyLimit) {
      throw new Error(
        `Você atingiu o limite de ${monthlyLimit} gerações deste mês. Faça upgrade do plano para continuar.`,
      );
    }

    // Estrutura opcional vinda da biblioteca.
    let structure: StructureCtx | null = null;
    if (data.inspirationId && data.action === "write_post") {
      try {
        const { data: insp } = await supabase
          .from("inspirations")
          .select("hook, structure_steps, cta, format")
          .eq("id", data.inspirationId)
          .maybeSingle();
        if (insp) {
          structure = {
            hook: insp.hook ?? null,
            structureSteps: (insp.structure_steps ?? []) as string[],
            cta: insp.cta ?? null,
            format: insp.format ?? null,
          };
        }
      } catch {
        structure = null;
      }
    }

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });

    const system = buildSystem(voice);
    const prompt = buildPrompt(data.action, data.briefing, data.draft, structure);

    try {
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system,
        prompt,
      });

      // Registra uso com service_role (dynamic import — não vazar no bundle do client).
      const tokensIn = (result.usage as { inputTokens?: number; promptTokens?: number } | undefined)?.inputTokens
        ?? (result.usage as { promptTokens?: number } | undefined)?.promptTokens
        ?? null;
      const tokensOut = (result.usage as { outputTokens?: number; completionTokens?: number } | undefined)?.outputTokens
        ?? (result.usage as { completionTokens?: number } | undefined)?.completionTokens
        ?? null;
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("ai_generations").insert({
          user_id: userId,
          action: data.action,
          tokens_in: tokensIn,
          tokens_out: tokensOut,
        });
      } catch (logErr) {
        console.error("[composer-ai] falha ao registrar uso:", logErr);
      }

      return {
        text: result.text,
        usage: { used: usedCount + 1, limit: monthlyLimit },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) {
        throw new Error("Muitas requisições. Aguarde alguns segundos e tente de novo.");
      }
      if (msg.includes("402")) {
        throw new Error("Créditos da IA esgotados. Adicione créditos nas configurações da workspace.");
      }
      throw new Error(`Falha ao gerar conteúdo: ${msg}`);
    }
  });
