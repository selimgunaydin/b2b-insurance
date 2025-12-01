"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Download } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function AdminRequestsPage() {
  const { toast } = useToast();
  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const res = await api.get("/insurance");
      return res.data;
    },
  });

  const handleExport = async () => {
    try {
      const response = await api.get('/export/offers', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'offers.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({ title: "Export başarısız.", variant: "destructive" });
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
        <h1 className="text-3xl font-bold">Gelen Talepler</h1>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Excel İndir
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Sigorta Talepleri</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Tali</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((req: any) => (
                <TableRow key={req.id}>
                  <TableCell>
                    {format(new Date(req.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{req.tali?.fullName || req.tali?.user?.email}</span>
                      <span className="text-xs text-muted-foreground">Tali</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{req.customer?.fullName}</span>
                      <span className="text-xs text-muted-foreground">{req.customer?.tc_kn}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{req.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        req.status === "PENDING_OFFER"
                          ? "bg-yellow-500"
                          : req.status === "OFFER_READY"
                          ? "bg-blue-500"
                          : req.status === "COMPLETED"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }
                    >
                      {req.status === "PENDING_OFFER" ? "Teklif Bekliyor" : req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/requests/${req.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-2" />
                        İncele
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!requests?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Henüz talep bulunmuyor.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
