"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingBag, History, Gift, AlertCircle } from "lucide-react";
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
  pointCost: number;
  status: string;
  createdAt: string;
}

export default function MarketPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  // Get User Profile for Points
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data;
    },
  });

  // Get Products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/market/products?activeOnly=true");
      return res.data;
    },
  });

  // Get My Purchases
  const { data: purchases, isLoading: purchasesLoading } = useQuery<Purchase[]>({
    queryKey: ["my-purchases"],
    queryFn: async () => {
      const res = await api.get("/market/my-purchases");
      return res.data;
    },
  });

  // Purchase Mutation
  const purchaseMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.post(`/market/purchase/${productId}`);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla satın alındı.",
      });
      setIsPurchaseDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-purchases"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); // Update points
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.response?.data?.message || "Satın alma işlemi başarısız.",
      });
    },
  });

  const handlePurchase = () => {
    if (selectedProduct) {
      purchaseMutation.mutate(selectedProduct.id);
    }
  };

  if (productsLoading || purchasesLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const userPoints = profile?.taliProfile?.points || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Puan Marketi</h1>
          <p className="text-muted-foreground">
            Puanlarınızı harcayarak ödüller kazanın
          </p>
        </div>
        <Card className="w-full md:w-auto bg-primary text-primary-foreground">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-2 bg-primary-foreground/10 rounded-full">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Mevcut Puanınız</p>
              <p className="text-2xl font-bold">{userPoints} Puan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Ürünler
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Satın Aldıklarım
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products?.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="aspect-video w-full bg-muted relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-secondary text-secondary-foreground">
                      <Gift className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="font-bold text-destructive text-lg border-2 border-destructive px-4 py-2 rounded-md transform -rotate-12">
                        TÜKENDİ
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {product.description || "Açıklama yok"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center justify-between mt-auto">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {product.pointCost} Puan
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Stok: {product.stock}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog open={isPurchaseDialogOpen && selectedProduct?.id === product.id} onOpenChange={(open) => {
                    setIsPurchaseDialogOpen(open);
                    if (open) setSelectedProduct(product);
                    else setSelectedProduct(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        disabled={product.stock <= 0 || userPoints < product.pointCost}
                        variant={userPoints >= product.pointCost ? "default" : "secondary"}
                      >
                        {userPoints < product.pointCost ? "Yetersiz Puan" : "Satın Al"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ürün Satın Al</DialogTitle>
                        <DialogDescription>
                          Bu ürünü satın almak istediğinize emin misiniz?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-start gap-4">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                          ) : (
                            <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                              <Gift className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{product.pointCost} Puan</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              İşlem sonrası kalan puanınız: <span className="font-medium text-foreground">{userPoints - product.pointCost}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPurchaseDialogOpen(false)}>İptal</Button>
                        <Button onClick={handlePurchase} disabled={purchaseMutation.isPending}>
                          {purchaseMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Onayla ve Satın Al
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
            {(!products || products.length === 0) && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Henüz markette ürün bulunmuyor.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Satın Alma Geçmişi</CardTitle>
              <CardDescription>
                Geçmişte satın aldığınız ürünler ve durumları.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchases?.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                        {purchase.product.imageUrl ? (
                          <img src={purchase.product.imageUrl} alt={purchase.product.name} className="h-full w-full object-cover rounded-md" />
                        ) : (
                          <Gift className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{purchase.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(purchase.createdAt).toLocaleDateString("tr-TR")} • {purchase.pointCost} Puan
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      purchase.status === "COMPLETED" || purchase.status === "DELIVERED" ? "default" : 
                      purchase.status === "REJECTED" ? "destructive" : "secondary"
                    }>
                      {purchase.status === "PENDING" ? "Bekliyor" :
                       purchase.status === "APPROVED" ? "Onaylandı" :
                       purchase.status === "COMPLETED" ? "Tamamlandı" :
                       purchase.status === "DELIVERED" ? "Teslim Edildi" :
                       purchase.status === "REJECTED" ? "Reddedildi" : purchase.status}
                    </Badge>
                  </div>
                ))}
                {(!purchases || purchases.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    Henüz satın alma işleminiz yok.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
