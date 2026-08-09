import type { FieldConfig } from "@/types/document";

/** Utilidades para trabalhar com caminhos "a.b.c" nos dados do formulário. */
/**
 * Os dados do formulário são armazenados em um mapa plano cujas chaves são
 * caminhos com pontos ("contratante.nome"). Isso mantém a configuração dos
 * documentos simples e evita acoplamento com a estrutura interna do RHF.
 */
export function getValue(data: Record<string, unknown>, path: string): unknown {
  return data[path];
}

export function setValue(data: Record<string, unknown>, path: string, value: unknown) {
  data[path] = value;
  return data;
}

/** Converte "a.b" em uma chave válida para o react-hook-form. */
export const toFormKey = (path: string) => path.replace(/\./g, "__");
export const fromFormKey = (key: string) => key.replace(/__/g, ".");

export function toFormValues(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [toFormKey(k), v]));
}

export function fromFormValues(values: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(values).map(([k, v]) => [fromFormKey(k), v]));
}

export function isFieldVisible(field: FieldConfig, data: Record<string, unknown>): boolean {
  if (!field.showIf) return true;
  const current = getValue(data, field.showIf.field);
  const expected = field.showIf.equals;
  return Array.isArray(expected) ? expected.includes(String(current)) : String(current) === String(expected);
}

export function formatCurrency(value: string | number): string {
  const digits = typeof value === "number" ? String(Math.round(value * 100)) : (value ?? "").replace(/\D/g, "");
  const cents = Number(digits || 0) / 100;
  return cents.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function maskCurrency(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 15);
  if (!digits) return "";
  return formatCurrency(digits);
}

export function maskCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCNPJ(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function formatDateBR(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function formatDisplayValue(field: FieldConfig, value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (field.type === "checkbox") return value ? "Sim" : "Não";
  if (field.type === "date") return formatDateBR(String(value));
  return String(value);
}
