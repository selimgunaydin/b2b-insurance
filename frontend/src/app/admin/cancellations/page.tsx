"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Loader2, CheckCircle, XCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface CancellationRequest {
  id: string;
  policyId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  policy: {
    id: string;
    policyNumber: string; // This might be missing if policy entity structure is different, let's check
    // Actually policyId in CancellationRequest links to InsuranceRequest.
    // The include in service was: include: { policy: { include: { customer: true, taliProfile: ... } } }
    // Wait, in service: include: { policy: ... } where policy is the relation field name in CancellationRequest model?
    // Schema: policy InsuranceRequest @relation...
    // So 'policy' here is actually the InsuranceRequest object.
    type: string;
    customer: {
      fullName: string;
      tc_kn: string;
    };
    taliProfile: {
      fullName: string;
      user: {
        email: string;
      };
    };
    policyUrl?: string;
  };
}

export default function AdminCancellationsPage() {
  const [requests, setRequests] = useState<CancellationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const res = await api.get("/insurance/cancellations/all");
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch cancellations", error);
      toast({
        title: "Hata",
        description: "İptal talepleri yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const handleStatusUpdateClick = (id: string, status: "APPROVED" | "REJECTED") => {
    setConfirmModal({
      isOpen: true,
      title: status === "APPROVED" ? "Talebi Onayla" : "Talebi Reddet",
      description: `Bu talebi ${status === "APPROVED" ? "ONAYLAMAK" : "REDDETMEK"} istediğinize emin misiniz?`,
      onConfirm: () => handleStatusUpdate(id, status),
      variant: status === "REJECTED" ? "destructive" : "default",
    });
  };

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    try {
      await api.put(`/insurance/cancellation/${id}/status`, { status });
      toast({
        title: "Başarılı",
        description: `Talep ${status === "APPROVED" ? "onaylandı" : "reddedildi"}.`,
      });
      fetchRequests();
    } catch (error) {
      console.error("Failed to update status", error);
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">İptal Talepleri</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bekleyen ve Geçmiş Talepler</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Tali / Müşteri</TableHead>
                <TableHead>Poliçe Türü</TableHead>
                <TableHead>Sebep</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Henüz iptal talebi bulunmuyor.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      {format(new Date(req.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{req.policy.taliProfile?.fullName}</div>
                      <div className="text-sm text-muted-foreground">{req.policy.customer?.fullName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{req.policy.type}</Badge>
                      {req.policy.policyUrl && (
                        <a 
                          href={req.policy.policyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 inline-block"
                          title="Poliçeyi Görüntüle"
                        >
                          <FileText className="h-4 w-4 text-blue-600" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === "APPROVED"
                            ? "default" // Green-ish usually
                            : req.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                        }
                        className={req.status === "APPROVED" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {req.status === "APPROVED" ? "Onaylandı" : req.status === "REJECTED" ? "Reddedildi" : "Bekliyor"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/admin/cancellations/${req.id}`}>Detay</a>
                        </Button>
                        {req.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusUpdateClick(req.id, "APPROVED")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdateClick(req.id, "REJECTED")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        variant={confirmModal.variant}
      />
    </div>
  );
}
