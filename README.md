# Venture Scale

Evaluate pitch decks against the [Venture Scale Checklist](https://venture-scale.notion.site/The-Checklist-a04787b2ff8142cf85e896b343cf0888) — a 45-question investor framework that measures perceived certainty across Team, Problem, Solution, Market, Business Model, Value Creation, Competition, and Exit.

## How it works

1. Drop a pitch deck PDF into `input/`
2. Run `/venture-scale` in Claude Code
3. Pick the company's stage (Pre-Seed / Seed / Series A+)
4. Get a scored analysis with actionable recommendations

## Output

Each analysis produces two files in `reports/`:

- **`<company>-checklist.md`** — Markdown report (share with your AI for a second opinion)
- **`<company>-checklist.html`** — Interactive playground (share with humans via browser)

The HTML playground features:
- Stage selector that recalculates scores dynamically
- Light/dark mode
- Expandable categories with per-question scoring and notes
- Quick wins and structural gap recommendations

## Scoring

| Score | Meaning |
|-------|---------|
| Verified | Someone can quickly confirm this from the deck alone |
| Quick Win | True about the business, but not surfaced in materials (deck edit fixes it) |
| Gap | Not demonstrated or false (may require business changes) |

## Stage Gating

Not all criteria matter at every stage. The tool filters questions to what investors reasonably expect:

| Stage | Questions | Focus |
|-------|-----------|-------|
| Pre-Seed | 19 | Core team, thesis, market size, basic product |
| Seed | 34 | + traction, GTM, projections, commercial awareness |
| Series A+ | 45 | + scalability, defensibility, exit planning |

## Install as global skill

To use `/venture-scale` from any repo:

```bash
# Clone this repo
git clone https://github.com/imaan/venture-scale.git ~/code/active/venture-scale

# Symlink the skill to your global Claude skills
ln -s ~/code/active/venture-scale/.claude/skills/venture-scale ~/.claude/skills/venture-scale
```

Then run `/venture-scale` from anywhere. It will guide you through setting up the folder structure if needed.

## License

MIT
