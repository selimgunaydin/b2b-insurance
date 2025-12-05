import { Shield, Target, Users, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Fetch CMS content on server side
async function getCmsContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/cms/category/ABOUT`, {
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
    console.error("Failed to fetch CMS content:", error);
    return null;
  }
}

export const metadata = {
  title: "Hakkımızda | B2B Sigorta",
  description: "B2B Sigorta hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz.",
};

export default async function AboutPage() {
  const cms = await getCmsContent();
  
  const title = cms?.about_title || "Hakkımızda";
  const text = cms?.about_text || "B2B Sigorta, tali sigortacılar ve sigorta şirketleri arasında köprü görevi gören modern bir dijital platformdur.";
  const vision = cms?.about_vision || "Türkiye'nin en büyük ve en güvenilir B2B sigorta platformu olmak";
  const mission = cms?.about_mission || "Sigorta sektöründe dijital dönüşüme öncülük ederek, süreçleri hızlandırmak ve kolaylaştırmak";
  const image = cms?.about_image;

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">{title}</h1>
        
        {image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img src={image} alt={title} className="w-full h-64 object-cover" />
          </div>
        )}
        
        <div className="prose prose-lg max-w-none space-y-6 mb-16">
          <p className="text-xl text-gray-600 text-center">
            {text}
          </p>
          
          <p>
            2024 yılında kurulan B2B Sigorta, sigorta sektöründeki dijital dönüşüme öncülük etmek misyonuyla yola çıktı. 
            Platformumuz, tali sigortacıların iş süreçlerini kolaylaştırırken, müşterilerine daha hızlı ve kaliteli hizmet 
            sunmalarını sağlar.
          </p>

          <p>
            Modern teknolojiler kullanarak geliştirdiğimiz sistemimiz, poliçe oluşturma, müşteri yönetimi, komisyon takibi 
            ve raporlama gibi tüm süreçleri tek bir platformda toplar. Böylece tali sigortacılar, zamanlarını daha verimli 
            kullanabilir ve işlerini büyütebilirler.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-lg">Misyonumuz</h3>
              <p className="text-sm text-gray-600">
                {mission}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Vizyonumuz</h3>
              <p className="text-sm text-gray-600">
                {vision}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Değerlerimiz</h3>
              <p className="text-sm text-gray-600">
                Güvenilirlik, şeffaflık, müşteri memnuniyeti ve sürekli gelişim
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
