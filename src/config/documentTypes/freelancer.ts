import type { DocumentTypeConfig } from "@/types/document";
import { partyFields, paymentStep, deadlineStep } from "../commonFields";

export const freelancer: DocumentTypeConfig = {
  id: "freelancer",
  name: "Contrato de Freelancer",
  description: "Contrato simplificado para trabalhos autônomos e projetos pontuais.",
  icon: "Laptop",
  category: "contrato",
  available: true,
  rules: [
    "Deve identificar cliente e profissional autônomo.",
    "Deve deixar claro que não existe vínculo empregatício.",
    "Deve descrever o escopo do projeto e os entregáveis.",
    "Deve definir número de revisões incluídas.",
    "Deve definir propriedade intelectual do trabalho entregue.",
    "Deve conter valores, forma de pagamento e prazos.",
    "Deve conter cláusula de rescisão e foro.",
    "Deve conter espaço para assinatura.",
  ],
  aiInstructions:
    "Use linguagem formal, porém objetiva e enxuta. Cláusulas curtas e diretas, adequadas a projetos de curta duração.",
  steps: [
    { id: "cliente", title: "Dados do cliente", fields: partyFields("cliente", "cliente") },
    {
      id: "profissional",
      title: "Dados do profissional",
      fields: partyFields("profissional", "profissional"),
    },
    {
      id: "projeto",
      title: "Escopo do projeto",
      fields: [
        { name: "projeto.nome", label: "Nome do projeto", type: "text", required: true, span: 2 },
        { name: "projeto.escopo", label: "Escopo do trabalho", type: "textarea", required: true, span: 2 },
        { name: "projeto.entregaveis", label: "Entregáveis", type: "textarea", span: 2 },
        { name: "projeto.revisoes", label: "Revisões incluídas", type: "number" },
        {
          name: "projeto.propriedade",
          label: "Propriedade intelectual",
          type: "select",
          options: [
            { label: "Transferida ao cliente após pagamento", value: "Transferida ao cliente após o pagamento integral" },
            { label: "Licença de uso ao cliente", value: "Licença de uso concedida ao cliente" },
            { label: "Permanece com o profissional", value: "Permanece com o profissional" },
          ],
        },
      ],
    },
    paymentStep(),
    deadlineStep,
  ],
};
