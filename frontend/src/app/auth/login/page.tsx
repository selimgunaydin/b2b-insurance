'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      localStorage.setItem('token', res.data.access_token);
      
      // Fetch profile to check role and redirect accordingly
      const profileRes = await api.get('/user/profile');
      const user = profileRes.data;

      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login failed', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      if (error.response?.status === 401 && error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 403) {
        setError('Hesabınız henüz onaylanmamıştır. Lütfen yönetici onayını bekleyiniz.');
      } else {
        setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Branding & Visuals */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-blue-900/90"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Shield className="h-8 w-8 text-indigo-400" />
            <span>B2B Sigorta</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Sigorta İşlemleriniz İçin Modern Çözüm
          </h1>
          <p className="text-lg text-indigo-200">
            Tali acenteler ve sigorta şirketleri için geliştirilmiş, hızlı, güvenli ve kullanıcı dostu B2B platformu.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-indigo-300" />
              </div>
              <span className="text-indigo-100">Hızlı Teklif Oluşturma</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-indigo-300" />
              </div>
              <span className="text-indigo-100">Anlık Komisyon Takibi</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-indigo-300" />
              </div>
              <span className="text-indigo-100">7/24 Destek</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-indigo-300">
          © 2024 B2B Sigorta Platformu. Tüm hakları saklıdır.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Hoş Geldiniz</h2>
            <p className="text-gray-500">Hesabınıza giriş yaparak devam edin</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta Adresi</FormLabel>
                    <FormControl>
                      <Input placeholder="ornek@sirket.com" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Şifre</FormLabel>
                      <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Şifremi Unuttum
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-lg" disabled={isLoading}>
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">veya</span>
            </div>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">Hesabınız yok mu? </span>
            <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Hemen Başvurun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
