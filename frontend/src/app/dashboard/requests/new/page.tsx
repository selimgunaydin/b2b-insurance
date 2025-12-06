"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Shield, Heart, Home, Building, Loader2, Lock, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const insuranceTypes = [
  {
    id: "TRAFIK",
    title: "Zorunlu Trafik Sigortası",
    description: "Araçlar için zorunlu mali mesuliyet sigortası.",
    icon: Car,
    href: "/dashboard/requests/new/traffic",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "KASKO",
    title: "Kasko Sigortası",
    description: "Aracınız için kapsamlı koruma.",
    icon: Shield,
    href: "/dashboard/requests/new/kasko",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    id: "SAGLIK",
    title: "Tamamlayıcı Sağlık",
    description: "SGK anlaşmalı hastanelerde fark ödemeyin.",
    icon: Heart,
    href: "/dashboard/requests/new/health",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: "DASK",
    title: "DASK",
    description: "Zorunlu deprem sigortası.",
    icon: Home,
    href: "/dashboard/requests/new/dask",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    id: "KONUT",
    title: "Konut Sigortası",
    description: "Eviniz ve eşyalarınız güvende olsun.",
    icon: Building,
    href: "/dashboard/requests/new/housing",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
];

interface SystemSetting {
  key: string;
  value: string;
}

interface TrustRestriction {
  type: string;
  allowed: boolean;
  reason: string | null;
  minRequired: number;
}

interface TrustRestrictionsResponse {
  trustScoreEnabled: boolean;
  userTrustScore: number;
  restrictions: TrustRestriction[];
}

export default function NewRequestPage() {
  const { data: config, isLoading: configLoading } = useQuery<SystemSetting[]>({
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

  const { data: trustRestrictions, isLoading: trustLoading } = useQuery<TrustRestrictionsResponse>({
    queryKey: ["trust-restrictions"],
    queryFn: async () => {
      const res = await api.get("/settings/trust-restrictions");
      return res.data;
    },
  });

  if (configLoading || userLoading || trustLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const allowedTypes = user?.taliProfile?.allowedInsuranceTypes || [];
  const isAllAllowed = allowedTypes.length === 0;

  // Build type availability map
  const typeAvailability = insuranceTypes.map(type => {
    // 1. Global Check
    const globalSetting = config?.find((s) => s.key === `insurance_type_${type.id}_enabled`);
    if (globalSetting && globalSetting.value === 'false') {
      return { ...type, available: false, reason: "Bu sigorta türü şu anda sistem genelinde pasiftir.", reasonType: "global" };
    }

    // 2. User Permission Check
    if (!isAllAllowed && !allowedTypes.includes(type.id)) {
      return { ...type, available: false, reason: "Bu sigorta türü için yetkiniz bulunmamaktadır.", reasonType: "permission" };
    }

    // 3. Trust Score Check
    const trustRestriction = trustRestrictions?.restrictions?.find(r => r.type === type.id);
    if (trustRestriction && !trustRestriction.allowed) {
      return { 
        ...type, 
        available: false, 
        reason: trustRestriction.reason || "Güven puanınız yetersiz.", 
        reasonType: "trust",
        minRequired: trustRestriction.minRequired,
      };
    }

    return { ...type, available: true, reason: null, reasonType: null };
  });

  const availableTypes = typeAvailability.filter(t => t.available);
  const unavailableTypes = typeAvailability.filter(t => !t.available);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Yeni Teklif İste</h1>
          <p className="text-muted-foreground">
            Müşteriniz için uygun sigorta türünü seçerek teklif oluşturun.
          </p>
          {trustRestrictions?.trustScoreEnabled && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                Güven Puanınız: <span className="font-bold ml-1">{trustRestrictions.userTrustScore}</span>
              </Badge>
            </div>
          )}
        </div>

        {availableTypes.length === 0 && unavailableTypes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Şu anda oluşturabileceğiniz bir sigorta teklifi bulunmamaktadır.
          </div>
        ) : (
          <>
            {/* Available Types */}
            {availableTypes.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableTypes.map((type) => {
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

            {/* Unavailable Types */}
            {unavailableTypes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Kullanılamayan Türler
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {unavailableTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Tooltip key={type.id}>
                        <TooltipTrigger asChild>
                          <Card className="h-full opacity-50 cursor-not-allowed border-dashed">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className={`mb-2 text-gray-400`}>
                                  <Icon className="h-8 w-8" />
                                </div>
                                {type.reasonType === "trust" && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Min: {(type as any).minRequired}
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-gray-500">{type.title}</CardTitle>
                              <CardDescription>{type.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <span className="text-sm text-gray-400 flex items-center gap-1">
                                <Lock className="h-3 w-3" /> Kullanılamaz
                              </span>
                            </CardContent>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p>{type.reason}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
