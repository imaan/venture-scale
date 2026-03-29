import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings } from './types';
import { authRoutes } from './routes/auth';
import { analysisRoutes } from './routes/analysis';
import { feedbackRoutes } from './routes/feedback';
import { statsRoutes } from './routes/stats';

const app = new Hono<{ Bindings: Bindings }>();

// API routes
app.route('/api/auth', authRoutes);
app.route('/api/analysis', analysisRoutes);
app.route('/api/feedback', feedbackRoutes);
app.route('/api/stats', statsRoutes);

// App page — the upload + analysis flow
app.get('/app', (c) => {
  // TODO [productionize]: Implement the upload + analysis flow
  // This page should:
  // 1. Show a drag-drop PDF upload area + stage selector
  // 2. On submit, POST to /api/analysis/create (uploads PDF to R2, starts analysis)
  // 3. Poll /api/analysis/:id/status until complete
  // 4. Redirect to /report/:id to view the scored analysis
  //
  // First analysis is free (no auth required).
  // Subsequent analyses require auth — check for session cookie.
  // If no session, show "Get 50 free scans" email capture.
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Venture Scale — Score a Deck</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; background: #0a0a0a; color: #e8e8e8; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .upload-area { max-width: 480px; text-align: center; padding: 48px; border: 2px dashed #333; border-radius: 16px; }
    .upload-area h1 { font-size: 1.5rem; margin-bottom: 12px; }
    .upload-area p { color: #888; margin-bottom: 24px; }
    .btn { display: inline-block; padding: 12px 32px; background: #d4a72c; color: #0a0a0a; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; text-decoration: none; }
    .btn:hover { opacity: 0.88; }
    .coming-soon { margin-top: 16px; font-size: 0.8125rem; color: #666; }
  </style>
</head>
<body>
  <div class="upload-area">
    <h1>Score a Pitch Deck</h1>
    <p>Upload a PDF, pick the stage, get a scored report in 60 seconds.</p>
    <label class="btn" for="deck-upload">Upload PDF</label>
    <input type="file" id="deck-upload" accept=".pdf" style="display:none">
    <p class="coming-soon">Core analysis feature coming soon. See the <a href="/" style="color:#d4a72c">sample report</a> for what to expect.</p>
  </div>
</body>
</html>`);
});

// Report page — view a completed analysis
app.get('/report/:id', async (c) => {
  const id = c.req.param('id');
  // TODO [productionize]: Fetch analysis from D1, render the HTML report
  // 1. Look up analysis by ID in D1
  // 2. Fetch the generated HTML from R2
  // 3. Return it as HTML response
  // 4. Track 'share' event if accessed by non-owner
  return c.text(`Report ${id} — coming soon`, 404);
});

// Changelog
app.get('/changelog', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Venture Scale — Changelog</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; background: #0a0a0a; color: #e8e8e8; line-height: 1.6; margin: 0; padding: 48px 24px; }
    .container { max-width: 640px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 32px; }
    h2 { font-size: 1.125rem; color: #d4a72c; margin-top: 24px; }
    ul { padding-left: 20px; color: #aaa; }
    a { color: #d4a72c; }
  </style>
</head>
<body>
  <!-- Add new entries at the top. Format: <h2>[DATE] — [Title]</h2><ul><li>[Change]</li></ul> -->
  <div class="container">
    <h1>Changelog</h1>
    <h2>2026-03-29 — Launch</h2>
    <ul>
      <li>Landing page with sample Airbnb analysis</li>
      <li>Early access signups open</li>
    </ul>
    <p style="margin-top:32px"><a href="/">&larr; Back to Venture Scale</a></p>
  </div>
</body>
</html>`);
});

export default app;
