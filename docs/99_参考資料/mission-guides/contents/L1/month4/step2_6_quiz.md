# チェックポイント：脆弱なコードを特定しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 2
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "セキュアコーディング"
  category: "セキュリティ"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 2で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. 以下のコードの最も深刻な脆弱性はどれですか？

```typescript
const query = `SELECT * FROM products WHERE category = '${req.query.cat}'`;
const result = await db.query(query);
res.json(result.rows);
```

- A) XSS
- B) SQLインジェクション
- C) CSRF
- D) ディレクトリトラバーサル

<details>
<summary>答えを見る</summary>

**正解: B**

`req.query.cat` がテンプレートリテラルで直接SQL文に埋め込まれています。
攻撃者が `cat` パラメータに `' UNION SELECT * FROM users --` などを入力すると、
データベースの他のテーブルからデータを窃取できます。

対策: `db.query('SELECT * FROM products WHERE category = $1', [req.query.cat])` のようにパラメータ化クエリを使用する。

</details>

---

### Q2. シークレット管理として最も適切なものはどれですか？

- A) ソースコードにコメントとして記載する
- B) 設定ファイルに書いてGitにコミットする
- C) 環境変数で管理し、.envファイルは.gitignoreに含める
- D) READMEに記載してチームで共有する

<details>
<summary>答えを見る</summary>

**正解: C**

シークレット（APIキー、パスワード、トークンなど）は環境変数で管理し、
`.env` ファイルは `.gitignore` に追加してリポジトリにコミットしないようにします。

本番環境では、AWS Secrets Manager、HashiCorp Vault、
GitHub Secretsなどのシークレット管理サービスを使用することが推奨されます。

</details>

---

### Q3. eval() の使用が危険な理由はどれですか？

- A) 実行速度が遅くなるから
- B) メモリを大量に消費するから
- C) ユーザー入力が任意のコードとして実行される可能性があるから
- D) 非同期処理と互換性がないから

<details>
<summary>答えを見る</summary>

**正解: C**

`eval()` はパラメータとして渡された文字列をコードとして実行します。
ユーザー入力がそのまま渡された場合、攻撃者はサーバー上で任意のコードを実行できます。

例: `eval("require('child_process').execSync('cat /etc/passwd')")`

安全な代替手段として、数式の評価には `mathjs` などの専用ライブラリを使用します。

</details>

---

### Q4. セキュリティレビューで最も重点的にチェックすべき箇所はどれですか？

- A) CSS のスタイル定義
- B) コメントの書き方
- C) 外部システムとの境界（DB、API、ファイルシステム）
- D) 変数名の命名規則

<details>
<summary>答えを見る</summary>

**正解: C**

脆弱性はデータが信頼境界を越える場所で発生しやすいです。
データベースクエリ、外部APIへのリクエスト、ファイルシステムへのアクセスなど、
外部システムとの接点を重点的にチェックすることで、効率的に脆弱性を発見できます。

データの流れ（入力 → 処理 → 出力）に沿って、各境界でのバリデーションとエスケープを確認します。

</details>

---

### Q5. npm audit の目的として正しいものはどれですか？

- A) コードのフォーマットを検証する
- B) 使用しているパッケージの既知の脆弱性をチェックする
- C) TypeScriptの型エラーを検出する
- D) テストカバレッジを計測する

<details>
<summary>答えを見る</summary>

**正解: B**

`npm audit` は、プロジェクトの依存パッケージ（`node_modules`）に
既知のセキュリティ脆弱性（CVE）がないかチェックするコマンドです。

脆弱性が見つかった場合、`npm audit fix` で自動修正を試みることができます。
CI/CDパイプラインに組み込んで定期的にチェックすることが推奨されます。

</details>

---

### Q6. アクセスログで以下のパターンを発見した場合、最も疑うべき攻撃はどれですか？

```
10.0.0.50 "POST /api/login HTTP/1.1" 401
10.0.0.50 "POST /api/login HTTP/1.1" 401
10.0.0.50 "POST /api/login HTTP/1.1" 401
...（同じパターンが200回以上続く）
10.0.0.50 "POST /api/login HTTP/1.1" 200
```

- A) SQLインジェクション
- B) XSS
- C) ブルートフォース攻撃
- D) ディレクトリトラバーサル

<details>
<summary>答えを見る</summary>

**正解: C**

同一IPから同一エンドポイント（ログイン）への大量のリクエストで、
ほとんどが401（認証失敗）で最終的に200（成功）になるパターンは、
ブルートフォース攻撃（パスワード総当り攻撃）の典型的な兆候です。

対策: レート制限（express-rate-limit）、アカウントロックアウト、
CAPTCHA、多要素認証の導入。

</details>

---

### Q7. エラーレスポンスとして最も安全なものはどれですか？

- A) `{ error: error.message, stack: error.stack }`
- B) `{ error: "Internal server error" }`
- C) `{ error: error.message, query: error.query }`
- D) `{ error: "Database error: table 'users' not found" }`

<details>
<summary>答えを見る</summary>

**正解: B**

クライアントに返すエラーメッセージは汎用的なものに留め、
内部の詳細情報（スタックトレース、SQLクエリ、テーブル名など）を含めてはいけません。

詳細な情報はサーバーのログに記録し、開発者だけがアクセスできるようにします。
攻撃者はエラーメッセージからシステムの構造を推測し、より精度の高い攻撃を行います。

</details>

---

### Q8. SASTとDASTの違いとして正しいものはどれですか？

- A) SASTは実行中のアプリをテストし、DASTはソースコードを分析する
- B) SASTはソースコードを分析し、DASTは実行中のアプリをテストする
- C) SASTは依存パッケージをチェックし、DASTはコード品質を検査する
- D) SASTもDASTもソースコードを分析するツールである

<details>
<summary>答えを見る</summary>

**正解: B**

- **SAST（Static Application Security Testing）**: ソースコードを静的に分析して脆弱性を検出。開発中やPR作成時に実行。例: SonarQube, ESLint security plugins
- **DAST（Dynamic Application Security Testing）**: 実行中のアプリケーションに対してテストを実行し、外部から脆弱性を検出。テスト環境で実行。例: OWASP ZAP, Burp Suite

両方を組み合わせることで、より広範な脆弱性をカバーできます。

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 2「脆弱なコードを特定しよう」を完了しました。
次は Step 3「セキュアな実装を学ぼう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q3 | step2_1 脆弱なコードパターン |
| Q4, Q7 | step2_2 セキュリティ視点のコードレビュー |
| Q5, Q8 | step2_3 脆弱性スキャンツール |
| Q2, Q6 | step2_4 ログ分析で攻撃を検知しよう |

---

## Step 2 完了

お疲れさまでした。

### 学んだこと

- 6つの脆弱なコードパターン（SQLi、XSS、ハードコード、eval、エラー、バリデーション）
- セキュリティ視点のコードレビュー手法とチェックリスト
- SAST、DAST、SCAの違いと代表的ツール
- ログ分析による攻撃検知の方法

### 次のステップ

**Step 3: セキュアな実装を学ぼう（4時間）**

脆弱性を見つける力を身につけた今、次はそれを修正し、最初からセキュアなコードを書く方法を学びます。

---

*推定所要時間: 30分*
