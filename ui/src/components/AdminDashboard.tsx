import React from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  FileText,
  BarChart3,
  ArrowRight,
  PlayCircle,
  Zap,
  UserCheck,
  ShieldCheck
} from "lucide-react";

// 評価サイクルのステータス型
type CycleStatus =
  | 'REPORT_GENERATED'
  | 'MANAGER_EVALUATED'
  | 'MANAGER_APPROVED'
  | 'HR_APPROVED'
  | 'FINALIZED'
  | 'REJECTED';

export const AdminDashboard: React.FC = () => {
  // ステータス表示用ヘルパー
  const getStatusBadge = (status: CycleStatus) => {
    switch (status) {
      case 'REPORT_GENERATED':
        return <Badge variant="info" className="flex items-center gap-1"><Zap className="w-3 h-3" />レポート生成済み</Badge>;
      case 'MANAGER_EVALUATED':
        return <Badge variant="warning" className="flex items-center gap-1"><UserCheck className="w-3 h-3" />上司評価済み</Badge>;
      case 'MANAGER_APPROVED':
        return <Badge variant="info" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />上司承認済み</Badge>;
      case 'HR_APPROVED':
        return <Badge variant="info" className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />HR承認済み</Badge>;
      case 'FINALIZED':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />確定</Badge>;
      case 'REJECTED':
        return <Badge variant="error" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />差戻し</Badge>;
      default:
        return <Badge variant="gray">不明</Badge>;
    }
  };

  // 全体統計データ
  const stats = [
    {
      label: "登録社員数",
      value: "248",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12 (先月比)"
    },
    {
      label: "進行中の評価期間",
      value: "2",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subtext: "2025年度 上半期"
    },
    {
      label: "評価完了率",
      value: "67%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "166/248人"
    },
    {
      label: "未対応アラート",
      value: "5",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      subtext: "要確認"
    }
  ];

  // 評価進捗状況（新ワークフロー）
  const evaluationProgress = [
    {
      period: "2025年度 上半期",
      total: 248,
      reportGenerated: 248,  // 全員レポート生成済み
      managerEvaluated: 166, // 上司評価完了
      managerApproved: 120,  // 上司承認完了
      hrApproved: 80,        // HR承認完了
      finalized: 60          // 確定
    },
    {
      period: "2024年度 下半期",
      total: 236,
      reportGenerated: 236,
      managerEvaluated: 236,
      managerApproved: 236,
      hrApproved: 236,
      finalized: 236
    }
  ];

  // ワークフロー別の進捗サマリー
  const workflowSummary = {
    reportGenerated: 248,   // レポート生成済み
    awaitingManager: 82,    // 上司評価待ち
    awaitingApproval: 46,   // 上司承認待ち
    awaitingHR: 40,         // HR承認待ち
    finalized: 60,          // 確定済み
    rejected: 5             // 差戻し
  };

  // 最近のアクティビティ（新ワークフロー対応）
  const recentActivities = [
    { id: 1, type: "レポート生成", user: "システム", action: "2025年度上半期のレポートを248名分自動生成しました", time: "5分前", icon: Zap, color: "text-blue-600" },
    { id: 2, type: "上司評価完了", user: "鈴木 課長", action: "山田太郎の達成度レポートを評価しました", time: "30分前", icon: UserCheck, color: "text-green-600" },
    { id: 3, type: "承認完了", user: "佐藤 部長", action: "開発チーム5名の評価を承認しました", time: "1時間前", icon: CheckCircle, color: "text-green-600" },
    { id: 4, type: "HR承認", user: "人事部", action: "15名の評価がHR承認されました", time: "2時間前", icon: ShieldCheck, color: "text-purple-600" },
    { id: 5, type: "遅延アラート", user: "システム", action: "5名の上司が評価未完了です", time: "5時間前", icon: AlertCircle, color: "text-red-600" },
    { id: 6, type: "確定", user: "システム", action: "10名の評価が確定し、給与に反映されました", time: "6時間前", icon: CheckCircle, color: "text-green-600" }
  ];

  // システムアラート
  const systemAlerts = [
    { id: 1, severity: "high", message: "5名の社員が評価期限を過ぎています", action: "確認する" },
    { id: 2, severity: "medium", message: "15名の上司が評価を未承認です", action: "通知する" },
    { id: 3, severity: "low", message: "評価テンプレートの更新が推奨されます", action: "詳細" }
  ];

  // クイックアクション
  const quickActions = [
    { label: "評価期間を設定", icon: Calendar, href: "#evaluation-period-settings" },
    { label: "社員を追加", icon: Users, href: "#user-management" },
    { label: "部署を管理", icon: Building2, href: "#department-management" },
    { label: "評価テンプレート", icon: FileText, href: "#evaluation-template" },
    { label: "統計レポート", icon: BarChart3, href: "#evaluation-statistics" },
    { label: "システム設定", icon: Settings, href: "#system-settings" }
  ];

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
          <p className="text-gray-600 mt-1">システム全体の状況を確認できます</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="py-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      {stat.change && (
                        <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                      )}
                      {stat.subtext && (
                        <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                      )}
                    </div>
                    <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* システムアラート */}
        {systemAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">システムアラート</h2>
                <Button variant="ghost" size="sm">
                  すべて表示
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                      alert.severity === "high"
                        ? "bg-red-50 border-red-500"
                        : alert.severity === "medium"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-blue-50 border-blue-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle
                        className={`w-5 h-5 ${
                          alert.severity === "high"
                            ? "text-red-600"
                            : alert.severity === "medium"
                            ? "text-yellow-600"
                            : "text-blue-600"
                        }`}
                      />
                      <span className="text-sm text-gray-900">{alert.message}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      {alert.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 評価進捗状況（新ワークフロー） */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">評価ワークフロー進捗</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {evaluationProgress.map((period, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{period.period}</span>
                      <span className="text-sm text-gray-600">
                        確定: {period.finalized}/{period.total}人
                      </span>
                    </div>
                    {/* 新しいワークフローステップの進捗バー */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="h-full flex">
                        <div
                          className="bg-green-500"
                          style={{ width: `${(period.finalized / period.total) * 100}%` }}
                          title={`確定: ${period.finalized}`}
                        />
                        <div
                          className="bg-purple-400"
                          style={{ width: `${((period.hrApproved - period.finalized) / period.total) * 100}%` }}
                          title={`HR承認済み: ${period.hrApproved - period.finalized}`}
                        />
                        <div
                          className="bg-blue-400"
                          style={{ width: `${((period.managerApproved - period.hrApproved) / period.total) * 100}%` }}
                          title={`上司承認済み: ${period.managerApproved - period.hrApproved}`}
                        />
                        <div
                          className="bg-yellow-400"
                          style={{ width: `${((period.managerEvaluated - period.managerApproved) / period.total) * 100}%` }}
                          title={`上司評価済み: ${period.managerEvaluated - period.managerApproved}`}
                        />
                        <div
                          className="bg-gray-300"
                          style={{ width: `${((period.reportGenerated - period.managerEvaluated) / period.total) * 100}%` }}
                          title={`評価待ち: ${period.reportGenerated - period.managerEvaluated}`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        確定: {period.finalized}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-400 rounded-full" />
                        HR承認: {period.hrApproved - period.finalized}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-400 rounded-full" />
                        上司承認: {period.managerApproved - period.hrApproved}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        上司評価済: {period.managerEvaluated - period.managerApproved}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-300 rounded-full" />
                        評価待ち: {period.reportGenerated - period.managerEvaluated}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ワークフローサマリーカード */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">現在の状況（2025年度 上半期）</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-yellow-50 rounded">
                    <p className="text-xl font-bold text-yellow-700">{workflowSummary.awaitingManager}</p>
                    <p className="text-xs text-yellow-600">上司評価待ち</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-xl font-bold text-blue-700">{workflowSummary.awaitingApproval}</p>
                    <p className="text-xs text-blue-600">承認待ち</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-xl font-bold text-green-700">{workflowSummary.finalized}</p>
                    <p className="text-xs text-green-600">確定済み</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                詳細レポートを見る
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* 最近のアクティビティ */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">最近のアクティビティ</h2>
                <Button variant="ghost" size="sm">
                  すべて表示
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`${activity.color} mt-0.5`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* クイックアクション */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">クイックアクション</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="p-3 rounded-lg bg-gray-100 group-hover:bg-primary-100 transition-colors">
                      <Icon className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <span className="text-xs text-center text-gray-700 group-hover:text-primary-700 font-medium">
                      {action.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
