import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

function safeNext(raw: string | null): string {
  if (!raw) return "/";
  try {
    // Only allow same-origin relative paths.
    if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
    return raw;
  } catch {
    return "/";
  }
}

export default function Login() {
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // If already signed in, jump to the preserved destination.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace(next);
    });
  }, [next]);

  async function withEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fn = mode === "signin" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn.call(supabase.auth, {
      email,
      password,
      options: mode === "signup"
        ? { emailRedirectTo: `${window.location.origin}${next}` }
        : undefined,
    } as any);
    setBusy(false);
    if (error) return setError(error.message);
    window.location.replace(next);
  }

  async function withGoogle() {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/login?next=${encodeURIComponent(next)}`,
    });
    if (result.error) {
      setBusy(false);
      setError((result.error as Error).message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    window.location.replace(next);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-serif mb-2">Sign in</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Sign in to Deepgrain to connect an AI assistant to your account.
      </p>

      <button
        type="button"
        onClick={withGoogle}
        disabled={busy}
        className="w-full mb-6 rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={withEmail} className="space-y-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-foreground text-background px-4 py-2.5 text-sm font-medium"
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-4 text-xs text-muted-foreground underline"
      >
        {mode === "signin" ? "Create an account" : "I already have an account"}
      </button>
    </main>
  );
}
