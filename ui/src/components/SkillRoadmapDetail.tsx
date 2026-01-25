import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Target,
  TrendingUp,
  BookOpen,
} from "lucide-react";

interface RoadmapPhase {
  id: number;
  name: string;
  status: "completed" | "in_progress" | "not_started";
  items: RoadmapItem[];
}

interface RoadmapItem {
  id: number;
  name: string;
  status: "completed" | "in_progress" | "not_started";
  isCurrent?: boolean;
}

export const SkillRoadmapDetail: React.FC = () => {
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1, 2]);

  const currentGrade = "L2";
  const targetGrade = "L3";
  const achievedCount = 45;
  const totalCount = 60;
  const progressPercentage = Math.round((achievedCount / totalCount) * 100);

  const phases: RoadmapPhase[] = [
    {
      id: 1,
      name: "Phase 1: 基礎スキル",
      status: "completed",
      items: [
        { id: 1, name: "ITリテラシー", status: "completed" },
        { id: 2, name: "ネットワーク基礎", status: "completed" },
        { id: 3, name: "セキュリティ基礎", status: "completed" },
        { id: 4, name: "データベース基礎", status: "completed" },
        { id: 5, name: "プログラミング基礎", status: "completed" },
      ],
    },
    {
      id: 2,
      name: "Phase 2: 技術スキル",
      status: "in_progress",
      items: [
        { id: 6, name: "AWS基礎", status: "completed" },
        { id: 7, name: "AWS応用", status: "in_progress", isCurrent: true },
        { id: 8, name: "インフラ設計", status: "not_started" },
        { id: 9, name: "CI/CD", status: "not_started" },
        { id: 10, name: "コンテナ技術", status: "not_started" },
      ],
    },
    {
      id: 3,
      name: "Phase 3: リーダーシップ",
      status: "not_started",
      items: [
        { id: 11, name: "プロジェクト管理", status: "not_started" },
        { id: 12, name: "チーム育成", status: "not_started" },
        { id: 13, name: "技術指導", status: "not_started" },
        { id: 14, name: "提案・折衝", status: "not_started" },
      ],
    },
  ];

  const recommendedItems = [
    { id: 7, name: "AWS応用", category: "技術スキル", difficulty: "中級" },
    { id: 8, name: "インフラ設計", category: "技術スキル", difficulty: "上級" },
    { id: 9, name: "CI/CD", category: "技術スキル", difficulty: "中級" },
  ];

  const togglePhase = (phaseId: number) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const getStatusIcon = (status: string, isCurrent?: boolean) => {
    if (status === "completed") {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (status === "in_progress" || isCurrent) {
      return <Clock className="w-5 h-5 text-yellow-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">完了</Badge>;
      case "in_progress":
        return <Badge variant="warning">進行中</Badge>;
      default:
        return <Badge variant="gray">未着手</Badge>;
    }
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <a
          href="#skill-map"
          className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          スキルマップに戻る
        </a>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            スキルロードマップ
          </h1>
          <p className="text-lg text-gray-600">
            {currentGrade} → {targetGrade} へのキャリアパス
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">現在の職級</p>
                  <p className="text-xl font-bold text-gray-900">
                    {currentGrade} Mid-level
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">目標職級</p>
                  <p className="text-xl font-bold text-gray-900">
                    {targetGrade} Senior
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">達成率</p>
                <div className="flex items-center gap-3">
                  <Progress value={progressPercentage} className="flex-1" />
                  <span className="font-bold text-gray-900">
                    {progressPercentage}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {achievedCount}/{totalCount} 項目達成
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline View */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              ロードマップ進捗
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.id} className="border border-gray-200 rounded-lg">
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(phase.status)}
                    <span className="font-medium text-gray-900">
                      {phase.name}
                    </span>
                    {getStatusBadge(phase.status)}
                  </div>
                  {expandedPhases.includes(phase.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {/* Phase Items */}
                {expandedPhases.includes(phase.id) && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <ul className="space-y-3">
                      {phase.items.map((item) => (
                        <li
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            item.isCurrent
                              ? "bg-yellow-50 border border-yellow-200"
                              : "bg-white border border-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(item.status, item.isCurrent)}
                            <span
                              className={`${
                                item.isCurrent
                                  ? "font-medium text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {item.name}
                            </span>
                            {item.isCurrent && (
                              <Badge variant="warning">現在地</Badge>
                            )}
                          </div>
                          <a
                            href="#knowledge"
                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          >
                            ナレッジ
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Next Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                次に習得すべきスキル（推奨）
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.category} • {item.difficulty}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    ナレッジを見る
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
