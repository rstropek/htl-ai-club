---
name: AI Club
description: Algorithmic Problem Solving with AI, a student club at HTL Leonding, told as one replayed coding-agent session.
colors:
  club-pink: "#c2185b"
  club-pink-dark: "#ff5c93"
  pink-wash: "#fbe4ec"
  pink-wash-dark: "#3a1726"
  banner-shade: "#f3c6d6"
  banner-shade-dark: "#5a1f37"
  paper: "#fcfbfa"
  paper-dark: "#131215"
  ink: "#1c1a1f"
  ink-dark: "#ece9e5"
  dim-ink: "#524d58"
  dim-ink-dark: "#b6b1bb"
  rule: "#d9d5dd"
  rule-dark: "#3a3740"
  hover-wash: "#f2f0ee"
  hover-wash-dark: "#1e1c21"
  prompt-wash: "#f1eff2"
  prompt-wash-dark: "#1f1d22"
  tool-ok: "#1b7a3a"
  tool-ok-dark: "#6fd08c"
  diff-add-bg: "#ddf4e2"
  diff-add-bg-dark: "#173520"
  diff-add-fg: "#11552a"
  diff-add-fg-dark: "#b4f2c3"
  diff-del-bg: "#fbe3e3"
  diff-del-bg-dark: "#3e1b1f"
  diff-del-fg: "#99201f"
  diff-del-fg-dark: "#ffb8b5"
typography:
  body:
    fontFamily: "'Monaspace Neon', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    fontSize: "clamp(16px, 15.2px + 0.2vw, 18px)"
    fontWeight: 400
    lineHeight: 1.68
    fontFeature: "'calt' 1, 'liga' 1, tabular-nums"
  title:
    fontFamily: "'Monaspace Neon', ui-monospace, monospace"
    fontSize: "1em"
    fontWeight: 700
    lineHeight: 1.68
  human:
    fontFamily: "'Monaspace Radon', 'Monaspace Neon', ui-monospace, monospace"
    fontSize: "1em"
    fontWeight: 400
    lineHeight: 1.68
  label:
    fontFamily: "'Monaspace Neon', ui-monospace, monospace"
    fontSize: "0.92em"
    fontWeight: 400
    lineHeight: 1.68
  footnote:
    fontFamily: "'Monaspace Neon', ui-monospace, monospace"
    fontSize: "0.88em"
    fontWeight: 400
    lineHeight: 1.68
rounded:
  focus: "3px"
  row: "4px"
  key: "6px"
  box: "10px"
spacing:
  gutter: "2.4ch"
  gutter-phone: "2ch"
  turn-gap: "1.6em"
  turn-gap-phone: "1.35em"
  box-inline: "2ch"
  box-inline-phone: "1.5ch"
  page-inline: "16px"
  page-inline-wide: "32px"
  column: "92ch"
  prose: "64ch"
components:
  command-key:
    textColor: "{colors.ink}"
    rounded: "{rounded.key}"
    padding: "0.15em 1ch"
  command-key-join:
    textColor: "{colors.club-pink}"
    rounded: "{rounded.key}"
    padding: "0.15em 1ch"
  command-key-hover:
    backgroundColor: "{colors.hover-wash}"
    rounded: "{rounded.key}"
  welcome-box:
    textColor: "{colors.ink}"
    rounded: "{rounded.box}"
    padding: "1.1em 2ch 1.2em"
  permission-box:
    textColor: "{colors.ink}"
    rounded: "{rounded.box}"
    padding: "1em 2ch 1.1em"
  permission-option:
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "0.25em 1ch"
  permission-option-active:
    textColor: "{colors.club-pink}"
    rounded: "{rounded.row}"
    padding: "0.25em 1ch"
  user-prompt:
    backgroundColor: "{colors.prompt-wash}"
    textColor: "{colors.ink}"
    typography: "{typography.human}"
    rounded: "{rounded.row}"
    padding: "0.35em 1ch"
  input-box:
    textColor: "{colors.ink}"
    typography: "{typography.human}"
    rounded: "{rounded.box}"
    padding: "0.55em 2ch"
  session-row:
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "0.2em 1ch"
  session-row-hover:
    backgroundColor: "{colors.hover-wash}"
    rounded: "{rounded.row}"
  diff-row-add:
    backgroundColor: "{colors.diff-add-bg}"
    textColor: "{colors.diff-add-fg}"
  diff-row-del:
    backgroundColor: "{colors.diff-del-bg}"
    textColor: "{colors.diff-del-fg}"
---

# Design System: AI Club

## Overview

**Creative North Star: "The Replayed Session"**

The whole site is one terminal coding-agent session played back to the visitor: a welcome box, a question the human typed, the agent's answer streamed as messages, tool calls whose results are the club's real data, a diff of the visitor's Wednesday evenings that swaps doomscrolling for possible topics, a permission prompt as the call to action, and a live input box with a slash menu and a status line underneath. Every surface is a turn in that transcript. Nothing is a card, a hero or a pitch block; if a new piece of content cannot be expressed as something a session would print, it does not yet belong.

The ground is full-bleed and flat in both themes, a near-black terminal by default and a warm off-white paper when the visitor picks it with `/theme`. Density is that of a real terminal: one monospace voice, one text size, hierarchy carried by weight, dimming and the club pink rather than by scale. Structure comes from character-cell geometry: a fixed gutter column for bullets and elbows, `ch`-based grids for labels and numbers, rounded single-rule boxes for the moments that need a frame.

The club pink is the only hue that speaks for the club. Green and red appear only as the session's own semantics (a finished tool call, an added or removed diff line). The look nods to terminal coding agents generally and carries no vendor marks; the footer states it is not affiliated with any AI vendor.

**Key Characteristics:**
- One replayed session, top to bottom: welcome box, typed prompt, messages, tool calls with results, diff, permission prompt, input box, status line.
- Two Monaspace voices: Neon for the agent, Radon for everything the human types.
- One size of text; hierarchy by weight (400/700), dim ink and the club pink.
- Terminal glyphs (message dot, result elbow, checkboxes, pointer, diamond mark, spinner) drawn as CSS or SVG shapes, never left to Unicode fallback fonts.
- Light and dark token sets measured for AA body contrast, both first-class.
- One authored replay motion per visit, skippable, absent under reduced motion.

## Colors

A neutral terminal ground with exactly one voice of colour, the club's hot pink, plus the session's own green/red semantics.

### Primary
- **Club Pink** (light `club-pink`, dark `club-pink-dark`): the club's identity. It owns the diamond mark, the text caret and typing cursor, the borders of the welcome box and the permission prompt, the "Next session" heading, the next session's checkbox, date and `← next` tag, the `/join` key, the active permission option, slash commands in help text, share links, the spinner, the selection highlight and the focus ring. Measured 5.7:1 on light paper and 6.4:1 on dark, so it is safe for text.
- **Pink Wash** (`pink-wash`, `pink-wash-dark`): declared soft tint of the pink; currently defined but not applied on the homepage. Reserve it for a pink-tinted surface if one is ever needed rather than inventing another tint.
- **Banner Shade** (`banner-shade`, `banner-shade-dark`): the offset shadow layer of the block-letter AI CLUB banner, and nothing else.

### Neutral
- **Paper** (`paper`, `paper-dark`): the full-bleed ground; also the text colour on pink (selection, skip link).
- **Ink** (`ink`, `ink-dark`): primary text, the agent's message dot, bold emphasis. 16.7:1 light, 15.4:1 dark.
- **Dim Ink** (`dim-ink`, `dim-ink-dark`): everything the terminal greys out: paths, result lines, labels, line numbers, hints like `(ctrl+o to expand)`, the status line, footer, finished sessions. Measured 6.6:1 light and 7.0:1 dark; it is body-legible, not decorative.
- **Rule** (`rule`, `rule-dark`): the input box border at rest, command-key borders, the dashed footer rule, scrollbar.
- **Hover Wash** (`hover-wash`, `hover-wash-dark`): the row highlight for session rows, permission options, the selected slash-menu item and command keys on hover.
- **Prompt Wash** (`prompt-wash`, `prompt-wash-dark`): the band behind a line the human typed.

### Session semantics
- **Tool OK** (`tool-ok`, `tool-ok-dark`): the dot of a completed tool call. Never used for text or decoration.
- **Diff Add / Diff Del** (`diff-add-*`, `diff-del-*`): full-row background and text of added and removed diff lines (7.7:1 and 6.7:1 light; 10.5:1 and 9.3:1 dark).

### Named Rules
**The One Voice Rule.** Club Pink is the only hue that speaks for the club. Every pink element is either the club's mark, the human's caret, a frame around a moment that matters (welcome, permission), the next session, or an interactive state. If a second element on a screen asks for pink "to make it pop", it does not get it.

**The Semantics-Only Green and Red Rule.** Green and red exist because the session prints them: finished tool calls and diff lines. They never appear as brand colour, status badges or decoration.

**The Dim Is Chrome Rule.** Dim ink is for chrome only: numbers, labels, captions, file paths, hints. Anything a visitor reads for meaning (dates, places, tips, prose) is full ink. Dim text stays well under half the page.

**The Two Measured Themes Rule.** Every colour token exists in a dark and a light value. Dark is the default for every visitor regardless of system preference; light applies only through `data-theme="light"`, set by `/theme` and remembered per visitor. A new token is not finished until both values are measured against their ground.

## Typography

**Agent Font:** Monaspace Neon 400/700 (fallback ui-monospace, SFMono-Regular, Menlo, Consolas, monospace), self-hosted via @fontsource.
**Human Font:** Monaspace Radon 400 (fallback Monaspace Neon, ui-monospace), self-hosted via @fontsource.

**Character:** Neon is the even, engineered voice of the agent; Radon's handwritten italic-cursive forms mark every line a person typed: the prompt band, echoed answers in the log, the input field and its placeholder. The pairing tells the reader who is speaking without a single label.

### Hierarchy
- **Body** (Neon 400, `clamp(16px, 15.2px + 0.2vw, 18px)`, line-height 1.68): everything. Ligatures and contextual alternates on, tabular numerals on. Prose is capped at 64ch inside a 92ch column: monospace letters are wide, so a shorter measure reads like a normal line. 16px is the floor on phones.
- **Title** (Neon 700, same size): tool names (`Read`, `Update`), the club's full name, "Next session", the permission question, the next session's title, inline emphasis. Weight is the only heading device.
- **Human** (Radon 400, same size): what the human types.
- **Label** (Neon 400, 0.92em): expand hints, keyboard hints, the status line.
- **Footnote** (Neon 400, 0.88em): the footer only.

The block-letter AI CLUB banner is the only display element, and it is not type: it is an SVG of 6x12 terminal cells (each cell one block character) with a half-cell offset shade layer.

### Named Rules
**The One Size Rule.** There is no type scale. Headings are the body size in bold; small text steps down at most to 0.92em (0.88em in the footer). If something needs to be louder, it gets weight, pink, or a box, not a bigger size.

**The Who Typed It Rule.** Radon means a human typed it; Neon means the agent printed it. Never set agent output in Radon or a human's input in Neon.

## Layout

A single centered transcript column, `max-width: 92ch`, with 16px page padding (32px from 48rem). Each turn is separated by one turn gap (1.6em; 1.35em under 34rem). Messages, results, spinners and prompt lines share a fixed gutter column (2.4ch; 2ch on phones) that holds the dot, elbow or `>` sign, so text always starts on the same character column. Inner grids are counted in `ch`: session rows use 2.4ch checkbox, 3.2ch number, flexible title, auto date; key/value details use a 7ch label column; diff rows use 4ch line numbers and a 2ch sign column; the slash menu uses an 11ch command column.

The welcome box splits into identity (1.35fr) and next session plus tips (1fr) from 52rem, divided by a pink half-strength rule; below that the side stacks under the identity with a top rule. On phones (under 34rem, roughly 40 columns) the layout reflows instead of shrinking: the topbar path is dropped, box padding narrows to 1.5ch, session dates move under the title, owners stack, and the key/value label column stays at 6ch; only under 21.5rem do labels stack above values.

Without JavaScript every session is expanded and the input, hints and key help are hidden; the transcript is complete as static HTML.

## Elevation & Depth

Flat. There are no box shadows anywhere. Depth is conveyed the way a terminal conveys it: by frames (1.5px rounded single rules), by washes (the prompt band, the hover row, diff rows) and by dimming. The only offset layer in the system is the block-letter banner's half-cell shade, which is native to terminal block-letter banners and belongs to the banner alone.

### Named Rules
**The Flat Terminal Rule.** No `box-shadow`, no blur, no glass. A thing that needs separation gets a rule or a wash.

## Shapes

Corners come in four steps tied to role: 3px for the focus ring, 4px for anything that is a line of text with a wash (session rows, options, prompt band, diff block, menu items), 6px for command keys, 10px for the three framed boxes (welcome, permission, input). Frames are single strokes: 1.5px for boxes, 1px for keys, chips and internal dividers, dashed 1px for the footer rule.

Glyphs are drawn, not typed: the message dot is a 0.56em circle centred on the first line; the result elbow is a two-sided 1.5px border; checkboxes are a 12-unit SVG square that shows a cross when done and a filled inner square when next; the pointer is a stroked chevron; the club mark is a filled diamond; the spinner is a pink rotated square that pulses. The banner is crisp-edged cells. Plain text characters that Monaspace itself renders (`-`, `·`, `*`, `>`, `←`, `…`) stay text.

## Components

### Command keys (topbar `/theme`, `/join`, status-line theme toggle)
Slash commands rendered as small keys.
- **Shape:** gently rounded (6px), 1px rule border, `0.15em 1ch` padding.
- **Default:** ink text on paper with a rule border. `/join` in the topbar is the pink variant: pink border and pink text.
- **Hover / Focus:** border turns pink and the hover wash fills in (0.2s); focus is the global 2px pink ring at 2px offset.
- **Quiet:** the status-line theme toggle drops the border, uses dim ink and brightens to ink on hover.

### Welcome box
The session's opening frame. 1.5px pink border, 10px corners, `1.1em 2ch 1.2em` padding. Holds the diamond mark and greeting, the banner (max 34rem), the full name in bold, dim school line, slash-command help and cwd; the side carries "Next session" (the only pink heading) and numbered tips in dim ink.

### User prompt
A line the human typed: a prompt-wash band with 4px corners, pulled out by 1ch on both sides, a dim `>` in the gutter and Radon text.

### Messages and tool calls
A dot in the gutter, body to the right. Agent messages use an ink dot; finished tool calls use the green dot and a bold tool name with a dim path in parentheses. Results hang under an elbow glyph, first line dim. Lists use a dim `-` (pitch) or `·` (agenda) in a 2ch marker column.

### Session checklist (signature)
The sign-up QR code sits in the join prompt's right column on screens 44rem and wider, hidden on phones (the visitor already holds the link). It is drawn like the banner, as square terminal cells, but always near-black cells on a light tile in both themes, because scanners need luminance contrast; pink-on-black is never used for a code. A dim "scan to sign up" caption sits under it. The same code ships as `/qr-signup.svg` for print.

The session plan is an `Update Todos` tool call: a dim caption ("How every session runs") and empty checkboxes in the shared 2.4ch column, one step per line. Same checkbox glyph as the session list, never ticked, because it is a plan rather than progress.

Each session is a full-width button row: checkbox, dim number, title ("Club meeting" unless the event has a name), date with start time in full ink, and a dim `… +N lines (ctrl+o to expand)` hint (`tap to expand` on touch) shown only on the first collapsed row of each list, so the gesture is taught once instead of repeated. Done sessions are dimmed and struck through with a cross in the box; the next session gets a filled pink box, bold title, pink date and a pink `← next` tag, and opens by default. Rows take the hover wash at 4px. Expanding animates `grid-template-rows` over 0.32s and reveals a nested `Read(sessions/…md)` call with a key/value result: `when` (date and time range) and `where` (the place, HTL Leonding unless set). Optional detail rows (what, agenda, bring, level, needs, host, link) appear only when the data has them; currently only dates and times are announced.

### Diff
Line-numbered rows in a 4px-rounded block: context in dim ink, removed lines on the red wash, added lines on the green wash, numbers at 80% opacity within coloured rows.

### Permission prompt (the call to action)
Joining is asked, not sold. 1.5px pink border, 10px corners. Bold question, dim explanation, numbered options as full-width rows; the active option turns pink and shows the chevron pointer; hover adds the wash. A dim key hint (`↑↓ to choose · enter to confirm · 1–3 to pick`) shows only for keyboard users.

### Input box, slash menu and status line
A 10px-rounded box with a 1.5px rule border that darkens to dim ink on focus; Radon input with a pink caret and a dim placeholder. Typing `/` opens a listbox menu of commands (command column 11ch, dim descriptions); the selected item gets the hover wash and a pink command. Below sits the dim status line at 0.92em with hints and the quiet theme toggle.

### Replay motion
One authored sequence, once per visit (session storage), skipped when the URL has a hash. The welcome box reveals with its banner cells fading in on a 14ms diagonal stagger; the prompt types at 30ms per character behind a pink block cursor; a pink spinner line shows a verb with `(esc to skip)` for about 0.8s; then each step fades and rises 0.35em over 0.45s on `cubic-bezier(0.16, 1, 0.3, 1)`. Any key, pointer, wheel or touch finishes it instantly. It is never started under `prefers-reduced-motion`, which also collapses all transitions; a CSS failsafe reveals every step after 6s if the script never runs.

## Do's and Don'ts

### Do:
- **Do** express every new piece of content as something the session would print: a message, a tool call with a result, a prompt, a menu entry or a status line.
- **Do** hang glyphs in the shared gutter column (2.4ch, 2ch on phones) so text starts on one character column.
- **Do** draw terminal glyphs as CSS or SVG shapes, as the Glyph component does, so they render identically on every device.
- **Do** set anything the human types in Monaspace Radon and everything the agent prints in Monaspace Neon.
- **Do** carry hierarchy with weight 700, dim ink and the club pink, at the single body size.
- **Do** define every new colour in both themes and measure it; dim text stays at or above the current 6.6:1 light and 7.0:1 dark.
- **Do** keep phone layouts as a reflow at roughly 40 columns that preserves the 6ch label column, not a scaled-down desktop.
- **Do** make motion skippable by any input, once per visit, and absent under reduced motion, with content visible without JavaScript.

### Don't:
- **Don't** give pink to anything outside the One Voice Rule's list (mark, caret, welcome and permission frames, next session, banner, interactive state).
- **Don't** add box shadows, gradients or blur; separate with a rule or a wash.
- **Don't** introduce a type scale or a display face; the banner is the only display element.
- **Don't** use green or red outside tool-call and diff semantics.
- **Don't** use any AI vendor's logos, mascots or brand colours, or the school's visual branding.
- **Don't** rely on rare Unicode characters (⏺ ⎿ ☒ ☐ ◼ ❯ ◆) rendering in fallback fonts; draw them.
