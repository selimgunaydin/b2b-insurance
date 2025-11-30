"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Settings } from "lucide-react";
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
      // Update local state
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

  const categories = Array.from(new Set(settings.map(s => s.category)));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-slate-700" />
        <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
      </div>

      <Tabs defaultValue={categories[0] || "GENERAL"} className="w-full">
        <TabsList className="mb-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category === "GENERAL" ? "Genel" : 
               category === "NOTIFICATIONS" ? "Bildirimler" : 
               category === "COMMISSION" ? "Komisyon" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle>{category} Ayarları</CardTitle>
                <CardDescription>Bu kategorideki sistem ayarlarını buradan yönetebilirsiniz.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.filter(s => s.category === category).map(setting => (
                  <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                    <div className="space-y-1 flex-1 mr-4">
                      <Label htmlFor={setting.key} className="text-base font-medium">
                        {setting.description || setting.key}
                      </Label>
                      <p className="text-sm text-muted-foreground font-mono">{setting.key}</p>
                    </div>

                    <div className="flex items-center gap-4 w-1/2 justify-end">
                      {setting.type === "BOOLEAN" ? (
                        <Switch
                          id={setting.key}
                          checked={setting.value === "true"}
                          onCheckedChange={(checked) => handleUpdate(setting.key, String(checked))}
                          disabled={savingKey === setting.key}
                        />
                      ) : (
                        <div className="flex gap-2 w-full max-w-xs">
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
                          />
                          {savingKey === setting.key && <Loader2 className="h-4 w-4 animate-spin" />}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
