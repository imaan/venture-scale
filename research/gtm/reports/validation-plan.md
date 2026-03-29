# Venture Scale — Validation Plan

> Goal: get the web app online, in front of 10-15 VCs, and find out if the analysis output is good enough to open relationships. Not a launch. An alpha.

---

## Proposed Decisions

### 1. No auth for alpha — YES
Keep it frictionless. No sign-up, no account. Just a URL, upload a PDF, get a report. Add auth later when you need to track usage or gate features. VCs won't create accounts for a tool they haven't tried.

### 2. Free, no pricing on the page — YES
This is a relationship tool first. Putting a price on it during alpha creates friction that works against the primary objective. When feature requests come in, that's when you ask "would you pay for this?"

### 3. Make the output shareable — YES
Every analysis should have a clean, shareable URL or downloadable HTML. If a VC can forward the analysis to their partner, that's your distribution engine. The Granola playbook: every shared output is a product demo.

### 4. Ephemeral by default — YES
Decks are confidential. Delete after analysis unless the user explicitly saves. VentureLens offers "private mode" — this should be the default, not an option.

### 5. 60-second target for analysis — YES
VCs spend 3 min 20 sec on a deck manually. The tool needs to beat that meaningfully. Under 60 seconds is the bar.

---

## MVP Definition

**The absolute minimum to test the core hypothesis ("is the output good enough to open relationships"):**

1. Single-page web app
2. PDF upload
3. Stage selector (Pre-Seed / Seed / Series A+)
4. Structured analysis output (the 45-question framework)
5. Shareable output URL or downloadable report
6. Deck deleted after analysis (ephemeral)

**Not in MVP:**
- User accounts / auth
- Batch upload
- History / dashboard
- CRM integration
- Custom checklists
- Pricing page

---

## Channel Sequencing

| Phase | When | Channel | Goal |
|-------|------|---------|------|
| 1 | Week 1-2 | Personal DMs to 10-15 VCs you know | Get the tool used on real decks |
| 2 | Week 3-4 | Warm intros from Phase 1 users | Expand to 25-40 users |
| 3 | Week 5-6 | X post + 1-2 VC Slack communities | Broader awareness, inbound interest |
| — | Not yet | Product Hunt, newsletters, LinkedIn content | Only after alpha is validated |

---

## 30-Day Timeline

### Before Day 1 (Now)
- [ ] Build the web app (PDF upload → stage select → analysis → shareable output)
- [ ] Record a 30-second Loom showing a real anonymized deck being analyzed
- [ ] List 10-15 VCs to share with personally

### Days 1-7: Inner Circle
- [ ] DM/text 10-15 VCs with the tool + Loom
- [ ] Framing: "Built this for deck screening — structured analysis in under a minute. Try it on real decks, tell me what's missing."
- [ ] Track: who tries it, who uses it more than once, who gives specific feedback

### Days 7-14: Iterate + Expand
- [ ] Fix what the first users tell you is broken
- [ ] Ask each user: "Know anyone else who screens a lot of decks?"
- [ ] Second wave: 15-25 people via warm intros

### Days 14-30: Assess
- [ ] Are people using it more than once? (retention signal)
- [ ] Are they sharing it unprompted? (virality signal)
- [ ] Are they giving feature requests? (engagement signal)
- [ ] Have any conversations opened that wouldn't have happened otherwise? (relationship signal)

---

## Validation Metrics

| Signal | What It Means | Target |
|--------|--------------|--------|
| Repeat usage | The analysis is actually useful | 5+ users analyze 3+ decks |
| Unprompted sharing | Output quality drives distribution | 2+ users share without being asked |
| Feature requests | People want more | 3+ specific requests |
| Conversations opened | The relationship strategy works | 2+ new VC relationships from the tool |
| "This is better than what I do manually" | Product-market fit signal | 3+ users say this |

### Kill Criteria
- Nobody uses it after sharing with 10-15 VCs = product form factor is wrong
- Universal feedback is "ChatGPT does this" = differentiation isn't landing
- Nobody shares or refers = output isn't good enough

### Go Criteria
- 5+ repeat users = people find it useful, build more
- Feature requests for batch/dashboard = first paid feature identified
- 2+ new VC relationships opened = strategic value confirmed

---

## What NOT to Do

- **Don't build batch upload yet.** It's the most obvious paid feature. Wait until someone asks for it.
- **Don't add a pricing page.** Free during alpha. Revenue comes from feature requests.
- **Don't launch on Product Hunt.** Too early. A VC who tries a half-baked tool once will never try it again.
- **Don't post on LinkedIn yet.** Save the content play for when you have aggregate data from analyzed decks.
- **Don't build CRM integration.** Affinity integration will be expected eventually but is a significant engineering effort. Not alpha.
- **Don't expand beyond VC/startups.** Real estate, PE, etc. require entirely new checklists. Stay focused.
- **Don't over-engineer the web app.** The Claude Code skill already works. Wrap it in the simplest possible web interface.
