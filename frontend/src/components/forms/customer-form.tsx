"use client";

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CustomerFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function CustomerForm({ form }: CustomerFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="customer.tcKn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TC / Vergi No</FormLabel>
            <FormControl>
              <Input placeholder="11 haneli TC veya 10 haneli VKN" maxLength={11} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="customer.fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Müşteri Ad Soyad / Ünvan</FormLabel>
            <FormControl>
              <Input placeholder="Ad Soyad" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="customer.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefon</FormLabel>
            <FormControl>
              <Input placeholder="0555 555 55 55" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="customer.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email (İsteğe Bağlı)</FormLabel>
            <FormControl>
              <Input type="email" placeholder="musteri@email.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="customer.birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Doğum Tarihi</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="md:col-span-2 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
          Sistem kendi sigorta ihtiyaçlarınızı karşılamak için tasarlanmıştır. Üçüncü kişilerin bilgilerini girmeden önce onlardan izin almanız gerekir.
        </div>
        
        <FormField
          control={form.control}
          name="hasThirdPartyConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    checked={field.value}
                    onChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Müşterinin bilgilerini girmek için gerekli izni aldığımı beyan ederim.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
