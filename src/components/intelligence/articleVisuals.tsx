import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The Intelligence article visual component library.
 *
 * Seven static, no-JS components for use inside MDX article bodies
 * (see ARTICLE-BLUEPRINT.md section B for the full spec each one
 * implements). Every component here:
 *
 *   - renders with zero client interactivity (no hooks, no handlers) so it
 *     survives static prerender and never risks the invisible-content trap;
 *   - uses only Deepgrain design tokens (walnut / brass / cream / linen /
 *     green) via Tailwind, never a raw hex or an ad-hoc colour;
 *   - carries no shadow, no icon-in-a-tile, no full-radius pill, no
 *     gradient. Rectangular panels use the house `rounded-[4px]`;
 *   - uses the darker accent convention `text-[hsl(35,45%,30%)]` (not
 *     `text-brass`, which is too light at ~52% lightness) for any brass
 *     TEXT sitting on a light linen/cream surface, to hold WCAG AA
 *     contrast. Brass is still used at full token strength for decorative,
 *     non-text marks (rules, ticks, borders), where the stricter text
 *     contrast ratio does not apply.
 *
 * Registered once in mdxComponents.tsx so MDX article bodies can use each
 * by name with no per-article import.
 */

/** Darker brass reserved for TEXT on light surfaces (WCAG AA convention). */
const BRASS_TEXT = "text-[hsl(35,45%,30%)]";

/** Shared class applied to the optional `lg:-mx-16` break-out. */
const wideClass = (wide?: boolean) => (wide ? "lg:-mx-16" : "");

// ---------------------------------------------------------------------------
// B1. ProcessFlow - ordered stages with connecting geometry
// ---------------------------------------------------------------------------

export interface ProcessFlowStage {
  /** The stage name, e.g. "Read". */
  label: string;
  /** 1-2 sentences. Plain text. */
  body: string;
  /** Optional right-aligned tag, e.g. "2 weeks" or "Week 1". */
  meta?: string;
}

export interface ProcessFlowProps {
  /** 3 to 6 stages, in order. */
  stages: ProcessFlowStage[];
  /** Default true: shows 01/02/03 numerals. False: a brass tick instead. */
  ordered?: boolean;
}

/**
 * A sequence the reader executes, or that happens in order (Method,
 * a champion's first fortnight, pilot-to-production stages). Not for
 * unordered lists, use markdown `-` for those.
 */
export const ProcessFlow = ({ stages, ordered = true }: ProcessFlowProps) => (
  <div className="not-prose my-12 relative">
    {/* The connecting rail: a single 1px line running behind every numeral,
        starting and ending at the first/last numeral's centre so the rail
        never overshoots its own stages. */}
    <div
      aria-hidden
      className="absolute left-[19px] top-8 bottom-8 w-px bg-walnut/20"
    />
    <ol className="relative">
      {stages.map((stage, i) => (
        <li key={`${stage.label}-${i}`} className="flex gap-5 py-5">
          <div className="relative flex-none w-10 flex items-start justify-center">
            {/* The bg-linen inset makes the rail read as passing behind the
                numeral rather than a boxed timeline dot. */}
            <span className="relative z-10 bg-linen px-1">
              {ordered ? (
                <span className={cn("font-display text-2xl md:text-3xl leading-none", BRASS_TEXT)}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : (
                <span aria-hidden className="inline-block h-px w-3.5 translate-y-3 bg-brass/70" />
              )}
            </span>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            {stage.meta && (
              <div className="font-sans text-xs uppercase tracking-[0.14em] text-walnut/65 mb-1 md:float-right md:mb-0">
                {stage.meta}
              </div>
            )}
            <div className="font-display text-xl md:text-2xl text-walnut">{stage.label}</div>
            <p className="font-sans text-[17px] text-walnut/80 mt-1 leading-relaxed">{stage.body}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

// ---------------------------------------------------------------------------
// B2. StatBand - 2 to 4 proof numerals in a row
// ---------------------------------------------------------------------------

export interface Stat {
  /** "83", "70%", "£2,000", "0". Rendered in Cormorant. */
  value: string;
  /** Terse caption, "hours/week reclaimed". */
  label: string;
  /** Optional source/context, "defence tech engagement". */
  note?: string;
}

export interface StatBandProps {
  /** 2 to 4 stats. Only real, approved numbers. */
  stats: Stat[];
  /** Optional lg break-out. */
  wide?: boolean;
}

/**
 * A compact row of evidence numerals (approved proof points only). Never
 * pair with PullStat in the same article, one big-number moment per piece.
 */
export const StatBand = ({ stats, wide = false }: StatBandProps) => {
  const isOddLeftover = stats.length % 2 === 1;
  return (
    <div className={cn("not-prose my-12", wideClass(wide))}>
      <div className="border-y border-walnut/15 py-8">
        <div className="grid grid-cols-2 md:flex md:flex-row">
          {stats.map((stat, i) => {
            const isLastOddItem = isOddLeftover && i === stats.length - 1;
            return (
              <div
                key={`${stat.label}-${i}`}
                className={cn(
                  "flex-1 px-6 py-4 md:py-0 text-center",
                  isLastOddItem && "col-span-2",
                  // Mobile 2-col grid: vertical hairline within a row,
                  // horizontal hairline between stacked rows.
                  i % 2 === 1 && !isLastOddItem && "border-l border-walnut/15",
                  i >= 2 && "border-t border-walnut/15",
                  // md+: a single row, only a shared vertical hairline
                  // between adjacent cells (never a top rule).
                  "md:border-t-0",
                  i > 0 && "md:border-l md:border-walnut/15",
                )}
              >
                <div className="font-display text-5xl md:text-6xl text-walnut leading-none">{stat.value}</div>
                <div className="font-sans text-sm text-walnut/70 mt-2">{stat.label}</div>
                {stat.note && <div className="font-sans text-xs text-walnut/65 mt-1">{stat.note}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// B3. ComparePanel - two baseline-aligned columns
// ---------------------------------------------------------------------------

export interface ComparePanelSide {
  heading: string;
  items: string[];
}

export interface ComparePanelProps {
  a: ComparePanelSide;
  b: ComparePanelSide;
  /** Optional line under the panel. */
  caption?: string;
  wide?: boolean;
  /**
   * When true, side `a` reads as the affirmative/good side and its heading
   * rule uses brass instead of walnut. Default false (neutral comparison,
   * both sides walnut).
   */
  polarized?: boolean;
}

/**
 * Fixed literal grid-row utilities (never string-interpolated, so Tailwind's
 * static source scan can always see and generate them). Row 0 is the heading
 * pair; rows 1-6 cover the spec's "keep item counts <= 5 per side" ceiling
 * with one row of headroom. Indexing clamps into this range defensively.
 */
const COMPARE_ROW = [
  "md:[grid-row:1]",
  "md:[grid-row:2]",
  "md:[grid-row:3]",
  "md:[grid-row:4]",
  "md:[grid-row:5]",
  "md:[grid-row:6]",
  "md:[grid-row:7]",
];

/**
 * Two parallel columns whose rows share a single CSS grid track per index
 * (not two independent per-column grids), so a row's height is always the
 * taller of its A/B cells and nothing goes ragged when one side's copy wraps
 * to more lines than the other (the anti-slop ragged-comparison rule is the
 * entire reason this component exists). The shorter side is padded with
 * held empty slots, never collapsed.
 */
export const ComparePanel = ({ a, b, caption, wide = false, polarized = false }: ComparePanelProps) => {
  const rowCount = Math.max(a.items.length, b.items.length);
  const aRows = [...a.items, ...Array(rowCount - a.items.length).fill(null)];
  const bRows = [...b.items, ...Array(rowCount - b.items.length).fill(null)];
  const rowAt = (i: number) => COMPARE_ROW[Math.min(i, COMPARE_ROW.length - 1)];

  return (
    <div className={cn("not-prose my-12", wideClass(wide))}>
      {/* A single grid instance (not two nested ones) so column A's row i and
          column B's row i are the SAME grid row and size to the taller of
          the pair. Explicit grid-column/grid-row placement only kicks in at
          md+; below md there is no override, so items simply flow in DOM
          order (A block, then B block) into the single mobile column. */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
        <h4
          className={cn(
            "font-display text-xl text-walnut pt-4 border-t-2 md:[grid-column:1]",
            rowAt(0),
            polarized ? "border-brass/60" : "border-walnut/25",
          )}
        >
          {a.heading}
        </h4>
        {aRows.map((item, i) => (
          <div
            key={`a-${i}`}
            className={cn(
              "border-t border-walnut/10 py-3 min-h-[1px] md:[grid-column:1] md:border-r md:border-walnut/15 md:pr-8",
              rowAt(i + 1),
            )}
          >
            {item !== null && <p className="font-sans text-[16px] text-walnut/85">{item}</p>}
          </div>
        ))}
        {/* md:contents removes this wrapper from the box model at md+ so the
            heading itself becomes the direct grid item (row 1 / col 2);
            below md it stays a normal block, carrying the mobile-only
            divider (border-t + mt-8) between the stacked A and B blocks. */}
        <div className="mt-8 md:mt-0 border-t md:border-t-0 border-walnut/15 md:contents">
          <h4
            className={cn(
              "font-display text-xl text-walnut pt-4 border-t-2 border-walnut/25 md:[grid-column:2] md:pl-8",
              rowAt(0),
            )}
          >
            {b.heading}
          </h4>
        </div>
        {bRows.map((item, i) => (
          <div
            key={`b-${i}`}
            className={cn(
              "border-t border-walnut/10 py-3 min-h-[1px] md:[grid-column:2] md:pl-8",
              rowAt(i + 1),
            )}
          >
            {item !== null && <p className="font-sans text-[16px] text-walnut/85">{item}</p>}
          </div>
        ))}
      </div>
      {caption && <p className="font-sans text-sm text-walnut/65 mt-4">{caption}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------------
// B4. LayerStack - stacked architecture / capability layers
// ---------------------------------------------------------------------------

export interface Layer {
  /** "Foundations" */
  name: string;
  /** One sentence on what the layer holds. */
  body: string;
  /** Optional short marker, "Layer 1". */
  tag?: string;
}

export interface LayerStackProps {
  /** 3 to 6 layers, ordered top-of-array = top-of-stack. */
  layers: Layer[];
  /** Optional caption under the base, e.g. "the substrate". */
  baseLabel?: string;
}

/**
 * Fixed literal tone-ladder classes (never string-interpolated, so Tailwind's
 * static source scan can always see and generate them), darkest first. A
 * layer's tone is picked by its position along this ladder so a 4, 5 or
 * 6-layer stack still reads as a continuous "each higher band one hair
 * lighter" gradient, not three tone buckets with the middle bands collapsed
 * into an identical fill.
 */
const LAYER_TONE_LADDER = ["bg-cream/60", "bg-cream/48", "bg-cream/36", "bg-cream/24", "bg-cream/12", "bg-linen"];

/**
 * Horizontal bands stacked vertically for genuinely dependent layers (the
 * 4-layer People Ops AI Brain, readiness pillars, an operating ladder).
 * Elevation reads as tone, base darkest, each higher band a hair lighter,
 * never as a shadow.
 */
export const LayerStack = ({ layers, baseLabel }: LayerStackProps) => {
  const n = layers.length;
  return (
    <div className="not-prose my-12">
      <div className="flex flex-col-reverse gap-[2px]">
        {layers
          .slice()
          .reverse()
          .map((layer, reversedIndex) => {
            // reversedIndex 0 is the base (bottom of the visual stack).
            // Tone ladder: base sits on cream/60, each layer above steps
            // toward linen (lighter), so bg-linen at the top layer.
            const step = n <= 1 ? 0 : reversedIndex / (n - 1);
            const toneIndex = Math.round(step * (LAYER_TONE_LADDER.length - 1));
            const tone = LAYER_TONE_LADDER[toneIndex];
            return (
              <div
                key={`${layer.name}-${reversedIndex}`}
                className={cn("border border-walnut/15 rounded-[4px] px-6 py-5", tone)}
              >
                {layer.tag && (
                  <div className={cn("font-sans text-[11px] uppercase tracking-[0.16em] mb-1", BRASS_TEXT)}>
                    {layer.tag}
                  </div>
                )}
                <div className="font-display text-xl md:text-2xl text-walnut">{layer.name}</div>
                <p className="font-sans text-[16px] text-walnut/75 mt-1">{layer.body}</p>
              </div>
            );
          })}
      </div>
      {baseLabel && (
        <p className="font-display italic text-walnut/65 text-sm text-center mt-4">{baseLabel}</p>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// B5. DecisionFilter - a criteria checklist rendered as a scored filter
// ---------------------------------------------------------------------------

export interface Criterion {
  /** The question or criterion, "Who owns this workflow on Monday?" */
  test: string;
  /** Optional: what a bad answer looks like. */
  fail?: string;
}

export interface DecisionFilterProps {
  /** Optional heading. */
  title?: string;
  /** 3 to 6 criteria. */
  criteria: Criterion[];
  /** Optional closing line. */
  verdict?: string;
}

/**
 * A short set of criteria the reader runs against their own situation. The
 * tick beside each row is a static marker, not a checkbox (a checkbox here
 * would be a dead control, which the design law bans outright).
 */
export const DecisionFilter = ({ title, criteria, verdict }: DecisionFilterProps) => (
  <aside className="not-prose my-10 border-l-2 border-brass pl-6">
    {title && <h4 className="font-display text-xl text-walnut mb-4">{title}</h4>}
    <div className="space-y-4">
      {criteria.map((c, i) => (
        <div key={i} className="flex gap-3">
          <span aria-hidden className="mt-3 h-px w-3.5 flex-none bg-brass/70" />
          <div>
            <p className="font-sans text-[17px] text-walnut/90">{c.test}</p>
            {c.fail && (
              <p className="font-sans text-[15px] text-walnut/65 mt-1">
                <span className="font-display italic">Fails when:</span> {c.fail}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
    {verdict && (
      <p className="font-display italic text-walnut/70 text-lg mt-5 pt-4 border-t border-walnut/15">{verdict}</p>
    )}
  </aside>
);

// ---------------------------------------------------------------------------
// B6. FieldNote - a war-story / gotcha aside in a distinct register
// ---------------------------------------------------------------------------

export interface FieldNoteProps {
  /** Default "From the field". Alt: "The gotcha", "What broke". */
  label?: string;
  /** 1-3 short paragraphs of prose. */
  children: ReactNode;
}

/**
 * A named practical scar told in first-person, narrative register, distinct
 * from Takeaway (a summary pull) and DecisionFilter (a checklist). Reads as
 * a detached "inset island" that lifts by tone alone, never a shadow. Use
 * only with a real, specific story, never an invented client anecdote.
 */
export const FieldNote = ({ label = "From the field", children }: FieldNoteProps) => (
  <aside
    className="not-prose my-12 rounded-[4px] bg-cream/50 border border-walnut/12 px-6 py-6 md:px-9 md:py-8"
  >
    <div className={cn("font-sans text-[11px] uppercase tracking-[0.18em] mb-3", BRASS_TEXT)}>
      {label}
    </div>
    {/*
      MDX's plain-paragraph authoring pattern (the documented usage for this
      component) compiles each blank-line-separated line into a <p> using
      the SAME shared `p` override from mdxComponents.tsx, everywhere in the
      document, including inside a custom component's children. Without the
      `[&>p]:!...` overrides below, that global sans body-prose style wins
      over this div's own classes (the nested <p> sets its own explicit,
      conflicting font/size/colour), and FieldNote silently loses the
      distinct Cormorant "narrative register" voice the spec calls for.
    */}
    <div
      className={cn(
        "font-display text-[19px] md:text-[22px] leading-[1.5] text-walnut/85 space-y-4",
        "[&>p]:!font-display [&>p]:!text-[19px] md:[&>p]:!text-[22px] [&>p]:!leading-[1.5] [&>p]:!text-walnut/85 [&>p]:!mb-0",
      )}
    >
      {children}
    </div>
  </aside>
);

// ---------------------------------------------------------------------------
// B7. PullStat - one oversized numeral plus a full sentence
// ---------------------------------------------------------------------------

export interface PullStatProps {
  /** "0", "83", "£40k". Very large Cormorant. */
  value: string;
  /** Optional small unit beside the value, "hours/week". */
  unit?: string;
  /** The sentence that gives the number meaning. */
  children: ReactNode;
  wide?: boolean;
}

/**
 * One number carrying an argument, given room to breathe. Different job
 * from StatBand (a row of evidence): never used in the same article as
 * StatBand, only one big-number moment per piece.
 */
export const PullStat = ({ value, unit, children, wide = false }: PullStatProps) => (
  <div className={cn("not-prose my-14 border-t border-walnut/15 pt-8", wideClass(wide))}>
    <div className="flex items-baseline">
      <span className="font-display text-6xl md:text-8xl text-walnut leading-none">{value}</span>
      {unit && <span className="font-display text-xl md:text-2xl text-walnut/65 ml-3">{unit}</span>}
    </div>
    {/*
      A <div>, not a <p>: MDX's plain-sentence authoring pattern (the
      documented usage for this component) compiles the sentence into a <p>
      via the shared mdxComponents `p` override before it ever reaches this
      component as `children`, so wrapping it in another <p> here would nest
      a block <p> inside a <p>, which is invalid HTML5. The prerendered HTML
      parse auto-closes the outer <p> at the inner one's start tag, so React
      hydration would mismatch the server-rendered DOM. The `[&>p]:!...`
      overrides then force the nested <p> back into this component's own
      Cormorant-italic voice rather than the global sans body-prose style
      that <p> would otherwise carry.
    */}
    <div
      className={cn(
        "font-display italic text-xl md:text-3xl text-walnut/80 leading-snug mt-4 max-w-xl",
        "[&>p]:!font-display [&>p]:!italic [&>p]:!text-xl md:[&>p]:!text-3xl [&>p]:!text-walnut/80 [&>p]:!leading-snug [&>p]:!mb-0",
      )}
    >
      {children}
    </div>
  </div>
);
