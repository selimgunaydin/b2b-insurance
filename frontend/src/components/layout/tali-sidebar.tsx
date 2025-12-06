"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SidebarNav } from "./sidebar-nav";
import { 
  LayoutDashboard, FileText, User, LogOut, PlusCircle, Wallet, Target, 
  Settings, MessageSquare, Home, Users, Shield, ShoppingBag, XCircle, 
  Bell, X, Menu, ChevronRight, ChevronLeft, Crown, History, Award, Trophy 
} from "lucide-react";
import { useSocketStore } from "@/lib/socket";

export function TaliSidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { socket } = useSocketStore();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  // Fetch initial unread count (no polling)
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const res = await api.get("/notification/unread-count");
      return res.data as number;
    },
    staleTime: Infinity, // Don't auto-refetch, rely on socket
  });

  // Listen for socket updates
  useEffect(() => {
    if (socket) {
      const handleUnreadCount = (data: { count: number }) => {
        queryClient.setQueryData(["unread-count"], data.count);
      };
      socket.on("unread_count", handleUnreadCount);
      return () => {
        socket.off("unread_count", handleUnreadCount);
      };
    }
  }, [socket, queryClient]);

  const links = [
    {
      groupLabel: "Genel",
      items: [
        { title: "Panel", href: "/dashboard", icon: Home },
        { title: "Hedeflerim", href: "/dashboard/goals", icon: Target },
      ]
    },
    {
      groupLabel: "Satış",
      items: [
        { title: "Yeni Teklif", href: "/dashboard/requests/new", icon: PlusCircle },
        { title: "Market", href: "/dashboard/market", icon: ShoppingBag },
      ]
    },
    {
      groupLabel: "Portföy",
      items: [
        { title: "Taleplerim", href: "/dashboard/requests", icon: FileText },
        { title: "Poliçelerim", href: "/dashboard/policies", icon: Shield },
        { title: "Müşterilerim", href: "/dashboard/customers", icon: Users },
        { title: "İptal İşlemleri", icon: XCircle, items: [
             { title: "Yeni İptal Talebi", href: "/dashboard/requests/cancellation" },
             { title: "İptal Taleplerim", href: "/dashboard/requests/cancellation/my" }
        ]},
      ]
    },
    {
      groupLabel: "Performans",
      items: [
        { title: "Kazançlarım", href: "/dashboard/earnings", icon: Wallet },
        { title: "Puan Geçmişi", href: "/dashboard/transactions", icon: History },
        { title: "Liderlik", href: "/dashboard/leaderboard", icon: Trophy },
        { title: "Rozetlerim", href: "/dashboard/badges", icon: Award },
        { title: "Premium", href: "/dashboard/premium", icon: Crown },
      ]
    },
    {
      groupLabel: "Hesap",
      items: [
        { title: "Bildirimler", href: "/dashboard/notifications", icon: Bell, label: unreadCount > 0 ? (unreadCount > 99 ? "99+" : String(unreadCount)) : undefined },
        { title: "Profilim", href: "/dashboard/profile", icon: User },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-indigo-950 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">B2B Sigorta</h1>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 hover:bg-indigo-800 rounded-lg"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-indigo-950 text-white flex flex-col h-full transition-all duration-300
          fixed lg:static inset-y-0 left-0 z-40
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Desktop Header */}
        <div className="hidden lg:flex p-4 items-center justify-between h-16">
          {!isCollapsed && <h1 className="text-xl font-bold truncate">B2B Sigorta</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-indigo-800 rounded-lg transition-colors ml-auto"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Mobile Header (in sidebar) */}
        <div className="lg:hidden p-4 flex items-center justify-between border-b border-indigo-800">
          <h1 className="text-xl font-bold">Menu</h1>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarNav 
             isCollapsed={isCollapsed} 
             links={links} 
             onLinkClick={() => setIsMobileOpen(false)}
          />
        </div>

        <div className="p-3 border-t border-indigo-800">
          <button
            onClick={() => {
              handleLogout();
              setIsMobileOpen(false);
            }}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-indigo-100 hover:bg-indigo-900/50 transition-colors
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Çıkış</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
