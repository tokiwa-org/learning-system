import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  Users,
  Map,
  BellDot,
  CheckCircle,
  FileText,
  Calendar,
  Building2,
  FileSpreadsheet,
  BarChart3,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  BookOpen,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'employee' | 'manager' | 'admin';
}

export const Layout: React.FC<LayoutProps> = ({ children, userRole = 'employee' }) => {
  const [notificationCount] = useState(3);

  // 社員向けメニュー
  const employeeMenuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
    { id: 'learning-tasks', label: '学習課題', icon: BookOpen },
    { id: 'skill-map', label: 'スキルマップ', icon: Map },
    { id: 'notifications', label: '通知', icon: BellDot },
  ];

  // 上司向けメニュー
  const managerMenuItems = [
    { id: 'manager-dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
    { id: 'manager-evaluation', label: '部下評価', icon: FileText },
    { id: 'evaluation-approval', label: '評価承認', icon: CheckCircle },
    { id: 'subordinate-list', label: '部下一覧', icon: Users },
    { id: 'notifications', label: '通知', icon: BellDot },
  ];

  // 管理者向けメニュー
  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
    { id: 'evaluation-settings', label: '評価期間設定', icon: Calendar },
    { id: 'user-management', label: '組織・社員管理', icon: Building2 },
    { id: 'evaluation-template', label: '評価テンプレート', icon: FileSpreadsheet },
    { id: 'all-evaluations', label: '全社評価一覧', icon: FileText },
    { id: 'evaluation-analytics', label: '評価統計・分析', icon: BarChart3 },
    { id: 'system-settings', label: 'システム設定', icon: Settings },
    { id: 'audit-logs', label: '操作ログ', icon: Shield },
    { id: 'help-documentation', label: 'ヘルプ', icon: HelpCircle },
  ];

  const menuItems =
    userRole === 'manager'
      ? managerMenuItems
      : userRole === 'admin'
        ? adminMenuItems
        : employeeMenuItems;
  const currentHash = typeof window !== 'undefined' ? window.location.hash.slice(1).split('?')[0] : '';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">T</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">人事考課システム</h1>
          {userRole === 'manager' && (
            <span className="ml-2 bg-gray-100 px-2.5 py-0.5 rounded text-xs font-medium text-gray-700">
              上司
            </span>
          )}
          {userRole === 'admin' && (
            <span className="ml-2 bg-gray-100 px-2.5 py-0.5 rounded text-xs font-medium text-gray-700">
              管理者
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => (window.location.hash = 'notifications')}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <button
            onClick={() => (window.location.hash = 'profile')}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-medium text-sm">
                {userRole === 'manager' ? '上' : userRole === 'admin' ? '管' : '田'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {userRole === 'manager'
                ? '上司ユーザー'
                : userRole === 'admin'
                  ? '管理者ユーザー'
                  : '田中太郎'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Logout */}
          <button
            onClick={() => (window.location.hash = 'login')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="ログアウト"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-3">
            <ul className="space-y-0.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentHash === item.id || (!currentHash && item.id.includes('dashboard'));

                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive ? 'bg-gray-900 text-white font-medium' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50 min-w-0">{children}</main>
      </div>
    </div>
  );
};
