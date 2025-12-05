"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileX, Clock, CheckCircle, XCircle, Plus, Phone, FileText, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface CancellationRequest {
  id: string;
  policyId: string;
  reason: string;
  contactPhone: string | null;
  proofFiles: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminResponse: string | null;
  createdAt: string;
  updatedAt: string;
  policy: {
    id: string;
    type: string;
    customer: {
      fullName: string;
      tc_kn: string;
    } | null;
    policy: {
      policyNumber: string;
      company: string;
    } | null;
  };
}

const statusConfig = {
  PENDING: {
    label: "Beklemede",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  APPROVED: {
    label: "Onaylandı",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Reddedildi",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

const insuranceTypeLabels: Record<string, string> = {
  TRAFIK: "Trafik Sigortası",
  KASKO: "Kasko",
  SAGLIK: "Sağlık Sigortası",
  DASK: "DASK",
  KONUT: "Konut Sigortası",
};

export default function MyCancellationsPage() {
  const [cancellations, setCancellations] = useState<CancellationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCancellations = async () => {
      try {
        const res = await api.get("/cancellation/my");
        setCancellations(res.data);
      } catch (err) {
        console.error("Failed to fetch cancellations", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCancellations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">İptal Taleplerim</h1>
          <p className="text-muted-foreground">Gönderdiğiniz poliçe iptal taleplerinin durumunu takip edin.</p>
        </div>
        <Link href="/dashboard/requests/cancellation">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni İptal Talebi
          </Button>
        </Link>
      </div>

      {cancellations.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center space-y-4">
              <FileX className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Henüz iptal talebi yok</h3>
                <p className="text-muted-foreground">Bir poliçe iptal talebi oluşturmak için butona tıklayın.</p>
              </div>
              <Link href="/dashboard/requests/cancellation">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  İptal Talebi Oluştur
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cancellations.map((cancellation) => {
            const StatusIcon = statusConfig[cancellation.status].icon;
            return (
              <Card key={cancellation.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {cancellation.policy?.customer?.fullName || "Müşteri Bilgisi Yok"}
                      </CardTitle>
                      <CardDescription>
                        {insuranceTypeLabels[cancellation.policy?.type] || cancellation.policy?.type}
                        {cancellation.policy?.policy?.policyNumber && (
                          <span className="ml-2">• Poliçe No: {cancellation.policy.policy.policyNumber}</span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={statusConfig[cancellation.status].color}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {statusConfig[cancellation.status].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Talep Tarihi: {format(new Date(cancellation.createdAt), "dd MMMM yyyy HH:mm", { locale: tr })}</span>
                    </div>
                    {cancellation.contactPhone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>İletişim: {cancellation.contactPhone}</span>
                      </div>
                    )}
                    {cancellation.policy?.policy?.company && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Şirket: {cancellation.policy.policy.company}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium mb-1">İptal Sebebi:</p>
                    <p className="text-sm text-muted-foreground">{cancellation.reason}</p>
                  </div>

                  {/* Admin Response Section */}
                  {cancellation.adminResponse && (
                    <div className={`rounded-lg p-3 border ${
                      cancellation.status === "APPROVED" 
                        ? "bg-green-50 border-green-200" 
                        : cancellation.status === "REJECTED"
                        ? "bg-red-50 border-red-200"
                        : "bg-blue-50 border-blue-200"
                    }`}>
                      <p className="text-sm font-medium mb-1 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Admin Yanıtı:
                      </p>
                      <p className="text-sm">{cancellation.adminResponse}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {cancellation.proofFiles && cancellation.proofFiles.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{cancellation.proofFiles.length} dosya yüklendi</span>
                      </div>
                    )}
                    
                    {/* Chat Button - Only show if there's an admin response or status is not PENDING */}
                    {(cancellation.adminResponse || cancellation.status !== "PENDING") && (
                      <Link href={`/dashboard/requests/${cancellation.policyId}`}>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Sohbet Başlat
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

