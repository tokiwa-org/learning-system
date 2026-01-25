-- D1 Database Migration: Curriculum Noise Level
-- Version: 6.0
-- Date: 2026-01-25
-- Purpose: Move noise_level from ontology (RoadmapItem) to Curriculum level
--
-- Design Decision:
--   Previously, noiseLevel was attached to RoadmapItem (skill) in Neo4j ontology.
--   However, noise level should vary based on LEARNER LEVEL, not the skill itself.
--   The same skill (e.g., "Database") should have different noise when taught to:
--     - L1 learners: MINIMAL noise (clean examples, correct patterns)
--     - L3 learners: MEDIUM noise (debugging, refactoring exercises)
--     - L5 learners: HIGH noise (ambiguous requirements, no clear answers)
--
-- Reference: docs/99_参考資料/09_教育的ノイズ.md
--            docs/99_参考資料/10_改善提案.md

-- ============================================
-- ノイズレベルの追加
-- (Add Noise Level to Curriculum)
-- ============================================

-- ノイズ濃度 (MINIMAL, LOW, MEDIUM, HIGH, MAXIMUM)
-- Based on target grade transition:
--   L1→L2: LOW (10%)
--   L2→L3: MEDIUM (30%)
--   L3→L4: HIGH (50%)
--   L4→L5: MAXIMUM (70%)
ALTER TABLE curriculums ADD COLUMN noise_level TEXT DEFAULT 'MINIMAL'
    CHECK (noise_level IN ('MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'MAXIMUM'));

-- 推奨ノイズタイプの説明
-- (noiseTypes column already exists for specifying which types of noise to include)
-- Reference: noiseTypes array can include:
--   - 'information_incomplete': 情報の不完全性 (L1→L2)
--   - 'technical_debt': 技術的負債 (L2→L3)
--   - 'excessive_choices': 選択肢の過剰 (L3→L4)
--   - 'context_fluctuation': コンテキストの揺らぎ (L4→L5)
--   - 'search_pollution': 検索環境の汚染 (all levels)

-- ============================================
-- ノイズ設計メモ用カラム
-- (Noise Design Notes for Reviewers)
-- ============================================

-- 査閲者向けノイズ設計説明
ALTER TABLE curriculums ADD COLUMN noise_design_notes TEXT;

-- ============================================
-- コメント: Neo4jのnoiseLevel非推奨化について
-- ============================================
--
-- Neo4j ontologyのRoadmapItem.noiseLevelは参照用として残すが、
-- 実際のカリキュラム生成時はCurriculum.noise_levelを使用する。
--
-- RoadmapItem.noiseLevel (Neo4j):
--   - 基礎的なスキル → MINIMAL (例: OS, ネットワーク基礎)
--   - 中級スキル → MEDIUM (例: Docker, Kubernetes)
--   - 高度なスキル → HIGH (例: アーキテクチャ設計)
--
-- これは「スキルの複雑性」を示す参考情報として残すが、
-- 教育的ノイズの設計はCurriculum.noise_levelで行う。
--
-- 例: 「データベース基礎」(RoadmapItem.noiseLevel = MINIMAL)
--     L1向けカリキュラム: Curriculum.noise_level = 'MINIMAL'
--     L3向けカリキュラム: Curriculum.noise_level = 'MEDIUM'
--     L5向けカリキュラム: Curriculum.noise_level = 'HIGH'

-- ============================================
-- インデックス作成
-- (Create Indexes)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_curriculums_noise_level ON curriculums(noise_level);

