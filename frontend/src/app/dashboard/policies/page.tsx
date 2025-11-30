"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Filter, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { format, isWithinInterval, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Policy {
  id: string;
  policyNumber: string;
  company: string;
  startDate: string;
  endDate: string;
  premium: number;
  commissionPoints: number;
  status: string;
  policyUrl?: string;
  insuranceRequest: {
    customer: {
      fullName: string;
      tc_kn: string;
    };
  };
}

export default function MyPoliciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: policies, isLoading } = useQuery({
    queryKey: ["my-policies"],
    queryFn: async () => {
      const res = await api.get("/insurance/my/policies");
      return res.data as Policy[];
    },
  });

  const filteredPolicies = policies?.filter((policy: Policy) => {
    const matchesSearch = 
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.insuranceRequest.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.insuranceRequest.customer.tc_kn.includes(searchTerm);
    
    let matchesStatus = statusFilter === "ALL" || policy.status === statusFilter;

    if (statusFilter === "NEAR_EXPIRY") {
        const endDate = parseISO(policy.endDate);
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        
        matchesStatus = policy.status === 'ACTIVE' && isWithinInterval(endDate, {
            start: today,
            end: thirtyDaysLater
        });
    }

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Poliçelerim</h1>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Poliçe No, Müşteri Adı veya TC ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Durum Filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tümü</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="NEAR_EXPIRY">Yaklaşan Bitiş (30 Gün)</SelectItem>
                <SelectItem value="CANCELLED">İptal</SelectItem>
                <SelectItem value="EXPIRED">Süresi Dolmuş</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poliçe No</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Sigorta Şirketi</TableHead>
                <TableHead>Başlangıç / Bitiş</TableHead>
                <TableHead>Kazanılan Puan</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies?.map((policy: Policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span>{policy.insuranceRequest.customer.fullName}</span>
                        <span className="text-xs text-muted-foreground">{policy.insuranceRequest.customer.tc_kn}</span>
                    </div>
                  </TableCell>
                  <TableCell>{policy.company}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                        <span>{format(new Date(policy.startDate), "d MMM yyyy", { locale: tr })}</span>
                        <span className="text-muted-foreground">{format(new Date(policy.endDate), "d MMM yyyy", { locale: tr })}</span>
                    </div>
                  </TableCell>
                  <TableCell>{policy.commissionPoints} Puan</TableCell>
                  <TableCell>
                    <Badge variant={policy.status === 'ACTIVE' ? 'default' : 'destructive'}>
                        {policy.status === 'ACTIVE' ? 'Aktif' : policy.status === 'CANCELLED' ? 'İptal' : 'Süresi Dolmuş'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {policy.policyUrl && (
                        <Link href={policy.policyUrl || '#'} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!filteredPolicies?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Poliçe bulunamadı.
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
