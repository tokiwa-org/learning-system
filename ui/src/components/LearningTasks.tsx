import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  Filter,
  ArrowRight,
  Calendar,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Layout } from './Layout';

type CurriculumStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
type FilterType = 'ALL' | CurriculumStatus;
type DisplayFormat = 'STANDARD' | 'MISSION';

interface Curriculum {
  id: string;
  title: string;
  description: string;
  status: CurriculumStatus;
  progress: number;
  dueDate: string;
  category: string;
  difficulty: number;
  estimatedMinutes: number;
  completedItems: number;
  totalItems: number;
  assignedAt: string;
  completedAt?: string;
  // Mission format fields
  displayFormat: DisplayFormat;
  missionTitle?: string;
  missionSummary?: string;
  backgroundStory?: string;
  currentStepTitle?: string;
  currentStepNumber?: number;
}

export const LearningTasks: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('ALL');

  const curriculums: Curriculum[] = [
    {
      id: 'cur_001',
      title: 'セキュリティ基礎 - SQLインジェクション対策',
      description:
        'Webアプリケーションにおけるセキュリティの基礎を学び、SQLインジェクション脆弱性の識別と対策を習得します。',
      status: 'IN_PROGRESS',
      progress: 60,
      dueDate: '2025/09/30',
      category: '共通スキル',
      difficulty: 2,
      estimatedMinutes: 45,
      completedItems: 3,
      totalItems: 5,
      assignedAt: '2025/09/01',
      // Mission format
      displayFormat: 'MISSION',
      missionTitle: 'SQLインジェクション攻撃を阻止せよ',
      missionSummary: '本番システムで不審なアクセスログを検出。セキュリティチームからの緊急依頼が入った...',
      backgroundStory: 'あなたは中堅エンジニアとして、本番システムのセキュリティ強化プロジェクトにアサインされました。突然、セキュリティチームから緊急連絡が入りました。',
      currentStepTitle: '脆弱なコードを特定せよ',
      currentStepNumber: 3,
    },
    {
      id: 'cur_002',
      title: 'レガシーコードリファクタリング',
      description:
        '保守性の低いコードを改善するためのリファクタリング手法を学びます。実際のコード例を通じて実践的なスキルを身につけます。',
      status: 'NOT_STARTED',
      progress: 0,
      dueDate: '2025/10/15',
      category: '技術スキル',
      difficulty: 3,
      estimatedMinutes: 60,
      completedItems: 0,
      totalItems: 6,
      assignedAt: '2025/09/10',
      // Mission format
      displayFormat: 'MISSION',
      missionTitle: '10年前のコードを復活させよ',
      missionSummary: '顧客から「古いシステムを延命したい」という依頼。技術的負債と戦う時が来た...',
      backgroundStory: '社内で最も古いシステムの担当になったあなた。10年前に退職したエンジニアが残したコードは、誰も触れたがらない「触れてはいけないコード」として恐れられていた。',
      currentStepTitle: 'レガシーコードの特徴を把握せよ',
      currentStepNumber: 1,
    },
    {
      id: 'cur_003',
      title: '要件定義の実践 - 曖昧な要望からの仕様抽出',
      description:
        '顧客の曖昧な要望から具体的な仕様を抽出する手法を学びます。矛盾や不足のある要件を見抜く力を養います。',
      status: 'NOT_STARTED',
      progress: 0,
      dueDate: '2025/10/31',
      category: 'ビジネススキル',
      difficulty: 4,
      estimatedMinutes: 90,
      completedItems: 0,
      totalItems: 8,
      assignedAt: '2025/09/15',
      // Mission format
      displayFormat: 'MISSION',
      missionTitle: '矛盾だらけの要件を解き明かせ',
      missionSummary: 'クライアントの言うことが毎回変わる...この混乱した要件を整理して仕様に落とし込め',
      backgroundStory: '新規プロジェクトの要件定義を任されたあなた。しかしクライアントの担当者は、会議のたびに違うことを言い、関係者間でも意見が対立している。',
      currentStepTitle: 'ステークホルダーを特定せよ',
      currentStepNumber: 1,
    },
    {
      id: 'cur_004',
      title: 'モダンJavaScript基礎',
      description:
        'ES6以降のモダンなJavaScriptの文法と概念を学びます。古い書き方と新しい書き方の違いを識別できるようになります。',
      status: 'COMPLETED',
      progress: 100,
      dueDate: '2025/08/31',
      category: '技術スキル',
      difficulty: 2,
      estimatedMinutes: 40,
      completedItems: 4,
      totalItems: 4,
      assignedAt: '2025/08/01',
      completedAt: '2025/08/25',
      // Standard format (completed)
      displayFormat: 'STANDARD',
    },
    {
      id: 'cur_005',
      title: 'コードレビューの基本',
      description:
        '効果的なコードレビューの方法を学びます。レビューで見るべきポイントとフィードバックの伝え方を習得します。',
      status: 'COMPLETED',
      progress: 100,
      dueDate: '2025/08/15',
      category: '共通スキル',
      difficulty: 2,
      estimatedMinutes: 30,
      completedItems: 3,
      totalItems: 3,
      assignedAt: '2025/07/20',
      completedAt: '2025/08/10',
      // Standard format (completed)
      displayFormat: 'STANDARD',
    },
  ];

  const filteredCurriculums = curriculums.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  const stats = {
    total: curriculums.length,
    completed: curriculums.filter((c) => c.status === 'COMPLETED').length,
    inProgress: curriculums.filter((c) => c.status === 'IN_PROGRESS').length,
    notStarted: curriculums.filter((c) => c.status === 'NOT_STARTED').length,
  };

  const getStatusBadge = (status: CurriculumStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            完了
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <PlayCircle className="w-3 h-3" />
            実行中
          </Badge>
        );
      default:
        return (
          <Badge variant="gray" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            未実施
          </Badge>
        );
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-gray-700" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">マイ学習課題</h1>
              <p className="text-gray-600">2025年度に割り当てられた学習学習課題</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Target className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">総学習課題</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
                  <p className="text-sm text-green-600">完了</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-200 rounded-lg">
                  <PlayCircle className="w-5 h-5 text-yellow-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700">{stats.inProgress}</p>
                  <p className="text-sm text-yellow-600">実行中</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">{stats.notStarted}</p>
                  <p className="text-sm text-gray-600">未実施</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 mr-2">フィルター:</span>
              {(['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as FilterType[]).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === 'ALL' && 'すべて'}
                  {f === 'NOT_STARTED' && '未実施'}
                  {f === 'IN_PROGRESS' && '実行中'}
                  {f === 'COMPLETED' && '完了'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Curriculum List */}
        <div className="space-y-4">
          {filteredCurriculums.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">該当する学習課題がありません</p>
              </CardContent>
            </Card>
          ) : (
            filteredCurriculums.map((curriculum) => (
              curriculum.displayFormat === 'MISSION' && curriculum.missionTitle ? (
                // Mission format card
                <Card key={curriculum.id} className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg transition-all">
                  <CardContent className="py-5">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Mission Info */}
                      <div className="flex-1">
                        {/* Mission Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-amber-600" />
                          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">MISSION</span>
                          <span className="text-sm text-gray-500">{curriculum.category}</span>
                        </div>

                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {curriculum.missionTitle}
                          </h3>
                          {getStatusBadge(curriculum.status)}
                        </div>

                        {/* Mission Summary */}
                        {curriculum.missionSummary && (
                          <div className="flex items-start gap-2 mb-4 text-sm text-gray-600">
                            <span className="text-base flex-shrink-0">📖</span>
                            <p>{curriculum.missionSummary}</p>
                          </div>
                        )}

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">
                              STEP {curriculum.completedItems + (curriculum.status === 'IN_PROGRESS' ? 1 : 0)}/{curriculum.totalItems}
                            </span>
                            <span className="font-medium text-gray-900">{curriculum.progress}%</span>
                          </div>
                          <Progress value={curriculum.progress} />
                        </div>

                        {/* Current Step */}
                        {curriculum.currentStepTitle && curriculum.status !== 'COMPLETED' && (
                          <div className="flex items-center gap-2 mb-3 text-sm">
                            <Target className="w-4 h-4 text-amber-600" />
                            <span className="text-gray-700">現在: <span className="font-medium">{curriculum.currentStepTitle}</span></span>
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>約{curriculum.estimatedMinutes}分</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>期限: {curriculum.dueDate}</span>
                          </div>
                          {curriculum.completedAt && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Trophy className="w-4 h-4" />
                              <span>完了: {curriculum.completedAt}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="lg:ml-4 flex-shrink-0">
                        {curriculum.status === 'COMPLETED' ? (
                          <Button variant="outline" size="sm" onClick={() => window.location.hash = 'curriculum-book'}>
                            結果を確認
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        ) : (
                          <Button
                            variant={curriculum.status === 'IN_PROGRESS' ? 'default' : 'outline'}
                            size="sm"
                            className={curriculum.status === 'IN_PROGRESS' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                            onClick={() => window.location.hash = 'curriculum-book'}
                          >
                            {curriculum.status === 'IN_PROGRESS' ? '続きから挑戦' : 'ミッション開始'}
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Standard format card
                <Card key={curriculum.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-5">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {curriculum.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-gray-500">{curriculum.category}</span>
                              <span className="text-sm text-yellow-600">
                                {getDifficultyStars(curriculum.difficulty)}
                              </span>
                            </div>
                          </div>
                          {getStatusBadge(curriculum.status)}
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{curriculum.description}</p>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              進捗: {curriculum.completedItems}/{curriculum.totalItems} 項目
                            </span>
                            <span className="font-medium text-gray-900">{curriculum.progress}%</span>
                          </div>
                          <Progress value={curriculum.progress} />
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>約{curriculum.estimatedMinutes}分</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>期限: {curriculum.dueDate}</span>
                          </div>
                          {curriculum.completedAt && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Trophy className="w-4 h-4" />
                              <span>完了: {curriculum.completedAt}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="lg:ml-4">
                        {curriculum.status === 'COMPLETED' ? (
                          <Button variant="outline" size="sm" onClick={() => window.location.hash = 'curriculum-book'}>
                            結果を確認
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        ) : (
                          <Button
                            variant={curriculum.status === 'IN_PROGRESS' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => window.location.hash = 'curriculum-book'}
                          >
                            {curriculum.status === 'IN_PROGRESS' ? '続きから学習' : '学習を開始'}
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};
