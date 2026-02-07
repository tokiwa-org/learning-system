# L1 月4: SQLインジェクション攻撃を阻止しよう

## 概要

| 項目 | 内容 |
|-----|------|
| 対象 | L1（新人→一人前） |
| 総時間 | 20時間 |
| スキル | セキュアコーディング, 認証・認可, DevSecOps |
| 前提 | L0修了（基本プログラミング TS/Python, SQL基礎） |

---

## ステップ構成

### Step 1: 攻撃の仕組みを理解しよう（3時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 1-1 | セキュリティの重要性 | LESSON | 15分 | [step1_1_intro.md](./step1_1_intro.md) |
| 1-2 | OWASP Top 10を知ろう | LESSON | 30分 | [step1_2_owasp.md](./step1_2_owasp.md) |
| 1-3 | SQLインジェクションの仕組み | LESSON | 30分 | [step1_3_sqli.md](./step1_3_sqli.md) |
| 1-4 | XSS攻撃を理解しよう | LESSON | 25分 | [step1_4_xss.md](./step1_4_xss.md) |
| 1-5 | CSRFとその他の攻撃手法 | LESSON | 25分 | [step1_5_csrf.md](./step1_5_csrf.md) |
| 1-6 | 理解度チェック | QUIZ | 15分 | [step1_6_quiz.md](./step1_6_quiz.md) |

### Step 2: 脆弱なコードを特定しよう（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 2-1 | 脆弱なコードパターン | LESSON | 30分 | [step2_1_vulnerable.md](./step2_1_vulnerable.md) |
| 2-2 | セキュリティ視点のコードレビュー | LESSON | 30分 | [step2_2_code_review.md](./step2_2_code_review.md) |
| 2-3 | 脆弱性スキャンツール | LESSON | 30分 | [step2_3_tools.md](./step2_3_tools.md) |
| 2-4 | ログ分析で攻撃を検知しよう | LESSON | 30分 | [step2_4_log.md](./step2_4_log.md) |
| 2-5 | 演習：脆弱なコードを見つけて報告しよう | EXERCISE | 90分 | [step2_5_exercise.md](./step2_5_exercise.md) |
| 2-6 | チェックポイント | QUIZ | 30分 | [step2_6_quiz.md](./step2_6_quiz.md) |

### Step 3: セキュアな実装を学ぼう（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 3-1 | パラメータ化クエリで防御しよう | LESSON | 30分 | [step3_1_parameterized.md](./step3_1_parameterized.md) |
| 3-2 | 入力値のサニタイズとバリデーション | LESSON | 30分 | [step3_2_sanitize.md](./step3_2_sanitize.md) |
| 3-3 | 出力エスケープでXSSを防ごう | LESSON | 30分 | [step3_3_escape.md](./step3_3_escape.md) |
| 3-4 | セキュリティヘッダーを設定しよう | LESSON | 30分 | [step3_4_headers.md](./step3_4_headers.md) |
| 3-5 | 演習：脆弱なコードを修正しよう | EXERCISE | 90分 | [step3_5_exercise.md](./step3_5_exercise.md) |
| 3-6 | チェックポイント | QUIZ | 30分 | [step3_6_quiz.md](./step3_6_quiz.md) |

### Step 4: OAuth/JWTを実装しよう（5時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 4-1 | 認証と認可の違い | LESSON | 30分 | [step4_1_auth_basic.md](./step4_1_auth_basic.md) |
| 4-2 | パスワードの安全な管理 | LESSON | 30分 | [step4_2_password.md](./step4_2_password.md) |
| 4-3 | JWTの仕組みを理解しよう | LESSON | 30分 | [step4_3_jwt.md](./step4_3_jwt.md) |
| 4-4 | OAuth 2.0フローを理解しよう | LESSON | 30分 | [step4_4_oauth.md](./step4_4_oauth.md) |
| 4-5 | 演習：認証システムを実装しよう | EXERCISE | 120分 | [step4_5_exercise.md](./step4_5_exercise.md) |
| 4-6 | チェックポイント | QUIZ | 30分 | [step4_6_quiz.md](./step4_6_quiz.md) |

### Step 5: セキュリティツールを導入しよう（3時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 5-1 | SAST（静的解析）ツールを使おう | LESSON | 25分 | [step5_1_sast.md](./step5_1_sast.md) |
| 5-2 | DAST（動的解析）の基本 | LESSON | 25分 | [step5_2_dast.md](./step5_2_dast.md) |
| 5-3 | 依存パッケージの脆弱性管理 | LESSON | 25分 | [step5_3_dependency.md](./step5_3_dependency.md) |
| 5-4 | CI/CDにセキュリティチェックを組み込もう | LESSON | 25分 | [step5_4_ci.md](./step5_4_ci.md) |
| 5-5 | 演習：セキュリティパイプラインを構築しよう | EXERCISE | 30分 | [step5_5_exercise.md](./step5_5_exercise.md) |
| 5-6 | チェックポイント | QUIZ | 15分 | [step5_6_quiz.md](./step5_6_quiz.md) |

### Step 6: 知識を確認しよう（1時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 6-1 | 総合演習：セキュリティ監査レポート | EXERCISE | 30分 | [step6_1_final_exercise.md](./step6_1_final_exercise.md) |
| 6-2 | 卒業クイズ | QUIZ | 30分 | [step6_2_final_quiz.md](./step6_2_final_quiz.md) |

---

## 学習の流れ

```
Step 1 (3h)          Step 2 (4h)            Step 3 (4h)
[OWASP/攻撃手法] → [脆弱性の特定]     → [セキュアな実装]
      ↓                  ↓                     ↓
Step 4 (5h)          Step 5 (3h)            Step 6 (1h)
[OAuth/JWT]     →   [DevSecOps]        →  [最終試験]
```

---

## 前提知識からの成長マップ

| スキル | これまでに学んだこと | 今月学ぶこと |
|--------|---------------------|-------------|
| SQL | 基本クエリ、JOIN、サブクエリ | SQLインジェクション攻撃と防御 |
| Web | HTML/CSS、HTTPの基礎 | XSS、CSRF、セキュリティヘッダー |
| プログラミング | TypeScript/Python基礎 | セキュアコーディング、入力検証 |
| 認証 | なし | JWT、OAuth 2.0、パスワード管理 |
| ツール | Git、npm | SAST/DAST、脆弱性スキャン |

---

## 達成目標

このミッション完了後にできること：

- OWASP Top 10の主要な脆弱性を説明できる
- SQLインジェクション、XSS、CSRFの仕組みを理解し、防御できる
- パラメータ化クエリ、入力バリデーション、出力エスケープを実装できる
- JWTベースの認証フローを設計・実装できる
- OAuth 2.0の認可コードフローを理解している
- SAST/DASTツールをCI/CDパイプラインに組み込める
- セキュリティ監査レポートを作成できる
