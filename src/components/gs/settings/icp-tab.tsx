import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_ICP,
  ICP_PAINS,
  ICP_REGIONS,
  ICP_ROLES,
  ICP_SECTORS,
  ICP_SENIORITY,
  ICP_TRIGGERS,
  loadICP,
  saveICP,
  type ICPProfile,
} from "@/lib/gs-storage";
import { Card, Chip, Field, Slider, TextInput } from "./primitives";

function toggleIn<K extends keyof ICPProfile>(
  set: (u: (p: ICPProfile) => ICPProfile) => void,
  key: K,
  value: string,
) {
  set((p) => {
    const list = p[key] as unknown as string[];
    const s = new Set(list);
    if (s.has(value)) s.delete(value);
    else s.add(value);
    return { ...p, [key]: Array.from(s) } as ICPProfile;
  });
}

export function ICPTab() {
  const [icp, setIcp] = useState<ICPProfile>(DEFAULT_ICP);
  const [saved, setSaved] = useState<ICPProfile>(DEFAULT_ICP);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const p = loadICP();
    setIcp(p);
    setSaved(p);
  }, []);

  const dirty = useMemo(() => JSON.stringify(icp) !== JSON.stringify(saved), [icp, saved]);

  // Mock estimate: deriva contagem a partir dos pesos para parecer responsivo
  const matchEstimate = useMemo(() => {
    const base = 800;
    const variance =
      icp.weight_role_fit * 2 +
      icp.weight_company_fit * 1.5 +
      icp.weight_trigger * 3 +
      icp.weight_engagement * 1.2;
    return Math.round(base + variance);
  }, [icp]);

  function onSave() {
    saveICP(icp);
    setSaved(icp);
    setToast("ICP salvo");
    setTimeout(() => setToast(null), 1600);
  }

  function addChip(key: keyof ICPProfile, prompt: string) {
    const v = window.prompt(prompt)?.trim();
    if (!v) return;
    const list = icp[key] as unknown as string[];
    setIcp({ ...icp, [key]: [...list, v] } as ICPProfile);
  }

  return (
    <div>
      <p className="mb-6 text-sm text-[var(--color-sub)]">
        Define o cliente ideal. É o <span className="text-[var(--color-ink)]">motor de score</span>{" "}
        dos Sinais e o ângulo das mensagens — não é cadastro decorativo.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Empresa-alvo" hint="O perfil de empresa que você quer fechar">
          <Field label="Setores">
            <div className="flex flex-wrap gap-2">
              {ICP_SECTORS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  active={icp.target_sectors.includes(s)}
                  onClick={() => toggleIn(setIcp, "target_sectors", s)}
                />
              ))}
            </div>
          </Field>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={`Faturamento — faixa ${icp.revenue_range}`}>
              <Slider
                value={icp.revenue_range}
                onChange={(v) => setIcp({ ...icp, revenue_range: v })}
              />
            </Field>
            <Field label={`Funcionários — faixa ${icp.headcount_range}`}>
              <Slider
                value={icp.headcount_range}
                onChange={(v) => setIcp({ ...icp, headcount_range: v })}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Região">
              <div className="flex flex-wrap gap-2">
                {ICP_REGIONS.map((r) => (
                  <Chip
                    key={r}
                    label={r}
                    active={icp.regions.includes(r)}
                    onClick={() => toggleIn(setIcp, "regions", r)}
                  />
                ))}
              </div>
            </Field>
          </div>
        </Card>

        <Card title="Decisor / Persona" hint="Com quem você precisa falar">
          <Field label="Cargos-alvo">
            <div className="flex flex-wrap gap-2">
              {ICP_ROLES.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  active={icp.target_roles.includes(r)}
                  onClick={() => toggleIn(setIcp, "target_roles", r)}
                />
              ))}
            </div>
          </Field>
          <div className="mt-4">
            <Field label="Senioridade">
              <div className="flex flex-wrap gap-2">
                {ICP_SENIORITY.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    active={icp.seniority.includes(s)}
                    onClick={() => toggleIn(setIcp, "seniority", s)}
                  />
                ))}
              </div>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Palavras-chave de fit" hint="Aparecem na bio, descrição da vaga ou conteúdo do lead">
              <TextInput
                value={icp.fit_keywords}
                onChange={(v) => setIcp({ ...icp, fit_keywords: v })}
              />
            </Field>
          </div>
        </Card>

        <Card title="Dores & desafios" hint="O que o cliente sente — a IA ancora a abordagem">
          <div className="flex flex-wrap gap-2">
            {ICP_PAINS.map((p) => (
              <Chip
                key={p}
                label={p}
                active={icp.pains.includes(p)}
                onClick={() => toggleIn(setIcp, "pains", p)}
              />
            ))}
            <button
              type="button"
              onClick={() => addChip("pains", "Nova dor:")}
              className="cursor-pointer rounded-lg border border-dashed border-[var(--color-border)] px-3 py-1.5 text-[13px] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            >
              + adicionar
            </button>
          </div>
        </Card>

        <Card
          title="Gatilhos de compra"
          hint="Eventos de timing que SOBEM o score do sinal"
          accent
        >
          <div className="flex flex-wrap gap-2">
            {ICP_TRIGGERS.map((t) => (
              <Chip
                key={t}
                label={t}
                active={icp.buy_triggers.includes(t)}
                onClick={() => toggleIn(setIcp, "buy_triggers", t)}
              />
            ))}
          </div>
        </Card>

        <Card title="Qualificação GPCT/BANT" hint="Como você qualifica antes de avançar">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Orçamento (Budget)">
              <TextInput value={icp.qual_budget} onChange={(v) => setIcp({ ...icp, qual_budget: v })} />
            </Field>
            <Field label="Autoridade (Authority)">
              <TextInput
                value={icp.qual_authority}
                onChange={(v) => setIcp({ ...icp, qual_authority: v })}
              />
            </Field>
            <Field label="Necessidade (Need)">
              <TextInput value={icp.qual_need} onChange={(v) => setIcp({ ...icp, qual_need: v })} />
            </Field>
            <Field label="Timing">
              <TextInput value={icp.qual_timing} onChange={(v) => setIcp({ ...icp, qual_timing: v })} />
            </Field>
          </div>
        </Card>

        <Card
          title="Ângulo de abordagem"
          hint="Como você se posiciona — a IA escreve as mensagens a partir disto"
        >
          <textarea
            value={icp.approach_angle}
            onChange={(e) => setIcp({ ...icp, approach_angle: e.target.value })}
            className="h-28 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--color-faint)]"
          />
        </Card>

        <Card title="Peso do score" hint="Quanto cada critério pesa na classificação do lead">
          <div className="space-y-4">
            {(
              [
                ["weight_role_fit", "Fit de cargo"],
                ["weight_company_fit", "Fit de empresa"],
                ["weight_trigger", "Gatilho de compra"],
                ["weight_engagement", "Intensidade do engajamento"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[var(--color-sub)]">{label}</span>
                  <span className="text-[12px] text-[var(--color-orange)]">{icp[key]}</span>
                </div>
                <Slider value={icp[key]} onChange={(v) => setIcp({ ...icp, [key]: v })} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Exclusões" hint="Perfis que NÃO entram, mesmo com bom score">
          <div className="flex flex-wrap gap-2">
            {icp.exclusions.map((e) => (
              <Chip
                key={e}
                label={e}
                active
                onClick={() =>
                  setIcp({ ...icp, exclusions: icp.exclusions.filter((x) => x !== e) })
                }
              />
            ))}
            <button
              type="button"
              onClick={() => addChip("exclusions", "Excluir:")}
              className="cursor-pointer rounded-lg border border-dashed border-[var(--color-border)] px-3 py-1.5 text-[13px] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            >
              + adicionar
            </button>
          </div>
        </Card>
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--color-orange)]/25 bg-[var(--color-orange)]/5 p-5">
        <p className="text-[13px] text-[var(--color-sub)]">
          <span className="font-semibold text-[var(--color-ink)]">
            ~{matchEstimate.toLocaleString("pt-BR")} leads
          </span>{" "}
          na sua base batem com este ICP. O recálculo dos Sinais usa esses pesos como entrada.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        {toast && <span className="mr-2 text-xs text-[var(--color-gold)]">{toast}</span>}
        <button
          onClick={() => setIcp(saved)}
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
          Salvar ICP
        </button>
      </div>
    </div>
  );
}
