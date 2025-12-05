"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, Loader2, Mail, FileText, Shield, XCircle, Crown, ShoppingBag, Gift } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "SYSTEM" | "ADMIN_MESSAGE" | "RENEWAL" | "OFFER" | "POLICY" | "CANCELLATION" | "PREMIUM" | "MARKET";
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notification");
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notification/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notification/read-all");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "RENEWAL":
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case "ADMIN_MESSAGE":
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "OFFER":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "POLICY":
        return <Shield className="h-5 w-5 text-indigo-500" />;
      case "CANCELLATION":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "PREMIUM":
        return <Crown className="h-5 w-5 text-amber-500" />;
      case "MARKET":
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bildirimler</h2>
          <p className="text-muted-foreground">
            Sistem bildirimleri ve duyurular
          </p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Tümünü Okundu İşaretle
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p>Henüz hiç bildiriminiz yok.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.isRead ? 'bg-blue-50/50 border-blue-200' : ''}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1 bg-white p-2 rounded-full shadow-sm border">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${!notification.isRead ? 'text-blue-900' : ''}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {format(new Date(notification.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                    onClick={() => markAsRead(notification.id)}
                    title="Okundu işaretle"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
