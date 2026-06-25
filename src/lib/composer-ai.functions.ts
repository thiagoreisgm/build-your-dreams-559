import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

export type ComposerAction = "ideas" | "write_post" | "hooks" | "improve";

const InputSchema = z.object({
  action: z.enum(["ideas", "write_post", "hooks", "improve"]),
  briefing: z.string().max(4000).optional().default(""),
  draft: z.string().max(6000).optional().default(""),
});

const SYSTEM_BASE = `Você é o assistente de copywriting do GS One, um SaaS de conteúdo para LinkedIn em português do Brasil.
Voz: direta, autoral, sem clichês corporativos, sem emojis, sem hashtags, sem "afirmações vazias".
Estrutura preferida: gancho forte na primeira linha → desenvolvimento curto em parágrafos de 1-2 linhas → fechamento provocativo ou CTA sutil.
Responda SEMPRE em português do Brasil. Entregue apenas o conteúdo pedido — sem preâmbulo, sem "claro!", sem explicações sobre o que você fez.`;

function buildPrompt(action: ComposerAction, briefing: string, draft: string): string {
  switch (action) {
    case "ideas":
      return `Gere 5 ideias de post para LinkedIn${briefing ? ` sobre: ${briefing}` : ""}.
Formato: lista numerada de 1 a 5. Cada item com 1 linha de tese + 1 linha de ângulo. Nada além disso.`;
    case "write_post":
      return `Escreva 1 post completo para LinkedIn${briefing ? ` sobre: ${briefing}` : ""}.
Entre 120 e 220 palavras. Quebras de linha curtas. Sem hashtags.`;
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
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada.");

    const gateway = createLovableAiGatewayProvider(key);
    const prompt = buildPrompt(data.action, data.briefing, data.draft);

    try {
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: SYSTEM_BASE,
        prompt,
      });
      return { text: result.text };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // 429 = rate limit, 402 = créditos
      if (msg.includes("429")) {
        throw new Error("Muitas requisições. Aguarde alguns segundos e tente de novo.");
      }
      if (msg.includes("402")) {
        throw new Error("Créditos da IA esgotados. Adicione créditos nas configurações da workspace.");
      }
      throw new Error(`Falha ao gerar conteúdo: ${msg}`);
    }
  });

