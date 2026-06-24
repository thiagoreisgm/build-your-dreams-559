import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar — GS One" },
      { name: "description", content: "Acesse sua conta GS One." },
    ],
  }),
  component: AuthPage,
});

function translateAuthError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const msg = raw.toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials"))
    return "E-mail ou senha incorretos.";
  if (msg.includes("password should be at least") || msg.includes("password is too short"))
    return "A senha precisa ter pelo menos 6 caracteres.";
  if (msg.includes("password") && msg.includes("weak"))
    return "Senha muito fraca. Use letras, números e ao menos 8 caracteres.";
  if (msg.includes("user already registered") || msg.includes("already registered"))
    return "Já existe uma conta com esse e-mail. Faça login.";
  if (msg.includes("email not confirmed"))
    return "Confirme seu e-mail antes de entrar.";
  if (msg.includes("user not found"))
    return "Não encontramos uma conta com esse e-mail.";
  if (msg.includes("same password"))
    return "A nova senha precisa ser diferente da anterior.";
  if (msg.includes("invalid email")) return "E-mail inválido.";
  if (msg.includes("rate limit") || msg.includes("too many") || msg.includes("for security purposes"))
    return "Muitas tentativas. Tente novamente em alguns minutos.";
  if (msg.includes("network") || msg.includes("failed to fetch"))
    return "Falha de conexão. Verifique sua internet e tente de novo.";
  return raw || "Erro ao autenticar.";
}

export { translateAuthError };

function AuthPage() {
  const { redirect: redirectParam } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Only allow same-origin internal paths to avoid open-redirect.
  function safeRedirect(raw: string | undefined): string {
    if (!raw) return "/";
    try {
      const url = new URL(raw, window.location.origin);
      if (url.origin !== window.location.origin) return "/";
      if (url.pathname === "/auth") return "/";
      return url.pathname + url.search + url.hash;
    } catch {
      return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.replace(safeRedirect(redirectParam));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setInfo("Enviamos um link de redefinição para o seu e-mail. Confira a caixa de entrada (e o spam).");
        return;
      }
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + safeRedirect(redirectParam),
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      window.location.replace(safeRedirect(redirectParam));
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + safeRedirect(redirectParam),
      });
      if (result.error) {
        setError(result.error.message ?? "Erro com Google");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      window.location.replace(safeRedirect(redirectParam));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro com Google");
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
          <span className="font-head text-xl font-bold tracking-tight">GS One</span>
        </div>

        <h1 className="font-head text-2xl font-bold tracking-tight">
          {mode === "signin"
            ? "Entrar na sua conta"
            : mode === "signup"
              ? "Criar sua conta"
              : "Redefinir senha"}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-sub)]">
          {mode === "signin"
            ? "Bem-vindo de volta."
            : mode === "signup"
              ? "Configure seu loop em minutos."
              : "Informe seu e-mail e enviaremos um link para criar uma nova senha."}
        </p>

        {mode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--color-elevated)] disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.8 0 19.5-7.8 19.5-19.5 0-1.2-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-1.8 13.6-4.9l-6.3-5.2c-2 1.5-4.5 2.4-7.3 2.4-5.3 0-9.7-3.1-11.3-7.4l-6.5 5C9.6 39 16.2 43.5 24 43.5z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.3 5.2c-.4.4 7-5.1 7-14.6 0-1.2-.1-2.3-.4-3.5z" />
              </svg>
              Continuar com Google
            </button>

            <div className="my-5 flex items-center gap-3 text-[11px] tracking-[0.15em] text-[var(--color-faint)] uppercase">
              <div className="h-px flex-1 bg-[var(--color-border)]" />
              ou
              <div className="h-px flex-1 bg-[var(--color-border)]" />
            </div>
          </>
        )}

        <form onSubmit={handleEmail} className={`space-y-3 ${mode === "forgot" ? "mt-6" : ""}`}>
          {mode === "signup" && (
            <input
              type="text"
              required
              placeholder="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--color-faint)] focus:border-[var(--color-orange)]"
            />
          )}
          <input
            type="email"
            required
            placeholder="email@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--color-faint)] focus:border-[var(--color-orange)]"
          />
          {mode !== "forgot" && (
            <input
              type="password"
              required
              minLength={6}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--color-faint)] focus:border-[var(--color-orange)]"
            />
          )}

          {mode === "signin" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                  setInfo(null);
                }}
                className="cursor-pointer text-xs text-[var(--color-sub)] hover:text-[var(--color-orange)]"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          {error && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-md border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/10 px-3 py-2 text-xs text-[var(--color-orange)]">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--color-orange)] px-4 py-2.5 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link de redefinição"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--color-sub)]">
          {mode === "forgot" ? (
            <>
              Lembrou a senha?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setInfo(null);
                }}
                className="cursor-pointer font-semibold text-[var(--color-orange)] hover:underline"
              >
                Voltar para o login
              </button>
            </>
          ) : (
            <>
              {mode === "signin" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                  setInfo(null);
                }}
                className="cursor-pointer font-semibold text-[var(--color-orange)] hover:underline"
              >
                {mode === "signin" ? "Criar conta" : "Entrar"}
              </button>
            </>
          )}
        </p>

        <p className="mt-4 text-center text-[11px] text-[var(--color-faint)]">
          <Link to="/" className="hover:text-[var(--color-sub)]">
            ← Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  );
}
