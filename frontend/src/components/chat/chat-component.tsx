import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, User, Shield } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    sender: {
        id: string;
        email: string;
        role: "ADMIN" | "TALI";
        taliProfile?: {
            fullName: string;
        };
    };
}

interface ChatComponentProps {
    requestId: string;
    currentUserRole: "ADMIN" | "TALI";
}

export function ChatComponent({ requestId, currentUserRole }: ChatComponentProps) {
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    const { data: messages, isLoading } = useQuery<Message[]>({
        queryKey: ["chat", requestId],
        queryFn: async () => {
            const res = await api.get(`/chat/${requestId}`);
            return res.data;
        },
        refetchInterval: 10000, // Poll every 10 seconds
    });

    const sendMessageMutation = useMutation({
        mutationFn: async (content: string) => {
            await api.post(`/chat/${requestId}`, { content });
        },
        onSuccess: () => {
            setNewMessage("");
            queryClient.invalidateQueries({ queryKey: ["chat", requestId] });
        },
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        sendMessageMutation.mutate(newMessage);
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b px-4 py-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    Mesajlar
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </CardTitle>
            </CardHeader>
            <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
                <div className="space-y-4">
                    {messages?.map((msg) => {
                        const isMe = (currentUserRole === "ADMIN" && msg.sender.role === "ADMIN") || 
                                     (currentUserRole === "TALI" && msg.sender.role === "TALI"); // Simplified check, ideally check ID
                        
                        // Better check: we don't have current user ID passed easily, but role is a good proxy for this context
                        // Actually, let's rely on alignment. Admin messages on right for Admin, left for Tali?
                        // Standard chat: My messages on right.
                        
                        // Let's assume the backend check ensures we only see relevant messages.
                        // We need to know "is this message from me?".
                        // Since we don't have auth context easily here without a hook, let's use role.
                        // If I am ADMIN, and sender is ADMIN -> Me.
                        // If I am TALI, and sender is TALI -> Me.
                        // Wait, multiple Talis? No, request is specific to one Tali.
                        // So this logic holds for this specific context.
                        
                        const isMyMessage = msg.sender.role === currentUserRole;

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`flex gap-2 max-w-[80%] ${
                                        isMyMessage ? "flex-row-reverse" : "flex-row"
                                    }`}
                                >
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                        msg.sender.role === "ADMIN" ? "bg-primary text-primary-foreground" : "bg-muted"
                                    }`}>
                                        {msg.sender.role === "ADMIN" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                    </div>
                                    <div
                                        className={`rounded-lg px-3 py-2 text-sm ${
                                            isMyMessage
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        }`}
                                    >
                                        <div className="font-semibold text-xs mb-1 opacity-90">
                                            {msg.sender.role === "ADMIN" ? "Admin" : msg.sender.taliProfile?.fullName || "Tali"}
                                        </div>
                                        {msg.content}
                                        <div className="text-[10px] mt-1 opacity-70 text-right">
                                            {format(new Date(msg.createdAt), "HH:mm", { locale: tr })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="p-3 border-t mt-auto">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        disabled={sendMessageMutation.isPending}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={sendMessageMutation.isPending}>
                        {sendMessageMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </div>
        </Card>
    );
}
