import React from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

export const EvaluationResult: React.FC = () => {
  const totalScore = 83;
  const rank = "A";
  const salaryIncrease = 3;

  const scoreBreakdown = [
    { category: "スキル習得度", score: 42.5, max: 50, percentage: 85 },
    { category: "職能発揮力", score: 24.0, max: 30, percentage: 80 },
    { category: "行動・貢献", score: 16.5, max: 20, percentage: 82.5 }
  ];

  const rankTable = [
    { rank: "S", range: "90点以上", salary: "+5号俸" },
    { rank: "A", range: "75-89点", salary: "+3号俸", current: true },
    { rank: "B", range: "60-74点", salary: "+2号俸" },
    { rank: "C", range: "45-59点", salary: "+1号俸" },
    { rank: "D", range: "44点以下", salary: "+0号俸" }
  ];

  return (
    <Layout userRole="employee">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">評価結果確認</h1>
          <p className="text-lg text-gray-600">2025年度 評価結果</p>
        </div>

        {/* Employee Info Card */}
        <Card className="bg-gradient-to-r from-primary-50 to-white border-primary-200">
          <CardContent className="py-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary-300 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-bold text-3xl">田</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">田中太郎</h2>
                <p className="text-gray-700 mb-2">L2 Mid-level / 開発部</p>
                <Badge variant="purple" className="px-3 py-1">
                  確定
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Card */}
        <Card className="border-2 border-primary-200">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              {/* Circular Chart Placeholder */}
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1971c2"
                      strokeWidth="8"
                      strokeDasharray={`${totalScore * 2.51} 251`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <p className="text-4xl font-bold text-gray-900">{totalScore}</p>
                      <p className="text-sm text-gray-600">/ 100点</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  総合スコア: {totalScore}点
                </h3>
                <Badge variant="blue" className="text-lg px-6 py-2">
                  ランク {rank}
                </Badge>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-6">
                <p className="text-xl font-semibold text-success-600">
                  昇給: +{salaryIncrease}号俸
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 text-lg">スコア内訳</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {scoreBreakdown.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">
                    {item.category} ({item.max}点満点):
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {item.score}点
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary-500 h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 text-lg">上司コメント</h3>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border-l-4 border-primary-500 p-4 rounded">
              <p className="text-gray-800 leading-relaxed">
                今期は大きく成長しました。特にAWS関連のスキルが向上しており、インフラ設計の品質も高まっています。
                チームメンバーとのコミュニケーションも良好で、プロジェクトを円滑に進める上で重要な役割を果たしています。
                次のステップとして、より複雑なシステム設計に挑戦し、後輩の育成にも積極的に関わっていくことを期待しています。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rank Explanation Table */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 text-lg">ランク説明</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">ランク</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">スコア範囲</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">昇給</th>
                  </tr>
                </thead>
                <tbody>
                  {rankTable.map((row) => (
                    <tr
                      key={row.rank}
                      className={`border-b border-gray-200 ${
                        row.current ? "bg-primary-50" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">
                          {row.rank}
                          {row.current && (
                            <span className="ml-2 text-sm text-primary-600">(あなた)</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{row.range}</td>
                      <td className="py-3 px-4 text-gray-700">{row.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};