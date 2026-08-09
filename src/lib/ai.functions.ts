import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDocumentType } from "@/config/documentTypes";
import { SYSTEM_PROMPT, buildUserPrompt, sectionsToHtml } from "@/lib/promptBuilder";

const inputSchema = z.object({
  documentTypeId: z.string(),
  formData: z.record(z.any()),
});

const sectionSchema = z.object({ title: z.string(), content: z.string() });
const responseSchema = z.object({ title: z.string(), sections: z.array(sectionSchema).min(1) });

function extractJson(raw: string): unknown {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("INVALID_JSON");
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

/**
 * Camada isolada de IA. O provedor pode ser trocado sem impacto no frontend:
 * basta manter o contrato de entrada/saída desta função.
 */
export const generateDocumentFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const config = getDocumentType(data.documentTypeId);
    if (!config) throw new Error("Tipo de documento não encontrado.");

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Serviço de geração indisponível no momento.");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(config, data.formData) },
          ],
        }),
      });

      if (res.status === 429) throw new Error("Muitas solicitações. Tente novamente em instantes.");
      if (res.status === 402) throw new Error("Créditos de IA esgotados. Recarregue para continuar gerando.");
      if (!res.ok) throw new Error("Não foi possível gerar o documento agora.");

      const payload = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const raw = payload.choices?.[0]?.message?.content;
      if (!raw) throw new Error("A IA retornou uma resposta vazia.");

      const parsed = responseSchema.safeParse(extractJson(raw));
      if (!parsed.success) {
        return {
          title: config.name,
          sections: [{ title: config.name, content: raw }],
          content: sectionsToHtml(config.name, [{ title: config.name, content: raw }]),
        };
      }

      return {
        title: parsed.data.title,
        sections: parsed.data.sections,
        content: sectionsToHtml(parsed.data.title, parsed.data.sections),
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("A geração demorou mais que o esperado. Tente novamente.");
      }
      throw error instanceof Error ? error : new Error("Falha inesperada na geração.");
    } finally {
      clearTimeout(timeout);
    }
  });
