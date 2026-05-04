// scripts/apply-tldr-takeaways.mjs
// Inject TLDR + KeyTakeaways + updatedAt into the 19 remaining Deepgrain
// Intelligence articles. Each entry is keyed by slug. Script is idempotent:
// re-running it after the first pass is a no-op (it skips files already
// containing <TLDR>).
import { promises as fs } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const DIR = join(ROOT, "src/content/intelligence");
const UPDATED = "2026-05-04";

const ENTRIES = {
  "founder-mode-vs-operator-mode": {
    tldr: [
      "Founder-mode and operator-mode are postures, not identities. Treating them as identities is the source of most executive confusion.",
      "Founder-mode is high-context, low-process: chase the anomaly, override the system, push through. Operator-mode is high-process, low-context: trust the system, run the cadence.",
      "The job is knowing which posture the moment demands. Wrong posture, right intent, still wrong outcome.",
      "Most leaders default to one and call it character. The work is learning to switch on purpose.",
    ],
    takeaways: [
      "Pick the posture deliberately. Defaulting is the most common executive failure mode.",
      "Founder-mode in a scaling org breaks the system. Operator-mode in an early org starves it of speed.",
      "If you cannot describe what good looks like in both postures, you only run one.",
    ],
  },
  "hiring-for-the-grain": {
    tldr: [
      "Compounding teams have a shared grain. Coherence, not uniformity.",
      "The best hires read the grain quickly and add to it. The worst either fight it or surrender to it.",
      "Hiring against the grain because the resume is brilliant is the most expensive mistake operating leaders make.",
      "Grain fit is testable. Most interview loops do not test for it because it is harder than skills screening.",
    ],
    takeaways: [
      "Test grain fit explicitly: how does the candidate describe the last system they joined?",
      "A hire who reads the grain in week one outperforms a hire who tries to rewrite it in month one.",
      "Coherence compounds. Ten coherent hires beat fifteen brilliant strangers every time.",
    ],
  },
  "how-to-diagnose-an-organisation-in-30-days": {
    tldr: [
      "A 30-day diagnostic is the permission to do the work. It is not the work.",
      "Listen first. The temptation to recommend in week one is almost always wrong.",
      "Talk to the load-bearing people, not just the senior people. They are rarely the same set.",
      "The output is a shared diagnosis the leadership team can defend, not a slide deck of findings.",
      "Diagnose the operating reality, not the operating story. The story is what leadership believes. The reality is what happens on Tuesday.",
    ],
    takeaways: [
      "Spend two thirds of the 30 days listening, one third synthesising, and zero recommending until both are done.",
      "Premature recommendations cost you the trust the rest of the engagement runs on.",
      "The diagnostic is durable when the people inside the company can repeat it without you in the room.",
    ],
  },
  "operating-consultancy-for-ai-native-companies": {
    tldr: [
      "AI-native companies have a different grain because agents are part of the workforce from day one.",
      "The org chart needs a column for non-human operators, with the same clarity of ownership as a human role.",
      "AI-native is the cleanest case for an AI operating system by design: no legacy substrate to retrofit.",
      "The five pillars (data, tools, agents, governance, cadence) are built in from day one or they are not built at all.",
    ],
    takeaways: [
      "Treat agents as roles, not features. They have owners, KPIs, and review cadences.",
      "Governance is not a constraint on speed. It is the grammar that makes speed safe.",
      "Build the AI OS before the company can afford not to. Retrofitting it costs an order of magnitude more.",
    ],
  },
  "operating-consultancy-for-climate-ventures": {
    tldr: [
      "Climate ventures run on two clocks: the planetary timeline and the venture-fund clock.",
      "Both are non-negotiable, neither is patient. The operating challenge is holding them both.",
      "Most climate failures are operating failures dressed as scientific or market failures.",
      "The grain in climate is mission-led but capital-disciplined. Lose either and the venture goes sideways.",
    ],
    takeaways: [
      "Build a cadence that reports on planetary metrics and fund metrics in the same review, not separate ones.",
      "Operators who can hold mission and margin in the same sentence are the rarest hire in the sector.",
      "Pacing is the strategy. Slower than the planet allows is irresponsible. Faster than the unit economics allow is fatal.",
    ],
  },
  "operating-consultancy-for-defence-tech": {
    tldr: [
      "Defence tech has a dual mandate: warfighter outcomes and commercial scale.",
      "Mission and market do not optimise for the same thing. The operating system has to hold both.",
      "Procurement timelines and venture timelines are misaligned by design. Operators have to bridge them.",
      "The grain in defence tech is rigorous, classified, and slow on one side, fast and commercial on the other. Both are real.",
    ],
    takeaways: [
      "Stand up two cadences, not one: a programme cadence for the customer and a product cadence for the team.",
      "Hire operators who have lived inside the customer organisation. Translation is most of the work.",
      "Compliance is not a brake. It is the lane the venture is permitted to drive in.",
    ],
  },
  "operating-consultancy-for-financial-data": {
    tldr: [
      "In financial data the pipeline is the product. Everything else is interface.",
      "Treat the substrate as the product and the operating system maps cleanly. Treat the UI as the product and the substrate rots.",
      "Reliability is not a feature. It is the floor the entire business rests on.",
      "The grain is data engineering, governance, and customer trust, in that order. Most teams invert it.",
    ],
    takeaways: [
      "Reliability metrics belong in the executive review, not the engineering standup.",
      "If the pipeline owner cannot describe the business outcome it serves, the substrate will optimise for the wrong thing.",
      "Customer trust in financial data is rebuilt slowly and lost quickly. Operate accordingly.",
    ],
  },
  "operating-consultancy-for-transit-and-mobility": {
    tldr: [
      "Transit lives at the intersection of physical, digital, and civic. Three grains, one organisation.",
      "Hardware cadence is years. Software cadence is weeks. Public trust cadence is generations.",
      "The operating system has to hold all three rhythms without forcing one into another's tempo.",
      "Most transit failures are operating failures across the seam, not within any single domain.",
    ],
    takeaways: [
      "Design cadences that respect each grain. Forcing software speed into hardware decisions breaks both.",
      "Public trust is the slowest, most expensive, and most easily lost of the three. Treat it as the constraint.",
      "Operators who have worked across all three domains are the highest-leverage hires in the sector.",
    ],
  },
  "read-craft-scale-the-deepgrain-method": {
    tldr: [
      "Three movements, in order: Read, Craft, Scale.",
      "They are sequential, not parallel. They are also asymmetric in time: most of the work is in the reading.",
      "Skip Read and the rest is theatre. Skip Scale and the work does not compound.",
      "Read diagnoses operating reality. Craft designs interventions that fit the grain. Scale compounds the work without breaking it.",
    ],
    takeaways: [
      "Spend more time in Read than feels comfortable. The temptation to start crafting early costs the whole engagement.",
      "Craft is small by design. Big interventions are how teams break the grain they just learned to read.",
      "Scale is a pacing problem, not a rollout problem. Compound at the rate the organisation can absorb.",
    ],
  },
  "scaling-without-breaking-the-grain": {
    tldr: [
      "Scale amplifies what you already are. Including the bits you would rather it did not.",
      "Companies that scale well are the ones that scaled with the grain, not against it.",
      "Most scaling failures are not capacity failures. They are coherence failures.",
      "Process is what an organisation borrows when its grain is no longer enough on its own. Borrow late and badly and the grain breaks.",
    ],
    takeaways: [
      "Identify the load-bearing rituals before scaling. They are usually invisible and usually the first thing to break.",
      "Add process at the seam where the grain stops carrying the weight, not before.",
      "Scaling fast looks heroic in the moment and expensive in the year that follows. Pace is the discipline.",
    ],
  },
  "signals-of-operating-health": {
    tldr: [
      "Operating health does not show up first in the dashboard. It shows up in how an organisation talks about its own mistakes.",
      "Leading indicators are conversational, not quantitative. Listen for them.",
      "Healthy orgs surface bad news quickly, name it cleanly, and act on it. Unhealthy orgs do the reverse.",
      "Dashboards lag. Conversations lead.",
    ],
    takeaways: [
      "Audit the language used in standups and retros. The vocabulary is the diagnostic.",
      "If bad news only travels upward via the formal channel, you are missing most of the signal.",
      "Track the mean time from incident to public, honest write-up. It is the single best operating health metric.",
    ],
  },
  "strategy-vs-operating-reality": {
    tldr: [
      "Strategy is a story about the future. Operating reality is a description of the present.",
      "Most leadership teams confuse the two and end up with a wish dressed as a plan.",
      "A strategy that contradicts operating reality is not a strategy. It is a wish.",
      "The work is closing the gap between them, deliberately, in both directions.",
    ],
    takeaways: [
      "Read the operating reality first. Strategy that ignores it cannot be executed.",
      "If the strategy requires the organisation to be something it is not, fund the change explicitly. Otherwise, change the strategy.",
      "Strategy reviews should spend half the time on operating reality, not the future state.",
    ],
  },
  "the-art-of-the-operating-intervention": {
    tldr: [
      "An intervention is the smallest change that produces the largest second-order effect.",
      "The craft is in the smallness. Big interventions are usually a sign the diagnosis was wrong.",
      "The best interventions look small from the outside and feel enormous from the inside.",
      "Interventions that fit the grain compound. Interventions that fight it create new problems faster than they solve old ones.",
    ],
    takeaways: [
      "Aim for the lightest touch that moves the system. Heavier is rarely better.",
      "Test interventions against the grain before scaling. A good intervention amplifies what the organisation already does well.",
      "Document the intervention and the diagnosis together. Without the diagnosis, the intervention cannot be repeated.",
    ],
  },
  "the-craft-mindset-for-modern-operators": {
    tldr: [
      "Operating leadership is a craft. Crafts have masters, apprentices, tools, and standards.",
      "Most companies forget all four and call the result culture.",
      "A craft is not a hobby. It is a discipline with standards, taught in apprenticeship, judged by output.",
      "The craft mindset is the difference between an operator who runs the cadence and an operator who is the cadence.",
    ],
    takeaways: [
      "Treat operating as a craft to be taught, not a personality to be hired for.",
      "Apprentice your operators. Pair them with someone further down the path, on real work.",
      "Set the standards explicitly. Implicit standards drift; explicit standards compound.",
    ],
  },
  "the-grain-metaphor-reading-your-organisation": {
    tldr: [
      "Wood has a grain. So does every organisation.",
      "The grain is the pattern of how things actually move: which channels carry the real decisions, which meetings are theatre, which people are quietly load-bearing.",
      "Cut with the grain and the work compounds. Cut against it and you spend the rest of the year sanding.",
      "Reading the grain takes more time than most leaders think they have, and saves more time than they can imagine.",
      "A carpenter does not argue with wood. They read it first.",
    ],
    takeaways: [
      "Walk the floor. Read six months of retros. Sit in the standups. Most of the grain is invisible from the boardroom.",
      "Identify the load-bearing people. They are rarely on the org chart in the place you expect.",
      "Map the gap between the operating story and the operating reality. The gap is the engagement.",
    ],
  },
  "the-quiet-discipline-of-operating-leadership": {
    tldr: [
      "The best operating leaders are quiet on the outside and rigorous on the inside.",
      "Volume is misleading. Loud leadership is easy to spot and easy to imitate. Quiet leadership compounds.",
      "Quiet does not mean absent. It means the noise the leader makes is signal, not performance.",
      "The discipline shows up in cadence kept, decisions named, and follow-through that does not require an audience.",
    ],
    takeaways: [
      "Optimise for signal, not volume. The team you trust most is the one that hears you least often, but always for something real.",
      "Keep the cadence even when nothing dramatic is happening. The cadence is the discipline.",
      "Decisions made and not announced are still decisions. Sometimes the right ones.",
    ],
  },
  "what-ctos-get-wrong-about-scale": {
    tldr: [
      "Scale is rarely a technology problem. It is almost always an operating problem dressed up as a technology problem.",
      "The bottleneck is rarely the database. It is the decision graph above it.",
      "Re-platforming a system that the organisation cannot operate produces a faster system the organisation still cannot operate.",
      "CTOs who scale well work as much on the operating system around the technology as on the technology itself.",
    ],
    takeaways: [
      "Map the decision graph before re-platforming. Most scale problems live there.",
      "Treat operating habits, on-call rotations, and review cadences as part of the architecture.",
      "If the same incident pattern recurs after the rewrite, the technology was not the problem.",
    ],
  },
  "what-is-organisational-consultancy": {
    tldr: [
      "Organisational consultancy is the practice of reading how a company actually operates, then changing it without breaking what works.",
      "Most consulting sells answers. Organisational consultancy sells better questions and the discipline to live with the answers once they arrive.",
      "It is closer to craft than to strategy. You spend weeks listening before you touch anything.",
      "It is not change management, transformation programming, or a deck with three horizons.",
      "The three movements: Read, Craft, Scale.",
    ],
    takeaways: [
      "The grain, not the diagram. Every organisation has one. Most leadership teams have never read it.",
      "Listen first, recommend later. Premature recommendations break the engagement.",
      "Cut with the grain where you can, against it where you must, but always knowingly.",
    ],
  },
  "why-most-change-programmes-fail": {
    tldr: [
      "Roughly 70% of large change programmes fail to deliver what they promised.",
      "The reasons usually given (resistance, communication, sponsorship) are downstream of one upstream mistake: the change was designed against the operating story, not the operating reality.",
      "Three recurring patterns: cut against the grain, scale before craft, strategy as substitute for decision.",
      "The fix is not better change management. It is reading the grain before designing the cut.",
    ],
    takeaways: [
      "Diagnose the operating reality first. Designing a programme against the operating story guarantees rework.",
      "Resistance is information. It is usually telling you the programme missed something the operators on the ground know.",
      "Sponsorship matters, but no amount of sponsorship rescues a programme that cuts against the grain.",
    ],
  },
};

const fmt = (block) => block.map((b) => `- ${b}`).join("\n");

function patch(src, slug, entry) {
  if (src.includes("<TLDR>")) return src; // idempotent

  // 1. Insert updatedAt after publishedAt (if not already present).
  let next = src;
  if (!/updatedAt\s*:/.test(next)) {
    next = next.replace(
      /(publishedAt:\s*"[^"]+",\n)/,
      `$1  updatedAt: "${UPDATED}",\n`,
    );
  }

  // 2. Find the first non-frontmatter content line (after `};` of frontmatter
  //    and after `];` of faqs if present). Insert TLDR there.
  const tldrBlock = `<TLDR>\n${fmt(entry.tldr)}\n</TLDR>\n\n`;
  const keyBlock = `\n\n<KeyTakeaways>\n${fmt(entry.takeaways)}\n</KeyTakeaways>\n`;

  // Identify body start: end of last `};` or `];` in the export block.
  const fmEnd = next.indexOf("};\n");
  let bodyStart = fmEnd + 3;
  // If faqs export array is present, advance past `];` after it.
  const afterFm = next.slice(bodyStart);
  const faqsEnd = afterFm.match(/\n\];\n/);
  if (faqsEnd && /export\s+const\s+faqs\s*=\s*\[/.test(afterFm.slice(0, faqsEnd.index + 4))) {
    bodyStart += faqsEnd.index + faqsEnd[0].length;
  }

  // Skip leading blank lines in body.
  while (next[bodyStart] === "\n") bodyStart++;

  next = next.slice(0, bodyStart) + tldrBlock + next.slice(bodyStart);

  // 3. Append KeyTakeaways. Replace the placeholder line if present, else
  //    append at end. Drop the placeholder cleanly.
  if (next.includes("*This article is a placeholder scaffold. Full prose to follow.*")) {
    next = next.replace(
      /\*This article is a placeholder scaffold\. Full prose to follow\.\*\s*$/,
      keyBlock.trimStart(),
    );
  } else {
    next = next.replace(/\s*$/, "") + keyBlock;
  }

  return next;
}

let changed = 0;
for (const [slug, entry] of Object.entries(ENTRIES)) {
  const file = join(DIR, `${slug}.mdx`);
  const src = await fs.readFile(file, "utf8");
  const next = patch(src, slug, entry);
  if (next !== src) {
    await fs.writeFile(file, next);
    console.log(`patched ${slug}.mdx`);
    changed++;
  } else {
    console.log(`skipped ${slug}.mdx (already patched)`);
  }
}
console.log(`\n${changed}/${Object.keys(ENTRIES).length} files patched.`);
