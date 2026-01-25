import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  Lightbulb,
  Save,
  Send,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Layout } from './Layout';

type DisplayFormat = 'STANDARD' | 'MISSION';

interface CurriculumItem {
  id: string;
  order: number;
  title: string;
  type: 'READING' | 'EXERCISE' | 'QUIZ' | 'DISCUSSION';
  content: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  hints?: string[];
  estimatedMinutes: number;
  // Mission format fields
  stepTitle?: string;
  stepContext?: string;
}

export const LearningExecution: React.FC = () => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [answer, setAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const curriculum = {
    id: 'cur_001',
    title: 'セキュリティ基礎 - SQLインジェクション対策',
    category: '共通スキル',
    totalItems: 5,
    completedItems: 2,
    estimatedMinutes: 45,
    // Mission format fields
    displayFormat: 'MISSION' as DisplayFormat,
    missionTitle: 'SQLインジェクション攻撃を阻止せよ',
    missionSummary: '本番システムで不審なアクセスログを検出。セキュリティチームからの緊急依頼が入った...',
  };

  const items: CurriculumItem[] = [
    {
      id: 'item_001',
      order: 1,
      title: 'SQLインジェクションとは',
      type: 'READING',
      content: `
## SQLインジェクションとは

SQLインジェクションは、Webアプリケーションの脆弱性を悪用した攻撃手法の一つです。

### 攻撃の仕組み

ユーザー入力をそのままSQLクエリに組み込むと、攻撃者が悪意のあるSQLコードを注入できます。

\`\`\`javascript
// 危険なコード例
const query = "SELECT * FROM users WHERE username='" + username + "'";
\`\`\`

上記のコードで、攻撃者が \`' OR '1'='1\` と入力すると：

\`\`\`sql
SELECT * FROM users WHERE username='' OR '1'='1'
\`\`\`

このクエリは常に真となり、全ユーザーの情報が漏洩します。

### 被害事例

- 2011年: Sony PlayStation Network（7,700万人の個人情報流出）
- 2015年: TalkTalk（15万人の顧客情報流出）
      `,
      status: 'COMPLETED',
      estimatedMinutes: 8,
      // Mission format fields
      stepTitle: '攻撃の仕組みを理解せよ',
      stepContext: 'まず、敵を知ることから始めましょう。SQLインジェクション攻撃がどのように行われるか学びます。',
    },
    {
      id: 'item_002',
      order: 2,
      title: '対策方法の理解',
      type: 'READING',
      content: `
## SQLインジェクション対策

### 1. プリペアドステートメント（推奨）

パラメータ化クエリを使用することで、ユーザー入力がSQLコードとして解釈されることを防ぎます。

\`\`\`javascript
// 安全なコード例
const query = "SELECT * FROM users WHERE username = ?";
db.execute(query, [username]);
\`\`\`

### 2. 入力値の検証

- ホワイトリスト方式で許可する文字を限定
- 数値が期待される場合は数値型に変換

### 3. エスケープ処理

特殊文字をエスケープしますが、プリペアドステートメントと比べると脆弱性が残る可能性があります。

### 4. 最小権限の原則

データベースユーザーの権限を必要最小限に制限します。
      `,
      status: 'COMPLETED',
      estimatedMinutes: 10,
      // Mission format fields
      stepTitle: '対策方法を学べ',
      stepContext: '攻撃の仕組みを理解したら、次は守り方です。プリペアドステートメントなど対策方法を学びます。',
    },
    {
      id: 'item_003',
      order: 3,
      title: '【演習】脆弱なコードを見つける',
      type: 'EXERCISE',
      content: `
## 演習: 脆弱なコードの識別

以下の4つのコード例を確認し、**SQLインジェクションの脆弱性があるもの**をすべて選んでください。

---

**コード A:**
\`\`\`javascript
const query = \`SELECT * FROM products WHERE id = \${productId}\`;
db.query(query);
\`\`\`

---

**コード B:**
\`\`\`javascript
const stmt = db.prepare("SELECT * FROM products WHERE id = ?");
stmt.run(productId);
\`\`\`

---

**コード C:**
\`\`\`javascript
const sanitized = productId.replace(/'/g, "''");
const query = "SELECT * FROM products WHERE name = '" + sanitized + "'";
db.query(query);
\`\`\`

---

**コード D:**
\`\`\`javascript
const query = "SELECT * FROM products WHERE category = ?";
db.execute(query, [category]);
\`\`\`

---

⚠️ **ヒント**: 検索エンジンで見つかる古い記事には、エスケープ処理だけで十分という情報がありますが、現在の推奨事項を確認してください。
      `,
      status: 'IN_PROGRESS',
      hints: [
        'テンプレートリテラルでの文字列埋め込みは危険です',
        'プリペアドステートメント（?プレースホルダー）は安全です',
        'エスケープ処理は不完全な対策になり得ます',
      ],
      estimatedMinutes: 12,
      // Mission format fields
      stepTitle: '脆弱なコードを特定せよ',
      stepContext: 'セキュリティチームから対象のコードが送られてきました。脆弱性があるコードを特定してください。',
    },
    {
      id: 'item_004',
      order: 4,
      title: '【クイズ】理解度確認',
      type: 'QUIZ',
      content: `
## クイズ: SQLインジェクション対策

以下の質問に回答してください。

### 問題1
プリペアドステートメントがSQLインジェクションを防ぐ理由として、最も適切なものはどれですか？

A) SQL文をコンパイル時にチェックするから
B) ユーザー入力がデータとして扱われ、SQLコードとして解釈されないから
C) 特殊文字を自動的に削除するから
D) データベース接続を暗号化するから

### 問題2
以下のうち、SQLインジェクション対策として**不十分**なものはどれですか？

A) プリペアドステートメントの使用
B) 入力値のエスケープ処理のみ
C) パラメータ化クエリの使用
D) ストアドプロシージャとパラメータの併用
      `,
      status: 'NOT_STARTED',
      estimatedMinutes: 8,
      // Mission format fields
      stepTitle: '知識を確認せよ',
      stepContext: '攻撃と対策の両方を理解しているか、クイズ形式でチェックします。',
    },
    {
      id: 'item_005',
      order: 5,
      title: '【実践】リファクタリング演習',
      type: 'EXERCISE',
      content: `
## 実践演習: 脆弱なコードのリファクタリング

以下の脆弱なコードを、安全なコードにリファクタリングしてください。

### 対象コード

\`\`\`javascript
function getUserByEmail(email) {
  const query = "SELECT id, name, email FROM users WHERE email = '" + email + "'";
  return db.query(query);
}

function updateUserPassword(userId, newPassword) {
  const query = \`UPDATE users SET password = '\${newPassword}' WHERE id = \${userId}\`;
  return db.execute(query);
}

function searchProducts(keyword, category) {
  let query = "SELECT * FROM products WHERE 1=1";
  if (keyword) {
    query += " AND name LIKE '%" + keyword + "%'";
  }
  if (category) {
    query += " AND category = '" + category + "'";
  }
  return db.query(query);
}
\`\`\`

### 要件

1. プリペアドステートメントを使用すること
2. 動的なWHERE句の構築を安全に行うこと
3. 元の機能は維持すること

回答欄に修正後のコードを入力してください。
      `,
      status: 'NOT_STARTED',
      hints: [
        '各関数でパラメータを配列で渡せるようにしましょう',
        '動的クエリは条件とパラメータを別々に構築します',
        'LIKEのワイルドカードはパラメータ側で付与します',
      ],
      estimatedMinutes: 15,
      // Mission format fields
      stepTitle: '実際にコードを修正せよ',
      stepContext: '最終ステップです。脆弱なコードを安全なコードにリファクタリングしてください。',
    },
  ];

  const currentItem = items[currentItemIndex];
  const progress = Math.round(((currentItemIndex + 1) / items.length) * 100);

  const getTypeLabel = (type: CurriculumItem['type']) => {
    switch (type) {
      case 'READING':
        return { label: '読み物', color: 'bg-blue-100 text-blue-700' };
      case 'EXERCISE':
        return { label: '演習', color: 'bg-green-100 text-green-700' };
      case 'QUIZ':
        return { label: 'クイズ', color: 'bg-purple-100 text-purple-700' };
      case 'DISCUSSION':
        return { label: 'ディスカッション', color: 'bg-orange-100 text-orange-700' };
    }
  };

  const typeInfo = getTypeLabel(currentItem.type);

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            戻る
          </Button>
          <div className="flex-1">
            {curriculum.displayFormat === 'MISSION' && curriculum.missionTitle ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">MISSION</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{curriculum.missionTitle}</h1>
                <p className="text-sm text-gray-500">{curriculum.category}</p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-gray-900">{curriculum.title}</h1>
                <p className="text-sm text-gray-500">{curriculum.category}</p>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                進捗: {currentItemIndex + 1} / {items.length} 項目
              </span>
              <span className="text-sm font-medium text-gray-900">{progress}%</span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between mt-3">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentItemIndex(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index === currentItemIndex
                      ? 'bg-blue-600 text-white'
                      : item.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {item.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}>
                  {typeInfo.label}
                </span>
                {curriculum.displayFormat === 'MISSION' && currentItem.stepTitle ? (
                  <div>
                    <span className="text-xs text-amber-600 font-bold">STEP {currentItem.order}</span>
                    <h2 className="text-lg font-semibold text-gray-900">{currentItem.stepTitle}</h2>
                  </div>
                ) : (
                  <h2 className="text-lg font-semibold text-gray-900">{currentItem.title}</h2>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>約{currentItem.estimatedMinutes}分</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-6">
            {/* Step Context (Mission Format) */}
            {curriculum.displayFormat === 'MISSION' && currentItem.stepContext && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">{currentItem.stepContext}</p>
                </div>
              </div>
            )}
            {/* Markdown Content */}
            <div className="prose prose-gray max-w-none mb-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: currentItem.content
                    .replace(
                      /```(\w+)?\n([\s\S]*?)```/g,
                      '<pre><code class="language-$1">$2</code></pre>'
                    )
                    .replace(/##\s(.+)/g, '<h2>$1</h2>')
                    .replace(/###\s(.+)/g, '<h3>$1</h3>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/---/g, '<hr/>'),
                }}
              />
            </div>

            {/* Exercise/Quiz Input Area */}
            {(currentItem.type === 'EXERCISE' || currentItem.type === 'QUIZ') && (
              <div className="border-t pt-6">
                {currentItem.type === 'EXERCISE' && currentItem.id === 'item_003' && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">
                      脆弱性のあるコードを選択してください（複数選択可）
                    </h3>
                    <div className="space-y-2">
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedOptions.includes(option)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedOptions.includes(option)}
                            onChange={() => handleOptionToggle(option)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="font-medium">コード {option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {currentItem.type === 'EXERCISE' && currentItem.id === 'item_005' && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">修正後のコードを入力してください</h3>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="// ここにコードを入力..."
                    />
                  </div>
                )}

                {currentItem.type === 'QUIZ' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900">問題1の回答</h3>
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <label
                          key={`q1_${option}`}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedOptions.includes(`q1_${option}`)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="q1"
                            checked={selectedOptions.includes(`q1_${option}`)}
                            onChange={() =>
                              setSelectedOptions((prev) => [
                                ...prev.filter((o) => !o.startsWith('q1_')),
                                `q1_${option}`,
                              ])
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900">問題2の回答</h3>
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <label
                          key={`q2_${option}`}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedOptions.includes(`q2_${option}`)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="q2"
                            checked={selectedOptions.includes(`q2_${option}`)}
                            onChange={() =>
                              setSelectedOptions((prev) => [
                                ...prev.filter((o) => !o.startsWith('q2_')),
                                `q2_${option}`,
                              ])
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hints */}
            {currentItem.hints && currentItem.hints.length > 0 && (
              <div className="border-t pt-4 mt-6">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>ヒントを{showHints ? '隠す' : '表示'}</span>
                  {showHints ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {showHints && (
                  <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <ul className="space-y-2">
                      {currentItem.hints.map((hint, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-yellow-800">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentItemIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentItemIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            前へ
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-1" />
              保存
            </Button>

            {currentItemIndex === items.length - 1 ? (
              <Button>
                <Send className="w-4 h-4 mr-1" />
                完了して提出
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentItemIndex((prev) => Math.min(items.length - 1, prev + 1))}
              >
                次へ
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
