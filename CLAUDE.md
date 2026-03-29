# Venture Scale

AI-powered pitch deck analyzer for VCs. Scores decks against a 45-question stage-gated investor checklist (Verified / Quick Win / Gap). Built as a web app with Hono on Cloudflare Workers.

## Commands

```bash
# Development
wrangler dev              # Start local dev server on :8787

# Deploy
wrangler deploy           # Deploy to Cloudflare Workers

# Database
wrangler d1 execute venture-scale-db --local --file=src/schema.sql   # Migrate local
wrangler d1 execute venture-scale-db --remote --file=src/schema.sql  # Migrate prod

# Type check
npx tsc --noEmit

# Secrets
iscrt env push            # Push .env to encrypted store
iscrt env pull            # Pull secrets to .env
```

## Architecture

```
src/
  index.ts              # Hono app, routes, pages
  types.ts              # Cloudflare bindings type
  schema.sql            # D1 database schema
  routes/
    auth.ts             # Magic link auth via Resend
    analysis.ts         # Core deck analysis (Claude API) — TODO
    feedback.ts         # User feedback collection
    stats.ts            # Public usage counter
  lib/
    analytics.ts        # PostHog event definitions
public/
  index.html            # Landing page
  demo.html             # Sample Airbnb analysis report
.claude/
  skills/venture-scale/ # The /venture-scale Claude Code skill
  productionize-config.md
```

## Stack

- **Runtime:** Cloudflare Workers
- **Framework:** Hono + htmx
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2 (PDFs + HTML reports)
- **Auth:** Magic link via Resend
- **Analytics:** PostHog
- **AI:** Anthropic Claude API (deck analysis)
- **Language:** TypeScript

## Key Decisions

- First analysis is free, no signup required
- Signup (magic link) gates subsequent analyses and gives 50 credits
- Decks are ephemeral — deleted from R2 after analysis
- Reports are shareable via URL (stored in R2)
- The interactive HTML report template lives at `.claude/skills/venture-scale/template.html`
- Research docs are in `research/` (GTM, competitive landscape, specs, plans)

## Conventions

- Use `wrangler` directly, not `npx wrangler`
- Secrets go in `.env` and are pushed with `iscrt env push`
- Cloudflare secrets set via `wrangler secret put`
- D1 bindings use `DB`, R2 bindings use `STORAGE`
