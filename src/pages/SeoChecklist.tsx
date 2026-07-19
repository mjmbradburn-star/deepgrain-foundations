import { useEffect, useState } from "react";
import { PageMeta } from "@/components/seo/PageMeta";
import { BarkSection } from "@/components/ui/BarkSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "deepgrain.seo-checklist.v1";

type StepState = { step1: boolean; step2: boolean; step3: boolean };
const EMPTY: StepState = { step1: false, step2: false, step3: false };

interface CopyValue {
  label: string;
  value: string;
}

interface Step {
  id: keyof StepState;
  number: number;
  title: string;
  goal: string;
  actions: string[];
  link: { href: string; label: string };
  copies: CopyValue[];
  note?: string;
}

const STEPS: Step[] = [
  {
    id: "step1",
    number: 1,
    title: "Verify the domain in Search Console",
    goal: "Prove ownership of deepgrain.ai so GSC will show indexing data.",
    actions: [
      "Open Search Console and click Add property.",
      "Choose the Domain option (not URL prefix).",
      "Enter deepgrain.ai and copy the TXT record GSC generates.",
      "Add the TXT record at your DNS provider, then click Verify.",
    ],
    link: {
      href: "https://search.google.com/search-console/welcome",
      label: "Open Search Console",
    },
    copies: [{ label: "Domain", value: "deepgrain.ai" }],
    note: "DNS propagation can take a few minutes to a few hours. If Verify fails, wait and retry - don't delete the property.",
  },
  {
    id: "step2",
    number: 2,
    title: "Submit the sitemap",
    goal: "Tell Google where every canonical URL on the site lives.",
    actions: [
      "Open the verified deepgrain.ai property in Search Console.",
      "In the left nav, click Sitemaps.",
      "Paste the sitemap path and click Submit.",
      "Confirm the status reads 'Success'.",
    ],
    link: {
      href: "https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Adeepgrain.ai",
      label: "Open Sitemaps in Search Console",
    },
    copies: [
      { label: "Full URL", value: "https://www.deepgrain.ai/sitemap.xml" },
      { label: "Path only", value: "sitemap.xml" },
    ],
    note: "The sitemap is generated at build time and already served from /sitemap.xml - nothing to deploy, just submit.",
  },
  {
    id: "step3",
    number: 3,
    title: "Run URL Inspection on the homepage",
    goal: "Force Google to fetch and render the homepage now, confirm the prerendered HTML matches what Googlebot sees, and request indexing.",
    actions: [
      "In Search Console, paste the homepage URL into the top search bar.",
      "Wait for the inspection result, then click Test live URL.",
      "Click View tested page → Screenshot and HTML to confirm the rendered content includes the H1 and hero copy.",
      "Back on the inspection screen, click Request indexing.",
    ],
    link: {
      href: "https://search.google.com/search-console/inspect?resource_id=sc-domain%3Adeepgrain.ai&url=https%3A%2F%2Fdeepgrain.ai%2F",
      label: "Open URL Inspection",
    },
    copies: [{ label: "Homepage URL", value: "https://www.deepgrain.ai/" }],
    note: "The rendered HTML preview in URL Inspection is exactly what Google indexes - this is the definitive check that the site is crawlable.",
  },
];

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked - silent */
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center gap-2 rounded-full border border-cream/40 bg-transparent px-4 py-2 font-sans text-xs uppercase tracking-wider text-cream/90 transition-colors hover:border-brass hover:text-brass"
    >
      <span className="font-mono text-[11px] normal-case tracking-normal text-cream/70">
        {value}
      </span>
      <span className="text-[10px]">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
};

const StepCheckbox = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) => (
  <label className="inline-flex cursor-pointer items-center gap-3 select-none">
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span
      aria-hidden
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-sm border transition-colors",
        checked
          ? "border-brass bg-brass/20 text-brass"
          : "border-cream/50 text-transparent",
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M3 8.5l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <span className="font-sans text-xs uppercase tracking-wider text-cream/80">{label}</span>
  </label>
);

const SeoChecklist = () => {
  const [state, setState] = useState<StepState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StepState>;
        setState({ ...EMPTY, ...parsed });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const completed = Object.values(state).filter(Boolean).length;
  const toggle = (id: keyof StepState) => (next: boolean) =>
    setState((s) => ({ ...s, [id]: next }));
  const reset = () => setState(EMPTY);

  return (
    <>
      <PageMeta
        title="SEO Checklist - Deepgrain"
        description="Internal checklist for verifying deepgrain.ai in Google Search Console."
        path="/seo-checklist"
        noindex
      />
      <BarkSection
        data-no-rule
        className="py-24 md:py-32"
        contentClassName="container-grain"
      >
        <header className="max-w-2xl">
          <Eyebrow withRule>Operator tool</Eyebrow>
          <h1
            className="mt-4 font-display text-3xl md:text-5xl text-cream leading-[1.05]"
            style={{ letterSpacing: "-0.01em" }}
          >
            Search Console verification checklist.
          </h1>
          <p className="mt-6 font-sans text-base text-cream/80 leading-relaxed">
            Three steps to get deepgrain.ai verified, the sitemap submitted, and
            the homepage indexed. Progress is saved to this browser only.
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-brass">
            {completed} of {STEPS.length} complete
          </p>
        </header>

        <ol className="mt-14 space-y-6">
          {STEPS.map((step) => {
            const checked = state[step.id];
            return (
              <li
                key={step.id}
                className={cn(
                  "rounded-lg border border-cream/15 bg-cream/[0.04] p-8 md:p-10 transition-colors",
                  checked && "border-brass/40 bg-brass/[0.06]",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-sm text-brass">
                      {String(step.number).padStart(2, "0")}
                    </span>
                    <h2
                      className="font-display text-xl md:text-2xl text-cream leading-tight"
                      style={{ letterSpacing: "-0.005em" }}
                    >
                      {step.title}
                    </h2>
                  </div>
                  <StepCheckbox
                    checked={checked}
                    onChange={toggle(step.id)}
                    label={checked ? "Done" : "Mark done"}
                  />
                </div>

                <p className="mt-4 font-sans text-sm text-cream/75 leading-relaxed">
                  {step.goal}
                </p>

                <ol className="mt-6 space-y-2 list-decimal pl-5 font-sans text-sm text-cream/85 leading-relaxed marker:text-brass">
                  {step.actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ol>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <PillButton href={step.link.href} variant="filled" external>
                    {step.link.label} →
                  </PillButton>
                  {step.copies.map((c) => (
                    <CopyButton key={c.value} value={c.value} />
                  ))}
                </div>

                {step.note && (
                  <p className="mt-6 border-l-2 border-brass/50 pl-4 font-sans text-xs text-cream/65 leading-relaxed">
                    {step.note}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-12">
          <button
            type="button"
            onClick={reset}
            className="font-sans text-xs uppercase tracking-wider text-cream/60 hover:text-brass transition-colors"
          >
            Reset checklist
          </button>
        </div>
      </BarkSection>
    </>
  );
};

export default SeoChecklist;
