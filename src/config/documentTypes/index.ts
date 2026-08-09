import type { DocumentTypeConfig } from "@/types/document";
import { prestacaoServicos } from "./prestacaoServicos";
import { freelancer } from "./freelancer";
import { orcamento } from "./orcamento";
import { recibo } from "./recibo";

/**
 * Registro central de tipos de documento.
 * Para adicionar um novo documento basta criar um arquivo de configuração
 * e incluí-lo nesta lista — formulário, validação, revisão e prompt da IA
 * são gerados automaticamente a partir da configuração.
 */
export const documentTypes: DocumentTypeConfig[] = [
  prestacaoServicos,
  freelancer,
  orcamento,
  recibo,
  {
    id: "compra-venda",
    name: "Contrato de Compra e Venda",
    description: "Formaliza a venda de bens móveis ou imóveis.",
    icon: "Handshake",
    category: "contrato",
    available: false,
    rules: [],
    aiInstructions: "",
    steps: [],
  },
  {
    id: "locacao",
    name: "Contrato de Locação",
    description: "Locação de imóveis residenciais ou comerciais.",
    icon: "Home",
    category: "contrato",
    available: false,
    rules: [],
    aiInstructions: "",
    steps: [],
  },
  {
    id: "confidencialidade",
    name: "Termo de Confidencialidade",
    description: "Protege informações sigilosas compartilhadas entre as partes.",
    icon: "Lock",
    category: "termo",
    available: false,
    rules: [],
    aiInstructions: "",
    steps: [],
  },
  {
    id: "proposta",
    name: "Proposta Comercial",
    description: "Apresentação comercial completa com escopo e investimento.",
    icon: "Presentation",
    category: "comercial",
    available: false,
    premium: true,
    rules: [],
    aiInstructions: "",
    steps: [],
  },
  {
    id: "responsabilidade",
    name: "Termo de Responsabilidade",
    description: "Define responsabilidades assumidas por uma das partes.",
    icon: "ShieldCheck",
    category: "termo",
    available: false,
    rules: [],
    aiInstructions: "",
    steps: [],
  },
  {
    id: "personalizado",
    name: "Documento personalizado",
    description: "Descreva livremente o documento que você precisa.",
    icon: "Sparkles",
    category: "termo",
    available: false,
    premium: true,
    rules: [],
    aiInstructions: "",
    steps: [],
  },
];

export function getDocumentType(id: string): DocumentTypeConfig | undefined {
  return documentTypes.find((d) => d.id === id);
}
