import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, FileText, Plus, Sparkles, Clock } from "lucide-react";
import { AppShell } from "@/layouts/AppShell";
import { Button } from "@/components/ui/button";
import { storageService } from "@/services/storageService";
import { documentTypes } from "@/config/documentTypes";
import { DocIcon } from "@/components/DocIcon";
import type { StoredDocument } from "@/types/document";
import { formatDateTime, statusLabel } from "@/lib/display";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gerador de Contratos — Documentos profissionais com IA" },
      {
        name: "description",
        content:
          "Crie contratos, orçamentos e recibos profissionais em minutos: preencha os dados, gere com IA, edite e baixe em PDF.",
      },
      { property: "og:title", content: "Gerador de Contratos — Documentos profissionais com IA" },
      {
        property: "og:description",
        content: "Contratos, orçamentos e recibos gerados por IA, prontos para editar e baixar em PDF.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);

  useEffect(() => {
    setDocuments(storageService.list().slice(0, 5));
  }, []);

  const highlights = documentTypes.filter((d) => d.available).slice(0, 4);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="surface-card relative overflow-hidden p-8 sm:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" /> Documentos gerados com inteligência artificial
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl leading-[1.1] sm:text-5xl">
            Contratos profissionais, prontos em minutos.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Escolha o tipo de documento, preencha os dados e receba um texto completo, organizado em
            cláusulas, pronto para editar e exportar em PDF.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/novo">
                <Plus className="size-4" /> Criar novo documento
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/documentos">Meus documentos</Link>
            </Button>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-2xl">Documentos recentes</h2>
            <Link to="/documentos" className="text-sm font-medium text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="surface-card flex flex-col items-center gap-3 p-10 text-center">
              <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <FileText className="size-5" />
              </span>
              <p className="text-sm text-muted-foreground">
                Você ainda não criou documentos. Comece pelo primeiro agora.
              </p>
              <Button asChild size="sm">
                <Link to="/novo">Criar documento</Link>
              </Button>
            </div>
          ) : (
            <ul className="grid gap-3">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <Link
                    to="/documento/$id"
                    params={{ id: doc.id }}
                    className="surface-card flex items-center gap-4 p-4 transition-colors hover:border-primary/40"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <FileText className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{doc.title}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span>{doc.documentTypeName}</span>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDateTime(doc.createdAt)}
                        </span>
                      </span>
                    </span>
                    <span className="hidden rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline">
                      {statusLabel(doc.status)}
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 text-2xl">Comece por um modelo</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((type) => (
              <Link
                key={type.id}
                to="/novo/$typeId"
                params={{ typeId: type.id }}
                className="surface-card group flex flex-col gap-3 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <DocIcon name={type.icon} className="size-5" />
                </span>
                <span className="font-display text-lg leading-tight">{type.name}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{type.description}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
