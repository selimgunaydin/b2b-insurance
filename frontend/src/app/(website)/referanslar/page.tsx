import { Building2, Shield, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Referanslar | B2B Sigorta",
  description: "B2B Sigorta referansları ve iş ortaklarımız.",
};

const partners = [
  { name: "Anadolu Sigorta", type: "Sigorta Şirketi" },
  { name: "Allianz Sigorta", type: "Sigorta Şirketi" },
  { name: "Axa Sigorta", type: "Sigorta Şirketi" },
  { name: "HDI Sigorta", type: "Sigorta Şirketi" },
  { name: "Mapfre Sigorta", type: "Sigorta Şirketi" },
  { name: "Zurich Sigorta", type: "Sigorta Şirketi" },
];

export default function ReferencesPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Referanslarımız</h1>
          <p className="text-xl text-gray-600">
            Türkiye'nin önde gelen sigorta şirketleri ile çalışıyoruz
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold mb-2">15+</div>
              <p className="text-gray-600">Sigorta Şirketi</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <p className="text-gray-600">Aktif Tali</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold mb-2">10.000+</div>
              <p className="text-gray-600">Tamamlanan Poliçe</p>
            </CardContent>
          </Card>
        </div>

        {/* Partners Grid */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">İş Ortaklarımız</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {partners.map((partner, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">{partner.name}</h3>
                  <p className="text-sm text-gray-500">{partner.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardContent className="p-8 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
              <blockquote className="text-lg italic mb-4">
                "B2B Sigorta platformu sayesinde iş süreçlerimiz çok daha hızlandı. 
                Müşterilerimize daha kaliteli hizmet sunabiliyoruz."
              </blockquote>
              <p className="font-semibold">Ahmet Yılmaz</p>
              <p className="text-sm text-gray-600">Tali Sigortacı, İstanbul</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
