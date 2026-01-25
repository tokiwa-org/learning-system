import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Copy,
  ExternalLink,
  FileCode,
  FolderGit2,
  GitBranch,
  Lightbulb,
  Menu,
  Play,
  PlayCircle,
  Target,
  Terminal,
  X,
  Zap,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

type ItemType = 'CHAPTER' | 'SECTION' | 'LESSON' | 'EXERCISE' | 'QUIZ';
type ItemStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

interface CurriculumItem {
  id: string;
  itemNumber: number;
  itemType: ItemType;
  title: string;
  stepTitle?: string;
  stepContext?: string;
  content: string;
  status: ItemStatus;
  estimatedMinutes: number;
  // Exercise fields
  githubRepo?: string;
  branch?: string;
  setupCommands?: string[];
  objectives?: string[];
  hints?: string[];
}

interface CurriculumData {
  id: string;
  name: string;
  missionTitle: string;
  missionSummary: string;
  backgroundStory: string;
  category: string;
  progress: number;
  items: CurriculumItem[];
}

export const CurriculumBook: React.FC = () => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Mock data - テンプレートに沿った構成
  const curriculum: CurriculumData = {
    id: 'cur_001',
    name: 'セキュリティ基礎',
    missionTitle: 'SQLインジェクション攻撃を阻止せよ',
    missionSummary: '本番システムで不審なアクセスログを検出。セキュリティチームからの緊急依頼...',
    backgroundStory: 'あなたは中堅エンジニアとして、本番システムのセキュリティ強化プロジェクトにアサインされました。突然、セキュリティチームから緊急連絡が入りました。「不審なアクセスログを検出。SQLインジェクション攻撃の可能性がある。至急対応してほしい」',
    category: '共通スキル',
    progress: 17,
    items: [
      // Step 1: なぜ学ぶのか（統計・事例・現状）
      {
        id: 'item_001',
        itemNumber: 1,
        itemType: 'LESSON',
        title: 'なぜSQLインジェクションを学ぶのか',
        stepTitle: '脅威の現状を知れ',
        stepContext: 'SQLインジェクションは「古い攻撃」ではありません。2025年現在も最も危険な脆弱性の一つです。',
        status: 'IN_PROGRESS',
        estimatedMinutes: 8,
        content: `
## なぜSQLインジェクションを学ぶのか

SQLインジェクションは「古い攻撃手法」と思われがちですが、**2025年現在も最も危険なWebアプリケーション脆弱性の一つ**です。

このセクションでは、なぜ今この技術を学ぶ必要があるのかを理解します。

---

## 現在の脅威状況

### OWASP Top 10:2025

インジェクション攻撃は**第5位**にランクイン。
2021年の第3位から順位は下がりましたが、依然として主要な脅威カテゴリです。

> インジェクションは、テストされたアプリケーションの**100%**で何らかの形で検出されています。
> — OWASP Top 10:2025

### 統計データ（2024-2025年）

| 指標 | 数値 |
|------|------|
| SQLi関連CVE（2024年） | **2,400件以上** |
| SQLi関連CVE（2025年予測） | **2,600件以上** |
| 初回スキャンでSQLi脆弱性があるプロジェクト | **20%以上** |
| ORM使用アプリでもSQLi脆弱性あり | **30%以上** |

---

## 最近の実際のインシデント

### 2025年2月: PostgreSQL脆弱性

**CVE-2025-1094**（CVSS 8.1）が発見されました。

エスケープ処理をバイパスできる脆弱性で、「安全」とされていた方法でも攻撃可能でした。

### 2025年5月: 政府ポータル侵害

ある国の政府ポータルがSQLインジェクションで侵害され、**数万件の機密データが漏洩**しました。

### 2024年: TSA航空クルー認証システム

アメリカのTSA（運輸保安庁）が使用する航空クルー認証システム「FlyCASS」でSQLインジェクション脆弱性が発見されました。

悪用されれば、**偽の乗務員記録を追加**して航空機に不正アクセスできる可能性がありました。

---

## なぜ20年以上経っても減らないのか

SQLインジェクションが最初に文書化されたのは**1998年**です。
なぜ27年経った今も被害が続いているのでしょうか？

### 1. レガシーコードの存在

- 10年以上前に書かれたシステムが今も稼働
- セキュリティ対策なしで書かれたコードの保守

### 2. ORMの誤った安心感

- 「ORMを使えば安全」という誤解
- raw queryやカスタムクエリでの脆弱性
- **ORM使用プロジェクトの30%に脆弱性**

### 3. 新しい攻撃ベクターの出現

- NoSQLインジェクション（MongoDB等）
- GraphQLインジェクション
- ORM固有のインジェクション

### 4. 開発者教育の不足

- セキュリティ教育を受けていない開発者
- 「動けばOK」の文化

---

## このカリキュラムで学ぶこと

このミッションを完了すると、以下ができるようになります：

- [ ] SQLインジェクションの仕組みを説明できる
- [ ] 脆弱なコードを見つけることができる
- [ ] プリペアドステートメントで安全なコードを書ける
- [ ] コードレビューでSQLi脆弱性を指摘できる

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 現在の順位 | OWASP Top 10 第5位（2025年） |
| 年間CVE数 | 2,400件以上（2024年） |
| 初回検出率 | プロジェクトの20%以上 |
| 学ぶ意義 | 現役の脅威であり、防御スキルは必須 |

次のセクションでは、攻撃の具体的な仕組みを学びます。
        `,
      },
      // Step 2: 基礎知識（攻撃の仕組み）
      {
        id: 'item_002',
        itemNumber: 2,
        itemType: 'LESSON',
        title: '攻撃の仕組み',
        stepTitle: '攻撃手法を理解せよ',
        stepContext: '敵を知ることが防御の第一歩です。攻撃者がどのようにSQLインジェクションを行うか学びます。',
        status: 'NOT_STARTED',
        estimatedMinutes: 12,
        content: `
## 攻撃の仕組み

SQLインジェクションは、**ユーザー入力がSQLコードとして実行されてしまう**脆弱性を悪用した攻撃です。

---

## 脆弱なコードの例

以下のようなログイン処理があるとします：

\`\`\`typescript
// ❌ 危険なコード - 絶対に書いてはいけない
async function login(email: string, password: string) {
  const query = \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`;
  const result = await db.query(query);
  return result.rows[0];
}
\`\`\`

### 正常な入力の場合

ユーザーが \`tanaka@example.com\` と入力：

\`\`\`sql
SELECT * FROM users WHERE email = 'tanaka@example.com' AND password = '***'
\`\`\`

→ 意図通りに動作

---

## 攻撃パターン1: 認証バイパス

攻撃者がメールアドレス欄に以下を入力：

\`\`\`
' OR '1'='1' --
\`\`\`

生成されるSQL：

\`\`\`sql
SELECT * FROM users WHERE email = '' OR '1'='1' --' AND password = '***'
\`\`\`

### 解説

| 部分 | 意味 |
|------|------|
| \`'\` | 文字列を閉じる |
| \`OR '1'='1'\` | 常にTRUEになる条件を追加 |
| \`--\` | 以降をコメントアウト（パスワードチェック無効化） |

**結果：パスワードなしで任意のユーザーとしてログイン可能**

---

## 攻撃パターン2: データ窃取（UNION攻撃）

検索機能を悪用してデータを盗む：

\`\`\`
' UNION SELECT id, email, password, credit_card FROM users --
\`\`\`

生成されるSQL：

\`\`\`sql
SELECT name, price FROM products WHERE category = ''
UNION SELECT id, email, password, credit_card FROM users --'
\`\`\`

**結果：全ユーザーの認証情報・クレジットカード情報を取得**

---

## 攻撃パターン3: データ破壊

\`\`\`
'; DROP TABLE users; --
\`\`\`

生成されるSQL：

\`\`\`sql
SELECT * FROM users WHERE email = ''; DROP TABLE users; --'
\`\`\`

**結果：usersテーブル全体が削除される**

---

## 攻撃パターン4: 権限昇格

\`\`\`
'; UPDATE users SET role = 'admin' WHERE email = 'attacker@evil.com'; --
\`\`\`

**結果：攻撃者のアカウントが管理者権限に昇格**

---

## 攻撃パターン5: ブラインドSQLインジェクション

エラーメッセージが表示されない場合でも、レスポンス時間の違いで情報を抽出：

\`\`\`
' AND IF(SUBSTRING(password,1,1)='a', SLEEP(5), 0) --
\`\`\`

**結果：1文字ずつパスワードを特定（時間がかかるが確実）**

---

## なぜ発生するのか

### 根本原因

**ユーザー入力を「データ」ではなく「コード」として解釈してしまう**

\`\`\`typescript
// 問題のあるコード
const query = \`SELECT * FROM users WHERE id = \${id}\`;

// idに「1 OR 1=1」が入ると...
// → SELECT * FROM users WHERE id = 1 OR 1=1
// → 全レコードが返される
\`\`\`

### コードとデータの境界

| 種類 | 例 |
|------|------|
| コード（SQL構文） | SELECT, WHERE, OR, AND |
| データ（ユーザー入力） | tanaka@example.com, password123 |

SQLインジェクションは、**データがコードとして解釈される**ことで発生します。

---

## まとめ

| 攻撃パターン | 被害 |
|-------------|------|
| 認証バイパス | 不正ログイン |
| UNION攻撃 | データ窃取 |
| DROP/DELETE | データ破壊 |
| UPDATE | 権限昇格 |
| ブラインド | 情報漏洩（時間差攻撃） |

次のセクションでは、これらの攻撃を防ぐ方法を学びます。
        `,
      },
      // Step 3: 対策方法
      {
        id: 'item_003',
        itemNumber: 3,
        itemType: 'LESSON',
        title: '対策方法',
        stepTitle: '防御手法を習得せよ',
        stepContext: '攻撃の仕組みを理解したら、次は守り方です。プリペアドステートメントを中心に対策方法を学びます。',
        status: 'NOT_STARTED',
        estimatedMinutes: 10,
        content: `
## 対策方法

SQLインジェクションを防ぐための**鉄則**：

> **ユーザー入力を絶対にSQL文に直接埋め込まない**

---

## 対策1: プリペアドステートメント（必須）

**パラメータ化クエリ**とも呼ばれ、SQLインジェクション対策の**第一選択**です。

### Before（危険）

\`\`\`typescript
// ❌ 文字列連結 - 絶対にNG
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
await db.query(query);
\`\`\`

### After（安全）

\`\`\`typescript
// ✅ プリペアドステートメント
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [email]);
\`\`\`

### なぜ安全か

1. \`$1\` は**プレースホルダ**（値が入る場所の印）
2. データベースドライバが値を**エスケープ処理**して挿入
3. 攻撃者の入力は「コード」ではなく「データ」として扱われる

\`\`\`typescript
// 攻撃者が「' OR '1'='1' --」を入力しても
// → WHERE email = ''' OR ''1''=''1'' --'
// → 単なる文字列として検索される（攻撃失敗）
\`\`\`

---

## 対策2: ORMの活用

ORMを使うと、プリペアドステートメントが**自動的に適用**されます。

### Prisma（推奨）

\`\`\`typescript
// ✅ 安全 - Prismaが内部でパラメータ化
const user = await prisma.user.findUnique({
  where: { email: email }
});
\`\`\`

### TypeORM

\`\`\`typescript
// ✅ 安全
const user = await userRepository.findOne({
  where: { email: email }
});
\`\`\`

### ⚠️ ORMでも危険なケース

\`\`\`typescript
// ❌ raw queryは危険
const users = await prisma.$queryRawUnsafe(
  \`SELECT * FROM users WHERE email = '\${email}'\`
);

// ✅ raw queryでもパラメータ化
const users = await prisma.$queryRaw\`
  SELECT * FROM users WHERE email = \${email}
\`;
\`\`\`

---

## 対策3: 入力値の検証（多層防御）

プリペアドステートメントと**併用**する追加対策です。

\`\`\`typescript
// 数値の検証
const id = parseInt(req.params.id, 10);
if (isNaN(id) || id < 0) {
  throw new Error('Invalid ID');
}

// メールアドレスの検証
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error('Invalid email format');
}

// 許可リスト（ホワイトリスト）
const allowedSortColumns = ['name', 'created_at', 'price'];
if (!allowedSortColumns.includes(sortBy)) {
  throw new Error('Invalid sort column');
}
\`\`\`

---

## 対策4: 最小権限の原則

データベースユーザーの権限を最小限に：

\`\`\`sql
-- アプリケーション用ユーザー
CREATE USER app_user WITH PASSWORD 'xxx';

-- 必要な権限のみ付与
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
GRANT SELECT ON products TO app_user;

-- DROP権限は付与しない！
-- REVOKE DROP ON ALL TABLES FROM app_user;
\`\`\`

**効果：** 万が一攻撃を受けても、被害を最小限に抑えられます。

---

## よくある間違い

### ❌ エスケープだけに頼る

\`\`\`typescript
// 不十分 - エスケープ漏れのリスク
const safeEmail = email.replace(/'/g, "''");
const query = \`SELECT * FROM users WHERE email = '\${safeEmail}'\`;
\`\`\`

**問題：** エンコーディングの違いなどで回避される可能性

### ❌ ブラックリスト方式

\`\`\`typescript
// 不十分 - 新しい攻撃手法に対応できない
if (input.includes('DROP') || input.includes('DELETE')) {
  throw new Error('Invalid input');
}
\`\`\`

**問題：** 大文字小文字、エンコーディング、新手法で回避可能

---

## まとめ

| 対策 | 効果 | 必須度 |
|------|------|--------|
| プリペアドステートメント | ◎ 根本対策 | **必須** |
| ORM使用 | ◎ 自動適用 | 推奨 |
| 入力値検証 | ○ 多層防御 | 推奨 |
| 最小権限 | ○ 被害軽減 | 推奨 |
| ブラックリスト | △ 不十分 | 非推奨 |
| エスケープのみ | △ リスクあり | 非推奨 |

次のセクションでは、実際に脆弱なコードを見つける演習を行います。
        `,
      },
      // Step 4: ハンズオン演習（基礎）
      {
        id: 'item_004',
        itemNumber: 4,
        itemType: 'EXERCISE',
        title: '脆弱なコードを特定する',
        stepTitle: '脆弱なコードを特定せよ',
        stepContext: 'セキュリティチームから対象のコードが送られてきました。実際のリポジトリで脆弱性があるコードを特定し、修正してください。',
        status: 'NOT_STARTED',
        estimatedMinutes: 20,
        content: `
## 演習: 脆弱なコードの特定と修正

このリポジトリには、SQLインジェクションの脆弱性を持つサンプルアプリケーションが含まれています。

---

## シナリオ

セキュリティチームから連絡がありました：

> 「セキュリティスキャンで、このリポジトリにSQLインジェクションの脆弱性が**3箇所以上**検出されました。
> 脆弱性を特定し、修正してください。期限は本日中です。」

---

## タスク

### タスク1: 脆弱なコードを特定する

\`src/api/users.ts\` を確認し、SQLインジェクションの脆弱性があるコードを**3箇所**特定してください。

**確認ポイント：**
- [ ] テンプレートリテラル（バッククォート）を使ったクエリ構築
- [ ] 文字列連結でのSQL組み立て
- [ ] ユーザー入力が直接クエリに埋め込まれている箇所

### タスク2: 安全なコードに修正する

\`src/api/products.ts\` のクエリを、プリペアドステートメントを使用した安全な実装に修正してください。

**確認ポイント：**
- [ ] \`$1\`, \`$2\` などのプレースホルダを使用
- [ ] パラメータを配列で渡している
- [ ] 動的なWHERE句も安全に構築

### タスク3: テストで検証する

修正が正しいことを確認するため、テストを実行してください：

\`\`\`bash
npm run test
\`\`\`

すべてのテストがパスすれば完了です。

---

## 評価基準

| 基準 | 達成条件 |
|------|----------|
| 脆弱性特定 | users.ts の脆弱箇所を3つ特定 |
| コード修正 | products.ts がプリペアドステートメントで修正済み |
| テスト | \`npm run test\` がすべてパス |
        `,
        githubRepo: 'tokiwa-tech/sql-injection-exercise',
        branch: 'exercise/step-4',
        setupCommands: [
          'npm install',
          'npm run db:setup',
          'npm run test:watch',
        ],
        objectives: [
          'users.ts の脆弱なクエリを3箇所特定する',
          'products.ts をプリペアドステートメントで修正する',
          'すべてのテストがパスすることを確認する',
        ],
        hints: [
          'テンプレートリテラル（`）での文字列埋め込みは危険です',
          'db.query() の第2引数にパラメータ配列を渡せます',
          'LIKE句のワイルドカード（%）はパラメータ側で付与します',
        ],
      },
      // Step 5: 理解度確認クイズ
      {
        id: 'item_005',
        itemNumber: 5,
        itemType: 'QUIZ',
        title: '理解度確認',
        stepTitle: '知識を確認せよ',
        stepContext: 'ここまでの内容を理解しているか、クイズ形式で確認します。',
        status: 'NOT_STARTED',
        estimatedMinutes: 8,
        content: `
## 理解度確認クイズ

ここまで学んだ内容を確認しましょう。

---

### Q1. SQLインジェクション対策として最も効果的なものは？

A. 入力値の長さを制限する
B. プリペアドステートメント（パラメータ化クエリ）を使用する
C. 特殊文字をブラックリストで除外する
D. HTTPSを使用する

---

### Q2. 次のコードの問題点は何ですか？

\`\`\`typescript
const search = req.query.search;
const query = \`SELECT * FROM products WHERE name LIKE '%\${search}%'\`;
const result = await db.query(query);
\`\`\`

A. LIKE句は使用できない
B. ユーザー入力がSQLに直接埋め込まれている
C. awaitの使い方が間違っている
D. 問題はない

---

### Q3. ORMを使用すれば、SQLインジェクションは100%防げる？

A. はい、ORMは完全に安全です
B. いいえ、raw queryを使用する場合は注意が必要です

---

### Q4. OWASP Top 10:2025でのインジェクション攻撃の順位は？

A. 1位
B. 3位
C. 5位
D. 10位

---

### Q5. 次のうち、安全なコードはどれですか？

A.
\`\`\`typescript
const query = \`SELECT * FROM users WHERE id = \${id}\`;
\`\`\`

B.
\`\`\`typescript
const query = 'SELECT * FROM users WHERE id = $1';
await db.query(query, [id]);
\`\`\`

C.
\`\`\`typescript
const safeId = id.replace(/'/g, "''");
const query = \`SELECT * FROM users WHERE id = '\${safeId}'\`;
\`\`\`

---

## 採点基準

| 正解数 | 評価 |
|--------|------|
| 5問正解 | 完璧です！次の演習に進みましょう |
| 3-4問正解 | 基本は理解しています。間違えた問題を復習してください |
| 2問以下 | 学習コンテンツをもう一度確認してください |
        `,
      },
      // Step 6: 実践演習（応用）
      {
        id: 'item_006',
        itemNumber: 6,
        itemType: 'EXERCISE',
        title: '本番コードのリファクタリング',
        stepTitle: '本番コードを修正せよ',
        stepContext: '最終ステップです。より複雑な本番コードを安全なコードにリファクタリングしてください。',
        status: 'NOT_STARTED',
        estimatedMinutes: 25,
        content: `
## 実践演習: 本番コードのリファクタリング

実際の業務に近い、より複雑なコードベースを扱います。

---

## シナリオ

あなたは、レガシーシステムのセキュリティ改善を任されました。

> 「来月のセキュリティ監査に向けて、このシステムのSQLインジェクション脆弱性を
> すべて修正してください。特に以下の点に注意してください：
>
> 1. 動的な検索条件を持つAPI
> 2. トランザクション処理
> 3. バッチ処理
>
> テストカバレッジは維持してください。」

---

## タスク

### タスク1: 動的WHERE句の安全な構築

検索条件が動的に変わるクエリを、安全に構築してください。

\`\`\`typescript
// 修正前（危険）
function searchProducts(filters: Record<string, string>) {
  let query = 'SELECT * FROM products WHERE 1=1';
  for (const [key, value] of Object.entries(filters)) {
    query += \` AND \${key} = '\${value}'\`;
  }
  return db.query(query);
}
\`\`\`

**確認ポイント：**
- [ ] カラム名はホワイトリストで検証
- [ ] 値はパラメータ化

### タスク2: トランザクション内の複数クエリ修正

トランザクション処理内の全てのクエリを安全な形式に修正してください。

**確認ポイント：**
- [ ] BEGIN/COMMIT間の全クエリがパラメータ化
- [ ] エラー時のROLLBACKが正しく動作

### タスク3: 統合テストの実行

修正後、統合テストを実行して全てがパスすることを確認してください。

\`\`\`bash
npm run test:integration
\`\`\`

---

## 評価基準

| 基準 | 達成条件 |
|------|----------|
| 動的WHERE句 | パラメータ化 + カラムのホワイトリスト検証 |
| トランザクション | 全クエリがパラメータ化、エラーハンドリング正常 |
| テスト | \`npm run test:integration\` がすべてパス |
| コード品質 | 既存のテストが壊れていない |
        `,
        githubRepo: 'tokiwa-tech/sql-injection-advanced',
        branch: 'exercise/step-6',
        setupCommands: [
          'npm install',
          'docker-compose up -d',
          'npm run migrate',
          'npm run test',
        ],
        objectives: [
          '動的WHERE句をパラメータ化 + ホワイトリスト検証する',
          'トランザクション処理を安全に実装する',
          '統合テストがすべてパスする',
        ],
        hints: [
          '条件とパラメータを別々の配列で構築し、最後に結合しましょう',
          'カラム名は許可リスト（allowedColumns）でチェックしましょう',
          'トランザクション内でもプリペアドステートメントは有効です',
        ],
      },
    ],
  };

  const currentItem = curriculum.items[currentItemIndex];
  const completedCount = curriculum.items.filter(item => item.status === 'COMPLETED').length;
  const progress = Math.round((completedCount / curriculum.items.length) * 100);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getItemIcon = (item: CurriculumItem, isCurrent: boolean) => {
    if (item.status === 'COMPLETED') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (item.status === 'IN_PROGRESS' || isCurrent) {
      return <PlayCircle className="w-4 h-4 text-blue-600" />;
    }
    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  const getTypeLabel = (type: ItemType) => {
    switch (type) {
      case 'LESSON':
        return { icon: BookOpen, label: '学習', color: 'text-blue-600 bg-blue-50' };
      case 'EXERCISE':
        return { icon: FileCode, label: '演習', color: 'text-green-600 bg-green-50' };
      case 'QUIZ':
        return { icon: Target, label: 'クイズ', color: 'text-purple-600 bg-purple-50' };
      default:
        return { icon: BookOpen, label: '学習', color: 'text-gray-600 bg-gray-50' };
    }
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content
      .split('\n')
      .map((line, index) => {
        // Headings
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b">
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-semibold text-gray-800 mt-6 mb-3">
              {line.replace('### ', '')}
            </h3>
          );
        }
        // Horizontal rule
        if (line.trim() === '---') {
          return <hr key={index} className="my-6 border-gray-200" />;
        }
        // Code blocks
        if (line.startsWith('```')) {
          return null; // Handle in a more complex way if needed
        }
        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-blue-900 italic">
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        // List items
        if (line.startsWith('- [ ] ')) {
          return (
            <div key={index} className="flex items-center gap-2 my-1 text-gray-700">
              <input type="checkbox" className="rounded" disabled />
              <span>{line.replace('- [ ] ', '')}</span>
            </div>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 my-1 text-gray-700">
              {line.replace('- ', '')}
            </li>
          );
        }
        // Tables (simplified)
        if (line.startsWith('|')) {
          return (
            <div key={index} className="font-mono text-sm my-1">
              {line}
            </div>
          );
        }
        // Regular paragraphs
        if (line.trim()) {
          // Handle inline code
          const parts = line.split(/(`[^`]+`)/g);
          return (
            <p key={index} className="my-3 text-gray-700 leading-relaxed">
              {parts.map((part, i) => {
                if (part.startsWith('`') && part.endsWith('`')) {
                  return (
                    <code key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                // Handle bold
                const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
                return boldParts.map((bp, j) => {
                  if (bp.startsWith('**') && bp.endsWith('**')) {
                    return <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>;
                  }
                  return bp;
                });
              })}
            </p>
          );
        }
        return null;
      });
  };

  // Extract code blocks for special rendering
  const renderContentWithCodeBlocks = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');

        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden">
            {language && (
              <div className="bg-gray-800 text-gray-400 text-xs px-4 py-2 flex items-center justify-between">
                <span>{language}</span>
                <button
                  onClick={() => copyToClipboard(code, `code-${index}`)}
                  className="hover:text-white transition-colors"
                >
                  {copied === `code-${index}` ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
            <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
              <code className="text-sm font-mono">{code}</code>
            </pre>
          </div>
        );
      }
      return <div key={index}>{renderContent(part)}</div>;
    });
  };

  const typeInfo = getTypeLabel(currentItem.itemType);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-900 truncate mx-4">{curriculum.missionTitle}</span>
        <div className="w-9" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-semibold">目次</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-60px)]">
              {curriculum.items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentItemIndex(index);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-3 transition-colors ${
                    index === currentItemIndex
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {getItemIcon(item, index === currentItemIndex)}
                  <span className="text-sm">{item.itemNumber}. {item.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:block fixed left-0 top-0 bottom-0 bg-gray-50 border-r transition-all duration-300 ${
            sidebarOpen ? 'w-72' : 'w-0'
          }`}
        >
          {sidebarOpen && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b bg-white">
                <a href="#learning-tasks" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-3">
                  <ArrowLeft className="w-4 h-4" />
                  学習課題一覧
                </a>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">MISSION</span>
                </div>
                <h1 className="font-bold text-gray-900 leading-tight">{curriculum.missionTitle}</h1>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{completedCount}/{curriculum.items.length} 完了</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {curriculum.items.map((item, index) => {
                  const itemTypeInfo = getTypeLabel(item.itemType);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentItemIndex(index)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                        index === currentItemIndex
                          ? 'bg-blue-100 text-blue-900 font-medium'
                          : item.status === 'COMPLETED'
                            ? 'bg-white text-gray-600 hover:bg-gray-100'
                            : 'hover:bg-white text-gray-700'
                      }`}
                    >
                      <div className="mt-0.5">
                        {getItemIcon(item, index === currentItemIndex)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm leading-snug">{item.itemNumber}. {item.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${itemTypeInfo.color}`}>
                            {itemTypeInfo.label}
                          </span>
                          <span className="text-xs text-gray-400">{item.estimatedMinutes}分</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </aside>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`hidden lg:flex fixed top-4 z-40 w-8 h-8 items-center justify-center bg-white border rounded-full shadow-sm hover:bg-gray-50 transition-all ${
            sidebarOpen ? 'left-[276px]' : 'left-4'
          }`}
        >
          {sidebarOpen ? <ArrowLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Main Content */}
        <main
          className={`flex-1 min-h-screen transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
          }`}
        >
          <div className="pt-16 lg:pt-0">
            {/* Content Header */}
            <div className="sticky top-0 lg:top-0 z-30 bg-white border-b">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${typeInfo.color}`}>
                      <TypeIcon className="w-3.5 h-3.5" />
                      {typeInfo.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      約{currentItem.estimatedMinutes}分
                    </span>
                  </div>
                  {currentItem.status === 'COMPLETED' && (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      完了済み
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-6 py-8">
              {/* Title */}
              <header className="mb-8">
                <div className="text-sm text-gray-500 mb-2">
                  STEP {currentItem.itemNumber}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {currentItem.stepTitle || currentItem.title}
                </h1>
                {currentItem.stepContext && (
                  <p className="text-lg text-gray-600">{currentItem.stepContext}</p>
                )}
              </header>

              {/* Exercise Panel */}
              {currentItem.itemType === 'EXERCISE' && currentItem.githubRepo && (
                <div className="mb-8 p-6 bg-gray-900 text-white rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <FolderGit2 className="w-6 h-6" />
                    <div>
                      <div className="font-semibold">演習リポジトリ</div>
                      <div className="text-sm text-gray-400">{currentItem.githubRepo}</div>
                    </div>
                  </div>

                  {currentItem.branch && (
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <GitBranch className="w-4 h-4 text-gray-400" />
                      <code className="bg-gray-800 px-2 py-1 rounded">{currentItem.branch}</code>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                      <a
                        href={`https://github.com/${currentItem.githubRepo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        GitHub
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800" asChild>
                      <a
                        href={`https://github.dev/${currentItem.githubRepo}/tree/${currentItem.branch || 'main'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        github.dev
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800" asChild>
                      <a href={`vscode://vscode.git/clone?url=https://github.com/${currentItem.githubRepo}.git`}>
                        VS Codeで開く
                      </a>
                    </Button>
                  </div>

                  {currentItem.setupCommands && (
                    <div className="mt-4">
                      <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <Terminal className="w-3 h-3" />
                        セットアップコマンド
                      </div>
                      <div className="relative">
                        <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                          {currentItem.setupCommands.join('\n')}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(currentItem.setupCommands!.join(' && '), 'setup')}
                          className="absolute top-2 right-2 p-1.5 hover:bg-gray-700 rounded"
                        >
                          {copied === 'setup' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Objectives */}
              {currentItem.objectives && currentItem.objectives.length > 0 && (
                <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    達成目標
                  </h3>
                  <ul className="space-y-2">
                    {currentItem.objectives.map((obj, index) => (
                      <li key={index} className="flex items-start gap-3 text-blue-800">
                        <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-gray max-w-none">
                {renderContentWithCodeBlocks(currentItem.content)}
              </div>

              {/* Hints */}
              {currentItem.hints && currentItem.hints.length > 0 && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-medium">ヒントを{showHints ? '隠す' : '表示'}</span>
                    {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showHints && (
                    <div className="mt-4 p-5 bg-amber-50 border border-amber-200 rounded-xl">
                      <ul className="space-y-3">
                        {currentItem.hints.map((hint, index) => (
                          <li key={index} className="flex items-start gap-3 text-amber-800">
                            <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-600" />
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </article>

            {/* Footer Navigation */}
            <footer className="border-t bg-gray-50">
              <div className="max-w-4xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                  {currentItemIndex > 0 ? (
                    <button
                      onClick={() => setCurrentItemIndex(currentItemIndex - 1)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <div className="text-left">
                        <div className="text-xs text-gray-400">前のステップ</div>
                        <div className="font-medium">{curriculum.items[currentItemIndex - 1].title}</div>
                      </div>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentItem.itemType === 'EXERCISE' || currentItem.itemType === 'QUIZ' ? (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      完了として記録
                    </Button>
                  ) : null}

                  {currentItemIndex < curriculum.items.length - 1 ? (
                    <button
                      onClick={() => setCurrentItemIndex(currentItemIndex + 1)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <div className="text-right">
                        <div className="text-xs text-gray-400">次のステップ</div>
                        <div className="font-medium">{curriculum.items[currentItemIndex + 1].title}</div>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CurriculumBook;
