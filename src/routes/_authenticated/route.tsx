import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/gs/sidebar";
import { Topbar } from "@/components/gs/topbar";
import { ComposerModal } from "@/components/gs/composer-modal";
import { ComposerProvider } from "@/components/gs/composer-context";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <ComposerProvider>
      <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
        <Sidebar />
        <main className="ml-60 flex-1">
          <Topbar />
          <Outlet />
        </main>
      </div>
      <ComposerModal />
    </ComposerProvider>
  );
}
