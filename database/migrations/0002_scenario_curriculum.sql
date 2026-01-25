-- D1 Database Migration: Scenario & Curriculum Schema
-- Generated from Neo4j Ontology
-- Version: 2.0
-- Date: 2026-01-24

-- ============================================
-- シナリオ・カリキュラムドメイン
-- (Scenario & Curriculum Domain)
-- ============================================

-- シナリオ (Scenario)
-- 文章題シナリオマスタ
CREATE TABLE IF NOT EXISTS scenarios (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_grades TEXT NOT NULL,                 -- JSON配列: ['L1', 'L2']
    skill_category TEXT NOT NULL,                -- 対象スキルカテゴリ
    difficulty TEXT NOT NULL DEFAULT 'BEGINNER'
        CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    status TEXT NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'GENERATED', 'REVIEWED', 'PUBLISHED', 'ARCHIVED')),
    created_by TEXT NOT NULL,
    reviewed_by TEXT,
    reviewed_at TEXT,
    published_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES employees(id),
    FOREIGN KEY (reviewed_by) REFERENCES employees(id)
);

CREATE INDEX idx_scenarios_status ON scenarios(status);
CREATE INDEX idx_scenarios_difficulty ON scenarios(difficulty);
CREATE INDEX idx_scenarios_created_by ON scenarios(created_by);
CREATE INDEX idx_scenarios_skill_category ON scenarios(skill_category);

-- シナリオ設問 (Scenario Question)
-- シナリオ内の各設問
CREATE TABLE IF NOT EXISTS scenario_questions (
    id TEXT PRIMARY KEY,
    scenario_id TEXT NOT NULL,
    question_number INTEGER NOT NULL,
    question_type TEXT NOT NULL
        CHECK (question_type IN ('MULTIPLE_CHOICE', 'FREE_TEXT', 'CODE_REVIEW', 'SCENARIO_RESPONSE')),
    question_text TEXT NOT NULL,
    options TEXT,                                 -- JSON配列（選択式の場合）
    correct_answer TEXT,                          -- 正解（選択式の場合）
    explanation TEXT,                             -- 解説
    points INTEGER NOT NULL DEFAULT 10,           -- 配点
    related_roadmap_items TEXT,                   -- JSON配列: 関連ロードマップ項目ID
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE,
    UNIQUE(scenario_id, question_number)
);

CREATE INDEX idx_scenario_questions_scenario ON scenario_questions(scenario_id);
CREATE INDEX idx_scenario_questions_type ON scenario_questions(question_type);

-- シナリオ回答 (Scenario Response)
-- 社員のシナリオ回答記録
CREATE TABLE IF NOT EXISTS scenario_responses (
    id TEXT PRIMARY KEY,
    scenario_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    assignment_id TEXT NOT NULL,                  -- カリキュラム割り当てID
    response_text TEXT,                           -- 回答内容
    selected_option TEXT,                         -- 選択肢（選択式の場合）
    is_correct INTEGER,                           -- 正解フラグ
    score INTEGER,                                -- 獲得点数
    feedback TEXT,                                -- LLMからのフィードバック
    submitted_at TEXT,
    graded_at TEXT,
    graded_by TEXT,                               -- 'SYSTEM' or employee_id
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (scenario_id) REFERENCES scenarios(id),
    FOREIGN KEY (question_id) REFERENCES scenario_questions(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (assignment_id) REFERENCES curriculum_assignments(id),
    UNIQUE(question_id, employee_id, assignment_id)
);

CREATE INDEX idx_scenario_responses_scenario ON scenario_responses(scenario_id);
CREATE INDEX idx_scenario_responses_employee ON scenario_responses(employee_id);
CREATE INDEX idx_scenario_responses_assignment ON scenario_responses(assignment_id);

-- カリキュラム (Curriculum)
-- LLM生成カリキュラム定義
CREATE TABLE IF NOT EXISTS curriculums (
    id TEXT PRIMARY KEY,
    scenario_id TEXT NOT NULL,                    -- 元シナリオ
    name TEXT NOT NULL,
    description TEXT,
    target_grades TEXT NOT NULL,                  -- JSON配列
    learning_phase TEXT NOT NULL
        CHECK (learning_phase IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    estimated_hours INTEGER NOT NULL DEFAULT 0,   -- 推定学習時間
    external_book_id TEXT,                        -- ナレッジシステムのBook ID
    noise_types TEXT,                             -- JSON配列: 適用ノイズタイプ
    status TEXT NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'GENERATED', 'REVIEWED', 'PUBLISHED', 'ARCHIVED')),
    llm_model TEXT,                               -- 生成に使用したLLMモデル
    generated_at TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT,
    published_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (scenario_id) REFERENCES scenarios(id),
    FOREIGN KEY (reviewed_by) REFERENCES employees(id)
);

CREATE INDEX idx_curriculums_scenario ON curriculums(scenario_id);
CREATE INDEX idx_curriculums_status ON curriculums(status);
CREATE INDEX idx_curriculums_learning_phase ON curriculums(learning_phase);

-- カリキュラム項目 (Curriculum Item)
-- カリキュラム内のチャプター/セクション
CREATE TABLE IF NOT EXISTS curriculum_items (
    id TEXT PRIMARY KEY,
    curriculum_id TEXT NOT NULL,
    item_number INTEGER NOT NULL,
    item_type TEXT NOT NULL
        CHECK (item_type IN ('CHAPTER', 'SECTION', 'LESSON', 'EXERCISE', 'QUIZ')),
    title TEXT NOT NULL,
    content TEXT,                                 -- マークダウン形式
    external_content_id TEXT,                     -- ナレッジシステムのコンテンツID
    related_roadmap_items TEXT,                   -- JSON配列: 関連ロードマップ項目
    estimated_minutes INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    parent_item_id TEXT,                          -- 親項目（ネスト構造用）
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_item_id) REFERENCES curriculum_items(id)
);

CREATE INDEX idx_curriculum_items_curriculum ON curriculum_items(curriculum_id);
CREATE INDEX idx_curriculum_items_type ON curriculum_items(item_type);
CREATE INDEX idx_curriculum_items_parent ON curriculum_items(parent_item_id);
CREATE INDEX idx_curriculum_items_order ON curriculum_items(curriculum_id, order_index);

-- カリキュラム割り当て (Curriculum Assignment)
-- 社員へのカリキュラム割り当て
CREATE TABLE IF NOT EXISTS curriculum_assignments (
    id TEXT PRIMARY KEY,
    curriculum_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    assigned_by TEXT NOT NULL,
    deadline TEXT,
    progress INTEGER NOT NULL DEFAULT 0
        CHECK (progress >= 0 AND progress <= 100),
    status TEXT NOT NULL DEFAULT 'ASSIGNED'
        CHECK (status IN ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED')),
    started_at TEXT,
    completed_at TEXT,
    total_score INTEGER,                          -- 総合スコア
    pass_threshold INTEGER DEFAULT 70,            -- 合格ライン
    is_passed INTEGER,                            -- 合格フラグ
    assigned_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (curriculum_id) REFERENCES curriculums(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (assigned_by) REFERENCES employees(id),
    UNIQUE(curriculum_id, employee_id)
);

CREATE INDEX idx_curriculum_assignments_curriculum ON curriculum_assignments(curriculum_id);
CREATE INDEX idx_curriculum_assignments_employee ON curriculum_assignments(employee_id);
CREATE INDEX idx_curriculum_assignments_status ON curriculum_assignments(status);
CREATE INDEX idx_curriculum_assignments_deadline ON curriculum_assignments(deadline);

-- 学習進捗 (Learning Progress)
-- カリキュラム項目ごとの進捗
CREATE TABLE IF NOT EXISTS learning_progress (
    id TEXT PRIMARY KEY,
    assignment_id TEXT NOT NULL,
    curriculum_item_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NOT_STARTED'
        CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED')),
    score INTEGER,                                -- 獲得スコア（クイズ・演習の場合）
    max_score INTEGER,                            -- 最大スコア
    attempts INTEGER DEFAULT 0,                   -- 試行回数
    time_spent_minutes INTEGER DEFAULT 0,         -- 学習時間（分）
    notes TEXT,                                   -- 学習メモ
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (assignment_id) REFERENCES curriculum_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (curriculum_item_id) REFERENCES curriculum_items(id),
    UNIQUE(assignment_id, curriculum_item_id)
);

CREATE INDEX idx_learning_progress_assignment ON learning_progress(assignment_id);
CREATE INDEX idx_learning_progress_item ON learning_progress(curriculum_item_id);
CREATE INDEX idx_learning_progress_status ON learning_progress(status);

-- ノイズタイプマスタ (Noise Type)
-- 教育的ノイズの定義
CREATE TABLE IF NOT EXISTS noise_types (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    effect TEXT,                                  -- 期待効果
    recommended_level TEXT                        -- 推奨レベル
        CHECK (recommended_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_noise_types_code ON noise_types(code);

-- ============================================
-- 初期データ挿入
-- ============================================

-- ノイズタイプマスタ
INSERT INTO noise_types (id, code, name, description, effect, recommended_level) VALUES
    ('noise_search', 'SEARCH_POLLUTION', '検索ノイズ', '検索結果に無関係な情報を混入', '情報の取捨選択能力向上', 'BEGINNER'),
    ('noise_outdated', 'OUTDATED_INFO', '古い情報', '過去のバージョンや非推奨の情報を含める', 'バージョン確認の習慣化', 'INTERMEDIATE'),
    ('noise_partial', 'PARTIAL_ANSWER', '部分的回答', '完全な解答ではなくヒントのみ提供', '自力解決能力の育成', 'INTERMEDIATE'),
    ('noise_contradict', 'CONTRADICTING_SOURCES', '矛盾情報', '異なるソースからの矛盾した情報を提示', '情報の検証能力向上', 'ADVANCED'),
    ('noise_complex', 'OVER_COMPLEX', '過度な複雑化', '必要以上に複雑なソリューションを提示', '最適解の判断能力向上', 'ADVANCED');
