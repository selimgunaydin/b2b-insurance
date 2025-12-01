"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Settings, LogOut, ShieldAlert, ChevronLeft, ChevronRight, XCircle, Shield, UserCog, BarChart3, Building2, Target,
  ShoppingBag, Globe, Menu, X, Percent, Crown, Wallet } from "lucide-react";

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    { href: "/admin/market", label: "Market", icon: ShoppingBag },
    { href: "/admin/goals", label: "Hedefler", icon: Target },
    { href: "/admin/financials", label: "Finansal", icon: Wallet },
    { href: "/admin/statistics", label: "İstatistikler", icon: BarChart3 },
    { href: "/admin/companies", label: "Şirketler", icon: Building2 },
    { href: "/admin/commissions", label: "Komisyonlar", icon: Percent },
    { href: "/admin/premium", label: "Premium", icon: Crown },
    { href: "/admin/website", label: "Website", icon: Globe },
    { href: "/admin/settings", label: "Ayarlar", icon: Settings },
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
        <div className="hidden lg:flex p-4 items-center justify-between">
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

        <div className="px-3 py-2 flex-1 overflow-y-auto">
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive ? "bg-slate-800 text-white" : "text-slate-100 hover:bg-slate-800/50"}
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon size={20} className="shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-3 py-2 border-t border-slate-800">
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
