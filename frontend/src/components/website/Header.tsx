"use client";

import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">B2B Sigorta</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-indigo-600 transition-colors">
            Ana Sayfa
          </Link>
          <Link href="/hakkimizda" className="text-sm font-medium hover:text-indigo-600 transition-colors">
            Hakkımızda
          </Link>
          <Link href="/referanslar" className="text-sm font-medium hover:text-indigo-600 transition-colors">
            Referanslar
          </Link>
          <Link href="/iletisim" className="text-sm font-medium hover:text-indigo-600 transition-colors">
            İletişim
          </Link>
          <Link
            href="/auth/login"
            className="ml-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Giriş Yap
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t bg-white px-4 py-4 space-y-4">
          <Link href="/" className="block text-sm font-medium hover:text-indigo-600">
            Ana Sayfa
          </Link>
          <Link href="/hakkimizda" className="block text-sm font-medium hover:text-indigo-600">
            Hakkımızda
          </Link>
          <Link href="/referanslar" className="block text-sm font-medium hover:text-indigo-600">
            Referanslar
          </Link>
          <Link href="/iletisim" className="block text-sm font-medium hover:text-indigo-600">
            İletişim
          </Link>
          <Link
            href="/auth/login"
            className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 text-center"
          >
            Giriş Yap
          </Link>
        </nav>
      )}
    </header>
  );
}
