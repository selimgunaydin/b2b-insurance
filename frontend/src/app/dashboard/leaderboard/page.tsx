"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LeaderboardUser } from "@/types/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/badges/leaderboard");
        setLeaderboard(res.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="font-bold text-gray-500 text-lg w-6 text-center">{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liderlik Tablosu</h1>
          <p className="text-muted-foreground">En yüksek puana sahip Tali kullanıcıları</p>
        </div>
      </div>

      {/* Top 3 Cards - Styled differently */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {leaderboard.slice(0, 3).map((user, index) => (
          <Card key={user.id} className={`border-t-4 ${index === 0 ? 'border-t-yellow-500' : index === 1 ? 'border-t-gray-400' : 'border-t-amber-700'} relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
              {index === 0 ? <Trophy className="h-24 w-24" /> : <Medal className="h-24 w-24" />}
            </div>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-2">
                 {getRankIcon(index + 1)}
              </div>
              <Avatar className="h-16 w-16 mx-auto border-2 border-white shadow-md">
                <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold text-xl">
                  {user.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-2">{user.fullName}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {user.membershipType}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {user.points} Puan
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {user.badgeCount} Rozet • {user.policyCount} Poliçe
              </div>
              <div className="flex justify-center gap-1">
                {user.badges.slice(0, 3).map(badge => (
                  <div key={badge.id} title={badge.name} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                    {badge.iconUrl ? (
                      <img src={badge.iconUrl} alt={badge.name} className="w-5 h-5" />
                    ) : (
                      <Award className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                ))}
                {user.badges.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    +{user.badges.length - 3}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Sıra</TableHead>
                <TableHead>Kullanıcı</TableHead>
                <TableHead className="text-center">Rozetler</TableHead>
                <TableHead className="text-center">Poliçe</TableHead>
                <TableHead className="text-center">Müşteri</TableHead>
                <TableHead className="text-right">Puan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.length > 0 ? (
                leaderboard.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-center">
                      {getRankIcon(user.rank)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs">
                            {user.fullName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground hidden sm:block">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-1">
                        <Award className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{user.badgeCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm">{user.policyCount}</TableCell>
                    <TableCell className="text-center text-sm">{user.customerCount}</TableCell>
                    <TableCell className="text-right font-bold text-indigo-600">
                      {user.points}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Henüz veri bulunmuyor.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
