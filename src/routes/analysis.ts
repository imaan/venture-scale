import { Hono } from 'hono';
import type { Bindings } from '../types';
import { analyzeDeck } from '../lib/analyze';
import { generateReport } from '../lib/report';

type Env = { Bindings: Bindings };

export const analysisRoutes = new Hono<Env>();

// POST /api/analysis/create — upload a deck, return immediately, process in background
analysisRoutes.post('/create', async (c) => {
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
    return c.json({ error: 'Sign up for 50 free analyses', requiresAuth: true }, 401);
  }

  // If authenticated, check credits
  let userId: string | null = null;
  if (hasSession) {
    const match = cookies.match(/session=([^;]+)/);
    if (match) {
      try {
        const [payloadB64] = match[1].split('.');
        const payload = JSON.parse(atob(payloadB64));
        userId = payload.uid;
        const user = await c.env.DB.prepare('SELECT credits FROM users WHERE id = ?')
          .bind(payload.uid).first<{ credits: number }>();
        if (user && user.credits <= 0) {
          return c.json({ error: 'No credits remaining' }, 403);
        }
      } catch { /* proceed */ }
    }
  }

  // Read PDF into base64 before responding
  const pdfBuffer = await file.arrayBuffer();
  const pdfBase64 = arrayBufferToBase64(pdfBuffer);

  // Generate analysis ID and create the DB record immediately
  const id = crypto.randomUUID();

  await c.env.DB.prepare(
    "INSERT INTO analyses (id, user_id, status, company_name, stage) VALUES (?, ?, 'processing', '', ?)"
  ).bind(id, userId, stage).run();

  // Set free cookie if this is the first (free) analysis
  const headers: Record<string, string> = {};
  if (!hasFreeCookie && !hasSession) {
    headers['Set-Cookie'] = 'vs_free=1; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000';
  }

  // Process analysis in background via waitUntil
  const env = c.env;
  c.executionCtx.waitUntil(
    processAnalysis(id, pdfBase64, stage, userId, env)
  );

  // Return immediately with the job ID
  return c.json({ id, status: 'processing' }, 202, headers);
});

// GET /api/analysis/:id/status — poll for analysis completion
analysisRoutes.get('/:id/status', async (c) => {
  const id = c.req.param('id');

  const row = await c.env.DB.prepare(
    'SELECT id, status, company_name, stage, score_verified, score_quickwins, score_gaps, score_total, error, created_at FROM analyses WHERE id = ?'
  ).bind(id).first<{
    id: string;
    status: string;
    company_name: string;
    stage: number;
    score_verified: number;
    score_quickwins: number;
    score_gaps: number;
    score_total: number;
    error: string | null;
    created_at: string;
  }>();

  if (!row) return c.json({ error: 'Not found' }, 404);

  if (row.status === 'complete') {
    return c.json({
      id: row.id,
      status: 'complete',
      url: `/report/${row.id}`,
      company: row.company_name,
      score: {
        verified: row.score_verified,
        quickwins: row.score_quickwins,
        gaps: row.score_gaps,
        total: row.score_total,
      },
    });
  }

  if (row.status === 'error') {
    return c.json({ id: row.id, status: 'error', error: row.error });
  }

  return c.json({ id: row.id, status: 'processing' });
});

// Background processing function
async function processAnalysis(
  id: string,
  pdfBase64: string,
  stage: number,
  userId: string | null,
  env: Bindings
): Promise<void> {
  try {
    // Run Claude API analysis
    const analysis = await analyzeDeck(pdfBase64, stage, env);

    // Generate HTML report
    const reportHtml = generateReport(analysis);

    // Store report in R2
    await env.STORAGE.put(`reports/${id}.html`, reportHtml, {
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

    // Update D1 with results
    await env.DB.prepare(
      "UPDATE analyses SET status = 'complete', company_name = ?, score_verified = ?, score_quickwins = ?, score_gaps = ?, score_total = ? WHERE id = ?"
    ).bind(analysis.company.name, verified, quickwins, gaps, total, id).run();

    // Decrement credits if authenticated
    if (userId) {
      await env.DB.prepare('UPDATE users SET credits = credits - 1 WHERE id = ? AND credits > 0')
        .bind(userId).run();
    }

    // Increment usage counter
    await env.DB.prepare("UPDATE stats SET value = value + 1 WHERE key = 'total_analyses'").run();

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed';
    await env.DB.prepare(
      "UPDATE analyses SET status = 'error', error = ? WHERE id = ?"
    ).bind(message, id).run();
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
