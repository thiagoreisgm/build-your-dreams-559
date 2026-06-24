import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { DEFAULT_BILLING, loadBilling, saveBilling } from "@/lib/gs-storage";
import { Card, Field, TextInput } from "./primitives";

export function CobrancaTab() {
  const [email, setEmail] = useState(DEFAULT_BILLING.invoice_email);
  const [saved, setSaved] = useState(DEFAULT_BILLING.invoice_email);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const b = loadBilling();
    setEmail(b.invoice_email);
    setSaved(b.invoice_email);
  }, []);

  function onSave() {
    saveBilling({ invoice_email: email });
    setSaved(email);
    setToast("E-mail salvo");
    setTimeout(() => setToast(null), 1600);
  }

  const dirty = email !== saved;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card title="Plano atual">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[13px] text-[var(--color-sub)]">Você está no plano</div>
            <div className="font-head mt-1 text-xl font-bold">Criador</div>
            <div className="mt-1 text-[12px] text-[var(--color-muted)]">
              R$ 297/mês · próxima cobrança em 12/jul
            </div>
          </div>
          <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-orange)] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] hover:opacity-90">
            <Sparkles className="h-4 w-4" /> Fazer upgrade
          </button>
        </div>
      </Card>

      <Card title="E-mail para faturas">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Field label="E-mail">
              <TextInput value={email} onChange={setEmail} />
            </Field>
          </div>
          {toast && <span className="pb-3 text-xs text-[var(--color-gold)]">{toast}</span>}
          <button
            onClick={onSave}
            disabled={!dirty}
            className="cursor-pointer rounded-lg bg-[var(--color-orange)] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Salvar
          </button>
        </div>
      </Card>

      <Card title="Faturas e assinatura">
        <div className="flex flex-wrap gap-2">
          <button className="cursor-pointer rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-[13px] text-[var(--color-sub)] hover:text-[var(--color-ink)]">
            Ver faturas
          </button>
          <button className="cursor-pointer rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-[13px] text-red-400 hover:bg-red-500/5">
            Cancelar assinatura
          </button>
        </div>
      </Card>
    </div>
  );
}
