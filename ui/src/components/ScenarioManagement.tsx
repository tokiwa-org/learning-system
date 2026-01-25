import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Search,
  Plus,
  Sparkles,
  Edit,
  Eye,
  Trash2,
  FileText,
  Users,
  Clock,
  BookOpen,
  X,
  Save,
  Send,
} from "lucide-react";

interface Scenario {
  id: number;
  title: string;
  description: string;
  category: string;
  targetGrades: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published" | "archived";
  estimatedTime: number;
  learnerCount: number;
  createdAt: string;
  updatedAt: string;
}

export const ScenarioManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const stats = {
    published: 12,
    draft: 3,
    totalLearners: 45,
  };

  const scenarios: Scenario[] = [
    {
      id: 1,
      title: "AWS障害対応シナリオ",
      description: "本番環境でEC2インスタンスが応答しなくなった場合の対応手順を学習します。",
      category: "技術スキル",
      targetGrades: ["L2", "L3"],
      difficulty: "intermediate",
      status: "published",
      estimatedTime: 2,
      learnerCount: 18,
      createdAt: "2025-01-10",
      updatedAt: "2025-01-15",
    },
    {
      id: 2,
      title: "チーム間コンフリクト解決",
      description: "プロジェクトでチーム間の意見対立が発生した場合の調整方法を学習します。",
      category: "行動・貢献",
      targetGrades: ["L3", "L4"],
      difficulty: "advanced",
      status: "published",
      estimatedTime: 3,
      learnerCount: 12,
      createdAt: "2025-01-08",
      updatedAt: "2025-01-12",
    },
    {
      id: 3,
      title: "新人オンボーディング計画",
      description: "新入社員の育成計画を立案し、実行する方法を学習します。",
      category: "職能発揮力",
      targetGrades: ["L2"],
      difficulty: "beginner",
      status: "draft",
      estimatedTime: 1,
      learnerCount: 0,
      createdAt: "2025-01-20",
      updatedAt: "2025-01-20",
    },
    {
      id: 4,
      title: "セキュリティインシデント対応",
      description: "情報セキュリティインシデント発生時の初動対応から報告までの流れを学習します。",
      category: "技術スキル",
      targetGrades: ["L3", "L4"],
      difficulty: "advanced",
      status: "published",
      estimatedTime: 2,
      learnerCount: 15,
      createdAt: "2025-01-05",
      updatedAt: "2025-01-18",
    },
    {
      id: 5,
      title: "コードレビューの進め方",
      description: "効果的なコードレビューの方法と、建設的なフィードバックの仕方を学習します。",
      category: "技術スキル",
      targetGrades: ["L2", "L3"],
      difficulty: "intermediate",
      status: "published",
      estimatedTime: 1,
      learnerCount: 22,
      createdAt: "2025-01-03",
      updatedAt: "2025-01-10",
    },
  ];

  const categories = ["技術スキル", "職能発揮力", "行動・貢献"];

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch =
      scenario.title.includes(searchQuery) ||
      scenario.description.includes(searchQuery);
    const matchesCategory =
      categoryFilter === "all" || scenario.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || scenario.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Badge variant="success">初級</Badge>;
      case "intermediate":
        return <Badge variant="warning">中級</Badge>;
      case "advanced":
        return <Badge variant="error">上級</Badge>;
      default:
        return <Badge variant="gray">{difficulty}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="success">公開中</Badge>;
      case "draft":
        return <Badge variant="gray">下書き</Badge>;
      case "archived":
        return <Badge variant="default">アーカイブ</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const handleEdit = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setSelectedScenario(null);
  };

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">文章題管理</h1>
            <p className="text-gray-600 mt-1">
              学習用シナリオの作成・編集
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              AIで生成
            </Button>
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新規シナリオ作成
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">公開中</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.published}件
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">下書き</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {stats.draft}件
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">総学習者数</p>
                  <p className="text-3xl font-bold text-[#1971c2]">
                    {stats.totalLearners}名
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
                  placeholder="シナリオを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1971c2]"
              >
                <option value="all">すべてのカテゴリ</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1971c2]"
              >
                <option value="all">すべてのステータス</option>
                <option value="published">公開中</option>
                <option value="draft">下書き</option>
                <option value="archived">アーカイブ</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Scenarios Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイトル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      対象職級
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      難易度
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
                  {filteredScenarios.map((scenario) => (
                    <tr
                      key={scenario.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {scenario.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {scenario.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scenario.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {scenario.targetGrades.map((grade) => (
                            <span
                              key={grade}
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              {grade}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getDifficultyBadge(scenario.difficulty)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(scenario.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(scenario)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
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

        {/* Editor Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedScenario ? "シナリオ編集" : "新規シナリオ作成"}
                </h2>
                <button
                  onClick={handleCloseEditor}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold text-gray-900">基本情報</h3>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            タイトル
                          </label>
                          <Input
                            placeholder="例: AWS障害対応シナリオ"
                            defaultValue={selectedScenario?.title || ""}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            説明
                          </label>
                          <Textarea
                            placeholder="シナリオの概要を入力してください"
                            rows={3}
                            defaultValue={selectedScenario?.description || ""}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              カテゴリ
                            </label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1971c2]"
                              defaultValue={selectedScenario?.category || ""}
                            >
                              <option value="">選択してください</option>
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              難易度
                            </label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1971c2]"
                              defaultValue={selectedScenario?.difficulty || ""}
                            >
                              <option value="">選択してください</option>
                              <option value="beginner">初級</option>
                              <option value="intermediate">中級</option>
                              <option value="advanced">上級</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            対象職級
                          </label>
                          <div className="flex gap-3">
                            {["L1", "L2", "L3", "L4", "L5"].map((grade) => (
                              <label
                                key={grade}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-[#1971c2] border-gray-300 rounded focus:ring-[#1971c2]"
                                  defaultChecked={selectedScenario?.targetGrades.includes(
                                    grade
                                  )}
                                />
                                <span className="text-sm text-gray-700">
                                  {grade}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            推定学習時間（時間）
                          </label>
                          <Input
                            type="number"
                            placeholder="2"
                            className="w-32"
                            defaultValue={selectedScenario?.estimatedTime || ""}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Scenario Content */}
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold text-gray-900">
                          シナリオ本文
                        </h3>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            背景設定
                          </label>
                          <Textarea
                            placeholder="シナリオの背景を入力してください"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            課題
                          </label>
                          <Textarea
                            placeholder="解決すべき課題を入力してください"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            期待される行動
                          </label>
                          <Textarea
                            placeholder="期待される行動を入力してください"
                            rows={4}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - AI Assist & Preview */}
                  <div className="space-y-6">
                    {/* AI Assist */}
                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-gray-900">
                            AIアシスト
                          </h3>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          難易度を調整
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          評価基準を提案
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          類似シナリオを検索
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Related Skills */}
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold text-gray-900">
                          関連スキル
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                            AWS基礎
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                            障害対応
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                            ログ分析
                          </span>
                          <button className="px-3 py-1 border border-dashed border-gray-300 text-gray-500 text-sm rounded-full hover:border-[#1971c2] hover:text-[#1971c2] transition-colors">
                            + 追加
                          </button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold text-gray-900">
                          プレビュー
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          プレビューを表示
                        </Button>
                        {selectedScenario && (
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            最終保存: {selectedScenario.updatedAt}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <Button variant="outline" onClick={handleCloseEditor}>
                  キャンセル
                </Button>
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  下書き保存
                </Button>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  公開
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
