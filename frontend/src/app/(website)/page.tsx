import Link from "next/link";
import { Shield, Zap, Users, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Fetch CMS content on server side
async function getCmsContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/cms/category/HOME`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    
    // Convert array to object for easy access
    const content: Record<string, string> = {};
    data.forEach((item: { key: string; value: string }) => {
      content[item.key] = item.value;
    });
    return content;
  } catch (error) {
    console.error("Failed to fetch CMS content:", error);
    return null;
  }
}

async function getSeoContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/cms/category/SEO`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    
    const content: Record<string, string> = {};
    data.forEach((item: { key: string; value: string }) => {
      content[item.key] = item.value;
    });
    return content;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoContent();
  
  return {
    title: seo?.seo_title || "B2B Sigorta | Dijital Sigorta Platformu",
    description: seo?.seo_description || "Tali ve sigorta şirketleri için modern B2B sigorta yönetim platformu. Hızlı, güvenli ve kolay.",
    keywords: seo?.seo_keywords || "sigorta, b2b, tali, poliçe, dijital sigorta",
  };
}

export default async function HomePage() {
  const cms = await getCmsContent();
  
  // Default values if CMS content is not available
  const heroTitle = cms?.hero_title || "Dijital Sigorta Platformu";
  const heroSubtitle = cms?.hero_subtitle || "Tali ve sigorta şirketleri için modern, hızlı ve güvenli çözüm";
  const heroCtaPrimary = cms?.hero_cta_primary || "Hemen Başla";
  const heroCtaSecondary = cms?.hero_cta_secondary || "İletişime Geç";
  
  const featuresTitle = cms?.features_title || "Neden B2B Sigorta?";
  const featuresSubtitle = cms?.features_subtitle || "Modern teknoloji ile sigorta süreçlerinizi kolaylaştırın";
  
  const feature1Title = cms?.feature_1_title || "Hızlı İşlemler";
  const feature1Desc = cms?.feature_1_description || "Poliçe oluşturma ve yönetim süreçlerinizi dakikalar içinde tamamlayın";
  const feature2Title = cms?.feature_2_title || "Güvenli Platform";
  const feature2Desc = cms?.feature_2_description || "Verileriniz en yüksek güvenlik standartlarıyla korunur";
  const feature3Title = cms?.feature_3_title || "Kolay Yönetim";
  const feature3Desc = cms?.feature_3_description || "Müşterilerinizi ve poliçelerinizi tek bir platformdan yönetin";
  const feature4Title = cms?.feature_4_title || "Ödül Sistemi";
  const feature4Desc = cms?.feature_4_description || "Hedeflerinizi tamamlayarak ödüller kazanın";
  
  const ctaTitle = cms?.cta_title || "Hemen Başlayın";
  const ctaSubtitle = cms?.cta_subtitle || "Dijital dönüşümünüzü bugün başlatın, farkı hemen görün";
  const ctaButton = cms?.cta_button || "Ücretsiz Dene";

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20 md:py-32"
        style={cms?.hero_background ? { backgroundImage: `url(${cms.hero_background})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {cms?.hero_background && <div className="absolute inset-0 bg-black/50" />}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  {heroCtaPrimary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/iletisim">
                <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
                  {heroCtaSecondary}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuresTitle}</h2>
            <p className="text-xl text-gray-600">{featuresSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg">{feature1Title}</h3>
                <p className="text-sm text-gray-600">{feature1Desc}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">{feature2Title}</h3>
                <p className="text-sm text-gray-600">{feature2Desc}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{feature3Title}</h3>
                <p className="text-sm text-gray-600">{feature3Desc}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">{feature4Title}</h3>
                <p className="text-sm text-gray-600">{feature4Desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">{ctaTitle}</h2>
            <p className="text-xl text-gray-600">{ctaSubtitle}</p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                {ctaButton}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
