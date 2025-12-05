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
import { Loader2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";

const housingSchema = z.object({
  customer: z.object({
    tcKn: z.string().min(10, "TC/VKN en az 10 karakter olmalıdır"),
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    email: z.string().email("Geçersiz email").optional().or(z.literal("")),
    birthDate: z.string().optional(),
  }),
  address: z.string().min(10, "Açık adres gereklidir"),
  buildingNo: z.string().min(1, "Bina No gereklidir"),
  constructionYear: z.string().min(4, "İnşa yılı gereklidir"),
  totalFloors: z.string().min(1, "Kat sayısı gereklidir"),
  flatFloor: z.string().min(1, "Daire katı gereklidir"),
  grossM2: z.string().min(1, "m2 gereklidir"),
  ownerOrTenant: z.enum(["OWNER", "TENANT"]),
  residenceType: z.enum(["RESIDENCE", "COMMERCIAL"]),
  buildingValue: z.string().min(1, "Bina bedeli gereklidir"),
  electronicBelongingsValue: z.string().optional(),
  glassCoverageValue: z.string().optional(),
  decorationCoverageValue: z.string().optional(),
  isolationCoverageValue: z.string().optional(),
  
  // Coverages / Questions
  theftCoverage: z.boolean().optional(),
  
  // Questions
  isSecuritySite: z.boolean().optional(),
  isUnoccupied: z.boolean().optional(),
  files: z.array(z.string()).optional(),
});

type HousingFormValues = z.infer<typeof housingSchema>;

export default function HousingRequestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<HousingFormValues>({
    resolver: zodResolver(housingSchema),
    defaultValues: {
      customer: {
        tcKn: "",
        fullName: "",
        phone: "",
        email: "",
        birthDate: "",
      },
      address: "",
      buildingNo: "",
      constructionYear: "",
      totalFloors: "",
      flatFloor: "",
      grossM2: "",
      ownerOrTenant: "OWNER",
      residenceType: "RESIDENCE",
      buildingValue: "",
      electronicBelongingsValue: "",
      glassCoverageValue: "",
      decorationCoverageValue: "",
      isolationCoverageValue: "",
      theftCoverage: false,
      isSecuritySite: false,
      isUnoccupied: false,
      files: [],
    },
  });

  async function onSubmit(data: HousingFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/insurance", {
        type: "KONUT",
        customerId: null,
        customerData: data.customer,
        details: {
          buildingConstructionYear: data.constructionYear,
          totalFloors: data.totalFloors,
          flatFloor: data.flatFloor,
          grossSquareMeters: data.grossM2,
          buildingNumber: data.buildingNo,
          address: data.address,
          occupantType: data.ownerOrTenant,
          residenceType: data.residenceType,
          buildingValue: data.buildingValue,
          electronicDeviceValue: data.electronicBelongingsValue,
          glassCoverageValue: data.glassCoverageValue,
          decorationCoverageValue: data.decorationCoverageValue,
          isolationCoverageValue: data.isolationCoverageValue,
          theftCoverage: data.theftCoverage ? "YES" : "NO",
          isSecuritySite: data.isSecuritySite ? "YES" : "NO",
          isUnoccupied: data.isUnoccupied ? "YES" : "NO",
          identityNumber: data.customer.tcKn,
          birthDate: data.customer.birthDate,
          phoneNumber: data.customer.phone,
        },
        files: data.files || [],
      });

      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Request failed", err);
      setError(err.response?.data?.message || "Teklif oluşturulurken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Konut Sigortası</h1>
        <p className="text-muted-foreground">Detaylı konut sigortası teklifi oluşturun.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Başvuru Formu</CardTitle>
          <CardDescription>Müşteri ve konut detaylarını eksiksiz giriniz.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Customer Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Müşteri Bilgileri</h3>
                <CustomerForm form={form} />
              </div>

              {/* Building Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Bina Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="constructionYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İnşa Yılı</FormLabel>
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
                    name="grossM2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brüt m²</FormLabel>
                        <FormControl>
                          <Input placeholder="120" {...field} />
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
              </div>

              {/* Address Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Adres Bilgileri</h3>
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

              {/* Values & Coverages */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Bedel ve Teminatlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="buildingValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bina Bedeli (TL)</FormLabel>
                        <FormControl>
                          <Input placeholder="2.000.000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="electronicBelongingsValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Elektronik Eşya Bedeli (TL) (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Input placeholder="50.000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="glassCoverageValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cam Teminat Bedeli (TL) (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Input placeholder="10.000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="decorationCoverageValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dekorasyon Teminat Bedeli (TL) (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Input placeholder="100.000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="isolationCoverageValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İzolasyon Teminat Bedeli (TL) (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Input placeholder="20.000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <FormField
                    control={form.control}
                    name="theftCoverage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Hırsızlık Teminatı İstiyorum</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Questions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Ek Sorular</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isSecuritySite"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>7/24 Güvenlikli Site mi?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isUnoccupied"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Kesintisiz 3 aydan fazla boş kalıyor mu?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
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
