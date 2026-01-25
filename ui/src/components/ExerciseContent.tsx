import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  FileCode,
  FolderGit2,
  GitBranch,
  Lightbulb,
  Play,
  Terminal,
  Zap,
  Target,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Layout } from './Layout';

type ExerciseType = 'CODESPACES' | 'NOTEBOOK' | 'QUIZ' | 'READING';

interface ExerciseStep {
  id: string;
  stepNumber: number;
  title: string;
  stepTitle: string;
  stepContext: string;
  type: ExerciseType;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  estimatedMinutes: number;
  // Content
  content: string;
  hints?: string[];
  // GitHub Exercise fields
  githubRepo?: string;
  branch?: string;
  setupCommands?: string[];
  objectives?: string[];
  submissionType?: 'PR' | 'COMMIT' | 'MANUAL';
}

interface MissionExercise {
  id: string;
  missionTitle: string;
  missionSummary: string;
  backgroundStory: string;
  missionObjective: string;
  category: string;
  noiseLevel: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';
  progress: number;
  dueDate: string;
  steps: ExerciseStep[];
}

export const ExerciseContent: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // Start at exercise step
  const [showHints, setShowHints] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Mock data - Security Basics Mission
  const mission: MissionExercise = {
    id: 'mission_001',
    missionTitle: 'SQLインジェクション攻撃を阻止せよ',
    missionSummary: '本番システムで不審なアクセスログを検出。セキュリティチームからの緊急依頼が入った...',
    backgroundStory: 'あなたは中堅エンジニアとして、本番システムのセキュリティ強化プロジェクトにアサインされました。突然、セキュリティチームから緊急連絡が入りました。「不審なアクセスログを検出。SQLインジェクション攻撃の可能性がある。至急対応してほしい」',
    missionObjective: 'SQLインジェクションの仕組みを理解し、脆弱なコードを特定・修正できるようになる',
    category: '共通スキル',
    noiseLevel: 'LOW',
    progress: 40,
    dueDate: '2026/02/15',
    steps: [
      {
        id: 'step_001',
        stepNumber: 1,
        title: 'SQLインジェクションとは',
        stepTitle: '攻撃の仕組みを理解せよ',
        stepContext: 'まず、敵を知ることから始めましょう。SQLインジェクション攻撃がどのように行われるか学びます。',
        type: 'READING',
        status: 'COMPLETED',
        estimatedMinutes: 8,
        content: `
## SQLインジェクションとは

SQLインジェクション（SQL Injection）は、OWASP Top 10で常に上位にランクインする、最も危険なWebアプリケーション脆弱性の一つです。

攻撃者がユーザー入力欄に**悪意のあるSQL文**を挿入し、データベースを不正に操作する攻撃手法です。

---

## 脆弱なコードの例

以下のようなログイン処理があるとします：

\`\`\`typescript
// ❌ 危険なコード
const query = \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`;
const result = await db.query(query);
\`\`\`

正常なユーザーが \`tanaka@example.com\` と入力した場合：

\`\`\`sql
SELECT * FROM users WHERE email = 'tanaka@example.com' AND password = '***'
\`\`\`

---

## 攻撃の仕組み

攻撃者がメールアドレス欄に以下を入力したとします：

\`\`\`
' OR '1'='1' --
\`\`\`

すると、実行されるSQLは：

\`\`\`sql
SELECT * FROM users WHERE email = '' OR '1'='1' --' AND password = '***'
\`\`\`

**解説：**
- \`' OR '1'='1'\` → 常にTRUEになる条件を追加
- \`--\` → 以降のSQL文をコメントアウト（パスワードチェックを無効化）

結果：**パスワードなしで全ユーザーとしてログイン可能**

---

## より深刻な攻撃例

### 1. データの窃取（UNION攻撃）

\`\`\`
' UNION SELECT id, email, password, credit_card FROM users --
\`\`\`

→ 全ユーザーのクレジットカード情報を取得

### 2. データの破壊

\`\`\`
'; DROP TABLE users; --
\`\`\`

→ usersテーブル全体を削除

### 3. 権限昇格

\`\`\`
'; UPDATE users SET role = 'admin' WHERE email = 'attacker@evil.com'; --
\`\`\`

→ 自分のアカウントを管理者に昇格

---

## なぜ発生するのか

**根本原因：** ユーザー入力を信頼し、SQLクエリに直接埋め込んでいるため

アプリケーションは「データ」として扱うべき入力を「コード」として解釈してしまいます。

---

## 確認クイズ

以下のコードは安全でしょうか？

\`\`\`typescript
const id = req.params.id;
const query = \`SELECT * FROM products WHERE id = \${id}\`;
\`\`\`

**答え：** ❌ 危険です。数値であっても文字列連結は脆弱性の原因となります。

次のステップでは、この脆弱性を防ぐ方法を学びます。
        `,
      },
      {
        id: 'step_002',
        stepNumber: 2,
        title: '対策方法の理解',
        stepTitle: '対策方法を学べ',
        stepContext: '攻撃の仕組みを理解したら、次は守り方です。プリペアドステートメントなど対策方法を学びます。',
        type: 'READING',
        status: 'COMPLETED',
        estimatedMinutes: 10,
        content: `
## SQLインジェクション対策

SQLインジェクションを防ぐための**鉄則**：

> **ユーザー入力を絶対にSQL文に直接埋め込まない**

---

## 対策1: プリペアドステートメント（最重要）

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

**なぜ安全か：**
- \`$1\` はプレースホルダ（値が入る場所の印）
- データベースドライバが値を**エスケープ処理**して挿入
- 攻撃者の入力は「コード」ではなく「データ」として扱われる

---

## 対策2: ORMの使用

ORMを使うと、プリペアドステートメントが自動的に適用されます。

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

**注意：** ORMでも \`raw query\` を使う場合は注意が必要です。

---

## 対策3: 入力値の検証（多層防御）

プリペアドステートメントと併用する追加対策です。

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
\`\`\`

---

## 対策4: 最小権限の原則

データベースユーザーの権限を最小限に：

\`\`\`sql
-- アプリケーション用ユーザー
CREATE USER app_user WITH PASSWORD 'xxx';
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
-- DROP権限は付与しない！
\`\`\`

万が一攻撃を受けても、被害を最小限に抑えられます。

---

## よくある間違い

### ❌ エスケープだけに頼る

\`\`\`typescript
// 不十分 - エスケープ漏れのリスク
const safeEmail = email.replace(/'/g, "''");
const query = \`SELECT * FROM users WHERE email = '\${safeEmail}'\`;
\`\`\`

### ❌ ブラックリスト方式

\`\`\`typescript
// 不十分 - 新しい攻撃手法に対応できない
if (input.includes('DROP') || input.includes('DELETE')) {
  throw new Error('Invalid input');
}
\`\`\`

---

## まとめ

| 対策 | 効果 | 必須度 |
|------|------|--------|
| プリペアドステートメント | ◎ 根本対策 | **必須** |
| ORM使用 | ◎ 自動適用 | 推奨 |
| 入力値検証 | ○ 多層防御 | 推奨 |
| 最小権限 | ○ 被害軽減 | 推奨 |

次のステップでは、実際に脆弱なコードを見つける演習を行います。
        `,
      },
      {
        id: 'step_003',
        stepNumber: 3,
        title: '【演習】脆弱なコードを特定する',
        stepTitle: '脆弱なコードを特定せよ',
        stepContext: 'セキュリティチームから対象のコードが送られてきました。実際のリポジトリで脆弱性があるコードを特定し、修正してください。',
        type: 'CODESPACES',
        status: 'IN_PROGRESS',
        estimatedMinutes: 20,
        content: `
## 演習: 脆弱なコードの特定と修正

このリポジトリには、SQLインジェクションの脆弱性を持つサンプルアプリケーションが含まれています。

### タスク

1. \`src/api/users.ts\` を確認し、脆弱なコードを特定してください
2. \`src/api/products.ts\` のクエリを安全な実装に修正してください
3. テストを実行して、修正が正しいことを確認してください
        `,
        githubRepo: 'tokiwa-tech/sql-injection-exercise',
        branch: 'exercise/step-3',
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
        submissionType: 'PR',
        hints: [
          'テンプレートリテラルでの文字列埋め込みは危険です',
          'db.query() の第2引数にパラメータ配列を渡せます',
          'LIKE句のワイルドカードはパラメータ側で付与します',
        ],
      },
      {
        id: 'step_004',
        stepNumber: 4,
        title: '【クイズ】理解度確認',
        stepTitle: '知識を確認せよ',
        stepContext: '攻撃と対策の両方を理解しているか、クイズ形式でチェックします。',
        type: 'QUIZ',
        status: 'NOT_STARTED',
        estimatedMinutes: 8,
        content: 'クイズ問題がここに表示されます。',
      },
      {
        id: 'step_005',
        stepNumber: 5,
        title: '【実践】本番コードのリファクタリング',
        stepTitle: '本番コードを修正せよ',
        stepContext: '最終ステップです。より複雑な本番コードを安全なコードにリファクタリングしてください。',
        type: 'CODESPACES',
        status: 'NOT_STARTED',
        estimatedMinutes: 25,
        content: `
## 実践演習: 本番コードのリファクタリング

実際の業務に近い、より複雑なコードベースを扱います。

### タスク

1. 動的WHERE句を安全に構築する
2. トランザクション内の複数クエリを修正する
3. ストアドプロシージャとの連携部分を確認する
        `,
        githubRepo: 'tokiwa-tech/sql-injection-advanced',
        branch: 'exercise/step-5',
        setupCommands: [
          'npm install',
          'docker-compose up -d',
          'npm run migrate',
          'npm run test',
        ],
        objectives: [
          '動的WHERE句をパラメータ化する',
          'トランザクション処理を安全に実装する',
          '統合テストがすべてパスする',
        ],
        submissionType: 'PR',
        hints: [
          '条件とパラメータを別々の配列で構築しましょう',
          'トランザクション内でもプリペアドステートメントは有効です',
        ],
      },
    ],
  };

  const currentStep = mission.steps[currentStepIndex];
  const progress = Math.round(((currentStepIndex + 1) / mission.steps.length) * 100);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getTypeIcon = (type: ExerciseType) => {
    switch (type) {
      case 'CODESPACES':
        return <FileCode className="w-4 h-4" />;
      case 'NOTEBOOK':
        return <Terminal className="w-4 h-4" />;
      case 'QUIZ':
        return <Target className="w-4 h-4" />;
      case 'READING':
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: ExerciseType) => {
    switch (type) {
      case 'CODESPACES':
        return { label: 'コード演習', color: 'bg-green-100 text-green-700' };
      case 'NOTEBOOK':
        return { label: 'Notebook', color: 'bg-purple-100 text-purple-700' };
      case 'QUIZ':
        return { label: 'クイズ', color: 'bg-blue-100 text-blue-700' };
      case 'READING':
        return { label: '読み物', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const typeInfo = getTypeLabel(currentStep.type);

  return (
    <Layout userRole="employee">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Mission Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            ミッション一覧
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">MISSION</span>
              <Badge variant="outline" className="text-xs">
                {mission.category}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{mission.missionTitle}</h1>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                STEP {currentStepIndex + 1} / {mission.steps.length}
              </span>
              <span className="text-sm font-medium text-gray-900">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-3">
              {mission.steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(index)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    index === currentStepIndex
                      ? 'bg-amber-100 text-amber-800'
                      : step.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {step.status === 'COMPLETED' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    getTypeIcon(step.type)
                  )}
                  <span className="hidden sm:inline">{step.stepNumber}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Instructions */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        約{currentStep.estimatedMinutes}分
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-amber-700">STEP {currentStep.stepNumber}</span>
                      <h2 className="text-lg font-bold text-gray-900">{currentStep.stepTitle}</h2>
                    </div>
                  </div>
                  {currentStep.status === 'COMPLETED' && (
                    <Badge className="bg-green-100 text-green-700">完了</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-6">
                {/* Step Context */}
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800">{currentStep.stepContext}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-gray max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentStep.content
                        .replace(/##\s(.+)/g, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
                        .replace(/###\s(.+)/g, '<h3 class="text-base font-medium mt-3 mb-1">$1</h3>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-100 rounded text-sm">$1</code>')
                        .replace(/\n\n/g, '</p><p class="mb-3">')
                        .replace(/\n(\d+)\.\s/g, '<br/>$1. '),
                    }}
                  />
                </div>

                {/* Objectives */}
                {currentStep.objectives && currentStep.objectives.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      達成目標
                    </h3>
                    <ul className="space-y-2">
                      {currentStep.objectives.map((obj, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                          <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hints */}
                {currentStep.hints && currentStep.hints.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>ヒントを{showHints ? '隠す' : '表示'}</span>
                      {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {showHints && (
                      <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <ul className="space-y-2">
                          {currentStep.hints.map((hint, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-yellow-800">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: GitHub Integration */}
          <div className="space-y-4">
            {currentStep.type === 'CODESPACES' && currentStep.githubRepo && (
              <>
                {/* Repository Card */}
                <Card className="border-2 border-gray-800">
                  <CardHeader className="bg-gray-900 text-white py-3">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-5 h-5" />
                      <span className="font-semibold">演習リポジトリ</span>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">リポジトリ</p>
                      <p className="font-mono text-sm text-gray-900">{currentStep.githubRepo}</p>
                    </div>
                    {currentStep.branch && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">ブランチ</p>
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-gray-500" />
                          <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                            {currentStep.branch}
                          </code>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 space-y-2">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800" asChild>
                        <a
                          href={`https://github.com/${currentStep.githubRepo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          GitHubで開く
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <a
                          href={`https://github.dev/${currentStep.githubRepo}/tree/${currentStep.branch || 'main'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          github.devで開く
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Clone Instructions */}
                <Card>
                  <CardHeader className="py-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      ローカル環境での実行
                    </h3>
                  </CardHeader>
                  <CardContent className="py-4 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">1. リポジトリをクローン</p>
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                          git clone https://github.com/{currentStep.githubRepo}.git{'\n'}
                          cd {currentStep.githubRepo.split('/')[1]}{'\n'}
                          {currentStep.branch && `git checkout ${currentStep.branch}`}
                        </pre>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `git clone https://github.com/${currentStep.githubRepo}.git && cd ${currentStep.githubRepo.split('/')[1]}${currentStep.branch ? ` && git checkout ${currentStep.branch}` : ''}`,
                              'clone'
                            )
                          }
                          className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded"
                        >
                          {copied === 'clone' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {currentStep.setupCommands && currentStep.setupCommands.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">2. セットアップ</p>
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                            {currentStep.setupCommands.join('\n')}
                          </pre>
                          <button
                            onClick={() =>
                              copyToClipboard(currentStep.setupCommands!.join(' && '), 'setup')
                            }
                            className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded"
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

                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 mb-2">VS Codeで開く</p>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={`vscode://vscode.git/clone?url=https://github.com/${currentStep.githubRepo}.git`}>
                          VS Codeでクローン
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Submission */}
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="py-4">
                    <h3 className="font-semibold text-amber-900 mb-2">提出方法</h3>
                    {currentStep.submissionType === 'PR' && (
                      <p className="text-sm text-amber-800">
                        修正が完了したら、Pull Requestを作成してください。
                        レビュー後に自動的に完了となります。
                      </p>
                    )}
                    {currentStep.submissionType === 'COMMIT' && (
                      <p className="text-sm text-amber-800">
                        修正をコミットしてプッシュしてください。
                        自動テストがパスすると完了となります。
                      </p>
                    )}
                    <Button className="w-full mt-3 bg-amber-600 hover:bg-amber-700">
                      完了を報告
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {currentStep.type === 'READING' && (
              <Card>
                <CardContent className="py-6 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    内容を読み終えたら「次へ」を押してください
                  </p>
                </CardContent>
              </Card>
            )}

            {currentStep.type === 'QUIZ' && (
              <Card>
                <CardContent className="py-6 text-center">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    クイズに回答してください
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            前のステップ
          </Button>

          <Button
            onClick={() => setCurrentStepIndex((prev) => Math.min(mission.steps.length - 1, prev + 1))}
            disabled={currentStepIndex === mission.steps.length - 1}
            className="bg-amber-600 hover:bg-amber-700"
          >
            次のステップ
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ExerciseContent;
