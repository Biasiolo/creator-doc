import type { DocumentTypeConfig } from "@/types/document";
import { partyFields, paymentStep, deadlineStep } from "../commonFields";

export const prestacaoServicos: DocumentTypeConfig = {
  id: "prestacao-servicos",
  name: "Contrato de Prestação de Serviços",
  description: "Formaliza a prestação de serviços entre contratante e contratado.",
  icon: "FileSignature",
  category: "contrato",
  available: true,
  rules: [
    "Deve conter a qualificação completa das partes (contratante e contratado).",
    "Deve conter cláusula de objeto do contrato.",
    "Deve descrever detalhadamente os serviços prestados.",
    "Deve conter valores e forma de pagamento.",
    "Deve conter prazo de vigência e execução.",
    "Deve conter obrigações de cada parte.",
    "Deve conter cláusula de rescisão e penalidades.",
    "Deve conter cláusula de foro.",
    "Deve conter espaço para assinatura das partes e testemunhas.",
  ],
  aiInstructions:
    "Utilize numeração de cláusulas no formato 'CLÁUSULA PRIMEIRA — DO OBJETO'. Linguagem jurídica formal, porém clara.",
  steps: [
    {
      id: "contratante",
      title: "Dados do contratante",
      description: "Quem contrata o serviço.",
      fields: partyFields("contratante", "contratante"),
    },
    {
      id: "contratado",
      title: "Dados do contratado",
      description: "Quem presta o serviço.",
      fields: partyFields("contratado", "contratado"),
    },
    {
      id: "servico",
      title: "Dados do serviço",
      fields: [
        { name: "servico.titulo", label: "Serviço contratado", type: "text", required: true, span: 2 },
        {
          name: "servico.descricao",
          label: "Descrição detalhada dos serviços",
          type: "textarea",
          required: true,
          span: 2,
        },
        { name: "servico.local", label: "Local de execução", type: "text" },
        {
          name: "servico.entregaveis",
          label: "Entregáveis",
          type: "textarea",
          span: 2,
          placeholder: "Liste os entregáveis, um por linha.",
        },
      ],
    },
    paymentStep(),
    deadlineStep,
  ],
};
