# Venture Scale: Action Brief

> **For:** NotebookLM synthesis steering + standalone "what to do next" reference
> **Stage:** Pre-revenue alpha. Ship it, share it, see what happens.
> **Date:** 2026-03-29

---

## Part 1: Most Interesting Findings

### 1. The real competition is DIY ChatGPT, not other tools

Out of 20+ AI pitch deck analysis tools on the market, only 5-7 are built for the investor side. But that competitive map is almost irrelevant. 85% of VCs already use AI daily. The actual alternative to Venture Scale is an associate pasting a deck into ChatGPT — a tool they already pay $20/month for. That's the bar: not "is this better than VentureLens?" but "is this obviously better than what I'd get from a ChatGPT prompt?" The structured 45-question framework, stage-gating, and three-tier output (Verified / Quick Win / Gap) are the answer — consistency and comparability across every deck, something ad-hoc prompting cannot deliver. But the competitor isn't a startup. It's an existing subscription and a habit.

### 2. Unit economics are absurdly good — cost is not the constraint

COGS per analysis range from $0.03 (Haiku with caching) to $0.30 (Opus 4.6). Even at the recommended Sonnet 4.6 with prompt caching, it's roughly $0.08-$0.12 per analysis. That gives you gross margins of 66% at $5/month, 89% at $39/month, and 96% on a $15/deck model. You could run this on the most expensive model available and still have 94% gross margin at $15/deck. The cost structure is pure inference — no data enrichment, no CRM sync, no proprietary datasets. This is a business where the product can be practically free to run. The only question is willingness-to-pay.

### 3. The $5/month plan leaves $25-$45/month on the table

Market comps cluster at $30-$100/month (Pitch Deck Scanner, VentureLens subscription). The planned $5/month price is rational for a lead-gen-first strategy — low friction, feels like a gift, not a sales pitch. But know what you're giving up: at 100 paid users, $5/month is $6K/year; $39/month is $46.8K/year. Same user base, 8x the revenue. The relationship-opener framing justifies the discount, but only if the relationships are actually more valuable than the revenue. That's something to test, not assume.

### 4. The investor-facing niche is real and underserved

The vast majority of deck analysis tools help founders improve their pitches. Of the 5-7 investor-facing tools, three are data extraction plays (DeckMatch, Pitch Deck Scanner, V7 Go), two have limited traction (Pitchflow, VCFlow.AI), one bundles expensive psychological assessments (Unbiased Ventures), and one produces freeform risk reports (VentureLens). Nobody owns "structured investor checklist for deck screening." The quadrant of deep evaluation + investor-facing is nearly empty.

### 5. The Quick Win category is genuinely novel

Every competitor produces either a numeric score or prose feedback. None of them separate deck problems from business problems. The three-tier output — Verified, Quick Win, Gap — is unique. "Quick Win" specifically ("the company has this but the deck doesn't show it") is a category no other tool surfaces. This distinction between "fix your deck" and "fix your business" is immediately useful for deciding whether to take a meeting, and it's the kind of insight that makes an analysis worth forwarding.

### 6. Associates are drowning and VCs discover tools through peers

VC associates review 50-200 pitch decks per month. They spend 5-10 hours per week on manual screening. Only 12.1% of decks are "clearly fundable" (SaaStr data, 2,000+ analyzed). A tool that screens a deck in 30 seconds instead of 5 minutes directly addresses their biggest pain point. And the #1 channel for VC tool adoption is peer recommendation — not Product Hunt, not newsletters. A recommendation from a trusted peer eliminates the evaluation burden. This means the alpha strategy (DM 10-15 VCs personally, let the output sell itself) isn't just cheap. It's the highest-conversion approach.

### 7. Granola and DeckMatch validate the playbook and the category

Granola targeted VCs first because they "conduct a lot of calls, share a lot of notes, love to try new AI products, have high willingness to pay, and have very influential networks." They went from $0 to $1.5B in about two years through output-as-distribution — every shared note was a product demo. DeckMatch raised $3.1M specifically to help VCs analyze decks with AI, proving investors believe the category has legs. The playbook is proven and the category is funded.

### 8. The strategic fork: relationship-opener or standalone product

After alpha, one of two things will be true. Either the relationship-opener works — VCs respond, take meetings, some become regular users, and the product is a networking tool with a small SaaS stream — or the product has genuine standalone value — associates integrate it into screening workflows, and it should be priced at market rates ($30-$50/month) with real features (batch, CRM, team sharing). These paths are not mutually exclusive, but one will dominate. Alpha data will make it obvious which to pursue. Every decision before then — pricing, features, positioning — should be made knowing this fork exists.

---

## Part 2: Questions to Answer Together

These are open questions that require founder judgment or alpha data, not more research. This is the heaviest section because it should be at pre-revenue — there are more unknowns than knowns.

### From the business analysis — answer after alpha

These nine questions came out of the unit economics and growth lever analysis. At pre-revenue with zero paying customers, modeling answers would be fiction. Alpha exists to fill these in.

**Q1: What is the natural usage frequency for a VC associate?**
The entire margin model hinges on analyses-per-user-per-month. An associate screening 50-200 decks/month who runs every deck through the tool is a very different customer than one who uses it on 5-10 "maybe" decks. Usage frequency determines whether $5/month is a gift or $39/month is justified. Track analyses per user per week during alpha. Segment by role (associate vs. partner vs. angel).

**Q2: Does the free-to-relationship pipeline actually convert to VC conversations?**
The stated primary value is lead gen — getting meetings with VCs. If sharing the tool with 15 VCs generates zero follow-up conversations, the entire strategy fails regardless of product quality. This is the kill criterion. Track response rate and meeting rate from the first 15 outreaches. Target: 30%+ response, 15%+ meeting.

**Q3: Is there a usage cliff after initial trial?**
Many AI tools see high initial usage followed by rapid drop-off. If VCs try it on 3-5 decks and never return, the product is a novelty, not a tool. Retention after week 2 is the leading indicator of product-market fit. Target: 40%+ week-2 retention.

**Q4: Does sharing an analysis create a new user?**
The Granola/Superhuman playbook depends on usage driving distribution. If a VC forwards a Venture Scale analysis to their partner, does that partner sign up? The K-factor determines whether growth is linear (paid acquisition needed) or exponential (word of mouth sufficient). Add "Analyzed by Venture Scale" branding to outputs. Track referral source on signups.

**Q5: Which distribution channel produces the highest-intent users?**
Phase 1 (DMs to 10-15 VCs), Phase 2 (warm intros), and Phase 3 (Slack communities, X posts) will have different conversion rates. Knowing which channel produces users who actually retain determines where to focus. Tag users by acquisition channel. Compare retention and usage depth.

**Q6: Do founders become a demand channel?**
A founder who runs their own deck through Venture Scale might share it with their investors or other founders. The tool is investor-facing, but founder-side usage could be a distribution multiplier. PitchGrade built a business primarily on founder demand. Don't pursue this channel yet — observe whether it emerges.

**Q7: What feature request triggers willingness to pay?**
The strategy is to start free and let feature requests signal pricing. The hypothesis is that batch analysis, dashboard/history, and custom checklists are the likely paid triggers. But the market may surprise — it could be team sharing, CRM export, or something else. When users request features, ask: "Would you pay for this? How much?"

**Q8: Is the value in the analysis or in the framework?**
If VCs value the 45-question checklist itself as a thinking tool, the product might be better monetized as a framework license or training tool. If the value is in the automated analysis, the SaaS model is correct. Ask alpha users: "Do you find yourself using the checklist framework when you review decks manually, even without the tool?"

**Q9: What is the price sensitivity curve between $5 and $50/month?**
The $5/month plan leaves $25-$45/month on the table relative to comps. But the relationship-opener strategy requires low friction. Is there a price between $5 and $50 where you capture meaningful revenue without losing the "gift" framing? After alpha validates retention, test $19/month and $39/month tiers with different feature gates.

### Strategic questions — answer before or during alpha

**Q10: What's the absolute minimum web app to ship?**
PDF upload, stage selector (Pre-Seed / Seed / Series A+), structured analysis output, shareable URL, ephemeral (deck deleted after analysis). No auth, no accounts, no pricing page, no batch, no CRM, no history. One page. The question is whether you can resist adding anything else. Can the current Claude Code skill's analysis quality survive being wrapped in a simple web interface, or does the web version need its own prompt engineering pass?

**Q11: Who are the 10-15 VCs for the inner circle alpha?**
Write actual names. Not "VCs I know" — specific people. Prioritize: (a) associates and analysts who screen the most decks, (b) people who will give honest feedback, not polite encouragement, (c) people connected to other VCs who screen a lot. You probably want a mix of associates (who use it more) and partners (who make adoption decisions).

**Q12: How do you handle "I want to see someone else's analysis first"?**
VCs are risk-averse about trying new tools. Should there be a sample analysis on the landing page? A live sample they can scroll through might be more convincing than a Loom. But it sets expectations based on one deck's output quality. What's the Venture Scale equivalent of Granola's "Ask Granola" for non-users?

**Q13: The 45 questions are public. How much does that matter?**
The framework is on a public Notion page and an MIT-licensed repo. The moat is in the origin (hundreds of analyses, dozens of investors) and the judgment of which questions to ask at which stage, not secrecy. Haje Kamps publishes ~250 criteria openly and charges $15-49/review. But if DeckMatch decided to adopt a similar checklist approach, the open repo makes that easier. This is a "know the risk, decide if you care" question.

**Q14: When someone asks to white-label this for their accelerator — is that a yes?**
It will happen. Accelerator programs screen hundreds of applications. Enterprise/accelerator pricing in the market is $500-$2,000/month. White-labeling is meaningful revenue but a distraction from the VC relationship-opening mission. Is the answer "yes, but later" or "yes, and it's actually the first revenue play"?

**Q15: What does the Loom demo show?**
You need a 30-second Loom with an anonymized deck being analyzed. Which deck? How do you anonymize while keeping it realistic? The demo needs to show: how fast it is, what the output looks like, and the Verified/Quick Win/Gap distinction in action. Consider whether a GIF or short screen recording embedded in the DM is better than a Loom link (one fewer click).

---

## Part 3: 30-Day Action Plan

### Before Day 1

- [ ] **Build the simplest possible web app.** PDF upload. Stage selector. Analysis output. Shareable URL. Deck deleted after analysis. No auth. No accounts. No pricing. One page. The Claude Code skill already works — wrap it in the thinnest web layer you can.
- [ ] **Record a 30-second Loom** (or screen recording GIF) showing a real anonymized deck being analyzed. Show the upload, the stage selection, and scroll through the output. Highlight one Quick Win to demonstrate the unique value.
- [ ] **Write the list of 10-15 VCs by name.** Actual people. Include their role (associate vs. partner), how many decks they likely screen, and your relationship strength (direct vs. one-hop). Prioritize honest feedback givers over friendly encouragers.
- [ ] **Add "Analyzed by Venture Scale" branding to output.** Every shared analysis is a potential distribution event. Make sure it's obvious where it came from. Include a link back.

### Days 1-7: Inner Circle

- [ ] **DM 10-15 VCs personally.** Not email blasts. Not LinkedIn posts. Personal messages to specific people.
- [ ] **Use this framing:** "Built this for deck screening — structured analysis in under a minute. Try it on real decks, tell me what's missing." No pitch. No ask. Just "here's a useful thing, tell me if it actually is."
- [ ] **Track three things:** Who tries it. Who comes back to use it again. Who gives specific, actionable feedback (not "cool tool!").
- [ ] **Don't follow up aggressively.** If someone doesn't try it, they're not the right alpha user. Move on.
- [ ] **Start answering Q1-Q3 immediately.** Usage frequency, relationship conversion rate, and retention cliff are the three things alpha exists to measure. Set up the tracking from day one, even if it's a spreadsheet.

### Days 7-14: Iterate and Expand

- [ ] **Fix what's broken.** The first users will find the things you can't see. Output formatting, analysis quality on certain deck types, speed issues, mobile rendering — whatever they flag, fix it fast. Responsiveness to feedback is itself a relationship signal.
- [ ] **Ask each active user one question:** "Know anyone else who screens a lot of decks?" This is how Granola grew. Warm intros from real users convert at a completely different rate than cold outreach.
- [ ] **Second wave: 15-25 people** via those warm intros. Same framing. Same tracking.
- [ ] **Watch for Q6 signal.** Are any founders showing up unprompted? Don't pursue it, but notice it.

### Days 14-30: Assess

Look for four signals:

- [ ] **Repeat usage.** Are people analyzing more than one deck? Target: 5+ users analyze 3+ decks each.
- [ ] **Unprompted sharing.** Did anyone forward an analysis or mention the tool without being asked? Target: 2+ instances.
- [ ] **Feature requests.** Are people asking for things (batch upload, dashboards, custom checklists, CRM integration)? Target: 3+ specific requests. These become your first paid features and answer Q7.
- [ ] **Relationships opened.** Did the tool create conversations that wouldn't have happened otherwise? Target: 2+ new VC relationships. This answers Q2.

**Kill criteria:** Nobody uses it after sharing with 10-15 VCs. The product form factor is wrong. The checklist IP still has value — maybe it's a blog post, a framework others license, or a feature inside someone else's platform. But the standalone web app isn't the right container.

**Go criteria:** 5+ repeat users. Build more. Batch upload is almost certainly the first paid feature (associates who screen 50+ decks/month will pay for it). Keep the tool free for individual use, charge for volume and team features.

---

## The Bottom Line

After alpha, one of two things will be true: either the relationship-opener works and you've built a networking tool with a small SaaS stream, or the product has genuine standalone value and you've built the beginning of a real business. These lead to very different pricing, feature, and investment decisions. Everything before alpha is positioning for both paths simultaneously.

The unit economics say you can afford either path — COGS are negligible at any price point. The competitive landscape says the niche is real and nobody owns it. The distribution research says personal DMs to VCs, not launches, are how this gets adopted.

There is one question that determines which fork you take: **Is the analysis output good enough that a VC forwards it to their partner?** If an associate runs a deck through it and the structured output — the Verified items, the Quick Wins, the Gaps — is something they'd paste into Slack or attach to a memo, the distribution takes care of itself. Every forwarded analysis is a product demo. Every demo is a relationship opened. Every relationship is either the thing you're building toward (path 1) or a paying customer for what comes next (path 2).

Ship the web app. Send 15 DMs. Find out which fork you're on.
