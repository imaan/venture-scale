import { Hono } from 'hono';
import type { Bindings } from '../types';

export const analysisRoutes = new Hono<{ Bindings: Bindings }>();

// POST /api/analysis/create — upload a deck and start analysis
analysisRoutes.post('/create', async (c) => {
  // TODO [productionize]: Implement core analysis feature
  //
  // Flow:
  // 1. Accept multipart/form-data with PDF file + stage (0/1/2)
  // 2. Check auth: first analysis is free (track via cookie/fingerprint),
  //    subsequent analyses require session with credits > 0
  // 3. Upload PDF to R2 (temporary — delete after analysis)
  // 4. Extract text from PDF using Claude's PDF reading capability
  // 5. Run the 45-question checklist analysis via Claude API
  //    - Use the checklist from .claude/skills/venture-scale/SKILL.md
  //    - Score each question as Verified/Quick Win/Gap
  //    - Identify top 5 quick wins and top 3 structural gaps
  // 6. Generate the HTML report (from template.html + analysis data)
  // 7. Store HTML in R2, metadata in D1
  // 8. Decrement user credits (if authenticated)
  // 9. Delete the source PDF from R2
  // 10. Return { id, status: 'complete' }
  //
  // See: .claude/skills/venture-scale/SKILL.md for the full analysis prompt
  // See: .claude/skills/venture-scale/template.html for the report template

  return c.json({ error: 'Analysis feature not yet implemented' }, 501);
});

// GET /api/analysis/:id/status — poll for analysis completion
analysisRoutes.get('/:id/status', async (c) => {
  const id = c.req.param('id');

  const analysis = await c.env.DB.prepare(
    'SELECT id, company_name, stage, score_verified, score_total, created_at FROM analyses WHERE id = ?'
  ).bind(id).first();

  if (!analysis) return c.json({ error: 'Not found' }, 404);
  return c.json({ analysis, status: 'complete' });
});
