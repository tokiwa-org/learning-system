import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Clock,
  PlayCircle,
  Target,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Layout } from './Layout';

interface MissionStep {
  id: string;
  itemNumber: number;
  title: string;
  stepTitle?: string;
  stepContext?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  estimatedMinutes: number;
}

interface MissionDetailData {
  id: string;
  title: string;
  missionTitle: string;
  missionSummary?: string;
  backgroundStory?: string;
  missionObjective?: string;
  category: string;
  progress: number;
  dueDate: string;
  totalItems: number;
  completedItems: number;
  steps: MissionStep[];
}

interface MissionDetailProps {
  mission?: MissionDetailData;
  onBack?: () => void;
  onStartStep?: (stepId: string) => void;
}

export const MissionDetail: React.FC<MissionDetailProps> = ({
  mission: propMission,
  onBack,
  onStartStep,
}) => {
  // Sample data for demonstration
  const defaultMission: MissionDetailData = {
    id: 'cur_001',
    title: 'セキュリティ基礎 - SQLインジェクション対策',
    missionTitle: 'SQLインジェクション攻撃を阻止せよ',
    missionSummary: '本番システムへの不審なアクセスを調査し、セキュリティ脆弱性を修正する',
    backgroundStory: 'あなたは中堅エンジニアとして、本番システムのセキュリティ強化プロジェクトにアサインされました。突然、セキュリティチームから緊急連絡が入りました。「不審なアクセスログを検出。SQLインジェクション攻撃の可能性がある。至急対応してほしい」',
    missionObjective: 'SQLインジェクションの仕組みを理解し、脆弱なコードを特定・修正できるようになる',
    category: '共通スキル',
    progress: 60,
    dueDate: '2025/09/30',
    totalItems: 5,
    completedItems: 2,
    steps: [
      {
        id: 'item_001',
        itemNumber: 1,
        title: 'SQLインジェクションとは',
        stepTitle: '攻撃の仕組みを理解せよ',
        stepContext: 'まず、敵を知ることから始めましょう。SQLインジェクション攻撃がどのように行われるか学びます。',
        status: 'COMPLETED',
        estimatedMinutes: 8,
      },
      {
        id: 'item_002',
        itemNumber: 2,
        title: '対策方法の理解',
        stepTitle: '対策方法を学べ',
        stepContext: '攻撃の仕組みを理解したら、次は守り方です。プリペアドステートメントなど対策方法を学びます。',
        status: 'COMPLETED',
        estimatedMinutes: 10,
      },
      {
        id: 'item_003',
        itemNumber: 3,
        title: '【演習】脆弱なコードを見つける',
        stepTitle: '脆弱なコードを特定せよ',
        stepContext: 'セキュリティチームから対象のコードが送られてきました。脆弱性があるコードを特定してください。',
        status: 'IN_PROGRESS',
        estimatedMinutes: 12,
      },
      {
        id: 'item_004',
        itemNumber: 4,
        title: '【クイズ】理解度確認',
        stepTitle: '知識を確認せよ',
        stepContext: '攻撃と対策の両方を理解しているか、クイズ形式でチェックします。',
        status: 'NOT_STARTED',
        estimatedMinutes: 8,
      },
      {
        id: 'item_005',
        itemNumber: 5,
        title: '【実践】リファクタリング演習',
        stepTitle: '実際にコードを修正せよ',
        stepContext: '最終ステップです。脆弱なコードを安全なコードにリファクタリングしてください。',
        status: 'NOT_STARTED',
        estimatedMinutes: 15,
      },
    ],
  };

  const mission = propMission || defaultMission;

  // Find the current step (first IN_PROGRESS or first NOT_STARTED)
  const currentStep = mission.steps.find(s => s.status === 'IN_PROGRESS')
    || mission.steps.find(s => s.status === 'NOT_STARTED');

  const getStepIcon = (status: MissionStep['status'], isCurrent: boolean) => {
    if (status === 'COMPLETED') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (status === 'IN_PROGRESS' || isCurrent) {
      return <PlayCircle className="w-5 h-5 text-amber-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getStepStatusLabel = (status: MissionStep['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-xs text-green-600 font-medium">完了</span>;
      case 'IN_PROGRESS':
        return <span className="text-xs text-amber-600 font-medium">進行中</span>;
      default:
        return <span className="text-xs text-gray-400">未着手</span>;
    }
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          戻る
        </Button>

        {/* Mission Header */}
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-amber-600" />
              <span className="text-sm font-bold text-amber-700 uppercase tracking-wider">MISSION</span>
            </div>

            <div className="border-b-2 border-amber-300 pb-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{mission.missionTitle}</h1>
            </div>

            {/* Mission Story */}
            {mission.backgroundStory && (
              <div className="bg-white/60 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">📜</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">ミッション概要</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{mission.backgroundStory}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mission Objective */}
            {mission.missionObjective && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4 mt-0.5 text-amber-600" />
                <span><span className="font-medium">目標:</span> {mission.missionObjective}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mission Steps */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <h2 className="font-semibold text-gray-900">ミッションステップ</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mission.steps.map((step, index) => {
                const isCurrent = currentStep?.id === step.id;
                const isLocked = step.status === 'NOT_STARTED' && !isCurrent;

                return (
                  <div
                    key={step.id}
                    className={`
                      flex items-start gap-4 p-4 rounded-lg border-2 transition-all
                      ${isCurrent
                        ? 'border-amber-300 bg-amber-50'
                        : step.status === 'COMPLETED'
                          ? 'border-green-200 bg-green-50/50'
                          : 'border-gray-200 bg-gray-50/50'
                      }
                    `}
                  >
                    {/* Step Indicator */}
                    <div className="flex flex-col items-center">
                      {getStepIcon(step.status, isCurrent)}
                      {index < mission.steps.length - 1 && (
                        <div className={`w-0.5 h-8 mt-2 ${
                          step.status === 'COMPLETED' ? 'bg-green-300' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-500">STEP {step.itemNumber}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-medium rounded">
                              現在
                            </span>
                          )}
                        </div>
                        {getStepStatusLabel(step.status)}
                      </div>

                      <h3 className={`font-semibold mb-1 ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                        {step.stepTitle || step.title}
                      </h3>

                      {step.stepContext && !isLocked && (
                        <p className="text-sm text-gray-600 mb-2">{step.stepContext}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          約{step.estimatedMinutes}分
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    {(isCurrent || step.status === 'COMPLETED') && (
                      <div className="flex-shrink-0">
                        {step.status === 'COMPLETED' ? (
                          <Button variant="ghost" size="sm" onClick={() => {
                            onStartStep?.(step.id);
                            window.location.hash = 'curriculum-book';
                          }}>
                            復習する
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700"
                            onClick={() => {
                              onStartStep?.(step.id);
                              window.location.hash = 'curriculum-book';
                            }}
                          >
                            挑戦する
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                STEP {mission.completedItems}/{mission.totalItems}
              </span>
              <span className="text-sm text-gray-500">{mission.progress}%</span>
            </div>
            <Progress value={mission.progress} className="h-3" />
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-gray-500">
                <Clock className="w-4 h-4 inline mr-1" />
                期限: {mission.dueDate}
              </div>
              {currentStep && (
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    onStartStep?.(currentStep.id);
                    window.location.hash = 'curriculum-book';
                  }}
                >
                  STEP {currentStep.itemNumber} に挑戦
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MissionDetail;
