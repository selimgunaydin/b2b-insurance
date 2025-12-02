import React from 'react';

export default function KvkkPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">KVKK Aydınlatma Metni</h1>
      
      <div className="prose max-w-none">
        <p>
          <strong>Veri Sorumlusu:</strong> B2B Sigorta Platformu
        </p>
        
        <h2 className="text-xl font-semibold mt-4">1. Kişisel Verilerin İşlenme Amacı</h2>
        <p>
          Kişisel verileriniz, sigorta tekliflerinin oluşturulması, poliçe işlemlerinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.
        </p>

        <h2 className="text-xl font-semibold mt-4">2. Kişisel Verilerin Toplanma Yöntemi</h2>
        <p>
          Verileriniz, platformumuz üzerinden doldurduğunuz formlar, yüklediğiniz belgeler ve dijital kanallar aracılığıyla toplanmaktadır.
        </p>

        <h2 className="text-xl font-semibold mt-4">3. Haklarınız</h2>
        <p>
          KVKK'nın 11. maddesi uyarınca, verilerinizin işlenip işlenmediğini öğrenme, düzeltme talep etme ve silinmesini isteme hakkına sahipsiniz.
        </p>
        
        <p className="mt-8 text-sm text-gray-500">
          Bu metin bilgilendirme amaçlıdır. Detaylı bilgi için bizimle iletişime geçebilirsiniz.
        </p>
      </div>
    </div>
  );
}
