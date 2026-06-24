import { useEffect, useMemo, useState } from "react";
import { DEFAULT_ACCOUNT, loadAccount, saveAccount, type AccountProfile } from "@/lib/gs-storage";
import { Card, Field, Select, TextInput } from "./primitives";

export function PerfilTab() {
  const [acc, setAcc] = useState<AccountProfile>(DEFAULT_ACCOUNT);
  const [saved, setSaved] = useState<AccountProfile>(DEFAULT_ACCOUNT);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const a = loadAccount();
    setAcc(a);
    setSaved(a);
  }, []);

  const dirty = useMemo(() => JSON.stringify(acc) !== JSON.stringify(saved), [acc, saved]);

  function onSave() {
    saveAccount(acc);
    setSaved(acc);
    setToast("Perfil salvo");
    setTimeout(() => setToast(null), 1600);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card title="Identidade" hint="Como você aparece dentro do app">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-gold)]" />
          <div className="flex-1">
            <Field label="Nome">
              <TextInput value={acc.name} onChange={(v) => setAcc({ ...acc, name: v })} />
            </Field>
          </div>
          <button
            type="button"
            className="cursor-pointer self-end rounded-lg border border-[var(--color-border)] px-3 py-2 text-[12px] text-[var(--color-sub)] hover:text-[var(--color-ink)]"
          >
            Editar foto
          </button>
        </div>
      </Card>

      <Card title="E-mail de login">
        <Field
          label="E-mail"
          hint="Fale com o suporte para alterar — é o identificador da sua conta."
        >
          <TextInput value="thiago@growthmachine.com.br" disabled />
        </Field>
      </Card>

      <Card title="Preferências regionais">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fuso horário">
            <Select
              value={acc.timezone}
              onChange={(v) => setAcc({ ...acc, timezone: v })}
              options={["GMT-3 Brasília", "GMT-2 Fernando de Noronha", "GMT-5 Acre"]}
            />
          </Field>
          <Field label="Idioma da interface">
            <Select
              value={acc.language}
              onChange={(v) => setAcc({ ...acc, language: v })}
              options={["Português (BR)", "English", "Español"]}
            />
          </Field>
        </div>
      </Card>

      <Card title="Aparência">
        <div className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-1">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAcc({ ...acc, theme: t })}
              className={`cursor-pointer rounded-lg px-4 py-2 text-[13px] transition ${
                acc.theme === t
                  ? "bg-[var(--color-orange)] text-[var(--color-bg)]"
                  : "text-[var(--color-sub)] hover:text-[var(--color-ink)]"
              }`}
            >
              {t === "dark" ? "Escuro" : "Claro"}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-[var(--color-muted)]">
          Modo claro chega em breve. Por ora o app é otimizado para o tema escuro.
        </p>
      </Card>

      <div className="flex items-center justify-end gap-2">
        {toast && <span className="mr-2 text-xs text-[var(--color-gold)]">{toast}</span>}
        <button
          onClick={() => setAcc(saved)}
          disabled={!dirty}
          className="cursor-pointer rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-[13px] text-[var(--color-sub)] transition hover:border-[var(--color-faint)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Descartar
        </button>
        <button
          onClick={onSave}
          disabled={!dirty}
          className="cursor-pointer rounded-lg bg-[var(--color-orange)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
