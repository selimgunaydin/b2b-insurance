"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins } from "lucide-react";

interface AdminPointsModalProps {
  userId: string;
  currentPoints: number;
}

export function AdminPointsModal({ userId, currentPoints }: AdminPointsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "DEPOSIT", // DEPOSIT, REFUND, etc.
    description: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const pointsMutation = useMutation({
    mutationFn: async (data: { amount: string; type: string; description: string }) => {
      try {
        const res = await api.post(`/transactions/adjust`, {
          userId,
          amount: Number(data.amount),
          type: data.type,
          description: data.description,
        });
        return res.data;
      } catch (error: any) {
        toast({
          title: "Hata",
          description: error.message || "Puan güncellenirken bir hata oluştu.",
          variant: "destructive",
        });
        throw error; 
      }
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Puan işlemi gerçekleştirildi.",
      });
      setIsOpen(false);
      setFormData({ amount: "", type: "DEPOSIT", description: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-user-detail", userId] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.response?.data?.message || "İşlem başarısız.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pointsMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Coins className="mr-2 h-4 w-4" />
          Puan Yönetimi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Puan Yönetimi</DialogTitle>
          <DialogDescription>
            Kullanıcıya puan ekleyin veya çıkarın (negatif değer girerek).
            <br />
            Mevcut Puan: <strong>{currentPoints}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Miktar (+/-)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Örn: 100 veya -50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">İşlem Tipi</Label>
            <Select
              value={formData.type}
              onValueChange={(val) => setFormData({ ...formData, type: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tip Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEPOSIT">Yükleme (Deposit)</SelectItem>
                <SelectItem value="REFUND">İade (Refund)</SelectItem>
                <SelectItem value="PAYMENT">Ödeme (Payment)</SelectItem>
                <SelectItem value="COMMISSION">Komisyon (Commission)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="İşlem açıklaması..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>İptal</Button>
            <Button type="submit" disabled={pointsMutation.isPending}>
              {pointsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Onayla
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
