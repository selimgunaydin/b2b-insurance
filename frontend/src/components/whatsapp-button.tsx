"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppButton() {
  const phoneNumber = "905312343329"; // Replace with actual number
  const message = "Merhaba, sigorta teklifi hakkında bilgi almak istiyorum.";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className="rounded-full w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] shadow-lg p-0 flex items-center justify-center transition-transform hover:scale-110"
      >
        <MessageCircle className="h-8 w-8 text-white" />
      </Button>
    </div>
  );
}
