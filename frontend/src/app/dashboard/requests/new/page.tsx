"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Shield, Heart, Home, Building } from "lucide-react";

const insuranceTypes = [
  {
    id: "TRAFIK",
    title: "Zorunlu Trafik Sigortası",
    description: "Araçlar için zorunlu mali mesuliyet sigortası.",
    icon: Car,
    href: "/dashboard/requests/new/traffic",
    color: "text-blue-500",
  },
  {
    id: "KASKO",
    title: "Kasko Sigortası",
    description: "Aracınız için kapsamlı koruma.",
    icon: Shield,
    href: "/dashboard/requests/new/kasko",
    color: "text-indigo-500",
  },
  {
    id: "SAGLIK",
    title: "Tamamlayıcı Sağlık",
    description: "SGK anlaşmalı hastanelerde fark ödemeyin.",
    icon: Heart,
    href: "/dashboard/requests/new/health",
    color: "text-red-500",
  },
  {
    id: "DASK",
    title: "DASK",
    description: "Zorunlu deprem sigortası.",
    icon: Home,
    href: "/dashboard/requests/new/dask",
    color: "text-orange-500",
  },
  {
    id: "KONUT",
    title: "Konut Sigortası",
    description: "Eviniz ve eşyalarınız güvende olsun.",
    icon: Building,
    href: "/dashboard/requests/new/housing",
    color: "text-green-500",
  },
];

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function NewRequestPage() {
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["settings-config"],
    queryFn: async () => {
      const res = await api.get("/settings/config");
      return res.data;
    },
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data;
    },
  });

  if (configLoading || userLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const allowedTypes = user?.taliProfile?.allowedInsuranceTypes || [];
  const isAllAllowed = allowedTypes.length === 0;

  const filteredTypes = insuranceTypes.filter(type => {
    // 1. Global Check
    const globalSetting = config?.find((s: any) => s.key === `insurance_type_${type.id}_enabled`);
    if (globalSetting && globalSetting.value === 'false') return false;

    // 2. User Permission Check
    if (!isAllAllowed && !allowedTypes.includes(type.id)) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Yeni Teklif İste</h1>
        <p className="text-muted-foreground">
          Müşteriniz için uygun sigorta türünü seçerek teklif oluşturun.
        </p>
      </div>

      {filteredTypes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
            Şu anda oluşturabileceğiniz bir sigorta teklifi bulunmamaktadır.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTypes.map((type) => {
            const Icon = type.icon;
            return (
                <Link key={type.id} href={type.href}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer">
                    <CardHeader>
                    <div className={`mb-2 ${type.color}`}>
                        <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle>{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <span className="text-sm font-medium text-primary">Teklif Oluştur &rarr;</span>
                    </CardContent>
                </Card>
                </Link>
            );
            })}
        </div>
      )}
    </div>
  );
}
