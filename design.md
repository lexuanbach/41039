# Design System — 41039 Programming 1

The visual foundation for the subject website. Every interface change must follow this
system so the site stays consistent. Written in English because all subject content is in
English; the sibling CO1005 site keeps its docs in Vietnamese.

Read alongside [architecture.md](architecture.md).

## 1. Direction

- **Audience**: first-year students with no programming background — they come to the
  homepage for the outline, deadlines and assessment weights, and to a week page to revise
  concepts and self-test.
- **Design voice**: professional, scannable, with a "computing" texture from the mono font
  and code cards — never loud.
- **Content language**: English only. There is no EN/VI toggle (unlike CO1005). If one is
  added later, follow CO1005's `data-i18n` dictionary pattern.
- **Where CSS lives**: **one stylesheet, `assets/style.css`, used by every page including
  the homepage.** This is a deliberate improvement on CO1005, where `index.html` keeps a
  duplicate copy of the tokens and both must be edited together.

## 2. Colour (design tokens)

Declared as CSS custom properties on `:root`. **Never hard-code a colour in a component** —
always use a token.

### Light theme (default)

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F7F9FC` | Page background (cool white) |
| `--surface` | `#FFFFFF` | Cards, info strips |
| `--ink` | `#131C2E` | Primary text (deep navy) |
| `--ink-soft` | `#46536B` | Secondary text, descriptions |
| `--line` | `#DDE4EF` | Borders and rules |
| `--accent` | `#2050D8` | Cobalt — **Part 1: Weeks 1–5, the three tools** |
| `--teal` | `#0E8A7B` | Teal — **Part 2: Weeks 6–12, organising programs** |
| `--amber` | `#B45309` | **Assessment milestones** (code comprehension weeks) |
| `--red` | `#C23A3A` | Deadline / no-lab warnings |
| `--java` | `#A25B12` | Java language badge |
| `--python` | `#2D6CA8` | Python language badge |
| `--green` | `#1B7F3B` | Correct answer in the quiz |
| `--code-bg` | `#0A111E` | Code card background — "Midnight", independent of site theme |

### Colour principles

- Colour **encodes the structure of the subject**: cobalt = Part 1, teal = Part 2. Anything
  belonging to a part (card, schedule row, phase label) uses that part's colour.
- Amber and red are **semantic**, for assessment milestones and warnings. Never decorative.
- `--java` / `--python` appear **only** on language badges and never carry part meaning —
  this subject teaches both languages across both parts, so they are orthogonal axes.
- Tinted backgrounds are made with `color-mix(in srgb, var(--token) N%, transparent)`
  rather than by introducing new hex values.

### Code theme (independent of the site's light/dark)

Code colours do **not** follow the page's light/dark setting. A separate button
(`#code-theme-toggle`) cycles three themes, stored in `localStorage['p1-code-theme']` and
applied via `[data-code-theme]` on `<html>`:

- **Midnight** (default, no attribute) — deep navy.
- **Paper** — near-white background, dark text, for anyone who finds dark code hard to read.
- **Contrast** — pure black with vivid tokens.

### Dark theme

All three theme states must be supported:

1. `:root` — the complete light palette (default).
2. `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`.
3. `:root[data-theme="dark"]` — an explicit user choice.

Dark uses `--paper: #0D1420`, `--surface: #151F30`, `--ink: #E8EDF6`, with accent, teal,
amber, red, java and python all **lightened** for contrast. **Never declare a colour only
inside a dark or light block without a `:root` default.**

## 3. Typography

| Role | Font | Weight | Used for |
|---|---|---|---|
| Display | **Archivo** | 700–800 | `h1`, `h2`, `h3` |
| Body | **Be Vietnam Pro** | 400–600 | Running text, descriptions |
| Utility | **IBM Plex Mono** | 400–600 | Week numbers, percentages, eyebrows, chips, badges, code |

- Google Fonts, `vietnamese` subset. Always keep a fallback stack.
- Body `16.5px` / line-height `1.65`. Prose limited to about `34–46rem`.
- Large headings use `clamp()`, slight negative letter-spacing and `text-wrap: balance`.
- Uppercase eyebrows and labels: mono, `letter-spacing: 0.1em–0.14em`.
- Columns of figures use `font-variant-numeric: tabular-nums`.

## 4. Layout & spacing

- Container `.wrap`: `max-width: 68rem`, horizontal padding `1.5rem`.
- Space siblings with flex/grid `gap`, **not** per-element margins.
- Cards: `border-radius: 10–12px`, `1px solid var(--line)`, the `--shadow` token.
- Breakpoints: `900px` (grids 3→1), `820px` (hero 2→1, facts 4→2), `720px`, `640px`
  (topnav hidden), `560px` (schedule to one column).
- Wide content (code, tables) must sit inside an `overflow-x: auto` container
  (`.tbl-scroll`).

## 5. Components

- **Topbar** — sticky, blurred background, mono wordmark `41039 · Programming 1`, anchor
  links, then the theme and code-theme buttons in `.display-controls`.
- **Hero** — two columns: headline plus meta chips on the left, code card(s) on the right.
  The homepage uses `.code-duo` to stack **Hello.java above hello.py**, which is the single
  clearest statement of what this subject is.
- **Facts strip** — four quick figures (subject code, duration, labs start, pass mark).
- **Part card** (`.part`) — 3px top border in the part colour, mono tag, topics as pills.
- **Outcome group** — checklist with a teal `✓`. Each `<li>` is `display: grid` with a
  narrow marker column, so **the whole item body must be wrapped in one element**
  (`<li><span>…</span></li>`); a bare `<strong>` plus loose text produces two grid items
  and the text collapses into the 1.15rem column.
- **Grade bar** — flex segments whose `flex` values are the real weights (30/25/25/20), so
  the width *is* the data. Carries `role="img"` and a full `aria-label`.
- **Week row** (`.week`) — grid `5.2rem | 1fr`, 3px left border in the part colour.
  `.special.midterm` tints the row and shows a mono `.badge` for an assessment milestone.
  `.langs` holds the Java/Python badges for that week.
- **Language badge** (`.lang.java` / `.lang.python`) — mono, uppercase, outlined in the
  language token.
- **Mat card** (`.mat-card`) — links to a week page or an external resource; 3px top
  border, `.playground` variant is teal, `.supp` variant is dashed.
- **Note / callout** (`.note`) — 3px left border, variants `tip` (teal), `warn` (amber),
  `danger` (red), with a mono uppercase `.tag`.
- **Concept** (`.concept`) — the prose unit on week pages; `h3` carries a mono `.idx`
  number such as `1.4`.
- **Data table** (`.tbl`) — small uppercase header on a 5% accent tint, mono cells for code.
- **Fold** (`details.fold`) — a collapsible lecture section on a week page, one per section
  of the slide deck. Native `<details>`/`<summary>`, so it is keyboard accessible and still
  works with JavaScript disabled; the chevron rotates via `[open]`. `summary` carries a mono
  `.fold-num`, an Archivo `.fold-title`, and a `.fold-meta` count that is hidden below 560px.
  Section 01 ships open, the rest closed.
- **Figure** (`.fig`) — a comic or photograph with a caption and a `.credit` line. Comics sit
  on a white pad (`.fig` default) because xkcd's PNGs have transparent backgrounds and would
  be invisible in dark mode; `.fig.plain` removes the pad. Width is capped by `.fig-narrow`
  (30rem) or `.fig-wide` (46rem) so a wide strip and a tall comic both read well.
- **Joke** (`.joke`) — amber pull-quote box with a mono `.attrib` line, matching the deck's.
- **Console** (`.console`) — the runnable code widget. Head with a title plus either a
  language badge or `.lang-tabs`; an optional `.preset-row` of example programs; a dark
  `.console-editor` textarea; a labelled `.console-stdin`; an amber `.console-boot` strip
  shown only while a runtime downloads; a `.console-bar` with Run, Reset and status; and a
  `.console-out` pane where errors are wrapped in `.err`. The editor and output share the
  `--code-*` tokens, so the code-theme button restyles them too.
  · **Editing** happens in an `.editor-shell`: a transparent `<textarea class="code-edit">`
  sits exactly on top of a highlighted `<pre class="hl-layer">`. Both must keep **identical**
  font, size, line-height, letter-spacing, padding and `white-space`, or the caret drifts away
  from the text under it. Verified pixel-exact (scrollWidth delta 0); no letter-spacing fudge
  is needed, so do not add one.
  · The shell carries `resize: vertical` because an absolutely positioned textarea cannot
  be resized natively, and **Expand** (`.expand-btn`) toggles `.console.expanded`, a fixed
  full-viewport overlay closed with Esc.
- **Token palette** (`--code-hl-*`) — editor colours follow the **code theme**, not the site's
  light/dark, exactly like `--code-*`. Three sets: midnight, paper, contrast.
- **Quiz** (`.quiz-q`, `.opt`) — question cards; options are buttons with mono A–D keys.
  After grading: correct answer outlined in `--green`, a wrong pick outlined in `--red`,
  and the explanation `.why` appears with a teal left border. The `.quiz-bar` is sticky
  below the topbar and holds grade/reset plus the score.

## 6. Accessibility & motion

- Visible focus everywhere: `outline: 2px solid var(--accent)`.
- `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`.
- No decorative animation; effects limited to hover and focus.
- Purely decorative elements (hero code cards) are `aria-hidden="true"`; the grade bar has
  `role="img"` and a complete `aria-label`.
