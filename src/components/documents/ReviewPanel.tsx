import { Pencil } from "lucide-react";
import type { DocumentTypeConfig } from "@/types/document";
import { getValue, isFieldVisible, formatDisplayValue } from "@/lib/formData";
import { Button } from "@/components/ui/button";

interface Props {
  config: DocumentTypeConfig;
  data: Record<string, unknown>;
  onEditStep: (index: number) => void;
}

export function ReviewPanel({ config, data, onEditStep }: Props) {
  return (
    <div className="space-y-4">
      {config.steps.map((step, index) => {
        const fields = step.fields.filter((f) => isFieldVisible(f, data));
        if (!fields.length) return null;
        return (
          <section key={step.id} className="surface-card p-5">
            <header className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {step.title}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onEditStep(index)}>
                <Pencil className="size-3.5" />
                Editar
              </Button>
            </header>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={field.span === 2 ? "sm:col-span-2" : undefined}>
                  <dt className="text-xs text-muted-foreground">{field.label}</dt>
                  <dd className="text-sm font-medium whitespace-pre-line">
                    {formatDisplayValue(field, getValue(data, field.name))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}
