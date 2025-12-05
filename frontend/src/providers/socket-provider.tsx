"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data: any) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emit: () => {},
});

export function useSocket() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: ReactNode;
  token: string | null;
}

export function SocketProvider({ children, token }: SocketProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const { toast } = useToast();
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      // Disconnect if token is removed (logout)
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        isConnectedRef.current = false;
      }
      return;
    }

    // Already connected
    if (socketRef.current?.connected) {
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const socket = io(`${socketUrl}/notifications`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected");
      isConnectedRef.current = true;
    });

    socket.on("disconnect", () => {
      console.log("[Socket] Disconnected");
      isConnectedRef.current = false;
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
    });

    // Handle notifications
    socket.on("notification", (data) => {
      console.log("[Socket] Notification received:", data);
      toast({
        title: data.title,
        description: data.message,
      });
    });

    // Handle real-time updates
    socket.on("policy_update", (data) => {
      console.log("[Socket] Policy update:", data);
      // Dispatch to global state or refetch data
    });

    socket.on("request_update", (data) => {
      console.log("[Socket] Request update:", data);
    });

    socket.on("chat_message", (data) => {
      console.log("[Socket] Chat message:", data);
      toast({
        title: "Yeni Mesaj",
        description: data.message?.substring(0, 50) + "...",
      });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
    };
  }, [token, toast]);

  const emit = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected: isConnectedRef.current,
        emit,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
