import React from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText,
  ChevronRight,
  BarChart3,
  ClipboardCheck,
} from "lucide-react";

// 新ワークフローのステータス型
type CycleStatus =
  | "REPORT_GENERATED"
  | "MANAGER_EVALUATED"
  | "MANAGER_APPROVED"
  | "HR_APPROVED"
  | "FINALIZED"
  | "REJECTED";

export function ManagerDashboard() {
  // サマリー統計データ
  const summaryStats = [
    {
      icon: Users,
      label: "担当部下数",
      value: "12名",
      change: "+2名 (前期比)",
      changeType: "neutral" as const,
      bgColor: "bg-blue-50",
      iconColor: "text-[#1971c2]",
    },
    {
      icon: ClipboardCheck,
      label: "レポート生成済み",
      value: "12名",
      change: "評価待ち",
      changeType: "info" as const,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      icon: CheckCircle,
      label: "評価完了",
      value: "8名",
      change: "67% 完了",
      changeType: "success" as const,
      bgColor: "bg-green-50",
      iconColor: "text-[#40c057]",
    },
    {
      icon: Clock,
      label: "評価待ち",
      value: "4名",
      change: "期限まで5日",
      changeType: "warning" as const,
      bgColor: "bg-yellow-50",
      iconColor: "text-[#fab005]",
    },
  ];

  // 部下評価ステータス（新ワークフロー対応）
  const subordinates = [
    {
      id: 1,
      name: "山田 太郎",
      department: "開発部",
      position: "シニアエンジニア",
      status: "REPORT_GENERATED" as CycleStatus,
      reportScore: 78.5,
      suggestedRank: "B",
      deadline: "2026-01-31",
      avatar: "YT",
    },
    {
      id: 2,
      name: "佐藤 花子",
      department: "開発部",
      position: "エンジニア",
      status: "MANAGER_EVALUATED" as CycleStatus,
      reportScore: 82.3,
      suggestedRank: "A",
      deadline: "2026-01-31",
      avatar: "SH",
    },
    {
      id: 3,
      name: "鈴木 一郎",
      department: "開発部",
      position: "ジュニアエンジニア",
      status: "MANAGER_APPROVED" as CycleStatus,
      reportScore: 65.0,
      suggestedRank: "C",
      deadline: "2026-01-31",
      avatar: "SI",
    },
    {
      id: 4,
      name: "田中 美咲",
      department: "開発部",
      position: "エンジニア",
      status: "FINALIZED" as CycleStatus,
      reportScore: 91.2,
      suggestedRank: "A",
      deadline: "2026-01-31",
      avatar: "TM",
    },
  ];

  // 最近のアクティビティ（新ワークフロー対応）
  const recentActivities = [
    {
      id: 1,
      type: "report",
      message: "山田 太郎さんの達成度レポートが生成されました",
      time: "2時間前",
      icon: FileText,
    },
    {
      id: 2,
      type: "complete",
      message: "鈴木 一郎さんの評価を完了しました",
      time: "5時間前",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "alert",
      message: "評価期限が近づいています（残り5日）",
      time: "1日前",
      icon: AlertCircle,
    },
    {
      id: 4,
      type: "report",
      message: "佐藤 花子さんの達成度レポートが生成されました",
      time: "2日前",
      icon: FileText,
    },
  ];

  // 評価期間情報
  const evaluationPeriod = {
    period: "2026年度 第1四半期",
    reportGeneratedDate: "2026年1月15日",
    managerEvalDeadline: "2026年2月15日",
    status: "評価期間中",
  };

  const getStatusBadge = (status: CycleStatus) => {
    const statusConfig: Record<
      CycleStatus,
      { label: string; variant: "default" | "success" | "warning" | "error" | "info" }
    > = {
      REPORT_GENERATED: { label: "レポート生成済み", variant: "info" },
      MANAGER_EVALUATED: { label: "上司評価済み", variant: "warning" },
      MANAGER_APPROVED: { label: "上司承認済み", variant: "success" },
      HR_APPROVED: { label: "HR承認済み", variant: "success" },
      FINALIZED: { label: "確定", variant: "success" },
      REJECTED: { label: "差戻し", variant: "error" },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRankBadge = (rank: string) => {
    const rankColors: Record<string, string> = {
      S: "bg-purple-100 text-purple-800 border-purple-200",
      A: "bg-blue-100 text-blue-800 border-blue-200",
      B: "bg-green-100 text-green-800 border-green-200",
      C: "bg-yellow-100 text-yellow-800 border-yellow-200",
      D: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${rankColors[rank]}`}>
        {rank}ランク
      </span>
    );
  };

  const canEvaluate = (status: CycleStatus) => {
    return status === "REPORT_GENERATED" || status === "REJECTED";
  };

  const canApprove = (status: CycleStatus) => {
    return status === "MANAGER_EVALUATED";
  };

  return (
    <Layout userRole="manager">
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">上司ダッシュボード</h1>
            <p className="text-gray-600">部下の達成度レポートを確認し、評価を行えます</p>
          </div>
          <Button onClick={() => (window.location.hash = "manager-evaluation")}>
            <FileText className="w-4 h-4" />
            部下を評価する
          </Button>
        </div>

        {/* 評価期間情報 */}
        <Card className="bg-gradient-to-r from-[#1971c2] to-[#1864ab] text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-xl font-semibold">{evaluationPeriod.period}</h3>
                </div>
                <div className="space-y-1 text-sm opacity-90">
                  <p>レポート生成日: {evaluationPeriod.reportGeneratedDate}</p>
                  <p>上司評価期限: {evaluationPeriod.managerEvalDeadline}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="default" className="bg-white text-[#1971c2] border-0">
                  {evaluationPeriod.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* サマリー統計 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p
                        className={`text-xs ${
                          stat.changeType === "success"
                            ? "text-[#40c057]"
                            : stat.changeType === "warning"
                            ? "text-[#fab005]"
                            : stat.changeType === "error"
                            ? "text-[#fa5252]"
                            : stat.changeType === "info"
                            ? "text-indigo-600"
                            : "text-gray-500"
                        }`}
                      >
                        {stat.change}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 部下評価ステータス */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">達成度レポート一覧</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (window.location.hash = "subordinate-list")}
                >
                  すべて見る
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          社員
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          暫定スコア
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          推奨ランク
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          アクション
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subordinates.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-[#1971c2] text-white flex items-center justify-center font-semibold mr-3">
                                {sub.avatar}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{sub.name}</div>
                                <div className="text-sm text-gray-500">{sub.position}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-semibold text-gray-900">
                              {sub.reportScore.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500"> / 100</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRankBadge(sub.suggestedRank)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(sub.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {canEvaluate(sub.status) && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  (window.location.hash = `manager-evaluation?id=${sub.id}`)
                                }
                              >
                                評価する
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            )}
                            {canApprove(sub.status) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  (window.location.hash = `evaluation-approval?id=${sub.id}`)
                                }
                              >
                                承認する
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            )}
                            {!canEvaluate(sub.status) && !canApprove(sub.status) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  (window.location.hash = `manager-evaluation?id=${sub.id}`)
                                }
                              >
                                詳細
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右サイドバー */}
          <div className="space-y-6">
            {/* クイックアクション */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">クイックアクション</h2>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => (window.location.hash = "manager-evaluation")}
                >
                  <FileText className="w-4 h-4" />
                  部下を評価する
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => (window.location.hash = "evaluation-approval")}
                >
                  <CheckCircle className="w-4 h-4" />
                  評価を承認する
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => (window.location.hash = "subordinate-list")}
                >
                  <Users className="w-4 h-4" />
                  部下一覧を見る
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => (window.location.hash = "team-analytics")}
                >
                  <BarChart3 className="w-4 h-4" />
                  チーム分析を見る
                </Button>
              </CardContent>
            </Card>

            {/* 最近のアクティビティ */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">最近のアクティビティ</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              activity.type === "complete"
                                ? "bg-green-50"
                                : activity.type === "alert"
                                ? "bg-red-50"
                                : "bg-blue-50"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                activity.type === "complete"
                                  ? "text-[#40c057]"
                                  : activity.type === "alert"
                                  ? "text-[#fa5252]"
                                  : "text-[#1971c2]"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
