import type { AnalysisResult } from './analyze';

// Read the template at build time — it's bundled into the worker
// We inline the template as a string constant since Workers can't read files at runtime
// The template is the canonical one from .claude/skills/venture-scale/template.html
// To update: copy template.html content here

export function generateReport(analysis: AnalysisResult): string {
  const { company } = analysis;
  const companyName = company.name || 'Unknown Company';
  const stageLabels: Record<number, string> = { 0: 'Pre-Seed', 1: 'Seed', 2: 'Series A+' };

  // Build meta tags
  const metaTags: string[] = [];
  if (company.revenue) metaTags.push(`<span class="meta-tag"><strong>Revenue:</strong> ${escapeHtml(company.revenue)}</span>`);
  if (company.growth) metaTags.push(`<span class="meta-tag"><strong>Growth:</strong> ${escapeHtml(company.growth)}</span>`);
  if (company.ask) metaTags.push(`<span class="meta-tag"><strong>Ask:</strong> ${escapeHtml(company.ask)}</span>`);

  // Serialize analysis data for the template's JavaScript
  const dataJson = JSON.stringify({
    categories: analysis.categories,
    topQuickWins: analysis.topQuickWins,
    structuralGaps: analysis.structuralGaps,
  });

  // Return the complete HTML report
  // This is the template from .claude/skills/venture-scale/template.html
  // with company info and data injected
  return buildHtml(companyName, company.description || '', metaTags.join('\n      '), analysis.stage, dataJson);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildHtml(
  companyName: string,
  description: string,
  metaHtml: string,
  stage: number,
  dataJson: string
): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(companyName)} - Pitch Deck Evaluation</title>
<style>
  [data-theme="dark"] {
    --gold: #e8e4a0; --gold-dim: #b8b470; --bg: #0a0a0a; --bg-card: #141414;
    --bg-card-hover: #1a1a1a; --text: #e0e0e0; --text-dim: #888; --text-bright: #fff;
    --green: #4ade80; --green-bg: rgba(74,222,128,0.08);
    --amber: #fbbf24; --amber-bg: rgba(251,191,36,0.08);
    --red: #f87171; --red-bg: rgba(248,113,113,0.08);
    --border: #222; --muted: #444;
    --ring-track: #222; --bar-track: #1a1a1a;
    --pill-active-bg: rgba(232,228,160,0.08); --row-hover: rgba(255,255,255,0.02);
    --row-border: rgba(255,255,255,0.03); --excl-bg: rgba(255,255,255,0.03);
    --qw-bg: rgba(251,191,36,0.03); --stage-tag-bg: rgba(255,255,255,0.05);
  }
  [data-theme="light"] {
    --gold: #7a6d18; --gold-dim: #9a8a28; --bg: #f7f7f2; --bg-card: #fff;
    --bg-card-hover: #fafaf5; --text: #333; --text-dim: #777; --text-bright: #111;
    --green: #16a34a; --green-bg: rgba(22,163,74,0.07);
    --amber: #b47d04; --amber-bg: rgba(180,125,4,0.07);
    --red: #dc2626; --red-bg: rgba(220,38,38,0.06);
    --border: #e2e2da; --muted: #bbb;
    --ring-track: #e5e5e0; --bar-track: #eee;
    --pill-active-bg: rgba(122,109,24,0.06); --row-hover: rgba(0,0,0,0.02);
    --row-border: rgba(0,0,0,0.05); --excl-bg: rgba(0,0,0,0.03);
    --qw-bg: rgba(180,125,4,0.04); --stage-tag-bg: rgba(0,0,0,0.05);
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; min-height: 100vh; transition: background 0.2s, color 0.2s; }
  .container { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
  .theme-toggle { position: fixed; top: 16px; right: 16px; z-index: 100; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-dim); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .theme-toggle:hover { border-color: var(--gold-dim); color: var(--text); }
  .header { text-align: center; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
  .header-brand { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 16px; }
  .header h1 { font-size: 32px; font-weight: 700; color: var(--text-bright); margin-bottom: 8px; }
  .header-sub { font-size: 15px; color: var(--text-dim); margin-bottom: 24px; }
  .header-meta { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
  .meta-tag { font-size: 13px; color: var(--text-dim); background: var(--bg-card); padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); }
  .meta-tag strong { color: var(--text); }
  .stage-selector { margin-bottom: 32px; }
  .stage-selector-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-dim); margin-bottom: 10px; }
  .stage-pills { display: flex; gap: 6px; flex-wrap: wrap; }
  .stage-pill { font-size: 13px; padding: 8px 20px; border-radius: 24px; border: 1px solid var(--border); background: transparent; color: var(--text-dim); cursor: pointer; transition: all 0.15s; font-family: inherit; font-weight: 500; }
  .stage-pill:hover { border-color: var(--gold-dim); color: var(--text); }
  .stage-pill.active { border-color: var(--gold); color: var(--gold); background: var(--pill-active-bg); }
  .stage-pill .pill-count { font-size: 11px; opacity: 0.6; margin-left: 4px; }
  .methodology { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 24px; margin-bottom: 32px; }
  .methodology h2 { font-size: 16px; color: var(--gold); margin-bottom: 12px; font-weight: 600; }
  .methodology p { font-size: 14px; color: var(--text-dim); margin-bottom: 16px; line-height: 1.7; }
  .scoring-legend { display: flex; gap: 12px; flex-wrap: wrap; }
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 8px 14px; border-radius: 8px; }
  .legend-item.green { background: var(--green-bg); color: var(--green); }
  .legend-item.amber { background: var(--amber-bg); color: var(--amber); }
  .legend-item.red { background: var(--red-bg); color: var(--red); }
  .scorecard { margin-bottom: 32px; }
  .scorecard h2 { font-size: 20px; font-weight: 700; color: var(--text-bright); margin-bottom: 20px; }
  .score-overall { display: flex; align-items: center; gap: 32px; margin-bottom: 28px; padding: 24px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; }
  .score-ring { width: 100px; height: 100px; flex-shrink: 0; position: relative; }
  .score-ring svg { transform: rotate(-90deg); }
  .score-ring-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-ring-number { font-size: 28px; font-weight: 700; color: var(--gold); line-height: 1; }
  .score-ring-label { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
  .score-summary-stats { display: flex; gap: 24px; flex-wrap: wrap; }
  .stat-block { text-align: center; }
  .stat-number { font-size: 24px; font-weight: 700; line-height: 1; }
  .stat-number.green { color: var(--green); }
  .stat-number.amber { color: var(--amber); }
  .stat-number.red { color: var(--red); }
  .stat-label { font-size: 11px; color: var(--text-dim); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .score-bars { display: flex; flex-direction: column; gap: 10px; }
  .bar-row { display: grid; grid-template-columns: 130px 1fr 40px; align-items: center; gap: 12px; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: background 0.15s; }
  .bar-row:hover { background: var(--bg-card); }
  .bar-row.dimmed { opacity: 0.3; pointer-events: none; }
  .bar-label { font-size: 13px; font-weight: 500; color: var(--text); }
  .bar-track { height: 24px; background: var(--bar-track); border-radius: 4px; overflow: hidden; display: flex; }
  .bar-fill-green { background: var(--green); height: 100%; transition: width 0.4s ease; }
  .bar-fill-amber { background: var(--amber); height: 100%; transition: width 0.4s ease; }
  .bar-fill-red { background: var(--red); height: 100%; opacity: 0.6; transition: width 0.4s ease; }
  .bar-score { font-size: 13px; color: var(--text-dim); text-align: right; font-variant-numeric: tabular-nums; }
  .filter-bar { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
  .filter-btn { font-size: 13px; padding: 7px 16px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--text-dim); cursor: pointer; transition: all 0.15s; font-family: inherit; }
  .filter-btn:hover { border-color: var(--gold-dim); color: var(--text); }
  .filter-btn.active { border-color: var(--gold); color: var(--gold); background: var(--pill-active-bg); }
  .filter-sep { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }
  .category { margin-bottom: 16px; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: var(--bg-card); transition: opacity 0.3s; }
  .category.all-excluded { opacity: 0.3; }
  .category-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; user-select: none; transition: background 0.15s; }
  .category-header:hover { background: var(--bg-card-hover); }
  .category-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .category-name { font-size: 16px; font-weight: 600; color: var(--text-bright); }
  .category-badge { font-size: 12px; padding: 2px 10px; border-radius: 12px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .category-badge.good { background: var(--green-bg); color: var(--green); }
  .category-badge.ok { background: var(--amber-bg); color: var(--amber); }
  .category-badge.weak { background: var(--red-bg); color: var(--red); }
  .category-stage-note { font-size: 11px; color: var(--text-dim); font-style: italic; }
  .category-chevron { color: var(--text-dim); transition: transform 0.2s; font-size: 18px; }
  .category.open .category-chevron { transform: rotate(180deg); }
  .category-body { display: none; border-top: 1px solid var(--border); }
  .category.open .category-body { display: block; animation: fadeIn 0.2s ease; }
  .cat-desc { padding: 12px 20px 4px; font-size: 13px; color: var(--text-dim); border-bottom: 1px solid var(--row-border); }
  .question-row { display: grid; grid-template-columns: 36px 1fr; gap: 0; padding: 14px 20px; border-bottom: 1px solid var(--row-border); transition: all 0.2s; }
  .question-row:last-of-type { border-bottom: none; }
  .question-row:hover { background: var(--row-hover); }
  .question-row.excluded { opacity: 0.25; }
  .question-row.hidden { display: none; }
  .question-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; margin-top: 1px; flex-shrink: 0; }
  .question-icon.green { background: var(--green-bg); color: var(--green); }
  .question-icon.amber { background: var(--amber-bg); color: var(--amber); }
  .question-icon.red { background: var(--red-bg); color: var(--red); }
  .question-icon.excluded-icon { background: var(--excl-bg); color: var(--muted); }
  .question-content { min-width: 0; }
  .question-text { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 4px; }
  .question-stage-tag { display: inline-block; font-size: 10px; padding: 1px 7px; border-radius: 8px; background: var(--stage-tag-bg); color: var(--text-dim); margin-left: 6px; font-weight: 400; vertical-align: middle; }
  .question-notes { font-size: 13px; color: var(--text-dim); line-height: 1.6; }
  .category-quickwins { padding: 16px 20px; background: var(--qw-bg); border-top: 1px solid var(--border); }
  .quickwins-title { font-size: 12px; font-weight: 600; color: var(--amber); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .quickwins-list { list-style: none; padding: 0; }
  .quickwins-list li { font-size: 13px; color: var(--text-dim); padding: 4px 0 4px 16px; position: relative; }
  .quickwins-list li::before { content: ">"; position: absolute; left: 0; color: var(--amber); font-weight: 600; }
  .recommendations { margin-top: 40px; }
  .recommendations h2 { font-size: 20px; font-weight: 700; color: var(--text-bright); margin-bottom: 20px; }
  .rec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
  .rec-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
  .rec-card.quickwin { border-left: 3px solid var(--amber); }
  .rec-card.structural { border-left: 3px solid var(--red); }
  .rec-number { font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .rec-card.quickwin .rec-number { color: var(--amber); }
  .rec-card.structural .rec-number { color: var(--red); }
  .rec-title { font-size: 15px; font-weight: 600; color: var(--text-bright); margin-bottom: 8px; }
  .rec-desc { font-size: 13px; color: var(--text-dim); line-height: 1.6; }
  .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); text-align: center; font-size: 12px; color: var(--text-dim); }
  .footer a { color: var(--gold-dim); text-decoration: none; }
  .footer a:hover { color: var(--gold); }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @media (max-width: 640px) {
    .rec-grid { grid-template-columns: 1fr; }
    .score-overall { flex-direction: column; text-align: center; }
    .bar-row { grid-template-columns: 100px 1fr 36px; }
  }
</style>
</head>
<body>
<button class="theme-toggle" id="themeToggle" title="Toggle light/dark mode"></button>
<div class="container">
  <div class="header">
    <div class="header-brand">Venture Scale Checklist</div>
    <h1>${escapeHtml(companyName)}</h1>
    <div class="header-sub">${escapeHtml(description)}</div>
    <div class="header-meta">
      ${metaHtml}
    </div>
  </div>
  <div class="stage-selector">
    <div class="stage-selector-label">Evaluate for stage</div>
    <div class="stage-pills" id="stagePills"></div>
  </div>
  <div class="methodology">
    <h2>How this works</h2>
    <p>Startup valuations are based on perceived certainty. This checklist evaluates whether the pitch deck surfaces enough information for an investor to get excited. Not all criteria matter equally at every stage &mdash; the stage filter above shows only what investors reasonably expect at that round.</p>
    <p>Start by turning quick wins (&cir;) into verified (&check;) &mdash; these are deck edits, not business changes. Then work on closing structural gaps (&cross;).</p>
    <div class="scoring-legend">
      <div class="legend-item green"><span>&check;</span><strong>Verified</strong> &mdash; clear from the deck</div>
      <div class="legend-item amber"><span>&cir;</span><strong>Quick win</strong> &mdash; true but not surfaced</div>
      <div class="legend-item red"><span>&cross;</span><strong>Gap</strong> &mdash; not demonstrated</div>
    </div>
  </div>
  <div class="scorecard">
    <h2>Scorecard</h2>
    <div class="score-overall" id="scoreOverall"></div>
    <div class="score-bars" id="scoreBars"></div>
  </div>
  <div class="filter-bar">
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="green">Verified</button>
    <button class="filter-btn" data-filter="amber">Quick Wins</button>
    <button class="filter-btn" data-filter="red">Gaps</button>
    <div class="filter-sep"></div>
    <button class="filter-btn" data-filter="excluded">Not expected at stage</button>
  </div>
  <div id="categories"></div>
  <div class="recommendations">
    <h2>Top Quick Wins</h2>
    <p style="font-size:13px;color:var(--text-dim);margin-bottom:16px;">True about the business but not surfaced in the deck. Deck edits only.</p>
    <div class="rec-grid" id="quickWins"></div>
    <h2>Top Structural Gaps</h2>
    <p style="font-size:13px;color:var(--text-dim);margin-bottom:16px;">Require actual business changes, not just deck edits.</p>
    <div class="rec-grid" id="structuralGaps"></div>
  </div>
  <div class="footer">
    Analyzed by <a href="https://venture-scale.imaan.workers.dev" target="_blank">Venture Scale</a> &middot; <a href="https://venture-scale.notion.site/The-Checklist-a04787b2ff8142cf85e896b343cf0888" target="_blank">The Checklist</a>
  </div>
</div>
<script>
const STAGES=[{id:'pre-seed',label:'Pre-Seed',idx:0},{id:'seed',label:'Seed',idx:1},{id:'series-a',label:'Series A+',idx:2}];
const STAGE_LABELS={0:'Pre-Seed',1:'Seed',2:'Series A+'};
let currentStage=${stage};
const data=${dataJson};

const toggle=document.getElementById('themeToggle');
function setTheme(t){document.documentElement.setAttribute('data-theme',t);toggle.textContent=t==='dark'?'\\u2600':'\\u263E';localStorage.setItem('theme',t)}
toggle.onclick=()=>setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
const paramTheme=new URLSearchParams(window.location.search).get('theme');
setTheme(paramTheme||localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));

function isActive(s){return s<=currentStage}
function getStats(){let g=0,a=0,r=0,total=0,excluded=0;const cats=[];data.categories.forEach(cat=>{let cg=0,ca=0,cr=0,ce=0;cat.questions.forEach(q=>{if(isActive(q.stage)){total++;if(q.s==='green'){g++;cg++}else if(q.s==='amber'){a++;ca++}else{r++;cr++}}else{excluded++;ce++}});cats.push({g:cg,a:ca,r:cr,e:ce,total:cg+ca+cr})});return{g,a,r,total,excluded,cats}}

function render(){
  const st=getStats();const pct=st.total>0?Math.round(st.g/st.total*100):0;const circ=2*Math.PI*42;const off=circ-(pct/100)*circ;
  const pills=document.getElementById('stagePills');
  pills.innerHTML=STAGES.map(s=>{let c=0;data.categories.forEach(cat=>cat.questions.forEach(q=>{if(q.stage<=s.idx)c++}));return\`<button class="stage-pill\${s.idx===currentStage?' active':''}" data-stage="\${s.idx}">\${s.label}<span class="pill-count">\${c}</span></button>\`}).join('');
  pills.querySelectorAll('.stage-pill').forEach(b=>{b.onclick=()=>{currentStage=+b.dataset.stage;render()}});
  document.getElementById('scoreOverall').innerHTML=\`<div class="score-ring"><svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="var(--ring-track)" stroke-width="6"/><circle cx="50" cy="50" r="42" fill="none" stroke="var(--gold)" stroke-width="6" stroke-dasharray="\${circ}" stroke-dashoffset="\${off}" stroke-linecap="round"/></svg><div class="score-ring-text"><span class="score-ring-number">\${pct}%</span><span class="score-ring-label">verified</span></div></div><div class="score-summary-stats"><div class="stat-block"><div class="stat-number green">\${st.g}</div><div class="stat-label">Verified</div></div><div class="stat-block"><div class="stat-number amber">\${st.a}</div><div class="stat-label">Quick Wins</div></div><div class="stat-block"><div class="stat-number red">\${st.r}</div><div class="stat-label">Gaps</div></div><div class="stat-block"><div class="stat-number" style="color:var(--text-dim)">\${st.total}</div><div class="stat-label">At Stage</div></div>\${st.excluded>0?\`<div class="stat-block"><div class="stat-number" style="color:var(--muted)">\${st.excluded}</div><div class="stat-label">Later Stage</div></div>\`:''}</div>\`;
  const bars=document.getElementById('scoreBars');bars.innerHTML='';
  data.categories.forEach((cat,i)=>{const c=st.cats[i],dim=c.total===0;const gP=c.total>0?c.g/c.total*100:0,aP=c.total>0?c.a/c.total*100:0,rP=c.total>0?c.r/c.total*100:0;bars.innerHTML+=\`<div class="bar-row\${dim?' dimmed':''}" data-cat="\${i}"><span class="bar-label">\${cat.name}</span><div class="bar-track"><div class="bar-fill-green" style="width:\${gP}%"></div><div class="bar-fill-amber" style="width:\${aP}%"></div><div class="bar-fill-red" style="width:\${rP}%"></div></div><span class="bar-score">\${dim?'\\u2014':c.g+'/'+c.total}</span></div>\`});
  bars.querySelectorAll('.bar-row:not(.dimmed)').forEach(r=>{r.onclick=()=>{const e=document.querySelectorAll('.category')[+r.dataset.cat];e.classList.add('open');e.scrollIntoView({behavior:'smooth',block:'start'})}});
  const cEl=document.getElementById('categories');cEl.innerHTML='';
  data.categories.forEach((cat,i)=>{const c=st.cats[i],allEx=c.total===0;const p=c.total>0?Math.round(c.g/c.total*100):0;const bc=allEx?'':p>=60?'good':p>=40?'ok':'weak';let h=\`<div class="category\${allEx?' all-excluded':''}\${i===0&&!allEx?' open':''}" data-index="\${i}"><div class="category-header" onclick="this.parentElement.classList.toggle('open')"><div class="category-left"><span class="category-name">\${cat.name}</span>\${allEx?'<span class="category-stage-note">Not expected at '+STAGE_LABELS[currentStage]+'</span>':'<span class="category-badge '+bc+'">'+c.g+'/'+c.total+' verified</span>'+(c.e>0?'<span class="category-stage-note">+'+c.e+' later</span>':'')}</div><span class="category-chevron">\\u25BE</span></div><div class="category-body"><div class="cat-desc">\${cat.description}</div>\`;
  cat.questions.forEach(q=>{const act=isActive(q.stage),ic=act?(q.s==='green'?'\\u2713':q.s==='amber'?'\\u25CB':'\\u2717'):'\\u2014';const icl=act?q.s:'excluded-icon',tag=!act?\`<span class="question-stage-tag">\${STAGE_LABELS[q.stage]}+</span>\`:'';h+=\`<div class="question-row\${act?'':' excluded'}" data-score="\${act?q.s:'excluded'}"><div class="question-icon \${icl}">\${ic}</div><div class="question-content"><div class="question-text">\${q.q}\${tag}</div><div class="question-notes">\${q.n}</div></div></div>\`});
  if(cat.quickwins.length>0&&c.total>0){h+=\`<div class="category-quickwins"><div class="quickwins-title">Quick wins</div><ul class="quickwins-list">\${cat.quickwins.map(w=>'<li>'+w+'</li>').join('')}</ul></div>\`}
  h+=\`</div></div>\`;cEl.innerHTML+=h});
  const qw=document.getElementById('quickWins');qw.innerHTML='';
  data.topQuickWins.filter(r=>r.stage<=currentStage).forEach((r,i)=>{qw.innerHTML+=\`<div class="rec-card quickwin"><div class="rec-number">Quick win \${i+1}</div><div class="rec-title">\${r.title}</div><div class="rec-desc">\${r.desc}</div></div>\`});
  const sg=document.getElementById('structuralGaps');sg.innerHTML='';
  data.structuralGaps.filter(r=>r.stage<=currentStage).forEach((r,i)=>{sg.innerHTML+=\`<div class="rec-card structural"><div class="rec-number">Structural gap \${i+1}</div><div class="rec-title">\${r.title}</div><div class="rec-desc">\${r.desc}</div></div>\`});
  bindFilters();
}
function bindFilters(){document.querySelectorAll('.filter-btn').forEach(b=>{b.onclick=()=>{document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;document.querySelectorAll('.question-row').forEach(r=>{if(f==='all')r.classList.remove('hidden');else if(f==='excluded')r.classList.toggle('hidden',r.dataset.score!=='excluded');else r.classList.toggle('hidden',r.dataset.score!==f)});document.querySelectorAll('.category').forEach(c=>{const v=c.querySelectorAll('.question-row:not(.hidden)');if(f!=='all'&&v.length>0)c.classList.add('open')})}})}
render();
</script>
</body>
</html>`;
}
