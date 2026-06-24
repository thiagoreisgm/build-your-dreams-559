import { useState } from "react";
import { Card, Field, Select, TextInput } from "./primitives";

export function PerfilTab() {
  const [name, setName] = useState("Thiago Reis");
  const [tz, setTz] = useState("GMT-3 Brasília");
  const [lang, setLang] = useState("Português (BR)");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card title="Identidade" hint="Como você aparece dentro do app">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-gold)]" />
          <div className="flex-1">
            <Field label="Nome">
              <TextInput value={name} onChange={setName} />
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
              value={tz}
              onChange={setTz}
              options={["GMT-3 Brasília", "GMT-2 Fernando de Noronha", "GMT-5 Acre"]}
            />
          </Field>
          <Field label="Idioma da interface">
            <Select value={lang} onChange={setLang} options={["Português (BR)", "English", "Español"]} />
          </Field>
        </div>
      </Card>

      <Card title="Aparência">
        <div className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] p-1">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-[13px] transition ${
                theme === t
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
    </div>
  );
}
