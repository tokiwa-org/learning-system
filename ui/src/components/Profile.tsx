import React from "react";
import { ArrowRight } from "lucide-react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export const Profile: React.FC = () => {
  return (
    <Layout userRole="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900">プロフィール</h1>

        {/* Profile Section */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary-300 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-bold text-3xl">田</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">田中 太郎</h2>
                <p className="text-gray-600 mb-2">tanaka@example.com</p>
                <Badge variant="blue" className="px-3 py-1">
                  L2 Mid-level
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 text-lg">基本情報</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">社員番号</p>
                <p className="text-gray-900 font-medium">EMP-001</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">部署</p>
                <p className="text-gray-900 font-medium">開発部</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">職級</p>
                <p className="text-gray-900 font-medium">L2 (Mid-level)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">入社日</p>
                <p className="text-gray-900 font-medium">2020/04/01</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">上司</p>
                <p className="text-gray-900 font-medium">山田部長</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">現在の号俸</p>
                <p className="text-gray-900 font-medium">15号</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Period Section */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 text-lg">2025年度 評価状況</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">ステータス</p>
              <Badge variant="blue">自己評価提出済み</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">現在のステップ</p>
              <p className="text-gray-900 font-medium">同僚評価待ち</p>
            </div>
          </CardContent>
        </Card>

        {/* Skill Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-lg">スキル達成状況</h3>
            <a
              href="#skill-map"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              スキルマップを見る
              <ArrowRight className="w-4 h-4" />
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">46/82項目達成</span>
                <span className="text-gray-700 font-semibold">56%</span>
              </div>
              <Progress value={56} />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};