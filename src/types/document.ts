export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "cpf"
  | "cnpj"
  | "address"
  | "date"
  | "currency"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldCondition {
  /** caminho do campo observado, ex: "prazo.determinado" */
  field: string;
  /** valor (ou valores) que tornam este campo visível */
  equals: string | string[];
}

export interface FieldConfig {
  /** caminho com pontos, ex: "contratante.nome" */
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  /** largura no grid: 1 = metade, 2 = linha inteira */
  span?: 1 | 2;
  showIf?: FieldCondition;
}

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export interface DocumentTypeConfig {
  id: string;
  name: string;
  description: string;
  /** nome do ícone lucide */
  icon: string;
  category: "contrato" | "termo" | "comercial" | "financeiro";
  /** regras que a IA deve seguir para este documento */
  rules: string[];
  /** instruções extras específicas do documento */
  aiInstructions: string;
  steps: StepConfig[];
  /** disponível apenas em planos pagos (preparado para monetização) */
  premium?: boolean;
  available?: boolean;
}

export interface DocumentSection {
  title: string;
  content: string;
}

export interface GeneratedDocument {
  title: string;
  sections: DocumentSection[];
  /** HTML pronto para o editor */
  content: string;
  metadata?: Record<string, unknown>;
}

export type DocumentStatus = "rascunho" | "gerado" | "finalizado";

export interface StoredDocument {
  id: string;
  documentTypeId: string;
  documentTypeName: string;
  title: string;
  data: Record<string, unknown>;
  content: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}
