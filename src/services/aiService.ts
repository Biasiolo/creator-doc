import type { GeneratedDocument } from "@/types/document";
import { generateDocumentFn } from "@/lib/ai.functions";

export interface GenerateDocumentInput {
  documentTypeId: string;
  formData: Record<string, unknown>;
}

/**
 * Fachada de IA usada pela interface. Isola o app do provedor:
 * hoje chama uma server function (chave nunca exposta no frontend),
 * amanhã pode chamar outra API sem alterar as telas.
 */
export const aiService = {
  async generateDocument(input: GenerateDocumentInput): Promise<GeneratedDocument> {
    const result = await generateDocumentFn({ data: input });
    return result as GeneratedDocument;
  },
};

export function friendlyError(error: unknown): string {
  if (error instanceof Error && error.message && error.message.length < 160) return error.message;
  return "Não foi possível concluir a operação. Verifique sua conexão e tente novamente.";
}
