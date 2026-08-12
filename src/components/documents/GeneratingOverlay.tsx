import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

const messages = [
  "Analisando as informações...",
  "Organizando as cláusulas...",
  "Redigindo seu documento...",
  "Finalizando documento...",
];

export function GeneratingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => Math.min(i + 1, messages.length - 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 px-6 backdrop-blur-sm">
      <div className="surface-card w-full max-w-sm p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Sparkles className="size-6" />
        </span>
        <h2 className="mt-5 font-display text-xl">Gerando seu documento</h2>
        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {messages[index]}
        </p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000"
            style={{ width: `${((index + 1) / messages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
