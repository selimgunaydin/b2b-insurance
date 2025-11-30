"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Target, Trophy, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Goal {
  id: string;
  title: string;
  description?: string;
  targetType: string;
  targetValue: number;
  rewardValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface TaliGoal {
  id: string;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: string;
  goal: Goal;
}

export default function GoalsPage() {
  const { data: goals, isLoading } = useQuery<TaliGoal[]>({
    queryKey: ["my-goals"],
    queryFn: async () => {
      const res = await api.get("/goals/my-goals");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeGoals = goals?.filter((g) => !g.isCompleted && g.goal.isActive) || [];
  const completedGoals = goals?.filter((g) => g.isCompleted) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Hedeflerim</h2>
        <p className="text-muted-foreground">
          Hedeflerinizi tamamlayarak ödüller kazanın
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Hedefler</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam İlerleme</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals?.length ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Aktif Hedefler</h3>
        {activeGoals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Target className="h-12 w-12 mb-4 opacity-20" />
              <p>Henüz aktif hedefiniz yok.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeGoals.map((taliGoal) => {
              const progress = (taliGoal.currentValue / taliGoal.goal.targetValue) * 100;
              return (
                <Card key={taliGoal.id} className="overflow-hidden border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{taliGoal.goal.title}</span>
                      <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span>₺{taliGoal.goal.rewardValue}</span>
                      </div>
                    </CardTitle>
                    {taliGoal.goal.description && (
                      <CardDescription>{taliGoal.goal.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">İlerleme</span>
                        <span className="font-medium">
                          {taliGoal.currentValue} / {taliGoal.goal.targetValue}
                          {taliGoal.goal.targetType === "COUNT" ? " adet" : " TL"}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        %{Math.round(progress)} tamamlandı
                      </p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Başlangıç: {format(new Date(taliGoal.goal.startDate), "d MMM yyyy", { locale: tr })}</span>
                      <span>Bitiş: {format(new Date(taliGoal.goal.endDate), "d MMM yyyy", { locale: tr })}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Tamamlanan Hedefler</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completedGoals.map((taliGoal) => (
              <Card key={taliGoal.id} className="bg-green-50/50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      {taliGoal.goal.title}
                    </span>
                    <div className="flex items-center gap-1 text-sm font-normal text-green-700">
                      <span>₺{taliGoal.goal.rewardValue}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tamamlandı: {taliGoal.completedAt ? format(new Date(taliGoal.completedAt), "d MMMM yyyy HH:mm", { locale: tr }) : "-"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
