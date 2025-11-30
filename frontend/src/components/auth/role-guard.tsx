"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const res = await api.get("/user/profile");
        const user = res.data;

        if (allowedRoles.includes(user.role)) {
          setIsAuthorized(true);
        } else {
          // Redirect to appropriate dashboard if logged in but wrong role
          if (user.role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("Auth check failed", error);
        localStorage.removeItem("token");
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
