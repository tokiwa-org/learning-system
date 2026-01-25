import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import {
  ArrowLeft,
  Save,
  Send,
  User,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  Star,
  CheckCircle,
  Target,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";

// 評価サイクルのステータス型
type CycleStatus =
  | 'REPORT_GENERATED'
  | 'MANAGER_EVALUATED'
  | 'MANAGER_APPROVED'
  | 'HR_APPROVED'
  | 'FINALIZED'
  | 'REJECTED';

// 評価ランク型
type EvaluationRank = 'S' | 'A' | 'B' | 'C' | 'D';

// 軸コード型
type AxisCode = 'SKILL' | 'COMPETENCY' | 'BEHAVIOR';

// ロードマップ項目達成状況
interface RoadmapItemDetail {
  id: string;
  number: number;
  name: string;
  axisCode: AxisCode;
  status: 'ACHIEVED' | 'IN_PROGRESS' | 'NOT_STARTED';
  curriculumCompletionRate?: number;
  scenarioScore?: number;
}

// 達成度レポート型
interface AchievementReport {
  id: string;
  cycleId: string;
  employeeId: string;
  employeeName: string;
  employeeGrade: string;
  employeeStep: number;
  baseSalary: number;
  gradeSalary: number;
  completionRate: number;
  totalItems: number;
  achievedItems: number;
  inProgressItems: number;
  strengths: string[];
  improvements: string[];
  skillScoreCalculated: number;
  skillItemsCount: number;
  skillAchievedCount: number;
  competencyScoreCalculated: number;
  competencyItemsCount: number;
  competencyAchievedCount: number;
  behaviorScoreCalculated: number;
  behaviorItemsCount: number;
  behaviorAchievedCount: number;
  totalScoreCalculated: number;
  suggestedRank: EvaluationRank;
  details: RoadmapItemDetail[];
}

export function ManagerEvaluation() {
  // 達成度レポートデータ（実際はAPIから取得）
  const achievementReport: AchievementReport = {
    id: "report-001",
    cycleId: "cycle-001",
    employeeId: "emp-001",
    employeeName: "山田 太郎",
    employeeGrade: "L2",
    employeeStep: 3,
    baseSalary: 300000,
    gradeSalary: 50000,
    completionRate: 0.55,
    totalItems: 82,
    achievedItems: 45,
    inProgressItems: 12,
    strengths: [
      "セキュリティ基礎",
      "モダンJavaScript基礎",
      "Gitワークフロー",
      "コードレビュー実践",
      "チーム内コミュニケーション",
    ],
    improvements: [
      "レガシーコードリファクタリング",
      "要件定義の実践",
      "プロジェクト管理基礎",
      "顧客折衝スキル",
    ],
    skillScoreCalculated: 27.5,
    skillItemsCount: 46,
    skillAchievedCount: 25,
    competencyScoreCalculated: 16.5,
    competencyItemsCount: 22,
    competencyAchievedCount: 12,
    behaviorScoreCalculated: 12.0,
    behaviorItemsCount: 14,
    behaviorAchievedCount: 8,
    totalScoreCalculated: 56.0,
    suggestedRank: "C",
    details: [
      { id: "1", number: 1, name: "セキュリティ基礎", axisCode: "SKILL", status: "ACHIEVED", curriculumCompletionRate: 1.0 },
      { id: "2", number: 2, name: "モダンJavaScript基礎", axisCode: "SKILL", status: "ACHIEVED", curriculumCompletionRate: 1.0 },
      { id: "3", number: 3, name: "レガシーコードリファクタリング", axisCode: "SKILL", status: "IN_PROGRESS", curriculumCompletionRate: 0.6 },
      { id: "52", number: 52, name: "要件定義の実践", axisCode: "COMPETENCY", status: "NOT_STARTED", scenarioScore: 2.5 },
      { id: "74", number: 74, name: "チーム内コミュニケーション", axisCode: "BEHAVIOR", status: "ACHIEVED" },
    ],
  };

  // 部下情報
  const subordinate = {
    id: achievementReport.employeeId,
    name: achievementReport.employeeName,
    employeeId: "EMP001",
    department: "開発部",
    position: "シニアエンジニア",
    grade: achievementReport.employeeGrade,
    step: achievementReport.employeeStep,
    avatar: "YT",
  };

  // スコア調整の状態
  const [adjustedScores, setAdjustedScores] = useState({
    skillScore: achievementReport.skillScoreCalculated,
    competencyScore: achievementReport.competencyScoreCalculated,
    behaviorScore: achievementReport.behaviorScoreCalculated,
  });

  const [managerComment, setManagerComment] = useState("");
  const [strengthsComment, setStrengthsComment] = useState("");
  const [improvementsComment, setImprovementsComment] = useState("");
  const [finalRank, setFinalRank] = useState<EvaluationRank>(achievementReport.suggestedRank);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    skill: false,
    competency: false,
    behavior: false,
  });

  const totalAdjustedScore = adjustedScores.skillScore + adjustedScores.competencyScore + adjustedScores.behaviorScore;

  const handleScoreChange = (axis: 'skillScore' | 'competencyScore' | 'behaviorScore', value: number) => {
    const maxScores = { skillScore: 50, competencyScore: 30, behaviorScore: 20 };
    const clampedValue = Math.max(0, Math.min(maxScores[axis], value));
    setAdjustedScores((prev) => ({ ...prev, [axis]: clampedValue }));
  };

  const handleSaveDraft = () => {
    alert("下書きを保存しました");
  };

  const handleSubmit = () => {
    if (!managerComment || !strengthsComment || !improvementsComment) {
      alert("すべてのコメント欄を入力してください");
      return;
    }
    alert("評価を提出しました");
    window.location.hash = "manager-dashboard";
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getRankColor = (rank: EvaluationRank): string => {
    switch (rank) {
      case 'S': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'A': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'B': return 'bg-green-100 text-green-700 border-green-300';
      case 'C': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'D': return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACHIEVED':
        return <Badge variant="success" className="text-xs">達成</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning" className="text-xs">進行中</Badge>;
      default:
        return <Badge variant="gray" className="text-xs">未着手</Badge>;
    }
  };

  const getAxisName = (axis: AxisCode): string => {
    switch (axis) {
      case 'SKILL': return 'スキル習得度';
      case 'COMPETENCY': return '職能発揮力';
      case 'BEHAVIOR': return '行動・貢献';
    }
  };

  const renderRoadmapItems = (axisCode: AxisCode) => {
    const items = achievementReport.details.filter(d => d.axisCode === axisCode);
    return (
      <div className="space-y-2 mt-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">No.{item.number}</span>
              <span className="text-sm text-gray-900">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.curriculumCompletionRate !== undefined && (
                <span className="text-xs text-gray-500">
                  学習: {Math.round(item.curriculumCompletionRate * 100)}%
                </span>
              )}
              {item.scenarioScore !== undefined && (
                <span className="text-xs text-gray-500">
                  シナリオ: {item.scenarioScore.toFixed(1)}
                </span>
              )}
              {getStatusBadge(item.status)}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500 py-2">該当する項目がありません</p>
        )}
      </div>
    );
  };

  return (
    <Layout userRole="manager">
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => (window.location.hash = "manager-dashboard")}>
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">達成度レポート評価</h1>
            <p className="text-gray-600">自動生成されたレポートを確認し、評価を入力してください</p>
          </div>
        </div>

        {/* 部下情報カード */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-[#1971c2]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#1971c2] text-white flex items-center justify-center text-2xl font-bold">
                  {subordinate.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{subordinate.name}</h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>社員ID: {subordinate.employeeId}</p>
                    <p>{subordinate.department} / {subordinate.position}</p>
                    <p>職級: {subordinate.grade} / 号俸: {subordinate.step}</p>
                  </div>
                </div>
              </div>
              <Badge variant="info" className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                レポート自動生成済み
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 達成状況サマリー */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">ロードマップ達成状況</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">総合達成率</p>
                <p className="text-3xl font-bold text-blue-700">
                  {Math.round(achievementReport.completionRate * 100)}%
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">達成項目</p>
                <p className="text-3xl font-bold text-green-700">
                  {achievementReport.achievedItems}/{achievementReport.totalItems}
                </p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">進行中</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {achievementReport.inProgressItems}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">推奨ランク</p>
                <p className={`text-3xl font-bold ${getRankColor(achievementReport.suggestedRank).split(' ')[1]}`}>
                  {achievementReport.suggestedRank}
                </p>
              </div>
            </div>

            {/* 強み・改善点 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  強み（達成項目）
                </h4>
                <ul className="space-y-1">
                  {achievementReport.strengths.slice(0, 5).map((item, i) => (
                    <li key={i} className="text-sm text-green-700">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  課題（未達成項目）
                </h4>
                <ul className="space-y-1">
                  {achievementReport.improvements.slice(0, 5).map((item, i) => (
                    <li key={i} className="text-sm text-orange-700">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* スコア詳細・調整 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">スコア評価・調整</h2>
            </div>
            <p className="text-sm text-gray-600">自動計算されたスコアを確認し、必要に応じて調整してください</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* スキル習得度 (50点) */}
            <div className="border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => toggleSection('skill')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">スキル習得度（No.1-46）</h3>
                    <p className="text-sm text-gray-500">
                      達成: {achievementReport.skillAchievedCount}/{achievementReport.skillItemsCount}項目
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">配点: 50点</p>
                    <p className="text-lg font-bold text-blue-600">
                      {achievementReport.skillScoreCalculated.toFixed(1)}点
                    </p>
                  </div>
                  {expandedSections.skill ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              {expandedSections.skill && renderRoadmapItems('SKILL')}
              <div className="mt-4 pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  調整後スコア（0-50点）
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    step={0.5}
                    value={adjustedScores.skillScore}
                    onChange={(e) => handleScoreChange('skillScore', parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">
                    / 50点 （自動計算: {achievementReport.skillScoreCalculated.toFixed(1)}点）
                  </span>
                </div>
              </div>
            </div>

            {/* 職能発揮力 (30点) */}
            <div className="border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => toggleSection('competency')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">職能発揮力（No.52-73）</h3>
                    <p className="text-sm text-gray-500">
                      達成: {achievementReport.competencyAchievedCount}/{achievementReport.competencyItemsCount}項目
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">配点: 30点</p>
                    <p className="text-lg font-bold text-green-600">
                      {achievementReport.competencyScoreCalculated.toFixed(1)}点
                    </p>
                  </div>
                  {expandedSections.competency ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              {expandedSections.competency && renderRoadmapItems('COMPETENCY')}
              <div className="mt-4 pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  調整後スコア（0-30点）
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    step={0.5}
                    value={adjustedScores.competencyScore}
                    onChange={(e) => handleScoreChange('competencyScore', parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">
                    / 30点 （自動計算: {achievementReport.competencyScoreCalculated.toFixed(1)}点）
                  </span>
                </div>
              </div>
            </div>

            {/* 行動・貢献 (20点) */}
            <div className="border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => toggleSection('behavior')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">行動・貢献（No.74-82）</h3>
                    <p className="text-sm text-gray-500">
                      達成: {achievementReport.behaviorAchievedCount}/{achievementReport.behaviorItemsCount}項目
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">配点: 20点</p>
                    <p className="text-lg font-bold text-purple-600">
                      {achievementReport.behaviorScoreCalculated.toFixed(1)}点
                    </p>
                  </div>
                  {expandedSections.behavior ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              {expandedSections.behavior && renderRoadmapItems('BEHAVIOR')}
              <div className="mt-4 pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  調整後スコア（0-20点）
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    step={0.5}
                    value={adjustedScores.behaviorScore}
                    onChange={(e) => handleScoreChange('behaviorScore', parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">
                    / 20点 （自動計算: {achievementReport.behaviorScoreCalculated.toFixed(1)}点）
                  </span>
                </div>
              </div>
            </div>

            {/* 合計スコア・ランク */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">合計スコア</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{totalAdjustedScore.toFixed(1)}</span>
                    <span className="text-lg text-gray-500">/ 100点</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    自動計算: {achievementReport.totalScoreCalculated.toFixed(1)}点
                    {totalAdjustedScore !== achievementReport.totalScoreCalculated && (
                      <span className={totalAdjustedScore > achievementReport.totalScoreCalculated ? "text-green-600" : "text-red-600"}>
                        {" "}({totalAdjustedScore > achievementReport.totalScoreCalculated ? "+" : ""}{(totalAdjustedScore - achievementReport.totalScoreCalculated).toFixed(1)})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">最終評価ランク</p>
                  <div className="flex items-center gap-3">
                    {(['S', 'A', 'B', 'C', 'D'] as EvaluationRank[]).map((rank) => (
                      <button
                        key={rank}
                        onClick={() => setFinalRank(rank)}
                        className={`w-12 h-12 rounded-lg font-bold text-xl border-2 transition-all ${
                          finalRank === rank
                            ? getRankColor(rank)
                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {rank}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    推奨ランク: {achievementReport.suggestedRank}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 上司コメント */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">評価コメント</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                総合コメント <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="今期の総合的な評価を記入してください"
                value={managerComment}
                onChange={(e) => setManagerComment(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                強み・良かった点 <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="特に優れていた点や強みを記入してください"
                value={strengthsComment}
                onChange={(e) => setStrengthsComment(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                改善点・今後の期待 <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="改善が必要な点や今後期待することを記入してください"
                value={improvementsComment}
                onChange={(e) => setImprovementsComment(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-6 sticky bottom-0 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>すべてのコメント欄を入力してください</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4" />
              下書き保存
            </Button>
            <Button onClick={handleSubmit}>
              <Send className="w-4 h-4" />
              評価を提出
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
