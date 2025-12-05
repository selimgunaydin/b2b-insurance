"use client";

import { useEffect, useCallback } from 'react';
import { useSocketStore } from '@/lib/socket';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications(token: string | null, onNewNotification?: (notification: Notification) => void) {
  const { socket, isConnected, connect, disconnect } = useSocketStore();
  const { toast } = useToast();

  useEffect(() => {
    if (token && !isConnected) {
      connect(token);
    }

    return () => {
      // Don't disconnect on unmount to maintain connection across pages
    };
  }, [token, isConnected, connect]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      console.log('[Notification] Received:', notification);

      // Call custom handler if provided
      if (onNewNotification) {
        onNewNotification(notification);
      }

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, toast, onNewNotification]);

  const markAsRead = useCallback((notificationId: string) => {
    if (socket) {
      socket.emit('markAsRead', notificationId);
    }
  }, [socket]);

  return {
    isConnected,
    markAsRead,
    disconnect,
  };
}
