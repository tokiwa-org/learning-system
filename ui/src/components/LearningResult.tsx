import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Layout } from './Layout';

interface NoiseElement {
  id: string;
  type: string;
  description: string;
  location: string;
  correctInfo: string;
  identified: boolean;
}

interface ItemResult {
  id: string;
  title: string;
  type: 'READING' | 'EXERCISE' | 'QUIZ' | 'DISCUSSION';
  score: number;
  maxScore: number;
  timeSpent: number;
  noiseElements: NoiseElement[];
}

export const LearningResult: React.FC = () => {
  const result = {
    curriculumId: 'cur_001',
    title: 'セキュリティ基礎 - SQLインジェクション対策',
    category: '共通スキル',
    completedAt: '2025/09/25 14:30',
    totalScore: 85,
    maxScore: 100,
    timeSpent: 52, // minutes
    estimatedMinutes: 45,
    noiseIdentificationRate: 75,
    rank: 'A',
    itemResults: [
      {
        id: 'item_001',
        title: 'SQLインジェクションとは',
        type: 'READING' as const,
        score: 10,
        maxScore: 10,
        timeSpent: 7,
        noiseElements: [],
      },
      {
        id: 'item_002',
        title: '対策方法の理解',
        type: 'READING' as const,
        score: 10,
        maxScore: 10,
        timeSpent: 9,
        noiseElements: [],
      },
      {
        id: 'item_003',
        title: '【演習】脆弱なコードを見つける',
        type: 'EXERCISE' as const,
        score: 25,
        maxScore: 30,
        timeSpent: 15,
        noiseElements: [
          {
            id: 'noise_001',
            type: 'SEARCH_POLLUTION',
            description: 'エスケープ処理だけで十分という古い情報',
            location: 'コードCの解説部分',
            correctInfo: 'エスケープ処理は不完全な対策。プリペアドステートメントを使用すべき。',
            identified: true,
          },
          {
            id: 'noise_002',
            type: 'TECHNICAL_DEBT',
            description: 'テンプレートリテラルでの変数埋め込み',
            location: 'コードAの例',
            correctInfo: 'テンプレートリテラルでも文字列結合と同様に危険。パラメータ化が必要。',
            identified: true,
          },
        ],
      },
      {
        id: 'item_004',
        title: '【クイズ】理解度確認',
        type: 'QUIZ' as const,
        score: 20,
        maxScore: 20,
        timeSpent: 8,
        noiseElements: [],
      },
      {
        id: 'item_005',
        title: '【実践】リファクタリング演習',
        type: 'EXERCISE' as const,
        score: 20,
        maxScore: 30,
        timeSpent: 18,
        noiseElements: [
          {
            id: 'noise_003',
            type: 'INCOMPLETE_INFO',
            description: 'LIKEクエリのワイルドカード処理の省略',
            location: 'searchProducts関数の説明',
            correctInfo: 'ワイルドカード(%)はパラメータ値側で付与し、クエリ自体には含めない。',
            identified: false,
          },
        ],
      },
    ] as ItemResult[],
    recommendations: [
      'LIKEクエリにおけるワイルドカードの安全な扱いについて追加学習を推奨',
      '実際のプロジェクトでプリペアドステートメントの使用状況を確認してみましょう',
      '次のカリキュラム「XSS対策の基礎」への進行を推奨',
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRankBadge = (rank: string) => {
    const colors: Record<string, string> = {
      S: 'bg-purple-100 text-purple-700 border-purple-300',
      A: 'bg-green-100 text-green-700 border-green-300',
      B: 'bg-blue-100 text-blue-700 border-blue-300',
      C: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      D: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[rank] || colors.C;
  };

  const totalNoiseCount = result.itemResults.reduce(
    (sum, item) => sum + item.noiseElements.length,
    0
  );
  const identifiedNoiseCount = result.itemResults.reduce(
    (sum, item) => sum + item.noiseElements.filter((n) => n.identified).length,
    0
  );

  return (
    <Layout userRole="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            カリキュラム一覧へ
          </Button>
        </div>

        {/* Result Summary Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="py-8">
            <div className="text-center mb-6">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">カリキュラム完了！</h1>
              <p className="text-gray-600">{result.title}</p>
              <p className="text-sm text-gray-500 mt-1">完了日時: {result.completedAt}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(result.totalScore)}`}>
                  {result.totalScore}
                </div>
                <div className="text-sm text-gray-500">/ {result.maxScore}点</div>
                <div className="text-sm font-medium text-gray-700 mt-1">総合スコア</div>
              </div>

              <div className="text-center">
                <div
                  className={`inline-block px-4 py-2 rounded-lg border text-2xl font-bold ${getRankBadge(
                    result.rank
                  )}`}
                >
                  {result.rank}
                </div>
                <div className="text-sm font-medium text-gray-700 mt-2">ランク</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-gray-700">
                  {result.noiseIdentificationRate}%
                </div>
                <div className="text-sm text-gray-500">
                  {identifiedNoiseCount}/{totalNoiseCount}件
                </div>
                <div className="text-sm font-medium text-gray-700 mt-1">ノイズ識別率</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-gray-700">{result.timeSpent}</div>
                <div className="text-sm text-gray-500">/ 想定{result.estimatedMinutes}分</div>
                <div className="text-sm font-medium text-gray-700 mt-1">所要時間</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Results */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              項目別結果
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.itemResults.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="gray" className="text-xs">
                            {item.type === 'READING' && '読み物'}
                            {item.type === 'EXERCISE' && '演習'}
                            {item.type === 'QUIZ' && 'クイズ'}
                            {item.type === 'DISCUSSION' && 'ディスカッション'}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.timeSpent}分
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${getScoreColor((item.score / item.maxScore) * 100)}`}
                      >
                        {item.score}/{item.maxScore}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((item.score / item.maxScore) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Progress bar for score */}
                  <Progress value={(item.score / item.maxScore) * 100} className="h-2 mb-3" />

                  {/* Noise Elements */}
                  {item.noiseElements.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        この項目のノイズ要素
                      </h4>
                      <div className="space-y-2">
                        {item.noiseElements.map((noise) => (
                          <div
                            key={noise.id}
                            className={`p-3 rounded-lg text-sm ${
                              noise.identified
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {noise.identified ? (
                                <Eye className="w-4 h-4 text-green-600 mt-0.5" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-red-600 mt-0.5" />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {noise.identified ? '識別できました' : '見逃しました'}
                                  </span>
                                  <Badge
                                    variant={noise.identified ? 'success' : 'destructive'}
                                    className="text-xs"
                                  >
                                    {noise.type}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 mt-1">{noise.description}</p>
                                <p className="text-gray-500 mt-1">
                                  <span className="font-medium">正解:</span> {noise.correctInfo}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              今後の学習推奨
            </h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline">
            <BookOpen className="w-4 h-4 mr-1" />
            もう一度学習する
          </Button>
          <Button>次のカリキュラムへ</Button>
        </div>
      </div>
    </Layout>
  );
};
