"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Settings, Bell, DollarSign, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const fetchSettings = async () => {
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
  };

  useEffect(() => {
    fetchSettings();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "NOTIFICATIONS": return <Bell className="h-5 w-5" />;
      case "COMMISSION": return <DollarSign className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "GENERAL": return "Genel Ayarlar";
      case "NOTIFICATIONS": return "Bildirim Ayarları";
      case "COMMISSION": return "Komisyon Ayarları";
      default: return category;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-slate-700" />
        <div>
          <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
          <p className="text-muted-foreground">Sistem genelindeki ayarları yönetin</p>
        </div>
      </div>

      <Tabs defaultValue={categories[0] || "GENERAL"} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="flex items-center gap-2">
              {getCategoryIcon(category)}
              <span className="hidden sm:inline">
                {category === "GENERAL" ? "Genel" : 
                 category === "NOTIFICATIONS" ? "Bildirim" : 
                 category === "COMMISSION" ? "Komisyon" : category}
              </span>
            </TabsTrigger>
          ))}
          <TabsTrigger value="BROADCAST" className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            <span className="hidden sm:inline">Duyuru</span>
          </TabsTrigger>
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category)}
                  <div>
                    <CardTitle>{getCategoryTitle(category)}</CardTitle>
                    <CardDescription>Bu kategorideki sistem ayarlarını yönetin</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.filter(s => s.category === category).map(setting => (
                  <div key={setting.key} className="p-4 border rounded-lg hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={setting.key} className="text-base font-medium cursor-pointer">
                          {setting.description || setting.key}
                        </Label>
                        <p className="text-xs text-muted-foreground font-mono bg-slate-100 px-2 py-1 rounded inline-block">
                          {setting.key}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {setting.type === "BOOLEAN" ? (
                          <div className="flex items-center gap-2">
                            <Switch
                              id={setting.key}
                              checked={setting.value === "true"}
                              onCheckedChange={(checked) => handleUpdate(setting.key, String(checked))}
                              disabled={savingKey === setting.key}
                            />
                            {savingKey === setting.key && <Loader2 className="h-4 w-4 animate-spin" />}
                          </div>
                        ) : (
                          <div className="flex gap-2 w-80">
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
                              className="text-sm"
                            />
                            {savingKey === setting.key && <Loader2 className="h-4 w-4 animate-spin" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="BROADCAST" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5" />
                <div>
                  <CardTitle>Duyuru Gönder</CardTitle>
                  <CardDescription>Tüm Tali kullanıcılarına bildirim gönderin</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="broadcast-title">Başlık</Label>
                <Input 
                  id="broadcast-title" 
                  placeholder="Duyuru Başlığı" 
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="broadcast-message">Mesaj</Label>
                <Textarea 
                  id="broadcast-message" 
                  placeholder="Duyuru içeriği..." 
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSendBroadcast} disabled={isSending}>
                  {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Megaphone className="mr-2 h-4 w-4" />
                  Gönder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
