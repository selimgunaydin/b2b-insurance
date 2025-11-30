"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings-public"],
    queryFn: async () => {
      // We need a public endpoint for settings or handle 401 gracefully if not logged in
      // Assuming /settings is protected, we might need a public check or rely on initial props
      // For now, let's try to fetch. If it fails (401), we assume not maintenance or handle in layout.
      // Better approach: Create a public endpoint /settings/public-config
      try {
        const res = await api.get("/settings/public-config"); 
        return res.data;
      } catch {
        // Ignore error
      }
      return [];
    },
    retry: false,
  });

  const isMaintenanceMode = settings?.find((s: any) => s.key === "maintenance_mode")?.value === "true";
  const isAdmin = pathname?.startsWith("/admin"); // Simple check, ideally check user role
  const isMaintenancePage = pathname === "/maintenance";

  const isAuthPage = pathname?.startsWith("/auth");
  const isPublicPage = ["/", "/hakkimizda", "/iletisim", "/referanslar"].includes(pathname || "");

  useEffect(() => {
    if (isMaintenanceMode && !isAdmin && !isMaintenancePage && !isAuthPage && !isPublicPage) {
      router.push("/maintenance");
    }
  }, [isMaintenanceMode, isAdmin, isMaintenancePage, isAuthPage, isPublicPage, router]);

  if (isLoading) {
     // Optional: Show loading state or just render children to avoid flicker
     return <>{children}</>;
  }

  if (isMaintenanceMode && !isAdmin && !isMaintenancePage && !isAuthPage && !isPublicPage) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
