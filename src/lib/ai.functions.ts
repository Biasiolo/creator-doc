import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { getDocumentType } from "@/config/documentTypes";
import { SYSTEM_PROMPT, buildUserPrompt, sectionsToHtml } from "@/lib/promptBuilder";

const inputSchema = z.object({
  documentTypeId: z.string(),
  formData: z.record(z.any()),
});

const sectionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const responseSchema = z.object({
  title: z.string(),
  sections: z.array(sectionSchema).min(1),
});

/**
 * Camada isolada de IA.
 *
 * O provedor pode ser trocado sem impacto no frontend:
 * basta manter o contrato de entrada/saída desta função.
 */
export const generateDocumentFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const config = getDocumentType(data.documentTypeId);

    if (!config) {
      throw new Error("Tipo de documento não encontrado.");
    }

    // A chave fica exclusivamente no servidor.
    const apiKey = process.env["GEMINI_API_KEY"];

    if (!apiKey) {
      throw new Error("Serviço de geração indisponível no momento.");
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: buildUserPrompt(config, data.formData),

        config: {
          systemInstruction: SYSTEM_PROMPT,

          // Pedimos ao Gemini para retornar JSON válido.
          responseMimeType: "application/json",

          responseSchema: {
            type: "object",
            properties: {
              title: {
                type: "string",
              },

              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                    },
                    content: {
                      type: "string",
                    },
                  },
                  required: ["title", "content"],
                },
              },
            },
            required: ["title", "sections"],
          },
        },
      });

      const raw = response.text;

      if (!raw) {
        throw new Error("A IA retornou uma resposta vazia.");
      }

      let parsedJson: unknown;

      try {
        parsedJson = JSON.parse(raw);
      } catch {
        throw new Error("A IA retornou um JSON inválido.");
      }

      const parsed = responseSchema.safeParse(parsedJson);

      if (!parsed.success) {
        return {
          title: config.name,
          sections: [
            {
              title: config.name,
              content: raw,
            },
          ],
          content: sectionsToHtml(config.name, [
            {
              title: config.name,
              content: raw,
            },
          ]),
        };
      }

      return {
        title: parsed.data.title,
        sections: parsed.data.sections,
        content: sectionsToHtml(parsed.data.title, parsed.data.sections),
      };
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        // Erros comuns de limite da API.
        if (
          message.includes("429") ||
          message.includes("rate limit") ||
          message.includes("resource exhausted")
        ) {
          throw new Error("Muitas solicitações. Tente novamente em instantes.");
        }

        // Erros de autenticação/chave.
        if (
          message.includes("401") ||
          message.includes("403") ||
          message.includes("api key") ||
          message.includes("authentication")
        ) {
          throw new Error("Não foi possível autenticar o serviço de IA.");
        }

        throw error;
      }

      throw new Error("Falha inesperada na geração.");
    }
  });
