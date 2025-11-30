"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Ban, UserCog, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/user");
      return res.data;
    },
  });

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/user/${id}/approve`);
      toast({ title: "Kullanıcı onaylandı." });
      refetch();
    } catch (error) {
      toast({ title: "İşlem başarısız.", variant: "destructive" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.put(`/user/${id}/reject`);
      toast({ title: "Kullanıcı reddedildi/yasaklandı.", variant: "destructive" });
      refetch();
    } catch (error) {
      toast({ title: "İşlem başarısız.", variant: "destructive" });
    }
  };

  const openPermissions = (user: any) => {
    setSelectedUser(user);
    setSelectedTypes(user.taliProfile?.allowedInsuranceTypes || []);
    setPermissionsOpen(true);
  };

  const savePermissions = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/user/${selectedUser.id}/permissions`, { allowedTypes: selectedTypes });
      toast({ title: "Yetkiler güncellendi." });
      setPermissionsOpen(false);
      refetch();
    } catch (error) {
      toast({ title: "Güncelleme başarısız.", variant: "destructive" });
    }
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const insuranceTypes = ["TRAFIK", "KASKO", "SAGLIK", "DASK", "KONUT"];

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
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Kullanıcılar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {format(new Date(user.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                  </TableCell>
                  <TableCell>
                    {user.taliProfile?.fullName || "-"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.isApproved
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }
                    >
                      {user.isApproved ? "Onaylı" : "Onay Bekliyor"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role !== "ADMIN" && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/admin/users/${user.id}`)}>
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Detay
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openPermissions(user)}>
                            Yetkiler
                        </Button>
                        {!user.isApproved && (
                          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(user.id)}>
                            <Check className="h-4 w-4 mr-1" />
                            Onayla
                          </Button>
                        )}
                        {user.isApproved && (
                          <Button size="sm" variant="destructive" onClick={() => handleReject(user.id)}>
                            <Ban className="h-4 w-4 mr-1" />
                            Yasakla
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={permissionsOpen} onOpenChange={setPermissionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sigorta Yetkileri: {selectedUser?.taliProfile?.fullName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm text-muted-foreground mb-2">
                Seçili olmayan sigorta türleri bu kullanıcı tarafından oluşturulamaz.
            </div>
            {insuranceTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                        id={type} 
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => toggleType(type)}
                    />
                    <Label htmlFor={type}>{type}</Label>
                </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionsOpen(false)}>İptal</Button>
            <Button onClick={savePermissions}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
