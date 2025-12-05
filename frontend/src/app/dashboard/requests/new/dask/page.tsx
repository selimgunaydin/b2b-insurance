"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CustomerForm } from "@/components/forms/customer-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";

const daskSchema = z.object({
  customer: z.object({
    tcKn: z.string().min(10, "TC/VKN en az 10 karakter olmalıdır"),
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    email: z.string().email("Geçersiz email").optional().or(z.literal("")),
    birthDate: z.string().optional(),
  }),
  address: z.string().min(10, "Açık adres gereklidir"),
  uavtCode: z.string().min(10, "UAVT Kodu gereklidir"),
  buildingYear: z.string().min(4, "Bina yapım yılı gereklidir"),
  squareMeters: z.string().min(1, "Metrekare bilgisi gereklidir"),
  totalFloors: z.string().min(1, "Kat sayısı gereklidir"),
  flatFloor: z.string().min(1, "Daire katı gereklidir"),
  buildingNo: z.string().min(1, "Bina No gereklidir"),
  ownerOrTenant: z.enum(["OWNER", "TENANT"]),
  residenceType: z.enum(["RESIDENCE", "COMMERCIAL"]),
  files: z.array(z.string()).optional(),
});

type DaskFormValues = z.infer<typeof daskSchema>;

import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DaskRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DaskFormValues>({
    resolver: zodResolver(daskSchema),
    defaultValues: {
      customer: {
        tcKn: "",
        fullName: "",
        phone: "",
        email: "",
        birthDate: "",
      },
      address: "",
      uavtCode: "",
      buildingYear: "",
      squareMeters: "",
      totalFloors: "",
      flatFloor: "",
      buildingNo: "",
      ownerOrTenant: "OWNER",
      residenceType: "RESIDENCE",
      files: [],
    },
  });

  async function onSubmit(data: DaskFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/insurance", {
        type: "DASK",
        customerId: null,
        customerData: data.customer,
        details: {
          address: data.address,
          uavtCode: data.uavtCode,
          buildingConstructionYear: data.buildingYear,
          grossSquareMeters: data.squareMeters,
          totalFloors: data.totalFloors,
          flatFloor: data.flatFloor,
          buildingNumber: data.buildingNo,
          occupantType: data.ownerOrTenant,
          residenceType: data.residenceType,
          identityNumber: data.customer.tcKn,
          birthDate: data.customer.birthDate,
          phoneNumber: data.customer.phone,
        },
        files: data.files || [],
      });

      router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Request failed", error);
      toast({
        title: "Hata",
        description: error.message || "Talep oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">DASK (Zorunlu Deprem Sigortası)</h1>
        <p className="text-muted-foreground">Yeni DASK teklifi oluşturun.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Başvuru Formu</CardTitle>
          <CardDescription>Müşteri ve bina bilgilerini giriniz.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Customer Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Müşteri Bilgileri</h3>
                <CustomerForm form={form} />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="text-lg font-medium">Bina Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="uavtCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UAVT Kodu</FormLabel>
                          <FormControl>
                            <Input placeholder="10 haneli kod" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buildingYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bina Yapım Yılı</FormLabel>
                          <FormControl>
                            <Input placeholder="2010" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="totalFloors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bina Kat Sayısı</FormLabel>
                          <FormControl>
                            <Input placeholder="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="flatFloor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daire Katı</FormLabel>
                          <FormControl>
                            <Input placeholder="3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="squareMeters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daire m² (Brüt)</FormLabel>
                          <FormControl>
                            <Input placeholder="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ownerOrTenant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sıfat</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="OWNER">Mal Sahibi</SelectItem>
                              <SelectItem value="TENANT">Kiracı</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="residenceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kullanım Şekli</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="RESIDENCE">Mesken</SelectItem>
                              <SelectItem value="COMMERCIAL">Ticarethane</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="buildingNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bina No</FormLabel>
                        <FormControl>
                          <Input placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-3">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Açık Adres</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mahalle, Cadde, Sokak..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="text-lg font-medium">Belgeler</h3>
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Belgeler (Tapu, Eski Poliçe vb.)</FormLabel>
                      <FormControl>
                        <FileUpload 
                            value={field.value} 
                            onChange={field.onChange} 
                            maxFiles={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Teklif İste
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
