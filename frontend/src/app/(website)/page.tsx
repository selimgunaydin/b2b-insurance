import Link from "next/link";
import { Shield, Zap, Users, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "B2B Sigorta | Dijital Sigorta Platformu",
  description: "Tali ve sigorta şirketleri için modern B2B sigorta yönetim platformu. Hızlı, güvenli ve kolay.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Dijital Sigorta Platformu
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100">
              Tali ve sigorta şirketleri için modern, hızlı ve güvenli çözüm
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/iletisim">
                <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
                  İletişime Geç
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden B2B Sigorta?</h2>
            <p className="text-xl text-gray-600">Modern teknoloji ile sigorta süreçlerinizi kolaylaştırın</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg">Hızlı İşlemler</h3>
                <p className="text-sm text-gray-600">
                  Poliçe oluşturma ve yönetim süreçlerinizi dakikalar içinde tamamlayın
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Güvenli Platform</h3>
                <p className="text-sm text-gray-600">
                  Verileriniz en yüksek güvenlik standartlarıyla korunur
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Kolay Yönetim</h3>
                <p className="text-sm text-gray-600">
                  Müşterilerinizi ve poliçelerinizi tek bir platformdan yönetin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">Ödül Sistemi</h3>
                <p className="text-sm text-gray-600">
                  Hedeflerinizi tamamlayarak ödüller kazanın
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Hemen Başlayın</h2>
            <p className="text-xl text-gray-600">
              Dijital dönüşümünüzü bugün başlatın, farkı hemen görün
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Ücretsiz Dene
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
