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
import { FileUpload } from "@/components/ui/file-upload";

const kaskoSchema = z.object({
  customer: z.object({
    tcKn: z.string().min(10, "TC/VKN en az 10 karakter olmalıdır"),
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    email: z.string().email("Geçersiz email").optional().or(z.literal("")),
  }),
  plateNumber: z.string().min(1, "Plaka zorunludur"),
  licenseSerial: z.string().min(1, "Ruhsat Seri No zorunludur"),
  profession: z.string().optional(),
  files: z.array(z.string()).optional(),
});

type KaskoFormValues = z.infer<typeof kaskoSchema>;

export default function KaskoRequestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<KaskoFormValues>({
    resolver: zodResolver(kaskoSchema),
    defaultValues: {
      customer: {
        tcKn: "",
        fullName: "",
        phone: "",
        email: "",
      },
      plateNumber: "",
      licenseSerial: "",
      profession: "",
      files: [],
    },
  });

  async function onSubmit(data: KaskoFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/insurance", {
        type: "KASKO",
        customerId: null,
        customerData: data.customer,
        details: {
          plateNumber: data.plateNumber,
          licenseSerial: data.licenseSerial,
          profession: data.profession,
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
        <h1 className="text-3xl font-bold">Kasko Sigortası</h1>
        <p className="text-muted-foreground">Yeni kasko teklifi oluşturun.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Başvuru Formu</CardTitle>
          <CardDescription>Müşteri ve araç bilgilerini giriniz.</CardDescription>
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
                <h3 className="text-lg font-medium">Araç Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="plateNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plaka</FormLabel>
                        <FormControl>
                          <Input placeholder="34 ABC 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseSerial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ruhsat Seri No</FormLabel>
                        <FormControl>
                          <Input placeholder="AB 123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meslek (Opsiyonel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Örn: Doktor, Öğretmen" {...field} />
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel>Belgeler (Ruhsat, Eski Poliçe vb.)</FormLabel>
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
