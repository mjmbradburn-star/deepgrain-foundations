import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PillButton } from "@/components/ui/PillButton";
import { useToast } from "@/hooks/use-toast";
import { trackFormSubmit } from "@/lib/analytics";

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(200),
  email: z.string().trim().email("Please add a valid email").max(320),
  organisation: z.string().trim().max(200).optional().or(z.literal("")),
  size: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Tell me what's going on").max(5000),
});

type FormState = z.infer<typeof schema>;

const inputClass =
  "w-full bg-transparent border-0 border-b border-cream/30 focus:border-cream/80 focus:outline-none py-3 text-cream placeholder:text-cream/40 font-sans text-base transition-colors";
const labelClass = "block text-cream/70 text-[11px] uppercase tracking-[0.15em] mb-1";

/** Hard cap on prefill length - generous, but stops anyone using ?subject= as
 *  a stuffing vector for arbitrary content into our enquiries table. */
const PREFILL_MAX = 500;

export const ContactForm = () => {
  const [params] = useSearchParams();
  // Read `?subject=` once on mount. We deliberately don't react to later changes
  // - once the user is in the form, they own the textarea.
  const initialMessage = useRef(
    (params.get("subject") ?? "").slice(0, PREFILL_MAX),
  ).current;

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    organisation: "",
    size: "",
    message: initialMessage,
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // When arriving via a prefill link, focus the message field so it's obvious
  // the form is ready and the user can edit before sending.
  useEffect(() => {
    if (initialMessage && messageRef.current) {
      messageRef.current.focus();
      messageRef.current.setSelectionRange(
        initialMessage.length,
        initialMessage.length,
      );
    }
  }, [initialMessage]);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Almost there",
        description: parsed.error.issues[0]?.message ?? "Please review the form",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      organisation: parsed.data.organisation || null,
      size: parsed.data.size || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again, or email matt@deepgrain.ai directly.",
        variant: "destructive",
      });
      return;
    }
    trackFormSubmit("contact", {
      has_organisation: Boolean(parsed.data.organisation),
      has_size: Boolean(parsed.data.size),
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-12">
        <p className="font-display italic text-cream text-3xl md:text-4xl">
          Got it. I'll reply directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8 max-w-xl mx-auto text-left" noValidate>
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label className={labelClass} htmlFor="name">Name</label>
          <input id="name" value={form.name} onChange={update("name")} className={inputClass} required maxLength={200} />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={update("email")} className={inputClass} required maxLength={320} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label className={labelClass} htmlFor="organisation">Organisation</label>
          <input id="organisation" value={form.organisation} onChange={update("organisation")} className={inputClass} maxLength={200} />
        </div>
        <div>
          <label className={labelClass} htmlFor="size">Team size</label>
          <input id="size" value={form.size} onChange={update("size")} placeholder="e.g. 50-200" className={inputClass} maxLength={50} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="message">What are you trying to fix?</label>
        <textarea
          id="message"
          ref={messageRef}
          value={form.message}
          onChange={update("message")}
          rows={5}
          required
          maxLength={5000}
          className={inputClass + " resize-none"}
        />
      </div>
      <div className="pt-4 space-y-4">
        <p className="text-xs text-cream/50 leading-relaxed">
          By sending this you agree to the{" "}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-cream transition-colors">
            Privacy Policy
          </Link>
          . I'll only use your details to reply.
        </p>
        <PillButton type="submit" variant="filled" disabled={submitting}>
          {submitting ? "Sending…" : "Send note →"}
        </PillButton>
      </div>
    </form>
  );
};
