import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  FileSpreadsheet, 
  Plus,
  Edit2,
  Trash2,
  Search,
  Copy,
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Star,
  CheckCircle
} from "lucide-react";

interface EvaluationItem {
  id: string;
  category: string;
  name: string;
  description: string;
  weight: number;
  scale: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "archived";
  targetRole: string[];
  evaluationItems: EvaluationItem[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export const EvaluationTemplate: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // テンプレートデータ
  const templates: Template[] = [
    {
      id: "1",
      name: "一般社員向け評価テンプ���ート",
      description: "一般社員の業務遂行能力、コミュニケーション力、成長意欲を評価",
      status: "active",
      targetRole: ["一般社員", "主任"],
      evaluationItems: [
        {
          id: "1-1",
          category: "業務遂行能力",
          name: "業務の質",
          description: "担当業務を正確かつ効率的に遂行できているか",
          weight: 25,
          scale: 5
        },
        {
          id: "1-2",
          category: "業務遂行能力",
          name: "業務の量",
          description: "期待される業務量を達成できているか",
          weight: 20,
          scale: 5
        },
        {
          id: "1-3",
          category: "コミュニケーション",
          name: "チームワーク",
          description: "チームメンバーと協力して業務を進められるか",
          weight: 20,
          scale: 5
        },
        {
          id: "1-4",
          category: "コミュニケーション",
          name: "報告・連絡・相談",
          description: "適切なタイミングで報連相ができているか",
          weight: 15,
          scale: 5
        },
        {
          id: "1-5",
          category: "成長・意欲",
          name: "自己啓発",
          description: "自ら学び、スキルアップに取り組んでいるか",
          weight: 10,
          scale: 5
        },
        {
          id: "1-6",
          category: "成長・意欲",
          name: "改善提案",
          description: "業務改善のための提案や実行ができているか",
          weight: 10,
          scale: 5
        }
      ],
      createdAt: "2024-01-15",
      updatedAt: "2025-01-10",
      usageCount: 185
    },
    {
      id: "2",
      name: "管理職向け評価テンプレート",
      description: "管理職のマネジメント能力、リーダーシップ、戦略的思考を評価",
      status: "active",
      targetRole: ["課長", "部長"],
      evaluationItems: [
        {
          id: "2-1",
          category: "マネジメント",
          name: "目標達成",
          description: "部署・チームの目標を達成できているか",
          weight: 30,
          scale: 5
        },
        {
          id: "2-2",
          category: "マネジメント",
          name: "部下育成",
          description: "部下の成長をサポートし、育成できているか",
          weight: 25,
          scale: 5
        },
        {
          id: "2-3",
          category: "リーダーシップ",
          name: "チーム牽引",
          description: "チームを適切に導き、モチベーションを高められるか",
          weight: 20,
          scale: 5
        },
        {
          id: "2-4",
          category: "戦略・判断",
          name: "意思決定",
          description: "適切なタイミングで正しい判断ができているか",
          weight: 15,
          scale: 5
        },
        {
          id: "2-5",
          category: "戦略・判断",
          name: "戦略立案",
          description: "中長期的な視点で戦略を立案できているか",
          weight: 10,
          scale: 5
        }
      ],
      createdAt: "2024-01-15",
      updatedAt: "2025-01-10",
      usageCount: 45
    },
    {
      id: "3",
      name: "エンジニア向け評価テンプレート",
      description: "技術力、問題解決能力、チーム貢献度を評価",
      status: "active",
      targetRole: ["エンジニア", "シニアエンジニア"],
      evaluationItems: [
        {
          id: "3-1",
          category: "技術力",
          name: "コーディング品質",
          description: "保守性の高い、品質の良いコードを書けているか",
          weight: 25,
          scale: 5
        },
        {
          id: "3-2",
          category: "技術力",
          name: "技術的知識",
          description: "必要な技術に関する知識を持ち、活用できているか",
          weight: 20,
          scale: 5
        },
        {
          id: "3-3",
          category: "問題解決",
          name: "課題分析",
          description: "技術的な課題を適切に分析できているか",
          weight: 20,
          scale: 5
        },
        {
          id: "3-4",
          category: "問題解決",
          name: "実装力",
          description: "課題に対する効果的な解決策を実装できているか",
          weight: 15,
          scale: 5
        },
        {
          id: "3-5",
          category: "チーム貢献",
          name: "コードレビュー",
          description: "建設的なレビューを行い、チームの品質向上に貢献しているか",
          weight: 10,
          scale: 5
        },
        {
          id: "3-6",
          category: "チーム貢献",
          name: "技術共有",
          description: "知識やノウハウをチームに共有しているか",
          weight: 10,
          scale: 5
        }
      ],
      createdAt: "2024-02-01",
      updatedAt: "2024-12-15",
      usageCount: 38
    },
    {
      id: "4",
      name: "新入社員向け評価テンプレート（試用期間用）",
      description: "新入社員の基本的な業務遂行能力と適応力を評価",
      status: "draft",
      targetRole: ["新入社員"],
      evaluationItems: [
        {
          id: "4-1",
          category: "基本姿勢",
          name: "出勤・勤怠",
          description: "遅刻・欠勤なく、勤務時間を守れているか",
          weight: 20,
          scale: 5
        },
        {
          id: "4-2",
          category: "基本姿勢",
          name: "ビジネスマナー",
          description: "基本的なビジネスマナーを理解し、実践できているか",
          weight: 15,
          scale: 5
        },
        {
          id: "4-3",
          category: "業務習得",
          name: "業務理解",
          description: "担当業務の内容を理解できているか",
          weight: 25,
          scale: 5
        },
        {
          id: "4-4",
          category: "業務習得",
          name: "指示理解",
          description: "上司の指示を正確に理解し、実行できているか",
          weight: 20,
          scale: 5
        },
        {
          id: "4-5",
          category: "適応力",
          name: "職場適応",
          description: "職場環境に適応し、周囲と良好な関係を築けているか",
          weight: 20,
          scale: 5
        }
      ],
      createdAt: "2025-01-10",
      updatedAt: "2025-01-20",
      usageCount: 0
    }
  ];

  // フィルタリング
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || template.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ステータスバッジ
  const getStatusBadge = (status: Template["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">有効</Badge>;
      case "draft":
        return <Badge variant="secondary">下書き</Badge>;
      case "archived":
        return <Badge variant="outline">アーカイブ済み</Badge>;
    }
  };

  // カテゴリごとにグループ化
  const groupByCategory = (items: EvaluationItem[]) => {
    const grouped: { [key: string]: EvaluationItem[] } = {};
    items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">評価テンプレート管理</h1>
            <p className="text-gray-600 mt-1">評価項目のテンプレートを作成・管理します</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新規テンプレートを作成
          </Button>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">総テンプレート数</p>
                  <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">有効</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {templates.filter(t => t.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Edit2 className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">下書き</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {templates.filter(t => t.status === "draft").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">総利用回数</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 検索とフィルター */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="テンプレート名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">すべてのステータス</option>
                  <option value="active">有効</option>
                  <option value="draft">下書き</option>
                  <option value="archived">アーカイブ済み</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* テンプレート一覧 */}
        <div className="space-y-4">
          {filteredTemplates.map((template) => {
            const isExpanded = expandedTemplateId === template.id;
            const groupedItems = groupByCategory(template.evaluationItems);

            return (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-6">
                  {/* テンプレートヘッダー */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                        {getStatusBadge(template.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>{template.evaluationItems.length}項目</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>利用回数: {template.usageCount}</span>
                        </div>
                        <div>
                          対象: {template.targetRole.join(", ")}
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setExpandedTemplateId(isExpanded ? null : template.id)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            閉じる
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            詳細
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" title="複製">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="編集">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {template.status === "draft" && (
                        <Button variant="ghost" size="sm" title="削除" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 評価項目の詳細（展開時） */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">評価項目</h4>
                      <div className="space-y-6">
                        {Object.entries(groupedItems).map(([category, items]) => (
                          <div key={category}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                              <h5 className="font-semibold text-gray-900">{category}</h5>
                              <span className="text-sm text-gray-500">
                                ({items.reduce((sum, item) => sum + item.weight, 0)}%)
                              </span>
                            </div>
                            <div className="space-y-3 ml-3">
                              {items.map((item, index) => (
                                <div 
                                  key={item.id} 
                                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <div className="text-gray-400 cursor-move mt-1">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-gray-900">{item.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {item.weight}%
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {item.scale}段階評価
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ウェイト合計の確認 */}
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900">
                            評価項目ウェイト合計
                          </span>
                          <span className="text-lg font-bold text-blue-900">
                            {template.evaluationItems.reduce((sum, item) => sum + item.weight, 0)}%
                            {template.evaluationItems.reduce((sum, item) => sum + item.weight, 0) === 100 ? (
                              <CheckCircle className="w-5 h-5 text-green-600 inline-block ml-2" />
                            ) : (
                              <span className="text-sm text-red-600 ml-2">(要調整)</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 結果が0件の場合 */}
        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">該当する評価テンプレートが見つかりませんでした</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}>
                  フィルターをリセット
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 新規作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">新規評価テンプレートを作成</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">基本情報</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    テンプレート名 <span className="text-red-500">*</span>
                  </label>
                  <Input type="text" placeholder="例: 一般社員向け評価テンプレート" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="このテンプレートの目的や対象を入力してください"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      対象役職 <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">選択してください</option>
                      <option value="general">一般社員</option>
                      <option value="senior">主任</option>
                      <option value="manager">課長</option>
                      <option value="director">部長</option>
                      <option value="engineer">エンジニア</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ステータス
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="draft">下書き</option>
                      <option value="active">有効</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 評価項目 */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">評価項目</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    項目を追加
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* サンプル項目 */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-3">
                        <label className="block text-xs text-gray-600 mb-1">カテゴリ</label>
                        <Input type="text" placeholder="業務遂行能力" className="text-sm" />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs text-gray-600 mb-1">項目名</label>
                        <Input type="text" placeholder="業務の質" className="text-sm" />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs text-gray-600 mb-1">説明</label>
                        <Input type="text" placeholder="評価基準の説明" className="text-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs text-gray-600 mb-1">ウェイト(%)</label>
                        <Input type="number" placeholder="20" className="text-sm" />
                      </div>
                      <div className="col-span-1 flex items-end">
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  💡 ヒント: 評価項目のウェイト合計は100%にしてください
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  キャンセル
                </Button>
                <Button onClick={() => setShowCreateModal(false)}>
                  作成
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};
