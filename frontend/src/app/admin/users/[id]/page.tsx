"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Wallet, TrendingUp, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminUserEditModal } from "@/components/admin/admin-user-edit-modal";
import { AdminPointsModal } from "@/components/admin/admin-points-modal";
import { useToast } from "@/hooks/use-toast";

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { toast } = useToast();
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["admin-tali-stats", id],
    queryFn: async () => {
      const res = await api.get(`/admin/stats/tali/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const handleMakePremium = async () => {
    if (!confirm("Bu kullanıcıyı Premium yapmak istediğinize emin misiniz?")) return;
    try {
      await api.put(`/admin/users/${tali.user.id}/premium`);
      toast({ title: "Başarılı", description: "Kullanıcı Premium yapıldı." });
      await refetch();
    } catch {
      toast({ title: "Hata", description: "İşlem başarısız.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return <div>Kullanıcı bulunamadı.</div>;

  const { tali, totalPolicies, activePolicies, totalPremium, policiesByType, policiesByMonth } = stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {tali.fullName || tali.user?.email}
                {tali.membershipType === 'PREMIUM' && <Badge className="bg-amber-500">Premium</Badge>}
              </h1>
              <p className="text-muted-foreground">Tali Detayları ve İstatistikleri</p>
          </div>
        </div>
        <div className="flex gap-2">
          {tali.membershipType !== 'PREMIUM' && (
            <Button onClick={handleMakePremium} className="bg-amber-600 hover:bg-amber-700 text-white">
              Premium Yap
            </Button>
          )}
          <AdminUserEditModal userId={tali.user.id} initialData={{
            fullName: tali.fullName,
            tcKimlikNo: tali.tcKimlikNo,
            phone: tali.phone,
            address: tali.address,
            birthDate: tali.birthDate,
          }} />
          <AdminPointsModal userId={tali.user.id} currentPoints={Number(tali.points)} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Poliçe</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPolicies}</div>
            <p className="text-xs text-muted-foreground">{activePolicies} aktif poliçe</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ciro</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{Number(totalPremium).toLocaleString('tr-TR')}</div>
            <p className="text-xs text-muted-foreground">Toplam prim üretimi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puan Durumu</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(tali.points).toLocaleString('tr-TR')} Puan</div>
            <p className="text-xs text-muted-foreground">Mevcut puan bakiyesi</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dönüşüm</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {totalPolicies > 0 ? Math.round((activePolicies / totalPolicies) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Aktiflik oranı</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Güven Puanı</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{Math.min(tali.trustScore || 100, 100)}</div>
                <p className="text-xs text-muted-foreground">Hesap güvenilirliği</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Policy Types Distribution */}
        <Card>
            <CardHeader>
                <CardTitle>Poliçe Dağılımı</CardTitle>
                <CardDescription>Türlerine göre poliçe sayıları</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Object.entries((policiesByType || {}) as Record<string, number>).map(([type, count]) => (
                        <div key={type} className="flex items-center">
                            <div className="w-32 font-medium text-sm">{type}</div>
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${(count / totalPolicies) * 100}%` }}
                                />
                            </div>
                            <div className="w-12 text-right text-sm text-muted-foreground">{count}</div>
                        </div>
                    ))}
                    {Object.keys(policiesByType || {}).length === 0 && (
                        <div className="text-center text-muted-foreground py-4">Veri yok</div>
                    )}
                </div>
            </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card>
            <CardHeader>
                <CardTitle>Aylık Performans</CardTitle>
                <CardDescription>Son 12 ay poliçe üretimi</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ay</TableHead>
                            <TableHead className="text-right">Poliçe Adedi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries((policiesByMonth || {}) as Record<string, number>).sort().reverse().slice(0, 6).map(([month, count]) => (
                            <TableRow key={month}>
                                <TableCell>{month}</TableCell>
                                <TableCell className="text-right font-medium">{count}</TableCell>
                            </TableRow>
                        ))}
                         {Object.keys(policiesByMonth || {}).length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground py-4">Veri yok</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
