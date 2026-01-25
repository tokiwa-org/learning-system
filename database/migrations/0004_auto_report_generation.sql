-- D1 Database Migration: Auto Report Generation Workflow
-- Version: 4.0
-- Date: 2026-01-25
-- Purpose: Support automatic achievement report generation workflow
--          - Remove self-evaluation and peer-evaluation steps
--          - Add automatic report generation at period start

-- ============================================
-- 達成度レポートドメイン
-- (Achievement Report Domain)
-- ============================================

-- 達成度レポート (Achievement Report)
-- 評価期間開始時に自動生成される達成状況レポート
CREATE TABLE IF NOT EXISTS achievement_reports (
    id TEXT PRIMARY KEY,
    cycle_id TEXT NOT NULL UNIQUE,
    employee_id TEXT NOT NULL,
    period_id TEXT NOT NULL,

    -- 社員スナップショット (Employee Snapshot at report generation)
    employee_grade_id TEXT NOT NULL,
    employee_step INTEGER NOT NULL,
    base_salary INTEGER NOT NULL,
    grade_salary INTEGER NOT NULL,

    -- 達成状況 (Achievement Status Summary)
    completion_rate REAL NOT NULL,                    -- ロードマップ達成率 (0.0 - 1.0)
    total_items INTEGER NOT NULL DEFAULT 0,           -- 対象ロードマップ項目数
    achieved_items INTEGER NOT NULL DEFAULT 0,        -- 達成済み項目数
    in_progress_items INTEGER NOT NULL DEFAULT 0,     -- 進行中項目数
    strengths_json TEXT,                              -- JSON: 強み（達成項目リスト）
    improvements_json TEXT,                           -- JSON: 課題（未達項目リスト）

    -- スキル習得度 (Skill Score - 50 points max)
    -- Source: curriculum completion + scenario responses (No.1-46)
    skill_score_calculated REAL NOT NULL DEFAULT 0,
    skill_items_count INTEGER NOT NULL DEFAULT 0,     -- 対象項目数
    skill_achieved_count INTEGER NOT NULL DEFAULT 0,  -- 達成済み項目数

    -- 職能発揮力 (Competency Score - 30 points max)
    -- Source: scenario response results (No.52-73)
    competency_score_calculated REAL NOT NULL DEFAULT 0,
    competency_items_count INTEGER NOT NULL DEFAULT 0,
    competency_achieved_count INTEGER NOT NULL DEFAULT 0,

    -- 行動・貢献 (Behavior Score - 20 points max)
    -- Source: curriculum progress (No.74-82)
    behavior_score_calculated REAL NOT NULL DEFAULT 0,
    behavior_items_count INTEGER NOT NULL DEFAULT 0,
    behavior_achieved_count INTEGER NOT NULL DEFAULT 0,

    -- 暫定スコア (Preliminary Scores - Manager can adjust)
    total_score_calculated REAL NOT NULL DEFAULT 0,   -- 算出合計スコア
    suggested_rank TEXT CHECK (suggested_rank IN ('S', 'A', 'B', 'C', 'D')),

    -- メタデータ
    generated_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (period_id) REFERENCES evaluation_periods(id),
    FOREIGN KEY (employee_grade_id) REFERENCES grades(id)
);

CREATE UNIQUE INDEX idx_achievement_reports_cycle ON achievement_reports(cycle_id);
CREATE INDEX idx_achievement_reports_employee ON achievement_reports(employee_id);
CREATE INDEX idx_achievement_reports_period ON achievement_reports(period_id);
CREATE INDEX idx_achievement_reports_grade ON achievement_reports(employee_grade_id);
CREATE INDEX idx_achievement_reports_generated ON achievement_reports(generated_at);

-- 達成度レポート詳細 (Achievement Report Details)
-- 各ロードマップ項目の達成状況詳細
CREATE TABLE IF NOT EXISTS achievement_report_details (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL,
    roadmap_item_id TEXT NOT NULL,
    roadmap_item_number INTEGER NOT NULL,
    axis_code TEXT NOT NULL CHECK (axis_code IN ('SKILL', 'COMPETENCY', 'BEHAVIOR')),
    status TEXT NOT NULL CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED')),
    evidence TEXT,
    curriculum_completion_rate REAL,                  -- カリキュラム完了率
    scenario_score REAL,                              -- シナリオスコア
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (report_id) REFERENCES achievement_reports(id) ON DELETE CASCADE,
    FOREIGN KEY (roadmap_item_id) REFERENCES roadmap_items(id)
);

CREATE INDEX idx_report_details_report ON achievement_report_details(report_id);
CREATE INDEX idx_report_details_item ON achievement_report_details(roadmap_item_id);
CREATE INDEX idx_report_details_axis ON achievement_report_details(axis_code);
CREATE INDEX idx_report_details_status ON achievement_report_details(status);

-- ============================================
-- evaluation_cycles テーブルのステータス更新
-- (Update evaluation_cycles status options)
-- ============================================

-- Note: SQLite doesn't support ALTER TABLE to modify CHECK constraints directly.
-- We need to:
-- 1. Create a new table with updated constraints
-- 2. Copy data with status mapping
-- 3. Drop old table
-- 4. Rename new table

-- Step 1: Create new evaluation_cycles table with updated statuses
CREATE TABLE IF NOT EXISTS evaluation_cycles_new (
    id TEXT PRIMARY KEY,
    period_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    status TEXT DEFAULT 'REPORT_GENERATED' CHECK (status IN (
        'REPORT_GENERATED',      -- レポート自動生成済み (新規)
        'MANAGER_EVALUATED',     -- 上司評価済み (renamed from MANAGER_SUBMITTED)
        'MANAGER_APPROVED',      -- 上司承認済み
        'HR_APPROVED',           -- HR承認済み
        'FINALIZED',             -- 確定
        'REJECTED'               -- 差戻し
    )),
    final_score REAL,
    final_rank TEXT CHECK (final_rank IN ('S', 'A', 'B', 'C', 'D')),
    salary_increment_rate REAL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (period_id) REFERENCES evaluation_periods(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    UNIQUE(period_id, employee_id)
);

-- Step 2: Copy data with status mapping
-- Old statuses → New statuses:
--   DRAFT, SELF_SUBMITTED, PEER_COMPLETED → REPORT_GENERATED (these shouldn't exist in new workflow)
--   MANAGER_SUBMITTED → MANAGER_EVALUATED
--   MANAGER_APPROVED, HR_APPROVED, FINALIZED, REJECTED → unchanged
INSERT INTO evaluation_cycles_new (
    id, period_id, employee_id, status, final_score, final_rank,
    salary_increment_rate, created_at, updated_at
)
SELECT
    id,
    period_id,
    employee_id,
    CASE
        WHEN status IN ('DRAFT', 'SELF_SUBMITTED', 'PEER_COMPLETED') THEN 'REPORT_GENERATED'
        WHEN status = 'MANAGER_SUBMITTED' THEN 'MANAGER_EVALUATED'
        ELSE status
    END as status,
    final_score,
    final_rank,
    salary_increment_rate,
    created_at,
    updated_at
FROM evaluation_cycles;

-- Step 3: Drop old table (with CASCADE to handle foreign keys)
-- Note: Must drop foreign key references first in SQLite
DROP TABLE IF EXISTS evaluation_cycles;

-- Step 4: Rename new table
ALTER TABLE evaluation_cycles_new RENAME TO evaluation_cycles;

-- Recreate indexes for evaluation_cycles
CREATE INDEX idx_cycles_period ON evaluation_cycles(period_id);
CREATE INDEX idx_cycles_employee ON evaluation_cycles(employee_id);
CREATE INDEX idx_cycles_status ON evaluation_cycles(status);

-- ============================================
-- ワークフローステップ定義の更新
-- (Update Workflow Step Definitions)
-- ============================================

-- Delete old workflow step definitions for EVALUATION_CYCLE
DELETE FROM workflow_step_definitions
WHERE workflow_definition_id = (
    SELECT id FROM workflow_definitions WHERE code = 'EVALUATION_CYCLE'
);

-- Insert new workflow step definitions (5 steps instead of 7)
INSERT INTO workflow_step_definitions (
    id, workflow_definition_id, step_order, code, name, actor, action,
    wait_for, timeout, on_timeout, next_status
)
SELECT
    'wsd-eval-step1-' || hex(randomblob(4)),
    id,
    1,
    'REPORT_GENERATION',
    'レポート自動生成',
    'SYSTEM',
    'generateAchievementReport',
    NULL,
    '1 hour',
    'FAIL',
    'REPORT_GENERATED'
FROM workflow_definitions WHERE code = 'EVALUATION_CYCLE';

INSERT INTO workflow_step_definitions (
    id, workflow_definition_id, step_order, code, name, actor, action,
    wait_for, timeout, on_timeout, next_status
)
SELECT
    'wsd-eval-step2-' || hex(randomblob(4)),
    id,
    2,
    'MANAGER_EVALUATION',
    '上司評価',
    'MANAGER',
    'submitManagerEvaluation',
    'manager-evaluation-submitted',
    '14 days',
    'ESCALATE',
    'MANAGER_EVALUATED'
FROM workflow_definitions WHERE code = 'EVALUATION_CYCLE';

INSERT INTO workflow_step_definitions (
    id, workflow_definition_id, step_order, code, name, actor, action,
    wait_for, timeout, on_timeout, next_status
)
SELECT
    'wsd-eval-step3-' || hex(randomblob(4)),
    id,
    3,
    'MANAGER_APPROVAL',
    '上司承認',
    'MANAGER',
    'approveAsManager',
    'manager-approved',
    '7 days',
    'ESCALATE',
    'MANAGER_APPROVED'
FROM workflow_definitions WHERE code = 'EVALUATION_CYCLE';

INSERT INTO workflow_step_definitions (
    id, workflow_definition_id, step_order, code, name, actor, action,
    wait_for, timeout, on_timeout, next_status
)
SELECT
    'wsd-eval-step4-' || hex(randomblob(4)),
    id,
    4,
    'HR_APPROVAL',
    'HR承認',
    'HR',
    'approveAsHR',
    'hr-approved',
    '14 days',
    'ESCALATE',
    'HR_APPROVED'
FROM workflow_definitions WHERE code = 'EVALUATION_CYCLE';

INSERT INTO workflow_step_definitions (
    id, workflow_definition_id, step_order, code, name, actor, action,
    wait_for, timeout, on_timeout, next_status
)
SELECT
    'wsd-eval-step5-' || hex(randomblob(4)),
    id,
    5,
    'FINALIZATION',
    '確定処理',
    'SYSTEM',
    'finalizeEvaluation',
    NULL,
    '1 hour',
    'FAIL',
    'FINALIZED'
FROM workflow_definitions WHERE code = 'EVALUATION_CYCLE';

-- ============================================
-- マネージャー評価テーブルの更新
-- (Update Manager Evaluation - add adjusted scores)
-- ============================================

-- Add columns for score adjustments (if not exist)
-- Manager can adjust the auto-calculated scores
ALTER TABLE manager_evaluations ADD COLUMN skill_score_adjusted REAL;
ALTER TABLE manager_evaluations ADD COLUMN competency_score_adjusted REAL;
ALTER TABLE manager_evaluations ADD COLUMN behavior_score_adjusted REAL;
ALTER TABLE manager_evaluations ADD COLUMN total_score_adjusted REAL;
ALTER TABLE manager_evaluations ADD COLUMN adjustment_reason TEXT;

-- ============================================
-- 初期データ: ワークフロー定義更新
-- (Update workflow definition trigger)
-- ============================================

UPDATE workflow_definitions
SET trigger_event = 'period-activated',
    description = '評価期間開始時にレポートを自動生成し、上司評価→承認→確定の流れで処理'
WHERE code = 'EVALUATION_CYCLE';
