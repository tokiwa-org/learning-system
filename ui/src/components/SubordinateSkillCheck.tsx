import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  Circle,
  Filter,
  ExternalLink,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";

interface SkillItem {
  id: number;
  name: string;
  category: string;
  status: "achieved" | "in_progress" | "not_started";
  achievedDate?: string;
  evidence?: string;
  l1Required: boolean;
  l2Required: boolean;
  l3Required: boolean;
}

export const SubordinateSkillCheck: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const employee = {
    name: "佐藤 花子",
    grade: "L2",
    gradeLabel: "Mid-level",
    department: "開発部",
    avatar: "SH",
  };

  const stats = {
    totalItems: 82,
    achievedItems: 46,
    achievementRate: 56,
    gradeRequirementRate: 78,
  };

  const skillItems: SkillItem[] = [
    {
      id: 1,
      name: "ITリテラシー",
      category: "共通スキル",
      status: "achieved",
      achievedDate: "2025/03/15",
      evidence: "〇〇研修を修了",
      l1Required: true,
      l2Required: true,
      l3Required: true,
    },
    {
      id: 2,
      name: "ネットワーク基礎",
      category: "共通スキル",
      status: "achieved",
      achievedDate: "2025/04/20",
      evidence: "ネットワーク資格取得",
      l1Required: true,
      l2Required: true,
      l3Required: true,
    },
    {
      id: 3,
      name: "セキュリティ基礎",
      category: "共通スキル",
      status: "in_progress",
      l1Required: true,
      l2Required: true,
      l3Required: true,
    },
    {
      id: 4,
      name: "クラウド基礎",
      category: "技術スキル",
      status: "not_started",
      l1Required: false,
      l2Required: true,
      l3Required: true,
    },
    {
      id: 5,
      name: "AWS応用",
      category: "技術スキル",
      status: "achieved",
      achievedDate: "2025/06/10",
      evidence: "AWS認定取得",
      l1Required: false,
      l2Required: false,
      l3Required: true,
    },
    {
      id: 6,
      name: "プロジェクト管理",
      category: "職能発揮力",
      status: "in_progress",
      l1Required: false,
      l2Required: true,
      l3Required: true,
    },
    {
      id: 7,
      name: "チームワーク",
      category: "行動・貢献",
      status: "achieved",
      achievedDate: "2025/02/28",
      evidence: "チームリーダー経験",
      l1Required: true,
      l2Required: true,
      l3Required: true,
    },
    {
      id: 8,
      name: "技術指導",
      category: "行動・貢献",
      status: "not_started",
      l1Required: false,
      l2Required: false,
      l3Required: true,
    },
  ];

  const recommendedSkills = [
    { id: 3, name: "セキュリティ基礎", reason: "進行中 - 早期完了推奨" },
    { id: 4, name: "クラウド基礎", reason: "L2要件 - 未着手" },
    { id: 6, name: "プロジェクト管理", reason: "L2要件 - 進行中" },
  ];

  const filteredItems = skillItems.filter((item) => {
    const matchesSearch =
      item.name.includes(searchQuery) || item.category.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "achieved":
        return <Badge variant="success">達成済み</Badge>;
      case "in_progress":
        return <Badge variant="warning">進行中</Badge>;
      default:
        return <Badge variant="gray">未着手</Badge>;
    }
  };

  const getGradeIndicator = (required: boolean, grade: string) => {
    return (
      <span
        className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium ${
          required
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {grade}
      </span>
    );
  };

  return (
    <Layout userRole="manager">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <a
          href="#subordinate-list"
          className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          部下一覧に戻る
        </a>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#1971c2] text-white rounded-full flex items-center justify-center text-xl font-semibold">
              {employee.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                部下スキル確認
              </h1>
              <p className="text-lg text-gray-600">
                {employee.name}（{employee.grade} {employee.gradeLabel}）
              </p>
              <p className="text-sm text-gray-500">{employee.department}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">達成項目</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.achievedItems}/{stats.totalItems}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">項目</p>
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
                  <p className="text-sm text-gray-600 mb-1">達成率</p>
                  <p className="text-3xl font-bold text-[#1971c2]">
                    {stats.achievementRate}%
                  </p>
                  <Progress value={stats.achievementRate} className="mt-2 w-24" />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-[#1971c2]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">職級要件充足</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.gradeRequirementRate}%
                  </p>
                  <Progress value={stats.gradeRequirementRate} className="mt-2 w-24" />
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">全体 (82)</TabsTrigger>
            <TabsTrigger value="skill">スキル習得度 (46)</TabsTrigger>
            <TabsTrigger value="competency">職能発揮力 (27)</TabsTrigger>
            <TabsTrigger value="behavior">行動・貢献 (9)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="スキルを検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === "all" ? "default" : "outline"}
                      onClick={() => setStatusFilter("all")}
                    >
                      すべて
                    </Button>
                    <Button
                      variant={statusFilter === "achieved" ? "default" : "outline"}
                      onClick={() => setStatusFilter("achieved")}
                    >
                      達成済み
                    </Button>
                    <Button
                      variant={statusFilter === "in_progress" ? "default" : "outline"}
                      onClick={() => setStatusFilter("in_progress")}
                    >
                      進行中
                    </Button>
                    <Button
                      variant={statusFilter === "not_started" ? "default" : "outline"}
                      onClick={() => setStatusFilter("not_started")}
                    >
                      未着手
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skill Matrix Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          スキル項目
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          カテゴリ
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          L1
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          L2
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          L3
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          達成状況
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(item.status)}
                              <span className="font-medium text-gray-900">
                                No.{item.id} {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {getGradeIndicator(item.l1Required, "L1")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {getGradeIndicator(item.l2Required, "L2")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {getGradeIndicator(item.l3Required, "L3")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {getStatusBadge(item.status)}
                              {item.achievedDate && (
                                <p className="text-xs text-gray-500">
                                  {item.achievedDate}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button variant="ghost" size="sm">
                              詳細を見る
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    次に習得すべきスキル（推奨）
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendedSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{skill.name}</p>
                        <p className="text-sm text-gray-600">{skill.reason}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        詳細
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skill" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                スキル習得度の項目がここに表示されます
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competency" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                職能発揮力の項目がここに表示されます
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                行動・貢献の項目がここに表示されます
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};
