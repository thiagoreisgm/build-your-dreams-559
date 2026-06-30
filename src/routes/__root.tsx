import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "../integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-[var(--color-orange)]">404</h1>
        <h2 className="font-head mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-[var(--color-sub)]">
          O endereço que você buscou não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-orange)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-head text-xl font-semibold tracking-tight">Algo travou aqui</h1>
        <p className="mt-2 text-sm text-[var(--color-sub)]">
          Tente novamente ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-orange)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-elevated)]"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "postai — Conteúdo + Prospecção B2B no LinkedIn" },
      {
        name: "description",
        content:
          "postai: sistema operacional de conteúdo no LinkedIn + prospecção compliant para B2B brasileiro.",
      },
      { property: "og:title", content: "postai — Conteúdo + Prospecção B2B" },
      { property: "og:description", content: "Conteúdo e prospecção no LinkedIn, num só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "postai — Conteúdo + Prospecção B2B" },
      { name: "twitter:description", content: "Conteúdo e prospecção no LinkedIn, num só lugar." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
