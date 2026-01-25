import React from 'react';
import { ArrowRight, BookOpen, CheckCircle, PlayCircle, Target, TrendingUp, ClipboardList, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Layout } from './Layout';
import { MissionCard } from './MissionCard';
import type { MissionCurriculum } from './MissionCard';

// 評価サイクルのステータス型
type CycleStatus =
  | 'REPORT_GENERATED'
  | 'MANAGER_EVALUATED'
  | 'MANAGER_APPROVED'
  | 'HR_APPROVED'
  | 'FINALIZED'
  | 'REJECTED';

export const Dashboard: React.FC = () => {
  // 評価サイクル情報（実際はAPIから取得）
  const evaluationCycle = {
    id: 'cycle-001',
    periodName: '2025年度 上期評価',
    status: 'MANAGER_EVALUATED' as CycleStatus,
    // FINALIZEDの場合のみ表示される情報
    finalScore: 78.5,
    finalRank: 'B' as const,
  };

  const getEvaluationStatusMessage = (status: CycleStatus): { message: string; description: string } => {
    switch (status) {
      case 'REPORT_GENERATED':
        return { message: '評価準備中', description: '上司による評価を待っています' };
      case 'MANAGER_EVALUATED':
        return { message: '上司評価完了', description: '承認プロセスを進行中です' };
      case 'MANAGER_APPROVED':
        return { message: '上司承認済み', description: 'HR承認を待っています' };
      case 'HR_APPROVED':
        return { message: 'HR承認済み', description: '最終確定を待っています' };
      case 'FINALIZED':
        return { message: '評価確定', description: '評価結果が確定しました' };
      case 'REJECTED':
        return { message: '差戻し', description: '評価が差し戻されました' };
      default:
        return { message: '不明', description: '' };
    }
  };

  const getRankColor = (rank: string): string => {
    switch (rank) {
      case 'S': return 'text-purple-700 bg-purple-100';
      case 'A': return 'text-blue-700 bg-blue-100';
      case 'B': return 'text-green-700 bg-green-100';
      case 'C': return 'text-yellow-700 bg-yellow-100';
      case 'D': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const notifications = [
    { id: 1, date: '9/1', message: '新しい学習課題「セキュリティ基礎」が割り当てられました' },
    { id: 2, date: '8/25', message: '学習課題「モダンJavaScript基礎」を完了しました' },
    { id: 3, date: '8/15', message: '2025年度の評価期間が設定されました' },
  ];

  const curriculums: MissionCurriculum[] = [
    {
      id: 'cur_001',
      title: 'セキュリティ基礎',
      status: 'IN_PROGRESS',
      progress: 60,
      dueDate: '9/30',
      category: '共通スキル',
      totalItems: 5,
      completedItems: 2,
      // Mission format fields
      displayFormat: 'MISSION',
      missionTitle: 'SQLインジェクション攻撃を阻止せよ',
      missionSummary: '本番システムで不審なアクセスログを検出。セキュリティチームからの緊急依頼が入った...',
      currentStepTitle: '脆弱なコードを特定せよ',
      currentStepNumber: 3,
    },
    {
      id: 'cur_002',
      title: 'レガシーコードリファクタリング',
      status: 'NOT_STARTED',
      progress: 0,
      dueDate: '10/15',
      category: '技術スキル',
      totalItems: 6,
      completedItems: 0,
      // Mission format fields
      displayFormat: 'MISSION',
      missionTitle: '10年前のコードを復活させよ',
      missionSummary: '顧客から「古いシステムを延命したい」という依頼。技術的負債と戦う時が来た...',
      currentStepTitle: 'レガシーコードの特徴を把握せよ',
      currentStepNumber: 1,
    },
    {
      id: 'cur_003',
      title: '要件定義の実践',
      status: 'NOT_STARTED',
      progress: 0,
      dueDate: '10/31',
      category: 'ビジネススキル',
      totalItems: 8,
      completedItems: 0,
      // Standard format (for comparison)
      displayFormat: 'STANDARD',
    },
  ];

  const skillSummary = {
    totalItems: 82,
    completed: 45,
    inProgress: 12,
    notStarted: 25,
    overallProgress: 55,
    categories: [
      { name: '共通スキル', progress: 70, color: 'bg-blue-500' },
      { name: '技術スキル', progress: 50, color: 'bg-green-500' },
      { name: 'ビジネススキル', progress: 40, color: 'bg-purple-500' },
      { name: '行動・貢献', progress: 60, color: 'bg-orange-500' },
    ],
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">おかえりなさい、田中さん</h1>
            <p className="text-gray-600 mt-1">今日も学習を進めましょう</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">2025年度</p>
            <p className="text-lg font-semibold text-gray-900">L2 Mid-level</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Target className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{skillSummary.overallProgress}%</p>
                  <p className="text-sm text-blue-600">総合習得率</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{skillSummary.completed}</p>
                  <p className="text-sm text-green-600">習得済み項目</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-200 rounded-lg">
                  <PlayCircle className="w-5 h-5 text-yellow-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700">{curriculums.filter(c => c.status !== 'COMPLETED').length}</p>
                  <p className="text-sm text-yellow-600">学習中学習課題</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">+8</p>
                  <p className="text-sm text-purple-600">今月の習得数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Status Card */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">{evaluationCycle.periodName}</h3>
            </div>
            <Badge variant={evaluationCycle.status === 'FINALIZED' ? 'success' : 'warning'}>
              {getEvaluationStatusMessage(evaluationCycle.status).message}
            </Badge>
          </CardHeader>
          <CardContent>
            {evaluationCycle.status === 'FINALIZED' ? (
              // 確定済み：結果を表示
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">あなたの評価結果</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">{evaluationCycle.finalScore}</span>
                      <span className="text-sm text-gray-500 ml-1">点</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-lg font-bold ${getRankColor(evaluationCycle.finalRank)}`}>
                      {evaluationCycle.finalRank}ランク
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  詳細を見る
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ) : (
              // 未確定：進行中メッセージを表示
              <div className="flex items-center gap-4 py-2">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">評価プロセス進行中</p>
                  <p className="text-sm text-gray-500">{getEvaluationStatusMessage(evaluationCycle.status).description}</p>
                  <p className="text-xs text-gray-400 mt-1">評価結果は確定後に閲覧できます</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Curriculums */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">今すぐやるべき学習課題</h3>
              </div>
              <a href="#learning-tasks" className="text-sm text-gray-900 hover:text-gray-700 flex items-center gap-1">
                すべて見る
                <ArrowRight className="w-4 h-4" />
              </a>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {curriculums.filter(c => c.status !== 'COMPLETED').slice(0, 3).map((curriculum) => (
                  <MissionCard
                    key={curriculum.id}
                    curriculum={curriculum}
                    compact
                    onContinue={() => window.location.hash = 'curriculum-book'}
                    onViewDetail={() => window.location.hash = 'curriculum-book'}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">スキル習得状況</h3>
              </div>
              <a href="#skill-map" className="text-sm text-gray-900 hover:text-gray-700 flex items-center gap-1">
                詳細を見る
                <ArrowRight className="w-4 h-4" />
              </a>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillSummary.categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm text-gray-500">{category.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${category.color}`}
                        style={{ width: `${category.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">L2昇格に必要な項目</span>
                  <span className="font-semibold text-gray-900">45/60 達成</span>
                </div>
                <Progress value={75} className="mt-2" />
                <p className="text-xs text-gray-500 mt-2">あと15項目で次の等級へ昇格可能です</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="font-semibold text-gray-900">最新のお知らせ</h3>
            <a
              href="#notifications"
              className="text-sm text-gray-900 hover:text-gray-700 flex items-center gap-1"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </a>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li key={notification.id} className="flex gap-3 py-2">
                  <span className="text-sm text-gray-500 font-medium min-w-[3rem]">
                    {notification.date}
                  </span>
                  <p className="text-gray-900">{notification.message}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
