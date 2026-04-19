import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PillButton } from "@/components/ui/PillButton";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(200),
  email: z.string().trim().email("Please add a valid email").max(320),
  organisation: z.string().trim().max(200).optional().or(z.literal("")),
  size: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Tell us a little about what's going on").max(5000),
});

type FormState = z.infer<typeof schema>;

const inputClass =
  "w-full bg-transparent border-0 border-b border-cream/30 focus:border-cream/80 focus:outline-none py-3 text-cream placeholder:text-cream/40 font-sans text-base transition-colors";
const labelClass = "block text-cream/70 text-[11px] uppercase tracking-[0.15em] mb-1";

export const ContactForm = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    organisation: "",
    size: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

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
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-12">
        <p className="font-display italic text-cream text-3xl md:text-4xl">
          Thank you. We'll be in touch.
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
          <input id="size" value={form.size} onChange={update("size")} placeholder="e.g. 50–200" className={inputClass} maxLength={50} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="message">What's on your mind?</label>
        <textarea
          id="message"
          value={form.message}
          onChange={update("message")}
          rows={5}
          required
          maxLength={5000}
          className={inputClass + " resize-none"}
        />
      </div>
      <div className="pt-4">
        <PillButton type="submit" variant="filled" disabled={submitting}>
          {submitting ? "Sending…" : "Send →"}
        </PillButton>
      </div>
    </form>
  );
};
