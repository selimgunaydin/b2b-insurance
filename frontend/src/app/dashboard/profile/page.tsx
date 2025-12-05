"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, User, Phone, Mail, FileText, Shield, Award, Edit, ShieldCheck, CreditCard } from "lucide-react";
import { ProfileEditModal } from "@/components/profile/profile-edit-modal";

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const tali = profile?.taliProfile;

  if (!tali) {
    return <div>Profil bilgisi bulunamadı.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profilim</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Kişisel Bilgiler
              </div>
              <ProfileEditModal initialData={{
                phone: tali.phone || "",
                address: tali.address || "",
                birthDate: tali.birthDate || "",
              }} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ad Soyad</p>
                <p className="text-lg">{tali.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">TC Kimlik No</p>
                <p className="text-lg">{tali.tcKimlikNo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doğum Tarihi</p>
                <p className="text-lg">
                  {tali.dateOfBirth ? new Date(tali.dateOfBirth).toLocaleDateString("tr-TR") : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              İletişim Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefon</p>
              <p className="text-lg">{tali.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Adres</p>
              <p className="text-lg">{tali.address || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Badges Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Rozetlerim
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard/badges">Tümünü Gör</a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Rozet</p>
                <p className="text-2xl font-bold">{tali.badges?.length || 0}</p>
              </div>
              {tali.badges && tali.badges.length > 0 && (
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">Son Kazanılan</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    {tali.badges[0].badge.iconUrl ? (
                      <img src={tali.badges[0].badge.iconUrl} alt="" className="w-6 h-6" />
                    ) : (
                      <Award className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className="font-medium">{tali.badges[0].badge.name}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Membership & Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Üyelik Durumu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Üyelik Tipi</p>
                <Badge variant={tali.membershipType === "PREMIUM" ? "default" : "secondary"} className="mt-1">
                  {tali.membershipType}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hesap Durumu</p>
                <Badge variant={profile.isApproved ? "default" : "destructive"} className="mt-1 bg-green-600 hover:bg-green-700">
                  {profile.isApproved ? "Onaylı" : "Onay Bekliyor"}
                </Badge>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Puan: {Number(tali.points).toFixed(2)} Puan</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm">Güven Puanı: {Math.min(tali.trustScore || 100, 100)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
