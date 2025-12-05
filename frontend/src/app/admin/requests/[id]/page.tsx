"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, CreditCard, Send, PlusCircle, Trash2, Loader2, XCircle, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ChatComponent } from "@/components/chat/chat-component";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Offer {
    company: string;
    price: number;
    description?: string;
    fileUrl?: string;
}

export default function AdminRequestDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [offers, setOffers] = useState<Offer[]>([
    { company: "", price: 0, description: "", fileUrl: "" }
  ]);
  const [file, setFile] = useState<File | null>(null);

  const [paymentConfirmData, setPaymentConfirmData] = useState({
    policyNumber: "",
    company: "",
  });

  const { data: request, isLoading, refetch } = useQuery({
    queryKey: ["admin-request", id],
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

  const handleAddOffer = () => {
    setOffers([...offers, { company: "", price: 0, description: "", fileUrl: "" }]);
  };

  const handleRemoveOffer = (index: number) => {
    const newOffers = [...offers];
    newOffers.splice(index, 1);
    setOffers(newOffers);
  };

  const handleOfferChange = (index: number, field: keyof Offer, value: string | number | undefined) => {
    const newOffers = [...offers];
    // @ts-expect-error - Dynamic assignment with mixed types
    newOffers[index][field] = value;
    setOffers(newOffers);
  };

  const handleSubmitOffer = async () => {
    if (offers.some(o => !o.company || !o.price)) {
        alert("Lütfen tüm teklifler için şirket ve fiyat bilgilerini giriniz.");
        return;
    }

    // Validate unique companies
    const companies = new Set();
    for (const offer of offers) {
      if (companies.has(offer.company)) {
        alert(`Aynı şirket birden fazla eklenemez: ${offer.company}`);
        return;
      }
      companies.add(offer.company);
    }

    try {
      let offerFileUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        offerFileUrl = res.data.url;
      }

      await api.put(`/insurance/${id}/offers`, { offers, offerFileUrl });
      toast({ title: "Teklifler Gönderildi", description: "Tali teklifleri inceleyip birini seçecektir." });
      setFile(null); // Reset file
      await refetch();
    } catch (err) {
      console.error("Failed to submit offers", err);
      toast({ title: "İşlem başarısız.", variant: "destructive" });
    }
  };

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const handleConfirmPaymentClick = () => {
    if (!file) {
      alert("Lütfen poliçe dosyasını yükleyiniz.");
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: "Ödemeyi Onayla",
      description: "Ödemeyi onaylıyor ve poliçeyi oluşturuyor musunuz?",
      onConfirm: handleConfirmPayment,
    });
  };



  const handleConfirmPayment = async () => {
    if (!file) return;
    
    setConfirmModal((prev) => ({ ...prev, isLoading: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      if (paymentConfirmData.policyNumber) formData.append("policyNumber", paymentConfirmData.policyNumber);
      if (paymentConfirmData.company) formData.append("company", paymentConfirmData.company);
      
      await api.post(`/insurance/${id}/confirm-payment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await refetch();
      setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    } catch(e) {
      console.error(e);
      toast({ title: "Hata", description: "İşlem başarısız.", variant: "destructive" });
      setConfirmModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const [editPolicyModal, setEditPolicyModal] = useState<{
    isOpen: boolean;
    policyNumber: string;
    company: string;
    premium: string;
    startDate: string;
    endDate: string;
    policyUrl?: string;
  }>({
    isOpen: false,
    policyNumber: "",
    company: "",
    premium: "",
    startDate: "",
    endDate: "",
  });

  const handleUpdatePolicyClick = () => {
    if (request?.policy) {
        setEditPolicyModal({
            isOpen: true,
            policyNumber: request.policy.policyNumber || "",
            company: request.policy.company || "",
            premium: request.policy.premium?.toString() || "",
            startDate: request.policy.startDate ? new Date(request.policy.startDate).toISOString().split('T')[0] : "",
            endDate: request.policy.endDate ? new Date(request.policy.endDate).toISOString().split('T')[0] : "",
        });
    } else {
        // Fallback if no policy exists yet (shouldn't happen in this view usually)
        setEditPolicyModal({
            isOpen: true,
            policyNumber: "",
            company: request?.adminOfferCompany || "",
            premium: request?.adminOfferPrice?.toString() || "",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        });
    }
  };

  const handleUpdatePolicySubmit = async () => {
    setConfirmModal((prev) => ({ ...prev, isLoading: true }));
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("policyNumber", editPolicyModal.policyNumber);
      formData.append("company", editPolicyModal.company);
      formData.append("premium", editPolicyModal.premium);
      formData.append("startDate", editPolicyModal.startDate);
      formData.append("endDate", editPolicyModal.endDate);

      await api.put(`/insurance/${id}/policy`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
      });
      toast({ title: "Başarılı", description: "Poliçe güncellendi." });
      setFile(null);
      setEditPolicyModal(prev => ({ ...prev, isOpen: false }));
      await refetch();
      setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    } catch(e) {
      console.error(e);
      toast({ title: "Hata", description: "Güncelleme başarısız.", variant: "destructive" });
      setConfirmModal((prev) => ({ ...prev, isLoading: false }));
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/requests">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Talep Detayı (Admin)</h1>
          <p className="text-muted-foreground">ID: {request.id}</p>
        </div>
        <div className="ml-auto">
           <Badge variant="outline">{request.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Müşteri Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Ad Soyad:</span>
                <span>{request.customer?.fullName}</span>
                <span className="font-medium">TC / VKN:</span>
                <span>{request.customer?.tc_kn}</span>
                <span className="font-medium">Telefon:</span>
                <span>{request.customer?.phone}</span>
                <span className="font-medium">Email:</span>
                <span>{request.customer?.email || "-"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sigorta Detayları ({request.type})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {/* Specific formatting for common sensitive fields */}
                {/* Specific formatting for common sensitive fields */}
                {typeof details.plateNumber === 'string' && (
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-muted-foreground">Plaka</span>
                        <span className="font-semibold text-lg">{String(details.plateNumber).toUpperCase()}</span>
                    </div>
                )}
                {typeof details.licenseSerial === 'string' && (
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-muted-foreground">Ruhsat Seri No</span>
                        <span className="font-semibold">{String(details.licenseSerial)}</span>
                    </div>
                )}
                {typeof details.identityNumber === 'string' && (
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-muted-foreground">TC Kimlik No</span>
                        <span className="font-semibold">{String(details.identityNumber)}</span>
                    </div>
                )}
                {typeof details.asbisNo === 'string' && (
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-muted-foreground">ASBİS No</span>
                        <span className="font-semibold">{String(details.asbisNo)}</span>
                    </div>
                )}

                {/* Render other fields dynamically, excluding already rendered ones */}
                {Object.entries(details).map(([key, value]) => {
                  if (["plateNumber", "licenseSerial", "identityNumber", "asbisNo"].includes(key)) return null;
                  // Skip empty values or technical keys if any
                  if (!value) return null;

                  const labelMapping: Record<string, string> = {
                    plateNumber: "Plaka",
                    licenseSerial: "Ruhsat Seri No",
                    identityNumber: "TC Kimlik No",
                    fullName: "Ad Soyad",
                    birthDate: "Doğum Tarihi",
                    phoneNumber: "Telefon",
                    address: "Adres",
                    buildingConstructionYear: "Bina İnşa Yılı",
                    totalFloors: "Kat Sayısı",
                    flatFloor: "Daire Katı",
                    grossSquareMeters: "Brüt m²",
                    buildingNumber: "Bina No",
                    occupantType: "Sıfat (Kiracı/Ev Sahibi)",
                    residenceType: "Kullanım Şekli",
                    buildingValue: "Bina Bedeli",
                    electronicDeviceValue: "Elektronik Cihaz Bedeli",
                    glassCoverageValue: "Cam Teminat Bedeli",
                    decorationCoverageValue: "Dekorasyon Teminat Bedeli",
                    isolationCoverageValue: "İzolasyon Teminat Bedeli",
                    theftCoverage: "Hırsızlık Teminatı",
                    isSecuritySite: "Güvenlikli Site",
                    isUnoccupied: "Boş Kalıyor Mu",
                    requestedImmAmount: "İstenen İMM",
                    substitutionVehicleDuration: "İkame Araç Süresi",
                    profession: "Meslek",
                    height: "Boy",
                    weight: "Kilo",
                    diseases: "Hastalıklar",
                    city: "İl",
                    uavtCode: "UAVT Kodu"
                  };

                  return (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium text-sm text-muted-foreground capitalize">
                        {labelMapping[key] || key.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  );
                })}
                
                <div className="flex flex-col pt-2 border-t md:col-span-2">
                  <span className="font-medium text-sm text-muted-foreground">Oluşturulma Tarihi</span>
                  <span>{format(new Date(request.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Teklif Yönetimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {request.status === "PENDING_OFFER" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Teklifler</h3>
                      <Button onClick={handleAddOffer} variant="outline" size="sm">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Teklif Ekle
                      </Button>
                  </div>
                  
                  {offers.map((offer, index) => (
                      <div key={index} className="grid gap-4 p-4 border rounded-lg relative bg-slate-50">
                          {offers.length > 1 && (
                              <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemoveOffer(index)}
                              >
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Sigorta Şirketi</Label>
                                  <Select 
                                    value={offer.company} 
                                    onValueChange={(value) => handleOfferChange(index, "company", value)}
                                  >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Şirket Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies?.map((company) => (
                                            <SelectItem key={company.id} value={company.name}>
                                                <div className="flex items-center gap-2">
                                                    {company.logoUrl && (
                                                        <img src={company.logoUrl} alt={company.name} className="h-4 w-4 object-contain" />
                                                    )}
                                                    {company.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                              </div>
                              <div className="space-y-2">
                                  <Label>Fiyat (TL)</Label>
                                  <Input 
                                      type="number" 
                                      placeholder="0.00" 
                                      value={offer.price}
                                      onChange={(e) => handleOfferChange(index, "price", parseFloat(e.target.value))}
                                  />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <Label>Açıklama (Opsiyonel)</Label>
                              <Input 
                                  placeholder="Örn: %10 indirimli" 
                                  value={offer.description}
                                  onChange={(e) => handleOfferChange(index, "description", e.target.value)}
                              />
                          </div>
                      </div>
                  ))}

                  <div className="space-y-2 p-4 border rounded-lg bg-slate-50">
                      <Label>Teklif Dosyası (PDF) - Tüm teklifler için tek dosya</Label>
                      <div className="flex items-center gap-4">
                          <Input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={async (e) => {
                                  const selectedFile = e.target.files?.[0];
                                  setFile(selectedFile || null);
                                  
                                  if (selectedFile) {
                                      try {
                                          toast({ title: "OCR İşleniyor", description: "Lütfen bekleyin..." });
                                          const formData = new FormData();
                                          formData.append("file", selectedFile);
                                          
                                          const res = await api.post("/insurance/ocr", formData, {
                                              headers: { "Content-Type": "multipart/form-data" },
                                          });
                                          
                                          const results = res.data as { company: string; price: number }[];
                                          
                                          if (results && results.length > 0) {
                                              let newOffers = [...offers];
                                              
                                              // Remove initial empty offer if it exists and we have results
                                              if (newOffers.length === 1 && !newOffers[0].company && !newOffers[0].price) {
                                                  newOffers = [];
                                              }

                                              let addedCount = 0;
                                              results.forEach(({ company, price }) => {
                                                  // Avoid duplicates
                                                  if (!newOffers.some(o => o.company === company)) {
                                                      newOffers.push({ 
                                                          company, 
                                                          price, 
                                                          description: "OCR ile tarandı",
                                                          fileUrl: "" 
                                                      });
                                                      addedCount++;
                                                  }
                                              });

                                              if (addedCount > 0) {
                                                  setOffers(newOffers);
                                                  toast({ title: "Başarılı", description: `${addedCount} adet teklif eklendi.` });
                                              } else {
                                                  toast({ title: "Bilgi", description: "Bulunan teklifler zaten listede mevcut." });
                                              }
                                          } else {
                                              toast({ title: "Bilgi Bulunamadı", description: "Görselden anlamlı veri çıkarılamadı.", variant: "destructive" });
                                          }
                                      } catch (e) {
                                          console.error(e);
                                          toast({ title: "Hata", description: "OCR işlemi başarısız.", variant: "destructive" });
                                      }
                                  }
                              }}
                          />
                          {/* Button removed as OCR is now automatic */}
                      </div>
                  </div>

                  <Button className="w-full" onClick={handleSubmitOffer}>
                    <Send className="mr-2 h-4 w-4" />
                    Teklifleri Gönder
                  </Button>
                </div>
              ) : request.status === "OFFER_READY" ? (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <div className="font-bold mb-2">Teklif Hazır</div>
                    Tali&apos;ye teklifler sunuldu. Onay bekleniyor.
                    <div className="mt-4 space-y-2 w-full">
                      {(request.offers as Offer[])?.map((offer: Offer, i: number) => (
                          <div key={i} className="p-3 bg-white rounded border border-blue-100 flex justify-between items-center">
                              <span className="font-medium">{offer.company}</span>
                              <span className="font-bold text-blue-600">{offer.price} TL</span>
                          </div>
                      ))}
                    </div>
                    {request.offerFileUrl && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                            <a href={request.offerFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-2 font-medium">
                                <FileText className="h-4 w-4" />
                                Teklif Dosyasını Görüntüle (PDF)
                            </a>
                        </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Teklif Dosyasını Güncelle</h4>
                        <div className="flex gap-2">
                             <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="bg-white"
                            />
                            <Button 
                                size="sm"
                                onClick={async () => {
                                    if (!file) return;
                                    try {
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        const res = await api.post("/upload", formData, {
                                            headers: { "Content-Type": "multipart/form-data" },
                                        });
                                        // We need a specific endpoint to update just the file or use the existing updateOffers
                                        // For now, let's assume we can re-submit offers with new file, but that's risky.
                                        // Better: Add a specific endpoint or just re-use updateOffers but we need current offers.
                                        // Let's use the existing offers from request.offers
                                        await api.put(`/insurance/${id}/offers`, { 
                                            offers: request.offers, 
                                            offerFileUrl: res.data.url 
                                        });
                                        toast({ title: "Başarılı", description: "Teklif dosyası güncellendi." });
                                        setFile(null);
                                        await refetch();
                                    } catch (e) {
                                        console.error(e);
                                        toast({ title: "Hata", description: "Güncelleme başarısız.", variant: "destructive" });
                                    }
                                }}
                            >
                                Güncelle
                            </Button>
                        </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (request.status === "PAYMENT_PENDING" || request.status === "PAYMENT_REVIEW") ? (
                 <div className="space-y-4">
                   <Alert className={request.status === "PAYMENT_REVIEW" ? "bg-orange-50 border-orange-200" : "bg-purple-50 border-purple-200"}>
                    <AlertDescription className={request.status === "PAYMENT_REVIEW" ? "text-orange-800" : "text-purple-800"}>
                      <div className="font-bold mb-2">
                          {request.status === "PAYMENT_REVIEW" ? "Ödeme İnceleniyor" : "Ödeme Bekleniyor"}
                      </div>
                      {request.status === "PAYMENT_REVIEW" 
                          ? "Tali ödeme bildirimi yaptı. Lütfen kontrol edip onaylayın." 
                          : "Tali teklifi onayladı. Ödeme alındıysa işlemi tamamlayabilirsiniz."}
                      <div className="mt-2 font-medium">
                        Fiyat: {request.adminOfferPrice} TL | Şirket: {request.adminOfferCompany}
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policyFile">Poliçe PDF (Zorunlu)</Label>
                    <Input
                      id="policyFile"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">Ödeme onaylandığında bu poliçe müşteriye gösterilecektir.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Poliçe No</Label>
                        <Input 
                            value={paymentConfirmData.policyNumber}
                            onChange={(e) => setPaymentConfirmData(prev => ({ ...prev, policyNumber: e.target.value }))}
                            placeholder="Poliçe Numarası"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Sigorta Şirketi</Label>
                        <Select
                            value={paymentConfirmData.company}
                            onValueChange={(value) => setPaymentConfirmData(prev => ({ ...prev, company: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={request.adminOfferCompany || "Şirket Seçin"} />
                            </SelectTrigger>
                            <SelectContent>
                                {(request.offers as Offer[])?.map((offer, index) => (
                                    <SelectItem key={index} value={offer.company}>
                                        {offer.company} ({offer.price} TL)
                                    </SelectItem>
                                ))}
                                {/* Fallback if adminOfferCompany is not in offers list for some reason */}
                                {request.adminOfferCompany && !(request.offers as Offer[])?.some(o => o.company === request.adminOfferCompany) && (
                                     <SelectItem value={request.adminOfferCompany}>
                                        {request.adminOfferCompany}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleConfirmPaymentClick}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Ödemeyi Onayla ve Poliçeyi Oluştur
                    </Button>
                  </div>
                 </div>
              ) : request.status === "COMPLETED" ? (
                  <div className="space-y-4">
                   <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      <div>
                        <div className="font-bold">İşlem Tamamlandı</div>
                        Poliçe oluşturuldu ve süreç tamamlandı.
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  {request?.policyUrl && (
                      <div className="mt-4 space-y-4">
                        <Button className="w-full" variant="outline" asChild>
                            <Link href={request.policyUrl} target="_blank" className="text-blue-600 hover:underline flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Poliçeyi Görüntüle
                            </Link>
                        </Button>

                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-medium mb-2">Poliçeyi Güncelle</h4>
                            <div className="flex gap-2">
                                <Input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <Button 
                                    onClick={handleUpdatePolicyClick}
                                    variant="secondary"
                                >
                                    Güncelle
                                </Button>
                            </div>
                        </div>
                      </div>
                  )}
                  </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            <ChatComponent requestId={id} currentUserRole="ADMIN" />
        </div>
      </div>
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        variant={confirmModal.variant}
        isLoading={confirmModal.isLoading}
      />

      <Dialog open={editPolicyModal.isOpen} onOpenChange={(open) => setEditPolicyModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Poliçe Düzenle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="policyNumber" className="text-right">Poliçe No</Label>
              <Input
                id="policyNumber"
                value={editPolicyModal.policyNumber}
                onChange={(e) => setEditPolicyModal(prev => ({ ...prev, policyNumber: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">Şirket</Label>
              <Input
                id="company"
                value={editPolicyModal.company}
                onChange={(e) => setEditPolicyModal(prev => ({ ...prev, company: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="premium" className="text-right">Prim</Label>
              <Input
                id="premium"
                type="number"
                value={editPolicyModal.premium}
                onChange={(e) => setEditPolicyModal(prev => ({ ...prev, premium: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">Başlangıç</Label>
              <Input
                id="startDate"
                type="date"
                value={editPolicyModal.startDate}
                onChange={(e) => setEditPolicyModal(prev => ({ ...prev, startDate: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">Bitiş</Label>
              <Input
                id="endDate"
                type="date"
                value={editPolicyModal.endDate}
                onChange={(e) => setEditPolicyModal(prev => ({ ...prev, endDate: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">Poliçe Dosyası</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPolicyModal(prev => ({ ...prev, isOpen: false }))}>İptal</Button>
            <Button onClick={handleUpdatePolicySubmit} disabled={confirmModal.isLoading}>
                {confirmModal.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
