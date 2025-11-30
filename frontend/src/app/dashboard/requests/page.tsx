"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressStepper } from "@/components/ui/progress-stepper";
import { Loader2, Search, User } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface InsuranceRequest {
  id: string;
  type: string;
  customer: {
    fullName: string;
    tc_kn: string;
  };
  status: string;
  createdAt: string;
  policy?: {
    company: string;
    premium: number;
  };
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<InsuranceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<InsuranceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/insurance");
        setRequests(res.data);
        setFilteredRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    let result = requests;

    if (search) {
      result = result.filter(r => 
        r.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.customer.tc_kn.includes(search)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(r => r.status === statusFilter);
    }

    if (typeFilter !== "ALL") {
      result = result.filter(r => r.type === typeFilter);
    }

    setFilteredRequests(result);
  }, [search, statusFilter, typeFilter, requests]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Taleplerim</h1>
        <Link href="/dashboard/requests/new">
          <Button>Yeni Talep Oluştur</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Müşteri adı veya TC/VKN ara..." 
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sigorta Türü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tüm Türler</SelectItem>
              <SelectItem value="TRAFIK">Trafik</SelectItem>
              <SelectItem value="KASKO">Kasko</SelectItem>
              <SelectItem value="DASK">DASK</SelectItem>
              <SelectItem value="SAGLIK">Sağlık</SelectItem>
              <SelectItem value="KONUT">Konut</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tüm Durumlar</SelectItem>
              <SelectItem value="PENDING_OFFER">Teklif Bekleniyor</SelectItem>
              <SelectItem value="OFFER_READY">Teklif Hazır</SelectItem>
              <SelectItem value="PAYMENT_PENDING">Ödeme Bekleniyor</SelectItem>
              <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
              <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Kayıt bulunamadı.
          </div>
        ) : (
          filteredRequests.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Info Section */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-semibold">
                          {req.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(req.createdAt), "d MMMM yyyy", { locale: tr })}
                        </span>
                      </div>
                      <Badge className={
                        req.status === "COMPLETED" ? "bg-green-600" :
                        req.status === "OFFER_READY" ? "bg-blue-600" :
                        req.status === "CANCELLED" ? "bg-red-600" : "bg-yellow-600"
                      }>
                        {req.status === "PENDING_OFFER" ? "Teklif Bekleniyor" :
                         req.status === "OFFER_READY" ? "Teklif Hazır" :
                         req.status === "PAYMENT_PENDING" ? "Ödeme Bekleniyor" :
                         req.status === "PAYMENT_REVIEW" ? "Ödeme İnceleniyor" :
                         req.status === "COMPLETED" ? "Tamamlandı" : 
                         req.status === "CANCELLED" ? "İptal" : req.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{req.customer.fullName}</span>
                      <span className="text-sm text-muted-foreground">({req.customer.tc_kn})</span>
                    </div>

                    {req.policy && (
                      <div className="text-sm text-green-700 font-medium">
                        {req.policy.company} - {req.policy.premium} TL
                      </div>
                    )}
                  </div>

                  {/* Progress & Action Section */}
                  <div className="flex-1 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                    <ProgressStepper status={req.status} />
                    <div className="flex justify-end">
                      <Link href={`/dashboard/requests/${req.id}`}>
                        <Button variant="secondary" size="sm">Detayları Gör</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
