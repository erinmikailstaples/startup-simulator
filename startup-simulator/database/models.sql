-- SQLite database schema for Sh*tty Startup Simulator™

-- Game Sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL UNIQUE,
    startup_name TEXT NOT NULL,
    mission TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT
);

-- Strategy table
CREATE TABLE IF NOT EXISTS strategies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    vision TEXT NOT NULL,
    target_market TEXT NOT NULL,
    funding_goal TEXT NOT NULL,
    confidence REAL NOT NULL,
    buzzwords TEXT NOT NULL, -- Stored as JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id)
);

-- Stack Configuration table
CREATE TABLE IF NOT EXISTS stack_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    model_name TEXT NOT NULL,
    temperature REAL NOT NULL,
    max_tokens INTEGER NOT NULL,
    tools_selected TEXT NOT NULL, -- Stored as JSON array
    architecture_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id)
);

-- Prompts and Outputs table
CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    output TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id)
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    hallucination_score REAL NOT NULL,
    instruction_following REAL NOT NULL,
    relevance REAL NOT NULL,
    tool_use_accuracy REAL,
    critique TEXT NOT NULL,
    investor_appeal REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id)
);

-- Investor Decisions table
CREATE TABLE IF NOT EXISTS investor_decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    funded BOOLEAN NOT NULL,
    amount TEXT,
    feedback TEXT NOT NULL,
    valuation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id)
);

-- Archetypes table
CREATE TABLE IF NOT EXISTS startup_archetypes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL UNIQUE,
    archetype TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_session_id ON game_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_strategies_session_id ON strategies(session_id);
CREATE INDEX IF NOT EXISTS idx_stack_configs_session_id ON stack_configs(session_id);
CREATE INDEX IF NOT EXISTS idx_interactions_session_id ON interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_session_id ON evaluations(session_id);
CREATE INDEX IF NOT EXISTS idx_investor_decisions_session_id ON investor_decisions(session_id);
CREATE INDEX IF NOT EXISTS idx_startup_archetypes_session_id ON startup_archetypes(session_id); 