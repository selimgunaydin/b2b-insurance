"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, DollarSign, CheckCircle, Clock } from "lucide-react";

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

  const { data: rates, isLoading: isRatesLoading } = useQuery({
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
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Bakiye</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{profile?.taliProfile?.balance || 0}</div>
            <p className="text-xs text-muted-foreground">Güncel bakiyeniz</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kazanç</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{stats?.totalEarnings || 0}</div>
            <p className="text-xs text-muted-foreground">Toplam komisyon geliri</p>
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
                {recentRequests?.map((request: { id: string; customer: { fullName: string }; type: string; status: string }) => (
                  <TableRow key={request.id}>
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
            <CardTitle>Komisyon Oranlarınız ({profile?.taliProfile?.membershipType || "STANDARD"})</CardTitle>
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
                {rates?.map((rate: any) => (
                  <TableRow key={rate.id}>
                    <TableCell>{rate.insuranceType}</TableCell>
                    <TableCell>%{rate.rate}</TableCell>
                  </TableRow>
                ))}
                {!rates?.length && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">Komisyon oranı bulunamadı.</TableCell>
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
