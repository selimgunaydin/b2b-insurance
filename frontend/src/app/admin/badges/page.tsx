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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, Plus, Edit, Trash2, Award, Upload, Target, Users, 
  TrendingUp, Star, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BadgeType {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  type: "POLICY_COUNT" | "PREMIUM_TOTAL" | "CUSTOMER_COUNT" | "STREAK" | "SPECIAL";
  criteria: { threshold: number; insuranceType?: string };
  points: number;
  isActive: boolean;
  createdAt: string;
}

const BADGE_TYPE_LABELS: Record<string, { label: string; icon: any; description: string }> = {
  POLICY_COUNT: { label: "Poliçe Sayısı", icon: Target, description: "Belirli sayıda poliçe satışı" },
  PREMIUM_TOTAL: { label: "Prim Toplamı", icon: TrendingUp, description: "Toplam prim tutarı hedefi" },
  CUSTOMER_COUNT: { label: "Müşteri Sayısı", icon: Users, description: "Belirli sayıda müşteri kazanımı" },
  STREAK: { label: "Seri", icon: Zap, description: "Ardışık gün/hafta aktivitesi" },
  SPECIAL: { label: "Özel", icon: Star, description: "Manuel olarak verilen özel rozetler" },
};

const INSURANCE_TYPES = ["TRAFIK", "KASKO", "SAGLIK", "DASK", "KONUT"];

export default function AdminBadgesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    iconUrl: "",
    type: "POLICY_COUNT" as BadgeType["type"],
    threshold: "",
    insuranceType: "",
    points: "",
  });

  const { data: badges, isLoading } = useQuery<BadgeType[]>({
    queryKey: ["admin-badges"],
    queryFn: async () => {
      const res = await api.get("/badges");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingBadge) {
        return api.put(`/badges/${editingBadge.id}`, data);
      }
      return api.post("/badges", data);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: editingBadge ? "Rozet güncellendi." : "Rozet oluşturuldu." });
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: "Hata", description: "İşlem başarısız.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/badges/${id}`),
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Rozet silindi." });
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return api.put(`/badges/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
    },
  });

  const initMutation = useMutation({
    mutationFn: async () => api.post("/badges/initialize"),
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Varsayılan rozetler oluşturuldu." });
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBadge(null);
    setFormData({
      name: "",
      description: "",
      iconUrl: "",
      type: "POLICY_COUNT",
      threshold: "",
      insuranceType: "",
      points: "",
    });
  };

  const handleEdit = (badge: BadgeType) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      description: badge.description,
      iconUrl: badge.iconUrl || "",
      type: badge.type,
      threshold: badge.criteria.threshold.toString(),
      insuranceType: badge.criteria.insuranceType || "",
      points: badge.points.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      description: formData.description,
      iconUrl: formData.iconUrl || undefined,
      type: formData.type,
      criteria: {
        threshold: parseInt(formData.threshold),
        ...(formData.insuranceType && { insuranceType: formData.insuranceType }),
      },
      points: parseInt(formData.points) || 0,
    };
    createMutation.mutate(data);
  };

  const getTypeIcon = (type: string) => {
    const config = BADGE_TYPE_LABELS[type];
    if (!config) return <Award className="h-4 w-4" />;
    const Icon = config.icon;
    return <Icon className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rozet Yönetimi</h1>
          <p className="text-muted-foreground">Kullanıcılara verilecek rozetleri yönetin</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => initMutation.mutate()} disabled={initMutation.isPending}>
            {initMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Varsayılanları Yükle
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Rozet
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rozetler</CardTitle>
          <CardDescription>Toplam {badges?.length || 0} rozet tanımlı</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Rozet Adı</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Kriter</TableHead>
                <TableHead>Puan</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {badges?.map((badge) => (
                <TableRow key={badge.id}>
                  <TableCell>
                    {badge.iconUrl ? (
                      <img src={badge.iconUrl} alt={badge.name} className="w-8 h-8 rounded" />
                    ) : (
                      <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                        <Award className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {getTypeIcon(badge.type)}
                      {BADGE_TYPE_LABELS[badge.type]?.label || badge.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {badge.criteria.threshold}
                      {badge.criteria.insuranceType && ` (${badge.criteria.insuranceType})`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">+{badge.points} puan</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={badge.isActive}
                      onCheckedChange={(checked) => toggleMutation.mutate({ id: badge.id, isActive: checked })}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(badge)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Bu rozeti silmek istediğinize emin misiniz?")) {
                            deleteMutation.mutate(badge.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!badges || badges.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Henüz rozet tanımlanmamış. Varsayılanları yükleyin veya yeni bir rozet oluşturun.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Badge Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBadge ? "Rozet Düzenle" : "Yeni Rozet Oluştur"}</DialogTitle>
            <DialogDescription>Rozet detaylarını girin</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Rozet Adı</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Yıldız Satıcı"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Rozet kazanma koşulları..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Rozet Türü</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BADGE_TYPE_LABELS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="h-4 w-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {BADGE_TYPE_LABELS[formData.type]?.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hedef Değer</Label>
                <Input
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  placeholder="Örn: 10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Bonus Puan</Label>
                <Input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  placeholder="Örn: 50"
                />
              </div>
            </div>
            {formData.type === "POLICY_COUNT" && (
              <div className="space-y-2">
                <Label>Sigorta Türü (Opsiyonel)</Label>
                <Select 
                  value={formData.insuranceType || "ALL"} 
                  onValueChange={(val) => setFormData({ ...formData, insuranceType: val === "ALL" ? "" : val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm türler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tüm Türler</SelectItem>
                    {INSURANCE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Rozet Görseli URL (Opsiyonel)</Label>
              <Input
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                İptal
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingBadge ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
