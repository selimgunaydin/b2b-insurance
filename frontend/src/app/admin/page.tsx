"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function AdminDashboardPage() {
  const formatAction = (action: string) => {
    const map: Record<string, string> = {
      "USER_LOGIN": "Giriş Yapıldı",
      "CREATE_INSURANCE_REQUEST": "Teklif Talebi",
      "UPDATE_OFFER": "Teklif Güncellendi",
      "APPROVE_OFFER": "Teklif Onaylandı",
      "CONFIRM_PAYMENT": "Ödeme Bildirimi",
      "POLICY_UPLOADED": "Poliçe Yüklendi",
      "CREATE_CANCELLATION": "İptal Talebi",
      "UPDATE_CANCELLATION_STATUS": "İptal Durumu",
      "UPDATE_PERMISSIONS": "Yetki Güncellemesi",
    };
    return map[action] || action;
  };

  const formatDetails = (action: string, details: any) => {
    if (!details) return "-";
    try {
        const d = typeof details === 'string' ? JSON.parse(details) : details;
        
        switch (action) {
            case "CREATE_INSURANCE_REQUEST":
                return `${d.type || 'Sigorta'} talebi oluşturuldu`;
            case "UPDATE_OFFER":
                return `Teklif tutarı: ₺${d.amount}`;
            case "APPROVE_OFFER":
                return "Teklif onaylandı, ödeme bekleniyor";
            case "CONFIRM_PAYMENT":
                return `${d.method === 'CREDIT_CARD' ? 'Kredi Kartı' : 'Havale'} ile ödeme bildirimi`;
            case "POLICY_UPLOADED":
                return `Poliçe yüklendi: ${d.policyNumber || ''}`;
            case "CREATE_CANCELLATION":
                return `İptal talebi: ${d.reason || ''}`;
            case "UPDATE_CANCELLATION_STATUS":
                return `Durum: ${d.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}`;
            default:
                return "-";
        }
    } catch (e) {
        return "-";
    }
  };

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/stats");
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Yönetim Paneli</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Onaylar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Yeni üyelik talepleri</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Teklifler</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingOffers || 0}</div>
            <p className="text-xs text-muted-foreground">Fiyatlandırma bekleyen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Poliçeler</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activePolicies || 0}</div>
            <p className="text-xs text-muted-foreground">Bu ay kesilen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İptal Talepleri</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingCancellations || 0}</div>
            <p className="text-xs text-muted-foreground">İşlem bekleyen</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Detay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.recentActivities?.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.createdAt), "d MMMM HH:mm", { locale: tr })}
                  </TableCell>
                  <TableCell>{log.user?.taliProfile?.fullName || log.user?.email}</TableCell>
                  <TableCell>{formatAction(log.action)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDetails(log.action, log.details)}</TableCell>
                </TableRow>
              ))}
              {!stats?.recentActivities?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Henüz aktivite bulunmuyor.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
