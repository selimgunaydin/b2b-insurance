"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, Wallet, PieChart, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FinancialStats {
  totalPointsDistributed: number;
  totalLiabilities: number;
  pointsByType: { type: string; points: number }[];
  monthlyPoints: Record<string, number>;
  monthlyBreakdown: Record<string, Record<string, number>>;
}

export default function AdminFinancialsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-financials"],
    queryFn: async () => {
      const res = await api.get("/admin/financials");
      return res.data as FinancialStats;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return <div>Veri bulunamadı.</div>;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  const sortedMonths = Object.keys(stats.monthlyPoints).sort().reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finansal Genel Bakış</h1>
        <p className="text-muted-foreground">Puan dağılımı, yükümlülükler ve aylık istatistikler.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Dağıtılan Puan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalPointsDistributed)}</div>
            <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Güncel Yükümlülükler</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalLiabilities)}</div>
            <p className="text-xs text-muted-foreground">Kullanıcı bakiyelerindeki toplam puan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aylık Puan Dağılımı</CardTitle>
            <CardDescription>Son 6 ayda dağıtılan puanlar.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {sortedMonths.map(month => {
                    const total = stats.monthlyPoints[month];
                    const max = Math.max(...Object.values(stats.monthlyPoints));
                    const percentage = (total / max) * 100;
                    
                    return (
                        <div key={month} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{format(new Date(month), "MMMM yyyy", { locale: tr })}</span>
                                <span className="font-bold">{formatCurrency(total)} Puan</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                                {Object.entries(stats.monthlyBreakdown[month] || {}).map(([type, points]) => (
                                    <span key={type}>{type === 'COMMISSION' ? 'Komisyon' : type === 'GOAL_REWARD' ? 'Hedef Ödülü' : type}: {formatCurrency(points)}</span>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Dağılım Türüne Göre</CardTitle>
            <CardDescription>Toplam puanların kaynaklara göre dağılımı.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {stats.pointsByType.map((item) => (
                    <div key={item.type} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                {item.type === 'COMMISSION' ? <BarChart3 className="h-4 w-4 text-primary" /> : 
                                 item.type === 'GOAL_REWARD' ? <PieChart className="h-4 w-4 text-primary" /> : 
                                 <Wallet className="h-4 w-4 text-primary" />}
                            </div>
                            <div>
                                <p className="font-medium">
                                    {item.type === 'COMMISSION' ? 'Komisyon Kazancı' : 
                                     item.type === 'GOAL_REWARD' ? 'Hedef Ödülü' : 
                                     item.type === 'DEPOSIT' ? 'Manuel Yükleme' : item.type}
                                </p>
                            </div>
                        </div>
                        <div className="font-bold">
                            {formatCurrency(item.points)}
                        </div>
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Borçlu Kullanıcılar (En Yüksek Bakiye)</CardTitle>
          <CardDescription>Sistemin borçlu olduğu kullanıcılar ve puan bakiyeleri.</CardDescription>
        </CardHeader>
        <CardContent>
          <LiabilitiesTable />
        </CardContent>
      </Card>
    </div>
  );
}

function LiabilitiesTable() {
  const { data: liabilities, isLoading } = useQuery({
    queryKey: ["admin-liabilities"],
    queryFn: async () => {
      const res = await api.get("/admin/financials/liabilities");
      return res.data as { userId: string; fullName: string; email: string; points: number; membershipType: string }[];
    },
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;
  if (!liabilities || liabilities.length === 0) return <div>Borçlu kullanıcı bulunamadı.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kullanıcı</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Üyelik</TableHead>
          <TableHead className="text-right">Bakiye (Puan)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {liabilities.map((user) => (
          <TableRow key={user.userId}>
            <TableCell className="font-medium">{user.fullName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.membershipType}</TableCell>
            <TableCell className="text-right font-bold text-red-600">
              {new Intl.NumberFormat('tr-TR').format(user.points)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
