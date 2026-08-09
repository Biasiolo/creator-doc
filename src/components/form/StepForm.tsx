import { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { StepConfig } from "@/types/document";
import { buildStepSchema } from "@/lib/validation";
import { isFieldVisible, toFormValues, fromFormValues } from "@/lib/formData";
import { DynamicField } from "./DynamicField";
import { Button } from "@/components/ui/button";

interface Props {
  step: StepConfig;
  data: Record<string, unknown>;
  isFirst: boolean;
  onBack: () => void;
  onSubmit: (values: Record<string, unknown>) => void;
}

/** Renderiza uma etapa do formulário com validação própria. */
export function StepForm({ step, data, isFirst, onBack, onSubmit }: Props) {
  const methods = useForm({
    defaultValues: toFormValues(data),
    mode: "onBlur",
    resolver: (values, context, options) => {
      const current = fromFormValues(values as Record<string, unknown>);
      const schema = buildStepSchema(step, (field) => isFieldVisible(field, current));
      return zodResolver(schema)(values, context, options);
    },
  });

  const watched = methods.watch();
  const visibleFields = useMemo(() => {
    const current = fromFormValues(watched as Record<string, unknown>);
    return step.fields.filter((field) => isFieldVisible(field, current));
  }, [step, watched]);

  const handle = methods.handleSubmit((values) => {
    onSubmit(fromFormValues(values as Record<string, unknown>));
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handle} className="space-y-8" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          {visibleFields.map((field) => (
            <DynamicField key={field.name} field={field} />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="size-4" />
            {isFirst ? "Trocar documento" : "Voltar"}
          </Button>
          <Button type="submit">
            Continuar
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
