import { ArrowRight, Lock } from "lucide-react";
import type { DocumentTypeConfig } from "@/types/document";
import { DocIcon } from "@/components/DocIcon";
import { cn } from "@/lib/utils";

interface Props {
  document: DocumentTypeConfig;
  onSelect: (id: string) => void;
}

export function DocumentTypeCard({ document, onSelect }: Props) {
  const disabled = !document.available;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(document.id)}
      className={cn(
        "group surface-card flex h-full flex-col items-start gap-3 p-5 text-left transition-all",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift",
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <DocIcon name={document.icon} className="size-5" />
      </span>

      <div className="space-y-1">
        <h3 className="font-display text-lg leading-tight">{document.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{document.description}</p>
      </div>

      <span className="mt-auto pt-2 text-sm font-medium text-primary">
        {disabled ? (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Lock className="size-3.5" /> Em breve
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            Selecionar
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </span>
    </button>
  );
}
