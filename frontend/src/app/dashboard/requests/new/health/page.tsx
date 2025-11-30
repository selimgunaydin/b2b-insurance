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
import { Loader2, Upload, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";

const healthSchema = z.object({
  customer: z.object({
    tcKn: z.string().min(10, "TC/VKN en az 10 karakter olmalıdır"),
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    email: z.string().email("Geçersiz email").optional().or(z.literal("")),
    birthDate: z.string().optional(),
  }),
  height: z.string().min(1, "Boy bilgisi gereklidir"),
  weight: z.string().min(1, "Kilo bilgisi gereklidir"),
  diseases: z.string().optional(),
  city: z.string().min(1, "İl bilgisi gereklidir"),
  hasAcceptedInfo: z.boolean().refine((val) => val === true, {
    message: "Bilgilendirme metnini onaylamanız gerekmektedir.",
  }),
  files: z.array(z.string()).optional(),
});

type HealthFormValues = z.infer<typeof healthSchema>;

export default function HealthRequestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<HealthFormValues>({
    resolver: zodResolver(healthSchema),
    defaultValues: {
      customer: {
        tcKn: "",
        fullName: "",
        phone: "",
        email: "",
        birthDate: "",
      },
      height: "",
      weight: "",
      diseases: "",
      city: "",
      hasAcceptedInfo: false,
      files: [],
    },
  });

  async function onSubmit(data: HealthFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/insurance", {
        type: "SAGLIK",
        customerId: null,
        customerData: data.customer,
        details: {
          height: data.height,
          weight: data.weight,
          diseases: data.diseases,
          city: data.city,
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tamamlayıcı Sağlık Sigortası</h1>
        <p className="text-muted-foreground">Yeni sağlık sigortası teklifi oluşturun.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Başvuru Formu</CardTitle>
          <CardDescription>Müşteri ve sağlık bilgilerini giriniz.</CardDescription>
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
                <h3 className="text-lg font-medium border-b pb-2">Müşteri Bilgileri</h3>
                <CustomerForm form={form} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Sağlık Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boy (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="175" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kilo (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yaşadığı İl</FormLabel>
                        <FormControl>
                          <Input placeholder="İstanbul" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="diseases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bilinen Hastalıklar / Açıklama</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Varsa kronik rahatsızlıklar, kullanılan ilaçlar..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Belgeler</h3>
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Belgeler (Rapor, Tahlil vb.)</FormLabel>
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

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Bilgilendirme Metni</p>
                    <p>
                      Poliçe kapsamı, geçmiş hastalıkların beyanı ve gelecekte oluşabilecek hastalıkların teminat dışı kalabileceği durumlar hakkında bilgilendirildim.
                      Beyan ettiğim bilgilerin doğruluğunu kabul ediyorum.
                    </p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="hasAcceptedInfo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Bilgilendirme metnini okudum ve onaylıyorum.
                        </FormLabel>
                        <FormMessage />
                      </div>
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
