"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Globe, Image, Type, Plus, Trash2, RefreshCw, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebsiteContent {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  GENERAL: "Genel Ayarlar",
  HOME: "Ana Sayfa",
  ABOUT: "Hakkımızda",
  CONTACT: "İletişim",
  SOCIAL: "Sosyal Medya",
  SEO: "SEO Ayarları",
  REFERENCES: "Referanslar",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  GENERAL: "Logo, site adı ve genel görünüm ayarları",
  HOME: "Ana sayfa içeriği, hero bölümü ve özellikler",
  ABOUT: "Hakkımızda sayfası içeriği",
  CONTACT: "İletişim bilgileri ve çalışma saatleri",
  SOCIAL: "Sosyal medya bağlantıları",
  SEO: "Arama motoru optimizasyonu ayarları",
  REFERENCES: "Referanslar sayfası içeriği",
};

const KEY_LABELS: Record<string, string> = {
  site_logo: "Site Logosu",
  site_name: "Site Adı",
  site_tagline: "Site Sloganı",
  footer_text: "Footer Metni",
  hero_title: "Hero Başlık",
  hero_subtitle: "Hero Alt Başlık",
  hero_cta_primary: "Birincil Buton Metni",
  hero_cta_secondary: "İkincil Buton Metni",
  hero_background: "Hero Arka Plan Görseli",
  features_title: "Özellikler Başlık",
  features_subtitle: "Özellikler Alt Başlık",
  feature_1_title: "Özellik 1 Başlık",
  feature_1_description: "Özellik 1 Açıklama",
  feature_2_title: "Özellik 2 Başlık",
  feature_2_description: "Özellik 2 Açıklama",
  feature_3_title: "Özellik 3 Başlık",
  feature_3_description: "Özellik 3 Açıklama",
  feature_4_title: "Özellik 4 Başlık",
  feature_4_description: "Özellik 4 Açıklama",
  cta_title: "CTA Başlık",
  cta_subtitle: "CTA Alt Başlık",
  cta_button: "CTA Buton Metni",
  about_title: "Sayfa Başlığı",
  about_text: "Hakkımızda Metni",
  about_vision: "Vizyon",
  about_mission: "Misyon",
  about_image: "Görsel",
  contact_title: "Sayfa Başlığı",
  contact_subtitle: "Alt Başlık",
  contact_phone: "Telefon",
  contact_email: "E-posta",
  contact_address: "Adres",
  contact_working_hours: "Çalışma Saatleri",
  contact_map_embed: "Harita Embed Kodu",
  social_facebook: "Facebook",
  social_twitter: "Twitter/X",
  social_instagram: "Instagram",
  social_linkedin: "LinkedIn",
  social_whatsapp: "WhatsApp",
  seo_title: "Sayfa Başlığı (Title)",
  seo_description: "Meta Açıklama",
  seo_keywords: "Anahtar Kelimeler",
  references_title: "Sayfa Başlığı",
  references_subtitle: "Alt Başlık",
};

export default function AdminWebsitePage() {
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("GENERAL");
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      const res = await api.get("/cms");
      setContent(res.data);
      // Initialize edited values
      const initial: Record<string, string> = {};
      res.data.forEach((c: WebsiteContent) => {
        initial[c.key] = c.value;
      });
      setEditedValues(initial);
    } catch (error) {
      console.error("Failed to fetch content", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleValueChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string, type: string, category: string) => {
    setIsSaving(true);
    try {
      await api.post("/cms", { 
        key, 
        value: editedValues[key] || "", 
        type, 
        category 
      });
      toast({
        title: "Başarılı",
        description: `"${KEY_LABELS[key] || key}" güncellendi.`,
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

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const items = content
        .filter((item) => item.category === activeTab)
        .map((item) => ({
          key: item.key,
          value: editedValues[item.key] || "",
          type: item.type,
          category: item.category,
        }));
      
      await api.post("/cms/bulk", { items });
      toast({
        title: "Başarılı",
        description: `${CATEGORY_LABELS[activeTab]} içerikleri kaydedildi.`,
      });
      fetchContent();
    } catch (error) {
      console.error(error);
      toast({
        title: "Hata",
        description: "İçerikler güncellenemedi.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      await api.post("/cms/initialize");
      toast({
        title: "Başarılı",
        description: "Varsayılan içerikler oluşturuldu.",
      });
      fetchContent();
    } catch (error) {
      console.error(error);
      toast({
        title: "Hata",
        description: "Varsayılan içerikler oluşturulamadı.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "IMAGE_URL":
        return <Image className="h-4 w-4" />;
      case "HTML":
        return <Code className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const categories = Object.keys(CATEGORY_LABELS).filter((cat) =>
    content.some((c) => c.category === cat)
  );

  // If no content exists, show initialize button
  if (content.length === 0) {
    return (
      <div className="p-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Globe className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Website İçerikleri</CardTitle>
            <CardDescription>
              Henüz içerik bulunmuyor. Varsayılan içerikleri oluşturmak için aşağıdaki butona tıklayın.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleInitialize} className="w-full" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Varsayılan İçerikleri Oluştur
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold">Website Yönetimi</h1>
            <p className="text-muted-foreground">Website içeriklerini düzenleyin</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInitialize} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Varsayılanları Yükle
          </Button>
          <Button onClick={handleSaveAll} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Tümünü Kaydet
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
          {Object.keys(CATEGORY_LABELS).map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-xs sm:text-sm">
              {CATEGORY_LABELS[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(CATEGORY_LABELS).map((category) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle>{CATEGORY_LABELS[category]}</CardTitle>
                <CardDescription>{CATEGORY_DESCRIPTIONS[category]}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {content
                  .filter((c) => c.category === category)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <Label className="text-sm font-medium">
                            {KEY_LABELS[item.key] || item.key}
                          </Label>
                        </div>
                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </div>

                      {item.type === "IMAGE_URL" ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Görsel URL'si girin veya yükleyin"
                            value={editedValues[item.key] || ""}
                            onChange={(e) => handleValueChange(item.key, e.target.value)}
                          />
                          {editedValues[item.key] && (
                            <div className="relative w-32 h-32 border rounded overflow-hidden">
                              <img
                                src={editedValues[item.key]}
                                alt={item.key}
                                className="object-contain w-full h-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ) : item.type === "HTML" ? (
                        <Textarea
                          placeholder="HTML içeriği girin..."
                          rows={5}
                          value={editedValues[item.key] || ""}
                          onChange={(e) => handleValueChange(item.key, e.target.value)}
                          className="font-mono text-sm"
                        />
                      ) : (
                        <Input
                          placeholder="Değer girin..."
                          value={editedValues[item.key] || ""}
                          onChange={(e) => handleValueChange(item.key, e.target.value)}
                        />
                      )}

                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSave(item.key, item.type, item.category)}
                          disabled={isSaving}
                        >
                          <Save className="mr-2 h-3 w-3" />
                          Kaydet
                        </Button>
                      </div>
                    </div>
                  ))}

                {content.filter((c) => c.category === category).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Bu kategoride içerik bulunmuyor.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Saving indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          Kaydediliyor...
        </div>
      )}
    </div>
  );
}
