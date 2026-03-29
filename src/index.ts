import { Hono } from 'hono';
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
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Venture Scale — Score a Deck</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--accent:#d4a72c;--bg:#0a0a0a;--text:#e8e8e8;--text-muted:#888;--surface:#141414;--border:#222}
    body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center}
    .container{max-width:520px;width:100%;padding:48px 24px;text-align:center}
    h1{font-size:1.75rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px}
    .subtitle{color:var(--text-muted);margin-bottom:32px;font-size:0.9375rem}
    .upload-zone{border:2px dashed var(--border);border-radius:16px;padding:48px 24px;cursor:pointer;transition:border-color 0.2s,background 0.2s;margin-bottom:24px}
    .upload-zone:hover,.upload-zone.dragover{border-color:var(--accent);background:rgba(212,167,44,0.04)}
    .upload-zone.has-file{border-color:var(--accent);border-style:solid}
    .upload-icon{font-size:2.5rem;margin-bottom:12px;opacity:0.4}
    .upload-text{color:var(--text-muted);font-size:0.875rem}
    .upload-text strong{color:var(--text)}
    .file-name{font-family:'JetBrains Mono',monospace;font-size:0.8125rem;color:var(--accent);margin-top:8px}
    .stage-select{display:flex;gap:8px;justify-content:center;margin-bottom:24px}
    .stage-btn{font-family:inherit;font-size:0.8125rem;padding:8px 20px;border-radius:24px;border:1px solid var(--border);background:transparent;color:var(--text-muted);cursor:pointer;transition:all 0.15s}
    .stage-btn:hover{border-color:var(--accent);color:var(--text)}
    .stage-btn.active{border-color:var(--accent);color:var(--accent);background:rgba(212,167,44,0.08)}
    .analyze-btn{font-family:inherit;font-size:1rem;font-weight:600;padding:14px 40px;background:var(--accent);color:var(--bg);border:none;border-radius:8px;cursor:pointer;transition:opacity 0.2s;width:100%;max-width:320px}
    .analyze-btn:hover{opacity:0.88}
    .analyze-btn:disabled{opacity:0.4;cursor:not-allowed}
    .status{margin-top:24px;font-size:0.875rem;color:var(--text-muted)}
    .status.error{color:#f87171}
    .wait-experience{margin-top:24px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:12px}
    .timer{font-family:'JetBrains Mono',monospace;font-size:2rem;font-weight:700;color:var(--accent);margin-bottom:16px}
    .progress-bar{height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-bottom:16px}
    .progress-fill{height:100%;background:var(--accent);width:0%;transition:width 1s linear}
    .wait-detail{font-size:0.8125rem;color:var(--text-muted);line-height:1.6;min-height:40px;transition:opacity 0.3s}
    .wait-detail .step-label{color:var(--text);font-weight:500}
    .back-link{display:inline-block;margin-top:24px;font-size:0.8125rem;color:var(--text-muted);text-decoration:none}
    .back-link:hover{color:var(--accent)}
    .note{font-size:0.75rem;color:var(--text-muted);margin-top:12px}
  </style>
</head>
<body>
  <div class="container">
    <h1>Score a Pitch Deck</h1>
    <p class="subtitle">Upload a PDF, pick the stage, get a scored report.</p>

    <div class="upload-zone" id="dropzone">
      <div class="upload-icon">&#128196;</div>
      <p class="upload-text"><strong>Drop a PDF here</strong> or click to browse</p>
      <p class="file-name" id="fileName"></p>
    </div>
    <input type="file" id="fileInput" accept=".pdf" hidden>

    <div class="stage-select">
      <button class="stage-btn" data-stage="0">Pre-Seed</button>
      <button class="stage-btn active" data-stage="1">Seed</button>
      <button class="stage-btn" data-stage="2">Series A+</button>
    </div>

    <button class="analyze-btn" id="analyzeBtn" disabled>Analyze Deck</button>
    <p class="note">First analysis is free. No signup needed.</p>

    <div class="status" id="status"></div>
    <div class="wait-experience" id="waitExperience" style="display:none">
      <div class="timer" id="timer">0:00</div>
      <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
      <div class="wait-detail" id="waitDetail"></div>
    </div>

    <a href="/" class="back-link">&larr; Back to Venture Scale</a>
  </div>

  <script>
    let selectedFile = null;
    let selectedStage = 1;
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const status = document.getElementById('status');
    const progress = document.getElementById('progress');

    // File selection
    dropzone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => { if (e.target.files[0]) setFile(e.target.files[0]); };
    dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('dragover'); };
    dropzone.ondragleave = () => dropzone.classList.remove('dragover');
    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const f = e.dataTransfer.files[0];
      if (f && f.type === 'application/pdf') setFile(f);
      else { status.textContent = 'Please drop a PDF file.'; status.classList.add('error'); }
    };

    function setFile(f) {
      selectedFile = f;
      fileName.textContent = f.name;
      dropzone.classList.add('has-file');
      analyzeBtn.disabled = false;
      status.textContent = '';
      status.classList.remove('error');
    }

    // Stage selection
    document.querySelectorAll('.stage-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedStage = parseInt(btn.dataset.stage);
      };
    });

    // Notifications
    let canNotify = false;
    function requestNotifications() {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(p => { canNotify = p === 'granted'; });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        canNotify = true;
      }
    }

    function sendNotification(title, body) {
      if (canNotify && document.hidden) {
        new Notification(title, { body, icon: '/favicon.ico' });
      }
    }

    // Wait experience
    const waitSteps = [
      { at: 0,  text: '<span class="step-label">Uploading deck...</span>' },
      { at: 3,  text: '<span class="step-label">Reading slides...</span> Extracting text and visuals from every page.' },
      { at: 8,  text: '<span class="step-label">Evaluating team...</span> 14 questions on experience, skills, character, and completeness.' },
      { at: 20, text: '<span class="step-label">Analyzing market & solution...</span> TAM, timing, product-market fit, pricing.' },
      { at: 35, text: '<span class="step-label">Stress-testing business model...</span> Revenue projections, concentration risk, unit economics.' },
      { at: 50, text: '<span class="step-label">Assessing defensibility...</span> USP, competition, moats, exit potential.' },
      { at: 65, text: '<span class="step-label">Identifying quick wins...</span> What the deck could surface better with simple edits.' },
      { at: 80, text: '<span class="step-label">Compiling report...</span> Scoring all categories and generating recommendations.' },
      { at: 95, text: '<span class="step-label">Almost done...</span> Finalizing your interactive report.' },
    ];

    let timerInterval = null;
    let startTime = 0;

    function startTimer() {
      startTime = Date.now();
      const timerEl = document.getElementById('timer');
      const progressFill = document.getElementById('progressFill');
      const waitDetail = document.getElementById('waitDetail');
      let lastStepIdx = -1;

      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        timerEl.textContent = mins + ':' + secs.toString().padStart(2, '0');

        // Progress bar — estimate ~90s total, cap at 95%
        const pct = Math.min(95, (elapsed / 90) * 100);
        progressFill.style.width = pct + '%';

        // Update step text
        for (let i = waitSteps.length - 1; i >= 0; i--) {
          if (elapsed >= waitSteps[i].at && i !== lastStepIdx) {
            waitDetail.innerHTML = waitSteps[i].text;
            lastStepIdx = i;
            break;
          }
        }
      }, 1000);
    }

    function stopTimer() {
      if (timerInterval) clearInterval(timerInterval);
    }

    // Analyze
    analyzeBtn.onclick = async () => {
      if (!selectedFile) return;

      // Request notification permission on first analyze
      requestNotifications();

      analyzeBtn.disabled = true;
      analyzeBtn.textContent = 'Analyzing...';
      status.textContent = '';
      status.classList.remove('error');

      // Show wait experience
      const waitEl = document.getElementById('waitExperience');
      waitEl.style.display = 'block';
      startTimer();

      // Hide upload UI
      dropzone.style.display = 'none';
      document.querySelector('.stage-select').style.display = 'none';
      document.querySelector('.note').style.display = 'none';

      const formData = new FormData();
      formData.append('deck', selectedFile);
      formData.append('stage', selectedStage.toString());

      try {
        const res = await fetch('/api/analysis/create', { method: 'POST', body: formData });
        const data = await res.json();
        stopTimer();

        if (!res.ok) {
          waitEl.style.display = 'none';
          dropzone.style.display = '';
          document.querySelector('.stage-select').style.display = '';
          document.querySelector('.note').style.display = '';

          if (data.requiresAuth) {
            status.innerHTML = 'Sign up for 50 free analyses. <a href="/#signup" style="color:#d4a72c">Get started</a>';
          } else {
            status.textContent = data.error || 'Analysis failed. Please try again.';
            status.classList.add('error');
          }
          analyzeBtn.disabled = false;
          analyzeBtn.textContent = 'Analyze Deck';
          return;
        }

        // Success
        document.getElementById('progressFill').style.width = '100%';
        document.getElementById('waitDetail').innerHTML = '<span class="step-label">Done!</span> Your report is ready.';
        status.textContent = 'Redirecting to your report...';

        // Notify if tab is in background
        sendNotification('Venture Scale', 'Your deck analysis is ready! ' + (data.company || ''));

        setTimeout(() => { window.location.href = data.url; }, 800);
      } catch (err) {
        stopTimer();
        document.getElementById('waitExperience').style.display = 'none';
        dropzone.style.display = '';
        document.querySelector('.stage-select').style.display = '';
        document.querySelector('.note').style.display = '';
        status.textContent = 'Something went wrong. Please try again.';
        status.classList.add('error');
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analyze Deck';
      }
    };
  </script>
</body>
</html>`);
});

// Report page — serve generated HTML from R2
app.get('/report/:id', async (c) => {
  const id = c.req.param('id');

  // Validate UUID format to prevent path traversal
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return c.text('Invalid report ID', 400);
  }

  const obj = await c.env.STORAGE.get(`reports/${id}.html`);
  if (!obj) return c.text('Report not found', 404);

  const html = await obj.text();
  return c.html(html);
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
    <h2>2026-03-29 — Core Analysis</h2>
    <ul>
      <li>Upload a pitch deck PDF and get a scored analysis</li>
      <li>45-question checklist with stage-gating</li>
      <li>Interactive HTML reports with shareable URLs</li>
    </ul>
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
