import type { Bindings } from '../types';

export interface AnalysisResult {
  company: {
    name: string;
    description: string;
    revenue: string | null;
    ask: string | null;
    growth: string | null;
  };
  stage: number; // 0=Pre-Seed, 1=Seed, 2=Series A+
  categories: CategoryResult[];
  topQuickWins: Recommendation[];
  structuralGaps: Recommendation[];
}

export interface CategoryResult {
  name: string;
  description: string;
  questions: QuestionResult[];
  quickwins: string[];
}

export interface QuestionResult {
  q: string;
  s: 'green' | 'amber' | 'red'; // Verified / Quick Win / Gap
  stage: number;
  n: string; // analysis notes
}

export interface Recommendation {
  title: string;
  desc: string;
  stage: number;
}

const STAGE_LABELS: Record<number, string> = { 0: 'Pre-Seed', 1: 'Seed', 2: 'Series A+' };

const SYSTEM_PROMPT = `You are an expert venture capital analyst. You evaluate pitch decks against the Venture Scale investor checklist — 45 questions across 8 categories, scored at the appropriate stage.

## Your Task
Analyze the provided pitch deck PDF and score EVERY question in the checklist below. Return a JSON object matching the exact schema specified.

## Scoring System
For each question, assign one score:
- **"green"** (Verified) — an investor can quickly confirm this from the deck alone
- **"amber"** (Quick Win) — this is likely true about the business, but the deck doesn't surface it clearly (a deck edit would fix it)
- **"red"** (Gap) — not demonstrated, not addressed, or appears to be false

**IMPORTANT:** For questions about negative traits (skill gaps, over-reliance, cashflow limitations), scoring is INVERTED:
- "green" = the deck shows there is NO problem
- "red" = the deck reveals a problem or doesn't address it

## Analysis Notes
For each question, write 1-3 sentences explaining your reasoning. Be specific — reference actual slides, numbers, or claims from the deck. Don't be vague.

## The Checklist

### Team
*Evaluates whether the founding team inspires confidence through experience, skills, character, and completeness.*
1. Do you have strong experience in the space? [Pre-Seed]
2. Can you demonstrate raw intellect? [Pre-Seed]
3. Can you demonstrate integrity? [Pre-Seed]
4. Are you mission driven? [Pre-Seed]
5. Are you proven leaders? [Seed]
6. Can you demonstrate a high level of commercial awareness? [Seed]
7. Can you demonstrate a deep understanding of the market? [Seed]
8. Can you demonstrate grit and tenacity? [Pre-Seed]
9. Can you demonstrate deep technical skills? [Pre-Seed]
10. Is your team sufficiently diverse? [Seed]
11. Are there any clear skill gaps in your team? [Seed] (INVERTED)
12. Does your team contain a customer acquisition expert? [Seed]
13. Does your team have a COO/logistics expert? [Series A+]
14. Can you demonstrate humility? [Pre-Seed]

### Problem
*Tests whether the problem is real and validated, and whether this team is uniquely positioned to solve it.*
1. Can you demonstrate that the problem truly exists (through validation)? [Pre-Seed]
2. Is your company uniquely placed to solve this problem? [Seed]

### Solution
*Assesses whether customers love the product, whether it solves a real pain, and whether the solution can scale.*
1. Can you show that customers actually like your solution? [Seed]
2. Is your product a true painkiller, or merely a vitamin? [Pre-Seed]
3. Is it 50% cheaper or faster? [Pre-Seed]
4. Does it scale effectively? [Series A+]

### Market
*Evaluates the size, growth trajectory, and timing of the market opportunity, plus the go-to-market plan.*
1. Do you have a sufficiently large (>$1bn) TAM? [Pre-Seed]
2. Is your TAM realistic? [Seed]
3. Will the market grow over time? [Pre-Seed]
4. Is the market in the middle of a shift? [Pre-Seed]
5. Do you have a solid Go-To-Market plan? [Seed]
6. How aware are customers of the problem? [Seed]

### Business Model
*Stress-tests the revenue model, projections, pricing, and key dependencies for concentration risk.*
1. Are your revenue projections realistic? [Seed]
2. Do you have a customer acquisition plan? [Seed]
3. Is your pricing model clear and simple? [Pre-Seed]
4. Does your model benefit from network effects? [Series A+]
5. Does your model generate recurring revenue? [Series A+]
6. Do you have any obvious cashflow limitations? [Seed] (INVERTED)
7. Are you overly reliant on a specific customer segment? [Seed] (INVERTED)
8. Are you overly reliant on a specific employee type? [Series A+] (INVERTED)
9. Are you overly reliant on a specific supplier? [Seed] (INVERTED)

### Value Creation
*Examines the uniqueness of the offering, its defensibility (legal and creative), and the realistic revenue ceiling.*
1. What is your unique selling point (USP)? [Pre-Seed]
2. Is your USP legally defensible? [Series A+]
3. Is your USP creatively defensible? [Seed]
4. Does your business have genuinely high ($100M+/yr) revenue potential? [Series A+]

### Competition
*Tests whether you have a defensible head start and whether competitors face real barriers to copying you.*
1. Do you have an early mover advantage? [Seed]
2. Do you have a logical acquiring company? [Series A+]
3. Do your competitors have significant barriers to entry? [Series A+]

### Exit
*Assesses whether investors can see a clear path to returns — via IPO, acquisition, or strong industry multiples.*
1. Are you a realistic prospect for a future IPO? [Series A+]
2. Are you a realistic prospect for a future acquisition? [Series A+]
3. Does your industry vertical have a strong exit multiple? [Series A+]

## After Scoring
Identify:
- **Top 5 Quick Wins** — the most impactful quick wins that would improve the deck with minimal effort (deck edits only)
- **Top 3 Structural Gaps** — the most concerning gaps that require actual business changes

## Output Format
Return ONLY valid JSON matching this exact schema (no markdown, no code fences):
{
  "company": {
    "name": "Company Name",
    "description": "One-line description",
    "revenue": "Revenue if stated, or null",
    "ask": "Fundraising ask if stated, or null",
    "growth": "Key growth metric if stated, or null"
  },
  "categories": [
    {
      "name": "Team",
      "description": "Category description",
      "questions": [
        { "q": "Question text", "s": "green|amber|red", "stage": 0, "n": "Analysis notes" }
      ],
      "quickwins": ["Quick win recommendation"]
    }
  ],
  "topQuickWins": [
    { "title": "Title", "desc": "Description", "stage": 0 }
  ],
  "structuralGaps": [
    { "title": "Title", "desc": "Description", "stage": 0 }
  ]
}

Stage values: 0=Pre-Seed, 1=Seed, 2=Series A+
Score values: "green"=Verified, "amber"=Quick Win, "red"=Gap

Include ALL 45 questions in every response, with the correct stage value for each. Score every question regardless of the selected stage — the frontend handles stage filtering.`;

export async function analyzeDeck(
  pdfBase64: string,
  stage: number,
  env: Bindings
): Promise<AnalysisResult> {
  const stageLabel = STAGE_LABELS[stage] ?? 'Seed';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64,
              },
            },
            {
              type: 'text',
              text: `Analyze this pitch deck. The company is raising at ${stageLabel} stage. Score all 45 questions and return the JSON analysis.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    content: Array<{ type: string; text?: string }>;
  };

  const textBlock = data.content.find((b) => b.type === 'text');
  if (!textBlock?.text) {
    throw new Error('No text response from Anthropic API');
  }

  // Parse JSON — strip any markdown fences if the model wraps them
  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const result = JSON.parse(jsonStr) as AnalysisResult;
  result.stage = stage;
  return result;
}
