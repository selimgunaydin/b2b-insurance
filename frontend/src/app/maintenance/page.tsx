import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <Wrench className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Bakım Modu</h1>
        <p className="text-gray-600">
          Sizlere daha iyi hizmet verebilmek için sistemimizde bakım çalışması yapıyoruz. Lütfen daha sonra tekrar deneyiniz.
        </p>
        <div className="text-sm text-gray-400 pt-4 border-t">
          B2B Sigorta Platformu
        </div>
      </div>
    </div>
  );
}
