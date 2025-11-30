import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">B2B Sigorta</span>
            </div>
            <p className="text-sm">
              Tali ve sigorta şirketleri için modern dijital platform
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="hover:text-indigo-400 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/referanslar" className="hover:text-indigo-400 transition-colors">
                  Referanslar
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-indigo-400 transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hizmetler</h3>
            <ul className="space-y-2 text-sm">
              <li>Trafik Sigortası</li>
              <li>Kasko Sigortası</li>
              <li>Sağlık Sigortası</li>
              <li>DASK</li>
              <li>Konut Sigortası</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +90 XXX XXX XX XX
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@b2bsigorta.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                İstanbul, Türkiye
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} B2B Sigorta. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
