# Venture Scale

AI-powered pitch deck analyzer for VCs. Scores decks against a 45-question stage-gated investor checklist (Verified / Quick Win / Gap). Express + Node.js web app deployed on Railway.

## Commands

```bash
# Development
npm run dev               # Start local dev server on :8787 (tsx watch)
npm run start             # Start production server

# Type check
npm run typecheck         # or: npx tsc --noEmit

# Deploy
git push origin main      # Railway auto-deploys from main

# Secrets
iscrt env push            # Push .env to encrypted store
iscrt env pull            # Pull secrets to .env
```

## Architecture

```
src/
  server.ts             # Express app — all routes, auth, analysis, feedback, stats
  db.ts                 # SQLite database (better-sqlite3), auto-creates schema
  lib/
    analyze.ts          # Claude API integration — Files API upload + streaming analysis
    report.ts           # HTML report generator (analysis JSON → interactive HTML)
    analytics.ts        # PostHog event definitions
public/
  index.html            # Landing page with embedded Airbnb demo
  demo.html             # Sample Airbnb analysis report (iframe'd into landing page)
  app.html              # Upload page — drag-drop PDF, stage selector, polling wait UI
  changelog.html        # Changelog
.claude/
  skills/venture-scale/ # The /venture-scale Claude Code skill
  skills/dev/           # /dev workflow skill
  skills/quick-fix/     # /quick-fix workflow skill
  skills/cleanup/       # /cleanup workflow skill
  productionize-config.md
prds/                   # PRDs (active)
prds/done/              # PRDs (completed)
scratchpad/debt/        # Technical debt items
research/               # GTM research, specs, plans
Dockerfile              # Node 23 (required for undici fix)
```

## Stack

- **Runtime:** Node.js 23+ (required — Node 22 has undici socket bug with large API calls)
- **Framework:** Express
- **Database:** SQLite via better-sqlite3 (stored in `data/venture-scale.db`)
- **Storage:** Local filesystem (`data/reports/` for generated HTML reports)
- **Auth:** Magic link via Resend
- **Analytics:** PostHog
- **AI:** Anthropic Claude API (Sonnet 4) via Files API + streaming
- **Deploy:** Railway (auto-deploys from main, persistent volume at `/app/data`)
- **Language:** TypeScript (via tsx)

## Key Decisions

- First analysis is free, no signup required (tracked via `vs_free` cookie)
- Signup (magic link) gates subsequent analyses and gives 50 credits
- Analysis is async: POST returns immediately, client polls `/api/analysis/:id/status`
- Background processing via `setTimeout` (runs outside request handler)
- Uses Anthropic Files API to upload PDFs (avoids base64-in-JSON size issues)
- Uses streaming for the analysis call (prevents idle connection timeout on long analyses)
- Reports are shareable via URL at `/report/:id`
- The interactive HTML report template lives at `.claude/skills/venture-scale/template.html`
- Research docs are in `research/` (GTM, competitive landscape, specs, plans)

## Conventions

- Secrets go in `.env` and are pushed with `iscrt env push`
- Railway env vars set via `railway variables --set "KEY=value"`
- Local dev requires Node 23+ (`/opt/homebrew/Cellar/node/25.8.1_1/bin/node` on this machine)
- Use `npm run dev` for local development (tsx watch mode)
- PRDs go in `prds/`, move to `prds/done/` when complete
- Technical debt documented in `scratchpad/debt/`

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/analysis/create` | Upload PDF + stage, returns `{ id, status: 'processing' }` |
| GET | `/api/analysis/:id/status` | Poll for completion |
| POST | `/api/auth/magic-link` | Send magic link email |
| GET | `/api/auth/verify` | Verify magic link token, set session |
| GET | `/api/auth/me` | Check current session |
| POST | `/api/feedback` | Submit feedback |
| GET | `/api/stats` | Public usage counter |
| GET | `/report/:id` | View a generated report |

## URLs

- **Production:** https://venture-scale-production.up.railway.app
- **GitHub:** https://github.com/imaan/venture-scale
