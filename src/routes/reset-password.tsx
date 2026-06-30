import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { translateAuthError } from "@/routes/auth";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir senha — postai" },
      { name: "description", content: "Crie uma nova senha para sua conta postai." },
    ],
  }),
  component: ResetPasswordPage,
});

type PasswordCheck = {
  label: string;
  ok: boolean;
};

function evaluatePassword(pwd: string): {
  checks: PasswordCheck[];
  score: number;
  strength: "fraca" | "média" | "forte";
  valid: boolean;
  firstError: string | null;
} {
  const checks: PasswordCheck[] = [
    { label: "Pelo menos 8 caracteres", ok: pwd.length >= 8 },
    { label: "Uma letra maiúscula (A-Z)", ok: /[A-Z]/.test(pwd) },
    { label: "Uma letra minúscula (a-z)", ok: /[a-z]/.test(pwd) },
    { label: "Um número (0-9)", ok: /\d/.test(pwd) },
    { label: "Um caractere especial (!@#$…)", ok: /[^A-Za-z0-9]/.test(pwd) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const strength = score <= 2 ? "fraca" : score <= 4 ? "média" : "forte";
  const firstFail = checks.find((c) => !c.ok);
  // Exige todos os 5 requisitos para considerar válida
  const valid = score === checks.length;
  return {
    checks,
    score,
    strength,
    valid,
    firstError: firstFail ? `A senha não atende aos requisitos: ${firstFail.label.toLowerCase()}.` : null,
  };
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const evaluation = evaluatePassword(password);

  // O Supabase processa o token de recuperação automaticamente (detectSessionInUrl).
  // Aguardamos o onAuthStateChange para confirmar que existe uma sessão de recovery.
  useEffect(() => {
    let mounted = true;
    const sub = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setHasRecoverySession(true);
      }
    });
    // Fallback: se o link já foi consumido e a sessão existe, libera o form.
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) setHasRecoverySession(true);
      setReady(true);
    });
    return () => {
      mounted = false;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!evaluation.valid) {
      setError(evaluation.firstError ?? "A senha não atende aos requisitos mínimos.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/" }), 1500);
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 text-[var(--color-ink)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <div className="font-display flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-orange)] text-[13px] text-[var(--color-bg)]">
            GS
          </div>
          <span className="font-head text-xl font-bold tracking-tight">postai</span>
        </div>

        <h1 className="font-head text-2xl font-bold tracking-tight">Criar nova senha</h1>
        <p className="mt-1 text-sm text-[var(--color-sub)]">
          Escolha uma senha forte com letras maiúsculas, minúsculas, número e símbolo.
        </p>

        {!ready ? (
          <p className="mt-6 flex items-center gap-2 text-sm text-[var(--color-sub)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Validando link…
          </p>
        ) : !hasRecoverySession ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              Este link de redefinição expirou ou já foi utilizado. Solicite um novo.
            </p>
            <Link
              to="/auth"
              className="inline-block cursor-pointer text-[13px] font-semibold text-[var(--color-orange)] hover:underline"
            >
              ← Voltar e pedir novo link
            </Link>
          </div>
        ) : done ? (
          <p className="mt-6 rounded-md border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-3 py-2 text-xs text-[var(--color-orange)]">
            Senha atualizada com sucesso. Redirecionando…
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input
              type="password"
              required
              minLength={8}
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--color-faint)] focus:border-[var(--color-orange)]"
            />

            {password.length > 0 && (
              <div className="space-y-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div
                      className={`h-full transition-all ${
                        evaluation.strength === "fraca"
                          ? "w-1/3 bg-red-500"
                          : evaluation.strength === "média"
                            ? "w-2/3 bg-yellow-500"
                            : "w-full bg-[var(--color-orange)]"
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-medium capitalize text-[var(--color-sub)]">
                    {evaluation.strength}
                  </span>
                </div>
                <ul className="space-y-1">
                  {evaluation.checks.map((c) => (
                    <li
                      key={c.label}
                      className={`flex items-center gap-1.5 text-[11px] ${
                        c.ok ? "text-[var(--color-orange)]" : "text-[var(--color-faint)]"
                      }`}
                    >
                      <span>{c.ok ? "✓" : "○"}</span>
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <input
              type="password"
              required
              minLength={8}
              placeholder="Confirmar nova senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--color-faint)] focus:border-[var(--color-orange)]"
            />

            {error && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--color-orange)] px-4 py-2.5 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar nova senha
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-[11px] text-[var(--color-faint)]">
          <Link to="/auth" className="hover:text-[var(--color-sub)]">
            ← Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
