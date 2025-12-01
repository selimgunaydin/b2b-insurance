"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Calendar as CalendarIcon, Download } from "lucide-react";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
import { tr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  createdAt: string;
  fullName: string;
  tc_kn: string;
  phone?: string;
  email?: string;
  tali?: {
    user?: {
      email?: string;
      taliProfile?: {
        fullName?: string;
      };
    };
  };
}

export default function AdminCustomersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const res = await api.get("/insurance/customers/all");
      return res.data as Customer[];
    },
  });

  const handleExport = async () => {
    try {
      const response = await api.get('/export/customers', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({ title: "Export başarısız.", variant: "destructive" });
    }
  };

  const filteredCustomers = customers?.filter((customer: Customer) => {
    const matchesSearch = 
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tc_kn.includes(searchTerm) ||
      (customer.tali?.user?.taliProfile?.fullName || customer.tali?.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (date.from && date.to) {
      const customerDate = parseISO(customer.createdAt);
      matchesDate = isWithinInterval(customerDate, {
        start: startOfDay(date.from),
        end: endOfDay(date.to),
      });
    }

    return matchesSearch && matchesDate;
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tüm Müşteriler</h1>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Excel İndir
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Müşteri Adı, TC, Tali Adı ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
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
                      <span>Tarih Aralığı Seç</span>
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
                  <Button variant="ghost" onClick={() => setDate({ from: undefined, to: undefined })}>
                      Temizle
                  </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>TC / VKN</TableHead>
                <TableHead>Tali (Acente)</TableHead>
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
                  <TableCell>
                    {customer.tali?.user?.taliProfile?.fullName || customer.tali?.user?.email || "-"}
                  </TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell>{customer.email || "-"}</TableCell>
                </TableRow>
              ))}
              {!filteredCustomers?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
