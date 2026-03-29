# Remove Cloudflare dependencies and config
**Date:** 2026-03-29  |  **Priority:** medium
**Related:** #8

wrangler.toml, @cloudflare/workers-types, wrangler, and D1/R2 references still exist in the repo. These are dead code after the Railway migration. Clean them out to avoid confusion.
