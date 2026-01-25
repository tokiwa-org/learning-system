import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import {
  Search,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  FileText,
  Users,
  Sparkles,
  Play,
  X,
} from "lucide-react";

interface Curriculum {
  id: number;
  title: string;
  scenarioTitle: string;
  scenarioId: number;
  targetGrade: string;
  status: "pending" | "approved" | "rejected" | "in_progress";
  itemCount: number;
  estimatedMinutes: number;
  generatedAt: string;
  approvedAt?: string;
  assignedCount: number;
}

export const CurriculumManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const stats = {
    approved: 8,
    pending: 5,
    totalAssigned: 32,
  };

  const curriculums: Curriculum[] = [
    {
      id: 1,
      title: "AWS障害対応基礎カリキュラム",
      scenarioTitle: "AWS障害対応シナリオ",
      scenarioId: 1,
      targetGrade: "L2",
      status: "approved",
      itemCount: 8,
      estimatedMinutes: 120,
      generatedAt: "2025-01-15",
      approvedAt: "2025-01-16",
      assignedCount: 12,
    },
    {
      id: 2,
      title: "チームリーダーシップ育成カリキュラム",
      scenarioTitle: "チーム間コンフリクト解決",
      scenarioId: 2,
      targetGrade: "L3",
      status: "pending",
      itemCount: 10,
      estimatedMinutes: 180,
      generatedAt: "2025-01-20",
      assignedCount: 0,
    },
    {
      id: 3,
      title: "セキュリティ基礎カリキュラム",
      scenarioTitle: "セキュリティインシデント対応",
      scenarioId: 4,
      targetGrade: "L3",
      status: "approved",
      itemCount: 12,
      estimatedMinutes: 150,
      generatedAt: "2025-01-10",
      approvedAt: "2025-01-12",
      assignedCount: 15,
    },
    {
      id: 4,
      title: "コードレビュー実践カリキュラム",
      scenarioTitle: "コードレビューの進め方",
      scenarioId: 5,
      targetGrade: "L2",
      status: "in_progress",
      itemCount: 6,
      estimatedMinutes: 90,
      generatedAt: "2025-01-18",
      assignedCount: 5,
    },
    {
      id: 5,
      title: "新人教育担当者カリキュラム",
      scenarioTitle: "新人オンボーディング計画",
      scenarioId: 3,
      targetGrade: "L2",
      status: "rejected",
      itemCount: 5,
      estimatedMinutes: 60,
      generatedAt: "2025-01-22",
      assignedCount: 0,
    },
  ];

  const curriculumItems = [
    { order: 1, title: "はじめに", type: "text", minutes: 5 },
    { order: 2, title: "AWSの基本概念", type: "video", minutes: 15 },
    { order: 3, title: "障害検知の方法", type: "text", minutes: 10 },
    { order: 4, title: "CloudWatchの使い方", type: "interactive", minutes: 20 },
    { order: 5, title: "実践演習1", type: "exercise", minutes: 30 },
    { order: 6, title: "障害対応フロー", type: "text", minutes: 10 },
    { order: 7, title: "実践演習2", type: "exercise", minutes: 25 },
    { order: 8, title: "まとめテスト", type: "quiz", minutes: 5 },
  ];

  const filteredCurriculums = curriculums.filter((curriculum) => {
    const matchesSearch =
      curriculum.title.includes(searchQuery) ||
      curriculum.scenarioTitle.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || curriculum.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">承認済み</Badge>;
      case "pending":
        return <Badge variant="warning">承認待ち</Badge>;
      case "rejected":
        return <Badge variant="error">差戻し</Badge>;
      case "in_progress":
        return <Badge variant="default">生成中</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4 text-purple-600" />;
      case "exercise":
        return <Edit className="w-4 h-4 text-green-600" />;
      case "quiz":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "interactive":
        return <Sparkles className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleViewDetail = (curriculum: Curriculum) => {
    setSelectedCurriculum(curriculum);
    setIsDetailOpen(true);
  };

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">カリキュラム管理</h1>
            <p className="text-gray-600 mt-1">
              AIが生成したカリキュラムの確認・承認
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">承認済み</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.approved}件
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">承認待ち</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pending}件
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">割り当て済み</p>
                  <p className="text-3xl font-bold text-[#1971c2]">
                    {stats.totalAssigned}名
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-[#1971c2]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="カリキュラムを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1971c2]"
              >
                <option value="all">すべてのステータス</option>
                <option value="pending">承認待ち</option>
                <option value="approved">承認済み</option>
                <option value="rejected">差戻し</option>
                <option value="in_progress">生成中</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Curriculums Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カリキュラム
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      元シナリオ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      対象職級
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      項目数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCurriculums.map((curriculum) => (
                    <tr
                      key={curriculum.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {curriculum.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            約{curriculum.estimatedMinutes}分
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {curriculum.scenarioTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {curriculum.targetGrade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {curriculum.itemCount}項目
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(curriculum.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(curriculum)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {curriculum.status === "pending" && (
                            <>
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {isDetailOpen && selectedCurriculum && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedCurriculum.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    元シナリオ: {selectedCurriculum.scenarioTitle}
                  </p>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">対象職級</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedCurriculum.targetGrade}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">項目数</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedCurriculum.itemCount}項目
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">推定時間</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedCurriculum.estimatedMinutes}分
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">割り当て数</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedCurriculum.assignedCount}名
                    </p>
                  </div>
                </div>

                {/* Curriculum Items */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">カリキュラム項目</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {curriculumItems.map((item) => (
                        <div
                          key={item.order}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                              {item.order}
                            </span>
                            {getTypeIcon(item.type)}
                            <span className="font-medium text-gray-900">
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              {item.minutes}分
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {item.type === "video"
                                ? "動画"
                                : item.type === "exercise"
                                ? "演習"
                                : item.type === "quiz"
                                ? "テスト"
                                : item.type === "interactive"
                                ? "インタラクティブ"
                                : "テキスト"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  閉じる
                </Button>
                {selectedCurriculum.status === "pending" && (
                  <>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      差戻し
                    </Button>
                    <Button>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      承認
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
