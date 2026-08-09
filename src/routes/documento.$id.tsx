import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Eye, Pencil, Save, CheckCircle2, Printer } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { Button } from "@/components/ui/button";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { storageService } from "@/services/storageService";
import { generatePdf } from "@/services/pdfService";
import { friendlyError } from "@/services/aiService";
import type { StoredDocument } from "@/types/document";

export const Route = createFileRoute("/documento/$id")({
  head: () => ({
    meta: [
      { title: "Editar documento — Gerador de Contratos" },
      { name: "description", content: "Edite o texto do seu documento e exporte um PDF em formato A4." },
      { property: "og:title", content: "Editar documento — Gerador de Contratos" },
      { property: "og:description", content: "Editor de documentos com preview A4 e exportação em PDF." },
    ],
  }),
  component: DocumentPage,
});

function DocumentPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<StoredDocument | null | undefined>(undefined);
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<"editar" | "visualizar">("editar");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const found = storageService.get(id);
    setDoc(found ?? null);
    setContent(found?.content ?? "");
  }, [id]);

  const save = (status?: StoredDocument["status"]) => {
    if (!doc) return;
    const updated = storageService.save({ ...doc, content, status: status ?? doc.status });
    setDoc(updated);
    setDirty(false);
    toast.success("Documento salvo.");
  };

  const handlePdf = async () => {
    if (!doc) return;
    try {
      await generatePdf(content, { header: doc.documentTypeName, fileName: doc.title });
      storageService.save({ ...doc, content, status: "finalizado" });
      setDoc({ ...doc, content, status: "finalizado" });
      toast.success("PDF gerado com sucesso.");
    } catch (error) {
      toast.error(friendlyError(error));
    }
  };

  if (doc === undefined) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-sm text-muted-foreground">
          Carregando documento...
        </div>
      </AppShell>
    );
  }

  if (doc === null) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-3xl">Documento não encontrado</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Ele pode ter sido excluído deste navegador.
          </p>
          <Button asChild className="mt-6">
            <Link to="/documentos">Ver meus documentos</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="no-print mb-6 flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/documentos" })}>
            <ArrowLeft className="size-4" /> Meus documentos
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl sm:text-2xl">{doc.title}</h1>
            <p className="text-xs text-muted-foreground">
              {doc.documentTypeName}
              {dirty ? " · alterações não salvas" : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode(mode === "editar" ? "visualizar" : "editar")}
            >
              {mode === "editar" ? <Eye className="size-4" /> : <Pencil className="size-4" />}
              {mode === "editar" ? "Visualizar" : "Editar"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => save()} disabled={!dirty}>
              <Save className="size-4" /> Salvar
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="size-4" /> Imprimir
            </Button>
            <Button size="sm" onClick={handlePdf}>
              <Download className="size-4" /> Gerar PDF
            </Button>
          </div>
        </div>

        {doc.status === "finalizado" && (
          <div className="no-print mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-accent/60 p-4">
            <CheckCircle2 className="size-5 text-success" />
            <span className="text-sm font-medium">Documento pronto!</span>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/novo">Novo documento</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/documentos">Meus documentos</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto pb-10">
          {mode === "editar" ? (
            <DocumentEditor
              content={doc.content}
              onChange={(html) => {
                setContent(html);
                setDirty(true);
              }}
            />
          ) : (
            <div className="a4-sheet doc-typography" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
