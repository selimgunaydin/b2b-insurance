"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, TrendingUp, Users, FileText, Wallet, 
  Calendar, Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  overview: {
    totalTalis: number;
    totalPolicies: number;
    totalRevenue: number;
    totalGrossProfit: number;
    totalCommissionsPaid: number;
    totalNetProfit: number;
    lostRevenue: number;
    cancelledPolicies: number;
  };
  revenueByType: Record<string, { 
    count: number; 
    revenue: number; 
    grossProfit: number; 
    commissionsPaid: number; 
    netProfit: number; 
  }>;
  cancellationStats: {
    totalPolicies: number;
    cancelledPolicies: number;
    cancellationRequests: number;
    approvedCancellations: number;
    rejectedCancellations: number;
    cancellationRate: number;
  };
  profitsByType: Record<string, number>;
  profitRates: Record<string, number>;
  commissionRates: Record<string, number>;
  liabilities: {
    totalPointsDistributed: number;
    totalLiabilities: number;
  };
  monthlyPoints: Record<string, number>;
}

interface LiabilityUser {
  userId: string;
  fullName: string;
  email: string;
  points: number;
  membershipType: string;
}

const INSURANCE_TYPE_LABELS: Record<string, string> = {
  TRAFIK: "Trafik",
  KASKO: "Kasko",
  SAGLIK: "Sağlık",
  DASK: "DASK",
  KONUT: "Konut",
};

const INSURANCE_TYPE_COLORS: Record<string, string> = {
  TRAFIK: "bg-blue-500",
  KASKO: "bg-green-500",
  SAGLIK: "bg-red-500",
  DASK: "bg-orange-500",
  KONUT: "bg-purple-500",
};

export default function AdminAnalyticsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [profitRates, setProfitRates] = useState<Record<string, number>>({});
  const [profitRatesInitialized, setProfitRatesInitialized] = useState(false);

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return params.toString();
  };

  const { data: analytics, isLoading, refetch } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics", startDate, endDate],
    queryFn: async () => {
      const queryStr = buildQueryParams();
      const res = await api.get(`/admin/analytics${queryStr ? `?${queryStr}` : ""}`);
      return res.data;
    },
  });

  const { data: liabilities, isLoading: liabilitiesLoading } = useQuery<LiabilityUser[]>({
    queryKey: ["admin-liabilities"],
    queryFn: async () => {
      const res = await api.get("/admin/financials/liabilities");
      return res.data;
    },
    enabled: activeTab === "liabilities",
  });

  const profitMutation = useMutation({
    mutationFn: async (rates: Record<string, number>) => {
      const res = await api.put("/admin/profit-settings", { rates });
      return res.data;
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Kar oranları güncellendi." });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
    onError: () => {
      toast({ title: "Hata", description: "Güncelleme başarısız.", variant: "destructive" });
    },
  });

  // Initialize profit rates when analytics loads - FIX: use useEffect instead of render-time setState
  useEffect(() => {
    if (analytics?.profitRates && !profitRatesInitialized) {
      setProfitRates(analytics.profitRates);
      setProfitRatesInitialized(true);
    }
  }, [analytics, profitRatesInitialized]);

  const handleDateFilter = () => {
    refetch();
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => refetch(), 0);
  };

  const handleSaveProfitRates = () => {
    profitMutation.mutate(profitRates);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("tr-TR").format(value);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analitik & Finansal</h1>
          <p className="text-muted-foreground">İstatistikler, gelir analizi ve finansal raporlar</p>
        </div>
      </div>

      {/* Date Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Başlangıç Tarihi</Label>
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Bitiş Tarihi</Label>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button onClick={handleDateFilter} size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Filtrele
            </Button>
            {(startDate || endDate) && (
              <Button onClick={handleClearFilter} variant="outline" size="sm">
                Temizle
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="revenue">Gelir Analizi</TabsTrigger>
          <TabsTrigger value="profits">Kar Oranları</TabsTrigger>
          <TabsTrigger value="liabilities">Yükümlülükler</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Tali</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.overview.totalTalis || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Poliçe</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.overview.totalPolicies || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Ciro</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics?.overview.totalRevenue || 0)}</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Kar</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(analytics?.overview.totalNetProfit || 0)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Cancellation Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Poliçe & İptal Oranları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Toplam Poliçe</p>
                  <p className="text-xl font-bold">{analytics?.cancellationStats.totalPolicies || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">İptal Edilen</p>
                  <p className="text-xl font-bold text-red-600">{analytics?.cancellationStats.cancelledPolicies || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">İptal Talebi</p>
                  <p className="text-xl font-bold">{analytics?.cancellationStats.cancellationRequests || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Onaylanan</p>
                  <p className="text-xl font-bold text-green-600">{analytics?.cancellationStats.approvedCancellations || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">İptal Oranı</p>
                  <p className="text-xl font-bold text-orange-600">%{(analytics?.cancellationStats.cancellationRate || 0).toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sigorta Türüne Göre Gelir</CardTitle>
              <CardDescription>Her sigorta türü için poliçe sayısı ve toplam prim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.revenueByType && Object.entries(analytics.revenueByType).map(([type, data]) => {
                  const maxRevenue = Math.max(...Object.values(analytics.revenueByType).map(d => d.revenue));
                  const percentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${INSURANCE_TYPE_COLORS[type]}`} />
                          <span className="font-medium">{INSURANCE_TYPE_LABELS[type]}</span>
                          <Badge variant="outline" className="ml-2">{data.count} poliçe</Badge>
                        </div>
                        <span className="font-bold">{formatCurrency(data.revenue)}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${INSURANCE_TYPE_COLORS[type]} rounded-full transition-all`} 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Profits by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Sigorta Türüne Göre Kar Analizi</CardTitle>
              <CardDescription>Brüt kar, ödenen komisyonlar ve net kar detayları</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sigorta Türü</TableHead>
                    <TableHead className="text-right">Ciro</TableHead>
                    <TableHead className="text-right">Kar Oranı</TableHead>
                    <TableHead className="text-right">Komisyon Oranı</TableHead>
                    <TableHead className="text-right">Brüt Kar</TableHead>
                    <TableHead className="text-right">Ödenen Komisyon</TableHead>
                    <TableHead className="text-right">Net Kar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.revenueByType && Object.entries(analytics.revenueByType).map(([type, data]) => (
                    <TableRow key={type}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${INSURANCE_TYPE_COLORS[type]}`} />
                          {INSURANCE_TYPE_LABELS[type]}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(data.revenue)}</TableCell>
                      <TableCell className="text-right">%{analytics?.profitRates?.[type] || 0}</TableCell>
                      <TableCell className="text-right text-purple-600">%{analytics?.commissionRates?.[type] || 0}</TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(data.grossProfit || 0)}
                      </TableCell>
                      <TableCell className="text-right text-orange-600">
                        {formatCurrency(data.commissionsPaid || 0)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        {formatCurrency(data.netProfit || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Toplam satırı */}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>TOPLAM</TableCell>
                    <TableCell className="text-right">{formatCurrency(analytics?.overview?.totalRevenue || 0)}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right text-blue-600">
                      {formatCurrency(analytics?.overview?.totalGrossProfit || 0)}
                    </TableCell>
                    <TableCell className="text-right text-orange-600">
                      {formatCurrency(analytics?.overview?.totalCommissionsPaid || 0)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(analytics?.overview?.totalNetProfit || 0)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profits Tab */}
        <TabsContent value="profits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kar Oranı Ayarları</CardTitle>
              <CardDescription>Her sigorta türü için admin kar oranını belirleyin (%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.keys(INSURANCE_TYPE_LABELS).map((type) => (
                  <div key={type} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${INSURANCE_TYPE_COLORS[type]}`} />
                      {INSURANCE_TYPE_LABELS[type]} Kar Oranı (%)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={profitRates[type] || ""}
                      onChange={(e) => setProfitRates({ ...profitRates, [type]: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveProfitRates} disabled={profitMutation.isPending}>
                {profitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Kar Oranlarını Kaydet
              </Button>
            </CardContent>
          </Card>

          {/* Live Profit Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Kar Önizleme</CardTitle>
              <CardDescription>Mevcut veriler üzerinden hesaplanan kar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {Object.keys(INSURANCE_TYPE_LABELS).map((type) => {
                  const revenue = analytics?.revenueByType[type]?.revenue || 0;
                  const rate = profitRates[type] || 0;
                  const profit = (revenue * rate) / 100;
                  
                  return (
                    <div key={type} className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground">{INSURANCE_TYPE_LABELS[type]}</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(profit)}</p>
                      <p className="text-xs text-muted-foreground">%{rate} × {formatCurrency(revenue)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Toplam Tahmini Kar</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    Object.keys(INSURANCE_TYPE_LABELS).reduce((total, type) => {
                      const revenue = analytics?.revenueByType[type]?.revenue || 0;
                      const rate = profitRates[type] || 0;
                      return total + (revenue * rate) / 100;
                    }, 0)
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Liabilities Tab */}
        <TabsContent value="liabilities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dağıtılan Puan</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(Number(analytics?.liabilities.totalPointsDistributed || 0))}</div>
                <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Güncel Yükümlülük</CardTitle>
                <Wallet className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatNumber(Number(analytics?.liabilities.totalLiabilities || 0))}</div>
                <p className="text-xs text-muted-foreground">Kullanıcı bakiyeleri toplamı</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>En Yüksek Bakiyeli Kullanıcılar</CardTitle>
              <CardDescription>Borçlu olduğunuz kullanıcılar</CardDescription>
            </CardHeader>
            <CardContent>
              {liabilitiesLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
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
                    {liabilities?.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.membershipType === "PREMIUM" ? "default" : "secondary"}>
                            {user.membershipType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-red-600">
                          {formatNumber(user.points)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!liabilities || liabilities.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Borçlu kullanıcı bulunamadı.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
