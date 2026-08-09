import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Download, FileText, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { Button } from "@/components/ui/button";
import { storageService } from "@/services/storageService";
import { generatePdf } from "@/services/pdfService";
import { friendlyError } from "@/services/aiService";
import { formatDateTime, statusLabel } from "@/lib/display";
import type { StoredDocument } from "@/types/document";

export const Route = createFileRoute("/documentos")({
  head: () => ({
    meta: [
      { title: "Meus documentos — Gerador de Contratos" },
      { name: "description", content: "Histórico dos seus contratos, orçamentos e recibos gerados." },
      { property: "og:title", content: "Meus documentos — Gerador de Contratos" },
      { property: "og:description", content: "Abra, edite, duplique ou exporte novamente seus documentos." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<StoredDocument[]>([]);

  const refresh = () => setDocuments(storageService.list());
  useEffect(refresh, []);

  const handlePdf = async (doc: StoredDocument) => {
    try {
      await generatePdf(doc.content, { header: doc.documentTypeName, fileName: doc.title });
    } catch (error) {
      toast.error(friendlyError(error));
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl">Meus documentos</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {documents.length === 0
                ? "Nenhum documento salvo neste navegador."
                : `${documents.length} documento(s) salvos neste navegador.`}
            </p>
          </div>
          <Button asChild>
            <Link to="/novo">
              <Plus className="size-4" /> Novo documento
            </Link>
          </Button>
        </header>

        {documents.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <FileText className="size-5" />
            </span>
            <p className="text-sm text-muted-foreground">
              Crie seu primeiro documento para vê-lo aqui.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {documents.map((doc) => (
              <li key={doc.id} className="surface-card p-4 sm:p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{doc.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {doc.documentTypeName} · criado em {formatDateTime(doc.createdAt)} · atualizado em{" "}
                      {formatDateTime(doc.updatedAt)}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {statusLabel(doc.status)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: "/documento/$id", params: { id: doc.id } })}
                  >
                    <Pencil className="size-4" /> Abrir e editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handlePdf(doc)}>
                    <Download className="size-4" /> Gerar PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      storageService.duplicate(doc.id);
                      refresh();
                      toast.success("Documento duplicado.");
                    }}
                  >
                    <Copy className="size-4" /> Duplicar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      storageService.remove(doc.id);
                      refresh();
                      toast.success("Documento excluído.");
                    }}
                  >
                    <Trash2 className="size-4" /> Excluir
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
