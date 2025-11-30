import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Antigravity InsurTech",
  description: "B2B Insurance Platform",
};

import { Toaster } from "@/components/ui/toaster";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <WhatsAppButton />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
