import * as Icons from "lucide-react";
import { FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Resolve um ícone lucide pelo nome definido na configuração do documento. */
export function DocIcon({ name, className }: { name: string; className?: string }) {
  const registry = Icons as unknown as Record<string, LucideIcon>;
  const Icon = registry[name] ?? FileText;
  return <Icon className={className} />;
}
