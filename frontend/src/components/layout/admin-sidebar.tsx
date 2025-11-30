"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Settings, LogOut, ShieldAlert, ChevronLeft, ChevronRight, XCircle, Shield, UserCog, BarChart3, Building2, Target } from "lucide-react";

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const links = [
    { href: "/admin", label: "Panel", icon: LayoutDashboard },
    { href: "/admin/requests", label: "Talepler", icon: FileText },
    { href: "/admin/policies", label: "Poliçeler", icon: Shield },
    { href: "/admin/customers", label: "Müşteriler", icon: Users },
    { href: "/admin/cancellations", label: "İptal Talepleri", icon: XCircle },
    { href: "/admin/users", label: "Kullanıcılar", icon: UserCog },
    { href: "/admin/goals", label: "Hedefler", icon: Target },
    { href: "/admin/statistics", label: "İstatistikler", icon: BarChart3 },
    { href: "/admin/companies", label: "Şirketler", icon: Building2 },
    { href: "/admin/settings", label: "Ayarlar", icon: Settings },
  ];

  return (
    <aside 
      className={`bg-slate-900 text-white flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
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
      
      <div className="px-3 py-2">
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive ? "bg-red-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? link.label : undefined}
              >
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-950/30 w-full transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Çıkış Yap" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="truncate">Çıkış Yap</span>}
        </button>
      </div>
    </aside>
  );
}
