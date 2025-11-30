"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCommissionsPage() {
  const { toast } = useToast();
  const [editingRates, setEditingRates] = useState<{ [key: string]: number }>({});

  const { data: rates, isLoading, refetch } = useQuery({
    queryKey: ["admin-commissions"],
    queryFn: async () => {
      const res = await api.get("/commission/all");
      return res.data;
    },
  });

  const handleRateChange = (id: string, value: string) => {
    setEditingRates((prev) => ({
      ...prev,
      [id]: parseFloat(value),
    }));
  };

  const handleSave = async (id: string) => {
    const newRate = editingRates[id];
    if (newRate === undefined) return;

    try {
      await api.put(`/commission/${id}`, { rate: newRate });
      toast({ title: "Komisyon oranı güncellendi." });
      setEditingRates((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      refetch();
    } catch (error) {
      toast({ title: "Güncelleme başarısız.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Komisyon Ayarları</h1>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Komisyon Oranları</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Üyelik Tipi</TableHead>
                <TableHead>Sigorta Tipi</TableHead>
                <TableHead>Mevcut Oran (%)</TableHead>
                <TableHead>Yeni Oran</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates?.map((rate: any) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    <Badge variant="outline" className={
                        rate.membershipType === 'PLATINUM' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        rate.membershipType === 'GOLD' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-slate-100 text-slate-800 border-slate-200'
                    }>
                        {rate.membershipType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{rate.insuranceType}</TableCell>
                  <TableCell>{rate.rate}%</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="w-24"
                      placeholder={rate.rate.toString()}
                      value={editingRates[rate.id] ?? ""}
                      onChange={(e) => handleRateChange(rate.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {editingRates[rate.id] !== undefined && (
                      <Button size="sm" onClick={() => handleSave(rate.id)}>
                        <Save className="h-4 w-4 mr-1" />
                        Kaydet
                      </Button>
                    )}
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
