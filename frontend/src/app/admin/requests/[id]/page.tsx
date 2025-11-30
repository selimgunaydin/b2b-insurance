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

    try {
      await api.post(`/insurance/${id}/offer`, { offers });
      toast({ title: "Teklifler Gönderildi", description: "Tali teklifleri inceleyip birini seçecektir." });
      await refetch();
    } catch (err) {
      console.error("Failed to submit offers", err);
      toast({ title: "İşlem başarısız.", variant: "destructive" });
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
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className="contents">
                    <span className="font-medium capitalize">{key.replace(/_/g, " ")}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
                <div className="contents">
                  <span className="font-medium">Oluşturulma Tarihi:</span>
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
                              <Label>Teklif Dosyası (PDF)</Label>
                              <div className="flex items-center gap-4">
                                  {offer.fileUrl && (
                                      <a href={offer.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                          Dosyayı Görüntüle
                                      </a>
                                  )}
                                  <Input
                                      type="file"
                                      accept=".pdf"
                                      onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                              const formData = new FormData();
                                              formData.append("file", file);
                                              try {
                                                  const res = await api.post("/upload", formData, {
                                                      headers: { "Content-Type": "multipart/form-data" },
                                                  });
                                                  handleOfferChange(index, "fileUrl", res.data.url);
                                                  toast({ title: "Başarılı", description: "Dosya yüklendi." });
                                              } catch (err) {
                                                  toast({ title: "Hata", description: "Dosya yüklenirken hata oluştu.", variant: "destructive" });
                                              }
                                          }
                                      }}
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
                    <div className="mt-4 space-y-2">
                      {(request.offers as Offer[])?.map((offer: Offer, i: number) => (
                          <div key={i} className="p-3 bg-white rounded border border-blue-100 flex justify-between items-center">
                              <span className="font-medium">{offer.company}</span>
                              <span className="font-bold text-blue-600">{offer.price} TL</span>
                          </div>
                      ))}
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
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">Ödeme onaylandığında bu poliçe müşteriye gösterilecektir.</p>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={async () => {
                        if(!file) {
                          alert("Lütfen poliçe dosyasını yükleyiniz.");
                          return;
                        }
                        if(!confirm("Ödemeyi onaylıyor ve poliçeyi oluşturuyor musunuz?")) return;
                        
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          
                          await api.post(`/insurance/${id}/confirm-payment`, formData, {
                            headers: {
                              "Content-Type": "multipart/form-data",
                            },
                          });
                          await refetch();
                        } catch(e) {
                          console.error(e);
                          alert("Hata oluştu");
                        }
                      }}
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
                  
                  {request.policyPdfUrl && (
                      <div className="mt-4 space-y-4">
                        <Button className="w-full" variant="outline" asChild>
                            <a href={request.policyPdfUrl} target="_blank" rel="noopener noreferrer">
                                <FileText className="mr-2 h-4 w-4" />
                                Poliçeyi Görüntüle / İndir
                            </a>
                        </Button>

                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-medium mb-2">Poliçeyi Güncelle</h4>
                            <div className="flex gap-2">
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <Button 
                                    onClick={async () => {
                                        if(!file) {
                                            alert("Lütfen bir dosya seçiniz.");
                                            return;
                                        }
                                        if(!confirm("Mevcut poliçeyi güncellemek istediğinize emin misiniz?")) return;
                                        
                                        try {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            // Using the existing upload-policy endpoint which maps to uploadPolicy service method
                                            await api.post(`/insurance/${id}/policy-upload`, formData, {
                                                headers: { "Content-Type": "multipart/form-data" },
                                            });
                                            alert("Poliçe güncellendi.");
                                            setFile(null); // Reset file input
                                            await refetch();
                                        } catch(e) {
                                            console.error(e);
                                            alert("Güncelleme başarısız.");
                                        }
                                    }}
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
    </div>
  );
}
