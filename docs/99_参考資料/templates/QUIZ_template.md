# QUIZ（クイズコンテンツ）テンプレート

## 概要

QUIZは理解度確認のためのクイズコンテンツです。
学習内容の定着度を測定し、弱点を把握することを目的とします。

---

## メタ情報

```yaml
itemType: QUIZ
estimatedMinutes: 5-10  # 標準は8分
questionCount: 5-10     # 問題数
passingScore: 80        # 合格ライン（%）
```

---

## 必須フィールド

```typescript
interface QuizItem {
  // 基本情報
  id: string;
  itemNumber: number;
  itemType: 'QUIZ';
  title: string;
  stepTitle: string;      // 命令形（例：「知識を確認せよ」）
  stepContext: string;    // クイズの目的説明
  estimatedMinutes: number;

  // コンテンツ
  content: string;        // Markdown形式の問題

  // 評価（オプション）
  passingScore?: number;  // 合格ライン
  maxAttempts?: number;   // 最大試行回数
}
```

---

## 問題タイプ

### タイプA: 単一選択問題

最も基本的な形式。1つの正解を選ぶ。

```markdown
### Q1. [質問文]

A. [選択肢A]
B. [選択肢B]
C. [選択肢C]
D. [選択肢D]

<details>
<summary>解答と解説</summary>

**正解: B**

[なぜBが正解なのかの解説]

**なぜ他の選択肢が不正解か：**
- A: [理由]
- C: [理由]
- D: [理由]

</details>
```

---

### タイプB: コード問題

コードを見せて問題点や改善点を問う。

```markdown
### Q2. 次のコードの問題点は何ですか？

\`\`\`typescript
const search = req.query.search;
const query = \`SELECT * FROM products WHERE name LIKE '%\${search}%'\`;
const result = await db.query(query);
\`\`\`

A. LIKE句の使い方が間違っている
B. ユーザー入力がSQLに直接埋め込まれている
C. awaitの使い方が間違っている
D. 問題はない

<details>
<summary>解答と解説</summary>

**正解: B**

このコードには**SQLインジェクション脆弱性**があります。

`\${search}` でユーザー入力を直接SQL文に埋め込んでいるため、
攻撃者が悪意のある文字列を入力すると、データベースを不正に操作できます。

**安全な実装：**

\`\`\`typescript
const query = 'SELECT * FROM products WHERE name LIKE $1';
const result = await db.query(query, [\`%\${search}%\`]);
\`\`\`

</details>
```

---

### タイプC: True/False問題

ステートメントの正誤を判定する。

```markdown
### Q3. ORMを使用すれば、SQLインジェクションは100%防げる

A. はい（True）
B. いいえ（False）

<details>
<summary>解答と解説</summary>

**正解: B（いいえ）**

ORMを使用しても、以下のケースでSQLインジェクションが発生する可能性があります：

1. **Raw Query の使用**
   \`\`\`typescript
   // ❌ 危険
   await prisma.$queryRawUnsafe(\`SELECT * FROM users WHERE id = \${id}\`);
   \`\`\`

2. **動的なカラム名・テーブル名**
   ORMは値のパラメータ化は行いますが、カラム名やテーブル名は通常パラメータ化されません。

3. **ORM固有の脆弱性**
   ORM自体のバグにより、特定の条件で脆弱性が発生することがあります。

</details>
```

---

### タイプD: 複数選択問題

複数の正解を選ぶ。

```markdown
### Q4. SQLインジェクション対策として有効なものをすべて選んでください（複数選択可）

A. プリペアドステートメントの使用
B. 入力値の長さ制限
C. HTTPSの使用
D. パラメータ化クエリの使用
E. 特殊文字のブラックリスト

<details>
<summary>解答と解説</summary>

**正解: A, D**

- **A. プリペアドステートメント**: ✅ **最も効果的**な対策
- **D. パラメータ化クエリ**: ✅ プリペアドステートメントと同義

**不正解の理由：**
- B. 長さ制限: 防御にはならない（短い攻撃文字列も存在）
- C. HTTPS: 通信の暗号化であり、SQLiとは無関係
- E. ブラックリスト: バイパス可能なため不十分

</details>
```

---

### タイプE: 穴埋め問題

コードや文章の空欄を埋める。

```markdown
### Q5. 以下のコードの空欄を埋めて、安全な実装にしてください

\`\`\`typescript
const query = 'SELECT * FROM users WHERE email = [___1___]';
const result = await db.query(query, [___2___]);
\`\`\`

[___1___]:
A. `'\${email}'`
B. `$1`
C. `?`
D. `email`

[___2___]:
A. `email`
B. `[email]`
C. `{ email }`
D. `'\${email}'`

<details>
<summary>解答と解説</summary>

**正解: [___1___] = B, [___2___] = B**

PostgreSQLでは `$1`, `$2` などの番号付きプレースホルダを使用します。
パラメータは配列として第2引数に渡します。

\`\`\`typescript
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);
\`\`\`

</details>
```

---

### タイプF: 順序問題

正しい順序に並べ替える。

```markdown
### Q6. セキュリティ対策の優先順位として正しい順序に並べてください

1. [ ] 入力値の検証
2. [ ] プリペアドステートメント
3. [ ] 最小権限の設定
4. [ ] エラーメッセージの制御

<details>
<summary>解答と解説</summary>

**正解の順序:**

1. **プリペアドステートメント** — 根本対策（必須）
2. **入力値の検証** — 多層防御
3. **最小権限の設定** — 被害軽減
4. **エラーメッセージの制御** — 情報漏洩防止

プリペアドステートメントが最優先です。
他の対策は補助的なものであり、単独では不十分です。

</details>
```

---

## クイズ全体の構成

```markdown
## 理解度確認クイズ

[導入文：このクイズの目的（1-2文）]

---

### Q1. [単一選択問題]

[問題と選択肢]

---

### Q2. [コード問題]

[問題と選択肢]

---

### Q3. [True/False問題]

[問題と選択肢]

---

### Q4. [複数選択問題]

[問題と選択肢]

---

### Q5. [穴埋め問題]

[問題と選択肢]

---

## 採点基準

| 正解数 | 評価 | 次のアクション |
|--------|------|---------------|
| 5問正解 | 完璧 | 次のステップに進みましょう |
| 4問正解 | 優秀 | 間違えた問題を復習してください |
| 3問正解 | 合格 | 該当セクションを復習してください |
| 2問以下 | 要復習 | 学習コンテンツをもう一度確認してください |
```

---

## 問題設計のガイドライン

### 難易度バランス

| 難易度 | 割合 | 説明 |
|--------|------|------|
| 易 | 20% | 基本的な知識の確認 |
| 中 | 60% | 応用的な理解の確認 |
| 難 | 20% | 深い理解・判断力の確認 |

### 問題タイプのバランス

| タイプ | 割合 | 用途 |
|--------|------|------|
| 単一選択 | 40% | 基本知識 |
| コード問題 | 30% | 実践的理解 |
| True/False | 15% | 誤解の確認 |
| その他 | 15% | 応用力 |

### 選択肢の設計

1. **正解は明確に**: 議論の余地がないこと
2. **誤答は合理的に**: 「ひっかけ」だが理不尽ではない
3. **均等な長さ**: 正解だけ長い/短いを避ける
4. **「すべて正しい」「どれも正しくない」は控えめに**

---

## ノイズレベル別の調整

### MINIMAL（L1向け）

- 問題文は明確・シンプル
- 選択肢は4つ程度
- 正解は1つ
- 解説は詳細に

### LOW（L1→L2）

- やや複雑な問題文
- 「最も適切なもの」形式
- 実務的なシナリオ

### MEDIUM（L2→L3）

- 複数選択問題を含む
- コード問題の比率UP
- トレードオフの判断

### HIGH（L3→L4）

- 「ケースによる」選択肢
- 複数の正解が考えられる
- 理由の記述を求める

### MAXIMUM（L4→L5）

- オープンエンド形式
- 自由記述
- 採点基準が複雑

---

## AI生成プロンプト

```
以下の仕様でQUIZコンテンツを生成してください：

【基本情報】
- タイトル: {title}
- stepTitle: {stepTitle}（命令形）
- stepContext: {context}
- 想定時間: {minutes}分
- ノイズレベル: {noiseLevel}

【問題構成】
- 総問題数: {questionCount}問
- 難易度バランス: 易20% / 中60% / 難20%
- 問題タイプ:
  - 単一選択: {singleChoice}問
  - コード問題: {codeQuestion}問
  - True/False: {trueFalse}問
  - その他: {other}問

【関連トピック】
学習した内容: {relatedTopics}

【要件】
- 各問題に解答と解説を含める（<details>タグで折りたたみ）
- 誤答の理由も解説する
- 最後に採点基準の表を含める

【出力形式】
Markdown形式で出力
```
