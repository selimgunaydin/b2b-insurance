"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Transaction {
  id: string;
  points: string;
  type: "DEPOSIT" | "PAYMENT" | "COMMISSION" | "REFUND" | "MARKET_PURCHASE";
  status: "SUCCESS" | "PENDING";
  createdAt: string;
}

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["my-transactions"],
    queryFn: async () => {
      const res = await api.get("/transactions/my-transactions");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "DEPOSIT": return "Para Yükleme";
      case "PAYMENT": return "Ödeme";
      case "COMMISSION": return "Puan Kazancı";
      case "REFUND": return "İade";
      case "MARKET_PURCHASE": return "Market Alışverişi";
      default: return type;
    }
  };

  const getTransactionIcon = (type: string) => {
    if (["DEPOSIT", "COMMISSION", "REFUND"].includes(type)) {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    }
    return <ArrowUpRight className="h-4 w-4 text-red-500" />;
  };

  const getAmountColor = (type: string) => {
    if (["DEPOSIT", "COMMISSION", "REFUND"].includes(type)) {
      return "text-green-600";
    }
    return "text-red-600";
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Puan Geçmişi</h1>
        <p className="text-muted-foreground">Tüm puan hareketlerinizi buradan takip edebilirsiniz.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Son Hareketler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İşlem Türü</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">Tutar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {getTransactionIcon(tx.type)}
                      {getTransactionLabel(tx.type)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(tx.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      {tx.status === "SUCCESS" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Başarılı
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Bekliyor
                        </span>
                      )}
                    </TableCell>
                    <TableCell className={`text-right font-bold ${getAmountColor(tx.type)}`}>
                      {["DEPOSIT", "COMMISSION", "REFUND"].includes(tx.type) ? "+" : "-"}
                      {Number(tx.points).toFixed(2)} Puan
                    </TableCell>
                  </TableRow>
                ))}
                {(!transactions || transactions.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Henüz işlem kaydı bulunmuyor.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
