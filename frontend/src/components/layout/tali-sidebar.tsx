"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, FileText, User, LogOut, PlusCircle, XCircle, ChevronLeft, ChevronRight, Users, Shield } from "lucide-react";

export function TaliSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    { href: "/dashboard/requests/cancellation", label: "İptal Talebi", icon: XCircle },
    { href: "/dashboard/profile", label: "Profilim", icon: User },
  ];

  return (
    <aside 
      className={`bg-indigo-950 text-white flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold truncate">Antigravity</h1>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-indigo-800 rounded-lg transition-colors ml-auto"
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
                  isActive ? "bg-indigo-600 text-white" : "text-indigo-300 hover:bg-indigo-900 hover:text-white"
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

      <div className="mt-auto p-4 border-t border-indigo-900">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 p-3 rounded-lg text-indigo-300 hover:bg-indigo-900/50 w-full transition-colors ${
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
