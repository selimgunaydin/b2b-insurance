"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Settings, Bell, DollarSign, Megaphone, Save, 
  Shield, Mail, Palette, Globe, Users, Zap, AlertCircle,
  CheckCircle2, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: "TEXT" | "NUMBER" | "BOOLEAN" | "JSON";
  category: string;
  description: string;
}

const CATEGORY_CONFIG = {
  GENERAL: { label: "Genel", icon: Settings, color: "text-gray-600" },
  SECURITY: { label: "Güvenlik", icon: Shield, color: "text-red-600" },
  NOTIFICATIONS: { label: "Bildirimler", icon: Bell, color: "text-blue-600" },
  COMMISSION: { label: "Komisyon", icon: DollarSign, color: "text-green-600" },
  EMAIL: { label: "E-posta", icon: Mail, color: "text-purple-600" },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [broadcastStats, setBroadcastStats] = useState<{ activeUsers: number; onlineUsers: number } | null>(null);

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

  const fetchBroadcastStats = useCallback(async () => {
    try {
      const res = await api.get("/admin/stats/broadcast");
      setBroadcastStats(res.data);
    } catch (error) {
      console.error("Failed to fetch broadcast stats", error);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (activeTab === "broadcast") {
      fetchBroadcastStats();
      // Optional: Set up an interval to refresh online users count
      const interval = setInterval(fetchBroadcastStats, 10000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchBroadcastStats]);

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

  const getSettingsByCategory = (category: string) => 
    settings.filter(s => s.category === category);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Settings className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sistem Ayarları</h1>
            <p className="text-sm text-muted-foreground">Platform yapılandırmaları ve tercihler</p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchSettings}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Yenile
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Genel</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Güvenlik</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Bildirimler</span>
          </TabsTrigger>
          <TabsTrigger value="commission" className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Komisyon</span>
          </TabsTrigger>
          <TabsTrigger value="broadcast" className="gap-2">
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">Duyuru</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Genel Ayarlar</CardTitle>
              <CardDescription>Platform genelindeki temel yapılandırmalar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getSettingsByCategory("GENERAL").map((setting) => (
                <SettingItem
                  key={setting.key}
                  setting={setting}
                  savingKey={savingKey}
                  onUpdate={handleUpdate}
                />
              ))}
              {getSettingsByCategory("GENERAL").length === 0 && (
                <EmptyState message="Genel ayar bulunamadı" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-red-200">
            <CardHeader className="bg-red-50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <Shield className="h-5 w-5" />
                Güvenlik Ayarları
              </CardTitle>
              <CardDescription>Kullanıcı kayıt ve erişim kontrolleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {getSettingsByCategory("SECURITY").length > 0 ? (
                getSettingsByCategory("SECURITY").map((setting) => (
                  <SettingItem
                    key={setting.key}
                    setting={setting}
                    savingKey={savingKey}
                    onUpdate={handleUpdate}
                  />
                ))
              ) : (
                <>
                  {/* Manual security settings if not in DB */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Yeni Kayıt İzni</Label>
                      <p className="text-sm text-muted-foreground">Yeni kullanıcı kayıtlarına izin ver</p>
                    </div>
                    <Switch
                      checked={settings.find(s => s.key === "allow_new_registration")?.value === "true"}
                      onCheckedChange={(checked) => handleUpdate("allow_new_registration", String(checked))}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Bildirim Ayarları
              </CardTitle>
              <CardDescription>Sistem bildirimleri ve e-posta ayarları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getSettingsByCategory("NOTIFICATIONS").map((setting) => (
                <SettingItem
                  key={setting.key}
                  setting={setting}
                  savingKey={savingKey}
                  onUpdate={handleUpdate}
                />
              ))}
              {getSettingsByCategory("NOTIFICATIONS").length === 0 && (
                <EmptyState message="Bildirim ayarı bulunamadı" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Settings */}
        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Komisyon Oranları
              </CardTitle>
              <CardDescription>Üyelik tiplerine göre komisyon oranları (%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getSettingsByCategory("COMMISSION").map((setting) => (
                <SettingItem
                  key={setting.key}
                  setting={setting}
                  savingKey={savingKey}
                  onUpdate={handleUpdate}
                />
              ))}
              {getSettingsByCategory("COMMISSION").length === 0 && (
                <EmptyState message="Komisyon ayarı bulunamadı" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Broadcast */}
        <TabsContent value="broadcast" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-orange-500" />
                  Toplu Duyuru
                </CardTitle>
                <CardDescription>Tüm Tali kullanıcılarına anlık bildirim gönder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="broadcast-title">Başlık</Label>
                  <Input
                    id="broadcast-title"
                    placeholder="Örn: Sistem Bakım Duyurusu"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broadcast-message">Mesaj</Label>
                  <Textarea
                    id="broadcast-message"
                    placeholder="Duyuru içeriğini yazın..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSendBroadcast} 
                  disabled={isSending || !broadcastTitle || !broadcastMessage}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Megaphone className="mr-2 h-4 w-4" />
                  Herkese Gönder
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Hızlı İstatistikler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">
                      {broadcastStats ? broadcastStats.activeUsers : "-"}
                    </p>
                    <p className="text-xs text-green-600">Aktif Kullanıcı</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <Zap className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">
                      {broadcastStats ? broadcastStats.onlineUsers : "-"}
                    </p>
                    <p className="text-xs text-blue-600">Çevrimiçi</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Son duyuru gönderildiğinde tüm aktif Tali kullanıcılarına anlık bildirim iletilecektir.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Setting Item Component
function SettingItem({ 
  setting, 
  savingKey, 
  onUpdate 
}: { 
  setting: SystemSetting; 
  savingKey: string | null; 
  onUpdate: (key: string, value: string) => void;
}) {
  const isSaving = savingKey === setting.key;
  
  // Parse description for display
  const getDisplayName = (key: string, description: string) => {
    if (description) return description;
    // Convert key to readable name
    return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="space-y-1 flex-1 mr-4">
        <div className="flex items-center gap-2">
          <Label className="font-medium">{getDisplayName(setting.key, setting.description)}</Label>
          <Badge variant="outline" className="text-xs font-mono">{setting.key}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Tip: {setting.type}</p>
      </div>
      
      <div className="flex items-center gap-2">
        {setting.type === "BOOLEAN" ? (
          <div className="flex items-center gap-2">
            <Switch
              checked={setting.value === "true"}
              onCheckedChange={(checked) => onUpdate(setting.key, String(checked))}
              disabled={isSaving}
            />
            <span className="text-sm text-muted-foreground w-12">
              {setting.value === "true" ? "Açık" : "Kapalı"}
            </span>
          </div>
        ) : (
          <Input
            type={setting.type === "NUMBER" ? "number" : "text"}
            defaultValue={setting.value}
            onBlur={(e) => {
              if (e.target.value !== setting.value) {
                onUpdate(setting.key, e.target.value);
              }
            }}
            disabled={isSaving}
            className="w-48"
          />
        )}
        {isSaving && <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="h-10 w-10 text-gray-300 mb-3" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
