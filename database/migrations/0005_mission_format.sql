-- D1 Database Migration: Mission Format for Curricula
-- Version: 5.0
-- Date: 2026-01-25
-- Purpose: Transform curricula into AWS Quest-style mission format
--          - Add mission narrative fields to curricula
--          - Add step context fields to curriculum items

-- ============================================
-- ミッション形式拡張
-- (Mission Format Extension)
-- ============================================

-- カリキュラムテーブルにミッション関連カラムを追加
-- (Add mission-related columns to curriculums table)

-- ミッションタイトル (例: "SQLインジェクション攻撃を阻止せよ")
ALTER TABLE curriculums ADD COLUMN mission_title TEXT;

-- ミッション概要 (短い説明)
ALTER TABLE curriculums ADD COLUMN mission_summary TEXT;

-- 背景ストーリー (状況設定)
-- 例: "あなたは中堅エンジニアとして、本番システムのセキュリティ強化プロジェクトにアサインされました..."
ALTER TABLE curriculums ADD COLUMN background_story TEXT;

-- ミッション目標 (達成すべきこと)
-- 例: "SQLインジェクションの仕組みを理解し、脆弱なコードを特定・修正できるようになる"
ALTER TABLE curriculums ADD COLUMN mission_objective TEXT;

-- 表示形式 (STANDARD: 従来形式, MISSION: ミッション形式)
ALTER TABLE curriculums ADD COLUMN display_format TEXT DEFAULT 'STANDARD'
    CHECK (display_format IN ('STANDARD', 'MISSION'));

-- カリキュラムアイテムテーブルにステップ関連カラムを追加
-- (Add step-related columns to curriculum_items table)

-- ステップタイトル (例: "攻撃の仕組みを理解せよ")
ALTER TABLE curriculum_items ADD COLUMN step_title TEXT;

-- ステップコンテキスト (ミッション内での文脈)
-- 例: "まず、敵を知ることから始めましょう。SQLインジェクション攻撃がどのように行われるか学びます。"
ALTER TABLE curriculum_items ADD COLUMN step_context TEXT;

-- ============================================
-- インデックス作成
-- (Create Indexes)
-- ============================================

-- 表示形式でのフィルタリング用
CREATE INDEX IF NOT EXISTS idx_curriculums_display_format ON curriculums(display_format);

-- ============================================
-- サンプルデータ: セキュリティ基礎カリキュラムのミッション化
-- (Sample Data: Transform Security Basics Curriculum to Mission Format)
-- ============================================

-- Note: This is a template. Actual data updates should be done via API or separate seed script.
-- Example update for existing curriculum:
--
-- UPDATE curriculums
-- SET mission_title = 'SQLインジェクション攻撃を阻止せよ',
--     mission_summary = '本番システムへの不審なアクセスを調査し、セキュリティ脆弱性を修正する',
--     background_story = 'あなたは中堅エンジニアとして、本番システムのセキュリティ強化プロジェクトにアサインされました。突然、セキュリティチームから緊急連絡が入りました。「不審なアクセスログを検出。SQLインジェクション攻撃の可能性がある。至急対応してほしい」',
--     mission_objective = 'SQLインジェクションの仕組みを理解し、脆弱なコードを特定・修正できるようになる',
--     display_format = 'MISSION'
-- WHERE name = 'セキュリティ基礎';
--
-- UPDATE curriculum_items
-- SET step_title = '攻撃の仕組みを理解せよ',
--     step_context = 'まず、敵を知ることから始めましょう。SQLインジェクション攻撃がどのように行われるか学びます。'
-- WHERE curriculum_id = (SELECT id FROM curriculums WHERE name = 'セキュリティ基礎')
--   AND item_number = 1;
