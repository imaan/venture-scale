# Venture Scale Skill Design

**Date:** 2026-03-27
**Status:** Approved
**Scope:** Claude Code skill that analyzes pitch decks against the Venture Scale checklist

## Overview

A Claude Code skill (`/venture-scale`) that reads a pitch deck PDF, evaluates it against a 45-question investor checklist with stage-gating, and outputs both a markdown report (AI-shareable) and an interactive HTML playground (human-shareable).

## User Flow

```
User runs /venture-scale
  → Skill detects environment (own repo vs. installed globally)
  → Finds PDF(s) in input/ folder
  → Asks user to select stage: Pre-Seed / Seed / Series A+
  → Reads all pages of the PDF
  → Runs 45-question analysis with scoring
  → Writes reports/<company>-checklist.md
  → Writes reports/<company>-checklist.html
  → Moves PDF to done/<company>.pdf
  → Opens HTML in browser
```

## Environment Detection

### In-repo (user cloned venture-scale)

The skill checks for an `input/` directory at the repo root.

- **PDFs found in input/:** proceed with analysis
  - 1 PDF → use it
  - Multiple PDFs → list them, ask user to pick
- **No PDFs in input/:** tell user to drop a deck into `input/` and run again
- **input/ doesn't exist:** create it along with `done/` and `reports/`, then prompt

### Installed globally (different repo)

The skill detects it's not in the venture-scale repo (no `input/` dir, different repo name).

- Guide the user: "Create a folder structure for your analyses:"
  ```
  mkdir -p venture-scale/{input,done,reports}
  ```
- Accept a path argument as override: `/venture-scale /path/to/deck.pdf`
- When a path is provided, output reports to the same directory as the PDF

## Stage Selection

Three stages, presented as a choice:

| Stage | Questions Active | Description |
|-------|-----------------|-------------|
| Pre-Seed | 19 | Core team, thesis, market size, basic product |
| Seed | 34 | + traction, GTM, projections, commercial awareness |
| Series A+ | 45 | + scalability, defensibility, exit planning |

The skill asks: "What stage is this company raising at?" with the three options.

## The Checklist (45 Questions)

### Scoring System

Each question is scored from the deck materials alone:

- **Verified** — someone can quickly confirm this from the deck
- **Quick Win** — true about the business but not obvious from materials (deck edit fixes it)
- **Gap** — not demonstrated or false (may require business changes)

### Questions by Category

**Team (14 questions)**

| # | Question | Stage |
|---|----------|-------|
| 1 | Do you have strong experience in the space? | Pre-Seed |
| 2 | Can you demonstrate raw intellect? | Pre-Seed |
| 3 | Can you demonstrate integrity? | Pre-Seed |
| 4 | Are you mission driven? | Pre-Seed |
| 5 | Are you proven leaders? | Seed |
| 6 | Can you demonstrate a high level of commercial awareness? | Seed |
| 7 | Can you demonstrate a deep understanding of the market? | Seed |
| 8 | Can you demonstrate grit and tenacity? | Pre-Seed |
| 9 | Can you demonstrate deep technical skills? | Pre-Seed |
| 10 | Is your team sufficiently diverse? | Seed |
| 11 | Are there any clear skill gaps in your team? | Seed |
| 12 | Does your team contain a customer acquisition expert? | Seed |
| 13 | Does your team have a COO/logistics expert? | Series A+ |
| 14 | Can you demonstrate humility? | Pre-Seed |

**Problem (2 questions)**

| # | Question | Stage |
|---|----------|-------|
| 1 | Can you demonstrate that the problem truly exists (through validation)? | Pre-Seed |
| 2 | Is your company uniquely placed to solve this problem? | Seed |

**Solution (4 questions)**

| # | Question | Stage |
|---|----------|-------|
| 1 | Can you show that customers actually like your solution? | Seed |
| 2 | Is your product a true painkiller, or merely a vitamin? | Pre-Seed |
| 3 | Is it 50% cheaper or faster? | Pre-Seed |
| 4 | Does it scale effectively? | Series A+ |

**Market (6 questions)**

| # | Question | Stage |
|---|----------|-------|
| 1 | Do you have a sufficiently large (>$1bn) TAM? | Pre-Seed |
| 2 | Is your TAM realistic? | Seed |
| 3 | Will the market grow over time? | Pre-Seed |
| 4 | Is the market in the middle of a shift? | Pre-Seed |
| 5 | Do you have a solid Go-To-Market plan? | Seed |
| 6 | How aware are customers of the problem? | Seed |

**Business Model (9 questions)**

| # | Question | Stage |
|---|----------|-------|
| 1 | Are your revenue projections realistic? | Seed |
| 2 | Do you have a customer acquisition plan? | Seed |
| 3 | Is your pricing model clear and simple? | Pre-Seed |
| 4 | Does your model benefit from network effects? | Series A+ |
| 5 | Does your model generate recurring revenue? | Series A+ |
| 6 | Do you have any obvious cashflow limitations? | Seed |
| 7 | Are you overly reliant on a specific customer segment? | Seed |
| 8 | Are you overly reliant on a specific employee type? | Series A+ |
| 9 | Are you overly reliant on a specific supplier? | Seed |

**Value Creation (4 questions)**

| # | Question | Stage |
|---|----------|-------|
| 1 | What is your unique selling point (USP)? | Pre-Seed |
| 2 | Is your USP legally defensible? | Series A+ |
| 3 | Is your USP creatively defensible? | Seed |
| 4 | Does your business have genuinely high ($100M+/yr) revenue potential? | Series A+ |

**Competition (3 questions)**

| # | Question | Stage |
|---|----------|-------|
| 1 | Do you have an early mover advantage? | Seed |
| 2 | Do you have a logical acquiring company? | Series A+ |
| 3 | Do your competitors have significant barriers to entry? | Series A+ |

**Exit (3 questions)**

| # | Question | Stage |
|---|----------|-------|
| 1 | Are you a realistic prospect for a future IPO? | Series A+ |
| 2 | Are you a realistic prospect for a future acquisition? | Series A+ |
| 3 | Does your industry vertical have a strong exit multiple? | Series A+ |

## Output 1: Markdown Report

File: `reports/<company-name>-checklist.md`

Structure:
```markdown
# <Company> - Venture Scale Checklist Analysis

**Company:** <name> (<one-line description>)
**Stage:** <selected stage>
**Revenue:** <if available>
**Ask:** <if available>

> Scoring: Verified = clear from deck | Quick Win = true but not surfaced | Gap = not demonstrated

---

## <Category> (X/Y at stage)

| # | Question | Score | Notes |
|---|----------|-------|-------|
| 1 | ... | ... | ... |

Quick wins:
- ...

(repeat for each category)

---

## Summary Scorecard

| Category | Verified | Quick Wins | Gaps | At Stage |
|----------|----------|------------|------|----------|
| ... | ... | ... | ... | ... |
| **Total** | **X** | **Y** | **Z** | **N** |

**Overall: X/N verified (P%) | Y quick-win opportunities | Z structural gaps**

## Top Quick Wins (deck edits)
1. ...

## Top Structural Gaps (business changes)
1. ...
```

## Output 2: HTML Playground

File: `reports/<company-name>-checklist.html`

Self-contained single HTML file with:
- Light/dark mode toggle (respects system preference, persists in localStorage)
- Stage selector (Pre-Seed / Seed / Series A+) that recalculates scores dynamically
- Donut chart showing verified percentage
- Stacked bar chart per category
- Expandable category sections with each question, score, and notes
- Category descriptions explaining what each section tests
- Filter buttons (All / Verified / Quick Wins / Gaps / Not expected at stage)
- Quick wins and structural gaps recommendation cards
- Fully responsive

The HTML template is embedded in the skill prompt. The skill populates the JavaScript data object with the analysis results and writes the complete file.

## Company Name Extraction

The skill extracts the company name from the deck content (typically the first slide / title page). If the name is unclear or ambiguous, it asks the user to confirm.

The company name is normalized for filenames: lowercased, spaces replaced with hyphens, special characters removed.

Example: "Gold Dealers" → `gold-dealers-checklist.md`, `gold-dealers-checklist.html`

## File Operations

After analysis:
1. Write markdown to `reports/<company>-checklist.md`
2. Write HTML to `reports/<company>-checklist.html`
3. Move source PDF to `done/<company>.pdf`
4. Open HTML file in browser via `open <path>`

## Directory Structure

```
venture-scale/
├── .claude/
│   └── skills/
│       └── venture-scale/
│           └── SKILL.md          ← the skill definition
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-03-27-venture-scale-skill-design.md
├── input/                         ← drop decks here (.gitkeep)
├── done/                          ← processed decks (.gitignored)
├── reports/                       ← output reports (.gitkeep)
├── .gitignore                     ← ignore done/*.pdf, input/*.pdf
└── README.md
```

## What the Skill Prompt Contains

The SKILL.md file contains:
1. Trigger description and invocation instructions
2. Environment detection logic
3. The full 45-question checklist with stage tags and category descriptions
4. Scoring instructions with examples of what each score level means
5. Markdown report template
6. The complete HTML playground template (the one we built, with data placeholders)
7. File operation instructions (write reports, move PDF, open browser)

## Constraints

- No external dependencies — the skill is pure prompt + file operations
- No API calls — uses the Claude model already running in the Claude Code session
- PDF reading uses Claude Code's built-in PDF reader (Read tool with pages parameter)
- HTML template is fully embedded (works offline)
- All output is deterministic in structure (same template every time)

## Future (tracked in GitHub issues)

- imaan/venture-scale#1: "Share with your AI" button in HTML output
- imaan/venture-scale#2: Web app with login, credits, payments
- imaan/venture-scale#3: Model quality benchmarking for cheapest viable option
- imaan/venture-scale#4: Custom/fine-tuned model exploration
