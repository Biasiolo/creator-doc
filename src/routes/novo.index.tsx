import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { documentTypes } from "@/config/documentTypes";
import { DocumentTypeCard } from "@/components/documents/DocumentTypeCard";
import { useWizardStore } from "@/store/wizardStore";

export const Route = createFileRoute("/novo/")({
  head: () => ({
    meta: [
      { title: "Escolher tipo de documento — Gerador de Contratos" },
      {
        name: "description",
        content: "Selecione entre contratos de prestação de serviços, freelancer, orçamentos e recibos.",
      },
      { property: "og:title", content: "Escolher tipo de documento — Gerador de Contratos" },
      {
        property: "og:description",
        content: "Modelos prontos de contratos, orçamentos e recibos para gerar com IA.",
      },
    ],
  }),
  component: SelectType,
});

function SelectType() {
  const navigate = useNavigate();
  const setDocumentType = useWizardStore((s) => s.setDocumentType);

  const handleSelect = (id: string) => {
    setDocumentType(id);
    navigate({ to: "/novo/$typeId", params: { typeId: id } });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl">Qual documento você precisa?</h1>
          <p className="mt-3 text-muted-foreground">
            Escolha um modelo. Nós montamos o formulário certo e cuidamos da redação.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documentTypes.map((type) => (
            <DocumentTypeCard key={type.id} document={type} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
