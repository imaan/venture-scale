-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL DEFAULT 50,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

-- Magic link tokens
CREATE TABLE IF NOT EXISTS auth_tokens (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Analyses
CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'processing',
  company_name TEXT NOT NULL DEFAULT '',
  stage INTEGER NOT NULL,
  score_verified INTEGER NOT NULL DEFAULT 0,
  score_quickwins INTEGER NOT NULL DEFAULT 0,
  score_gaps INTEGER NOT NULL DEFAULT 0,
  score_total INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Feedback
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  sentiment TEXT,
  message TEXT,
  page TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Usage counter (single-row table)
CREATE TABLE IF NOT EXISTS stats (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO stats (key, value) VALUES ('total_analyses', 0);
