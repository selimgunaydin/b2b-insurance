"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { TaliSidebar } from "@/components/layout/tali-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["TALI"]}>
      <div className="flex h-screen bg-gray-50">
        <TaliSidebar />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
