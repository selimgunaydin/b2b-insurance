"use client";

import { useState, useRef } from "react";
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
import { Loader2, Plus, Edit, Trash2, CheckCircle, XCircle, Truck, Upload, Package, Gift } from "lucide-react";
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
  type: "PHYSICAL" | "DIGITAL";
  category?: string;
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
  details?: any;
  fulfillmentData?: any;
  adminNote?: string;
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
    type: "PHYSICAL",
    category: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      setFormData({ name: "", description: "", imageUrl: "", pointCost: "", stock: "", type: "PHYSICAL", category: "" });
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
    mutationFn: async ({ id, status, fulfillmentData, adminNote }: { id: string; status: string; fulfillmentData?: any; adminNote?: string }) => {
      const res = await api.put(`/market/purchase/${id}/status`, { status, fulfillmentData, adminNote });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
      toast({ title: "Başarılı", description: "Görsel yüklendi." });
    } catch (error) {
      toast({ title: "Hata", description: "Görsel yüklenemedi.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

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
      type: product.type,
      category: product.category || "",
    });
    setIsProductDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", imageUrl: "", pointCost: "", stock: "", type: "PHYSICAL", category: "" });
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
                    <TableHead>Görsel</TableHead>
                    <TableHead>Ürün Adı</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Puan Bedeli</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover rounded" />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.type === "PHYSICAL" ? "Fiziksel" : "Dijital"}</Badge>
                      </TableCell>
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
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
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
                    <TableHead>Detaylar</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {purchase.product.type === "PHYSICAL" ? <Package className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                          {purchase.product.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {purchase.product.type === "PHYSICAL" && purchase.details?.address && (
                          <div className="text-xs max-w-[200px] truncate" title={purchase.details.address}>
                            📍 {purchase.details.address}
                          </div>
                        )}
                        {purchase.fulfillmentData && (
                          <div className="text-xs text-blue-600 mt-1">
                            {purchase.product.type === "PHYSICAL" ? `Kargo: ${purchase.fulfillmentData.trackingCode}` : `Kod: ${purchase.fulfillmentData.couponCode}`}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          purchase.status === "COMPLETED" || purchase.status === "DELIVERED" ? "default" : 
                          purchase.status === "REJECTED" ? "destructive" : "secondary"
                        }>
                          {purchase.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Yönet</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Sipariş Yönetimi</DialogTitle>
                                    <DialogDescription>
                                        {purchase.product.name} - {purchase.tali.user.taliProfile.fullName}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    {purchase.product.type === "PHYSICAL" && (
                                        <div className="p-3 bg-gray-50 rounded text-sm">
                                            <strong>Teslimat Adresi:</strong>
                                            <p>{purchase.details?.address || "Adres girilmemiş"}</p>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-2">
                                        <Label>Durum Güncelle</Label>
                                        <Select 
                                            defaultValue={purchase.status} 
                                            onValueChange={(val) => updateStatusMutation.mutate({ id: purchase.id, status: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Durum Seç" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Bekliyor</SelectItem>
                                                <SelectItem value="APPROVED">Onaylandı</SelectItem>
                                                <SelectItem value="SHIPPED">Kargolandı</SelectItem>
                                                <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                                                <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                                                <SelectItem value="REJECTED">Reddedildi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{purchase.product.type === "PHYSICAL" ? "Kargo Takip Kodu" : "Kupon Kodu"}</Label>
                                        <div className="flex gap-2">
                                            <Input 
                                                id={`fulfillment-${purchase.id}`} 
                                                placeholder={purchase.product.type === "PHYSICAL" ? "Takip No" : "Kupon Kodu"}
                                                defaultValue={purchase.product.type === "PHYSICAL" ? purchase.fulfillmentData?.trackingCode : purchase.fulfillmentData?.couponCode}
                                            />
                                            <Button onClick={() => {
                                                const val = (document.getElementById(`fulfillment-${purchase.id}`) as HTMLInputElement).value;
                                                const data = purchase.product.type === "PHYSICAL" ? { trackingCode: val } : { couponCode: val };
                                                updateStatusMutation.mutate({ id: purchase.id, status: purchase.status, fulfillmentData: data });
                                            }}>Kaydet</Button>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                         </Dialog>
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
            <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden border">
                    {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                    )}
                </div>
                <div className="flex-1">
                    <Label htmlFor="image" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                            <Upload className="h-4 w-4" />
                            Görsel Yükle
                        </div>
                        <Input 
                            id="image" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                    </Label>
                    {isUploading && <p className="text-xs text-muted-foreground mt-1">Yükleniyor...</p>}
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Ürün Tipi</Label>
                    <Select 
                        value={formData.type} 
                        onValueChange={(val) => setFormData({...formData, type: val})}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PHYSICAL">Fiziksel Ürün</SelectItem>
                            <SelectItem value="DIGITAL">Dijital Kod/Kupon</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Input 
                        id="category" 
                        value={formData.category} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})} 
                        placeholder="Örn: Teknoloji"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
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
              <Button type="submit" disabled={productMutation.isPending || isUploading}>
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
