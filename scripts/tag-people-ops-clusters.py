#!/usr/bin/env python3
"""Inject primaryCluster + clusters into People Ops MDX frontmatters."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / "src/content/intelligence/people-ops"

# Hand-curated mapping. Primary cluster first, then 1-2 secondary clusters.
TAGS = {
    "ai-enablement-operating-model":      ("enablement-and-change", ["org-design-and-roles", "governance-and-policy"]),
    "ai-governance-for-people-teams":     ("governance-and-policy", ["enablement-and-change"]),
    "ai-policy-blueprint-for-people-teams": ("governance-and-policy", ["workflows-and-automation"]),
    "automation-audit-playbook":          ("workflows-and-automation", ["measurement-and-roi"]),
    "automation-patterns-that-pay-off":   ("workflows-and-automation", ["agents-and-systems"]),
    "choosing-ai-models-for-hr-work":     ("workspace-and-tools", ["prompting-and-craft"]),
    "designing-the-ai-native-people-team": ("org-design-and-roles", ["enablement-and-change"]),
    "diagnosing-ai-readiness-in-people-ops": ("readiness-and-diagnosis", ["enablement-and-change"]),
    "from-prompts-to-systems":            ("prompting-and-craft", ["workflows-and-automation", "enablement-and-change"]),
    "leading-the-ai-transformation":      ("enablement-and-change", ["org-design-and-roles", "measurement-and-roi"]),
    "measuring-ai-value-in-people-ops":   ("measurement-and-roi", ["governance-and-policy"]),
    "production-agents-for-people-ops":   ("agents-and-systems", ["workflows-and-automation"]),
    "prompting-patterns-for-people-ops":  ("prompting-and-craft", ["workspace-and-tools"]),
    "setting-up-your-ai-workspace":       ("workspace-and-tools", ["prompting-and-craft"]),
    "the-champion-model":                 ("enablement-and-change", ["org-design-and-roles"]),
    "the-hr-architect-role":              ("org-design-and-roles", ["agents-and-systems", "enablement-and-change"]),
    "the-people-ops-ai-domain-map":       ("workflows-and-automation", ["readiness-and-diagnosis"]),
    "workflow-assessment-framework":      ("workflows-and-automation", ["measurement-and-roi", "readiness-and-diagnosis"]),
}

CATEGORY_LINE_RE = re.compile(r"^(\s*)category:\s*\"[^\"]+\",\s*$", re.MULTILINE)

for path in sorted(DIR.glob("*.mdx")):
    slug = path.stem
    if slug not in TAGS:
        print(f"skip (no tags): {slug}")
        continue
    primary, secondary = TAGS[slug]
    text = path.read_text(encoding="utf-8")

    # Strip any pre-existing primaryCluster / clusters lines so we stay idempotent.
    text = re.sub(r"^\s*primaryCluster:\s*\"[^\"]+\",\s*\n", "", text, count=1, flags=re.MULTILINE)
    text = re.sub(r"^\s*clusters:\s*\[[^\]]*\],\s*\n", "", text, count=1, flags=re.MULTILINE)

    m = CATEGORY_LINE_RE.search(text)
    if not m:
        print(f"WARN no category line: {slug}")
        continue
    indent = m.group(1)
    insertion = (
        f'{indent}primaryCluster: "{primary}",\n'
        f'{indent}clusters: [{", ".join(repr(s).replace(chr(39), chr(34)) for s in secondary)}],\n'
    )
    new_text = text[: m.end()] + "\n" + insertion + text[m.end():]
    # Collapse the extra blank line we just introduced after `category:`.
    new_text = new_text.replace(m.group(0) + "\n\n" + insertion, m.group(0) + "\n" + insertion)
    path.write_text(new_text, encoding="utf-8")
    print(f"tagged {slug}: {primary} + {secondary}")
