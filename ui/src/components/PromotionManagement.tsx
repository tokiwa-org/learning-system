import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Star,
  AlertCircle,
} from "lucide-react";

interface PromotionCandidate {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  currentGrade: string;
  targetGrade: string;
  score: number;
  rank: string;
  status: "pending" | "approved" | "rejected";
  avatar: string;
  requirements: {
    skillAchievement: { achieved: number; required: number };
    competencyAchievement: { achieved: number; required: number };
    behaviorAchievement: { achieved: number; required: number };
    tenure: { years: number; required: number };
    recentEvaluation: { rank: string; required: string };
  };
}

export const PromotionManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<PromotionCandidate | null>(null);

  const stats = {
    totalCandidates: 8,
    approved: 3,
    pending: 5,
  };

  const candidates: PromotionCandidate[] = [
    {
      id: 1,
      name: "田中 太郎",
      employeeId: "EMP001",
      department: "開発部",
      currentGrade: "L2",
      targetGrade: "L3",
      score: 92,
      rank: "S",
      status: "pending",
      avatar: "TT",
      requirements: {
        skillAchievement: { achieved: 45, required: 46 },
        competencyAchievement: { achieved: 25, required: 27 },
        behaviorAchievement: { achieved: 9, required: 9 },
        tenure: { years: 2, required: 1 },
        recentEvaluation: { rank: "S", required: "B" },
      },
    },
    {
      id: 2,
      name: "佐藤 花子",
      employeeId: "EMP002",
      department: "開発部",
      currentGrade: "L2",
      targetGrade: "L3",
      score: 88,
      rank: "A",
      status: "pending",
      avatar: "SH",
      requirements: {
        skillAchievement: { achieved: 44, required: 46 },
        competencyAchievement: { achieved: 26, required: 27 },
        behaviorAchievement: { achieved: 9, required: 9 },
        tenure: { years: 3, required: 1 },
        recentEvaluation: { rank: "A", required: "B" },
      },
    },
    {
      id: 3,
      name: "山本 健太",
      employeeId: "EMP003",
      department: "営業部",
      currentGrade: "L1",
      targetGrade: "L2",
      score: 85,
      rank: "A",
      status: "approved",
      avatar: "YK",
      requirements: {
        skillAchievement: { achieved: 30, required: 30 },
        competencyAchievement: { achieved: 18, required: 18 },
        behaviorAchievement: { achieved: 6, required: 6 },
        tenure: { years: 2, required: 1 },
        recentEvaluation: { rank: "A", required: "B" },
      },
    },
    {
      id: 4,
      name: "鈴木 一郎",
      employeeId: "EMP004",
      department: "総務部",
      currentGrade: "L2",
      targetGrade: "L3",
      score: 78,
      rank: "B",
      status: "pending",
      avatar: "SI",
      requirements: {
        skillAchievement: { achieved: 40, required: 46 },
        competencyAchievement: { achieved: 22, required: 27 },
        behaviorAchievement: { achieved: 8, required: 9 },
        tenure: { years: 4, required: 1 },
        recentEvaluation: { rank: "B", required: "B" },
      },
    },
    {
      id: 5,
      name: "高橋 由美",
      employeeId: "EMP005",
      department: "開発部",
      currentGrade: "L3",
      targetGrade: "L4",
      score: 90,
      rank: "S",
      status: "approved",
      avatar: "TY",
      requirements: {
        skillAchievement: { achieved: 60, required: 60 },
        competencyAchievement: { achieved: 35, required: 35 },
        behaviorAchievement: { achieved: 12, required: 12 },
        tenure: { years: 5, required: 2 },
        recentEvaluation: { rank: "S", required: "A" },
      },
    },
  ];

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.includes(searchQuery) ||
      candidate.employeeId.includes(searchQuery) ||
      candidate.department.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getRankBadge = (rank: string) => {
    const colors: Record<string, string> = {
      S: "bg-yellow-100 text-yellow-800 border-yellow-300",
      A: "bg-blue-100 text-blue-800 border-blue-300",
      B: "bg-green-100 text-green-800 border-green-300",
      C: "bg-orange-100 text-orange-800 border-orange-300",
      D: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return (
      <span
        className={`px-2 py-1 rounded border text-sm font-semibold ${colors[rank] || colors.D}`}
      >
        {rank}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">承認済</Badge>;
      case "rejected":
        return <Badge variant="error">却下</Badge>;
      default:
        return <Badge variant="warning">審議中</Badge>;
    }
  };

  const checkRequirement = (achieved: number | string, required: number | string) => {
    if (typeof achieved === "number" && typeof required === "number") {
      return achieved >= required;
    }
    // For rank comparison
    const rankOrder = ["D", "C", "B", "A", "S"];
    return rankOrder.indexOf(achieved as string) >= rankOrder.indexOf(required as string);
  };

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">昇格管理</h1>
            <p className="text-gray-600 mt-1">2025年度</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            昇格一覧エクスポート
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">昇格候補</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalCandidates}名
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">承認済</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.approved}名
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
                  <p className="text-sm text-gray-600 mb-1">審議中</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pending}名
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
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
                  placeholder="社員名、社員ID、部署で検索"
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
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                >
                  審議中
                </Button>
                <Button
                  variant={statusFilter === "approved" ? "default" : "outline"}
                  onClick={() => setStatusFilter("approved")}
                >
                  承認済
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidates Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          氏名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          昇格
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          スコア
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ランク
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
                      {filteredCandidates.map((candidate) => (
                        <tr
                          key={candidate.id}
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            selectedCandidate?.id === candidate.id
                              ? "bg-blue-50"
                              : ""
                          }`}
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-[#1971c2] text-white flex items-center justify-center font-semibold mr-3">
                                {candidate.avatar}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {candidate.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {candidate.department}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-sm">
                              <span className="font-medium">
                                {candidate.currentGrade}
                              </span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-[#1971c2]">
                                {candidate.targetGrade}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-bold text-gray-900">
                              {candidate.score}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRankBadge(candidate.rank)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(candidate.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {candidate.status === "pending" && (
                              <Button size="sm">承認</Button>
                            )}
                            {candidate.status === "approved" && (
                              <Button variant="outline" size="sm">
                                詳細
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

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedCandidate ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1971c2] text-white flex items-center justify-center font-semibold">
                      {selectedCandidate.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedCandidate.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedCandidate.currentGrade} → {selectedCandidate.targetGrade}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      昇格要件達成状況
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {checkRequirement(
                            selectedCandidate.requirements.skillAchievement.achieved,
                            selectedCandidate.requirements.skillAchievement.required
                          ) ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            スキル習得度
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {selectedCandidate.requirements.skillAchievement.achieved}/
                          {selectedCandidate.requirements.skillAchievement.required}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {checkRequirement(
                            selectedCandidate.requirements.competencyAchievement.achieved,
                            selectedCandidate.requirements.competencyAchievement.required
                          ) ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            職能発揮力
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {selectedCandidate.requirements.competencyAchievement.achieved}/
                          {selectedCandidate.requirements.competencyAchievement.required}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {checkRequirement(
                            selectedCandidate.requirements.behaviorAchievement.achieved,
                            selectedCandidate.requirements.behaviorAchievement.required
                          ) ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            行動・貢献
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {selectedCandidate.requirements.behaviorAchievement.achieved}/
                          {selectedCandidate.requirements.behaviorAchievement.required}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {checkRequirement(
                            selectedCandidate.requirements.tenure.years,
                            selectedCandidate.requirements.tenure.required
                          ) ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            在籍期間
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {selectedCandidate.requirements.tenure.years}年
                          (要件: {selectedCandidate.requirements.tenure.required}年以上)
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {checkRequirement(
                            selectedCandidate.requirements.recentEvaluation.rank,
                            selectedCandidate.requirements.recentEvaluation.required
                          ) ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            直近評価
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {selectedCandidate.requirements.recentEvaluation.rank}
                          (要件: {selectedCandidate.requirements.recentEvaluation.required}以上)
                        </span>
                      </li>
                    </ul>
                  </div>

                  {selectedCandidate.status === "pending" && (
                    <div className="pt-4 border-t border-gray-200">
                      <Button className="w-full" size="lg">
                        <Award className="w-4 h-4 mr-2" />
                        昇格承認
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>候補者を選択してください</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
