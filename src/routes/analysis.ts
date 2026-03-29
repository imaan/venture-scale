import { Hono } from 'hono';
import type { Bindings } from '../types';
import { analyzeDeck } from '../lib/analyze';
import { generateReport } from '../lib/report';

export const analysisRoutes = new Hono<{ Bindings: Bindings }>();

// POST /api/analysis/create — upload a deck and start analysis
analysisRoutes.post('/create', async (c) => {
  // Parse multipart form data
  const formData = await c.req.formData();
  const file = formData.get('deck') as File | null;
  const stageStr = formData.get('stage') as string | null;

  if (!file || !file.size) {
    return c.json({ error: 'No PDF file provided' }, 400);
  }

  if (file.type !== 'application/pdf') {
    return c.json({ error: 'File must be a PDF' }, 400);
  }

  const stage = parseInt(stageStr ?? '1', 10);
  if (![0, 1, 2].includes(stage)) {
    return c.json({ error: 'Stage must be 0, 1, or 2' }, 400);
  }

  // Check auth: first analysis is free (tracked via cookie)
  const cookies = c.req.header('Cookie') ?? '';
  const hasFreeCookie = cookies.includes('vs_free=1');
  const hasSession = cookies.includes('session=');

  if (hasFreeCookie && !hasSession) {
    return c.json({
      error: 'Sign up for 50 free analyses',
      requiresAuth: true,
    }, 401);
  }

  // If authenticated, check credits
  if (hasSession) {
    const match = cookies.match(/session=([^;]+)/);
    if (match) {
      try {
        const [payloadB64] = match[1].split('.');
        const payload = JSON.parse(atob(payloadB64));
        const user = await c.env.DB.prepare('SELECT credits FROM users WHERE id = ?')
          .bind(payload.uid).first<{ credits: number }>();
        if (user && user.credits <= 0) {
          return c.json({ error: 'No credits remaining' }, 403);
        }
      } catch { /* proceed — auth verification happens elsewhere */ }
    }
  }

  // Convert PDF to base64
  const pdfBuffer = await file.arrayBuffer();
  const pdfBase64 = arrayBufferToBase64(pdfBuffer);

  // Generate analysis ID
  const id = crypto.randomUUID();

  // Run analysis via Claude API
  let analysis;
  try {
    analysis = await analyzeDeck(pdfBase64, stage, c.env);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed';
    return c.json({ error: message }, 500);
  }

  // Generate HTML report
  const reportHtml = generateReport(analysis);

  // Store report in R2
  await c.env.STORAGE.put(`reports/${id}.html`, reportHtml, {
    httpMetadata: { contentType: 'text/html' },
  });

  // Count scores
  let verified = 0, quickwins = 0, gaps = 0, total = 0;
  for (const cat of analysis.categories) {
    for (const q of cat.questions) {
      if (q.stage <= stage) {
        total++;
        if (q.s === 'green') verified++;
        else if (q.s === 'amber') quickwins++;
        else gaps++;
      }
    }
  }

  // Store metadata in D1
  let userId: string | null = null;
  if (hasSession) {
    const match = cookies.match(/session=([^;]+)/);
    if (match) {
      try {
        const [payloadB64] = match[1].split('.');
        const payload = JSON.parse(atob(payloadB64));
        userId = payload.uid;
      } catch { /* anonymous */ }
    }
  }

  await c.env.DB.prepare(
    'INSERT INTO analyses (id, user_id, company_name, stage, score_verified, score_quickwins, score_gaps, score_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, userId, analysis.company.name, stage, verified, quickwins, gaps, total).run();

  // Decrement credits if authenticated
  if (userId) {
    await c.env.DB.prepare('UPDATE users SET credits = credits - 1 WHERE id = ? AND credits > 0')
      .bind(userId).run();
  }

  // Increment usage counter
  await c.env.DB.prepare("UPDATE stats SET value = value + 1 WHERE key = 'total_analyses'").run();

  // Set free cookie if this was the first (free) analysis
  const headers: Record<string, string> = {};
  if (!hasFreeCookie && !hasSession) {
    headers['Set-Cookie'] = 'vs_free=1; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000';
  }

  return c.json({
    id,
    status: 'complete',
    url: `/report/${id}`,
    company: analysis.company.name,
    score: { verified, quickwins, gaps, total },
  }, 200, headers);
});

// GET /api/analysis/:id/status — check analysis status
analysisRoutes.get('/:id/status', async (c) => {
  const id = c.req.param('id');

  const analysis = await c.env.DB.prepare(
    'SELECT id, company_name, stage, score_verified, score_total, created_at FROM analyses WHERE id = ?'
  ).bind(id).first();

  if (!analysis) return c.json({ error: 'Not found' }, 404);
  return c.json({ analysis, status: 'complete' });
});

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
