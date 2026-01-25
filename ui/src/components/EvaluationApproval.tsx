import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  ArrowLeft,
  Check,
  X,
  Edit,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Star,
} from "lucide-react";

export function EvaluationApproval() {
  const [selectedTab, setSelectedTab] = useState<"pending" | "completed">("pending");
  const [adjustmentComment, setAdjustmentComment] = useState("");

  // 承認待ち評価
  const pendingEvaluations = [
    {
      id: 1,
      employee: { name: "山田 太郎", id: "EMP001", position: "シニアエンジニア", avatar: "YT" },
      evaluator: "あなた",
      selfScore: 4.2,
      managerScore: 4.5,
      difference: 0.3,
      status: "確認中",
      submittedDate: "2026-01-20",
      categories: [
        { name: "業務遂行能力", self: 4, manager: 5, diff: 1 },
        { name: "コミュニケーション", self: 3, manager: 4, diff: 1 },
        { name: "リーダーシップ", self: 4, manager: 4, diff: 0 },
        { name: "専門知識", self: 5, manager: 5, diff: 0 },
        { name: "問題解決能力", self: 5, manager: 4, diff: -1 },
      ],
    },
    {
      id: 2,
      employee: { name: "佐藤 花子", id: "EMP002", position: "エンジニア", avatar: "SH" },
      evaluator: "あなた",
      selfScore: 3.8,
      managerScore: 4.0,
      difference: 0.2,
      status: "確認中",
      submittedDate: "2026-01-21",
      categories: [
        { name: "業務遂行能力", self: 4, manager: 4, diff: 0 },
        { name: "コミュニケーション", self: 4, manager: 4, diff: 0 },
        { name: "リーダーシップ", self: 3, manager: 4, diff: 1 },
        { name: "専門知識", self: 4, manager: 4, diff: 0 },
        { name: "問題解決能力", self: 4, manager: 4, diff: 0 },
      ],
    },
  ];

  // 承認済み評価
  const completedEvaluations = [
    {
      id: 3,
      employee: { name: "鈴木 一郎", id: "EMP003", position: "ジュニアエンジニア", avatar: "SI" },
      evaluator: "あなた",
      selfScore: 3.4,
      managerScore: 3.6,
      finalScore: 3.6,
      status: "承認済み",
      approvedDate: "2026-01-19",
    },
  ];

  const [selectedEvaluation, setSelectedEvaluation] = useState(pendingEvaluations[0]);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  const handleApprove = (id: number) => {
    alert("評価を承認しました");
    window.location.hash = "manager-dashboard";
  };

  const handleReject = (id: number) => {
    if (!adjustmentComment.trim()) {
      alert("差し戻し理由を入力してください");
      return;
    }
    alert("評価を差し戻しました");
    setShowAdjustmentModal(false);
    window.location.hash = "manager-dashboard";
  };

  const handleAdjust = () => {
    setShowAdjustmentModal(true);
  };

  const renderScoreDifference = (diff: number) => {
    if (diff === 0) {
      return <Badge variant="default">一致</Badge>;
    } else if (diff > 0) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />+{diff}
        </Badge>
      );
    } else {
      return (
        <Badge variant="error" className="flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          {diff}
        </Badge>
      );
    }
  };

  const renderStars = (score: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= score ? "fill-[#fab005] text-[#fab005]" : "fill-none text-gray-300"
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => (window.location.hash = "manager-dashboard")}>
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">評価承認・調整</h1>
            <p className="text-gray-600">評価内容を確認し、承認または調整してください</p>
          </div>
        </div>

        {/* タブ */}
        <div className="border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setSelectedTab("pending")}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                selectedTab === "pending"
                  ? "border-[#1971c2] text-[#1971c2] font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              承認待ち ({pendingEvaluations.length})
            </button>
            <button
              onClick={() => setSelectedTab("completed")}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                selectedTab === "completed"
                  ? "border-[#1971c2] text-[#1971c2] font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              承認済み ({completedEvaluations.length})
            </button>
          </div>
        </div>

        {selectedTab === "pending" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 評価リスト */}
            <div className="lg:col-span-1 space-y-3">
              {pendingEvaluations.map((evaluation) => (
                <Card
                  key={evaluation.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedEvaluation.id === evaluation.id
                      ? "ring-2 ring-[#1971c2] shadow-md"
                      : ""
                  }`}
                  onClick={() => setSelectedEvaluation(evaluation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1971c2] text-white flex items-center justify-center font-semibold">
                          {evaluation.employee.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {evaluation.employee.name}
                          </h3>
                          <p className="text-xs text-gray-500">{evaluation.employee.position}</p>
                        </div>
                      </div>
                      <Badge variant="warning">{evaluation.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">本人評価</p>
                        <p className="font-semibold text-[#1971c2]">{evaluation.selfScore}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">上司評価</p>
                        <p className="font-semibold text-[#fab005]">{evaluation.managerScore}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      提出日: {evaluation.submittedDate}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 評価詳細 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 社員情報 */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-[#1971c2]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#1971c2] text-white flex items-center justify-center text-2xl font-bold">
                        {selectedEvaluation.employee.avatar}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {selectedEvaluation.employee.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {selectedEvaluation.employee.id} / {selectedEvaluation.employee.position}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          提出日: {selectedEvaluation.submittedDate}
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning" className="text-lg px-4 py-2">
                      {selectedEvaluation.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* スコア比較 */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">スコア比較</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">本人評価</p>
                      <p className="text-4xl font-bold text-[#1971c2]">
                        {selectedEvaluation.selfScore}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">上司評価</p>
                      <p className="text-4xl font-bold text-[#fab005]">
                        {selectedEvaluation.managerScore}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">差異</p>
                      <p
                        className={`text-4xl font-bold ${
                          selectedEvaluation.difference > 0
                            ? "text-[#40c057]"
                            : selectedEvaluation.difference < 0
                            ? "text-[#fa5252]"
                            : "text-gray-500"
                        }`}
                      >
                        {selectedEvaluation.difference > 0 ? "+" : ""}
                        {selectedEvaluation.difference}
                      </p>
                    </div>
                  </div>

                  {/* カテゴリ別比較 */}
                  <div className="space-y-4">
                    {selectedEvaluation.categories.map((category, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          {renderScoreDifference(category.diff)}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">本人評価</p>
                            {renderStars(category.self)}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">上司評価</p>
                            {renderStars(category.manager)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 差異が大きい項目の警告 */}
              {selectedEvaluation.categories.some((c) => Math.abs(c.diff) >= 2) && (
                <Card className="border-[#fab005] bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#fab005] flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">評価差異の確認</h3>
                        <p className="text-sm text-gray-700">
                          本人評価と上司評価で2段階以上の差異がある項目があります。調整が必要か確認してください。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* アクションボタン */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <Button className="flex-1" size="lg" onClick={() => handleApprove(selectedEvaluation.id)}>
                      <Check className="w-5 h-5" />
                      承認する
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="lg"
                      onClick={handleAdjust}
                    >
                      <Edit className="w-5 h-5" />
                      調整・差し戻し
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* 承認済みリスト */
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
                        本人評価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        上司評価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最終評価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        承認日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {completedEvaluations.map((evaluation) => (
                      <tr key={evaluation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#1971c2] text-white flex items-center justify-center font-semibold mr-3">
                              {evaluation.employee.avatar}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {evaluation.employee.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {evaluation.employee.position}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1971c2]">
                          {evaluation.selfScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#fab005]">
                          {evaluation.managerScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#40c057]">
                          {evaluation.finalScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {evaluation.approvedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="success">{evaluation.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 調整モーダル */}
        {showAdjustmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <h2 className="text-xl font-semibold text-gray-900">評価の調整・差し戻し</h2>
                <button
                  onClick={() => setShowAdjustmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    差し戻し理由 <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="調整が必要な理由や修正してほしい内容を入力してください"
                    value={adjustmentComment}
                    onChange={(e) => setAdjustmentComment(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowAdjustmentModal(false)}>
                    キャンセル
                  </Button>
                  <Button variant="destructive" onClick={() => handleReject(selectedEvaluation.id)}>
                    <X className="w-4 h-4" />
                    差し戻す
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
