import React, { useState } from "react";
import { Bell, MessageSquare, ArrowRight } from "lucide-react";
import { Layout } from "./Layout";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

interface Notification {
  id: number;
  icon: "bell" | "announcement";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionLink?: string;
  actionLabel?: string;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      icon: "bell",
      title: "自己評価の締切が近づいています",
      message: "自己評価の提出期限は9/10です。まだ下書きの状態です。",
      time: "3時間前",
      isRead: false,
      actionLink: "#self-evaluation",
      actionLabel: "確認する"
    },
    {
      id: 2,
      icon: "bell",
      title: "佐藤さんの同僚評価をお願いします",
      message: "佐藤花子さんの同僚評価が割り当てられました。",
      time: "1日前",
      isRead: false,
      actionLink: "#peer-evaluation",
      actionLabel: "評価する"
    },
    {
      id: 3,
      icon: "announcement",
      title: "2025年度の評価期間が開始されました",
      message: "評価期間: 2024/10/01 〜 2025/09/30",
      time: "3日前",
      isRead: true
    },
    {
      id: 4,
      icon: "bell",
      title: "2024年度の評価が確定しました",
      message: "ランク: A、昇給: +3号俸",
      time: "1ヶ月前",
      isRead: true
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (icon: "bell" | "announcement") => {
    switch (icon) {
      case "bell":
        return <Bell className="w-5 h-5 text-primary-500" />;
      case "announcement":
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">通知一覧</h1>
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            すべて既読にする
          </button>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="unread">未読({unreadCount})</TabsTrigger>
            <TabsTrigger value="evaluation">評価関連</TabsTrigger>
            <TabsTrigger value="system">システム</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${
                  !notification.isRead
                    ? "border-primary-200 bg-primary-50"
                    : "bg-gray-50"
                }`}
              >
                <CardContent className="py-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">{notification.time}</p>
                    </div>

                    {/* Action */}
                    {notification.actionLink && notification.actionLabel && (
                      <div className="flex-shrink-0">
                        <a
                          href={notification.actionLink}
                          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {notification.actionLabel}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="unread" className="mt-6 space-y-4">
            {notifications
              .filter((n) => !n.isRead)
              .map((notification) => (
                <Card
                  key={notification.id}
                  className="border-primary-200 bg-primary-50"
                >
                  <CardContent className="py-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-700 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-500">{notification.time}</p>
                      </div>
                      {notification.actionLink && notification.actionLabel && (
                        <div className="flex-shrink-0">
                          <a
                            href={notification.actionLink}
                            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {notification.actionLabel}
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="evaluation" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                評価関連の通知がここに表示されます
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                システム通知がここに表示されます
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex justify-center gap-2 pt-4">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            &lt; 前へ
          </button>
          <button className="px-3 py-1 bg-primary-500 text-white rounded">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            次へ &gt;
          </button>
        </div>
      </div>
    </Layout>
  );
};