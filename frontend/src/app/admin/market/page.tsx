"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, CheckCircle, XCircle, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  pointCost: number;
  stock: number;
  isActive: boolean;
}

interface Purchase {
  id: string;
  product: Product;
  tali: {
    user: {
      email: string;
      taliProfile: {
        fullName: string;
      };
    };
  };
  pointCost: number;
  status: string;
  createdAt: string;
}

export default function AdminMarketPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    pointCost: "",
    stock: "",
  });

  // Get Products (Admin sees all)
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await api.get("/market/products"); // Admin endpoint returns all
      return res.data;
    },
  });

  // Get All Purchases
  const { data: purchases, isLoading: purchasesLoading } = useQuery<Purchase[]>({
    queryKey: ["admin-purchases"],
    queryFn: async () => {
      const res = await api.get("/market/purchases");
      return res.data;
    },
  });

  // Create/Update Product Mutation
  const productMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingProduct) {
        const res = await api.put(`/market/products/${editingProduct.id}`, data);
        return res.data;
      } else {
        const res = await api.post("/market/products", data);
        return res.data;
      }
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: `Ürün başarıyla ${editingProduct ? "güncellendi" : "oluşturuldu"}.`,
      });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      setFormData({ name: "", description: "", imageUrl: "", pointCost: "", stock: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.response?.data?.message || "İşlem başarısız.",
      });
    },
  });

  // Delete Product Mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/market/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Ürün silindi.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  // Update Purchase Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.put(`/market/purchase/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Sipariş durumu güncellendi.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    productMutation.mutate({
      ...formData,
      pointCost: Number(formData.pointCost),
      stock: Number(formData.stock),
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      pointCost: product.pointCost.toString(),
      stock: product.stock.toString(),
    });
    setIsProductDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", imageUrl: "", pointCost: "", stock: "" });
    setIsProductDialogOpen(true);
  };

  if (productsLoading || purchasesLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Market Yönetimi</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Ürün Ekle
        </Button>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Ürünler</TabsTrigger>
          <TabsTrigger value="purchases">Siparişler</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Ürün Listesi</CardTitle>
              <CardDescription>Market ürünlerini yönetin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün Adı</TableHead>
                    <TableHead>Puan Bedeli</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.pointCost} Puan</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
                                deleteProductMutation.mutate(product.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!products || products.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Ürün bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Listesi</CardTitle>
              <CardDescription>Tali kullanıcılarının market siparişleri.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Tali</TableHead>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Bedel</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases?.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{new Date(purchase.createdAt).toLocaleDateString("tr-TR")}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{purchase.tali.user.taliProfile.fullName}</span>
                          <span className="text-xs text-muted-foreground">{purchase.tali.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{purchase.product.name}</TableCell>
                      <TableCell>{purchase.pointCost} Puan</TableCell>
                      <TableCell>
                        <Badge variant={
                          purchase.status === "COMPLETED" || purchase.status === "DELIVERED" ? "default" : 
                          purchase.status === "REJECTED" ? "destructive" : "secondary"
                        }>
                          {purchase.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select 
                          defaultValue={purchase.status} 
                          onValueChange={(val) => updateStatusMutation.mutate({ id: purchase.id, status: val })}
                        >
                          <SelectTrigger className="w-[140px] ml-auto">
                            <SelectValue placeholder="Durum Seç" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Bekliyor</SelectItem>
                            <SelectItem value="APPROVED">Onaylandı</SelectItem>
                            <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                            <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                            <SelectItem value="REJECTED">Reddedildi</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!purchases || purchases.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Sipariş bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
            <DialogDescription>
              Market ürün detaylarını giriniz.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Görsel URL</Label>
              <Input 
                id="imageUrl" 
                value={formData.imageUrl} 
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pointCost">Puan Bedeli</Label>
                <Input 
                  id="pointCost" 
                  type="number" 
                  value={formData.pointCost} 
                  onChange={(e) => setFormData({...formData, pointCost: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stok Adedi</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  value={formData.stock} 
                  onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>İptal</Button>
              <Button type="submit" disabled={productMutation.isPending}>
                {productMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
