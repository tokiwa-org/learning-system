-- D1 Database Migration: Workflow Instance Management
-- Generated from Neo4j Ontology
-- Version: 2.0
-- Date: 2026-01-24

-- ============================================
-- ワークフロー管理ドメイン
-- (Workflow Management Domain)
-- ============================================

-- ワークフロー定義 (Workflow Definition)
-- ワークフロータイプの定義
CREATE TABLE IF NOT EXISTS workflow_definitions (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    trigger_event TEXT NOT NULL,                  -- トリガーイベント
    default_timeout TEXT DEFAULT '30 days',       -- デフォルトタイムアウト
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_workflow_definitions_code ON workflow_definitions(code);

-- ワークフローステップ定義 (Workflow Step Definition)
-- 各ワークフローのステップ定義
CREATE TABLE IF NOT EXISTS workflow_step_definitions (
    id TEXT PRIMARY KEY,
    workflow_definition_id TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    actor TEXT NOT NULL,                          -- 'SELF', 'PEER', 'MANAGER', 'HR', 'SYSTEM'
    action TEXT NOT NULL,                         -- 実行アクション
    wait_for TEXT,                                -- 待機イベント
    timeout TEXT DEFAULT '7 days',
    on_timeout TEXT,                              -- タイムアウト時の処理
    next_status TEXT,                             -- 完了後のステータス
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (workflow_definition_id) REFERENCES workflow_definitions(id),
    UNIQUE(workflow_definition_id, step_order)
);

CREATE INDEX idx_workflow_step_definitions_workflow ON workflow_step_definitions(workflow_definition_id);

-- ワークフローインスタンス (Workflow Instance)
-- 実行中のワークフローインスタンス
CREATE TABLE IF NOT EXISTS workflow_instances (
    id TEXT PRIMARY KEY,
    workflow_definition_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,                    -- 'EVALUATION_CYCLE', 'CURRICULUM', etc.
    entity_id TEXT NOT NULL,                      -- 対象エンティティID
    cf_workflow_instance_id TEXT,                 -- Cloudflare Workflows インスタンスID
    status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'RUNNING', 'WAITING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT')),
    current_step_order INTEGER DEFAULT 0,
    current_status_code TEXT,                     -- 現在のステータスコード
    started_at TEXT,
    completed_at TEXT,
    error_message TEXT,
    metadata TEXT,                                -- JSON: 追加メタデータ
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (workflow_definition_id) REFERENCES workflow_definitions(id),
    UNIQUE(entity_type, entity_id)
);

CREATE INDEX idx_workflow_instances_definition ON workflow_instances(workflow_definition_id);
CREATE INDEX idx_workflow_instances_entity ON workflow_instances(entity_type, entity_id);
CREATE INDEX idx_workflow_instances_status ON workflow_instances(status);
CREATE INDEX idx_workflow_instances_cf_id ON workflow_instances(cf_workflow_instance_id);

-- ワークフローステップ実行履歴 (Workflow Step History)
-- 各ステップの実行履歴
CREATE TABLE IF NOT EXISTS workflow_step_histories (
    id TEXT PRIMARY KEY,
    workflow_instance_id TEXT NOT NULL,
    step_definition_id TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'RUNNING', 'WAITING', 'COMPLETED', 'SKIPPED', 'FAILED', 'TIMEOUT')),
    actor_id TEXT,                                -- 実行者ID（該当する場合）
    input_data TEXT,                              -- JSON: 入力データ
    output_data TEXT,                             -- JSON: 出力データ
    error_message TEXT,
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id) ON DELETE CASCADE,
    FOREIGN KEY (step_definition_id) REFERENCES workflow_step_definitions(id),
    FOREIGN KEY (actor_id) REFERENCES employees(id)
);

CREATE INDEX idx_workflow_step_histories_instance ON workflow_step_histories(workflow_instance_id);
CREATE INDEX idx_workflow_step_histories_step ON workflow_step_histories(step_definition_id);
CREATE INDEX idx_workflow_step_histories_status ON workflow_step_histories(status);

-- ワークフローイベント (Workflow Event)
-- ワークフローに送信されたイベントログ
CREATE TABLE IF NOT EXISTS workflow_events (
    id TEXT PRIMARY KEY,
    workflow_instance_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data TEXT,                              -- JSON: イベントデータ
    source TEXT NOT NULL,                         -- 'API', 'SYSTEM', 'CRON', 'USER'
    source_id TEXT,                               -- ソースの識別子（API: endpoint, USER: employee_id）
    processed INTEGER NOT NULL DEFAULT 0,
    processed_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id) ON DELETE CASCADE
);

CREATE INDEX idx_workflow_events_instance ON workflow_events(workflow_instance_id);
CREATE INDEX idx_workflow_events_type ON workflow_events(event_type);
CREATE INDEX idx_workflow_events_processed ON workflow_events(processed);
CREATE INDEX idx_workflow_events_created ON workflow_events(created_at);

-- 評価者アサイン (Workflow Assignment)
-- ワークフローの各ステップに対する担当者アサイン
CREATE TABLE IF NOT EXISTS workflow_assignments (
    id TEXT PRIMARY KEY,
    workflow_instance_id TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    assignment_type TEXT NOT NULL
        CHECK (assignment_type IN ('SELF', 'PEER', 'MANAGER', 'HR', 'REVIEWER')),
    assignee_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'REASSIGNED')),
    due_date TEXT,
    reminded_at TEXT,                             -- 最終リマインド日時
    reminder_count INTEGER DEFAULT 0,
    started_at TEXT,
    completed_at TEXT,
    reassigned_from TEXT,                         -- 再アサイン元
    reassigned_reason TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES employees(id),
    FOREIGN KEY (reassigned_from) REFERENCES employees(id)
);

CREATE INDEX idx_workflow_assignments_instance ON workflow_assignments(workflow_instance_id);
CREATE INDEX idx_workflow_assignments_assignee ON workflow_assignments(assignee_id);
CREATE INDEX idx_workflow_assignments_status ON workflow_assignments(status);
CREATE INDEX idx_workflow_assignments_due ON workflow_assignments(due_date);

-- ワークフローリマインダー設定 (Workflow Reminder Config)
-- リマインダー送信設定
CREATE TABLE IF NOT EXISTS workflow_reminder_configs (
    id TEXT PRIMARY KEY,
    workflow_definition_id TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    days_before_due INTEGER NOT NULL,             -- 期限の何日前
    notification_type TEXT NOT NULL,              -- 通知タイプ
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (workflow_definition_id) REFERENCES workflow_definitions(id),
    UNIQUE(workflow_definition_id, step_order, days_before_due)
);

CREATE INDEX idx_workflow_reminder_configs_workflow ON workflow_reminder_configs(workflow_definition_id);

-- ============================================
-- 初期データ挿入
-- ============================================

-- 評価ワークフロー定義
INSERT INTO workflow_definitions (id, code, name, description, trigger_event, default_timeout) VALUES
    ('wf_evaluation', 'EVALUATION_CYCLE', '評価サイクルワークフロー', '人事考課の評価サイクル全体を管理', 'EVALUATION_PERIOD_STARTED', '90 days'),
    ('wf_curriculum', 'CURRICULUM_CREATION', 'カリキュラム作成ワークフロー', 'シナリオからカリキュラム生成・査閲・配信', 'SCENARIO_CREATED', '30 days'),
    ('wf_promotion', 'PROMOTION_EXAM', '昇格試験ワークフロー', '昇格試験の申請・評価・承認', 'PROMOTION_REQUESTED', '60 days');

-- 評価ワークフローステップ定義
INSERT INTO workflow_step_definitions (id, workflow_definition_id, step_order, code, name, actor, action, wait_for, timeout, on_timeout, next_status) VALUES
    ('step_eval_1', 'wf_evaluation', 1, 'SELF_EVALUATION', '自己評価', 'SELF', 'SUBMIT_SELF_EVALUATION', 'self-evaluation-submitted', '30 days', 'NOTIFY_DEADLINE_EXCEEDED', 'SELF_SUBMITTED'),
    ('step_eval_2', 'wf_evaluation', 2, 'PEER_EVALUATION', '同僚評価', 'PEER', 'SUBMIT_PEER_EVALUATION', 'peer-evaluations-completed', '14 days', 'NOTIFY_AND_PROCEED', 'PEER_COMPLETED'),
    ('step_eval_3', 'wf_evaluation', 3, 'MANAGER_EVALUATION', '上司評価', 'MANAGER', 'SUBMIT_MANAGER_EVALUATION', 'manager-evaluation-submitted', '14 days', 'NOTIFY_ESCALATE', 'MANAGER_SUBMITTED'),
    ('step_eval_4', 'wf_evaluation', 4, 'MANAGER_APPROVAL', '上司承認', 'MANAGER', 'APPROVE_OR_REJECT', 'manager-approval-decision', '7 days', 'NOTIFY_ESCALATE', 'MANAGER_APPROVED'),
    ('step_eval_5', 'wf_evaluation', 5, 'HR_APPROVAL', 'HR承認', 'HR', 'APPROVE_OR_REJECT', 'hr-approval-decision', '14 days', 'NOTIFY_ADMIN', 'HR_APPROVED'),
    ('step_eval_6', 'wf_evaluation', 6, 'FINALIZE', '確定処理', 'SYSTEM', 'FINALIZE_EVALUATION', NULL, NULL, NULL, 'FINALIZED');

-- カリキュラム作成ワークフローステップ定義
INSERT INTO workflow_step_definitions (id, workflow_definition_id, step_order, code, name, actor, action, wait_for, timeout, on_timeout, next_status) VALUES
    ('step_cur_1', 'wf_curriculum', 1, 'GENERATE', 'カリキュラム生成', 'SYSTEM', 'GENERATE_CURRICULUM', 'curriculum-generated', '1 hour', 'NOTIFY_ERROR', 'GENERATED'),
    ('step_cur_2', 'wf_curriculum', 2, 'REVIEW', '有識者査閲', 'REVIEWER', 'REVIEW_CURRICULUM', 'review-completed', '7 days', 'NOTIFY_REVIEWER', 'REVIEWED'),
    ('step_cur_3', 'wf_curriculum', 3, 'PUBLISH', '配信', 'SYSTEM', 'PUBLISH_CURRICULUM', NULL, NULL, NULL, 'PUBLISHED');

-- リマインダー設定
INSERT INTO workflow_reminder_configs (id, workflow_definition_id, step_order, days_before_due, notification_type) VALUES
    ('rem_eval_1_3', 'wf_evaluation', 1, 3, 'DEADLINE_REMINDER'),
    ('rem_eval_1_1', 'wf_evaluation', 1, 1, 'DEADLINE_REMINDER'),
    ('rem_eval_2_3', 'wf_evaluation', 2, 3, 'DEADLINE_REMINDER'),
    ('rem_eval_3_3', 'wf_evaluation', 3, 3, 'DEADLINE_REMINDER'),
    ('rem_eval_4_3', 'wf_evaluation', 4, 3, 'DEADLINE_REMINDER');
