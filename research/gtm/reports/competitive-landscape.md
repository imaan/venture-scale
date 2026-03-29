# Venture Scale: Competitive Landscape Research

**Date:** 2026-03-29
**Subject:** AI Pitch Deck Analysis Tools -- Competitive Landscape for Venture Scale

---

## Executive Summary

The AI pitch deck analysis market is crowded but shallow. There are 20+ tools that claim to analyze pitch decks with AI, but the overwhelming majority (roughly 85-90%) are **founder-facing** -- they help startups build better decks or prepare for fundraising. The **investor-facing** segment -- tools that help VCs, angels, and scouts screen and evaluate inbound deal flow faster -- is significantly smaller and less mature, with only 5-7 tools specifically built for this use case.

This creates a clear positioning opportunity for Venture Scale. Most existing tools produce freeform AI feedback ("your market slide needs more data") rather than structured checklist-based evaluation. No competitor identified uses a stage-gated question framework (Pre-Seed/Seed/Series A) with a Verified/Quick Win/Gap scoring model derived from real VC conversations. The closest competitors on the investor side -- VentureLens, DeckMatch/AlphaLens, Pitch Deck Scanner, and Pitchflow -- focus primarily on data extraction and memo generation rather than structured investment evaluation. Unbiased Ventures comes closest to Venture Scale's approach with its 7-dimension VC scoring, but wraps it in a broader (and more expensive) fraud detection and psychological assessment platform.

Pricing in the market ranges from completely free (PitchLeague, OpenVC, SaaStr) to $30-100/month for workflow tools, to $25,000+/year for enterprise platforms like Harmonic. The per-analysis model ($2.49-$49 per deck) exists but is uncommon. Most investor-grade tools charge $50-100/month or use credits-based pricing. The market is ripe for a tool that sits between "free but generic AI feedback" and "expensive enterprise deal flow platform" -- specifically targeting the evaluation/scoring step that currently happens manually or via generic ChatGPT prompts.

---

## 1. Direct Competitors -- AI Pitch Deck Analyzers

### A. Investor-Facing Tools (Primary Competitors)

These tools are explicitly designed for investors reviewing inbound pitch decks.

| Tool | URL | Target User | Pricing | Quality Signals | Key Gap vs. Venture Scale |
|------|-----|-------------|---------|-----------------|---------------------------|
| **VentureLens** | [venturelens.ai](https://www.venturelens.ai/) | Angels, analysts, venture partners | $49 (1 report), $99 (5 reports), $90/mo (6/mo) | Generates 3-page PDF risk reports; VC terminology; private mode option | Freeform risk report, not structured checklist. No stage-gating. |
| **DeckMatch / AlphaLens** | [alphalens.ai](https://alphalens.ai/) | VCs, investment firms | Not public (raised $3.1M seed) | Uses GPT-4 + Claude 3.5 + OCR; processes multiple formats; CRM integration | Focused on data extraction and memo generation, not structured scoring |
| **Pitch Deck Scanner** | [pitchdeckscanner.com](https://pitchdeckscanner.com/) | Investment professionals | $30/mo (100 decks), $50/mo (200+ decks) | Gmail integration; Affinity CRM sync; 97% extraction accuracy; 200+ users | Pure extraction/processing tool -- no evaluation framework |
| **Pitchflow** | [pitchflow.ai](https://pitchflow.ai/) | VCs and angels | Not public ("less than hiring an analyst") | Built by investors in collaboration with VCs; low-temperature AI settings | Matching-focused; less about structured evaluation |
| **Unbiased Ventures** | [unbiasedventures.ch](https://www.unbiasedventures.ch/) | VCs, angels, family offices, accelerators | DeckAnalyst pricing not public; assessments $99-$249 | 7 VC dimensions; benchmarks vs 3,000+ funded decks; fraud detection; Swiss-made | Most similar approach but bundled with psychological assessments; likely expensive; dual-audience dilutes investor focus |
| **PitchBob VC Analyst** | [pitchbob.io/products/vc](https://pitchbob.io/products/vc) | VC analysts, investment committees, accelerators | $29.90-$99.90/mo (first 10 decks free in beta) | 11 VC-grade criteria; WhatsApp/Slack/Telegram integration; auto-upload to CRM | More of a triage/first-pass tool; broader platform is founder-focused |
| **VCFlow.AI** | [vcflow.ai](https://vcflow.ai/) | Founders and investors | Not public (requires account approval) | Browsable deck database; AI scorecards; AWS encrypted | Early-stage; dual-audience; limited traction visible |
| **InoDash (Investor version)** | [inodash.com/ai-pitch-deck-evaluator-for-investors](https://inodash.com/ai-pitch-deck-evaluator-for-investors) | Investors | $2.49/evaluation | Uses RAG with investor's own thesis document; 10+ VC criteria | Very cheap but basic; no stage-gating; limited depth |
| **V7 Go** | [v7labs.com/automations/pitch-deck-analysis](https://www.v7labs.com/automations/pitch-deck-analysis) | Investment teams, banking | Enterprise pricing | Processes charts/graphs with high accuracy; handles 100s of decks; integrates with Affinity, Carta, PitchBook | Data extraction platform, not evaluation tool |
| **Pitch AI (Pro tier)** | [pitchai.com](https://www.pitchai.com/) | Teams and VCs (at $49/mo tier) | Free (3 decks/mo), $19/mo, $49/mo | Scores across 10+ dimensions; bulk analysis; custom metrics | Dual-audience; investor tier is add-on, not core focus |


### B. Founder-Facing Tools (Indirect Competitors)

These tools help founders improve their decks. They compete for attention but serve a different user.

| Tool | URL | Pricing | Notable Features |
|------|-----|---------|-----------------|
| **SaaStr.ai Pitch Deck Analyzer** | [saastr.ai/pitch-deck-analyzer](https://saastr.ai/pitch-deck-analyzer) | Free | Traction Score, Deck Quality Score, Investment Grade (A+ to F); trained on SaaS investing expertise; has analyzed 2,000+ decks. Data: only 12.1% of decks are clearly fundable. |
| **OpenVC** | [openvc.app](https://www.openvc.app/decks) | Free | Instant review in 30 seconds; no paywall; tracks investor engagement; 5,000+ investor database |
| **PitchLeague.ai** | [pitchleague.ai](https://www.pitchleague.ai/) | Free | ML-based investability scoring; leaderboard feature; no sign-up required; pre-seed/seed focused |
| **Slidebean Reviewer** | [slidebean.com/pitch-deck-reviewer](https://slidebean.com/pitch-deck-reviewer) | $7/mo (incl. in Starter) | Based on $350M+ in raises; built-in scoring engine; pitch analytics tracking |
| **PitchGrade** | [pitchgrade.com](https://pitchgrade.com/) | Free trial, $10/deck, $29/mo Pro | 6-dimension scoring; investor fit matching (Sequoia, a16z, YC); DCF model generation |
| **Evalyze** | [evalyze.ai](https://www.evalyze.ai/) | $15/mo ($9/mo annual) | 1000-point scale; investor matching from 12,000+ verified investors; multimodal v2 engine |
| **PitchVault** | [pitchvault.ai](https://www.pitchvault.ai/) | Free to start | VaultScore/VaultMoat/VaultRisk/VaultOps scoring; multi-language; stage-specific benchmarks |
| **Pitch Guide** (Haje Kamps) | [pitch.guide](https://pitch.guide) | $15-$49/review | ~250 criteria checklist; trained on 3,000+ decks; from former TechCrunch writer |
| **SeedBlink** | [seedblink.com/pitch-deck-review](https://seedblink.com/pitch-deck-review) | 1 free review, then paid | Trained on 10,000+ decks; slide-by-slide feedback; investability score |
| **StartupOS** | [startupos.com/offerings/pitch-deck](https://startupos.com/offerings/pitch-deck/) | Not public | Red/Yellow/Green scoring; 30-min email delivery; stage-based benchmarking |
| **Roast My Deck** | [roastmydeck.xyz](https://www.roastmydeck.xyz) | Free | 6-category brutal scoring; shareable scorecard; novelty/engagement play |
| **Creworklabs** | [creworklabs.com](https://www.creworklabs.com/case-studies/ai-pitch-deck-review) | Not public | Slide-by-slide analysis; storytelling/financials/design scoring |
| **InoDash (Founder version)** | [inodash.com/ai-pitch-deck-evaluator](https://inodash.com/ai-pitch-deck-evaluator) | $2.49/evaluation | 10+ investor criteria; benchmarks against funded decks |

---

## 2. Adjacent Tools VCs Actually Use

These are the tools already embedded in VC workflows. Venture Scale would need to complement (or integrate with) these platforms.

### Deal Flow CRMs

| Tool | What It Does | Pitch Deck Features | Pricing |
|------|-------------|---------------------|---------|
| **Affinity** | Relationship intelligence CRM; 50% top-VC adoption | File Analyzer extracts insights from decks; MCP integrations with Claude/ChatGPT; auto-capture from email/calendar | ~$2,000-$2,700/user/year |
| **4Degrees** | Intelligent CRM for relationship-driven teams | AI Document Intelligence extracts data from pitch decks into CRM; PitchBook/Preqin integration | Not public |
| **Attio** | Modern CRM with auto-sync | Pitch deck storage and pipeline management | Not public |
| **Edda** | Dealflow and portfolio management | Dealflow Review for collaborative deal review; Company Scoring with customizable scorecards; one-click add from Dealroom/Crunchbase/PitchBook | Not public |
| **Sevanta Dealflow** | Deal tracking since 2005 | Built-in private LLM auto-fills deal records from pitch deck emails | Not public |
| **Visible.vc** | Fundraising and investor relations | Pitch deck sharing with engagement tracking | Not public |

### Deal Sourcing & Intelligence

| Tool | What It Does | Pricing |
|------|-------------|---------|
| **Harmonic** | AI startup discovery; 30M+ companies indexed; founder tracking | ~$25,000/year minimum (3 licenses at ~$10K each) |
| **AlphaSense** | Market intelligence; 150M+ documents; GenAI synthesis | Enterprise pricing |
| **Tracxn** | Company discovery; 3M+ companies tracked | Not public |
| **Grata** | ML-powered private company search; 1.2B web pages | Not public |
| **Crunchbase / PitchBook / CB Insights** | Company and funding data | PitchBook ~$20K+/year; Crunchbase from ~$3K/year |

### Portfolio & Fund Operations

| Tool | What It Does |
|------|-------------|
| **Standard Metrics** | Portfolio data collection and AI-powered reporting |
| **Carta** | Cap table management (~$2,800/year) |
| **Rowspace** | AI-native data workflows for PE/VC ($50M Series A, Feb 2026) |

### General AI Tools VCs Use for Deck Review

According to Affinity's survey: **85% of VCs now use AI for daily tasks, 82% for deal sourcing research.** Many use general-purpose AI:

- **Claude** -- long context windows for processing full pitch decks and diligence packages
- **ChatGPT** -- drafting outreach, reviewing decks, analyzing trends, generating reports
- **Perplexity** -- fact-checking pitch deck claims with sourced citations
- **Granola** -- AI meeting notes (runs locally, no bot on calls)
- **Gamma** -- presentation generation for LP updates (100M users, $100M ARR)

**Key insight:** Most VCs are currently using generic AI tools (Claude, ChatGPT) rather than purpose-built deck analysis tools. This represents both a threat (why buy a tool when ChatGPT works?) and an opportunity (purpose-built tools with structured frameworks deliver more consistent, actionable output).

---

## 3. Pricing Landscape

### Free Tier
| Tool | Model |
|------|-------|
| PitchLeague | Completely free, no sign-up |
| OpenVC | Free, unlimited |
| SaaStr.ai | Free |
| Roast My Deck | Free forever |
| PitchVault | Free to start |

### Per-Analysis Pricing
| Tool | Price per Deck |
|------|---------------|
| InoDash | $2.49 |
| PitchGrade | $10/deck (Standard) |
| Pitch Guide (Haje Kamps) | $15-$49/review |
| VentureLens | $49/single report |

### Subscription Models
| Tool | Monthly Price | What You Get |
|------|--------------|-------------|
| Slidebean | $7/mo | Unlimited AI deck reviews + builder |
| Evalyze | $9-$15/mo | 15 document assessments, investor matching |
| Pitch AI | $19-$49/mo | 5-50+ decks, custom metrics at Pro tier |
| PitchGrade | $29/mo | Unlimited uploads, custom grading |
| PitchBob VC | $29.90-$99.90/mo | VC analyst features, CRM integration |
| Pitch Deck Scanner | $30-$50/mo | 100-200+ decks, Gmail/Affinity integration |
| VentureLens | $90/mo | 6 reports/month |

### Enterprise / VC-Specific
| Tool | Annual Cost |
|------|------------|
| Affinity | $2,000-$2,700/user/year |
| Harmonic | $25,000+/year |
| AlphaSense | Enterprise (est. $20K+) |
| DeckMatch/AlphaLens | Not public (raised $3.1M) |

### Pricing Sweet Spot for Venture Scale

The market gap is between free generic tools and $25K+ enterprise platforms. For investor-facing analysis with a structured checklist framework:

- **Individual angels/scouts:** $29-$49/month or ~$10-$20 per analysis
- **VC firms (team):** $99-$199/month
- **Enterprise/accelerators:** $500-$2,000/month (volume pricing)

The closest pricing comp is VentureLens at $90/month for 6 reports, or Pitch Deck Scanner at $30-$50/month for processing volume.

---

## 4. Investor-Facing vs. Founder-Facing Positioning Map

### Primarily Investor-Facing (Built for the reviewer)

| Tool | What Makes It Investor-Facing |
|------|------------------------------|
| **VentureLens** | Risk reports with VC terminology; designed for angels/analysts/venture partners |
| **DeckMatch/AlphaLens** | Deck-to-memo pipeline; CRM integration; thesis matching |
| **Pitch Deck Scanner** | Gmail monitoring + Affinity CRM auto-population |
| **Pitchflow** | Built by/for investors; thesis matching |
| **Unbiased Ventures** | 7-dimension VC scoring; fraud detection; stage-aware calibration |
| **PitchBob VC Analyst** | 11 VC criteria; WhatsApp/Slack triage; CRM auto-upload |
| **V7 Go** | Metric extraction for investment teams at scale |
| **InoDash (Investor ver.)** | RAG with investor's own thesis document |

### Primarily Founder-Facing (Built for the pitcher)

| Tool | What Makes It Founder-Facing |
|------|------------------------------|
| **SaaStr.ai** | "Know what investors will think before you pitch" |
| **OpenVC** | Deck sharing + investor database + engagement tracking |
| **PitchLeague** | Investability scoring + leaderboard for founders |
| **Slidebean** | Deck builder + reviewer + analytics |
| **PitchGrade** | Deck scoring + investor fit matching + deck generation |
| **Evalyze** | Pitch analysis + investor matching + readiness score |
| **PitchVault** | Scoring + curated investor network for high scorers |
| **Pitch Guide** | Expert review + improvement coaching |
| **SeedBlink** | Investability score + improvement recommendations |
| **StartupOS** | Deck review + investor list + outreach templates |
| **Roast My Deck** | Brutal feedback for self-improvement |

### Dual-Audience (Trying to serve both)

| Tool | Tension |
|------|---------|
| **Pitch AI** | Free/Solo for founders, Pro ($49/mo) for teams/VCs |
| **VCFlow.AI** | Founders upload, investors browse -- marketplace model |
| **InoDash** | Separate founder and investor versions at same price |
| **PitchBob** | Core product is founder-facing; VC Analyst is add-on product |
| **Xylence** | Four modules trying to serve both sides of the table |

### The Gap Venture Scale Fills

**The investor-facing segment is small and fragmented.** Of the ~8 investor-facing tools identified:
- 3 are primarily extraction/processing tools (DeckMatch, Pitch Deck Scanner, V7 Go) -- they get data OUT of decks but don't evaluate
- 2 are early-stage/limited traction (Pitchflow, VCFlow.AI)
- 1 is expensive/bundled with psych assessments (Unbiased Ventures)
- 1 is a feature within a broader founder platform (PitchBob VC)
- 1 does freeform risk reports, not structured evaluation (VentureLens)

**None use a structured investor-derived checklist with stage-gated questions and a Verified/Quick Win/Gap classification system.**

---

## 5. Quality Gaps and Differentiation Opportunities

### What Users Complain About with Existing Tools

1. **Generic, cookie-cutter feedback.** Most tools produce the same advice for every deck: "add more traction data," "clarify your market size," "include a financial model." This is acknowledged even by tool creators -- Haje Kamps' tool stands out partly because it uses 250 criteria instead of generic prompts.

2. **Founder-facing framing even when claiming investor perspective.** Tools that say they "show you how investors see your deck" are still fundamentally coaching the founder. They don't produce output an investor would actually use in their workflow.

3. **Inflated/unsourced market numbers.** Many AI tools auto-populate TAM/SAM/SOM figures that "lack sources or context" -- a red flag investors spot immediately.

4. **No integration with investor workflows.** Most tools exist as standalone websites. Only Pitch Deck Scanner and DeckMatch/AlphaLens integrate with Affinity or other VC CRMs.

5. **AI hallucination and unreliability.** Generated content can be "of low quality" with "awkward wording." Some tools use high-temperature AI settings that produce speculative analysis. Pitchflow specifically highlights using "low temperature settings" as a differentiator.

6. **No structured framework.** Almost every tool uses freeform AI analysis. The AI reads the deck and generates prose feedback. There is no standardized evaluation rubric that produces consistent, comparable results across decks.

### What Would Make Venture Scale Stand Out

**1. Structured Checklist, Not Freeform AI**
Venture Scale's 45-question framework derived from real VC conversations is unique. The closest competitor is Pitch Guide (Haje Kamps) with ~250 criteria, but that's founder-facing and produces improvement advice, not investment evaluation. Unbiased Ventures has 7 dimensions but much less granularity.

**2. Stage-Gated Evaluation**
The Pre-Seed (19q) / Seed (34q) / Series A+ (45q) gating is a meaningful differentiator. PitchVault and StartupOS mention "stage-specific benchmarks" but don't restructure their entire evaluation framework by stage. No other tool adjusts what it evaluates based on the company's stage.

**3. Verified / Quick Win / Gap Classification**
This three-tier output is unique in the market. Every other tool produces either a numeric score (0-100, 1000-point scale, A-F grade) or prose feedback. The "Quick Win" category -- "the company has this but the deck doesn't show it" -- is particularly valuable because it separates presentation problems from business problems. No competitor makes this distinction.

**4. Built FROM the Investor Side**
Most "investor perspective" tools are actually founder tools that simulate an investor's view. Venture Scale was built from actual VC evaluation processes. The output should be something an investor would use as-is in their screening workflow, not something a founder uses to improve their deck.

**5. Investment Committee Ready Output**
VentureLens comes closest with its shareable PDF reports, but the output is a freeform risk assessment. Venture Scale could produce structured scorecards that map directly to IC discussion frameworks, with clear Verified/Quick Win/Gap status on each evaluation dimension.

### Potential Weaknesses to Address

- **"Why not just use ChatGPT?"** -- 85% of VCs already use AI tools. The answer needs to be: consistency, structured framework, stage-awareness, and IC-ready output that ChatGPT prompts can't reliably produce.
- **CRM integration will be expected.** Affinity is the VC standard. DeckMatch and Pitch Deck Scanner have set the bar for seamless workflow integration.
- **Volume matters for investors.** Angels might review 5 decks/week; accelerator screeners might review 50+. Pricing and processing speed need to accommodate this range.
- **Privacy and confidentiality.** VCs handle confidential deal flow. VentureLens offers "private mode" (deck deleted after analysis). This will be table stakes.

---

## 6. Key Data Points

- **85% of VCs** now use AI to automate daily tasks; **82%** use AI for deal sourcing research (Affinity survey of ~300 dealmakers)
- **Only 12.1%** of pitch decks analyzed by SaaStr.ai are "clearly fundable" -- investors are drowning in low-quality deal flow (SaaStr, 2,000+ decks analyzed)
- **95% of pitch decks** landing in VC inboxes are unfundable according to SaaStr's initial 700+ deck analysis
- **DeckMatch raised $3.1M** (Nov 2024) specifically to help VCs analyze pitch decks with AI, validating investor willingness to pay for this category
- **Pitch Deck Scanner** has **200+ investment professionals** using it -- modest but real adoption for a narrow tool
- **Papermark** (deck sharing/analytics) hit **$900K revenue** with a 2-person team by July 2025, showing the pitch deck tooling market has real revenue potential
- **Gamma** (AI presentations) reached **$100M ARR** and **70M users** by late 2025, demonstrating massive scale in the broader AI presentation space
- **Affinity** has **50% top-VC adoption** and **96% retention** with **3,000+ customers**, setting the standard for VC workflow tools
- **The median VC firm** uses **20 core tools** across 5-8 categories (PortfolioIQ survey)

---

## 7. Competitive Positioning Summary

### Where Venture Scale Sits

```
                        EVALUATION DEPTH
                    Shallow  --------->  Deep

     Investor   |  Pitch Deck    |  VentureLens    |
     Facing     |  Scanner       |  Unbiased Vent. |
                |  DeckMatch     |  ** VENTURE **   |
                |  Pitchflow     |  ** SCALE **     |
                |----------------|-----------------|
     Founder    |  Roast My Deck |  Pitch Guide    |
     Facing     |  PitchLeague   |  SaaStr.ai      |
                |  OpenVC        |  Evalyze        |

                    Low Price  --------->  High Price
```

Venture Scale's strategic position is **deep evaluation, investor-facing** -- a quadrant with limited competition. VentureLens and Unbiased Ventures are the closest but use freeform analysis rather than structured checklists. The key competitive moat is the 45-question framework built from real VC evaluation processes, combined with stage-gating and the Verified/Quick Win/Gap output model.

### Top 3 Competitors to Watch

1. **VentureLens** -- Closest in positioning (investor-facing, risk-report output, credits-based pricing). But freeform, not structured.
2. **Unbiased Ventures** -- Most sophisticated evaluation framework (7 dimensions + fraud detection). But expensive, Swiss-focused, bundled with psych assessments.
3. **DeckMatch/AlphaLens** -- Best funded ($3.1M), strongest CRM integration. But focused on extraction/memo, not evaluation.

---

## Sources

- [VentureLens](https://www.venturelens.ai/)
- [Unbiased Ventures](https://www.unbiasedventures.ch/)
- [DeckMatch/AlphaLens](https://alphalens.ai/)
- [Pitch Deck Scanner](https://pitchdeckscanner.com/)
- [Pitchflow](https://pitchflow.ai/)
- [VCFlow.AI](https://vcflow.ai/)
- [PitchBob VC Analyst](https://pitchbob.io/products/vc)
- [V7 Go Pitch Deck Analysis](https://www.v7labs.com/automations/pitch-deck-analysis)
- [Pitch AI](https://www.pitchai.com/)
- [InoDash Investor Evaluator](https://inodash.com/ai-pitch-deck-evaluator-for-investors)
- [SaaStr.ai Pitch Deck Analyzer](https://saastr.ai/pitch-deck-analyzer)
- [SaaStr 2000+ Deck Analysis](https://www.saastr.com/fundability2000decks/)
- [SaaStr 700+ Deck Analysis](https://www.saastr.com/what-weve-learned-from-our-first-700-vc-pitch-decks-in-saastrs-new-ai-pitch-analyzer-the-data-is-brutal-and-eye-opening/)
- [OpenVC](https://www.openvc.app/decks)
- [PitchLeague](https://www.pitchleague.ai/)
- [Slidebean](https://slidebean.com/pitch-deck-reviewer)
- [PitchGrade](https://pitchgrade.com/)
- [Evalyze](https://www.evalyze.ai/)
- [PitchVault](https://www.pitchvault.ai/)
- [Pitch Guide (Haje Kamps)](https://pitch.guide)
- [SeedBlink](https://seedblink.com/pitch-deck-review)
- [StartupOS](https://startupos.com/offerings/pitch-deck/)
- [Roast My Deck](https://www.roastmydeck.xyz)
- [Creworklabs](https://www.creworklabs.com/case-studies/ai-pitch-deck-review)
- [Affinity CRM](https://www.affinity.co/)
- [Affinity 10 AI Tools for VCs](https://www.affinity.co/guides/vc-ai-tools)
- [4Degrees](https://www.4degrees.ai/)
- [Edda](https://edda.co/)
- [Sevanta Dealflow](https://mydealflow.com/)
- [Harmonic](https://harmonic.ai/)
- [Standard Metrics VC Tech Stack 2026](https://standardmetrics.io/library/the-top-ai-powered-vc-tech-stack-tools-in-2026/)
- [PortfolioIQ Definitive VC Tech Stack 2026](https://portfolioiq.ai/blog/vc-tech-stack-2026)
- [Xylence](https://xylence.ai/)
- [Peachscore](https://peachscore.com/blog-pages/blog/introducing-ai-pitch-deck-analysis-smarter-startup-fundraising-starts-here)
- [Haje Kamps on AI Pitch Deck Review](https://haje.medium.com/this-ai-will-tell-you-if-your-pitch-deck-is-good-enough-1556108c1fab)
