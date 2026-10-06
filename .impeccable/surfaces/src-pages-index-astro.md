---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Homepage

Scope: the AI Club homepage (`src/pages/index.astro`). Visitor mode: Persuade.

Audience: HTL Leonding students arriving from a class-chat link, mostly on portrait phones; guests second. Job: understand the club, see the next session, join. Action: "Yes, open the sign-up form" (Microsoft Form, URL pending). Proof: the page is the kind of session the club teaches; a diff of the visitor's Wednesday evenings removes "Doomscrolling alone at home" and adds possible topics.

Constraints: Astro static, GitHub Pages, dark by default, light via the `/theme` toggle, ~40-column phone reflow, no horizontal scroll. Sessions come from one YAML file per semester; done/next/upcoming derives from the date at runtime. Sessions expand in place to details when they exist; each has a deep link. No calendar link. Interface grammar of Claude Code, with the club's own glyph and accent; no Anthropic marks.

Sessions announce only date, time and place (no topics, no rooms).

## Direction contract

THESIS: The homepage is one replayed coding-agent session: a question typed, an answer streamed, tool calls returning the semester, a permission prompt as the call to action. It refuses the club landing template of headline, pitch, button, and a row of session cards.

OWN-WORLD: Full-bleed terminal ground in both themes; Monaspace Neon for the agent, Monaspace Radon for everything the human types. Rounded single-rule boxes, ⏺ bullets and ⎿ elbows drawn as shapes, checkbox states, red/green diff rows with line numbers, a dim collapse hint `(ctrl+o to expand)`. One club accent (hot pink) owns the ◆ mark, caret, permission box, and the next session.

STORY: A student sees the next date, reads what the club does and how a session runs, picks a session to see its details, and approves the join prompt (or scans its QR code); the possible topics follow, as a diff of their Wednesday evenings.

FIRST VIEWPORT: Welcome box: block-letter AI CLUB banner, full name and cwd on the left; Next session (the only pink heading) and tips on the right, stacked under the banner on phones. Then the typed question, a status-line beat, and the streamed pitch, set at a 16px phone / 18px desktop reading size (readability outranks fitting the checklist into the first desktop viewport).

FORM: User-pinned direction (Claude Code session replay, variant A of three), overriding the roll; seed key 947183a8.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
