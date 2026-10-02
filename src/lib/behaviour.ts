/**
 * Anonymous buyer-intent signals for the cohort page. No email needed.
 *
 * Events (all via captureEvent, so production hosts only, and merged into the
 * person profile later if the visitor submits an email):
 *   scroll_depth       25 / 50 / 75 / 100, once each per page view
 *   section_viewed     a [data-ph-section] block was on screen for 3s+, once each
 *   pricing_card_click a click inside a [data-ph-plan] card that is not a checkout link
 *   pricing_card_hover a plan card was hovered or focused for 1.5s+ (desktop), once per plan
 *   checkout_started   already fired by src/lib/posthog.ts on Stripe link clicks
 *   exit_intent        fired by the overlay when it is about to show (see CohortOverlay)
 */
import { captureEvent } from "@/lib/posthog";

export function startCohortBehaviour(): () => void {
  const cleanups: Array<() => void> = [];
  const path = window.location.pathname;

  // Scroll depth
  const marks = [25, 50, 75, 100];
  const hit = new Set<number>();
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = (window.scrollY / max) * 100;
    for (const m of marks) {
      if (pct >= m - 1 && !hit.has(m)) {
        hit.add(m);
        captureEvent("scroll_depth", { depth: m, page_path: path });
      }
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener("scroll", onScroll));

  // Section dwell (3s of at least 40% visibility)
  const seen = new Set<string>();
  const timers = new Map<Element, number>();
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const name = (en.target as HTMLElement).dataset.phSection ?? "";
          if (!name || seen.has(name)) continue;
          if (en.isIntersecting) {
            timers.set(
              en.target,
              window.setTimeout(() => {
                seen.add(name);
                captureEvent("section_viewed", { section: name, page_path: path });
                io.unobserve(en.target);
              }, 3000),
            );
          } else {
            const t = timers.get(en.target);
            if (t) window.clearTimeout(t);
            timers.delete(en.target);
          }
        }
      },
      { threshold: 0.4 },
    );
    document.querySelectorAll("[data-ph-section]").forEach((el) => io.observe(el));
    cleanups.push(() => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    });
  }

  // Pricing card clicks and hover dwell
  const plans = new Set<string>();
  const hoverTimers = new Map<string, number>();
  const planOf = (t: EventTarget | null) =>
    (t as HTMLElement | null)?.closest?.("[data-ph-plan]") as HTMLElement | null;
  const onClick = (e: MouseEvent) => {
    const card = planOf(e.target);
    if (!card) return;
    const a = (e.target as HTMLElement).closest("a");
    if (a?.href.includes("stripe.com")) return; // checkout_started covers it
    captureEvent("pricing_card_click", { plan: card.dataset.phPlan, page_path: path });
  };
  const onEnter = (e: Event) => {
    const card = planOf(e.target);
    const plan = card?.dataset.phPlan;
    if (!plan || plans.has(plan) || hoverTimers.has(plan)) return;
    hoverTimers.set(
      plan,
      window.setTimeout(() => {
        plans.add(plan);
        captureEvent("pricing_card_hover", { plan, page_path: path });
      }, 1500),
    );
  };
  const onLeave = (e: Event) => {
    const plan = planOf(e.target)?.dataset.phPlan;
    if (!plan) return;
    const t = hoverTimers.get(plan);
    if (t) window.clearTimeout(t);
    hoverTimers.delete(plan);
  };
  document.addEventListener("click", onClick);
  document.addEventListener("mouseover", onEnter);
  document.addEventListener("mouseout", onLeave);
  document.addEventListener("focusin", onEnter);
  document.addEventListener("focusout", onLeave);
  cleanups.push(() => {
    document.removeEventListener("click", onClick);
    document.removeEventListener("mouseover", onEnter);
    document.removeEventListener("mouseout", onLeave);
    document.removeEventListener("focusin", onEnter);
    document.removeEventListener("focusout", onLeave);
    hoverTimers.forEach((t) => window.clearTimeout(t));
  });

  return () => cleanups.forEach((c) => c());
}
