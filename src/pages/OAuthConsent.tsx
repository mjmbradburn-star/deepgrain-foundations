import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// The `supabase.auth.oauth` namespace is beta; add a minimal typed wrapper so
// TypeScript sees the three methods we call.
type OAuthDetails = {
  redirect_url?: string;
  redirect_to?: string;
  client?: { name?: string; client_id?: string; redirect_uri?: string };
  scope?: string;
  scopes?: string[];
};
type OAuthResp = { data: OAuthDetails | null; error: { message: string } | null };
const oauth = (supabase.auth as any).oauth as {
  getAuthorizationDetails: (id: string) => Promise<OAuthResp>;
  approveAuthorization: (id: string) => Promise<OAuthResp>;
  denyAuthorization: (id: string) => Promise<OAuthResp>;
};

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<OAuthDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const here = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(here);
        return;
      }
      if (!oauth?.getAuthorizationDetails) {
        setError("OAuth server not available in this Supabase client build.");
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })().catch((e) => setError(e instanceof Error ? e.message : String(e)));
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("The authorization server did not return a redirect URL.");
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-2xl font-serif mb-2">Authorization error</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
      </main>
    );
  }
  if (!details) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <p className="text-sm text-muted-foreground">Loading authorization request…</p>
      </main>
    );
  }

  const clientName = details.client?.name ?? "an application";
  const scopes = details.scopes ?? (details.scope ? details.scope.split(/\s+/) : []);

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-2xl font-serif mb-3">Connect {clientName} to Deepgrain</h1>
      <p className="text-sm mb-6">
        {clientName} will be able to call Deepgrain's MCP tools while you are signed in.
      </p>
      {scopes.length > 0 && (
        <div className="mb-6 rounded-md border border-border p-4 text-sm">
          <p className="font-medium mb-2">Requested access</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {scopes.includes("openid") && <li>Confirm your Deepgrain identity</li>}
            {scopes.includes("email") && <li>Share your email address</li>}
            {scopes.includes("profile") && <li>Share your basic profile</li>}
            {scopes
              .filter((s) => !["openid", "email", "profile"].includes(s))
              .map((s) => (
                <li key={s}>Additional permission requested: {s}</li>
              ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-muted-foreground mb-6">
        This does not bypass Deepgrain's permissions or backend policies.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => decide(true)}
          className="flex-1 rounded-md bg-foreground text-background px-4 py-2.5 text-sm font-medium"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => decide(false)}
          className="flex-1 rounded-md border border-border px-4 py-2.5 text-sm"
        >
          Cancel connection
        </button>
      </div>
    </main>
  );
}
