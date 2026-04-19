import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Eyebrow } from "@/components/ui/Eyebrow";

type State =
  | { kind: "loading" }
  | { kind: "valid" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "error"; message: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } },
        );
        const data = await res.json();
        if (data.valid === true) setState({ kind: "valid" });
        else if (data.reason === "already_unsubscribed") setState({ kind: "already" });
        else setState({ kind: "invalid" });
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error) {
      setState({ kind: "error", message: "Something went wrong. Please try again." });
      return;
    }
    if (data?.success || data?.reason === "already_unsubscribed") {
      setState({ kind: "done" });
    } else {
      setState({ kind: "error", message: "Could not process your request." });
    }
  };

  return (
    <>
      <Helmet>
        <title>Unsubscribe — Deepgrain</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <section className="bg-linen min-h-screen pt-40 pb-32">
        <div className="container-grain max-w-2xl">
          <Eyebrow className="text-walnut/60 mb-6">Email preferences</Eyebrow>

          {state.kind === "loading" && (
            <p className="text-walnut/70 font-display text-2xl">Checking your link…</p>
          )}

          {state.kind === "valid" && (
            <>
              <h1
                className="font-display text-walnut text-4xl md:text-6xl leading-[1.05] mb-6"
                style={{ letterSpacing: "-0.01em" }}
              >
                Unsubscribe from Deepgrain.
              </h1>
              <p className="text-walnut/75 leading-relaxed mb-10 max-w-xl">
                Confirm below and we'll remove you from all future Deepgrain
                dispatches. You can resubscribe at any time.
              </p>
              <button
                onClick={confirm}
                className="font-sans uppercase text-[11px] px-8 py-4 rounded-full border border-walnut text-walnut hover:bg-walnut hover:text-cream transition-colors"
                style={{ letterSpacing: "0.16em" }}
              >
                Confirm unsubscribe
              </button>
            </>
          )}

          {state.kind === "submitting" && (
            <p className="text-walnut/70 font-display text-2xl">Processing…</p>
          )}

          {state.kind === "done" && (
            <>
              <h1
                className="font-display text-walnut text-4xl md:text-6xl leading-[1.05] mb-6"
                style={{ letterSpacing: "-0.01em" }}
              >
                You've been unsubscribed.
              </h1>
              <p className="text-walnut/70 leading-relaxed max-w-xl">
                You won't receive further emails from Deepgrain. Thank you for
                the time you spent with us.
              </p>
            </>
          )}

          {state.kind === "already" && (
            <>
              <h1
                className="font-display text-walnut text-4xl md:text-6xl leading-[1.05] mb-6"
                style={{ letterSpacing: "-0.01em" }}
              >
                Already unsubscribed.
              </h1>
              <p className="text-walnut/70 leading-relaxed max-w-xl">
                This email address is already removed from our list. Nothing
                more to do.
              </p>
            </>
          )}

          {state.kind === "invalid" && (
            <>
              <h1
                className="font-display text-walnut text-4xl md:text-6xl leading-[1.05] mb-6"
                style={{ letterSpacing: "-0.01em" }}
              >
                Link is invalid or expired.
              </h1>
              <p className="text-walnut/70 leading-relaxed max-w-xl">
                If you'd like to unsubscribe, please reply to any Deepgrain
                email and we'll remove you manually.
              </p>
            </>
          )}

          {state.kind === "error" && (
            <>
              <h1 className="font-display text-walnut text-4xl mb-6">
                Something went wrong.
              </h1>
              <p className="text-walnut/70">{state.message}</p>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Unsubscribe;
