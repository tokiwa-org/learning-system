import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { 
  Settings,
  Building2,
  Mail,
  Lock,
  Bell,
  Database,
  Shield,
  Palette,
  Globe,
  Clock,
  FileText,
  Key,
  AlertCircle,
  CheckCircle,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Download
} from "lucide-react";

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export const SystemSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [hasChanges, setHasChanges] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // 基本設定
  const [companyName, setCompanyName] = useState("株式会社トキワテック");
  const [systemName, setSystemName] = useState("人事考課システム");
  const [fiscalYearStart, setFiscalYearStart] = useState("4");
  const [timezone, setTimezone] = useState("Asia/Tokyo");
  const [language, setLanguage] = useState("ja");

  // メール設定
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smtpServer, setSmtpServer] = useState("smtp.example.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("noreply@example.com");
  const [senderName, setSenderName] = useState("人事考課システム");

  // 通知設定
  const [notifyEvaluationStart, setNotifyEvaluationStart] = useState(true);
  const [notifyEvaluationReminder, setNotifyEvaluationReminder] = useState(true);
  const [notifyEvaluationComplete, setNotifyEvaluationComplete] = useState(true);
  const [notifyApprovalRequest, setNotifyApprovalRequest] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState("3");

  // セキュリティ設定
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [passwordRequireSpecial, setPasswordRequireSpecial] = useState(true);
  const [passwordRequireNumber, setPasswordRequireNumber] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // データ設定
  const [dataRetentionYears, setDataRetentionYears] = useState("7");
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [exportFormat, setExportFormat] = useState("csv");

  // 表示設定
  const [itemsPerPage, setItemsPerPage] = useState("20");
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");
  const [showEmployeePhotos, setShowEmployeePhotos] = useState(true);

  const sections: SettingsSection[] = [
    {
      id: "basic",
      title: "基本設定",
      icon: <Building2 className="w-5 h-5" />,
      description: "会社情報とシステムの基本設定"
    },
    {
      id: "email",
      title: "メール設定",
      icon: <Mail className="w-5 h-5" />,
      description: "SMTP設定とメール送信設定"
    },
    {
      id: "notification",
      title: "通知設定",
      icon: <Bell className="w-5 h-5" />,
      description: "自動通知とリマインダーの設定"
    },
    {
      id: "security",
      title: "セキュリティ",
      icon: <Shield className="w-5 h-5" />,
      description: "パスワードポリシーと認証設定"
    },
    {
      id: "data",
      title: "データ管理",
      icon: <Database className="w-5 h-5" />,
      description: "データ保持期間とバックアップ設定"
    },
    {
      id: "display",
      title: "表示設定",
      icon: <Palette className="w-5 h-5" />,
      description: "UI表示とフォーマット設定"
    }
  ];

  const handleSave = () => {
    // 保存処理（実際にはAPIを呼び出す）
    setHasChanges(false);
    alert("設定を保存しました");
  };

  const handleReset = () => {
    if (confirm("変更をリセットしますか？")) {
      setHasChanges(false);
      // 各フィールドを初期値にリセット
    }
  };

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">システム設定</h1>
            <p className="text-gray-600 mt-1">システム全体の設定を管理します</p>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  リセット
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 変更警告 */}
        {hasChanges && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">保存されていない変更があります</p>
              <p className="text-sm text-yellow-700 mt-1">
                変更を保存するか、リセットしてください。
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* サイドバー */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-gray-900 text-white font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {section.icon}
                      <span className="text-sm">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-3 space-y-6">
            {/* 基本設定 */}
            {activeSection === "basic" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-gray-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">基本設定</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        会社情報とシステムの基本設定を管理します
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      会社名 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        setHasChanges(true);
                      }}
                      placeholder="株式会社〇〇"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      システム名 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={systemName}
                      onChange={(e) => {
                        setSystemName(e.target.value);
                        setHasChanges(true);
                      }}
                      placeholder="人事考課システム"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        会計年度開始月
                      </label>
                      <select
                        value={fiscalYearStart}
                        onChange={(e) => {
                          setFiscalYearStart(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month}>
                            {month}月
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        タイムゾーン
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => {
                          setTimezone(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Asia/Tokyo">日本標準時 (JST)</option>
                        <option value="UTC">協定世界時 (UTC)</option>
                        <option value="America/New_York">東部標準時 (EST)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      システム言語
                    </label>
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="ja">日本語</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* メール設定 */}
            {activeSection === "email" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-gray-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">メール設定</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        SMTP設定とメール送信の設定を管理します
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">メール送信を有効にする</p>
                      <p className="text-sm text-gray-600">
                        システムからのメール通知を送信します
                      </p>
                    </div>
                    <Checkbox
                      checked={emailEnabled}
                      onChange={(e) => {
                        setEmailEnabled(e.target.checked);
                        setHasChanges(true);
                      }}
                    />
                  </div>

                  {emailEnabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTPサーバー <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            value={smtpServer}
                            onChange={(e) => {
                              setSmtpServer(e.target.value);
                              setHasChanges(true);
                            }}
                            placeholder="smtp.example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ポート番号 <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            value={smtpPort}
                            onChange={(e) => {
                              setSmtpPort(e.target.value);
                              setHasChanges(true);
                            }}
                            placeholder="587"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ユーザー名 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={smtpUser}
                          onChange={(e) => {
                            setSmtpUser(e.target.value);
                            setHasChanges(true);
                          }}
                          placeholder="noreply@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          送信者名
                        </label>
                        <Input
                          type="text"
                          value={senderName}
                          onChange={(e) => {
                            setSenderName(e.target.value);
                            setHasChanges(true);
                          }}
                          placeholder="人事考課システム"
                        />
                      </div>

                      <div className="pt-4">
                        <Button variant="outline" className="w-full sm:w-auto">
                          <Mail className="w-4 h-4 mr-2" />
                          テストメールを送信
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 通知設定 */}
            {activeSection === "notification" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-gray-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">通知設定</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        自動通知とリマインダーの設定を管理します
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">評価期間開始通知</p>
                      <p className="text-sm text-gray-600">
                        評価期間が開始されたときに通知を送信
                      </p>
                    </div>
                    <Checkbox
                      checked={notifyEvaluationStart}
                      onChange={(e) => {
                        setNotifyEvaluationStart(e.target.checked);
                        setHasChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">期限リマインダー</p>
                      <p className="text-sm text-gray-600">
                        期限前にリマインダーを送信
                      </p>
                    </div>
                    <Checkbox
                      checked={notifyEvaluationReminder}
                      onChange={(e) => {
                        setNotifyEvaluationReminder(e.target.checked);
                        setHasChanges(true);
                      }}
                    />
                  </div>

                  {notifyEvaluationReminder && (
                    <div className="ml-4 pl-4 border-l-2 border-gray-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        リマインダー送信日数（期限前）
                      </label>
                      <Input
                        type="number"
                        value={reminderDaysBefore}
                        onChange={(e) => {
                          setReminderDaysBefore(e.target.value);
                          setHasChanges(true);
                        }}
                        placeholder="3"
                        className="w-32"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        期限の{reminderDaysBefore}日前に通知を送信します
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">評価完了通知</p>
                      <p className="text-sm text-gray-600">
                        評価が完了したときに通知を送信
                      </p>
                    </div>
                    <Checkbox
                      checked={notifyEvaluationComplete}
                      onChange={(e) => {
                        setNotifyEvaluationComplete(e.target.checked);
                        setHasChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">承認依頼通知</p>
                      <p className="text-sm text-gray-600">
                        承認が必要なときに通知を送信
                      </p>
                    </div>
                    <Checkbox
                      checked={notifyApprovalRequest}
                      onChange={(e) => {
                        setNotifyApprovalRequest(e.target.checked);
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* セキュリティ設定 */}
            {activeSection === "security" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-gray-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">セキュリティ設定</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        パスワードポリシーと認証設定を管理します
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">パスワードポリシー</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最小文字数
                        </label>
                        <Input
                          type="number"
                          value={passwordMinLength}
                          onChange={(e) => {
                            setPasswordMinLength(e.target.value);
                            setHasChanges(true);
                          }}
                          placeholder="8"
                          className="w-32"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">特殊文字を必須にする</p>
                          <p className="text-sm text-gray-600">
                            !@#$%^&*()などの特殊文字を含める
                          </p>
                        </div>
                        <Checkbox
                          checked={passwordRequireSpecial}
                          onChange={(e) => {
                            setPasswordRequireSpecial(e.target.checked);
                            setHasChanges(true);
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">数字を必須にする</p>
                          <p className="text-sm text-gray-600">
                            少なくとも1つの数字を含める
                          </p>
                        </div>
                        <Checkbox
                          checked={passwordRequireNumber}
                          onChange={(e) => {
                            setPasswordRequireNumber(e.target.checked);
                            setHasChanges(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">認証設定</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          セッションタイムアウト（分）
                        </label>
                        <Input
                          type="number"
                          value={sessionTimeout}
                          onChange={(e) => {
                            setSessionTimeout(e.target.value);
                            setHasChanges(true);
                          }}
                          placeholder="60"
                          className="w-32"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          無操作状態が続いた場合、自動的にログアウトします
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">二要素認証を有効にする</p>
                          <p className="text-sm text-gray-600">
                            ログイン時に追加の認証を要求
                          </p>
                        </div>
                        <Checkbox
                          checked={twoFactorEnabled}
                          onChange={(e) => {
                            setTwoFactorEnabled(e.target.checked);
                            setHasChanges(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* データ管理設定 */}
            {activeSection === "data" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Database className="w-6 h-6 text-gray-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">データ管理設定</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        データ保持期間とバックアップの設定を管理します
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      データ保持期間（年）
                    </label>
                    <select
                      value={dataRetentionYears}
                      onChange={(e) => {
                        setDataRetentionYears(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="3">3年</option>
                      <option value="5">5年</option>
                      <option value="7">7年</option>
                      <option value="10">10年</option>
                      <option value="unlimited">無期限</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      期間を過ぎたデータは自動的にアーカイブされます
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">バックアップ設定</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">自動バックアップを有効にする</p>
                          <p className="text-sm text-gray-600">
                            定期的に自動バックアップを実行
                          </p>
                        </div>
                        <Checkbox
                          checked={autoBackup}
                          onChange={(e) => {
                            setAutoBackup(e.target.checked);
                            setHasChanges(true);
                          }}
                        />
                      </div>

                      {autoBackup && (
                        <div className="ml-4 pl-4 border-l-2 border-gray-300">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            バックアップ頻度
                          </label>
                          <select
                            value={backupFrequency}
                            onChange={(e) => {
                              setBackupFrequency(e.target.value);
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="hourly">1時間ごと</option>
                            <option value="daily">毎日</option>
                            <option value="weekly">毎週</option>
                            <option value="monthly">毎月</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">エクスポート設定</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        デフォルトのエクスポート形式
                      </label>
                      <select
                        value={exportFormat}
                        onChange={(e) => {
                          setExportFormat(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="csv">CSV</option>
                        <option value="xlsx">Excel (XLSX)</option>
                        <option value="pdf">PDF</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      今すぐバックアップ
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      全データをエクスポート
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 表示設定 */}
            {activeSection === "display" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-gray-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">表示設定</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        UI表示とフォーマットの設定を管理します
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ページあたりの表示件数
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="10">10件</option>
                      <option value="20">20件</option>
                      <option value="50">50件</option>
                      <option value="100">100件</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      日付フォーマット
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => {
                        setDateFormat(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="YYYY/MM/DD">YYYY/MM/DD (2025/01/24)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2025-01-24)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (01/24/2025)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (24/01/2025)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">社員の写真を表示</p>
                      <p className="text-sm text-gray-600">
                        一覧画面で社員の写真を表示します
                      </p>
                    </div>
                    <Checkbox
                      checked={showEmployeePhotos}
                      onChange={(e) => {
                        setShowEmployeePhotos(e.target.checked);
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 設定情報カード */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">設定のヒント</h4>
                    <p className="text-sm text-gray-600">
                      システム設定の変更は、すぐに全ユーザーに反映されます。
                      重要な設定を変更する前に、影響範囲を確認してください。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};