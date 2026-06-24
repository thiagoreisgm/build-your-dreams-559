import type { ReactNode } from "react";

export function Card({
  title,
  hint,
  accent,
  children,
}: {
  title: string;
  hint?: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border bg-[var(--color-surface)] p-6 ${
        accent ? "border-[var(--color-orange)]/30" : "border-[var(--color-border)]"
      }`}
    >
      <h3
        className={`font-head mb-1 text-sm font-bold ${
          accent ? "text-[var(--color-orange)]" : ""
        }`}
      >
        {title}
      </h3>
      {hint && <p className="mb-3 text-xs text-[var(--color-muted)]">{hint}</p>}
      {children}
    </div>
  );
}

export function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[13px] transition ${
        active
          ? "border-[var(--color-orange)]/40 bg-[var(--color-orange)]/10 text-[var(--color-orange)]"
          : "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-sub)] hover:text-[var(--color-ink)]"
      }`}
    >
      {label}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] font-medium text-[var(--color-sub)]">{label}</div>
      {children}
      {hint && <div className="mt-1 text-[11px] text-[var(--color-muted)]">{hint}</div>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--color-faint)] disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--color-faint)]"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-[var(--color-elevated)]">
          {o}
        </option>
      ))}
    </select>
  );
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[var(--color-orange)]"
    />
  );
}
