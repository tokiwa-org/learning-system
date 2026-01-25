import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  FileText, 
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Users,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  TrendingUp,
  BarChart3
} from "lucide-react";

interface Evaluation {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  period: string;
  selfEvalStatus: "completed" | "in-progress" | "not-started" | "overdue";
  managerEvalStatus: "completed" | "in-progress" | "not-started" | "overdue";
  finalStatus: "approved" | "pending" | "rejected" | "not-started";
  selfEvalScore?: number;
  managerEvalScore?: number;
  finalScore?: number;
  selfEvalDate?: string;
  managerEvalDate?: string;
  approvalDate?: string;
  managerName: string;
}

export const AllEvaluations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  // 評価データ
  const evaluations: Evaluation[] = [
    {
      id: "1",
      employeeCode: "EMP001",
      employeeName: "田中 太郎",
      department: "営業部",
      position: "部長",
      period: "2025年度 上半期",
      selfEvalStatus: "completed",
      managerEvalStatus: "completed",
      finalStatus: "approved",
      selfEvalScore: 4.2,
      managerEvalScore: 4.5,
      finalScore: 4.4,
      selfEvalDate: "2025-04-10",
      managerEvalDate: "2025-04-20",
      approvalDate: "2025-04-25",
      managerName: "山田 社長"
    },
    {
      id: "2",
      employeeCode: "EMP002",
      employeeName: "山田 花子",
      department: "営業部",
      position: "課長",
      period: "2025年度 上半期",
      selfEvalStatus: "completed",
      managerEvalStatus: "completed",
      finalStatus: "approved",
      selfEvalScore: 4.0,
      managerEvalScore: 4.2,
      finalScore: 4.1,
      selfEvalDate: "2025-04-08",
      managerEvalDate: "2025-04-18",
      approvalDate: "2025-04-22",
      managerName: "田中 太郎"
    },
    {
      id: "3",
      employeeCode: "EMP003",
      employeeName: "佐藤 次郎",
      department: "営業部",
      position: "主任",
      period: "2025年度 上半期",
      selfEvalStatus: "completed",
      managerEvalStatus: "in-progress",
      finalStatus: "pending",
      selfEvalScore: 3.8,
      selfEvalDate: "2025-04-12",
      managerName: "山田 花子"
    },
    {
      id: "4",
      employeeCode: "EMP004",
      employeeName: "鈴木 美咲",
      department: "開発部",
      position: "部長",
      period: "2025年度 上半期",
      selfEvalStatus: "completed",
      managerEvalStatus: "completed",
      finalStatus: "approved",
      selfEvalScore: 4.5,
      managerEvalScore: 4.7,
      finalScore: 4.6,
      selfEvalDate: "2025-04-05",
      managerEvalDate: "2025-04-15",
      approvalDate: "2025-04-20",
      managerName: "山田 社長"
    },
    {
      id: "5",
      employeeCode: "EMP005",
      employeeName: "高橋 健一",
      department: "開発部",
      position: "シニアエンジニア",
      period: "2025年度 上半期",
      selfEvalStatus: "completed",
      managerEvalStatus: "completed",
      finalStatus: "pending",
      selfEvalScore: 4.3,
      managerEvalScore: 4.4,
      selfEvalDate: "2025-04-11",
      managerEvalDate: "2025-04-21",
      managerName: "鈴木 美咲"
    },
    {
      id: "6",
      employeeCode: "EMP006",
      employeeName: "伊藤 美香",
      department: "人事部",
      position: "部長",
      period: "2025年度 上半期",
      selfEvalStatus: "completed",
      managerEvalStatus: "not-started",
      finalStatus: "not-started",
      selfEvalScore: 4.1,
      selfEvalDate: "2025-04-09",
      managerName: "山田 社長"
    },
    {
      id: "7",
      employeeCode: "EMP007",
      employeeName: "渡辺 誠",
      department: "人事部",
      position: "課長",
      period: "2025年度 上半期",
      selfEvalStatus: "in-progress",
      managerEvalStatus: "not-started",
      finalStatus: "not-started",
      managerName: "伊藤 美香"
    },
    {
      id: "8",
      employeeCode: "EMP008",
      employeeName: "中村 里美",
      department: "経理部",
      position: "部長",
      period: "2025年度 上半期",
      selfEvalStatus: "overdue",
      managerEvalStatus: "not-started",
      finalStatus: "not-started",
      managerName: "山田 社長"
    },
    {
      id: "9",
      employeeCode: "EMP009",
      employeeName: "小林 浩二",
      department: "マーケティング部",
      position: "部長",
      period: "2025年度 上半期",
      selfEvalStatus: "completed",
      managerEvalStatus: "overdue",
      finalStatus: "not-started",
      selfEvalScore: 3.9,
      selfEvalDate: "2025-04-07",
      managerName: "山田 社長"
    },
    {
      id: "10",
      employeeCode: "EMP010",
      employeeName: "加藤 智子",
      department: "マーケティング部",
      position: "課長",
      period: "2025年度 上半期",
      selfEvalStatus: "not-started",
      managerEvalStatus: "not-started",
      finalStatus: "not-started",
      managerName: "小林 浩二"
    }
  ];

  // ステータスバッジ（評価進捗）
  const getEvalStatusBadge = (status: Evaluation["selfEvalStatus"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">完了</Badge>;
      case "in-progress":
        return <Badge variant="default">進行中</Badge>;
      case "not-started":
        return <Badge variant="secondary">未着手</Badge>;
      case "overdue":
        return <Badge variant="destructive">期限超過</Badge>;
    }
  };

  // 最終ステータスバッジ
  const getFinalStatusBadge = (status: Evaluation["finalStatus"]) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">承認済み</Badge>;
      case "pending":
        return <Badge variant="default">承認待ち</Badge>;
      case "rejected":
        return <Badge variant="destructive">差戻し</Badge>;
      case "not-started":
        return <Badge variant="secondary">未完了</Badge>;
    }
  };

  // フィルタリング
  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch = evaluation.employeeName.includes(searchQuery) ||
      evaluation.employeeCode.includes(searchQuery) ||
      evaluation.department.includes(searchQuery);
    const matchesPeriod = periodFilter === "all" || evaluation.period === periodFilter;
    const matchesDepartment = departmentFilter === "all" || evaluation.department === departmentFilter;
    
    let matchesStatus = true;
    if (statusFilter !== "all") {
      if (statusFilter === "completed") {
        matchesStatus = evaluation.finalStatus === "approved";
      } else if (statusFilter === "pending") {
        matchesStatus = evaluation.finalStatus === "pending";
      } else if (statusFilter === "not-started") {
        matchesStatus = evaluation.selfEvalStatus === "not-started";
      } else if (statusFilter === "overdue") {
        matchesStatus = evaluation.selfEvalStatus === "overdue" || evaluation.managerEvalStatus === "overdue";
      }
    }
    
    return matchesSearch && matchesPeriod && matchesDepartment && matchesStatus;
  });

  // ユニークな部署リスト
  const uniqueDepartments = Array.from(new Set(evaluations.map(e => e.department)));

  // 統計計算
  const totalCount = evaluations.length;
  const completedCount = evaluations.filter(e => e.finalStatus === "approved").length;
  const pendingCount = evaluations.filter(e => e.finalStatus === "pending").length;
  const overdueCount = evaluations.filter(e => e.selfEvalStatus === "overdue" || e.managerEvalStatus === "overdue").length;

  // 日付フォーマット
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">全社評価一覧</h1>
            <p className="text-gray-600 mt-1">全社員の評価状況を確認できます</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              CSVエクスポート
            </Button>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              統計レポート
            </Button>
          </div>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">総評価数</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
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
                  <p className="text-sm text-gray-600">承認済み</p>
                  <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                  <p className="text-xs text-gray-500">{Math.round((completedCount / totalCount) * 100)}%</p>
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
                  <p className="text-sm text-gray-600">承認待ち</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">期限超過</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 検索とフィルター */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="社員名、社員番号、部署で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">すべての期間</option>
                  <option value="2025年度 上半期">2025年度 上半期</option>
                  <option value="2024年度 下半期">2024年度 下半期</option>
                </select>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">すべての部署</option>
                  {uniqueDepartments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">すべてのステータス</option>
                  <option value="completed">承認済み</option>
                  <option value="pending">承認待ち</option>
                  <option value="not-started">未着手</option>
                  <option value="overdue">期限超過</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 評価一覧テーブル */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      社員
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部署・役職
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      評価期間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      自己評価
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      上司評価
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最終評価
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      評価者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvaluations.map((evaluation) => (
                    <tr key={evaluation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{evaluation.employeeName}</p>
                          <p className="text-sm text-gray-500">{evaluation.employeeCode}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900">{evaluation.department}</p>
                          <p className="text-sm text-gray-500">{evaluation.position}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{evaluation.period}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getEvalStatusBadge(evaluation.selfEvalStatus)}
                          {evaluation.selfEvalScore && (
                            <p className="text-sm text-gray-900">
                              <TrendingUp className="w-3 h-3 inline-block mr-1 text-gray-400" />
                              {evaluation.selfEvalScore.toFixed(1)}
                            </p>
                          )}
                          {evaluation.selfEvalDate && (
                            <p className="text-xs text-gray-500">{formatDate(evaluation.selfEvalDate)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getEvalStatusBadge(evaluation.managerEvalStatus)}
                          {evaluation.managerEvalScore && (
                            <p className="text-sm text-gray-900">
                              <TrendingUp className="w-3 h-3 inline-block mr-1 text-gray-400" />
                              {evaluation.managerEvalScore.toFixed(1)}
                            </p>
                          )}
                          {evaluation.managerEvalDate && (
                            <p className="text-xs text-gray-500">{formatDate(evaluation.managerEvalDate)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getFinalStatusBadge(evaluation.finalStatus)}
                          {evaluation.finalScore && (
                            <p className="text-sm font-bold text-gray-900">
                              <TrendingUp className="w-3 h-3 inline-block mr-1 text-gray-400" />
                              {evaluation.finalScore.toFixed(1)}
                            </p>
                          )}
                          {evaluation.approvalDate && (
                            <p className="text-xs text-gray-500">{formatDate(evaluation.approvalDate)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{evaluation.managerName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedEvaluation(evaluation)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          詳細
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 結果が0件の場合 */}
            {filteredEvaluations.length === 0 && (
              <div className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">該当する評価が見つかりませんでした</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setPeriodFilter("all");
                  setDepartmentFilter("all");
                  setStatusFilter("all");
                }}>
                  フィルターをリセット
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 評価詳細モーダル */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">評価詳細</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedEvaluation.employeeName} ({selectedEvaluation.employeeCode})
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedEvaluation(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">部署</p>
                  <p className="font-medium text-gray-900">{selectedEvaluation.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">役職</p>
                  <p className="font-medium text-gray-900">{selectedEvaluation.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">評価期間</p>
                  <p className="font-medium text-gray-900">{selectedEvaluation.period}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">評価者</p>
                  <p className="font-medium text-gray-900">{selectedEvaluation.managerName}</p>
                </div>
              </div>

              {/* 評価状況 */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">評価状況</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">自己評価</p>
                        <p className="text-sm text-gray-500">
                          {selectedEvaluation.selfEvalDate ? formatDate(selectedEvaluation.selfEvalDate) : "未提出"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getEvalStatusBadge(selectedEvaluation.selfEvalStatus)}
                      {selectedEvaluation.selfEvalScore && (
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {selectedEvaluation.selfEvalScore.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">上司評価</p>
                        <p className="text-sm text-gray-500">
                          {selectedEvaluation.managerEvalDate ? formatDate(selectedEvaluation.managerEvalDate) : "未提出"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getEvalStatusBadge(selectedEvaluation.managerEvalStatus)}
                      {selectedEvaluation.managerEvalScore && (
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {selectedEvaluation.managerEvalScore.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">最終評価</p>
                        <p className="text-sm text-gray-500">
                          {selectedEvaluation.approvalDate ? formatDate(selectedEvaluation.approvalDate) : "未承認"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getFinalStatusBadge(selectedEvaluation.finalStatus)}
                      {selectedEvaluation.finalScore && (
                        <p className="text-2xl font-bold text-blue-900 mt-1">
                          {selectedEvaluation.finalScore.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedEvaluation(null)}>
                  閉じる
                </Button>
                <Button>
                  評価シートを見る
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};
