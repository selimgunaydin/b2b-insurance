"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Download, Calendar, Building2, CreditCard, User, FileText, Edit, XCircle } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: policy, isLoading } = useQuery({
    queryKey: ["admin-policy", params.id],
    queryFn: async () => {
      const res = await api.get(`/insurance/policy/${params.id}`);
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Note: We use the existing updatePolicy endpoint which expects Request ID, but here we have Policy ID.
      // Wait, the existing endpoint is PUT /insurance/:id/policy where :id is Request ID.
      // We need to use policy.insuranceRequestId.
      return api.put(`/insurance/${policy.insuranceRequestId}/policy`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Poliçe güncellendi." });
      queryClient.invalidateQueries({ queryKey: ["admin-policy", params.id] });
      setIsEditOpen(false);
    },
    onError: () => {
      toast({ title: "Hata", description: "Güncelleme başarısız.", variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      return api.put(`/insurance/policy/${params.id}/cancel`);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Poliçe iptal edildi." });
      queryClient.invalidateQueries({ queryKey: ["admin-policy", params.id] });
    },
    onError: () => {
      toast({ title: "Hata", description: "İptal başarısız.", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!policy) return <div>Poliçe bulunamadı.</div>;

  const customer = policy.insuranceRequest.customer;
  const tali = policy.insuranceRequest.tali;
  const offers = policy.insuranceRequest.offers || [];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Poliçe Detayı
            <Badge variant={policy.status === 'ACTIVE' ? 'default' : 'destructive'}>
              {policy.status === 'ACTIVE' ? 'Aktif' : policy.status === 'CANCELLED' ? 'İptal' : 'Süresi Dolmuş'}
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            {policy.policyNumber}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          {policy.status === 'ACTIVE' && (
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm("Bu poliçeyi iptal etmek istediğinize emin misiniz?")) {
                  cancelMutation.mutate();
                }
              }}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <XCircle className="mr-2 h-4 w-4" />
              İptal Et
            </Button>
          )}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Düzenle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Poliçe Düzenle</DialogTitle>
              </DialogHeader>
              <EditPolicyForm 
                policy={policy} 
                offers={offers}
                onSubmit={(formData) => updateMutation.mutate(formData)} 
                isLoading={updateMutation.isPending} 
              />
            </DialogContent>
          </Dialog>
          
          {policy.policyUrl && (
            <Link href={policy.policyUrl} target="_blank">
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Poliçeyi İndir
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Policy Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Poliçe Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Sigorta Şirketi
                </span>
                <p className="font-medium">{policy.company}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> Prim Tutarı
                </span>
                <p className="font-medium text-lg">₺{policy.premium}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Başlangıç Tarihi
                </span>
                <p className="font-medium">
                  {format(new Date(policy.startDate), "d MMMM yyyy", { locale: tr })}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Bitiş Tarihi
                </span>
                <p className="font-medium">
                  {format(new Date(policy.endDate), "d MMMM yyyy", { locale: tr })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer & Tali Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Müşteri Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{customer.fullName}</p>
                  <p className="text-sm text-muted-foreground">{customer.tc_kn}</p>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Tel:</span> {customer.phone}</p>
                <p><span className="text-muted-foreground">Email:</span> {customer.email || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tali (Acente) Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium">{tali?.user?.taliProfile?.fullName || "Bilinmiyor"}</p>
                  <p className="text-sm text-muted-foreground">{tali?.user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EditPolicyForm({ policy, offers, onSubmit, isLoading }: { policy: any, offers: any[], onSubmit: (data: FormData) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    policyNumber: policy.policyNumber,
    company: policy.company,
    premium: policy.premium,
    startDate: format(new Date(policy.startDate), "yyyy-MM-dd"),
    endDate: format(new Date(policy.endDate), "yyyy-MM-dd"),
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("policyNumber", formData.policyNumber);
    data.append("company", formData.company);
    data.append("premium", formData.premium.toString());
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    if (file) {
      data.append("file", file);
    }
    onSubmit(data);
  };

  // Extract unique companies from offers for dropdown
  const companies = Array.from(new Set(offers.map((o: any) => o.company)));
  // Add current company if not in list
  if (!companies.includes(formData.company)) {
      companies.push(formData.company);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Poliçe No</Label>
        <Input 
          value={formData.policyNumber} 
          onChange={e => setFormData({...formData, policyNumber: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Sigorta Şirketi</Label>
        <Select 
            value={formData.company} 
            onValueChange={(value) => setFormData({...formData, company: value})}
        >
            <SelectTrigger>
                <SelectValue placeholder="Şirket Seçin" />
            </SelectTrigger>
            <SelectContent>
                {companies.map((company: any) => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Prim Tutarı (TL)</Label>
        <Input 
          type="number"
          value={formData.premium} 
          onChange={e => setFormData({...formData, premium: Number(e.target.value)})}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Başlangıç</Label>
          <Input 
            type="date"
            value={formData.startDate} 
            onChange={e => setFormData({...formData, startDate: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Bitiş</Label>
          <Input 
            type="date"
            value={formData.endDate} 
            onChange={e => setFormData({...formData, endDate: e.target.value})}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Poliçe Dosyası (Opsiyonel - Değiştirmek için yükleyin)</Label>
        <Input 
          type="file" 
          accept=".pdf"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Güncelle
        </Button>
      </div>
    </form>
  );
}
