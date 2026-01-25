import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Target,
  Download,
  Filter,
  Calendar,
  Building2,
  Star,
  Activity,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from "recharts";

interface DepartmentData {
  department: string;
  avgScore: number;
  count: number;
  maxScore: number;
  minScore: number;
}

interface PeriodTrendData {
  period: string;
  avgScore: number;
  selfAvg: number;
  managerAvg: number;
}

interface PositionData {
  position: string;
  avgScore: number;
  count: number;
}

interface ScoreDistribution {
  range: string;
  count: number;
}

interface EvaluationItemData {
  item: string;
  score: number;
  fullMark: number;
}

export const EvaluationAnalytics: React.FC = () => {
  const [periodFilter, setPeriodFilter] = useState<string>("2025年度 上半期");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // 統計サマリーデータ
  const summaryStats = {
    totalEvaluations: 245,
    avgScore: 4.15,
    maxScore: 4.9,
    minScore: 2.8,
    completionRate: 87,
    improvementRate: 12
  };

  // 部署別データ
  const departmentData: DepartmentData[] = [
    { department: "営業部", avgScore: 4.2, count: 58, maxScore: 4.8, minScore: 3.2 },
    { department: "開発部", avgScore: 4.3, count: 72, maxScore: 4.9, minScore: 3.5 },
    { department: "マーケティング部", avgScore: 4.1, count: 35, maxScore: 4.6, minScore: 3.0 },
    { department: "人事部", avgScore: 4.0, count: 28, maxScore: 4.5, minScore: 3.3 },
    { department: "経理部", avgScore: 4.2, count: 32, maxScore: 4.7, minScore: 3.4 },
    { department: "総務部", avgScore: 3.9, count: 20, maxScore: 4.4, minScore: 2.8 }
  ];

  // 期間トレンドデータ
  const periodTrendData: PeriodTrendData[] = [
    { period: "2023下", avgScore: 3.8, selfAvg: 3.9, managerAvg: 3.7 },
    { period: "2024上", avgScore: 3.9, selfAvg: 4.0, managerAvg: 3.8 },
    { period: "2024下", avgScore: 4.0, selfAvg: 4.1, managerAvg: 3.9 },
    { period: "2025上", avgScore: 4.15, selfAvg: 4.2, managerAvg: 4.1 }
  ];

  // 役職別データ
  const positionData: PositionData[] = [
    { position: "部長", avgScore: 4.5, count: 8 },
    { position: "課長", avgScore: 4.3, count: 24 },
    { position: "主任", avgScore: 4.2, count: 45 },
    { position: "一般社員", avgScore: 4.0, count: 158 },
    { position: "新入社員", avgScore: 3.7, count: 10 }
  ];

  // スコア分布
  const scoreDistribution: ScoreDistribution[] = [
    { range: "1.0-1.9", count: 2 },
    { range: "2.0-2.9", count: 8 },
    { range: "3.0-3.9", count: 45 },
    { range: "4.0-4.4", count: 112 },
    { range: "4.5-5.0", count: 78 }
  ];

  // 評価項目別平均スコア（レーダーチャート用）
  const evaluationItemData: EvaluationItemData[] = [
    { item: "業務遂行能力", score: 4.3, fullMark: 5 },
    { item: "コミュニケーション", score: 4.1, fullMark: 5 },
    { item: "リーダーシップ", score: 3.9, fullMark: 5 },
    { item: "問題解決力", score: 4.2, fullMark: 5 },
    { item: "成長意欲", score: 4.4, fullMark: 5 },
    { item: "チームワーク", score: 4.3, fullMark: 5 }
  ];

  // 自己評価 vs 上司評価
  const selfVsManagerData = [
    { department: "営業部", self: 4.3, manager: 4.1 },
    { department: "開発部", self: 4.4, manager: 4.2 },
    { department: "マーケティング部", self: 4.2, manager: 4.0 },
    { department: "人事部", self: 4.1, manager: 3.9 },
    { department: "経理部", self: 4.3, manager: 4.1 },
    { department: "総務部", self: 4.0, manager: 3.8 }
  ];

  // チャートカラー
  const COLORS = ["#1971c2", "#0c8599", "#0ca678", "#37b24d", "#94d82d", "#fcc419"];

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">評価統計・分析</h1>
            <p className="text-gray-600 mt-1">評価データの統計分析とトレンドを確認できます</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              レポートをダウンロード
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              詳細フィルター
            </Button>
          </div>
        </div>

        {/* フィルター */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="2025年度 上半期">2025年度 上半期</option>
                  <option value="2024年度 下半期">2024年度 下半期</option>
                  <option value="2024年度 上半期">2024年度 上半期</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">すべての部署</option>
                  <option value="営業部">営業部</option>
                  <option value="開発部">開発部</option>
                  <option value="マーケティング部">マーケティング部</option>
                  <option value="人事部">人事部</option>
                  <option value="経理部">経理部</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">総評価数</p>
                  <p className="text-xl font-bold text-gray-900">{summaryStats.totalEvaluations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">平均スコア</p>
                  <p className="text-xl font-bold text-gray-900">{summaryStats.avgScore.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">最高スコア</p>
                  <p className="text-xl font-bold text-gray-900">{summaryStats.maxScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Target className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">最低スコア</p>
                  <p className="text-xl font-bold text-gray-900">{summaryStats.minScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">完了率</p>
                  <p className="text-xl font-bold text-gray-900">{summaryStats.completionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">前期比</p>
                  <p className="text-xl font-bold text-teal-600">+{summaryStats.improvementRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* メインチャートエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 部署別平均スコア */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">部署別平均スコア</h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="department" 
                    tick={{ fontSize: 12 }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgScore" fill="#1971c2" name="平均スコア" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                {departmentData.map((dept, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">{dept.department}: {dept.count}名</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 評価トレンド */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">評価トレンド</h3>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={periodTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[3.5, 4.5]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke="#1971c2" 
                    strokeWidth={3}
                    name="平均スコア"
                    dot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="selfAvg" 
                    stroke="#0ca678" 
                    strokeWidth={2}
                    name="自己評価"
                    dot={{ r: 4 }}
                    strokeDasharray="5 5"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="managerAvg" 
                    stroke="#fd7e14" 
                    strokeWidth={2}
                    name="上司評価"
                    dot={{ r: 4 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">
                    前期比: <span className="font-semibold text-green-600">+3.8%</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 追加チャート */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 役職別平均スコア */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">役職別平均スコア</h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={positionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="position" type="category" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#0c8599" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* スコア分布 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">スコア分布</h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 評価項目別スコア（レーダーチャート） */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">評価項目別スコア</h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={evaluationItemData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="item" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} />
                  <Radar 
                    name="平均スコア" 
                    dataKey="score" 
                    stroke="#1971c2" 
                    fill="#1971c2" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 自己評価 vs 上司評価 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">自己評価 vs 上司評価（部署別）</h3>
              <Badge variant="outline">ギャップ分析</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={selfVsManagerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[3.5, 4.5]} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="self" 
                  stackId="1"
                  stroke="#0ca678" 
                  fill="#0ca678"
                  fillOpacity={0.6}
                  name="自己評価"
                />
                <Area 
                  type="monotone" 
                  dataKey="manager" 
                  stackId="2"
                  stroke="#fd7e14" 
                  fill="#fd7e14"
                  fillOpacity={0.6}
                  name="上司評価"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>分析結果:</strong> 自己評価が上司評価より平均0.2ポイント高い傾向があります。
                特に営業部とマーケティング部でギャップが大きく、目標設定や評価基準の再確認が推奨されます。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 部署別詳細テーブル */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">部署別詳細統計</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部署
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      評価数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      平均スコア
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最高スコア
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最低スコア
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      評価レンジ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentData.map((dept, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{dept.department}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{dept.count}名</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {dept.avgScore.toFixed(2)}
                          </span>
                          <Badge 
                            variant={dept.avgScore >= 4.2 ? "success" : dept.avgScore >= 4.0 ? "default" : "secondary"}
                          >
                            {dept.avgScore >= 4.2 ? "優秀" : dept.avgScore >= 4.0 ? "良好" : "標準"}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-green-600 font-semibold">
                          {dept.maxScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-red-600 font-semibold">
                          {dept.minScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
                              style={{ 
                                width: `${((dept.maxScore - dept.minScore) / 5) * 100}%`,
                                marginLeft: `${(dept.minScore / 5) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {(dept.maxScore - dept.minScore).toFixed(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* インサイトカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">ポジティブトレンド</h4>
                  <p className="text-sm text-gray-600">
                    開発部の平均スコアが前期比+8%と最も高い伸びを記録。
                    新しい研修プログラムの効果が表れています。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Activity className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">改善の機会</h4>
                  <p className="text-sm text-gray-600">
                    総務部の評価レンジが1.6と最も広く、評価基準の標準化や
                    目標設定の見直しが推奨されます。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
