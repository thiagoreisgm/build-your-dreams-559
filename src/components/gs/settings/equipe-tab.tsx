import { UserPlus } from "lucide-react";

const MEMBERS = [
  { name: "Thiago Reis", email: "thiago@growthmachine.com.br", role: "Admin", status: "Ativo" },
  { name: "Ana Carolina Gama", email: "ana@growthmachine.com.br", role: "Editor", status: "Ativo" },
];

export function EquipeTab() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-sub)]">
          Convide pessoas para colaborar — cada uma com função e permissões próprias.
        </p>
        <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-orange)] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] hover:opacity-90">
          <UserPlus className="h-4 w-4" /> Convidar membro
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-[var(--color-elevated)] text-[11px] tracking-[0.12em] text-[var(--color-muted)] uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">Membro</th>
              <th className="px-5 py-3 font-medium">Função</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {MEMBERS.map((m, i) => (
              <tr
                key={m.email}
                className={i > 0 ? "border-t border-[var(--color-border)]" : ""}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-gold)]" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{m.name}</div>
                      <div className="truncate text-[12px] text-[var(--color-muted)]">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[var(--color-sub)]">{m.role}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    {m.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="cursor-pointer text-[12px] text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                    Gerenciar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
