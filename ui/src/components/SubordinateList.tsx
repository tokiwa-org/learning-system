import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Users,
  Star,
} from "lucide-react";

export function SubordinateList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");

  // 部下データ
  const subordinates = [
    {
      id: 1,
      name: "山田 太郎",
      employeeId: "EMP001",
      department: "開発部",
      position: "シニアエンジニア",
      avatar: "YT",
      selfEvalStatus: "完了",
      selfEvalScore: 4.2,
      managerEvalStatus: "完了",
      managerEvalScore: 4.5,
      finalScore: 4.5,
      trend: "up",
      lastPeriodScore: 4.0,
      submittedDate: "2026-01-20",
      evaluatedDate: "2026-01-22",
    },
    {
      id: 2,
      name: "佐藤 花子",
      employeeId: "EMP002",
      department: "開発部",
      position: "エンジニア",
      avatar: "SH",
      selfEvalStatus: "完了",
      selfEvalScore: 3.8,
      managerEvalStatus: "評価中",
      managerEvalScore: null,
      finalScore: null,
      trend: "same",
      lastPeriodScore: 3.8,
      submittedDate: "2026-01-21",
      evaluatedDate: null,
    },
    {
      id: 3,
      name: "鈴木 一郎",
      employeeId: "EMP003",
      department: "開発部",
      position: "ジュニアエンジニア",
      avatar: "SI",
      selfEvalStatus: "完了",
      selfEvalScore: 3.4,
      managerEvalStatus: "完了",
      managerEvalScore: 3.6,
      finalScore: 3.6,
      trend: "up",
      lastPeriodScore: 3.2,
      submittedDate: "2026-01-18",
      evaluatedDate: "2026-01-19",
    },
    {
      id: 4,
      name: "田中 美咲",
      employeeId: "EMP004",
      department: "開発部",
      position: "エンジニア",
      avatar: "TM",
      selfEvalStatus: "未提出",
      selfEvalScore: null,
      managerEvalStatus: "未評価",
      managerEvalScore: null,
      finalScore: null,
      trend: "same",
      lastPeriodScore: 4.1,
      submittedDate: null,
      evaluatedDate: null,
    },
    {
      id: 5,
      name: "高橋 健太",
      employeeId: "EMP005",
      department: "開発部",
      position: "エンジニア",
      avatar: "TK",
      selfEvalStatus: "完了",
      selfEvalScore: 4.0,
      managerEvalStatus: "完了",
      managerEvalScore: 4.2,
      finalScore: 4.2,
      trend: "up",
      lastPeriodScore: 3.8,
      submittedDate: "2026-01-19",
      evaluatedDate: "2026-01-20",
    },
    {
      id: 6,
      name: "伊藤 桜",
      employeeId: "EMP006",
      department: "開発部",
      position: "シニアエンジニア",
      avatar: "IS",
      selfEvalStatus: "完了",
      selfEvalScore: 4.6,
      managerEvalStatus: "完了",
      managerEvalScore: 4.8,
      finalScore: 4.8,
      trend: "up",
      lastPeriodScore: 4.5,
      submittedDate: "2026-01-17",
      evaluatedDate: "2026-01-18",
    },
  ];

  const filteredSubordinates = subordinates.filter((sub) => {
    const matchesSearch =
      sub.name.includes(searchQuery) ||
      sub.employeeId.includes(searchQuery) ||
      sub.position.includes(searchQuery);

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && sub.managerEvalStatus !== "完了") ||
      (filterStatus === "completed" && sub.managerEvalStatus === "完了");

    return matchesSearch && matchesFilter;
  });

  // 統計データ
  const stats = {
    total: subordinates.length,
    completed: subordinates.filter((s) => s.managerEvalStatus === "完了").length,
    pending: subordinates.filter((s) => s.managerEvalStatus !== "完了").length,
    averageScore:
      subordinates
        .filter((s) => s.finalScore)
        .reduce((sum, s) => sum + s.finalScore!, 0) /
      subordinates.filter((s) => s.finalScore).length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "完了":
        return <Badge variant="success">完了</Badge>;
      case "評価中":
        return <Badge variant="warning">評価中</Badge>;
      case "未評価":
        return <Badge variant="default">未評価</Badge>;
      case "未提出":
        return <Badge variant="error">未提出</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-[#40c057]" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-[#fa5252]" />;
      default:
        return null;
    }
  };

  const renderStars = (score: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(score)
                ? "fill-[#fab005] text-[#fab005]"
                : "fill-none text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout userRole="manager">
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => (window.location.hash = "manager-dashboard")}>
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">部下評価一覧</h1>
              <p className="text-gray-600">部下の評価状況を一覧で確認できます</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            CSVエクスポート
          </Button>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">担当部下数</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-[#1971c2]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">評価完了</p>
                  <p className="text-3xl font-bold text-[#40c057]">{stats.completed}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((stats.completed / stats.total) * 100)}%
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-[#40c057]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">評価待ち</p>
                  <p className="text-3xl font-bold text-[#fab005]">{stats.pending}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((stats.pending / stats.total) * 100)}%
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-[#fab005]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">平均評価</p>
                  <p className="text-3xl font-bold text-[#1971c2]">
                    {stats.averageScore.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">5段階評価</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-[#fab005]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 検索・フィルター */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="社員名、社員ID、役職で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  すべて
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  onClick={() => setFilterStatus("pending")}
                >
                  評価待ち
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("completed")}
                >
                  完了
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 部下一覧テーブル */}
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
                      自己評価
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      上司評価
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最終評価
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      前期比
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
                  {filteredSubordinates.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#1971c2] text-white flex items-center justify-center font-semibold mr-3">
                            {sub.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{sub.name}</div>
                            <div className="text-sm text-gray-500">
                              {sub.employeeId} / {sub.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sub.selfEvalScore ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#1971c2]">
                                {sub.selfEvalScore}
                              </span>
                              {renderStars(sub.selfEvalScore)}
                            </div>
                            {getStatusBadge(sub.selfEvalStatus)}
                          </div>
                        ) : (
                          getStatusBadge(sub.selfEvalStatus)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sub.managerEvalScore ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#fab005]">
                                {sub.managerEvalScore}
                              </span>
                              {renderStars(sub.managerEvalScore)}
                            </div>
                            {getStatusBadge(sub.managerEvalStatus)}
                          </div>
                        ) : (
                          getStatusBadge(sub.managerEvalStatus)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sub.finalScore ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#40c057]">
                              {sub.finalScore}
                            </span>
                            {renderStars(sub.finalScore)}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(sub.trend)}
                          <span className="text-sm text-gray-600">{sub.lastPeriodScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(sub.managerEvalStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              (window.location.hash = `evaluation-detail?id=${sub.id}`)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {sub.managerEvalStatus !== "完了" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                (window.location.hash = `manager-evaluation?id=${sub.id}`)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 結果が0件の場合 */}
        {filteredSubordinates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">該当する部下が見つかりませんでした</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
