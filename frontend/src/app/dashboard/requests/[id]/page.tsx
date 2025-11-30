"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CreditCard, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChatComponent } from "@/components/chat/chat-component";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Clock, MessageCircle } from "lucide-react";
import { ProgressStepper } from "@/components/ui/progress-stepper";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface Offer {
    company: string;
    price: number;
    description?: string;
    fileUrl?: string;
}

export default function TaliRequestDetailPage() {
  const params = useParams();
  // const router = useRouter(); // Unused
  const { toast } = useToast();
  const id = params.id as string;

  const [isBuying, setIsBuying] = useState(false);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<number | null>(null);

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

  const { data: request, isLoading, refetch } = useQuery({
    queryKey: ["tali-request", id],
    queryFn: async () => {
      const res = await api.get(`/insurance/${id}`);
      return res.data;
    },
  });

  const { data: companies } = useQuery({
    queryKey: ["active-companies"],
    queryFn: async () => {
      const res = await api.get("/companies");
      return res.data as { id: string; name: string; logoUrl?: string }[];
    },
  });

  const handleApproveOfferClick = () => {
    if (selectedOfferIndex === null) return;
    const selectedOffer = (request.offers as Offer[])[selectedOfferIndex];

    setConfirmModal({
      isOpen: true,
      title: "Teklifi Onayla",
      description: `${selectedOffer.company} teklifini (${selectedOffer.price} TL) onaylıyor musunuz?`,
      onConfirm: () => handleApproveOffer(selectedOffer),
    });
  };

  const handleApproveOffer = async (selectedOffer: Offer) => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    setIsBuying(true);
    try {
      await api.post(`/insurance/${id}/approve-offer`, { selectedOffer });
      toast({ title: "Teklif Onaylandı", description: "Ödeme adımına geçebilirsiniz." });
      await refetch();
    } catch (err) {
      console.error("Approval failed", err);
      toast({ title: "İşlem başarısız.", variant: "destructive" });
    } finally {
      setIsBuying(false);
    }
  };

  const handleNotifyPaymentClick = (method: "WHATSAPP" | "VIRTUAL_POS") => {
    setConfirmModal({
      isOpen: true,
      title: method === "WHATSAPP" ? "Ödeme Bildirimi" : "Ödeme Onayı",
      description: method === "WHATSAPP" ? "Ödeme yaptığınızı bildirmek istiyor musunuz?" : "Ödemeyi onaylıyor musunuz?",
      onConfirm: () => handleNotifyPayment(method),
    });
  };

  const handleNotifyPayment = async (method: "WHATSAPP" | "VIRTUAL_POS") => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    if (method === "VIRTUAL_POS") {
       // Mock payment delay
       setIsBuying(true);
       await new Promise(resolve => setTimeout(resolve, 1500));
    }

    try {
      await api.post(`/insurance/${id}/notify-payment`, { method });
      toast({ title: "Ödeme Bildirimi Gönderildi", description: "Admin onayı bekleniyor." });
      await refetch();
    } catch (err) {
      console.error("Payment notification failed", err);
      toast({ title: "İşlem başarısız.", variant: "destructive" });
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!request) return <div>Talep bulunamadı.</div>;

  const details = request.details as Record<string, unknown>;
  const isOfferReady = request.status === "OFFER_READY";
  const isPaymentPending = request.status === "PAYMENT_PENDING";
  const isPaymentReview = request.status === "PAYMENT_REVIEW";
  const isCompleted = request.status === "COMPLETED";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/requests">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Talep Detayı</h1>
          <p className="text-muted-foreground">ID: {request.id}</p>
        </div>
        <div className="ml-auto">
          <Badge
            className={
              request.status === "PENDING_OFFER"
                ? "bg-yellow-500"
                : request.status === "OFFER_READY"
                ? "bg-blue-500"
                : request.status === "PAYMENT_PENDING"
                ? "bg-purple-500"
                : request.status === "PAYMENT_REVIEW"
                ? "bg-orange-500"
                : request.status === "COMPLETED"
                ? "bg-green-500"
                : "bg-gray-500"
            }
          >
            {request.status === "PENDING_OFFER" ? "Teklif Bekliyor" : 
             request.status === "OFFER_READY" ? "Teklif Hazır" :
             request.status === "PAYMENT_PENDING" ? "Ödeme Bekleniyor" :
             request.status === "PAYMENT_REVIEW" ? "Ödeme İnceleniyor" :
             request.status === "COMPLETED" ? "Tamamlandı" : request.status}
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
            <ProgressStepper status={request.status} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Talep Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Müşteri</Label>
                  <div className="font-medium">{request.customer.fullName}</div>
                  <div className="text-sm text-muted-foreground">{request.customer.tc_kn}</div>
                </div>
                <div>
                  <Label>Sigorta Türü</Label>
                  <div className="font-medium">{request.type}</div>
                </div>
                {Object.entries(request.details as Record<string, unknown>).map(([key, value]) => (
                  <div key={key}>
                    <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                    <div className="font-medium">{String(value)}</div>
                  </div>
                ))}
                <div>
                  <Label>Oluşturulma Tarihi</Label>
                  <div className="font-medium">{format(new Date(request.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Actions */}
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Durum ve İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {request.status === "PENDING_OFFER" ? (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertDescription className="text-yellow-800 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <div>
                      <div className="font-bold">Teklif Bekleniyor</div>
                      Talebiniz alındı. En kısa sürede sigorta şirketlerinden teklifler sunulacaktır.
                    </div>
                  </AlertDescription>
                </Alert>
              ) : request.status === "OFFER_READY" ? (
                <div className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      <div className="font-bold mb-2">Teklifler Hazır!</div>
                      Aşağıdaki tekliflerden birini seçip onaylayabilirsiniz.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4">
                    {(request.offers as Offer[])?.map((offer, index) => (
                        <div 
                            key={index} 
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                selectedOfferIndex === index 
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                                    : "hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedOfferIndex(index)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {companies?.find(c => c.name === offer.company)?.logoUrl ? (
                                        <img 
                                            src={companies.find(c => c.name === offer.company)?.logoUrl} 
                                            alt={offer.company} 
                                            className="h-8 w-auto object-contain" 
                                        />
                                    ) : (
                                        <h4 className="font-bold text-lg">{offer.company}</h4>
                                    )}
                                    {companies?.find(c => c.name === offer.company)?.logoUrl && (
                                        <span className="font-bold text-lg ml-2">{offer.company}</span>
                                    )}
                                </div>
                                <Badge variant={selectedOfferIndex === index ? "default" : "outline"}>
                                    {offer.price} TL
                                </Badge>
                            </div>
                            {offer.description && (
                                <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                            )}
                            {offer.fileUrl && (
                                <a 
                                    href={offer.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <FileText className="h-4 w-4" />
                                    Teklif Dosyasını Görüntüle
                                </a>
                            )}
                        </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={selectedOfferIndex === null || isBuying} // Added isBuying to disable
                    onClick={handleApproveOfferClick}
                  >
                    {isBuying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                    Seçili Teklifi Onayla ({selectedOfferIndex !== null ? (request.offers as Offer[])[selectedOfferIndex].price : 0} TL)
                  </Button>
                </div>
              ) : request.status === "PAYMENT_PENDING" ? (
                <div className="space-y-4">
                   <Alert className="bg-purple-50 border-purple-200">
                    <AlertDescription className="text-purple-800">
                      <div className="font-bold mb-2">Ödeme Bekleniyor</div>
                      Teklifi onayladınız. Lütfen ödemeyi tamamlayın.
                      <div className="mt-2 font-medium">
                        Tutar: {request.adminOfferPrice} TL | Şirket: {request.adminOfferCompany}
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                        variant="outline" 
                        className="h-24 flex flex-col gap-2" 
                        onClick={() => handleNotifyPaymentClick("WHATSAPP")}
                    >
                        <MessageCircle className="h-8 w-8 text-green-600" />
                        <span>WhatsApp ile Bildir</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-24 flex flex-col gap-2" 
                        onClick={() => handleNotifyPaymentClick("VIRTUAL_POS")}
                        disabled={isBuying} // Re-added disabled state based on original logic
                    >
                        {isBuying ? <Loader2 className="h-8 w-8 animate-spin" /> : <CreditCard className="h-8 w-8 text-blue-600" />}
                        <span>Online Ödeme (Sanal POS)</span>
                    </Button>
                  </div>
                </div>
              ) : request.status === "PAYMENT_REVIEW" ? (
                 <Alert className="bg-orange-50 border-orange-200">
                    <AlertDescription className="text-orange-800 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <div>
                        <div className="font-bold">Ödeme İnceleniyor</div>
                        Ödeme bildiriminiz alındı. Admin onayı bekleniyor.
                      </div>
                    </AlertDescription>
                  </Alert>
              ) : request.status === "COMPLETED" ? (
                <div className="space-y-4">
                    <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <div>
                            <div className="font-bold">Poliçeniz Hazır</div>
                            İşlemler tamamlandı. Poliçenizi indirebilirsiniz.
                        </div>
                        </AlertDescription>
                    </Alert>
                    {request?.policyUrl ? (
                        <Link href={request.policyUrl} target="_blank" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Poliçeyi Görüntüle
                  </Link>                   
                    ) : (
                        <Alert className="bg-yellow-50 border-yellow-200">
                            <AlertDescription className="text-yellow-800">
                                Poliçe belgesi henüz yüklenmemiş veya hazırlanıyor. Lütfen daha sonra tekrar kontrol ediniz veya Admin ile iletişime geçiniz.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            <ChatComponent requestId={id} currentUserRole="TALI" />
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        variant={confirmModal.variant}
        isLoading={isBuying}
      />
    </div>
  );
}
