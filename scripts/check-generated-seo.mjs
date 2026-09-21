import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const files = [
  "public/sitemap.xml",
  "public/llms.txt",
  "public/llms-full.txt",
  "public/feed.xml",
  "public/feed/people-ops.xml",
];
const hash = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const before = Object.fromEntries(files.map((file) => [file, hash(file)]));
execFileSync(process.execPath, ["scripts/build-seo-indexes.mjs"], { stdio: "inherit" });
const stale = files.filter((file) => hash(file) !== before[file]);
if (stale.length) {
  console.error("Generated SEO indexes were stale. Commit the regenerated files:");
  stale.forEach((file) => console.error(`  - ${file}`));
  process.exit(1);
}
console.log("Generated SEO indexes are current.");
