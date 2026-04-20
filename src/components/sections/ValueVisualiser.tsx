import { useState, useMemo } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Slider } from "@/components/ui/slider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const WORKING_WEEKS = 48;
const FTE_HOURS = 1800;
const RECLAIM_RATE = 0.6;

export const ValueVisualiser = () => {
  const [team, setTeam] = useState(25);
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(70);

  const { hoursReclaimed, fteFreed, annualValue, peopleUpskilled, totalHours, reclaimedPct } = useMemo(() => {
    const total = team * hours;
    const reclaimed = Math.round(total * RECLAIM_RATE);
    const fte = (reclaimed * WORKING_WEEKS) / FTE_HOURS;
    const value = reclaimed * WORKING_WEEKS * rate;
    return {
      totalHours: total,
      hoursReclaimed: reclaimed,
      fteFreed: Number(fte.toFixed(1)),
      annualValue: Math.round(value),
      peopleUpskilled: team,
      reclaimedPct: total > 0 ? (reclaimed / total) * 100 : 0,
    };
  }, [team, hours, rate]);

  return (
    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-5xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">A directional model</Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
            What might this be worth in your function?
          </h2>
          <p className="mt-6 max-w-2xl text-body/75 leading-relaxed text-lg">
            This is a partnership model, not a replacement one. Agents take the
            repeatable work; your people are coached to design, run, and extend
            them. Move the sliders to see what that shift could be worth in
            your function.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            {/* Sliders */}
            <div className="space-y-10">
              <SliderRow
                label="Team size"
                hint="People in the function"
                value={team}
                min={5}
                max={200}
                step={1}
                onChange={setTeam}
                display={`${team} people`}
              />
              <SliderRow
                label="Hours per week lost"
                hint="Per person, on coordination & repeatable work"
                value={hours}
                min={2}
                max={20}
                step={1}
                onChange={setHours}
                display={`${hours} hrs/week`}
              />
              <SliderRow
                label="Loaded hourly cost"
                hint="Salary plus on-costs, per person"
                value={rate}
                min={40}
                max={150}
                step={5}
                onChange={setRate}
                display={`£${rate}/hr`}
              />

              {/* Reclaim bar */}
              <div className="pt-4">
                <div className="flex items-baseline justify-between text-xs uppercase tracking-[0.18em] text-walnut/60 mb-3">
                  <span>Weekly capacity</span>
                  <span className="text-brass">
                    <AnimatedNumber value={Math.round(reclaimedPct)} live suffix="% reclaimed" />
                  </span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-walnut/15">
                  <div
                    className="h-full bg-brass transition-[width] duration-500 ease-out"
                    style={{ width: `${reclaimedPct}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-walnut/60">
                  {totalHours.toLocaleString("en-GB")} total hrs/week across the team
                </div>
              </div>
            </div>

            {/* Outputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-walnut/15 border border-walnut/15 rounded-2xl overflow-hidden">
              <Output label="People upskilled">
                <AnimatedNumber value={peopleUpskilled} live />
              </Output>
              <Output label="Hours/week reclaimed">
                <AnimatedNumber value={hoursReclaimed} live />
              </Output>
              <Output label="FTE freed for higher-judgment work">
                <AnimatedNumber value={fteFreed} live decimals={1} />
              </Output>
              <Output label="Annual value created">
                <AnimatedNumber value={annualValue} live prefix="£" />
              </Output>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-12 max-w-2xl text-sm text-body/60 italic leading-relaxed">
            Reclaimed hours go back to your people for higher-judgment work.
            This is a partnership model. Assumes ~60% of identified
            low-judgment hours are genuinely recoverable across a 48-week
            year. A directional model, not a quote. The actual number comes
            out of the diagnostic, usually within ten percent of this.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

interface SliderRowProps {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}

const SliderRow = ({ label, hint, value, min, max, step, onChange, display }: SliderRowProps) => (
  <div>
    <div className="flex items-baseline justify-between mb-2">
      <label className="font-display text-walnut text-xl">{label}</label>
      <span className="font-display text-brass text-xl tabular-nums">{display}</span>
    </div>
    <p className="text-sm text-body/60 mb-4">{hint}</p>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onChange(v[0])}
      aria-label={label}
    />
  </div>
);

const Output = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="bg-linen p-8">
    <div className="text-xs uppercase tracking-[0.18em] text-walnut/60 mb-3">{label}</div>
    <div className="font-display font-semibold text-walnut text-5xl md:text-6xl leading-none tabular-nums">
      {children}
    </div>
  </div>
);
