import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import db, { DATA_DIR } from './db';
import { analyzeDeck } from './lib/analyze';
import { generateReport } from './lib/report';
import { Resend } from 'resend';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const port = parseInt(process.env.PORT || '8787', 10);

app.use(express.json());

// ── Static files ──────────────────────────────────────
app.use(express.static(path.join(process.cwd(), 'public')));

// ── Analysis ──────────────────────────────────────────

app.post('/api/analysis/create', upload.single('deck'), async (req, res) => {
  const file = req.file;
  if (!file || !file.size) return res.status(400).json({ error: 'No PDF file provided' });
  if (file.mimetype !== 'application/pdf') return res.status(400).json({ error: 'File must be a PDF' });

  const stage = parseInt((req.body.stage as string) ?? '1', 10);
  if (![0, 1, 2].includes(stage)) return res.status(400).json({ error: 'Stage must be 0, 1, or 2' });

  // Auth check
  const cookies = req.headers.cookie ?? '';
  const hasFreeCookie = cookies.includes('vs_free=1');
  const hasSession = cookies.includes('session=');

  if (hasFreeCookie && !hasSession) {
    return res.status(401).json({ error: 'Sign up for 50 free analyses', requiresAuth: true });
  }

  let userId: string | null = null;
  if (hasSession) {
    const match = cookies.match(/session=([^;]+)/);
    if (match) {
      try {
        const [payloadB64] = match[1].split('.');
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
        userId = payload.uid;
        const user = db.prepare('SELECT credits FROM users WHERE id = ?').get(payload.uid) as { credits: number } | undefined;
        if (user && user.credits <= 0) return res.status(403).json({ error: 'No credits remaining' });
      } catch { /* proceed */ }
    }
  }

  const pdfBase64 = file.buffer.toString('base64');
  const id = crypto.randomUUID();

  // Create pending record
  db.prepare(
    "INSERT INTO analyses (id, user_id, status, company_name, stage) VALUES (?, ?, 'processing', '', ?)"
  ).run(id, userId, stage);

  // Set free cookie
  if (!hasFreeCookie && !hasSession) {
    res.cookie('vs_free', '1', { httpOnly: true, sameSite: 'lax', maxAge: 365 * 24 * 60 * 60 * 1000 });
  }

  // Return immediately
  res.status(202).json({ id, status: 'processing' });

  // Process in background via setTimeout (runs after response is sent)
  setTimeout(() => {
    processAnalysis(id, pdfBase64, stage, userId).catch(err => {
      console.error('Background analysis failed:', err);
    });
  }, 0);
});

async function processAnalysis(id: string, pdfBase64: string, stage: number, userId: string | null) {
  try {
    console.log(`[${id}] Starting analysis...`);
    const analysis = await analyzeDeck(pdfBase64, stage);
    console.log(`[${id}] Analysis complete, generating report...`);
    const reportHtml = generateReport(analysis);

    fs.writeFileSync(path.join(DATA_DIR, 'reports', `${id}.html`), reportHtml, 'utf-8');

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

    db.prepare(
      "UPDATE analyses SET status = 'complete', company_name = ?, score_verified = ?, score_quickwins = ?, score_gaps = ?, score_total = ? WHERE id = ?"
    ).run(analysis.company.name, verified, quickwins, gaps, total, id);

    if (userId) db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ? AND credits > 0').run(userId);
    db.prepare("UPDATE stats SET value = value + 1 WHERE key = 'total_analyses'").run();

    console.log(`[${id}] Done: ${analysis.company.name} — ${verified}/${total} verified`);
  } catch (err) {
    console.error(`[${id}] Analysis failed:`, err);
    const message = err instanceof Error ? err.message : 'Analysis failed';
    db.prepare("UPDATE analyses SET status = 'error', error = ? WHERE id = ?").run(message, id);
  }
}

app.get('/api/analysis/:id/status', (req, res) => {
  const row = db.prepare(
    'SELECT id, status, company_name, stage, score_verified, score_quickwins, score_gaps, score_total, error FROM analyses WHERE id = ?'
  ).get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Not found' });
  if (row.status === 'complete') {
    return res.json({ id: row.id, status: 'complete', url: `/report/${row.id}`, company: row.company_name, score: { verified: row.score_verified, quickwins: row.score_quickwins, gaps: row.score_gaps, total: row.score_total } });
  }
  res.json({ id: row.id, status: row.status, error: row.error });
});

// ── Auth ──────────────────────────────────────────────

app.post('/api/auth/magic-link', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  db.prepare('INSERT INTO auth_tokens (token, email, expires_at) VALUES (?, ?, ?)').run(token, email, expiresAt);
  db.prepare('INSERT OR IGNORE INTO users (id, email) VALUES (?, ?)').run(crypto.randomUUID(), email);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const magicUrl = `${process.env.APP_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: 'Venture Scale <onboarding@resend.dev>',
    to: email,
    subject: 'Your Venture Scale login link',
    html: `<p>Click below to sign in. This link expires in 15 minutes.</p><p><a href="${magicUrl}" style="display:inline-block;padding:12px 24px;background:#d4a72c;color:#0a0a0a;border-radius:8px;text-decoration:none;font-weight:600;">Sign In</a></p>`,
  });

  res.json({ ok: true });
});

app.get('/api/auth/verify', (req, res) => {
  const token = req.query.token as string;
  if (!token) return res.redirect('/?error=invalid_token');

  const row = db.prepare("SELECT email FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')").get(token) as { email: string } | undefined;
  if (!row) return res.redirect('/?error=expired_token');

  db.prepare('UPDATE auth_tokens SET used = 1 WHERE token = ?').run(token);
  db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE email = ?").run(row.email);
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(row.email) as { id: string };

  const payload = JSON.stringify({ uid: user.id, email: row.email, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 });
  const hmac = crypto.createHmac('sha256', process.env.AUTH_SECRET!).update(payload).digest('hex');
  const sessionToken = Buffer.from(payload).toString('base64') + '.' + hmac;

  res.cookie('session', sessionToken, { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.redirect('/app');
});

app.get('/api/auth/me', (req, res) => {
  const cookie = req.headers.cookie;
  if (!cookie) return res.json({ user: null });
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return res.json({ user: null });
  try {
    const [payloadB64, sigHex] = match[1].split('.');
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
    if (payload.exp < Date.now()) return res.json({ user: null });
    const expected = crypto.createHmac('sha256', process.env.AUTH_SECRET!).update(JSON.stringify({ uid: payload.uid, email: payload.email, exp: payload.exp })).digest('hex');
    if (sigHex !== expected) return res.json({ user: null });
    const user = db.prepare('SELECT id, email, credits FROM users WHERE id = ?').get(payload.uid);
    res.json({ user });
  } catch { res.json({ user: null }); }
});

// ── Feedback ──────────────────────────────────────────

app.post('/api/feedback', (req, res) => {
  const { sentiment, message, page } = req.body;
  const id = crypto.randomUUID();
  db.prepare('INSERT INTO feedback (id, sentiment, message, page) VALUES (?, ?, ?, ?)').run(id, sentiment ?? null, message ?? null, page ?? null);
  res.json({ ok: true });
});

// ── Stats ─────────────────────────────────────────────

app.get('/api/stats', (_req, res) => {
  const row = db.prepare("SELECT value FROM stats WHERE key = 'total_analyses'").get() as { value: number } | undefined;
  res.json({ count: row?.value ?? 0 });
});

// ── Reports ───────────────────────────────────────────

app.get('/report/:id', (req, res) => {
  const id = req.params.id;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return res.status(400).send('Invalid report ID');
  }
  const reportPath = path.join(DATA_DIR, 'reports', `${id}.html`);
  if (!fs.existsSync(reportPath)) return res.status(404).send('Report not found');
  res.sendFile(reportPath);
});

// ── App page ──────────────────────────────────────────

app.get('/app', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'app.html'));
});

// ── Changelog ─────────────────────────────────────────

app.get('/changelog', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'changelog.html'));
});

// ── Start ─────────────────────────────────────────────

const server = app.listen(port, () => {
  console.log(`Venture Scale running at http://localhost:${port}`);
});
server.setTimeout(10 * 60 * 1000);
