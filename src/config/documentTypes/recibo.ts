import type { DocumentTypeConfig } from "@/types/document";
import { partyFields } from "../commonFields";

export const recibo: DocumentTypeConfig = {
  id: "recibo",
  name: "Recibo",
  description: "Comprovante simples de pagamento ou entrega de valores.",
  icon: "ReceiptText",
  category: "financeiro",
  available: true,
  rules: [
    "Deve identificar quem recebeu e quem pagou.",
    "Deve informar o valor em algarismos e por extenso.",
    "Deve informar a que se refere o pagamento.",
    "Deve conter local e data.",
    "Deve conter espaço para assinatura de quem recebeu.",
    "Deve ser um documento curto e objetivo.",
  ],
  aiInstructions:
    "Gere um recibo curto, em no máximo duas seções, sem cláusulas numeradas. Escreva o valor por extenso em português.",
  steps: [
    { id: "recebedor", title: "Quem recebeu", fields: partyFields("recebedor", "recebedor") },
    { id: "pagador", title: "Quem pagou", fields: partyFields("pagador", "pagador") },
    {
      id: "pagamento",
      title: "Dados do pagamento",
      fields: [
        { name: "recibo.valor", label: "Valor recebido", type: "currency", required: true },
        { name: "recibo.data", label: "Data do pagamento", type: "date", required: true },
        { name: "recibo.referente", label: "Referente a", type: "textarea", required: true, span: 2 },
        {
          name: "recibo.forma",
          label: "Forma de pagamento",
          type: "select",
          required: true,
          options: [
            { label: "PIX", value: "PIX" },
            { label: "Dinheiro", value: "Dinheiro" },
            { label: "Transferência bancária", value: "Transferência bancária" },
            { label: "Cartão", value: "Cartão" },
            { label: "Boleto", value: "Boleto" },
          ],
        },
        { name: "recibo.local", label: "Local de emissão", type: "text", required: true },
        {
          name: "recibo.quitacao",
          label: "Dar plena quitação do valor?",
          type: "checkbox",
          span: 2,
          helpText: "Se marcado, o recibo declara quitação total da obrigação.",
        },
      ],
    },
  ],
};
