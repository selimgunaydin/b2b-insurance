"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowLeft, CheckCircle, XCircle, FileText, AlertTriangle, Download, Loader2, Calendar, User, Shield, MessageSquare } from "lucide-react";
import Link from "next/link";
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
    policyNumber: string;
    type: string;
    company: string;
    premium: number;
    startDate: string;
    endDate: string;
    customer: {
      fullName: string;
      tc_kn: string;
      phone: string;
      email: string;
    };
    tali: {
      fullName: string;
      phone: string;
      user: {
        email: string;
      };
    };
    policyUrl?: string;
  };
}

export default function CancellationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [request, setRequest] = useState<CancellationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequest = async () => {
    try {
      const res = await api.get(`/insurance/cancellation/${params.id}`);
      setRequest(res.data);
    } catch (error) {
      console.error("Failed to fetch cancellation request", error);
      toast({
        title: "Hata",
        description: "Talep detayları yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchRequest();
    }
  }, [params.id]);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
    status?: "APPROVED" | "REJECTED";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const [adminResponse, setAdminResponse] = useState("");

  const handleStatusUpdateClick = (status: "APPROVED" | "REJECTED") => {
    setAdminResponse(""); // Reset response
    setConfirmModal({
      isOpen: true,
      title: status === "APPROVED" ? "Talebi Onayla" : "Talebi Reddet",
      description: `Bu talebi ${status === "APPROVED" ? "ONAYLAMAK" : "REDDETMEK"} istediğinize emin misiniz?`,
      onConfirm: () => handleStatusUpdate(status),
      variant: status === "REJECTED" ? "destructive" : "default",
      status,
    });
  };

  const handleStatusUpdate = async (status: "APPROVED" | "REJECTED") => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    try {
      await api.put(`/insurance/cancellation/${params.id}/status`, { 
        status,
        adminResponse: adminResponse || undefined,
      });
      toast({
        title: "Başarılı",
        description: `Talep ${status === "APPROVED" ? "onaylandı" : "reddedildi"}.`,
      });
      setAdminResponse("");
      fetchRequest();
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

  if (!request) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Talep bulunamadı.</h2>
        <Button variant="link" onClick={() => router.back()}>Geri Dön</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Listeye Dön
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">İptal Talebi Detayı</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Talep Tarihi: {format(new Date(request.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge
            variant={
              request.status === "APPROVED"
                ? "default"
                : request.status === "REJECTED"
                ? "destructive"
                : "secondary"
            }
            className={`text-lg px-4 py-1 ${request.status === "APPROVED" ? "bg-green-600" : ""}`}
          >
            {request.status === "APPROVED" ? "Onaylandı" : request.status === "REJECTED" ? "Reddedildi" : "Bekliyor"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Request Details & Actions */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İptal Nedeni</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed bg-slate-50 p-4 rounded-md border">
                {request.reason}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Poliçe Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Poliçe No</label>
                  <div className="font-semibold">
                    {request.policy.policyNumber === 'PENDING' ? (
                      <span className="text-yellow-600 italic">Onay Bekliyor</span>
                    ) : (
                      request.policy.policyNumber
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sigorta Şirketi</label>
                  <div className="font-semibold">{request.policy.company}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Poliçe Türü</label>
                  <div className="font-semibold">{request.policy.type}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prim Tutarı</label>
                  <div className="font-semibold">{request.policy.premium} TL</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Başlangıç Tarihi</label>
                  <div className="font-semibold">
                    {request.policy.startDate 
                      ? format(new Date(request.policy.startDate), "d MMMM yyyy", { locale: tr }) 
                      : "-"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bitiş Tarihi</label>
                  <div className="font-semibold">
                    {request.policy.endDate 
                      ? format(new Date(request.policy.endDate), "d MMMM yyyy", { locale: tr }) 
                      : "-"}
                  </div>
                </div>
              </div>

              {request.policy.policyUrl && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Poliçe Dosyası</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={request.policy.policyUrl} target="_blank" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Görüntüle
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer & Tali Info */}
        <div className="space-y-6">
           {request.status === "PENDING" && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-blue-900">İşlemler</CardTitle>
                <CardDescription>Bu talep için karar verin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminResponse" className="text-blue-900">
                    Açıklama (Opsiyonel)
                  </Label>
                  <Textarea
                    id="adminResponse"
                    placeholder="Tali'ye iletilecek açıklama yazın..."
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={3}
                    className="bg-white"
                  />
                  <p className="text-xs text-muted-foreground">
                    Bu açıklama Tali kullanıcısına bildirim olarak gönderilecektir.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusUpdateClick("APPROVED")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Onayla ve İptal Et
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleStatusUpdateClick("REJECTED")}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reddet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Müşteri Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Ad Soyad</label>
                <div className="font-medium">{request.policy.customer.fullName}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">TC / VKN</label>
                <div className="font-medium">{request.policy.customer.tc_kn}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Telefon</label>
                <div className="font-medium">{request.policy.customer.phone}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">E-posta</label>
                <div className="font-medium">{request.policy.customer.email || "-"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Acente (Tali) Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Ad Soyad</label>
                <div className="font-medium">{request.policy.tali.fullName}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Telefon</label>
                <div className="font-medium">{request.policy.tali.phone}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">E-posta</label>
                <div className="font-medium">{request.policy.tali.user.email}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
