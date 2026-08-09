import type { DocumentTypeConfig } from "@/types/document";
import { partyFields } from "../commonFields";

export const orcamento: DocumentTypeConfig = {
  id: "orcamento",
  name: "Orçamento Comercial",
  description: "Apresente valores, itens e condições de forma profissional.",
  icon: "Calculator",
  category: "comercial",
  available: true,
  rules: [
    "Deve identificar o emissor e o cliente.",
    "Deve listar os itens/serviços orçados com valores.",
    "Deve apresentar o valor total e eventuais descontos.",
    "Deve informar prazo de validade da proposta.",
    "Deve informar condições de pagamento e prazo de execução.",
    "Deve conter observações e espaço para aceite.",
  ],
  aiInstructions:
    "Organize em seções claras (Dados do cliente, Itens, Investimento, Condições, Validade). Não use numeração de cláusulas jurídicas.",
  steps: [
    { id: "emissor", title: "Seus dados", fields: partyFields("emissor", "emissor") },
    { id: "cliente", title: "Dados do cliente", fields: partyFields("cliente", "cliente") },
    {
      id: "itens",
      title: "Itens do orçamento",
      fields: [
        { name: "orcamento.numero", label: "Número do orçamento", type: "text" },
        { name: "orcamento.data", label: "Data de emissão", type: "date", required: true },
        {
          name: "orcamento.itens",
          label: "Itens e valores",
          type: "textarea",
          required: true,
          span: 2,
          placeholder: "Um item por linha. Ex.: Criação de logotipo - R$ 1.200,00",
        },
        { name: "orcamento.desconto", label: "Desconto concedido", type: "currency" },
        { name: "orcamento.valorTotal", label: "Valor total", type: "currency", required: true },
      ],
    },
    {
      id: "condicoes",
      title: "Condições",
      fields: [
        { name: "orcamento.validade", label: "Validade da proposta (dias)", type: "number", required: true },
        { name: "orcamento.prazoExecucao", label: "Prazo de execução", type: "text" },
        { name: "orcamento.formaPagamento", label: "Condições de pagamento", type: "textarea", span: 2 },
        { name: "orcamento.observacoes", label: "Observações", type: "textarea", span: 2 },
      ],
    },
  ],
};
