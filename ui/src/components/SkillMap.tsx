import React, { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

interface SkillItem {
  id: number;
  no: number;
  title: string;
  status: "achieved" | "in-progress" | "not-started";
}

export const SkillMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState("skill");

  const summaryData = [
    { label: "スキル習得度", achieved: 30, total: 46, percentage: 65 },
    { label: "職能発揮力", achieved: 15, total: 27, percentage: 56 },
    { label: "行動・貢献", achieved: 7, total: 9, percentage: 78 }
  ];

  const categoryData = [
    { category: "共通スキル", achieved: 10, inProgress: 3, notStarted: 2 },
    { category: "技術スキル", achieved: 15, inProgress: 5, notStarted: 8 },
    { category: "ビジネススキル", achieved: 5, inProgress: 2, notStarted: 3 }
  ];

  const skillItems: SkillItem[] = [
    { id: 1, no: 1, title: "ITリテラシー", status: "achieved" },
    { id: 2, no: 2, title: "ネットワーク基礎", status: "achieved" },
    { id: 3, no: 3, title: "セキュリティ基礎", status: "in-progress" },
    { id: 4, no: 4, title: "クラウド基礎", status: "not-started" },
    { id: 5, no: 5, title: "データベース基礎", status: "achieved" },
    { id: 6, no: 6, title: "プログラミング基礎", status: "in-progress" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle2 className="w-5 h-5 text-success-500" />;
      case "in-progress":
        return <Loader2 className="w-5 h-5 text-warning-500" />;
      case "not-started":
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "achieved":
        return <Badge variant="success">達成</Badge>;
      case "in-progress":
        return <Badge variant="warning">進行中</Badge>;
      case "not-started":
        return <Badge variant="gray">未着手</Badge>;
    }
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">スキルマップ</h1>
          <p className="text-lg text-gray-600">田中太郎 / L2 Mid-level</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryData.map((item) => (
            <Card key={item.label}>
              <CardContent className="py-4">
                <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {item.achieved}/{item.total}
                </p>
                <Progress value={item.percentage} showLabel />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* L2 Requirements Progress */}
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">L2に必要な項目</h3>
              <span className="text-primary-700 font-semibold">75%</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">45/60達成</p>
            <div className="w-full bg-primary-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-primary-500 h-full rounded-full transition-all"
                style={{ width: "75%" }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="skill">
          <TabsList>
            <TabsTrigger value="skill">スキル習得度</TabsTrigger>
            <TabsTrigger value="competency">職能発揮力</TabsTrigger>
            <TabsTrigger value="behavior">行動・貢献</TabsTrigger>
          </TabsList>

          <TabsContent value="skill" className="mt-6 space-y-6">
            {/* Category Table */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">カテゴリ別達成状況</h3>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          カテゴリ
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          達成
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          進行中
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          未着手
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryData.map((row) => (
                        <tr key={row.category} className="border-b border-gray-200">
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {row.category}
                          </td>
                          <td className="py-3 px-4 text-success-600 font-semibold">
                            {row.achieved}
                          </td>
                          <td className="py-3 px-4 text-warning-600 font-semibold">
                            {row.inProgress}
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {row.notStarted}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Skill Items List */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">スキル項目</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {skillItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <span className="font-medium text-gray-900">
                          No.{item.no} {item.title}
                        </span>
                      </div>
                      {getStatusBadge(item.status)}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competency" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                職能発揮力のスキルマップがここに表示されます
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                行動・貢献のスキルマップがここに表示されます
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};