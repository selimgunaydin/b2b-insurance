"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const cancellationSchema = z.object({
  policyId: z.string().min(1, "Lütfen iptal edilecek poliçeyi seçiniz"),
  reason: z.string().min(10, "Lütfen iptal sebebini detaylı açıklayınız (en az 10 karakter)"),
});

type CancellationFormValues = z.infer<typeof cancellationSchema>;

interface Policy {
  id: string;
  policyNumber: string;
  insuranceRequest: {
    type: string;
    customer: {
      fullName: string;
    };
  };
}

export default function CancellationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<CancellationFormValues>({
    resolver: zodResolver(cancellationSchema),
    defaultValues: {
      policyId: "",
      reason: "",
    },
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await api.get("/insurance/my/policies");
        setPolicies(res.data);
      } catch (err) {
        console.error("Failed to fetch policies", err);
      }
    };
    fetchPolicies();
  }, []);

  async function onSubmit(data: CancellationFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/insurance/cancellation", data);
      setSuccess(true);
      form.reset();
    } catch (err) {
      console.error("Cancellation request failed", err);
      const error = err as any;
      setError(error.response?.data?.message || "İptal talebi oluşturulurken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Card>
          <CardContent className="pt-6">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800 text-lg text-center">
                İptal talebiniz başarıyla alınmıştır. En kısa sürede incelenip tarafınıza dönüş yapılacaktır.
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => router.push("/dashboard")}>Dashboard&apos;a Dön</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Poliçe İptal Talebi</h1>
        <p className="text-muted-foreground">Mevcut poliçeleriniz için iptal talebi oluşturun.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>İptal Formu</CardTitle>
          <CardDescription>Lütfen iptal etmek istediğiniz poliçeyi ve sebebini belirtiniz.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="policyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poliçe Seçimi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="İptal edilecek poliçeyi seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {policies.map((policy) => (
                          <SelectItem key={policy.id} value={policy.id}>
                            {policy.insuranceRequest.type} - {policy.insuranceRequest.customer.fullName} ({policy.policyNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İptal Sebebi</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Lütfen iptal sebebini detaylı bir şekilde açıklayınız..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Talep Oluştur
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
