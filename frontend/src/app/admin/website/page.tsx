"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebsiteContent {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
}

export default function AdminWebsitePage() {
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      const res = await api.get("/cms");
      setContent(res.data);
    } catch (error) {
      console.error("Failed to fetch content", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleUpdate = async (key: string, value: string, type: string, category: string) => {
    setIsSaving(true);
    try {
      await api.post("/cms", { key, value, type, category });
      toast({
        title: "Başarılı",
        description: "İçerik güncellendi.",
      });
      fetchContent();
    } catch (error) {
      console.error(error);
      toast({
        title: "Hata",
        description: "İçerik güncellenemedi.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInitialize = async () => {
    try {
      await api.post("/cms/initialize");
      toast({
        title: "Başarılı",
        description: "Varsayılan içerikler oluşturuldu.",
      });
      fetchContent();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const categories = Array.from(new Set(content.map(c => c.category)));

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold">Website Yönetimi</h1>
            <p className="text-muted-foreground">Website içeriklerini düzenleyin</p>
          </div>
        </div>
        <Button onClick={handleInitialize} variant="outline">
          Varsayılan İçerikleri Oluştur
        </Button>
      </div>

      {categories.map(category => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category === "HOME" ? "Ana Sayfa" : category === "ABOUT" ? "Hakkımızda" : category === "CONTACT" ? "İletişim" : "Referanslar"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.filter(c => c.category === category).map(item => (
              <div key={item.id} className="p-4 border rounded-lg space-y-3">
                <div>
                  <Label className="text-sm font-medium">{item.key}</Label>
                  <p className="text-xs text-muted-foreground mt-1">Tip: {item.type}</p>
                </div>
                
                {item.type === "TEXT" ? (
                  <Input
                    defaultValue={item.value}
                    onBlur={(e) => {
                      if (e.target.value !== item.value) {
                        handleUpdate(item.key, e.target.value, item.type, item.category);
                      }
                    }}
                  />
                ) : (
                  <Textarea
                    defaultValue={item.value}
                    rows={3}
                    onBlur={(e) => {
                      if (e.target.value !== item.value) {
                        handleUpdate(item.key, e.target.value, item.type, item.category);
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Kaydediliyor...
        </div>
      )}
    </div>
  );
}
