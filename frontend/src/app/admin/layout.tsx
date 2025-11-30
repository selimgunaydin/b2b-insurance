"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="flex h-screen bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 pt-20 lg:pt-8 max-lg:mt-16">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
