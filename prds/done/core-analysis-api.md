# Core Deck Analysis API

**Issue:** #6
**Date:** 2026-03-29
**Status:** Draft

## Problem
The Venture Scale web app is deployed but the core feature — analyzing pitch decks — returns a 501 stub. Users can see the demo (Airbnb analysis) but can't upload their own decks. This is the product.

## Goals
- [ ] Users can upload a PDF and get a scored analysis in <60 seconds
- [ ] First analysis works without signup
- [ ] Results are shareable via URL
- [ ] The analysis quality matches the existing `/venture-scale` Claude Code skill

## Current State
- `POST /api/analysis/create` returns 501
- `GET /report/:id` returns 404
- The analysis logic exists in `.claude/skills/venture-scale/SKILL.md` (prompt + checklist)
- The HTML report template exists in `.claude/skills/venture-scale/template.html`
- D1 schema has `analyses` table, R2 bucket exists for storage

## Proposed Solution

### API Flow
1. **Upload:** `POST /api/analysis/create` accepts `multipart/form-data` with PDF file + stage (0/1/2)
2. **Auth check:** First analysis is free (tracked via cookie). Subsequent require session with credits > 0.
3. **Store PDF:** Upload to R2 temporarily
4. **Extract text:** Convert PDF to base64, send to Claude API with PDF support
5. **Analyze:** Send the 45-question checklist prompt to Claude API (Sonnet), get structured JSON response
6. **Generate HTML:** Take the JSON scores + HTML template, produce the report
7. **Store results:** Save HTML to R2, metadata to D1, increment usage counter
8. **Cleanup:** Delete PDF from R2
9. **Return:** `{ id, status: 'complete', url: '/report/{id}' }`

### Report serving
- `GET /report/:id` fetches HTML from R2 and returns it
- No auth required — reports are public (shareable)

### Claude API integration
- Use `@anthropic-ai/sdk` with Sonnet model
- Send PDF as base64 document in the message
- System prompt contains the 45-question checklist + scoring instructions
- Response should be structured JSON matching the template's data format
- Single API call (not multi-turn) — send everything, get everything back

### Credit system
- Anonymous users get 1 free analysis (tracked via `vs_free` cookie)
- Authenticated users start with 50 credits, decremented per analysis
- Credit check happens before analysis starts

## Implementation Plan
1. Create `src/lib/analyze.ts` — the core analysis function (PDF → Claude API → structured data)
2. Create `src/lib/report.ts` — HTML report generator (structured data → HTML string)
3. Update `src/routes/analysis.ts` — wire up the upload + analysis + storage flow
4. Update `src/index.ts` — serve reports from R2 at `/report/:id`
5. Update `/app` page — add the upload form with htmx for the async flow

## Acceptance Criteria
- [ ] Upload a real PDF → get a scored report with all 8 categories
- [ ] Report is viewable at `/report/{id}` and looks like the demo
- [ ] Stage selector works in the generated report
- [ ] First analysis works without signup
- [ ] Second analysis requires auth (returns 401 with redirect to signup)
- [ ] Credits decrement on analysis
- [ ] Usage counter increments
- [ ] PDF is deleted from R2 after analysis
- [ ] Type checks pass

## Test Plan
1. Upload a test PDF via curl to `/api/analysis/create`
2. Verify the returned report ID
3. Open `/report/{id}` in browser — verify it renders correctly
4. Try a second analysis without auth — verify 401
5. Check D1 for analysis record
6. Check R2 for report HTML (and no leftover PDFs)

## Out of Scope
- Batch upload (multiple decks at once)
- Progress streaming (real-time updates during analysis)
- Custom checklists
- PDF text extraction fallback (if Claude can't read the PDF)
- Rate limiting beyond credit system

## What Was Done
_Filled in after implementation._
