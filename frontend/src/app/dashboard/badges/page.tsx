"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/types/badge";
import { BadgeList } from "@/components/badge/badge-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Star, Trophy } from "lucide-react";
import { useAuth } from "@/components/auth/role-guard";

export default function MyBadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all system badges and user's earned badges in parallel
        const [allBadgesRes, myBadgesRes] = await Promise.all([
          api.get("/badges"),
          api.get("/badges/my")
        ]);

        const allBadges: Badge[] = allBadgesRes.data;
        const myBadges: { badgeId: string; earnedAt: string }[] = myBadgesRes.data;

        // Merge data to determine earned status
        const mergedBadges = allBadges.map(badge => {
          const earned = myBadges.find(mb => mb.badgeId === badge.id);
          return {
            ...badge,
            isEarned: !!earned,
            earnedAt: earned ? earned.earnedAt : undefined
          };
        });

        // Sort: Earned first, then by points (high to low)
        mergedBadges.sort((a, b) => {
          if (a.isEarned && !b.isEarned) return -1;
          if (!a.isEarned && b.isEarned) return 1;
          return b.points - a.points;
        });

        setBadges(mergedBadges);
      } catch (error) {
        console.error("Failed to fetch badges", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalBadges = badges.length;
  const earnedBadges = badges.filter(b => b.isEarned).length;
  const progressPercentage = totalBadges > 0 ? (earnedBadges / totalBadges) * 100 : 0;
  const totalPoints = badges.filter(b => b.isEarned).reduce((sum, b) => sum + b.points, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Statistics Card */}
        <Card className="flex-1 bg-gradient-to-br from-indigo-50 leading-relaxed md:col-span-2">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Trophy className="h-6 w-6 text-indigo-600" />
               Rozet Durumu
             </CardTitle>
             <CardDescription>
               Topladığınız rozetler ve genel ilerlemeniz
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div>
               <div className="flex justify-between mb-2 text-sm font-medium">
                 <span>İlerleme ({earnedBadges}/{totalBadges})</span>
                 <span>%{Math.round(progressPercentage)}</span>
               </div>
               <Progress value={progressPercentage} className="h-3" />
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-2">
               <div className="bg-white p-3 rounded-lg shadow-sm border text-center">
                 <div className="text-muted-foreground text-xs uppercase font-semibold">Toplam Puan</div>
                 <div className="text-2xl font-bold text-indigo-600 flex items-center justify-center gap-1">
                   {totalPoints} <Star className="h-4 w-4 fill-indigo-600 text-indigo-600" />
                 </div>
               </div>
               <div className="bg-white p-3 rounded-lg shadow-sm border text-center">
                 <div className="text-muted-foreground text-xs uppercase font-semibold">Kazanılan</div>
                 <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                   {earnedBadges} <Award className="h-4 w-4" />
                 </div>
               </div>
             </div>
           </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="flex-1 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Nasıl Kazanırım?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• Poliçe satışlarınızla puan toplayın.</p>
            <p>• Yeni müşteriler ekleyerek ağınızı büyütün.</p>
            <p>• Belirli hedeflere ulaşarak özel rozetlerin kilidini açın.</p>
            <p>• Liderlik tablosunda üst sıralara yükselin!</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-gray-700" />
          Rozet Koleksiyonu
        </h2>
        <BadgeList badges={badges} isLoading={isLoading} />
      </div>
    </div>
  );
}
