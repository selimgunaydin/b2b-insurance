"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PremiumRequest {
  id: string;
  tali: {
    id: string;
    fullName: string;
    user: {
      email: string;
    };
  };
  status: "PENDING" | "APPROVED" | "REJECTED";
  paymentMethod: string;
  createdAt: string;
}

export default function AdminPremiumPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery<PremiumRequest[]>({
    queryKey: ["premium-requests"],
    queryFn: async () => {
      const res = await api.get("/premium/requests");
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/premium/requests/${id}/approve`);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Talep onaylandı ve kullanıcı Premium'a yükseltildi." });
      queryClient.invalidateQueries({ queryKey: ["premium-requests"] });
    },
    onError: () => {
      toast({ title: "Hata", description: "İşlem başarısız.", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/premium/requests/${id}/reject`);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Talep reddedildi." });
      queryClient.invalidateQueries({ queryKey: ["premium-requests"] });
    },
    onError: () => {
      toast({ title: "Hata", description: "İşlem başarısız.", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Premium Talepleri</h1>
          <p className="text-muted-foreground">
            Kullanıcıların Premium üyelik başvurularını yönetin.
          </p>
        </div>
        <div className="bg-yellow-100 p-3 rounded-full">
          <Crown className="h-6 w-6 text-yellow-600" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Talep Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tali</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ödeme Yöntemi</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Henüz talep bulunmuyor.
                  </TableCell>
                </TableRow>
              ) : (
                requests?.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.tali.fullName}</TableCell>
                    <TableCell>{req.tali.user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{req.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(req.createdAt), "d MMM yyyy HH:mm", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          req.status === "PENDING"
                            ? "bg-yellow-500"
                            : req.status === "APPROVED"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }
                      >
                        {req.status === "PENDING" ? "Bekliyor" : req.status === "APPROVED" ? "Onaylandı" : "Reddedildi"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "PENDING" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => approveMutation.mutate(req.id)}
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Onayla
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => rejectMutation.mutate(req.id)}
                            disabled={rejectMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Red
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
