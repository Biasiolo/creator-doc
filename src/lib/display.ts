import type { DocumentStatus } from "@/types/document";

export function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function statusLabel(status: DocumentStatus) {
  return { rascunho: "Rascunho", gerado: "Gerado", finalizado: "Finalizado" }[status] ?? status;
}
