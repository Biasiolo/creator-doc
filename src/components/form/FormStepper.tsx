import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { id: string; title: string }[];
  current: number;
  onSelect?: (index: number) => void;
}

export function FormStepper({ steps, current, onSelect }: StepperProps) {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          Etapa {current + 1} de {steps.length}
        </span>
        <span>{Math.round(progress)}% concluído</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="hidden flex-wrap gap-2 lg:flex">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={index > current}
                onClick={() => onSelect?.(index)}
                className={cn(
                  "flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors",
                  active && "border-primary bg-primary text-primary-foreground",
                  done && "border-primary/30 bg-accent text-accent-foreground",
                  !active && !done && "text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="size-3" />
                ) : (
                  <span className="tabular-nums">{index + 1}</span>
                )}
                {step.title}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
