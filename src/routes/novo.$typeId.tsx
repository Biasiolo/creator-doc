import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, Info } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { getDocumentType } from "@/config/documentTypes";
import { useWizardStore } from "@/store/wizardStore";
import { StepForm } from "@/components/form/StepForm";
import { FormStepper } from "@/components/form/FormStepper";
import { ReviewPanel } from "@/components/documents/ReviewPanel";
import { GeneratingOverlay } from "@/components/documents/GeneratingOverlay";
import { Button } from "@/components/ui/button";
import { aiService, friendlyError } from "@/services/aiService";
import { storageService } from "@/services/storageService";

export const Route = createFileRoute("/novo/$typeId")({
  head: () => ({
    meta: [
      { title: "Preencher documento — Gerador de Contratos" },
      { name: "description", content: "Preencha os dados do seu documento em etapas guiadas e gere com IA." },
      { property: "og:title", content: "Preencher documento — Gerador de Contratos" },
      { property: "og:description", content: "Formulário guiado para gerar seu documento com IA." },
    ],
  }),
  loader: ({ params }) => {
    if (!getDocumentType(params.typeId)?.available) throw notFound();
    return null;
  },
  component: WizardPage,
});

function WizardPage() {
  const { typeId } = Route.useParams();
  const navigate = useNavigate();
  const config = getDocumentType(typeId)!;
  const { step, data, setStep, mergeData, setDocumentType, reset } = useWizardStore();
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setDocumentType(typeId);
  }, [typeId, setDocumentType]);

  const steps = [...config.steps.map((s) => ({ id: s.id, title: s.title })), { id: "revisao", title: "Revisão" }];
  const isReview = step >= config.steps.length;
  const currentStep = config.steps[Math.min(step, config.steps.length - 1)]!;

  const handleBack = () => {
    if (step === 0) navigate({ to: "/novo" });
    else setStep(step - 1);
  };

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const result = await aiService.generateDocument({ documentTypeId: typeId, formData: data });
      const id = crypto.randomUUID();
      storageService.save({
        id,
        documentTypeId: config.id,
        documentTypeName: config.name,
        title: result.title || config.name,
        data,
        content: result.content,
        status: "gerado",
      });
      reset();
      navigate({ to: "/documento/$id", params: { id } });
    } catch (error) {
      toast.error(friendlyError(error));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppShell>
      {generating && <GeneratingOverlay />}

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <button
          type="button"
          onClick={() => navigate({ to: "/novo" })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Trocar tipo de documento
        </button>

        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{config.name}</p>
          <h1 className="mt-2 text-3xl">{isReview ? "Revise os dados" : currentStep.title}</h1>
          {!isReview && currentStep.description && (
            <p className="mt-2 text-sm text-muted-foreground">{currentStep.description}</p>
          )}
          {isReview && (
            <p className="mt-2 text-sm text-muted-foreground">
              Confira as informações antes de gerar. Você poderá editar o texto depois.
            </p>
          )}
        </header>

        <div className="mb-8">
          <FormStepper steps={steps} current={step} onSelect={setStep} />
        </div>

        {isReview ? (
          <div className="space-y-6">
            <ReviewPanel config={config} data={data} onEditStep={setStep} />

            <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              O documento é um modelo gerado por IA. Revise o conteúdo e, se necessário, consulte um
              profissional qualificado antes de assinar.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="ghost" onClick={() => setStep(config.steps.length - 1)}>
                <ArrowLeft className="size-4" /> Voltar
              </Button>
              <Button size="lg" onClick={handleGenerate} disabled={generating}>
                <Sparkles className="size-4" />
                Gerar documento com IA
              </Button>
            </div>
          </div>
        ) : (
          <StepForm
            key={currentStep.id}
            step={currentStep}
            data={data}
            isFirst={step === 0}
            onBack={handleBack}
            onSubmit={(values) => {
              mergeData(values);
              setStep(step + 1);
            }}
          />
        )}
      </div>
    </AppShell>
  );
}
