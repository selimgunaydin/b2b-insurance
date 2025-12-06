"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SidebarNav } from "./sidebar-nav";
import { 
  LayoutDashboard, FileText, Users, Settings, LogOut, ShieldAlert, 
  ChevronLeft, ChevronRight, XCircle, Shield, UserCog, BarChart3, 
  Building2, Target, ShoppingBag, Globe, Menu, X, Percent, Crown,
  Award
} from "lucide-react";
import { useSocketStore } from "@/lib/socket";

export function AdminSidebar() {
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
      groupLabel: "Genel Bakış",
      items: [
        { title: "Panel", href: "/admin", icon: LayoutDashboard },
        { title: "Analitik", href: "/admin/analytics", icon: BarChart3 },
      ]
    },
    {
      groupLabel: "Operasyon",
      items: [
        { title: "Talepler", href: "/admin/requests", icon: FileText },
        { title: "Poliçeler", href: "/admin/policies", icon: Shield },
        { title: "İptal Talepleri", href: "/admin/cancellations", icon: XCircle },
      ]
    },
    {
      groupLabel: "Ağ Yönetimi",
      items: [
        { title: "Müşteriler", href: "/admin/customers", icon: Users },
        { title: "Kullanıcılar", href: "/admin/users", icon: UserCog },
        { title: "Şirketler", href: "/admin/companies", icon: Building2 },
      ]
    },
    {
      groupLabel: "Finans",
      items: [
        { title: "Komisyonlar", href: "/admin/commissions", icon: Percent },
        { title: "Premium", href: "/admin/premium", icon: Crown },
      ]
    },
    {
      groupLabel: "Sistem",
      items: [
        { title: "Market", href: "/admin/market", icon: ShoppingBag },
        { title: "Rozetler", href: "/admin/badges", icon: Award },
        { title: "Hedefler", href: "/admin/goals", icon: Target },
        { title: "CMS", href: "/admin/website", icon: Globe },
        { title: "Bildirimler", href: "/admin/notifications", icon: ShieldAlert, label: unreadCount > 0 ? (unreadCount > 99 ? "99+" : String(unreadCount)) : undefined },
        { title: "Ayarlar", href: "/admin/settings", icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-red-500" />
          <h1 className="text-xl font-bold">Admin</h1>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg"
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
          bg-slate-900 text-white flex flex-col h-full transition-all duration-300
          fixed lg:static inset-y-0 left-0 z-40
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Desktop Header */}
        <div className="hidden lg:flex p-4 items-center justify-between h-16">
          <div className="flex items-center gap-2 overflow-hidden">
            <ShieldAlert className="h-8 w-8 text-red-500 shrink-0" />
            {!isCollapsed && <h1 className="text-xl font-bold truncate">Admin</h1>}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors ml-auto"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Mobile Header (in sidebar) */}
        <div className="lg:hidden p-4 flex items-center justify-between border-b border-slate-800">
          <h1 className="text-xl font-bold">Admin Menu</h1>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-lg"
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

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => {
              handleLogout();
              setIsMobileOpen(false);
            }}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-100 hover:bg-slate-800/50 transition-colors
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
