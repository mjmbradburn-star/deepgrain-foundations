import { FAQ } from "@/components/sections/FAQ";
import { HOME_FAQ } from "@/data/homeFaq";

/**
 * Homepage FAQ. Data + JSON-LD live in `@/data/homeFaq` so the homepage
 * critical path can read HOME_FAQ_LD without pulling FAQ + mdxComponents
 * into the initial bundle. This component is lazy-loaded from Home.tsx.
 */
// Eyebrow left at FAQ's own default ("Common questions"): FAQ.tsx renders it
// unconditionally, and this is the page's second (and last) permitted
// eyebrow alongside the hero's "Built for the AI era" pill.
export const HomeFAQ = () => (
  <FAQ heading="What people ask before they hire me." items={HOME_FAQ} />
);

// Re-export so existing imports keep working during the transition.
export { HOME_FAQ, HOME_FAQ_LD } from "@/data/homeFaq";
