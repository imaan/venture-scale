import { Hono } from 'hono';
import type { Bindings } from '../types';

export const feedbackRoutes = new Hono<{ Bindings: Bindings }>();

// POST /api/feedback — submit feedback
feedbackRoutes.post('/', async (c) => {
  const { sentiment, message, page } = await c.req.json<{
    sentiment?: string;
    message?: string;
    page?: string;
  }>();

  // Get user ID from session if available
  let userId: string | null = null;
  const cookie = c.req.header('Cookie');
  if (cookie) {
    const match = cookie.match(/session=([^;]+)/);
    if (match) {
      try {
        const [payloadB64] = match[1].split('.');
        const payload = JSON.parse(atob(payloadB64));
        userId = payload.uid;
      } catch { /* anonymous feedback is fine */ }
    }
  }

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO feedback (id, user_id, sentiment, message, page) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, userId, sentiment ?? null, message ?? null, page ?? null).run();

  return c.json({ ok: true });
});
