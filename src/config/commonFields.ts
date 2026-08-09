import type { FieldConfig, StepConfig } from "@/types/document";

/** Blocos de campos reutilizáveis entre os tipos de documento. */
export function partyFields(prefix: string, label: string): FieldConfig[] {
  return [
    {
      name: `${prefix}.tipoPessoa`,
      label: `Tipo de pessoa (${label})`,
      type: "radio",
      required: true,
      span: 2,
      options: [
        { label: "Pessoa física", value: "fisica" },
        { label: "Pessoa jurídica", value: "juridica" },
      ],
    },
    { name: `${prefix}.nome`, label: "Nome completo / Razão social", type: "text", required: true, span: 2 },
    {
      name: `${prefix}.cpf`,
      label: "CPF",
      type: "cpf",
      required: true,
      placeholder: "000.000.000-00",
      showIf: { field: `${prefix}.tipoPessoa`, equals: "fisica" },
    },
    {
      name: `${prefix}.cnpj`,
      label: "CNPJ",
      type: "cnpj",
      required: true,
      placeholder: "00.000.000/0000-00",
      showIf: { field: `${prefix}.tipoPessoa`, equals: "juridica" },
    },
    {
      name: `${prefix}.representante`,
      label: "Representante legal",
      type: "text",
      showIf: { field: `${prefix}.tipoPessoa`, equals: "juridica" },
    },
    { name: `${prefix}.email`, label: "E-mail", type: "email" },
    { name: `${prefix}.telefone`, label: "Telefone", type: "phone", placeholder: "(11) 99999-9999" },
    { name: `${prefix}.endereco`, label: "Endereço completo", type: "address", span: 2 },
  ];
}

export const paymentStep = (prefix = "pagamento"): StepConfig => ({
  id: "pagamento",
  title: "Valores e pagamento",
  description: "Defina os valores e a forma de pagamento.",
  fields: [
    { name: `${prefix}.valorTotal`, label: "Valor total", type: "currency", required: true },
    {
      name: `${prefix}.forma`,
      label: "Forma de pagamento",
      type: "select",
      required: true,
      options: [
        { label: "PIX", value: "PIX" },
        { label: "Transferência bancária", value: "Transferência bancária" },
        { label: "Boleto", value: "Boleto" },
        { label: "Cartão de crédito", value: "Cartão de crédito" },
        { label: "Dinheiro", value: "Dinheiro" },
      ],
    },
    {
      name: `${prefix}.parcelado`,
      label: "Pagamento parcelado?",
      type: "radio",
      required: true,
      span: 2,
      options: [
        { label: "Sim", value: "sim" },
        { label: "Não", value: "nao" },
      ],
    },
    {
      name: `${prefix}.parcelas`,
      label: "Número de parcelas",
      type: "number",
      required: true,
      showIf: { field: `${prefix}.parcelado`, equals: "sim" },
    },
    {
      name: `${prefix}.periodicidade`,
      label: "Periodicidade",
      type: "select",
      showIf: { field: `${prefix}.parcelado`, equals: "sim" },
      options: [
        { label: "Mensal", value: "Mensal" },
        { label: "Quinzenal", value: "Quinzenal" },
        { label: "Semanal", value: "Semanal" },
      ],
    },
    {
      name: `${prefix}.valorParcela`,
      label: "Valor da parcela",
      type: "currency",
      showIf: { field: `${prefix}.parcelado`, equals: "sim" },
    },
    {
      name: `${prefix}.condicoes`,
      label: "Condições adicionais de pagamento",
      type: "textarea",
      span: 2,
      placeholder: "Ex.: 50% na contratação e 50% na entrega.",
    },
  ],
});

export const deadlineStep: StepConfig = {
  id: "prazos",
  title: "Prazos e condições",
  description: "Vigência, prazos e observações finais.",
  fields: [
    {
      name: "prazo.determinado",
      label: "Existe prazo determinado?",
      type: "radio",
      required: true,
      span: 2,
      options: [
        { label: "Sim", value: "sim" },
        { label: "Não", value: "nao" },
      ],
    },
    {
      name: "prazo.inicio",
      label: "Data de início",
      type: "date",
      required: true,
      showIf: { field: "prazo.determinado", equals: "sim" },
    },
    {
      name: "prazo.termino",
      label: "Data de término",
      type: "date",
      required: true,
      showIf: { field: "prazo.determinado", equals: "sim" },
    },
    { name: "prazo.foro", label: "Foro / Comarca", type: "text", placeholder: "Ex.: São Paulo/SP" },
    { name: "prazo.multa", label: "Multa por rescisão (%)", type: "number" },
    { name: "prazo.observacoes", label: "Observações adicionais", type: "textarea", span: 2 },
  ],
};
