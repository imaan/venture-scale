# Set up Railway persistent volume for data/
**Date:** 2026-03-29  |  **Priority:** high

SQLite DB and generated reports are stored in data/ on the Railway filesystem. If the service restarts or redeploys, this data is lost. Need to attach a Railway persistent volume to /app/data to survive redeploys.
