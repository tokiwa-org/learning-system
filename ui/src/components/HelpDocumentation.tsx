import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  HelpCircle,
  Search,
  BookOpen,
  Video,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Mail,
  Phone,
  FileText,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Settings,
  Users,
  BarChart3,
  Shield,
  PlayCircle,
  Info
} from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

interface Documentation {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  pdfUrl?: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
}

export const HelpDocumentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"faq" | "manual" | "tutorial" | "contact">("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // FAQ データ
  const faqItems: FAQItem[] = [
    {
      id: "1",
      category: "基本操作",
      question: "ログインできない場合はどうすればよいですか？",
      answer: "パスワードを忘れた場合は、ログイン画面の「パスワードをお忘れの場合」リンクからリセットできます。それでも解決しない場合は、システム管理者にお問い合わせください。また、ブラウザのキャッシュをクリアしてから再度お試しください。",
      tags: ["ログイン", "パスワード", "トラブルシューティング"]
    },
    {
      id: "2",
      category: "自己評価",
      question: "自己評価の提出期限を過ぎてしまった場合は？",
      answer: "提出期限を過ぎた場合でも、上司の承認前であれば提出可能です。ただし、システム上で「期限超過」と表示されます。やむを得ない理由で期限に間に合わなかった場合は、上司または人事部門に相談してください。",
      tags: ["自己評価", "期限", "提出"]
    },
    {
      id: "3",
      category: "自己評価",
      question: "提出した自己評価を修正できますか？",
      answer: "上司が評価を開始する前であれば、自己評価を修正できます。マイページから該当の評価を開き、「編集」ボタンをクリックしてください。上司が既に評価を開始している場合は、修正できませんので、上司に直接ご相談ください。",
      tags: ["自己評価", "修正", "編集"]
    },
    {
      id: "4",
      category: "上司評価",
      question: "部下の評価を一括で処理できますか？",
      answer: "現在、評価は個別に行う必要があります。ただし、評価テンプレートを使用することで、評価項目を効率的に入力できます。また、下書き保存機能を活用して、複数の評価を同時進行で作業することも可能です。",
      tags: ["上司評価", "一括処理", "効率化"]
    },
    {
      id: "5",
      category: "上司評価",
      question: "評価を差し戻す方法は？",
      answer: "評価承認画面で「差戻し」ボタンをクリックし、差戻し理由を入力してください。差し戻された評価は、評価者に通知され、再評価が必要になります。差戻しは慎重に行い、具体的な理由を記載することを推奨します。",
      tags: ["上司評価", "差戻し", "承認"]
    },
    {
      id: "6",
      category: "管理機能",
      question: "評価期間を設定するには？",
      answer: "管理者ダッシュボードから「評価期間設定」を選択し、新規評価期間を作成できます。期間名、開始日、終了日、対象部署、評価テンプレートを設定してください。設定後、対象者に自動で通知が送信されます。",
      tags: ["管理者", "評価期間", "設定"]
    },
    {
      id: "7",
      category: "管理機能",
      question: "CSVで社員データを一括登録できますか？",
      answer: "はい、可能です。ユーザー管理画面から「CSVインポート」ボタンをクリックし、指定のフォーマットに従ったCSVファイルをアップロードしてください。サンプルファイルはダウンロードボタンからご利用いただけます。",
      tags: ["管理者", "CSV", "インポート", "社員登録"]
    },
    {
      id: "8",
      category: "通知",
      question: "メール通知が届かない場合は？",
      answer: "まず、迷惑メールフォルダをご確認ください。それでも見つからない場合は、プロフィール設定で登録メールアドレスが正しいか確認してください。また、通知設定で該当の通知が有効になっているか確認してください。",
      tags: ["通知", "メール", "トラブルシューティング"]
    },
    {
      id: "9",
      category: "セキュリティ",
      question: "パスワードの変更方法は？",
      answer: "プロフィール画面から「パスワード変更」を選択し、現在のパスワードと新しいパスワードを入力してください。パスワードは8文字以上で、英数字と記号を含むことを推奨します。",
      tags: ["パスワード", "セキュリティ", "変更"]
    },
    {
      id: "10",
      category: "セキュリティ",
      question: "二要素認証を有効にするには？",
      answer: "プロフィール設定のセキュリティセクションから「二要素認証を有効にする」を選択してください。QRコードをスキャンし、認証アプリ（Google Authenticator等）で設定を完了してください。",
      tags: ["二要素認証", "セキュリティ", "設定"]
    },
    {
      id: "11",
      category: "レポート",
      question: "評価データをエクスポートするには？",
      answer: "全社評価一覧画面から「CSVエクスポート」ボタンをクリックしてください。エクスポートするデータの範囲（期間、部署など）を選択し、ダウンロードできます。管理者権限が必要です。",
      tags: ["レポート", "エクスポー", "CSV"]
    },
    {
      id: "12",
      category: "トラブルシューティング",
      question: "画面が正しく表示されない場合は？",
      answer: "ブラウザのキャッシュとCookieをクリアしてから、ページを再読み込みしてください。推奨ブラウザはChrome、Firefox、Safari、Edgeの最新版です。それでも解決しない場合は、別のブラウザで試してください。",
      tags: ["トラブルシューティング", "表示", "ブラウザ"]
    }
  ];

  // マニュアルデータ
  const documentations: Documentation[] = [
    {
      id: "1",
      title: "システム概要ガイド",
      category: "基本",
      description: "人事考課システムの全体像と基本的な使い方を説明します",
      icon: <BookOpen className="w-5 h-5" />,
      pdfUrl: "/docs/system-overview.pdf"
    },
    {
      id: "2",
      title: "社員向け操作マニュアル",
      category: "社員",
      description: "自己評価、スキルマップ、通知設定などの操作方法",
      icon: <Users className="w-5 h-5" />,
      pdfUrl: "/docs/employee-manual.pdf"
    },
    {
      id: "3",
      title: "上司向け評価マニュアル",
      category: "上司",
      description: "部下の評価、承認フロー、フィードバック方法について",
      icon: <CheckCircle className="w-5 h-5" />,
      pdfUrl: "/docs/manager-manual.pdf"
    },
    {
      id: "4",
      title: "管理者向け設定ガイド",
      category: "管理者",
      description: "評価期間設定、ユーザー管理、システム設定の詳細",
      icon: <Settings className="w-5 h-5" />,
      pdfUrl: "/docs/admin-guide.pdf"
    },
    {
      id: "5",
      title: "評価テンプレート作成ガイド",
      category: "管理者",
      description: "カスタム評価項目の作成と設定方法",
      icon: <FileText className="w-5 h-5" />,
      pdfUrl: "/docs/template-guide.pdf"
    },
    {
      id: "6",
      title: "統計・分析レポート活用法",
      category: "管理者",
      description: "評価データの分析とレポート作成の手順",
      icon: <BarChart3 className="w-5 h-5" />,
      pdfUrl: "/docs/analytics-guide.pdf"
    },
    {
      id: "7",
      title: "セキュリティとプライバシー",
      category: "セキュリティ",
      description: "データ保護、アクセス権限、監査ログの管理",
      icon: <Shield className="w-5 h-5" />,
      pdfUrl: "/docs/security-guide.pdf"
    },
    {
      id: "8",
      title: "トラブルシューティング",
      category: "サポート",
      description: "よくある問題と解決方法のまとめ",
      icon: <AlertTriangle className="w-5 h-5" />,
      pdfUrl: "/docs/troubleshooting.pdf"
    }
  ];

  // ビデオチュートリアルデータ
  const videoTutorials: VideoTutorial[] = [
    {
      id: "1",
      title: "システム概要と初期設定",
      description: "人事考課システムの全体像と初めての設定方法を解説",
      duration: "5:30",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
      category: "基本"
    },
    {
      id: "2",
      title: "自己評価の入力方法",
      description: "自己評価シートの記入から提出までの流れ",
      duration: "8:15",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop",
      category: "社員"
    },
    {
      id: "3",
      title: "上司評価と承認フロー",
      description: "部下の評価方法と承認プロセスを詳しく説明",
      duration: "10:45",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      category: "上司"
    },
    {
      id: "4",
      title: "評価期間の設定と管理",
      description: "新しい評価期間の作成から運用までを解説",
      duration: "7:20",
      thumbnail: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=225&fit=crop",
      category: "管理者"
    },
    {
      id: "5",
      title: "評価テンプレートのカスタマイズ",
      description: "独自の評価項目を作成する方法",
      duration: "12:00",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      category: "管理者"
    },
    {
      id: "6",
      title: "統計データの見方と活用法",
      description: "評価データを分析し、レポートを作成する方法",
      duration: "9:30",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      category: "管理者"
    }
  ];

  // フィルタリング（FAQ）
  const filteredFaqs = faqItems.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // フィルタリング（マニュアル）
  const filteredDocs = documentations.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // フィルタリング（ビデオ）
  const filteredVideos = videoTutorials.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // カテゴリー一覧
  const faqCategories = Array.from(new Set(faqItems.map(f => f.category)));
  const docCategories = Array.from(new Set(documentations.map(d => d.category)));
  const videoCategories = Array.from(new Set(videoTutorials.map(v => v.category)));

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ヘルプ・ドキュメント</h1>
            <p className="text-gray-600 mt-1">システムの使い方やよくある質問を確認できます</p>
          </div>
        </div>

        {/* タブナビゲーション */}
        <Card>
          <CardContent className="p-0">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("faq")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "faq"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-white"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>よくある質問</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "manual"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-white"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>操作マニュアル</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("tutorial")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "tutorial"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-white"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" />
                  <span>動画チュートリアル</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "contact"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-white"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>お問い合わせ</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 検索とフィルター（FAQ、マニュアル、チュートリアル共通） */}
        {activeTab !== "contact" && (
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">すべてのカテゴリ</option>
                  {activeTab === "faq" && faqCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {activeTab === "manual" && docCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {activeTab === "tutorial" && videoCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ タブ */}
        {activeTab === "faq" && (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <Card key={faq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{faq.category}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-4 border-t border-gray-100">
                        <p className="text-gray-700 mt-4 leading-relaxed">{faq.answer}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {faq.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            {filteredFaqs.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">該当する質問が見つかりませんでした</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* マニュアル タブ */}
        {activeTab === "manual" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      {doc.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                        <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        PDFダウンロード
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredDocs.length === 0 && (
              <Card className="md:col-span-2">
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">該当するマニュアルが見つかりませんでした</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* チュートリアル タブ */}
        {activeTab === "tutorial" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="p-3 bg-white rounded-full">
                      <PlayCircle className="w-8 h-8 text-primary-600" />
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/70">
                    {video.duration}
                  </Badge>
                </div>
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{video.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{video.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    動画を見る
                  </Button>
                </CardContent>
              </Card>
            ))}
            {filteredVideos.length === 0 && (
              <Card className="lg:col-span-3">
                <CardContent className="py-12 text-center">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">該当するチュートリアルが見つかりませんでした</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* お問い合わせ タブ */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* メールサポート */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">メールサポート</h3>
                      <p className="text-sm text-gray-600">24時間受付</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">
                    技術的な問題やシステムに関するご質問は、
                    下記のメールアドレスまでお問い合わせください。
                  </p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">support@tokiwatech.co.jp</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    ※通常1営業日以内に返信いたします
                  </p>
                  <Button className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    メールを送信
                  </Button>
                </CardContent>
              </Card>

              {/* 電話サポート */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">電話サポート</h3>
                      <p className="text-sm text-gray-600">平日 9:00-18:00</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">
                    緊急の問題や詳しい説明が必要な場合は、
                    電話でのサポートもご利用いただけます。
                  </p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">03-1234-5678</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    ※土日祝日を除く
                  </p>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    電話する
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* システム情報 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">システム情報</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">バージョン</p>
                    <p className="font-semibold text-gray-900">v2.5.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">最終更新日</p>
                    <p className="font-semibold text-gray-900">2025/01/15</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">サーバーステータス</p>
                    <Badge variant="success">正常稼働中</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">次回メンテナンス</p>
                    <p className="font-semibold text-gray-900">未定</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* リリースノート */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">最新のリリースノート</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-l-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">v2.5.0</Badge>
                    <span className="text-sm text-gray-500">2025/01/15</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">新機能と改善</h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>評価統計・分析画面のレーダーチャート追加</li>
                    <li>CSV一括インポート機能の強化</li>
                    <li>通知設定の細かいカスタマイズが可能に</li>
                    <li>パフォーマンスの改善とバグ修正</li>
                  </ul>
                </div>

                <div className="border-l-4 border-l-gray-300 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">v2.4.0</Badge>
                    <span className="text-sm text-gray-500">2024/12/10</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">機能追加</h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>評価テンプレートのカスタマイズ機能</li>
                    <li>監査ログの詳細表示機能</li>
                    <li>二要素認証のサポート</li>
                  </ul>
                </div>

                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  すべてのリリースノートを見る
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ヒントカード */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">使い方のヒント</h4>
                <p className="text-sm text-gray-600">
                  困ったときは、まずFAQで類似の質問を検索してみてください。
                  それでも解決しない場合は、メールまたは電話でサポートチームにお問い合わせください。
                  操作マニュアルや動画チュートリアルもご活用ください。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};