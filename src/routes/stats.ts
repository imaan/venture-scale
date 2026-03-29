import { Hono } from 'hono';
import type { Bindings } from '../types';

export const statsRoutes = new Hono<{ Bindings: Bindings }>();

// GET /api/stats — public usage counter
statsRoutes.get('/', async (c) => {
  const row = await c.env.DB.prepare(
    "SELECT value FROM stats WHERE key = 'total_analyses'"
  ).first<{ value: number }>();

  return c.json({ count: row?.value ?? 0 });
});
