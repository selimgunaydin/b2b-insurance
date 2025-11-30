"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Calendar as CalendarIcon, Download, Filter, FileText } from "lucide-react";
import Link from "next/link";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Policy {
  id: string;
  policyNumber: string;
  company: string;
  startDate: string;
  endDate: string;
  premium: number;
  policyUrl?: string;
  status: string;
  createdAt: string;
  insuranceRequest: {
    customer: {
      fullName: string;
      tc_kn: string;
    };
    tali?: {
      user?: {
        email?: string;
        taliProfile?: {
          fullName?: string;
        };
      };
    };
  };
}

export default function AdminPoliciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const { data: policies, isLoading } = useQuery({
    queryKey: ["admin-policies"],
    queryFn: async () => {
      const res = await api.get("/insurance/policies/all");
      return res.data as Policy[];
    },
  });

  const filteredPolicies = policies?.filter((policy: Policy) => {
    const matchesSearch = 
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.insuranceRequest.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.insuranceRequest.customer.tc_kn.includes(searchTerm) ||
      (policy.insuranceRequest.tali?.user?.taliProfile?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase());
    
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

    let matchesDate = true;
    if (date.from && date.to) {
      const policyDate = parseISO(policy.createdAt); // Or startDate? Usually creation date for filtering lists
      matchesDate = isWithinInterval(policyDate, {
        start: startOfDay(date.from),
        end: endOfDay(date.to),
      });
    }

    return matchesSearch && matchesStatus && matchesDate;
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
      <h1 className="text-3xl font-bold">Tüm Poliçeler</h1>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Poliçe No, Müşteri, Tali ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tümü</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="NEAR_EXPIRY">Yaklaşan Bitiş (30 Gün)</SelectItem>
                <SelectItem value="CANCELLED">İptal</SelectItem>
                <SelectItem value="EXPIRED">Süresi Dolmuş</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "d LLL y", { locale: tr })} -{" "}
                          {format(date.to, "d LLL y", { locale: tr })}
                        </>
                      ) : (
                        format(date.from, "d LLL y", { locale: tr })
                      )
                    ) : (
                      <span>Tarih Aralığı</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate as any}
                    numberOfMonths={2}
                    locale={tr}
                  />
                </PopoverContent>
              </Popover>
              {(date.from || date.to) && (
                  <Button variant="ghost" size="icon" onClick={() => setDate({ from: undefined, to: undefined })}>
                      <span className="sr-only">Temizle</span>
                      x
                  </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poliçe No</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Tali (Acente)</TableHead>
                <TableHead>Şirket</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Prim</TableHead>
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
                  <TableCell>
                    {policy.insuranceRequest.tali?.user?.taliProfile?.fullName || policy.insuranceRequest.tali?.user?.email || "-"}
                  </TableCell>
                  <TableCell>{policy.company}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                        <span>{format(new Date(policy.startDate), "d MMM yyyy", { locale: tr })}</span>
                    </div>
                  </TableCell>
                  <TableCell>₺{policy.premium}</TableCell>
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
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
