"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Star, CheckCircle, Clock, PlusCircle, Users, Wallet, User } from "lucide-react";

interface CommissionRate {
  id: string;
  insuranceType: string;
  rate: number;
}

export default function DashboardPage() {
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data;
    },
  });

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await api.get("/insurance/stats");
      return res.data;
    },
    enabled: !!profile && profile.role === "TALI",
  });

  const { data: rates, isLoading: isRatesLoading } = useQuery<CommissionRate[]>({
    queryKey: ["rates"],
    queryFn: async () => {
      const res = await api.get("/commission/my-rates");
      return res.data;
    },
    enabled: !!profile && profile.role === "TALI",
  });

  const { data: recentRequests, isLoading: isRecentLoading } = useQuery({
    queryKey: ["recent-requests"],
    queryFn: async () => {
      const res = await api.get("/insurance/recent");
      return res.data;
    },
    enabled: !!profile && profile.role === "TALI",
  });

  if (isProfileLoading || isStatsLoading || isRatesLoading || isRecentLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isTali = profile?.role === "TALI";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hoşgeldin, {profile?.taliProfile?.fullName || profile?.email}</h1>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/dashboard/requests/create" className="block group">
          <Card className="hover:bg-indigo-50 transition-colors border-indigo-100 cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <PlusCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-indigo-900">Yeni Teklif</h3>
                <p className="text-xs text-indigo-600/70">Hızlıca teklif alın</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/customers" className="block group">
          <Card className="hover:bg-blue-50 transition-colors border-blue-100 cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Müşterilerim</h3>
                <p className="text-xs text-blue-600/70">Müşteri listesi</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/earnings" className="block group">
          <Card className="hover:bg-emerald-50 transition-colors border-emerald-100 cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">Kazançlarım</h3>
                <p className="text-xs text-emerald-600/70">Bakiye ve hareketler</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/profile" className="block group">
          <Card className="hover:bg-purple-50 transition-colors border-purple-100 cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Profilim</h3>
                <p className="text-xs text-purple-600/70">Bilgileri düzenle</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Puan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(profile?.taliProfile?.points).toFixed(2) || 0} Puan</div>
            <p className="text-xs text-muted-foreground">Güncel puanınız</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kazanılan Puan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(stats?.totalEarnings).toFixed(2) || 0} Puan</div>
            <p className="text-xs text-muted-foreground">Toplam kazanılan puan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Poliçeler</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activePolicies || 0}</div>
            <p className="text-xs text-muted-foreground">Onaylanmış poliçeler</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Teklifler</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingOffers || 0}</div>
            <p className="text-xs text-muted-foreground">Teklif bekleyenler</p>
          </CardContent>
        </Card>

      </div>

      {/* Recent Requests */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Son Talepler</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests?.map((request: { id: string; customer: { fullName: string }; type: string; status: string }, key: number) => (
                  <TableRow key={key}>
                    <TableCell>{request.customer?.fullName}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.status}</TableCell>
                  </TableRow>
                ))}
                {(!recentRequests || recentRequests.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Henüz talep yok
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <RecentNotifications />
      </div>
      {/* Commission Rates (Only for Tali) */}
      {isTali && (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Puan Kazanım Oranlarınız ({profile?.taliProfile?.membershipType || "STANDARD"})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sigorta Türü</TableHead>
                  <TableHead>Oran (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates?.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell>{rate.insuranceType}</TableCell>
                    <TableCell>%{rate.rate}</TableCell>
                  </TableRow>
                ))}
                {!rates?.length && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">Puan kazanım oranı bulunamadı.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RecentNotifications() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notification");
      return res.data.slice(0, 5); // Get last 5
    },
  });

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Son Bildirimler</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Son Bildirimler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications?.map((notification: { id: string; title: string; message: string; isRead: boolean }) => (
            <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg border ${!notification.isRead ? 'bg-blue-50 border-blue-100' : 'bg-white'}`}>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
              </div>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
              )}
            </div>
          ))}
          {(!notifications || notifications.length === 0) && (
            <p className="text-center text-muted-foreground py-4">Henüz bildirim yok</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
