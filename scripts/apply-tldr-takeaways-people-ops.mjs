// scripts/apply-tldr-takeaways-people-ops.mjs
// Inject TLDR + KeyTakeaways + updatedAt into every People Ops track article.
// Mirrors scripts/apply-tldr-takeaways.mjs but targets the people-ops subdir.
// Idempotent: skips files that already contain <TLDR>.
import { promises as fs } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const DIR = join(ROOT, "src/content/intelligence/people-ops");
const UPDATED = "2026-05-04";

const ENTRIES = {
  "ai-enablement-operating-model": {
    tldr: [
      "AI enablement is not training. It is an operating model with owners, cadences, and budget.",
      "The People function is uniquely placed to run it because enablement is half-skills, half-systems.",
      "Most enablement programmes stall because they are run as events, not as a function.",
      "Treat enablement like any other operating capability: roadmap, ownership, review.",
    ],
    takeaways: [
      "Name a single owner. Diffuse ownership is the default failure mode.",
      "Run enablement on a quarterly cadence with a published roadmap.",
      "Measure adoption and capability separately. Both lag, both matter.",
    ],
  },
  "ai-governance-for-people-teams": {
    tldr: [
      "AI governance is not the brake. It is the steering.",
      "People teams are usually the first asked to write the AI policy and the last given the time to do it well.",
      "Good governance is a small set of clear rules, escalation paths, and audit trails. Not a 40-page document nobody reads.",
      "The work is making the right thing the easy thing.",
    ],
    takeaways: [
      "Write rules people can quote from memory. If they cannot, the rules do not exist.",
      "Bake governance into the workspace, not into a separate review step.",
      "Audit-trail the high-risk decisions. Trust the rest.",
    ],
  },
  "ai-policy-blueprint-for-people-teams": {
    tldr: [
      "A working AI policy is short, specific, and written from the inside of the work.",
      "Most policies fail by being generic. They list principles instead of decisions.",
      "Cover four things: what is allowed, what is logged, what is escalated, what is forbidden.",
      "Update it on a cadence. A policy without revisions is a policy that has stopped being read.",
    ],
    takeaways: [
      "Skip the principles section. Lead with concrete decisions.",
      "Pair every rule with the workflow it governs. Otherwise it floats.",
      "Schedule the next review when you publish the current version.",
    ],
  },
  "ai-roadmap-case-study-finedge": {
    tldr: [
      "FinEdge built an AI roadmap by reading the operating reality of its People function first.",
      "The roadmap was not a list of tools. It was a sequence of capability shifts tied to operating outcomes.",
      "Six months in, adoption was high because the work was designed around the team, not the tool.",
      "The case is a pattern, not a template. Read your own grain before borrowing the shape.",
    ],
    takeaways: [
      "Sequence by absorption capacity, not by tool readiness.",
      "Tie every roadmap item to an operating outcome you can name on a Friday.",
      "Resist the demo-led roadmap. It optimises the vendor's pipeline, not yours.",
    ],
  },
  "automation-audit-playbook": {
    tldr: [
      "An automation audit is a structured read of where work hides, repeats, or breaks.",
      "Most People functions have more automation surface than they realise and worse hygiene than they admit.",
      "The audit produces three things: a candidate list, a risk register, and a sequencing call.",
      "Run it before you build, not after the third tool has been bought.",
    ],
    takeaways: [
      "Look for repetition, latency, and rework. The leverage lives at those seams.",
      "Audit existing automations as ruthlessly as you audit new candidates.",
      "Sequence by value and absorption together. High-value low-absorption is the trap.",
    ],
  },
  "automation-patterns-that-pay-off": {
    tldr: [
      "A small number of automation patterns recur across People functions and pay back reliably.",
      "Drafting, summarisation, structured extraction, and routing. That is most of the value.",
      "Bespoke agents are seductive and rarely the right first move.",
      "Pay-off is a function of how cleanly the workflow was designed, not how clever the model was.",
    ],
    takeaways: [
      "Start with the four boring patterns. They cover most of the surface.",
      "Design the workflow before you choose the model. Workflow shape determines value.",
      "Track time-to-value, not headline savings. Slow wins are still wins.",
    ],
  },
  "choosing-ai-models-for-hr-work": {
    tldr: [
      "Model choice matters less than most teams think and more than most vendors will admit.",
      "For the bulk of People work, the frontier general models are fine. Pick by trust, latency, and price.",
      "Specialist models earn their place at the edges: long-context document review, sensitive comms, structured extraction.",
      "Re-evaluate every six months. The cost-quality curve moves quarterly.",
    ],
    takeaways: [
      "Default to one general model across the function. Reduce decision overhead.",
      "Use specialist models only where the workflow demands it.",
      "Bake re-evaluation into the cadence. The market moves whether you do or not.",
    ],
  },
  "coaching-and-feedback-systems": {
    tldr: [
      "AI is changing the substrate of coaching and feedback faster than most People teams have noticed.",
      "Used well, it gives every manager a thinking partner. Used badly, it replaces conversations that should never have been outsourced.",
      "The line is judgment. AI for prep, structure, and synthesis. Humans for the moment itself.",
      "Feedback systems are an operating system, not a tool category.",
    ],
    takeaways: [
      "Use AI for the work around the conversation, never the conversation itself.",
      "Train managers to use the tool well before scaling it.",
      "Audit for cases where AI is replacing a moment that needed a person.",
    ],
  },
  "designing-the-ai-native-people-team": {
    tldr: [
      "An AI-native People team has different roles, different ratios, and a different operating cadence.",
      "Agents are part of the workforce. Treat them as roles with owners and KPIs.",
      "The team is smaller and more senior, with builder DNA in every seat.",
      "Designing for AI-native is a posture, not a headcount exercise.",
    ],
    takeaways: [
      "Hire builders, not administrators. The substrate changed.",
      "Give agents owners. Without an owner, the agent rots.",
      "Design the cadence for a smaller, more senior team. Old rituals will not fit.",
    ],
  },
  "designing-values-that-stick": {
    tldr: [
      "Values stick when they are written in the language of decisions, not the language of posters.",
      "Most values fail because they are aspirational nouns that do not survive contact with a hard call.",
      "The test: can someone use the value to make a contested decision out loud?",
      "Values are a tool of the operating system, not a marketing artefact.",
    ],
    takeaways: [
      "Write each value as a decision rule, not a noun.",
      "Stress-test values against real recent decisions. If they do not bite, rewrite them.",
      "Revisit annually. Values that never change have probably stopped working.",
    ],
  },
  "diagnosing-ai-readiness-in-people-ops": {
    tldr: [
      "AI readiness in People Ops is not a model question. It is an operating question.",
      "Five surfaces decide it: data, tools, agents, governance, cadence.",
      "Most teams overrate their tools and underrate their data and cadence.",
      "Diagnose first. Buying ahead of readiness is the most common failure mode.",
    ],
    takeaways: [
      "Score the five surfaces honestly. Vendor demos do not count as evidence.",
      "Fix the lowest-scoring surface before adding new capability on top.",
      "Re-diagnose every six months. Readiness is a moving target.",
    ],
  },
  "from-prompts-to-systems": {
    tldr: [
      "A prompt is a sentence. A system is a workflow with state, ownership, and review.",
      "Most People teams are still operating at sentence level and wondering why the value does not compound.",
      "The shift is from authoring prompts to designing systems that produce reliable output.",
      "Systems thinking is the unlock. The prompt is a small part of it.",
    ],
    takeaways: [
      "Stop optimising prompts in isolation. Optimise the workflow they sit in.",
      "Give every system an owner, a review cadence, and a test set.",
      "Promote prompts that work into systems. Retire ones that do not.",
    ],
  },
  "leading-the-ai-transformation": {
    tldr: [
      "Leading an AI transformation in a People function is more about cadence and air cover than about technology.",
      "The leader's job is to make the right thing easy and the wrong thing visible.",
      "Pace matters more than ambition. Compounding beats sprinting.",
      "The transformation that sticks is the one the team can sustain on a Tuesday morning.",
    ],
    takeaways: [
      "Set the cadence and protect it. Cadence is the strategy.",
      "Make adoption legible. What gets seen gets repeated.",
      "Pace by absorption, not by ambition. The fastest sustainable rate beats any sprint.",
    ],
  },
  "measuring-ai-value-in-people-ops": {
    tldr: [
      "Most AI value measurement in People Ops is theatre. Time saved per task is a vanity metric.",
      "Measure what compounds: capability built, decisions improved, latency reduced, work prevented.",
      "Pair every quantitative metric with a qualitative read. The numbers lie alone.",
      "Reporting AI value is a craft. Treat it like one.",
    ],
    takeaways: [
      "Drop time-saved as the headline metric. It hides as much as it reveals.",
      "Track capability, decision quality, and latency together.",
      "Use a quarterly written narrative alongside the dashboard. The narrative is where the truth lives.",
    ],
  },
  "people-debt-and-genai": {
    tldr: [
      "People debt is the accumulated cost of decisions deferred at the people-systems layer.",
      "GenAI exposes people debt faster than any prior technology because it removes the slowness that hid it.",
      "Roles that were marginally productive become obviously so. Workflows that were quietly broken break loudly.",
      "The work is paying down the debt with intention, not pretending the tool will absorb it.",
    ],
    takeaways: [
      "Treat GenAI as a diagnostic. Where it lights up dysfunction, fix the dysfunction first.",
      "Pay down people debt before scaling AI capability on top of it.",
      "The teams that thrive are the ones who use the moment to clean up, not paper over.",
    ],
  },
  "people-ops-diagnostic-toolkit": {
    tldr: [
      "A small set of repeatable diagnostics will tell you most of what you need to know about a People function.",
      "Five lenses: ownership, cadence, data, escalation, capability.",
      "Run them before any tool decision. Run them again after.",
      "The toolkit is a discipline, not a deliverable.",
    ],
    takeaways: [
      "Run the same five lenses every time. Comparability is the point.",
      "Document the diagnostic. A diagnosis nobody can repeat is folklore.",
      "Use the toolkit before buying any new capability.",
    ],
  },
  "production-agents-for-people-ops": {
    tldr: [
      "A production agent is not a prompt with ambition. It is a workflow with state, evals, and an owner.",
      "Most agents in People Ops are stuck in demo loops because nobody owns the production version.",
      "Production demands the boring work: error handling, logging, fallback, review.",
      "Two well-run production agents beat ten experimental ones every time.",
    ],
    takeaways: [
      "Promote an agent only when it has an owner, an eval set, and a fallback.",
      "Log everything. Without logs, the agent is a black box you trust on faith.",
      "Retire agents that stop earning their keep. Agent sprawl is real.",
    ],
  },
  "prompting-patterns-for-people-ops": {
    tldr: [
      "A small library of reusable prompt patterns covers most of the day-to-day in a People function.",
      "Reusable, named, versioned. Treat prompts like code, not like notes.",
      "The team that shares prompts compounds faster than the team that hoards them.",
      "Patterns beat one-offs. One-offs are how knowledge dies.",
    ],
    takeaways: [
      "Build a shared, named prompt library. Versioned, owned, reviewed.",
      "Document the pattern, not just the prompt. The pattern is the reusable bit.",
      "Audit usage. Patterns that nobody uses should be retired or rewritten.",
    ],
  },
  "setting-up-your-ai-workspace": {
    tldr: [
      "An AI workspace is the structured layer that turns a generic AI tool into a function-specific colleague.",
      "Custom instructions, projects, reference docs, shared prompts. That is the unit of work.",
      "The workspace is the first artefact most People teams should build. Most skip it and wonder why outputs are mediocre.",
      "It is operating infrastructure, not a productivity hack.",
    ],
    takeaways: [
      "Build the workspace before scaling adoption. Without it, every prompt starts from zero.",
      "Treat reference docs as living. Stale context is worse than no context.",
      "Share the workspace across the team. Private workspaces do not compound.",
    ],
  },
  "the-champion-model": {
    tldr: [
      "The Champion Model is a staffing pattern for building AI capability inside a function without engineers.",
      "Three or four operators, given air cover, time, and a build-first remit, supported by a coaching cadence.",
      "It compounds faster than centralised builds because the champions live inside the work.",
      "The risk is starvation: if the champions do not get protected time, the model collapses inside a quarter.",
    ],
    takeaways: [
      "Pick three to four champions. Fewer is fragile, more is unmanageable.",
      "Protect their time on the calendar, not just on paper.",
      "Pair them with a coaching cadence. Champions without coaching plateau.",
    ],
  },
  "the-hr-architect-role": {
    tldr: [
      "The HR Architect is the role most People functions need next and few have hired for yet.",
      "Half systems thinker, half builder. Designs the operating system the People function runs on.",
      "Not the Head of People. Not the HRBP. A distinct role with distinct deliverables.",
      "Where the role is staffed well, AI capability compounds. Where it is missing, AI work stays in pilot.",
    ],
    takeaways: [
      "Hire the architect role explicitly. Spreading the work across existing roles does not work.",
      "Pair them with builder access: tools, time, mandate.",
      "Measure the role on systems shipped and adopted, not on policies written.",
    ],
  },
  "the-people-ops-ai-domain-map": {
    tldr: [
      "Five domains cover the People Ops AI estate: TA, onboarding and lifecycle, performance and growth, comms and policy, analytics and planning.",
      "Each has its own grain. AI leverage looks different in each one.",
      "The map is a wall to pin your own work against, not a strategy.",
      "Empty domains are places to look. Crowded domains are places to consolidate.",
    ],
    takeaways: [
      "Map your own estate before adding capability. You will see redundancy you did not know existed.",
      "Match AI patterns to the domain grain. Patterns that work in TA often fail in performance.",
      "Consolidate before you build. Two well-run systems beat five half-built ones.",
    ],
  },
  "workflow-assessment-framework": {
    tldr: [
      "A workflow assessment framework gives you a defensible way to choose what to automate, redesign, or leave alone.",
      "Five lenses: frequency, latency, judgment, risk, ownership.",
      "Most People teams automate by feel. Feel optimises for novelty, not value.",
      "Use the framework once and it changes how the next ten decisions get made.",
    ],
    takeaways: [
      "Score every candidate workflow on the same five lenses.",
      "High-judgment, high-risk workflows stay human-led. AI assists, never decides.",
      "Document the call. The framework only compounds if the reasoning is visible later.",
    ],
  },
};

const fmt = (block) => block.map((b) => `- ${b}`).join("\n");

function patch(src, entry) {
  if (src.includes("<TLDR>")) return src; // idempotent

  let next = src;
  if (!/updatedAt\s*:/.test(next)) {
    next = next.replace(
      /(publishedAt:\s*"[^"]+",\n)/,
      `$1  updatedAt: "${UPDATED}",\n`,
    );
  }

  const tldrBlock = `<TLDR>\n${fmt(entry.tldr)}\n</TLDR>\n\n`;
  const keyBlock = `\n\n<KeyTakeaways>\n${fmt(entry.takeaways)}\n</KeyTakeaways>\n`;

  // Find end of frontmatter export.
  const fmEnd = next.indexOf("};\n");
  if (fmEnd === -1) {
    throw new Error("frontmatter end not found");
  }
  let bodyStart = fmEnd + 3;

  // Skip past optional faqs export array.
  const afterFm = next.slice(bodyStart);
  const faqsMatch = afterFm.match(/export\s+const\s+faqs\s*=\s*\[/);
  if (faqsMatch) {
    const closeRel = afterFm.indexOf("\n];\n", faqsMatch.index);
    if (closeRel !== -1) {
      bodyStart += closeRel + 4;
    }
  }

  // Skip leading blank lines.
  while (next[bodyStart] === "\n") bodyStart++;

  next = next.slice(0, bodyStart) + tldrBlock + next.slice(bodyStart);

  if (
    next.includes("*This article is a placeholder scaffold. Full prose to follow.*")
  ) {
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
  let src;
  try {
    src = await fs.readFile(file, "utf8");
  } catch (e) {
    console.warn(`missing ${slug}.mdx, skipping.`);
    continue;
  }
  const next = patch(src, entry);
  if (next !== src) {
    await fs.writeFile(file, next);
    console.log(`patched ${slug}.mdx`);
    changed++;
  } else {
    console.log(`skipped ${slug}.mdx (already patched)`);
  }
}
console.log(`\n${changed}/${Object.keys(ENTRIES).length} files patched.`);
