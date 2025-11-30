"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Wallet, TrendingUp, Loader2 } from "lucide-react";

export default function AdminStatisticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-general-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/stats/general");
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
      <h1 className="text-3xl font-bold">İstatistikler</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Tali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTalis || 0}</div>
            <p className="text-xs text-muted-foreground">Aktif acente sayısı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Poliçe</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPolicies || 0}</div>
            <p className="text-xs text-muted-foreground">Kesilen poliçe adedi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ciro</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{Number(stats?.totalPremium || 0).toLocaleString('tr-TR')}</div>
            <p className="text-xs text-muted-foreground">Toplam prim üretimi</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
