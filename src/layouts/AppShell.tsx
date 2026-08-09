import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, LayoutDashboard, FolderClosed, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Painel", icon: LayoutDashboard },
  { to: "/documentos", label: "Meus documentos", icon: FolderClosed },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="size-4" />
            </span>
            <span className="font-display text-lg leading-none tracking-tight">
              Gerador de Contratos
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    active && "bg-accent text-accent-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Button asChild size="sm" className="ml-auto sm:ml-0">
            <Link to="/novo">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Novo documento</span>
              <span className="sm:hidden">Novo</span>
            </Link>
          </Button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="no-print mt-16 border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-xs leading-relaxed text-muted-foreground sm:px-6">
          Os documentos gerados são modelos produzidos por inteligência artificial e não substituem a
          análise de um advogado ou profissional qualificado. Revise sempre o conteúdo antes de assinar.
        </div>
      </footer>

      <nav className="no-print sticky bottom-0 z-30 flex border-t border-border bg-background/95 backdrop-blur sm:hidden">
        {navItems.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground",
                active && "text-primary",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
