import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  ALL_FORMATS,
  ALL_REF_LANGS,
  ALL_THEMES,
  DEFAULT_CONTENT_PROFILE,
  loadContentProfile,
  saveContentProfile,
  type ContentProfile,
} from "@/lib/gs-storage";
import { Card, Chip } from "./primitives";

export function ConteudoTab() {
  const [profile, setProfile] = useState<ContentProfile>(DEFAULT_CONTENT_PROFILE);
  const [saved, setSaved] = useState<ContentProfile>(DEFAULT_CONTENT_PROFILE);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const p = loadContentProfile();
    setProfile(p);
    setSaved(p);
  }, []);

  const dirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(saved), [profile, saved]);

  function toggle<K extends "themes" | "formats" | "reference_languages">(key: K, value: string) {
    setProfile((p) => {
      const set = new Set(p[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...p, [key]: Array.from(set) };
    });
  }

  function freedomLabel(v: number) {
    if (v < 33) return "Conservador";
    if (v > 66) return "Ousado";
    return "Equilibrado";
  }

  function onSave() {
    saveContentProfile(profile);
    setSaved(profile);
    setToast("Perfil salvo");
    setTimeout(() => setToast(null), 1600);
  }

  return (
    <div>
      <p className="mb-6 text-sm text-[var(--color-sub)]">
        Calibra a IA e a busca de inspiração. Diferente do{" "}
        <span className="text-[var(--color-ink)]">ICP</span> (a quem você vende), aqui é{" "}
        <span className="text-[var(--color-ink)]">o que você posta</span>.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Você escreve em" hint="Idioma de saída dos seus posts">
          <input
            value={profile.output_language}
            onChange={(e) => setProfile({ ...profile, output_language: e.target.value })}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--color-faint)]"
          />
        </Card>
        <Card title="Você atua em" hint="Sua indústria">
          <input
            value={profile.industry}
            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--color-faint)]"
          />
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Você é" hint="Como você se descreve">
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="h-20 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--color-faint)]"
          />
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Temas que você posta" hint="Alimenta a busca de inspiração">
          <div className="flex flex-wrap gap-2">
            {ALL_THEMES.map((t) => (
              <Chip
                key={t}
                label={t}
                active={profile.themes.includes(t)}
                onClick={() => toggle("themes", t)}
              />
            ))}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-1.5 text-[13px] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            >
              <Plus className="h-3.5 w-3.5" /> adicionar
            </button>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card title="Formatos de referência" hint="Estrutura que a IA deve imitar" accent>
          <div className="flex flex-wrap gap-2">
            {ALL_FORMATS.map((f) => (
              <Chip
                key={f}
                label={f}
                active={profile.formats.includes(f)}
                onClick={() => toggle("formats", f)}
              />
            ))}
          </div>
        </Card>
        <Card title="Criadores de referência" hint="Perfis cujo conteúdo serve de base">
          <input
            value={profile.reference_handles}
            onChange={(e) => setProfile({ ...profile, reference_handles: e.target.value })}
            placeholder="@handle1, @handle2"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--color-faint)]"
          />
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Idioma das referências">
          <div className="flex flex-wrap gap-2">
            {ALL_REF_LANGS.map((l) => (
              <Chip
                key={l}
                label={l}
                active={profile.reference_languages.includes(l)}
                onClick={() => toggle("reference_languages", l)}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            Posts em inglês aparecem com opção de traduzir e adaptar pro seu Voice.
          </p>
        </Card>
      </div>

      <div className="mt-5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-head text-sm font-bold">Liberdade criativa da IA</h3>
            <span className="text-xs text-[var(--color-orange)]">
              {freedomLabel(profile.creative_freedom)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={profile.creative_freedom}
            onChange={(e) =>
              setProfile({ ...profile, creative_freedom: Number(e.target.value) })
            }
            className="w-full accent-[var(--color-orange)]"
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--color-muted)]">
            <span>Conservador</span>
            <span>Ousado</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        {toast && <span className="mr-2 text-xs text-[var(--color-gold)]">{toast}</span>}
        <button
          onClick={() => setProfile(saved)}
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
