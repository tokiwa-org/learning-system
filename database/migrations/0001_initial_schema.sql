-- D1 Database Migration: Initial Schema
-- Generated from Neo4j Ontology
-- Version: 2.0
-- Date: 2026-01-24

-- ============================================
-- 組織ドメイン (ORGANIZATION Domain)
-- ============================================

-- 部署 (Department)
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES departments(id)
);

CREATE INDEX idx_departments_parent ON departments(parent_id);

-- 職級 (Grade)
CREATE TABLE IF NOT EXISTS grades (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    level INTEGER NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_grades_code ON grades(code);
CREATE INDEX idx_grades_level ON grades(level);

-- 社員 (Employee)
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    employee_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    department_id TEXT NOT NULL,
    grade_id TEXT NOT NULL,
    manager_id TEXT,
    current_step INTEGER DEFAULT 1,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'LEAVE')),
    joined_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (grade_id) REFERENCES grades(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE UNIQUE INDEX idx_employees_code ON employees(employee_code);
CREATE UNIQUE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_grade ON employees(grade_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_status ON employees(status);

-- ============================================
-- 評価ドメイン (EVALUATION Domain)
-- ============================================

-- 評価期間 (Evaluation Period)
CREATE TABLE IF NOT EXISTS evaluation_periods (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    evaluation_month INTEGER NOT NULL CHECK (evaluation_month BETWEEN 1 AND 12),
    status TEXT DEFAULT 'PREPARING' CHECK (status IN ('PREPARING', 'ACTIVE', 'CLOSED')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_periods_status ON evaluation_periods(status);
CREATE INDEX idx_periods_dates ON evaluation_periods(start_date, end_date);

-- 評価基準 (Evaluation Criteria)
CREATE TABLE IF NOT EXISTS evaluation_criteria (
    id TEXT PRIMARY KEY,
    period_id TEXT NOT NULL,
    axis_code TEXT NOT NULL CHECK (axis_code IN ('SKILL', 'COMPETENCY', 'BEHAVIOR')),
    axis_name TEXT NOT NULL,
    weight INTEGER NOT NULL CHECK (weight >= 0 AND weight <= 100),
    max_score INTEGER NOT NULL,
    target_roadmap_range TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (period_id) REFERENCES evaluation_periods(id),
    UNIQUE(period_id, axis_code)
);

CREATE INDEX idx_criteria_period ON evaluation_criteria(period_id);

-- 評価サイクル (Evaluation Cycle)
CREATE TABLE IF NOT EXISTS evaluation_cycles (
    id TEXT PRIMARY KEY,
    period_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN (
        'DRAFT', 
        'SELF_SUBMITTED', 
        'PEER_COMPLETED',
        'MANAGER_SUBMITTED',
        'MANAGER_APPROVED',
        'HR_APPROVED',
        'FINALIZED',
        'REJECTED'
    )),
    current_step TEXT DEFAULT 'SELF' CHECK (current_step IN (
        'SELF', 'PEER', 'MANAGER', 'MANAGER_APPROVAL', 'HR_APPROVAL', 'FINAL'
    )),
    final_score INTEGER,
    final_rank TEXT CHECK (final_rank IN ('S', 'A', 'B', 'C', 'D')),
    salary_increment INTEGER,
    finalized_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (period_id) REFERENCES evaluation_periods(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    UNIQUE(period_id, employee_id)
);

CREATE INDEX idx_cycles_period ON evaluation_cycles(period_id);
CREATE INDEX idx_cycles_employee ON evaluation_cycles(employee_id);
CREATE INDEX idx_cycles_status ON evaluation_cycles(status);

-- 自己評価 (Self Evaluation)
CREATE TABLE IF NOT EXISTS self_evaluations (
    id TEXT PRIMARY KEY,
    cycle_id TEXT NOT NULL UNIQUE,
    employee_id TEXT NOT NULL,
    comment TEXT,
    submitted_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE UNIQUE INDEX idx_self_eval_cycle ON self_evaluations(cycle_id);
CREATE INDEX idx_self_eval_employee ON self_evaluations(employee_id);

-- 自己評価明細 (Self Evaluation Detail)
CREATE TABLE IF NOT EXISTS self_evaluation_details (
    id TEXT PRIMARY KEY,
    self_evaluation_id TEXT NOT NULL,
    roadmap_item_id TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    evidence TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (self_evaluation_id) REFERENCES self_evaluations(id),
    FOREIGN KEY (roadmap_item_id) REFERENCES roadmap_items(id),
    UNIQUE(self_evaluation_id, roadmap_item_id)
);

CREATE INDEX idx_self_detail_eval ON self_evaluation_details(self_evaluation_id);

-- 同僚評価 (Peer Evaluation)
CREATE TABLE IF NOT EXISTS peer_evaluations (
    id TEXT PRIMARY KEY,
    cycle_id TEXT NOT NULL,
    evaluator_id TEXT NOT NULL,
    target_employee_id TEXT NOT NULL,
    strengths TEXT,
    improvements TEXT,
    submitted_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
    FOREIGN KEY (evaluator_id) REFERENCES employees(id),
    FOREIGN KEY (target_employee_id) REFERENCES employees(id),
    UNIQUE(cycle_id, evaluator_id)
);

CREATE INDEX idx_peer_cycle ON peer_evaluations(cycle_id);
CREATE INDEX idx_peer_evaluator ON peer_evaluations(evaluator_id);
CREATE INDEX idx_peer_target ON peer_evaluations(target_employee_id);

-- 同僚評価明細 (Peer Evaluation Detail)
CREATE TABLE IF NOT EXISTS peer_evaluation_details (
    id TEXT PRIMARY KEY,
    peer_evaluation_id TEXT NOT NULL,
    roadmap_item_id TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (peer_evaluation_id) REFERENCES peer_evaluations(id),
    FOREIGN KEY (roadmap_item_id) REFERENCES roadmap_items(id),
    UNIQUE(peer_evaluation_id, roadmap_item_id)
);

CREATE INDEX idx_peer_detail_eval ON peer_evaluation_details(peer_evaluation_id);

-- 上司評価 (Manager Evaluation)
CREATE TABLE IF NOT EXISTS manager_evaluations (
    id TEXT PRIMARY KEY,
    cycle_id TEXT NOT NULL UNIQUE,
    manager_id TEXT NOT NULL,
    target_employee_id TEXT NOT NULL,
    skill_score REAL,
    competency_score REAL,
    behavior_score REAL,
    total_score REAL,
    rank_suggestion TEXT CHECK (rank_suggestion IN ('S', 'A', 'B', 'C', 'D')),
    overall_comment TEXT,
    submitted_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    FOREIGN KEY (target_employee_id) REFERENCES employees(id)
);

CREATE UNIQUE INDEX idx_manager_eval_cycle ON manager_evaluations(cycle_id);
CREATE INDEX idx_manager_eval_manager ON manager_evaluations(manager_id);

-- 上司評価明細 (Manager Evaluation Detail)
CREATE TABLE IF NOT EXISTS manager_evaluation_details (
    id TEXT PRIMARY KEY,
    manager_evaluation_id TEXT NOT NULL,
    roadmap_item_id TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (manager_evaluation_id) REFERENCES manager_evaluations(id),
    FOREIGN KEY (roadmap_item_id) REFERENCES roadmap_items(id),
    UNIQUE(manager_evaluation_id, roadmap_item_id)
);

CREATE INDEX idx_manager_detail_eval ON manager_evaluation_details(manager_evaluation_id);

-- 承認履歴 (Approval History)
CREATE TABLE IF NOT EXISTS approval_histories (
    id TEXT PRIMARY KEY,
    cycle_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('SUBMIT', 'APPROVE', 'REJECT', 'FINALIZE')),
    step TEXT NOT NULL,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    comment TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
    FOREIGN KEY (actor_id) REFERENCES employees(id)
);

CREATE INDEX idx_approval_cycle ON approval_histories(cycle_id);
CREATE INDEX idx_approval_actor ON approval_histories(actor_id);
CREATE INDEX idx_approval_created ON approval_histories(created_at);

-- ============================================
-- スキルドメイン (SKILL Domain)
-- ============================================

-- ロードマップレベル (Roadmap Level)
CREATE TABLE IF NOT EXISTS roadmap_levels (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_roadmap_levels_code ON roadmap_levels(code);

-- ロードマップ項目 (Roadmap Item)
CREATE TABLE IF NOT EXISTS roadmap_items (
    id TEXT PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    level_id TEXT NOT NULL,
    axis_code TEXT NOT NULL CHECK (axis_code IN ('SKILL', 'COMPETENCY', 'BEHAVIOR')),
    required_for_grades TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (level_id) REFERENCES roadmap_levels(id)
);

CREATE UNIQUE INDEX idx_roadmap_items_number ON roadmap_items(number);
CREATE INDEX idx_roadmap_items_level ON roadmap_items(level_id);
CREATE INDEX idx_roadmap_items_axis ON roadmap_items(axis_code);
CREATE INDEX idx_roadmap_items_category ON roadmap_items(category);

-- 達成状況 (Achievement Status)
CREATE TABLE IF NOT EXISTS achievement_statuses (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    roadmap_item_id TEXT NOT NULL,
    status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED')),
    evidence TEXT,
    completed_at TEXT,
    verified_by TEXT,
    verified_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (roadmap_item_id) REFERENCES roadmap_items(id),
    FOREIGN KEY (verified_by) REFERENCES employees(id),
    UNIQUE(employee_id, roadmap_item_id)
);

CREATE INDEX idx_achievement_employee ON achievement_statuses(employee_id);
CREATE INDEX idx_achievement_item ON achievement_statuses(roadmap_item_id);
CREATE INDEX idx_achievement_status ON achievement_statuses(status);

-- 期間別ロードマップスナップショット
CREATE TABLE IF NOT EXISTS period_roadmap_snapshots (
    id TEXT PRIMARY KEY,
    period_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    roadmap_item_id TEXT NOT NULL,
    achieved_status TEXT NOT NULL,
    snapshot_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (period_id) REFERENCES evaluation_periods(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (roadmap_item_id) REFERENCES roadmap_items(id),
    UNIQUE(period_id, employee_id, roadmap_item_id)
);

CREATE INDEX idx_snapshot_period ON period_roadmap_snapshots(period_id);
CREATE INDEX idx_snapshot_employee ON period_roadmap_snapshots(employee_id);

-- ============================================
-- 報酬ドメイン (COMPENSATION Domain)
-- ============================================

-- 昇格要件 (Promotion Requirements)
CREATE TABLE IF NOT EXISTS promotion_requirements (
    id TEXT PRIMARY KEY,
    from_grade_id TEXT NOT NULL,
    to_grade_id TEXT NOT NULL,
    min_tenure_months INTEGER NOT NULL,
    min_rank TEXT NOT NULL CHECK (min_rank IN ('S', 'A', 'B', 'C', 'D')),
    min_skill_achievement_rate REAL NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (from_grade_id) REFERENCES grades(id),
    FOREIGN KEY (to_grade_id) REFERENCES grades(id),
    UNIQUE(from_grade_id, to_grade_id)
);

CREATE INDEX idx_promotion_from ON promotion_requirements(from_grade_id);
CREATE INDEX idx_promotion_to ON promotion_requirements(to_grade_id);

-- 職級給テーブル (Grade Salary Table)
CREATE TABLE IF NOT EXISTS grade_salary_tables (
    id TEXT PRIMARY KEY,
    grade_id TEXT NOT NULL,
    step INTEGER NOT NULL,
    base_salary INTEGER NOT NULL,
    effective_from TEXT NOT NULL,
    effective_to TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (grade_id) REFERENCES grades(id),
    UNIQUE(grade_id, step, effective_from)
);

CREATE INDEX idx_grade_salary_grade ON grade_salary_tables(grade_id);
CREATE INDEX idx_grade_salary_effective ON grade_salary_tables(effective_from);

-- 基礎給テーブル (Base Salary Table)
CREATE TABLE IF NOT EXISTS base_salary_tables (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    grade_id TEXT NOT NULL,
    step INTEGER NOT NULL,
    base_salary INTEGER NOT NULL,
    effective_from TEXT NOT NULL,
    effective_to TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (grade_id) REFERENCES grades(id)
);

CREATE INDEX idx_base_salary_employee ON base_salary_tables(employee_id);
CREATE INDEX idx_base_salary_effective ON base_salary_tables(effective_from);

-- ============================================
-- 通知・その他
-- ============================================

-- 通知 (Notifications)
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE INDEX idx_notifications_employee ON notifications(employee_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- 監査ログ (Audit Logs)
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_value TEXT,
    new_value TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================
-- 初期データ挿入
-- ============================================

-- 職級マスタ
INSERT INTO grades (id, code, name, level, description) VALUES
    ('grade_l1', 'L1', 'Entry-level', 1, '新入社員・若手'),
    ('grade_l2', 'L2', 'Mid-level', 2, '中堅社員'),
    ('grade_l3', 'L3', 'Senior', 3, 'シニア'),
    ('grade_l4', 'L4', 'Lead', 4, 'リード・チームリーダー'),
    ('grade_l5', 'L5', 'Manager', 5, 'マネージャー');

-- ロードマップレベル
INSERT INTO roadmap_levels (id, code, name, sort_order) VALUES
    ('level_common', 'COMMON', '共通スキル', 1),
    ('level_technical', 'TECHNICAL', '技術スキル', 2),
    ('level_business', 'BUSINESS', 'ビジネススキル', 3),
    ('level_leadership', 'LEADERSHIP', 'リーダーシップ', 4);

-- 昇格要件マスタ
INSERT INTO promotion_requirements (id, from_grade_id, to_grade_id, min_tenure_months, min_rank, min_skill_achievement_rate) VALUES
    ('promo_l1_l2', 'grade_l1', 'grade_l2', 12, 'B', 0.7),
    ('promo_l2_l3', 'grade_l2', 'grade_l3', 24, 'A', 0.8),
    ('promo_l3_l4', 'grade_l3', 'grade_l4', 36, 'A', 0.85),
    ('promo_l4_l5', 'grade_l4', 'grade_l5', 48, 'S', 0.9);
