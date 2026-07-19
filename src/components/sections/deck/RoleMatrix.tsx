import { Reveal } from "@/components/ui/Reveal";

const cells = [
  {
    row: "Value creator",
    col: "High",
    title: "Amplify",
    body: "Builders. Automate the routine off their desk so they do more of what only they can do.",
    accent: true,
  },
  {
    row: "Value creator",
    col: "Low",
    title: "Protect",
    body: "Senior judgement, founder relationships. Leave alone. That call stays human.",
  },
  {
    row: "Enabler",
    col: "High",
    title: "Re-architect",
    body: "Coordination, scheduling, follow-up. Agents do this well. Redesign the role around what is left.",
    accent: true,
  },
  {
    row: "Enabler",
    col: "Low",
    title: "Reframe",
    body: "Trusted-advisor work. Slow change. Keep the human, surface better information underneath.",
  },
  {
    row: "Protector",
    col: "High",
    title: "Automate, audit",
    body: "Compliance checks, policy queries, control evidence. High ROI, requires governance.",
    accent: true,
  },
  {
    row: "Protector",
    col: "Low",
    title: "Keep human",
    body: "Investigations, judgement calls, escalations. Agents brief. People decide and own.",
  },
];

/**
 * Enablement page, ported from deck slide 14. Two-by-three matrix
 * (role type × automation potential) that says clearly where to push
 * and where to leave the work alone.
 */
export const RoleMatrix = () => (
  <section className="bg-cream text-walnut section-pad">
    <div className="container-grain">
      <Reveal>
        <h2 className="font-display text-walnut text-4xl md:text-6xl leading-[1.05] max-w-3xl">
          Not every role automates. Most have a piece that should.
        </h2>
        <p className="mt-6 max-w-2xl text-walnut/75 text-lg leading-relaxed">
          Cross the role type with the automation potential of the clicks inside it. Six honest
          answers, no slogans.
        </p>
        <div className="mt-6 h-px w-full bg-brass/40 max-w-3xl" />
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-14 overflow-x-auto">
          <div className="min-w-[720px] grid grid-cols-[180px_1fr_1fr] gap-3">
            <div />
            <div
              className="font-sans uppercase text-brass text-center pb-3"
              style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
            >
              ↑ High automation potential
            </div>
            <div
              className="font-sans uppercase text-walnut/55 text-center pb-3"
              style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
            >
              ↓ Low automation potential
            </div>

            {["Value creator", "Enabler", "Protector"].map((role) => (
              <div key={role} className="contents">
                <div className="flex items-center font-display text-walnut text-xl pr-4 border-r border-walnut/15">
                  {role}
                </div>
                {cells
                  .filter((c) => c.row === role)
                  .map((c) => (
                    <div
                      key={`${c.row}-${c.col}`}
                      className={
                        c.accent
                          ? "rounded-xl bg-brass/[0.08] p-5"
                          : "rounded-xl border border-walnut/15 bg-cream p-5"
                      }
                    >
                      <div
                        className="font-sans uppercase text-brass mb-2"
                        style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
                      >
                        {c.title}
                      </div>
                      <p className="text-walnut/80 leading-relaxed text-sm">{c.body}</p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
