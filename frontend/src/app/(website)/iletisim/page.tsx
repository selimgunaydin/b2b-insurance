import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Fetch CMS content on server side
async function getCmsContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/cms/category/CONTACT`, {
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
  title: "İletişim | B2B Sigorta",
  description: "B2B Sigorta ile iletişime geçin. Size yardımcı olmaktan mutluluk duyarız.",
};

export default async function ContactPage() {
  const cms = await getCmsContent();
  
  const title = cms?.contact_title || "İletişim";
  const subtitle = cms?.contact_subtitle || "Size yardımcı olmaktan mutluluk duyarız";
  const phone = cms?.contact_phone || "+90 XXX XXX XX XX";
  const email = cms?.contact_email || "info@b2bsigorta.com";
  const address = cms?.contact_address || "İstanbul, Türkiye";
  const workingHours = cms?.contact_working_hours || "Pazartesi - Cuma: 09:00 - 18:00";
  const mapEmbed = cms?.contact_map_embed;

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-gray-600">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Telefon</h3>
                    <p className="text-gray-600">{phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">E-posta</h3>
                    <p className="text-gray-600">{email}</p>
                    <p className="text-sm text-gray-500 mt-1">24 saat içinde yanıt veriyoruz</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Adres</h3>
                    <p className="text-gray-600">{address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Çalışma Saatleri</h3>
                    <p className="text-gray-600">{workingHours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Embed */}
            {mapEmbed && (
              <div 
                className="rounded-lg overflow-hidden h-64"
                dangerouslySetInnerHTML={{ __html: mapEmbed }}
              />
            )}
          </div>

          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" placeholder="Adınız ve soyadınız" />
                </div>

                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" type="email" placeholder="ornek@email.com" />
                </div>

                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" type="tel" placeholder="+90 XXX XXX XX XX" />
                </div>

                <div>
                  <Label htmlFor="message">Mesajınız</Label>
                  <Textarea
                    id="message"
                    placeholder="Mesajınızı buraya yazın..."
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Send className="mr-2 h-4 w-4" />
                  Gönder
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
