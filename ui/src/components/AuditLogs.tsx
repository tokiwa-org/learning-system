import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  LogIn,
  LogOut,
  Settings,
  Database,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  category: "auth" | "evaluation" | "user" | "system" | "data";
  description: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed" | "warning";
  details?: any;
}

export const AuditLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // 監査ログデータ
  const auditLogs: AuditLog[] = [
    {
      id: "1",
      timestamp: "2025-01-24 14:32:15",
      userName: "管理者 太郎",
      userEmail: "admin@example.com",
      userRole: "管理者",
      action: "ログイン",
      category: "auth",
      description: "システムにログインしました",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      status: "success"
    },
    {
      id: "2",
      timestamp: "2025-01-24 14:30:22",
      userName: "山田 花子",
      userEmail: "yamada@example.com",
      userRole: "課長",
      action: "評価承認",
      category: "evaluation",
      description: "佐藤 次郎の評価を承認しました",
      ipAddress: "192.168.1.105",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
      status: "success",
      details: {
        evaluationId: "EV-2025-001",
        employeeName: "佐藤 次郎",
        score: 4.2
      }
    },
    {
      id: "3",
      timestamp: "2025-01-24 14:25:10",
      userName: "田中 太郎",
      userEmail: "tanaka@example.com",
      userRole: "部長",
      action: "評価作成",
      category: "evaluation",
      description: "山田 花子の評価を作成しました",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0",
      status: "success",
      details: {
        evaluationId: "EV-2025-002",
        employeeName: "山田 花子",
        score: 4.5
      }
    },
    {
      id: "4",
      timestamp: "2025-01-24 14:20:05",
      userName: "管理者 太郎",
      userEmail: "admin@example.com",
      userRole: "管理者",
      action: "ユーザー作成",
      category: "user",
      description: "新規ユーザーを作成しました",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      status: "success",
      details: {
        newUserEmail: "newuser@example.com",
        newUserName: "新入社員 一郎",
        department: "営業部"
      }
    },
    {
      id: "5",
      timestamp: "2025-01-24 14:15:33",
      userName: "鈴木 美咲",
      userEmail: "suzuki@example.com",
      userRole: "部長",
      action: "ログイン失敗",
      category: "auth",
      description: "パスワードが正しくありません",
      ipAddress: "192.168.1.108",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1",
      status: "failed"
    },
    {
      id: "6",
      timestamp: "2025-01-24 14:10:18",
      userName: "管理者 太郎",
      userEmail: "admin@example.com",
      userRole: "管理者",
      action: "システム設定変更",
      category: "system",
      description: "メール設定を更新しました",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      status: "success",
      details: {
        setting: "email_enabled",
        oldValue: false,
        newValue: true
      }
    },
    {
      id: "7",
      timestamp: "2025-01-24 14:05:42",
      userName: "高橋 健一",
      userEmail: "takahashi@example.com",
      userRole: "シニアエンジニア",
      action: "自己評価提出",
      category: "evaluation",
      description: "自己評価を提出しました",
      ipAddress: "192.168.1.110",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/121.0",
      status: "success",
      details: {
        evaluationId: "EV-2025-003",
        period: "2025年度 上半期"
      }
    },
    {
      id: "8",
      timestamp: "2025-01-24 14:00:15",
      userName: "管理者 太郎",
      userEmail: "admin@example.com",
      userRole: "管理者",
      action: "データエクスポート",
      category: "data",
      description: "全社評価データをCSV形式でエクスポートしました",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      status: "success",
      details: {
        format: "CSV",
        recordCount: 245,
        fileSize: "1.2MB"
      }
    },
    {
      id: "9",
      timestamp: "2025-01-24 13:55:28",
      userName: "伊藤 美香",
      userEmail: "ito@example.com",
      userRole: "部長",
      action: "ユーザー編集",
      category: "user",
      description: "渡辺 誠のプロフィールを更新しました",
      ipAddress: "192.168.1.115",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      status: "success",
      details: {
        userId: "EMP007",
        userName: "渡辺 誠",
        changedFields: ["department", "position"]
      }
    },
    {
      id: "10",
      timestamp: "2025-01-24 13:50:10",
      userName: "不明なユーザー",
      userEmail: "unknown@example.com",
      userRole: "-",
      action: "不正アクセス試行",
      category: "auth",
      description: "無効なトークンでアクセスを試みました",
      ipAddress: "203.0.113.45",
      userAgent: "curl/7.68.0",
      status: "failed"
    },
    {
      id: "11",
      timestamp: "2025-01-24 13:45:33",
      userName: "管理者 太郎",
      userEmail: "admin@example.com",
      userRole: "管理者",
      action: "評価期間設定",
      category: "system",
      description: "新しい評価期間を作成しました",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      status: "success",
      details: {
        period: "2025年度 下半期",
        startDate: "2025-10-01",
        endDate: "2026-03-31"
      }
    },
    {
      id: "12",
      timestamp: "2025-01-24 13:40:05",
      userName: "小林 浩二",
      userEmail: "kobayashi@example.com",
      userRole: "部長",
      action: "評価削除試行",
      category: "evaluation",
      description: "権限不足により評価削除に失敗しました",
      ipAddress: "192.168.1.120",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      status: "warning",
      details: {
        evaluationId: "EV-2025-004",
        reason: "insufficient_permissions"
      }
    }
  ];

  // カテゴリーアイコン
  const getCategoryIcon = (category: AuditLog["category"]) => {
    switch (category) {
      case "auth":
        return <Shield className="w-4 h-4" />;
      case "evaluation":
        return <FileText className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      case "system":
        return <Settings className="w-4 h-4" />;
      case "data":
        return <Database className="w-4 h-4" />;
    }
  };

  // カテゴリーバッジ
  const getCategoryBadge = (category: AuditLog["category"]) => {
    const configs = {
      auth: { label: "認証", variant: "default" as const },
      evaluation: { label: "評価", variant: "default" as const },
      user: { label: "ユーザー", variant: "default" as const },
      system: { label: "システム", variant: "secondary" as const },
      data: { label: "データ", variant: "secondary" as const }
    };
    const config = configs[category];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // ステータスバッジ
  const getStatusBadge = (status: AuditLog["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            成功
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            失敗
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-yellow-700 border-yellow-700">
            <AlertCircle className="w-3 h-3" />
            警告
          </Badge>
        );
    }
  };

  // フィルタリング
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && log.timestamp >= dateFrom;
    }
    if (dateTo) {
      matchesDate = matchesDate && log.timestamp <= dateTo + " 23:59:59";
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  // 統計計算
  const totalLogs = auditLogs.length;
  const successCount = auditLogs.filter(l => l.status === "success").length;
  const failedCount = auditLogs.filter(l => l.status === "failed").length;
  const warningCount = auditLogs.filter(l => l.status === "warning").length;

  // 日時フォーマット
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    };
  };

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">操作ログ・監査ログ</h1>
            <p className="text-gray-600 mt-1">システム内のすべての操作履歴を確認できます</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              ログをエクスポート
            </Button>
          </div>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">総ログ数</p>
                  <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
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
                  <p className="text-sm text-gray-600">成功</p>
                  <p className="text-2xl font-bold text-gray-900">{successCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">失敗</p>
                  <p className="text-2xl font-bold text-gray-900">{failedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">警告</p>
                  <p className="text-2xl font-bold text-gray-900">{warningCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 検索とフィルター */}
        <Card>
          <CardContent className="py-4">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="ユーザー名、操作、説明で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">すべてのカテゴリ</option>
                    <option value="auth">認証</option>
                    <option value="evaluation">評価</option>
                    <option value="user">ユーザー</option>
                    <option value="system">システム</option>
                    <option value="data">データ</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">すべてのステータス</option>
                    <option value="success">成功</option>
                    <option value="failed">失敗</option>
                    <option value="warning">警告</option>
                  </select>
                </div>
              </div>

              {/* 日付範囲フィルター */}
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-40"
                  />
                  <span className="text-gray-500">〜</span>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-40"
                  />
                  {(dateFrom || dateTo) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                      }}
                    >
                      クリア
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ログ一覧 */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ユーザー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IPアドレス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      詳細
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => {
                    const { date, time } = formatTimestamp(log.timestamp);
                    const isExpanded = expandedLogId === log.id;
                    
                    return (
                      <React.Fragment key={log.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{time}</p>
                                <p className="text-xs text-gray-500">{date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{log.userName}</p>
                              <p className="text-xs text-gray-500">{log.userRole}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{log.action}</p>
                              <p className="text-xs text-gray-600">{log.description}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(log.category)}
                              {getCategoryBadge(log.category)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(log.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-gray-600">{log.ipAddress}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">メールアドレス</p>
                                    <p className="text-sm text-gray-900">{log.userEmail}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">User Agent</p>
                                    <p className="text-sm text-gray-900 font-mono text-xs truncate">
                                      {log.userAgent}
                                    </p>
                                  </div>
                                </div>
                                {log.details && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-2">詳細情報</p>
                                    <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                                      {JSON.stringify(log.details, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 結果が0件の場合 */}
            {filteredLogs.length === 0 && (
              <div className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">該当する操作ログが見つかりませんでした</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                  setDateFrom("");
                  setDateTo("");
                }}>
                  フィルターをリセット
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* セキュリティ警告 */}
        {failedCount > 0 && (
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">セキュリティ警告</h4>
                  <p className="text-sm text-gray-600">
                    {failedCount}件のログイン失敗や不正アクセス試行が検出されています。
                    定期的に監視し、異常なアクティビティがないか確認してください。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
