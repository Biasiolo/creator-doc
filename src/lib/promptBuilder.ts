import type { DocumentTypeConfig, FieldConfig } from "@/types/document";
import { getValue, isFieldVisible, formatDisplayValue } from "./formData";

export const SYSTEM_PROMPT = `Você é um assistente especializado na elaboração de documentos formais em português brasileiro.

Sua função é transformar os dados fornecidos pelo usuário em um documento claro, organizado e profissional.

Regras obrigatórias:
- Nunca invente informações.
- Utilize somente os dados fornecidos.
- Caso uma informação necessária esteja ausente, utilize um marcador no formato [INFORMAR: descrição].
- Mantenha linguagem formal e clara.
- Organize o documento em cláusulas e seções.
- Não altere valores, nomes, documentos, datas ou informações cadastrais fornecidas.
- Não adicione obrigações que não tenham sido solicitadas sem deixar isso explícito.
- Preserve a intenção comercial informada pelo usuário.
- Gere o documento em formato adequado para edição posterior.
- Não inclua explicações sobre o processo de geração dentro do documento.
- Retorne somente o conteúdo solicitado.`;

/** Serializa apenas os campos visíveis e preenchidos, evitando enviar dados desnecessários. */
export function serializeFormData(config: DocumentTypeConfig, data: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const step of config.steps) {
    const visible = step.fields.filter((f: FieldConfig) => isFieldVisible(f, data));
    const filled = visible.filter((f) => {
      const v = getValue(data, f.name);
      return v !== undefined && v !== null && v !== "";
    });
    if (!filled.length) continue;
    lines.push(`## ${step.title}`);
    for (const field of filled) {
      lines.push(`- ${field.label}: ${formatDisplayValue(field, getValue(data, field.name))}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function buildUserPrompt(config: DocumentTypeConfig, data: Record<string, unknown>): string {
  return `# TIPO DO DOCUMENTO
${config.name}

# REGRAS DO DOCUMENTO
${config.rules.map((r) => `- ${r}`).join("\n")}

# INSTRUÇÕES ESPECÍFICAS
${config.aiInstructions}

# DADOS FORNECIDOS PELO USUÁRIO
${serializeFormData(config, data)}

# INSTRUÇÕES DE FORMATAÇÃO
- Responda EXCLUSIVAMENTE com um JSON válido, sem blocos de código.
- Formato: {"title": string, "sections": [{"title": string, "content": string}]}
- "content" deve conter o texto corrido da seção, com parágrafos separados por \\n.
- A última seção deve ser destinada às assinaturas, com local, data e linhas de assinatura das partes (nome e CPF/CNPJ).`;
}

export function sectionsToHtml(title: string, sections: { title: string; content: string }[]): string {
  const body = sections
    .map(
      (s) =>
        `<h2>${escapeHtml(s.title)}</h2>` +
        s.content
          .split(/\n+/)
          .filter(Boolean)
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join(""),
    )
    .join("");
  return `<h1>${escapeHtml(title)}</h1>${body}`;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
