import type { ReactNode } from "react";

export function GSPage({ subtitle, children }: { subtitle?: ReactNode; children: ReactNode }) {
  return (
    <div className="gs-view max-w-[1180px] px-10 py-9">
      {subtitle && <p className="mb-8 text-sm text-[var(--color-sub)]">{subtitle}</p>}
      {children}
    </div>
  );
}

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="gs-view mx-auto max-w-[1180px] px-10 py-20">
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
        <h2 className="font-head text-xl font-bold">{title}</h2>
        <p className="mt-3 text-sm text-[var(--color-sub)]">
          Tela em construção — vem nos próximos prompts incrementais.
        </p>
      </div>
    </div>
  );
}
