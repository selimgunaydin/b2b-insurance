import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "B2B Sigorta | Dijital Sigorta Platformu",
  description: "Tali ve sigorta şirketleri için modern B2B sigorta yönetim platformu",
};

import { Toaster } from "@/components/ui/toaster";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { MaintenanceCheck } from "@/components/maintenance-check";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <MaintenanceCheck>
            {children}
            <WhatsAppButton />
          </MaintenanceCheck>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
