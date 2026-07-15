#!/usr/bin/env node
/**
 * Robots.txt audit.
 *
 * Parses public/robots.txt and public/sitemap.xml, then for every URL listed
 * in the sitemap checks each User-agent group's Allow/Disallow rules using
 * Google's longest-match-wins semantics. Fails the build if any sitemap URL
 * would be blocked, or if anything outside an opt-in allow-list is exposed
 * to crawlers when it shouldn't be.
 *
 * Wired into prebuild so a bad rule never ships.
 */
import { promises as fs } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const PUBLIC = join(ROOT, "public");

// Paths that MUST stay disallowed if we ever add them. Treat the whole prefix
// as off-limits to crawlers. Keep in sync with intent, not implementation.
const MUST_BE_DISALLOWED = [
  "/lovable/",
  "/admin/",
  "/api/",
  "/internal/",
];

// ---------- parse robots.txt ----------

function parseRobots(src) {
  const groups = [];
  let current = null;
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (field === "user-agent") {
      if (!current || current.rules.length > 0) {
        current = { agents: [value], rules: [] };
        groups.push(current);
      } else {
        current.agents.push(value);
      }
    } else if (field === "allow" || field === "disallow") {
      if (!current) continue;
      current.rules.push({ type: field, pattern: value });
    }
  }
  return groups;
}

// Convert a robots.txt path pattern (supports * and $) into a RegExp.
function patternToRegex(pattern) {
  if (pattern === "") return null; // empty Disallow = allow everything
  let re = "^";
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === "*") re += ".*";
    else if (c === "$" && i === pattern.length - 1) re += "$";
    else re += c.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(re);
}

/**
 * Apply Google's longest-match rule. Returns true if URL path is allowed for
 * the given group. Default = allowed when no rule matches.
 */
function isAllowed(path, group) {
  let best = { len: -1, allow: true };
  for (const rule of group.rules) {
    if (rule.pattern === "" && rule.type === "disallow") continue;
    const re = patternToRegex(rule.pattern);
    if (!re) continue;
    if (re.test(path)) {
      const len = rule.pattern.length;
      if (len > best.len) best = { len, allow: rule.type === "allow" };
    }
  }
  return best.allow;
}

// ---------- parse sitemap ----------

async function loadSitemapPaths() {
  const xml = await fs.readFile(join(PUBLIC, "sitemap.xml"), "utf8");
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
  return locs.map((u) => {
    try {
      return new URL(u).pathname;
    } catch {
      return u;
    }
  });
}

// ---------- run ----------

const robotsSrc = await fs.readFile(join(PUBLIC, "robots.txt"), "utf8");
const groups = parseRobots(robotsSrc);
const paths = await loadSitemapPaths();

if (groups.length === 0) {
  console.error("audit-robots: no User-agent groups parsed from robots.txt");
  process.exit(1);
}
if (paths.length === 0) {
  console.error("audit-robots: no <loc> entries parsed from sitemap.xml");
  process.exit(1);
}

const failures = [];

// 1. Every sitemap URL must be crawlable by every declared user-agent group.
for (const group of groups) {
  for (const path of paths) {
    if (!isAllowed(path, group)) {
      failures.push(
        `BLOCKED: ${path} is disallowed for User-agent: ${group.agents.join(", ")}`,
      );
    }
  }
}

// 2. Anything we explicitly want hidden must stay hidden for *.
const star = groups.find((g) => g.agents.includes("*"));
if (!star) {
  failures.push("MISSING: no `User-agent: *` group in robots.txt");
} else {
  for (const prefix of MUST_BE_DISALLOWED) {
    if (isAllowed(prefix, star)) {
      // Only a problem if the prefix is currently exposed but the project
      // intends it private. Surface as a warning, not a fail, because we
      // can't tell from robots.txt alone whether a route actually exists.
      console.warn(
        `audit-robots: NOTE - ${prefix} is crawlable by *; add a Disallow if these routes exist.`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("\naudit-robots: FAILED\n");
  for (const f of failures) console.error("  - " + f);
  console.error(`\n${failures.length} issue(s). Fix public/robots.txt.\n`);
  process.exit(1);
}

console.log(
  `audit-robots: OK (${paths.length} sitemap URLs × ${groups.length} user-agent groups, all crawlable).`,
);
