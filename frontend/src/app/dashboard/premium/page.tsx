"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, Crown, Star, ShieldCheck, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function PremiumPage() {
  const { toast } = useToast();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    method: "WHATSAPP" | "VIRTUAL_POS";
  }>({
    isOpen: false,
    method: "WHATSAPP",
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data;
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data;
    },
  });

  const requestMutation = useMutation({
    mutationFn: async (method: string) => {
      await api.post("/premium/request", { paymentMethod: method });
    },
    onSuccess: () => {
      toast({
        title: "Talep Alındı",
        description: "Premium geçiş talebiniz başarıyla oluşturuldu. Admin onayı bekleniyor.",
      });
      setConfirmModal({ ...confirmModal, isOpen: false });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.response?.data?.message || "Bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const isPremiumActive = settings?.find((s: any) => s.key === "premium_system_active")?.value === "true";

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isPremiumActive && profile?.taliProfile?.membershipType !== "PREMIUM") {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
        <Crown className="h-16 w-16 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold text-muted-foreground">Premium Sistem Yakında!</h2>
        <p className="text-muted-foreground max-w-md">
          Premium üyelik sistemi şu anda aktif değildir. Çok yakında daha fazla avantajla hizmetinizde olacağız.
        </p>
      </div>
    );
  }

  const isPremium = profile?.taliProfile?.membershipType === "PREMIUM";

  const benefits = [
    { icon: Zap, text: "Daha Yüksek Puan Kazanım Oranları" },
    { icon: Star, text: "Özel Kampanyalar ve Hedefler" },
    { icon: ShieldCheck, text: "Öncelikli Destek Hattı" },
    { icon: Crown, text: "Premium Rozeti ve Prestij" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
          Premium Dünyasına Hoş Geldiniz
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          İşinizi büyütmek ve kazancınızı artırmak için Premium avantajlarından yararlanın.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Standard Plan */}
        <Card className="relative border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Standart Üyelik</CardTitle>
            <CardDescription>Mevcut başlangıç paketiniz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">Ücretsiz</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Standart Puan Kazanım Oranları</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Temel Sigorta Ürünleri</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Standart Destek</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              {isPremium ? "Aktif Değil" : "Mevcut Plan"}
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className={`relative border-2 ${isPremium ? "border-yellow-500 bg-yellow-50/50" : "border-primary shadow-lg"}`}>
          {isPremium && (
            <div className="absolute -top-4 right-4">
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 text-sm">
                AKTİF
              </Badge>
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-yellow-700">Premium Üyelik</CardTitle>
              <Crown className="h-8 w-8 text-yellow-500" />
            </div>
            <CardDescription>Profesyoneller için tasarlandı</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-3xl font-bold text-yellow-700">
              Avantajlı Fiyat
              <span className="text-sm font-normal text-muted-foreground block mt-1">Yıllık veya Aylık Planlar</span>
            </div>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <benefit.icon className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {isPremium ? (
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" disabled>
                Premium Üyesiniz
              </Button>
            ) : (
              <>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-md transition-all hover:scale-[1.02]"
                  onClick={() => setConfirmModal({ isOpen: true, method: "WHATSAPP" })}
                  disabled={requestMutation.isPending}
                >
                  {requestMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Crown className="mr-2 h-4 w-4" />}
                  Hemen Premium'a Geç
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Başvurunuz incelendikten sonra onaylanacaktır.
                </p>
              </>
            )}
          </CardFooter>
        </Card>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => requestMutation.mutate(confirmModal.method)}
        title="Premium Başvurusu"
        description="Premium üyeliğe geçiş talebinizi onaylıyor musunuz? Müşteri temsilcimiz sizinle iletişime geçecektir."
        isLoading={requestMutation.isPending}
      />
    </div>
  );
}
