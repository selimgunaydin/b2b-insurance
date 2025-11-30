"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

interface Customer {
  id: string;
  createdAt: string;
  fullName: string;
  tc_kn: string;
  phone?: string;
  email?: string;
}

export default function MyCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["my-customers"],
    queryFn: async () => {
      const res = await api.get("/insurance/my/customers");
      return res.data as Customer[];
    },
  });

  const filteredCustomers = customers?.filter((customer: Customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.tc_kn.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Müşterilerim</h1>
        <Link href="/dashboard/requests/new">
            <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Yeni Teklif / Müşteri
            </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="İsim, TC/VKN veya Email ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead>Ad Soyad / Ünvan</TableHead>
                <TableHead>TC / VKN</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers?.map((customer: Customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    {format(new Date(customer.createdAt), "d MMMM yyyy", { locale: tr })}
                  </TableCell>
                  <TableCell className="font-medium">{customer.fullName}</TableCell>
                  <TableCell>{customer.tc_kn}</TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell>{customer.email || "-"}</TableCell>
                </TableRow>
              ))}
              {!filteredCustomers?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Müşteri bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
