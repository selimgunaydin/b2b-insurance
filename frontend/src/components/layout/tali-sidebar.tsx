"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, FileText, User, LogOut, PlusCircle, XCircle, ChevronLeft, ChevronRight, Users, Shield, Bell, Target,
  ShoppingBag, Menu, X } from "lucide-react";

export function TaliSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const links = [
    { href: "/dashboard", label: "Panel", icon: Home },
    { href: "/dashboard/requests/new", label: "Yeni Teklif", icon: PlusCircle },
    { href: "/dashboard/requests", label: "Taleplerim", icon: FileText },
    { href: "/dashboard/customers", label: "Müşterilerim", icon: Users },
    { href: "/dashboard/policies", label: "Poliçelerim", icon: Shield },
    { href: "/dashboard/market", label: "Market", icon: ShoppingBag },
    { href: "/dashboard/goals", label: "Hedeflerim", icon: Target },
    { href: "/dashboard/requests/cancellation", label: "İptal Talebi", icon: XCircle },
    { href: "/dashboard/notifications", label: "Bildirimler", icon: Bell },
    { href: "/dashboard/profile", label: "Profilim", icon: User },
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
        <div className="hidden lg:flex p-4 items-center justify-between">
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
                    ${isActive ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-900/50"}
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

        <div className="px-3 py-2 border-t border-indigo-800">
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
