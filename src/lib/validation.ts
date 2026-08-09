import { z } from "zod";
import type { FieldConfig, StepConfig } from "@/types/document";

export const onlyDigits = (v: string) => (v ?? "").replace(/\D/g, "");

export function isValidCPF(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10]);
}

export function isValidCNPJ(value: string): boolean {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (len: number) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cnpj[i]) * weights[i];
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return calc(12) === Number(cnpj[12]) && calc(13) === Number(cnpj[13]);
}

const required = (schema: z.ZodTypeAny) => schema;

function baseSchema(field: FieldConfig): z.ZodTypeAny {
  const req = field.required;
  switch (field.type) {
    case "email":
      return z
        .string()
        .trim()
        .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Informe um e-mail válido")
        .refine((v) => !req || v.length > 0, "Campo obrigatório");
    case "cpf":
      return z
        .string()
        .trim()
        .refine((v) => !req || v.length > 0, "Campo obrigatório")
        .refine((v) => !v || isValidCPF(v), "CPF inválido");
    case "cnpj":
      return z
        .string()
        .trim()
        .refine((v) => !req || v.length > 0, "Campo obrigatório")
        .refine((v) => !v || isValidCNPJ(v), "CNPJ inválido");
    case "phone":
      return z
        .string()
        .trim()
        .refine((v) => !req || v.length > 0, "Campo obrigatório")
        .refine((v) => !v || onlyDigits(v).length >= 10, "Telefone inválido");
    case "date":
      return z
        .string()
        .trim()
        .refine((v) => !req || v.length > 0, "Campo obrigatório")
        .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Data inválida");
    case "currency":
      return z
        .string()
        .trim()
        .refine((v) => !req || v.length > 0, "Campo obrigatório")
        .refine((v) => !v || onlyDigits(v).length > 0, "Valor inválido");
    case "number":
      return z
        .string()
        .trim()
        .refine((v) => !req || v.length > 0, "Campo obrigatório")
        .refine((v) => !v || !Number.isNaN(Number(v)), "Informe um número válido");
    case "checkbox":
      return z.boolean().optional();
    default:
      return z
        .string()
        .trim()
        .refine((v) => !req || v.length > 0, "Campo obrigatório");
  }
}

/** Monta um schema Zod para os campos visíveis de uma etapa. */
export function buildStepSchema(step: StepConfig, visible: (f: FieldConfig) => boolean) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of step.fields) {
    if (!visible(field)) continue;
    shape[field.name] = required(baseSchema(field));
  }
  return z.object(shape);
}
