"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Wallet, Percent } from "lucide-react";

interface CommissionRate {
  id: string;
  insuranceType: string;
  rate: number;
}

export default function TaliEarningsPage() {
  const { data: rates, isLoading: ratesLoading } = useQuery<CommissionRate[]>({
    queryKey: ["my-rates"],
    queryFn: async () => {
      const res = await api.get("/commission/my-rates");
      return res.data;
    },
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["my-stats"],
    queryFn: async () => {
      const res = await api.get("/insurance/stats");
      return res.data;
    },
  });

  if (ratesLoading || statsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kazançlarım & Puanlarım</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kazanılan Puan</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Number(stats?.totalEarnings).toFixed(2)} Puan
            </div>
            <p className="text-xs text-muted-foreground">
              Bu ayki toplam kazanılan puan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Poliçeler</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activePolicies || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Puan kazandıran poliçeler
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Oran</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              %{rates && rates.length > 0 
                ? (rates.reduce((acc, curr) => acc + curr.rate, 0) / rates.length).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Tüm sigorta tipleri ortalaması
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Puan Kazanım Oranlarım</CardTitle>
          <CardDescription>
            Üyelik tipinize ({stats?.membershipType || 'STANDARD'}) özel tanımlanmış puan oranları.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sigorta Tipi</TableHead>
                <TableHead>Oran (%)</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates?.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.insuranceType}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-lg">
                      %{rate.rate}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Aktif</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
