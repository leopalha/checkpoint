'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { organizerApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

// Design Tokens
const colors = {
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  secondary: '#D946EF',
  accent: '#22D3EE',
  success: '#10B981',
  error: '#EF4444',
  bgDark: '#0F0F1A',
  bgSurface: '#1A1A2E',
  bgCard: '#252542',
  textPrimary: '#F8FAFC',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
};

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');

    try {
      const response = await organizerApi.login(data);
      setAuth(response.accessToken, response.organizer);
      router.push('/events');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: colors.bgDark }}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Effects */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-30"
          style={{ background: colors.primary, top: '-100px', left: '-100px' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[150px] opacity-20"
          style={{ background: colors.secondary, bottom: '10%', right: '10%' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
            >
              <Image src="/logo.svg" alt="CheckPoint" width={32} height={32} />
            </div>
            <span className="text-3xl font-bold" style={{ color: colors.textPrimary }}>CheckPoint</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight mb-6" style={{ color: colors.textPrimary }}>
            A plataforma completa para{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
            >
              eventos incríveis
            </span>
          </h1>

          <p className="text-lg mb-8" style={{ color: colors.textSecondary }}>
            Gerencie presenças, check-ins e conexões em tempo real.
            Transforme seus eventos em experiências memoráveis.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: '📊', text: 'Dashboard em tempo real' },
              { icon: '🎫', text: 'Check-in por QR Code' },
              { icon: '📈', text: 'Analytics detalhados' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: colors.bgCard }}
                >
                  {feature.icon}
                </div>
                <span style={{ color: colors.textSecondary }}>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12" style={{ background: colors.bgSurface }}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
            >
              <Image src="/logo.svg" alt="CheckPoint" width={28} height={28} />
            </div>
            <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>CheckPoint</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              Bem-vindo de volta
            </h2>
            <p style={{ color: colors.textSecondary }}>
              Faça login para acessar seu dashboard
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                style={{ background: `${colors.error}15`, border: `1px solid ${colors.error}30`, color: colors.error }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: colors.bgCard,
                    border: `1px solid ${errors.email ? colors.error : 'rgba(255,255,255,0.05)'}`,
                    color: colors.textPrimary,
                  }}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm flex items-center gap-1" style={{ color: colors.error }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Senha
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full px-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: colors.bgCard,
                    border: `1px solid ${errors.password ? colors.error : 'rgba(255,255,255,0.05)'}`,
                    color: colors.textPrimary,
                  }}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-2 text-sm flex items-center gap-1" style={{ color: colors.error }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                boxShadow: `0 4px 20px rgba(124, 58, 237, 0.4)`,
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4" style={{ background: colors.bgSurface, color: colors.textMuted }}>ou</span>
              </div>
            </div>

            <p className="text-center" style={{ color: colors.textSecondary }}>
              Não tem uma conta?{' '}
              <Link
                href="/register"
                className="font-semibold hover:underline"
                style={{ color: colors.primary }}
              >
                Criar conta grátis
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-8" style={{ color: colors.textMuted }}>
            Ao entrar, você concorda com os{' '}
            <a href="#" className="underline hover:no-underline">Termos de Uso</a>
            {' '}e{' '}
            <a href="#" className="underline hover:no-underline">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
}
