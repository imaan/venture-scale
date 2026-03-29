# Venture Scale — Base Research Document

> **Source:** claude-mem, venture-scale repo, founder input (2026-03-29)
> **Stage:** Pre-MVP. Getting the first version online. Not launching yet.

---

## 1. What Venture Scale Is

A pitch deck analysis tool that evaluates startup decks against a 45-question investor checklist. Originally built as part of a company Imaan ran during COVID that identified startups and connected them with VCs (aiming for carry on the backend). The company was gaining traction but collapsed when the VC market crashed with rising interest rates.

The checklist was built from real experience — hundreds of companies analyzed, dozens of investors consulted. The questions are designed to be fundamental and timeless, not era-specific or market-specific.

### What It Actually Measures

**This is not "is the company good?" — it's "is the deck communicating everything it could be?"**

The tool checks whether the deck surfaces the information investors look for. Three outcomes per question:

- **Verified** — the deck clearly communicates this. Good.
- **Quick Win** — true about the business but not surfaced in the deck. A deck edit fixes it.
- **Gap** — not demonstrated or false. Structural problem that may require business changes.

The insight: it's no good having strong fundamentals if you're not communicating them. This tells you what to fix in the deck vs. what to fix in the business.

Rule of thumb: if you're ticking 80%+ of the boxes, you're probably fine.

### Stage Gating

Not all criteria matter at every stage:
- **Pre-Seed:** 19 questions (core team, thesis, market size, basic product)
- **Seed:** 34 questions (+ traction, GTM, projections, commercial awareness)
- **Series A+:** 45 questions (+ scalability, defensibility, exit planning)

### Current Implementation

Claude Code skill. Drop a PDF, pick the stage, get a scored markdown report + interactive HTML playground. Pure prompt engineering, no code dependencies. Repo at github.com/imaan/venture-scale.

---

## 2. Target Market

**Primary:** VCs and anyone who reviews a lot of investment decks — angel investors, accelerator programs, venture scouts, intro services, pitch deck consultants.

**Secondary (future):** Founders preparing decks. But the edge is on the reviewer side — the tool was built from the investor perspective.

**Expansion potential:** Other investment types (real estate, private equity) but each requires building a new checklist from scratch by talking to investors in that space. Not pursuing now — staying focused on VC/startups.

---

## 3. Revenue Model

**Approach:** Start free. Ship it online as-is. If people request features, ask if they'd pay, how much, get cheap early payments, build more, keep iterating price upward.

No revenue targets yet. This is about getting it in front of people and seeing what happens.

---

## 4. Current Status

- Built and shipped as a Claude Code skill
- Tested on at least one real deck (Gold Dealers — men's jewelry e-commerce)
- Initial feedback positive — tester wanted to see more, said it would help them
- Published to GitHub, MIT license
- No marketing or distribution beyond the repo
- Pre-MVP — needs to become a simple web-based SaaS app

---

## 5. What Needs to Happen

Imaan needs market research to feed into productization agents that will help turn this into a simple, quick SaaS app. The goal is:
1. Get it online (web app, not just a Claude Code skill)
2. Give it to a few people he knows
3. Collect feedback and feature requests
4. Iterate from there

This is not a launch. This is the alpha.

---

## 6. Team

- **Imaan** — built the checklist, the skill, maintains the repo. Has the domain expertise from running the previous company.

---

## 7. Competitive Landscape

Not yet researched. Known space includes:
- Manual pitch deck review services
- AI pitch deck analyzers (various quality)
- Investor checklist frameworks
- The source checklist is from a Venture Scale Notion page built during the previous company

---

## 8. What's Missing

- [ ] Competitive landscape — who else does AI pitch deck analysis?
- [ ] Pricing benchmarks — what do similar tools charge?
- [ ] Distribution channels — where do VCs/reviewers discover tools?
- [ ] Feature prioritization — what would make this worth paying for?
- [ ] Technical architecture — what does the web app look like?
