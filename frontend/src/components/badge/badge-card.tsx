import { Badge } from "@/types/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award, Lock } from "lucide-react";

interface BadgeCardProps {
  badge: Badge;
  className?: string;
}

export function BadgeCard({ badge, className }: BadgeCardProps) {
  const isEarned = badge.isEarned;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-md",
      !isEarned && "opacity-60 grayscale",
      className
    )}>
      <div className={cn(
        "absolute top-0 right-0 p-2",
        isEarned ? "text-yellow-500" : "text-gray-400"
      )}>
        {isEarned ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
      </div>
      
      <CardHeader className="text-center pb-2">
        <div className={cn(
          "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2",
          isEarned ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"
        )}>
          {badge.iconUrl ? (
            <img src={badge.iconUrl} alt={badge.name} className="w-10 h-10 object-contain" />
          ) : (
            <Award className="w-8 h-8" />
          )}
        </div>
        <CardTitle className="text-sm font-bold truncate" title={badge.name}>
          {badge.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-center text-xs text-muted-foreground pb-4">
        <p className="line-clamp-2 h-8" title={badge.description}>
          {badge.description}
        </p>
        <div className="mt-2 font-semibold text-indigo-600">
          +{badge.points} Puan
        </div>
        {isEarned && badge.earnedAt && (
          <div className="mt-1 text-[10px] text-gray-400">
            {new Date(badge.earnedAt).toLocaleDateString('tr-TR')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
