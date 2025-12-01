"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Goal {
  id: string;
  title: string;
  description?: string;
  targetType: string;
  policyType?: string;
  targetValue: number;
  rewardType: string;
  rewardPoints: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface CreateGoalData {
  title: string;
  description?: string;
  targetType: string;
  policyType?: string;
  targetValue: number;
  rewardType: string;
  rewardPoints: number;
  startDate: string;
  endDate: string;
}

export default function AdminGoalsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery<Goal[]>({
    queryKey: ["admin-goals"],
    queryFn: async () => {
      const res = await api.get("/goals");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateGoalData) => {
      return api.post("/goals", data);
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Hedef oluşturuldu ve tüm Talilere atandı.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-goals"] });
      setIsCreateOpen(false);
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Hedef oluşturulamadı.",
        variant: "destructive",
      });
    },
  });

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; data: CreateGoalData }) => {
      return api.put(`/goals/${data.id}`, data.data);
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Hedef güncellendi.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-goals"] });
      setEditingGoal(null);
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Hedef güncellenemedi.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hedef Yönetimi</h1>
          <p className="text-muted-foreground">Tali hedeflerini oluştur ve yönet</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Hedef Oluştur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yeni Hedef Oluştur</DialogTitle>
            </DialogHeader>
            <GoalForm onSubmit={createMutation.mutate} isLoading={createMutation.isPending} />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Hedefi Düzenle</DialogTitle>
            </DialogHeader>
            {editingGoal && (
              <GoalForm 
                initialData={{
                  title: editingGoal.title,
                  description: editingGoal.description,
                  targetType: editingGoal.targetType,
                  policyType: editingGoal.policyType || "ALL",
                  targetValue: editingGoal.targetValue.toString(),
                  rewardType: editingGoal.rewardType,
                  rewardValue: editingGoal.rewardPoints.toString(),
                  startDate: format(new Date(editingGoal.startDate), "yyyy-MM-dd"),
                  endDate: format(new Date(editingGoal.endDate), "yyyy-MM-dd"),
                }}
                onSubmit={(data) => updateMutation.mutate({ id: editingGoal.id, data })} 
                isLoading={updateMutation.isPending} 
                submitText="Güncelle"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Hedefler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Başlık</TableHead>
                  <TableHead className="whitespace-nowrap">Tip</TableHead>
                  <TableHead className="whitespace-nowrap">Poliçe Türü</TableHead>
                  <TableHead className="whitespace-nowrap">Hedef</TableHead>
                  <TableHead className="whitespace-nowrap">Ödül</TableHead>
                  <TableHead className="whitespace-nowrap">Tarih Aralığı</TableHead>
                  <TableHead className="whitespace-nowrap">Durum</TableHead>
                  <TableHead className="whitespace-nowrap">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals?.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium whitespace-nowrap">{goal.title}</TableCell>
                    <TableCell>
                      {goal.targetType === "COUNT" ? "Adet" : "Prim Tutarı"}
                    </TableCell>
                    <TableCell>{goal.policyType || "Tümü"}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {goal.targetValue} {goal.targetType === "COUNT" ? "adet" : "TL"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        {goal.rewardPoints} Puan
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {format(new Date(goal.startDate), "dd/MM/yy", { locale: tr })} - {format(new Date(goal.endDate), "dd/MM/yy", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      {goal.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Pasif
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setEditingGoal(goal)}>
                        Düzenle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!goals || goals.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      Henüz hedef oluşturulmamış
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface GoalFormProps {
  onSubmit: (data: CreateGoalData) => void;
  isLoading: boolean;
  initialData?: any;
  submitText?: string;
}

function GoalForm({ onSubmit, isLoading, initialData, submitText = "Hedef Oluştur" }: GoalFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    targetType: initialData?.targetType || "COUNT",
    policyType: initialData?.policyType || "ALL",
    targetValue: initialData?.targetValue || "",
    rewardType: initialData?.rewardType || "POINTS",
    rewardValue: initialData?.rewardValue || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { rewardValue, ...rest } = formData;
    onSubmit({
      title: formData.title,
      description: formData.description,
      targetType: formData.targetType,
      targetValue: parseInt(formData.targetValue),
      rewardType: "POINTS",
      rewardPoints: parseFloat(formData.rewardValue),
      startDate: formData.startDate,
      endDate: formData.endDate,
      policyType: formData.policyType === "ALL" ? undefined : formData.policyType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Hedef Başlığı *</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="örn: 10 Trafik Poliçesi Sat"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Hedef hakkında detaylar..."
          />
        </div>

        <div>
          <Label htmlFor="targetType">Hedef Tipi *</Label>
          <Select value={formData.targetType} onValueChange={(value) => setFormData({ ...formData, targetType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COUNT">Satış Adedi</SelectItem>
              <SelectItem value="PREMIUM">Prim Tutarı</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="policyType">Poliçe Türü</Label>
          <Select value={formData.policyType} onValueChange={(value) => setFormData({ ...formData, policyType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Tümü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tümü</SelectItem>
              <SelectItem value="TRAFIK">Trafik</SelectItem>
              <SelectItem value="KASKO">Kasko</SelectItem>
              <SelectItem value="SAGLIK">Sağlık</SelectItem>
              <SelectItem value="DASK">DASK</SelectItem>
              <SelectItem value="KONUT">Konut</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="targetValue">Hedef Değer *</Label>
          <Input
            id="targetValue"
            type="number"
            required
            value={formData.targetValue}
            onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
            placeholder={formData.targetType === "COUNT" ? "Adet" : "TL"}
          />
        </div>

        <div>
          <Label htmlFor="rewardValue">Ödül Tutarı (TL) *</Label>
          <Input
            id="rewardValue"
            type="number"
            step="0.01"
            required
            value={formData.rewardValue}
            onChange={(e) => setFormData({ ...formData, rewardValue: e.target.value })}
            placeholder="500"
          />
        </div>

        <div>
          <Label htmlFor="startDate">Başlangıç Tarihi *</Label>
          <Input
            id="startDate"
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="endDate">Bitiş Tarihi *</Label>
          <Input
            id="endDate"
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitText}
        </Button>
      </div>
    </form>
  );
}
