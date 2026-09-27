import { useCallback, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { cn } from "@/lib/utils";

/**
 * Reviews left publicly by alumni on Maven for the predecessor course,
 * AI Powered People Ops. Quotes verbatim; names, roles and companies as
 * listed on the public review cards. Headshots from those same cards.
 */
const REVIEWS = [
  {
    name: "Lydia",
    role: "People Lead",
    company: "Nous",
    img: "/testimonials/lydia.jpg",
    quote:
      "An excellent course for anyone grappling with the implications of AI in the context of HR and People Operations, filled with lots of practical tips (from prompt creation and custom GPTs through to guardrails and guidance about AI safety and due dilligence). Great introduction to the concept of 'People As a Product Function' and how AI can help embed the key principles of that. Matt is a great course leader with encyclopaedic knowledge, who is very generous with his tips and tricks. Highly recommended - my only wish is it could have been longer.",
  },
  {
    name: "Lucy",
    role: "Senior Talent + People Partner",
    company: "Seatfrog",
    img: "/testimonials/lucy.jpg",
    quote:
      "This was a rapid dive into the power of AI and how it can change both your ways of thinking and operating. The course material was super helpful and crafted my understanding of what I was aiming for; where the AI layer scaffolds the People function and adds the most value. Since this course I've started experimenting with Lovable to build dashboards and self serve workflows that remove admin heavy processes around onboarding and offboarding.",
  },
  {
    name: "Lot",
    role: "Director - People & Culture",
    company: "Lendable",
    img: "/testimonials/lot.jpg",
    quote:
      "Matt has a remarkable ability to break down everything AI can offer for People Operations (and far beyond). Learning from an expert like him gives you a fresh perspective on how AI is reshaping the world of work. The key is to take what you learn, apply it, and make meaningful changes that create real impact in your own environment. Thank you Matt, this was wonderful.",
  },
  {
    name: "Beverley",
    role: "Senior People Operations Specialist",
    company: "TestGorilla",
    img: "/testimonials/beverley.jpg",
    quote:
      "An impactful five weeks with Matt Bradburn! His knowledge and creativity are a breath of fresh air. He managed to cut through the noise and give us clear points of focus when it comes to AI and how to strategically leverage it to amplify our people processes and programs.",
  },
  {
    name: "Gillian",
    role: "Senior People Operations Specialist",
    company: "Motorway Online Limited",
    img: "/testimonials/gillian.jpg",
    quote:
      "Matt's knowledge and insight is invaluable. I now feel more confident and well equipped to move forward in using AI to drive real scalable improvements to how we work as a people team.",
  },
] as const;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = REVIEWS.length;
  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );
  const r = REVIEWS[index];

  return (
    <section className="relative bg-bark text-cream overflow-hidden" data-no-rule aria-label="Alumni reviews">
      <BarkGrain />
      <div className="relative z-10 container-grain section-pad">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p
              className="font-sans font-semibold uppercase text-brass/80"
              style={{ fontSize: "11px", letterSpacing: "0.22em" }}
            >
              Public Maven reviews
            </p>
            <h2
              className="font-display font-semibold max-w-2xl mt-6"
              style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              What the last cohorts said
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-mono text-sm text-cream/60 tabular-nums" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/25 text-cream/80 transition-colors hover:border-brass hover:text-brass"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next review"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/25 text-cream/80 transition-colors hover:border-brass hover:text-brass"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/15 pt-10 md:pt-14">
          <div className="flex gap-1.5 text-brass" aria-label="Rated 5 out of 5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} strokeWidth={0} fill="currentColor" aria-hidden />
            ))}
          </div>
          <blockquote className="mt-6 max-w-4xl min-h-[200px] md:min-h-[220px]">
            <p className="font-display text-cream leading-snug" style={{ fontSize: "clamp(22px, 2.6vw, 34px)" }}>
              {r.quote}
            </p>
          </blockquote>

          <div className="mt-10 flex items-center gap-5">
            <img
              src={r.img}
              alt={`Headshot of ${r.name}`}
              width={64}
              height={64}
              loading="lazy"
              className="h-16 w-16 rounded-full object-cover ring-1 ring-brass/60"
            />
            <div>
              <p className="font-display text-xl text-cream">{r.name}</p>
              <p className="text-cream/60 text-[15px] mt-0.5">
                {r.role} · {r.company}
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2.5">
            {REVIEWS.map((rev, i) => (
              <button
                key={rev.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show review ${i + 1} of ${count}`}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === index ? "w-10 bg-brass" : "w-4 bg-cream/25 hover:bg-cream/45",
                )}
              />
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-cream/50 text-sm leading-relaxed">
            Reviews left publicly on Maven for the predecessor course, AI Powered People Ops.
          </p>
        </div>
      </div>
    </section>
  );
}
