import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Calendar, 
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Settings
} from "lucide-react";

interface EvaluationPeriod {
  id: string;
  name: string;
  fiscalYear: string;
  period: "first-half" | "second-half" | "full-year";
  status: "draft" | "active" | "closed" | "archived";
  selfEvalStart: string;
  selfEvalEnd: string;
  managerEvalStart: string;
  managerEvalEnd: string;
  finalApprovalEnd: string;
  targetEmployees: number;
  completedCount: number;
  description: string;
}

export const EvaluationPeriodSettings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 評価期間データ
  const periods: EvaluationPeriod[] = [
    {
      id: "1",
      name: "2025年度 上半期評価",
      fiscalYear: "2025",
      period: "first-half",
      status: "active",
      selfEvalStart: "2025-04-01",
      selfEvalEnd: "2025-04-15",
      managerEvalStart: "2025-04-16",
      managerEvalEnd: "2025-04-30",
      finalApprovalEnd: "2025-05-10",
      targetEmployees: 248,
      completedCount: 166,
      description: "2025年度上半期（4月-9月）の人事考課"
    },
    {
      id: "2",
      name: "2025年度 下半期評価",
      fiscalYear: "2025",
      period: "second-half",
      status: "draft",
      selfEvalStart: "2025-10-01",
      selfEvalEnd: "2025-10-15",
      managerEvalStart: "2025-10-16",
      managerEvalEnd: "2025-10-31",
      finalApprovalEnd: "2025-11-10",
      targetEmployees: 250,
      completedCount: 0,
      description: "2025年度下半期（10月-3月）の人事考課"
    },
    {
      id: "3",
      name: "2024年度 下半期評価",
      fiscalYear: "2024",
      period: "second-half",
      status: "closed",
      selfEvalStart: "2024-10-01",
      selfEvalEnd: "2024-10-15",
      managerEvalStart: "2024-10-16",
      managerEvalEnd: "2024-10-31",
      finalApprovalEnd: "2024-11-10",
      targetEmployees: 236,
      completedCount: 236,
      description: "2024年度下半期（10月-3月）の人事考課"
    },
    {
      id: "4",
      name: "2024年度 上半期評価",
      fiscalYear: "2024",
      period: "first-half",
      status: "archived",
      selfEvalStart: "2024-04-01",
      selfEvalEnd: "2024-04-15",
      managerEvalStart: "2024-04-16",
      managerEvalEnd: "2024-04-30",
      finalApprovalEnd: "2024-05-10",
      targetEmployees: 230,
      completedCount: 230,
      description: "2024年度上半期（4月-9月）の人事考課"
    }
  ];

  // ステータスバッジの設定
  const getStatusBadge = (status: EvaluationPeriod["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">準備中</Badge>;
      case "active":
        return <Badge variant="default">進行中</Badge>;
      case "closed":
        return <Badge variant="success">完了</Badge>;
      case "archived":
        return <Badge variant="outline">アーカイブ済み</Badge>;
    }
  };

  // 期間タイプの表示
  const getPeriodLabel = (period: EvaluationPeriod["period"]) => {
    switch (period) {
      case "first-half":
        return "上半期";
      case "second-half":
        return "下半期";
      case "full-year":
        return "通年";
    }
  };

  // フィルタリング
  const filteredPeriods = periods.filter((period) => {
    const matchesSearch = period.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      period.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || period.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">評価期間設定</h1>
            <p className="text-gray-600 mt-1">評価期間の作成と管理を行います</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新規評価期間を作成
          </Button>
        </div>

        {/* 検索とフィルター */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="評価期間名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">すべてのステータス</option>
                  <option value="draft">準備中</option>
                  <option value="active">進行中</option>
                  <option value="closed">完了</option>
                  <option value="archived">アーカイブ済み</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">総評価期間数</p>
                  <p className="text-2xl font-bold text-gray-900">{periods.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">進行中</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {periods.filter(p => p.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">準備中</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {periods.filter(p => p.status === "draft").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">完了</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {periods.filter(p => p.status === "closed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 評価期間リスト */}
        <div className="space-y-4">
          {filteredPeriods.map((period) => (
            <Card key={period.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{period.name}</h3>
                      {getStatusBadge(period.status)}
                      <Badge variant="outline">{getPeriodLabel(period.period)}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{period.description}</p>

                    {/* 進捗バー */}
                    {period.status === "active" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">評価進捗</span>
                          <span className="font-medium text-gray-900">
                            {period.completedCount}/{period.targetEmployees}人 ({Math.round((period.completedCount / period.targetEmployees) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${(period.completedCount / period.targetEmployees) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* スケジュール */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">自己評価期間</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(period.selfEvalStart)} - {formatDate(period.selfEvalEnd)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">上司評価期間</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(period.managerEvalStart)} - {formatDate(period.managerEvalEnd)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">最終承認期限</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(period.finalApprovalEnd)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" title="複製">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="編集">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="設定">
                      <Settings className="w-4 h-4" />
                    </Button>
                    {period.status === "draft" && (
                      <Button variant="ghost" size="sm" title="削除" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* ステータス別のアラート */}
                {period.status === "active" && period.completedCount < period.targetEmployees * 0.3 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      評価完了率が低い状態です。対象社員への督促をご検討ください。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 結果が0件の場合 */}
        {filteredPeriods.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">該当する評価期間が見つかりませんでした</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}>
                  フィルターをリセット
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 新規作成モーダル（簡易版） */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">新規評価期間を作成</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  評価期間名 <span className="text-red-500">*</span>
                </label>
                <Input type="text" placeholder="例: 2025年度 上半期評価" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    年度 <span className="text-red-500">*</span>
                  </label>
                  <Input type="text" placeholder="2025" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    期間 <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="first-half">上半期</option>
                    <option value="second-half">下半期</option>
                    <option value="full-year">通年</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  説明
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="評価期間の説明を入力してください"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">評価スケジュール</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">自己評価 開始日</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">自己評価 終了日</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">上司評価 開始日</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">上司評価 終了日</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">最終承認期限</label>
                    <Input type="date" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  キャンセル
                </Button>
                <Button onClick={() => setShowCreateModal(false)}>
                  作成
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};
