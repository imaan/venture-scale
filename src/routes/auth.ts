import { Hono } from 'hono';
import { Resend } from 'resend';
import type { Bindings } from '../types';

export const authRoutes = new Hono<{ Bindings: Bindings }>();

// POST /api/auth/magic-link — send a magic link email
authRoutes.post('/magic-link', async (c) => {
  const { email } = await c.req.json<{ email: string }>();
  if (!email || !email.includes('@')) {
    return c.json({ error: 'Valid email required' }, 400);
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

  // Store token
  await c.env.DB.prepare(
    'INSERT INTO auth_tokens (token, email, expires_at) VALUES (?, ?, ?)'
  ).bind(token, email, expiresAt).run();

  // Ensure user exists with 50 credits
  await c.env.DB.prepare(
    'INSERT OR IGNORE INTO users (id, email) VALUES (?, ?)'
  ).bind(crypto.randomUUID(), email).run();

  // Send magic link
  const resend = new Resend(c.env.RESEND_API_KEY);
  const magicUrl = `${c.env.APP_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: 'Venture Scale <auth@venturescale.ai>',
    to: email,
    subject: 'Your Venture Scale login link',
    html: `
      <p>Click below to sign in to Venture Scale. This link expires in 15 minutes.</p>
      <p><a href="${magicUrl}" style="display:inline-block;padding:12px 24px;background:#d4a72c;color:#0a0a0a;border-radius:8px;text-decoration:none;font-weight:600;">Sign In</a></p>
      <p style="color:#888;font-size:13px;">If you didn't request this, just ignore this email.</p>
    `,
  });

  return c.json({ ok: true });
});

// GET /api/auth/verify — verify a magic link token and set session
authRoutes.get('/verify', async (c) => {
  const token = c.req.query('token');
  if (!token) return c.redirect('/?error=invalid_token');

  const row = await c.env.DB.prepare(
    'SELECT * FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > datetime(\'now\')'
  ).bind(token).first<{ email: string }>();

  if (!row) return c.redirect('/?error=expired_token');

  // Mark token as used
  await c.env.DB.prepare('UPDATE auth_tokens SET used = 1 WHERE token = ?').bind(token).run();

  // Update last login
  await c.env.DB.prepare('UPDATE users SET last_login_at = datetime(\'now\') WHERE email = ?').bind(row.email).run();

  // Get user
  const user = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(row.email).first<{ id: string }>();

  // Create a signed session token (simple HMAC approach)
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(c.env.AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const payload = JSON.stringify({ uid: user!.id, email: row.email, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 });
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const sigHex = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
  const sessionToken = btoa(payload) + '.' + sigHex;

  // Set cookie and redirect to app
  c.header('Set-Cookie', `session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`);
  return c.redirect('/app');
});

// GET /api/auth/me — check current session
authRoutes.get('/me', async (c) => {
  const cookie = c.req.header('Cookie');
  if (!cookie) return c.json({ user: null });

  const match = cookie.match(/session=([^;]+)/);
  if (!match) return c.json({ user: null });

  try {
    const [payloadB64, sigHex] = match[1].split('.');
    const payload = JSON.parse(atob(payloadB64));

    if (payload.exp < Date.now()) return c.json({ user: null });

    // Verify signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(c.env.AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const sigBytes = new Uint8Array(sigHex.match(/.{2}/g)!.map((b: string) => parseInt(b, 16)));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(JSON.stringify({ uid: payload.uid, email: payload.email, exp: payload.exp })));

    if (!valid) return c.json({ user: null });

    const user = await c.env.DB.prepare('SELECT id, email, credits FROM users WHERE id = ?').bind(payload.uid).first();
    return c.json({ user });
  } catch {
    return c.json({ user: null });
  }
});
