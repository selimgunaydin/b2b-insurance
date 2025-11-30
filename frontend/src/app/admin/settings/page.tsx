"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Settings, Bell, DollarSign, Megaphone, Save, LayoutDashboard, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: "TEXT" | "NUMBER" | "BOOLEAN" | "JSON";
  category: string;
  description: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("GENERAL");
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get("/settings");
      setSettings(res.data);
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast({
        title: "Hata",
        description: "Ayarlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpdate = async (key: string, value: string) => {
    setSavingKey(key);
    try {
      await api.put(`/settings/${key}`, { value });
      toast({
        title: "Başarılı",
        description: "Ayar güncellendi.",
      });
      setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
    } catch (error) {
      console.error("Failed to update setting", error);
      toast({
        title: "Hata",
        description: "Güncelleme başarısız.",
        variant: "destructive",
      });
    } finally {
      setSavingKey(null);
    }
  };

  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendBroadcast = async () => {
    if (!broadcastTitle || !broadcastMessage) {
      toast({
        title: "Hata",
        description: "Lütfen başlık ve mesaj giriniz.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      await api.post("/notification/send", {
        title: broadcastTitle,
        message: broadcastMessage,
        target: "ALL",
      });
      toast({
        title: "Başarılı",
        description: "Bildirim tüm kullanıcılara gönderildi.",
      });
      setBroadcastTitle("");
      setBroadcastMessage("");
    } catch (error) {
      console.error("Failed to send notification", error);
      toast({
        title: "Hata",
        description: "Bildirim gönderilemedi.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const categories = Array.from(new Set(settings.map(s => s.category)));
  // Ensure BROADCAST is not in categories derived from settings if it's a manual tab
  // But here we treat BROADCAST as a special category for the UI

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "NOTIFICATIONS": return <Bell className="h-4 w-4" />;
      case "COMMISSION": return <DollarSign className="h-4 w-4" />;
      case "BROADCAST": return <Megaphone className="h-4 w-4" />;
      case "SECURITY": return <Shield className="h-4 w-4" />;
      default: return <LayoutDashboard className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "GENERAL": return "Genel Ayarlar";
      case "NOTIFICATIONS": return "Bildirimler";
      case "COMMISSION": return "Komisyon & Finans";
      case "BROADCAST": return "Duyuru Merkezi";
      default: return category;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Sistem Ayarları</h2>
        <p className="text-muted-foreground">
          Platform genelindeki yapılandırmaları ve tercihleri yönetin.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto px-4 lg:px-0 pb-2 lg:pb-0">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "secondary" : "ghost"}
                className={`justify-start ${activeCategory === category ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline"}`}
                onClick={() => setActiveCategory(category)}
              >
                <span className="mr-2">{getCategoryIcon(category)}</span>
                {getCategoryLabel(category)}
              </Button>
            ))}
            <Button
              variant={activeCategory === "BROADCAST" ? "secondary" : "ghost"}
              className={`justify-start ${activeCategory === "BROADCAST" ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline"}`}
              onClick={() => setActiveCategory("BROADCAST")}
            >
              <span className="mr-2">{getCategoryIcon("BROADCAST")}</span>
              {getCategoryLabel("BROADCAST")}
            </Button>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          {activeCategory === "BROADCAST" ? (
             <Card>
                <CardHeader>
                  <CardTitle>Duyuru Gönder</CardTitle>
                  <CardDescription>
                    Tüm Tali kullanıcılarına anlık sistem bildirimi gönderin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="broadcast-title">Bildirim Başlığı</Label>
                    <Input 
                      id="broadcast-title" 
                      placeholder="Örn: Sistem Bakım Çalışması" 
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="broadcast-message">Bildirim İçeriği</Label>
                    <Textarea 
                      id="broadcast-message" 
                      placeholder="Duyuru detaylarını buraya yazınız..." 
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      rows={5}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSendBroadcast} disabled={isSending}>
                    {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Megaphone className="mr-2 h-4 w-4" />
                    Herkese Gönder
                  </Button>
                </CardFooter>
              </Card>
          ) : (
            <div className="space-y-6">
              {settings.filter(s => s.category === activeCategory).map((setting) => (
                <Card key={setting.key}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium">{setting.description || setting.key}</CardTitle>
                            <Badge variant="outline" className="font-mono text-xs">{setting.key}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            {setting.type === "BOOLEAN" ? (
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id={setting.key}
                                        checked={setting.value === "true"}
                                        onCheckedChange={(checked) => handleUpdate(setting.key, String(checked))}
                                        disabled={savingKey === setting.key}
                                    />
                                    <Label htmlFor={setting.key}>
                                        {setting.value === "true" ? "Aktif" : "Pasif"}
                                    </Label>
                                    {savingKey === setting.key && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                                </div>
                            ) : (
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        id={setting.key}
                                        type={setting.type === "NUMBER" ? "number" : "text"}
                                        defaultValue={setting.value}
                                        onBlur={(e) => {
                                            if (e.target.value !== setting.value) {
                                                handleUpdate(setting.key, e.target.value);
                                            }
                                        }}
                                        disabled={savingKey === setting.key}
                                        className="max-w-md"
                                    />
                                    {savingKey === setting.key && (
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                            Kaydediliyor...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
              ))}
              {settings.filter(s => s.category === activeCategory).length === 0 && (
                 <div className="text-center py-10 text-muted-foreground">
                    Bu kategoride ayar bulunamadı.
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
