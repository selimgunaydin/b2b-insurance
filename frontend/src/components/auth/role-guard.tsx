"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { SocketProvider } from "@/providers/socket-provider";

interface User {
  id: string;
  email: string;
  role: string;
  isApproved: boolean;
  taliProfile?: {
    fullName: string;
    points: number;
    membershipType: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, token: null });

export function useAuth() {
  return useContext(AuthContext);
}

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          router.push("/auth/login");
          return;
        }

        setToken(storedToken);

        const res = await api.get("/user/profile");
        const userData = res.data;
        setUser(userData);

        if (allowedRoles.includes(userData.role)) {
          setIsAuthorized(true);
        } else {
          // Redirect to appropriate dashboard if logged in but wrong role
          if (userData.role === "ADMIN") {
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return (
    <AuthContext.Provider value={{ user, token }}>
      <SocketProvider token={token}>
        {children}
      </SocketProvider>
    </AuthContext.Provider>
  );
}

