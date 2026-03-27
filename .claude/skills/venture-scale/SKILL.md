---
name: venture-scale
description: Analyze a pitch deck PDF against the Venture Scale investor checklist (45 questions, stage-gated). Produces a scored markdown report and interactive HTML playground. Use when a user wants to evaluate a pitch deck, score a startup, or run investor due diligence.
---

# Venture Scale — Pitch Deck Analyzer

Evaluate a pitch deck against the Venture Scale investor checklist: 45 questions across 8 categories (Team, Problem, Solution, Market, Business Model, Value Creation, Competition, Exit), scored at the appropriate stage.

## Step 1: Detect Environment and Find the Deck

First, determine where we are and find the pitch deck.

**If ARGUMENTS contain a file path:** Use that path directly. Output reports to the same directory as the PDF.

**If in the venture-scale repo (input/ directory exists at repo root):**

1. Use Glob to find PDFs in `input/`: `input/*.pdf` and `input/*.PDF`
2. If exactly 1 PDF found → use it
3. If multiple PDFs found → list them and ask the user which one to analyze
4. If no PDFs found → tell the user: "Drop a pitch deck PDF into the `input/` folder and run `/venture-scale` again."
5. If `input/` doesn't exist → create `input/`, `done/`, and `reports/` directories, then prompt

**If NOT in the venture-scale repo (no input/ directory):**

Tell the user:
> To use /venture-scale, set up a workspace:
> ```
> mkdir -p venture-scale/{input,done,reports}
> ```
> Drop your pitch deck PDF into `venture-scale/input/` and run `/venture-scale` again.
>
> Or provide a path directly: `/venture-scale /path/to/deck.pdf`

**Stop here if no deck is found.** Do not proceed without a PDF.

## Step 2: Ask for Stage

Ask the user:

> **What stage is this company raising at?**
>
> 1. **Pre-Seed** — idea/early validation (19 criteria)
> 2. **Seed** — product-market fit signals (34 criteria)
> 3. **Series A+** — proven PMF, scaling (all 45 criteria)

Wait for their answer before proceeding.

## Step 3: Read the Pitch Deck

Read the entire PDF using the Read tool. PDFs over 10 pages must be read in chunks (max 20 pages per request).

Read pages 1-10, then 11-20, etc.

After reading, extract:
- **Company name** (from title slide — if unclear, ask the user)
- **One-line description** of what the company does
- **Revenue** (if stated)
- **Fundraising ask** (amount and stage, if stated)
- **Any other key metrics** visible in the deck

Normalize the company name for filenames: lowercase, spaces to hyphens, remove special characters.
Example: "Gold Dealers" → `gold-dealers`

## Step 4: Run the Checklist Analysis

Analyze the deck against every question below that is active at the selected stage. For each question:

1. **Score it:**
   - **Verified** — an investor can quickly confirm this from the deck alone
   - **Quick Win** — this is likely true about the business, but the deck doesn't surface it clearly (a deck edit would fix it)
   - **Gap** — not demonstrated, not addressed, or appears to be false

2. **Write analysis notes** (1-3 sentences) explaining your reasoning. Be specific — reference actual slides, numbers, or claims from the deck. Don't be vague.

3. **If the question is NOT active at the selected stage**, mark it as excluded. Still note what you observe, but don't count it in the score.

### Scoring Guidelines

**Verified examples:**
- Revenue numbers are clearly stated with year labels
- Team bios show relevant domain experience
- TAM is stated with a source or bottom-up calculation
- Competitive positioning map shows clear differentiation

**Quick Win examples:**
- Founders bootstrapped for 3 years (shows grit) but the deck buries this in a stat instead of telling the story
- Strong repeat purchase rate exists but isn't framed as predictable revenue
- Supply chain is diversified but not mentioned anywhere

**Gap examples:**
- No team member owns customer acquisition and it's not addressed
- No mention of IP, trademarks, or any defensibility
- Revenue projections show margins jumping from 6% to 50% with no justification

### The Checklist

**IMPORTANT:** For questions about negative traits (skill gaps, over-reliance, cashflow limitations), the scoring is inverted:
- **Verified** = the deck shows there is NO problem (e.g., not overly reliant)
- **Gap** = the deck reveals a problem or doesn't address it

#### Team
*Evaluates whether the founding team inspires confidence through experience, skills, character, and completeness.*

| # | Question | Min Stage |
|---|----------|-----------|
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

#### Problem
*Tests whether the problem is real and validated, and whether this team is uniquely positioned to solve it.*

| # | Question | Min Stage |
|---|----------|-----------|
| 1 | Can you demonstrate that the problem truly exists (through validation)? | Pre-Seed |
| 2 | Is your company uniquely placed to solve this problem? | Seed |

#### Solution
*Assesses whether customers love the product, whether it solves a real pain, and whether the solution can scale.*

| # | Question | Min Stage |
|---|----------|-----------|
| 1 | Can you show that customers actually like your solution? | Seed |
| 2 | Is your product a true painkiller, or merely a vitamin? | Pre-Seed |
| 3 | Is it 50% cheaper or faster? | Pre-Seed |
| 4 | Does it scale effectively? | Series A+ |

#### Market
*Evaluates the size, growth trajectory, and timing of the market opportunity, plus the go-to-market plan.*

| # | Question | Min Stage |
|---|----------|-----------|
| 1 | Do you have a sufficiently large (>$1bn) TAM? | Pre-Seed |
| 2 | Is your TAM realistic? | Seed |
| 3 | Will the market grow over time? | Pre-Seed |
| 4 | Is the market in the middle of a shift? | Pre-Seed |
| 5 | Do you have a solid Go-To-Market plan? | Seed |
| 6 | How aware are customers of the problem? | Seed |

#### Business Model
*Stress-tests the revenue model, projections, pricing, and key dependencies for concentration risk.*

| # | Question | Min Stage |
|---|----------|-----------|
| 1 | Are your revenue projections realistic? | Seed |
| 2 | Do you have a customer acquisition plan? | Seed |
| 3 | Is your pricing model clear and simple? | Pre-Seed |
| 4 | Does your model benefit from network effects? | Series A+ |
| 5 | Does your model generate recurring revenue? | Series A+ |
| 6 | Do you have any obvious cashflow limitations? | Seed |
| 7 | Are you overly reliant on a specific customer segment? | Seed |
| 8 | Are you overly reliant on a specific employee type? | Series A+ |
| 9 | Are you overly reliant on a specific supplier? | Seed |

#### Value Creation
*Examines the uniqueness of the offering, its defensibility (legal and creative), and the realistic revenue ceiling.*

| # | Question | Min Stage |
|---|----------|-----------|
| 1 | What is your unique selling point (USP)? | Pre-Seed |
| 2 | Is your USP legally defensible? | Series A+ |
| 3 | Is your USP creatively defensible? | Seed |
| 4 | Does your business have genuinely high ($100M+/yr) revenue potential? | Series A+ |

#### Competition
*Tests whether you have a defensible head start and whether competitors face real barriers to copying you.*

| # | Question | Min Stage |
|---|----------|-----------|
| 1 | Do you have an early mover advantage? | Seed |
| 2 | Do you have a logical acquiring company? | Series A+ |
| 3 | Do your competitors have significant barriers to entry? | Series A+ |

#### Exit
*Assesses whether investors can see a clear path to returns — via IPO, acquisition, or strong industry multiples.*

| # | Question | Min Stage |
|---|----------|-----------|
| 1 | Are you a realistic prospect for a future IPO? | Series A+ |
| 2 | Are you a realistic prospect for a future acquisition? | Series A+ |
| 3 | Does your industry vertical have a strong exit multiple? | Series A+ |

After scoring all active questions, identify:
- **Top 5 Quick Wins** — the most impactful quick wins that would improve the deck with minimal effort (deck edits only)
- **Top 3 Structural Gaps** — the most concerning gaps that require actual business changes

## Step 5: Write the Markdown Report

Write the analysis to `reports/<company-name>-checklist.md` using the Write tool.

Use this exact structure:

```
# <Company Name> - Venture Scale Checklist Analysis

**Company:** <name> (<one-line description>)
**Stage:** <selected stage> (<N> criteria evaluated)
**Revenue:** <revenue if stated, otherwise "Not disclosed">
**Ask:** <fundraising amount if stated, otherwise "Not disclosed">

> Scoring: Verified = clear from deck | Quick Win = true but not surfaced | Gap = not demonstrated

---

## Team (X/Y verified at <stage>)

| # | Question | Score | Notes |
|---|----------|-------|-------|
| 1 | <question> | <Verified/Quick Win/Gap> | <1-3 sentence analysis> |

**Quick wins:**
- <actionable recommendation>

---

(repeat for each of the 8 categories)

---

## Summary Scorecard

| Category | Verified | Quick Wins | Gaps | At Stage |
|----------|----------|------------|------|----------|
| Team | X | Y | Z | N |
| Problem | ... | ... | ... | ... |
| Solution | ... | ... | ... | ... |
| Market | ... | ... | ... | ... |
| Business Model | ... | ... | ... | ... |
| Value Creation | ... | ... | ... | ... |
| Competition | ... | ... | ... | ... |
| Exit | ... | ... | ... | ... |
| **Total** | **X** | **Y** | **Z** | **N** |

**Overall: X/N verified (P%) | Y quick-win opportunities | Z structural gaps**

---

## Top 5 Quick Wins

These are deck edits, not business changes:

1. **<title>** — <1-2 sentence description>

## Top 3 Structural Gaps

These require actual business changes:

1. **<title>** — <1-2 sentence description>
```

For questions that are excluded at the selected stage, do NOT include them in the markdown report. Only show active questions.

## Step 6: Generate the HTML Playground

Write an interactive HTML file to `reports/<company-name>-checklist.html` using the Write tool.

The HTML file must be a single self-contained file with all CSS and JS inlined. No external dependencies.

### How to generate it

Read the template file at `.claude/skills/venture-scale/template.html` in this repo. Then:

1. Replace the `<title>` with `<Company Name> - Pitch Deck Evaluation`
2. Replace the header h1 with the company name
3. Replace the header-meta spans with the company's actual metrics (revenue, growth, ask, source)
4. Replace the `const data = { ... }` block with the real analysis data
5. Set `let currentStage = N;` to match the selected stage (0=Pre-Seed, 1=Seed, 2=Series A+)

The data is a JavaScript object matching this structure:

```javascript
const data = {
  categories: [
    {
      name: "Team",
      description: "Evaluates whether the founding team inspires confidence through experience, skills, character, and completeness.",
      questions: [
        {
          q: "Do you have strong experience in the space?",
          s: "amber",    // "green" = Verified, "amber" = Quick Win, "red" = Gap
          stage: 0,      // 0=Pre-Seed, 1=Seed, 2=Series A+
          n: "Analysis notes here..."
        }
        // ... all questions in this category
      ],
      quickwins: [
        "First quick win recommendation"
      ]
    }
    // ... all 8 categories
  ],
  topQuickWins: [
    { title: "Title", desc: "Description", stage: 0 }
    // ... up to 5
  ],
  structuralGaps: [
    { title: "Title", desc: "Description", stage: 0 }
    // ... up to 3
  ]
};
```

Write the complete file to `reports/<company-name>-checklist.html`.

## Step 7: Move Deck and Open Report

After writing both report files:

1. **Move the source PDF** to the `done/` folder:
   ```
   mv input/<original-filename>.pdf done/<company-name>.pdf
   ```
   (Use Bash tool for the move)

2. **Open the HTML report** in the user's browser:
   ```
   open reports/<company-name>-checklist.html
   ```
   (Use Bash tool)

3. **Summarize to the user:**

   > **Analysis complete for <Company Name>**
   >
   > - Score: X/N verified (P%) at <Stage>
   > - Quick wins: Y opportunities (deck edits)
   > - Gaps: Z structural issues
   >
   > Reports saved:
   > - `reports/<company-name>-checklist.md` — share with your AI
   > - `reports/<company-name>-checklist.html` — opened in browser
   >
   > Deck moved to `done/<company-name>.pdf`
