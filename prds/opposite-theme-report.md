# Opposite Theme for Report vs Site

**Issue:** #9
**Date:** 2026-03-29
**Status:** Draft

## Problem
The landing page and the embedded demo report both default to dark mode, making them blend together visually. The report should feel like a distinct "document" within the page.

## Goals
- [ ] Landing page in dark mode → embedded demo report defaults to light mode (and vice versa)
- [ ] /report/:id pages respect system preference as standalone, but invert when embedded
- [ ] User can still toggle manually in the report

## Current State
- Landing page: always dark (no theme toggle)
- Demo report (iframe): follows system preference or localStorage, independent of parent
- Generated reports (/report/:id): follow system preference or localStorage

## Proposed Solution
1. **Landing page iframe:** Pass `?theme=light` query param to `demo.html` when loading the iframe
2. **demo.html:** Check for `?theme=` query param on load. If present, use it as default (overriding system preference). Manual toggle still works.
3. **Generated reports:** Same logic — if loaded in an iframe or with `?theme=` param, use that. Otherwise, system preference.

This keeps it simple: the parent page controls the initial theme of the embedded report via a query param.

## Implementation Plan
1. Update `public/index.html` — add `?theme=light` to the iframe src
2. Update `public/demo.html` — check URL params for theme override on init
3. Update `src/lib/report.ts` — add the same param check to generated reports

## Acceptance Criteria
- [ ] Landing page (dark) shows demo report in light mode
- [ ] Toggling the report's theme toggle still works
- [ ] Standalone /report/:id pages still follow system preference
- [ ] Generated reports from the analysis also support the param

## Test Plan
1. Open landing page — demo should be light mode inside dark page
2. Toggle the report's theme — should switch to dark
3. Open a /report/:id directly — should follow system preference

## Out of Scope
- Adding a theme toggle to the landing page itself
- Persisting theme choice across reports

## What Was Done
_Filled in after implementation._
