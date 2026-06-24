import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutGrid,
  PencilLine,
  TrendingUp,
  Calendar,
  Activity,
  Zap,
  Send,
  Filter,
  Users,
  Link2,
  Target,
  FileText,
  Star,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOpenComposer } from "./composer-context";

type Item = { to: string; label: string; icon: LucideIcon; badge?: string };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Conteúdo",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutGrid },
      { to: "/posts-virais", label: "Posts Virais", icon: TrendingUp },
      { to: "/salvos", label: "Salvos", icon: Star },
      { to: "/planejamento", label: "Planejamento", icon: Calendar },
    ],
  },
  {
    title: "Pipeline",
    items: [
      { to: "/sinais", label: "Sinais", icon: Activity },
      { to: "/cadencias", label: "Cadências", icon: Zap },
      { to: "/revisar", label: "Revisar & Enviar", icon: Send, badge: "7" },
      { to: "/funil", label: "Funil", icon: Filter },
      { to: "/leads", label: "Leads", icon: Users },
    ],
  },
  {
    title: "Configurações",
    items: [
      { to: "/conteudo", label: "Conteúdo", icon: FileText },
      { to: "/icp", label: "ICP", icon: Target },
      { to: "/integracoes", label: "Integrações", icon: Link2 },
    ],
  },
];

export function Sidebar() {
  const openComposer = useOpenComposer();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const name =
        (u.user_metadata?.full_name as string | undefined) ??
        (u.user_metadata?.name as string | undefined) ??
        u.email?.split("@")[0] ??
        "Usuário";
      setUser({ name, email: u.email ?? "" });
    });
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <aside className="fixed top-0 left-0 z-20 flex h-screen w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex h-16 items-center gap-2.5 border-b border-[var(--color-border)] px-5">
        <div className="font-display flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-orange)] text-[11px] text-[var(--color-bg)]">
          GS
        </div>
        <span className="font-head text-[17px] font-bold tracking-tight">GS One</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <div className="mb-5 px-3">
          <button
            onClick={openComposer}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-orange)] px-4 py-2.5 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-orange)] focus-visible:outline-none"
          >
            <PencilLine className="h-[18px] w-[18px]" strokeWidth={2} />
            Escrever
          </button>
        </div>

        {groups.map((g, gi) => (
          <div key={g.title} className={gi === 0 ? "" : "mt-6"}>
            <p className="mb-2 px-6 text-[10px] tracking-[0.15em] text-[var(--color-faint)] uppercase">
              {g.title}
            </p>
            {g.items.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex w-full cursor-pointer items-center gap-3 border-l-2 py-2.5 pr-4 pl-6 text-sm transition ${
                    active
                      ? "border-[var(--color-orange)] bg-[var(--color-surface)] text-[var(--color-orange)]"
                      : "border-transparent text-[var(--color-sub)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-[var(--color-orange)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-orange)]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-[var(--color-border)] px-5 py-4">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-gold)]" />
        <div className="text-xs leading-tight">
          <div className="font-semibold">Thiago Reis</div>
          <div className="text-[var(--color-muted)]">9.999 créditos</div>
        </div>
      </div>
    </aside>
  );
}
