"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertCircle, CheckCircle, Loader2, UserCheck, BarChart, Settings } from "lucide-react";
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

  const formatDetails = (action: string, details: unknown) => {
    if (!details) return "-";
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const d = typeof details === 'string' ? JSON.parse(details) : details as Record<string, any>;
        
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

// ...



  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [statsRes, topTalisRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/dashboard/top-talis?limit=5")
      ]);
      return { ...statsRes.data, topTalis: topTalisRes.data };
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const monthlyRevenue = stats?.monthlyRevenue || {};
  const maxRevenue = Math.max(...Object.values(monthlyRevenue as Record<string, number>), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Yönetim Paneli</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/users" className="block group">
          <Card className="hover:bg-indigo-50 transition-colors border-indigo-100 cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <UserCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-indigo-900">Kullanıcılar</h3>
                <p className="text-xs text-indigo-600/70">Onay ve yönetim</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/policies" className="block group">
          <Card className="hover:bg-blue-50 transition-colors border-blue-100 cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Poliçeler</h3>
                <p className="text-xs text-blue-600/70">Tüm poliçe listesi</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/financials" className="block group">
          <Card className="hover:bg-emerald-50 transition-colors border-emerald-100 cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <BarChart className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">Raporlar</h3>
                <p className="text-xs text-emerald-600/70">Finansal durum</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/settings" className="block group">
          <Card className="hover:bg-slate-50 transition-colors border-slate-100 cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <Settings className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Ayarlar</h3>
                <p className="text-xs text-slate-600/70">Sistem yapılandırması</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Financial & Growth Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-900">Toplam Ciro</CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="font-bold text-indigo-600">₺</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">₺{stats?.totalRevenue?.toLocaleString('tr-TR') || 0}</div>
            <p className="text-xs text-indigo-600/80">Toplam prim üretimi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Poliçe</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPolicies || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.activePolicies || 0} aktif poliçe</p>
          </CardContent>
        </Card>
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
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="md:col-span-4">
            <CardHeader>
                <CardTitle>Aylık Ciro Analizi</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2 h-64 mt-4 pb-6">
                {Object.entries(monthlyRevenue).sort().map(([month, value]) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div 
                        className="w-full bg-indigo-600 rounded-t hover:bg-indigo-500 transition-all relative min-h-[4px]"
                        style={{ height: `${(Number(value) / maxRevenue) * 100}%` }}
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                        ₺{Number(value).toLocaleString('tr-TR')}
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground -rotate-45 origin-top-left translate-y-4">{month}</span>
                    </div>
                ))}
                {Object.keys(monthlyRevenue).length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">Veri yok</div>
                )}
                </div>
            </CardContent>
        </Card>

        {/* Top Talis */}
        <Card className="md:col-span-3">
            <CardHeader>
                <CardTitle>En Başarılı Taliler</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {stats?.topTalis?.map((tali: any, i: number) => (
                        <div key={tali.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{tali.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{tali.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-indigo-600">{Number(tali.points).toLocaleString('tr-TR')} Puan</p>
                                <p className="text-xs text-muted-foreground">{tali.membershipType}</p>
                            </div>
                        </div>
                    ))}
                     {!stats?.topTalis?.length && (
                        <div className="text-center text-muted-foreground py-4">Veri yok.</div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
          <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {stats?.recentActivities?.slice(0, 6).map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600">
                          {log.user?.taliProfile?.fullName?.[0] || log.user?.email?.[0] || "?"}
                      </div>
                      <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                              {formatAction(log.action)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                              {log.user?.taliProfile?.fullName || log.user?.email} - {format(new Date(log.createdAt), "HH:mm", { locale: tr })}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-1 rounded">
                              {formatDetails(log.action, log.details)}
                          </p>
                      </div>
                  </div>
              ))}
              {!stats?.recentActivities?.length && (
                  <div className="text-center text-muted-foreground py-4">Henüz aktivite bulunmuyor.</div>
              )}
          </div>
          </CardContent>
      </Card>
    </div>
  );
}

