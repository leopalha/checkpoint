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

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
  companyName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');

    try {
      const response = await organizerApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
      });
      setAuth(response.accessToken, response.organizer);
      router.push('/events');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao criar conta');
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
          style={{ background: colors.secondary, top: '-100px', right: '-100px' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[150px] opacity-20"
          style={{ background: colors.primary, bottom: '10%', left: '10%' }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[150px] opacity-15"
          style={{ background: colors.accent, top: '50%', left: '30%' }}
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
            Comece a criar{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)` }}
            >
              eventos memoráveis
            </span>
          </h1>

          <p className="text-lg mb-8" style={{ color: colors.textSecondary }}>
            Cadastre-se gratuitamente e tenha acesso a todas as ferramentas
            para transformar seus eventos em experiências únicas.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              { icon: '✨', text: 'Eventos ilimitados' },
              { icon: '📊', text: 'Analytics completos' },
              { icon: '🎫', text: 'QR Code para check-in' },
              { icon: '💬', text: 'Suporte dedicado' },
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: colors.bgCard }}
                >
                  {benefit.icon}
                </div>
                <span style={{ color: colors.textSecondary }}>{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div
            className="mt-10 p-4 rounded-2xl flex items-center gap-4"
            style={{ background: colors.bgCard, border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex -space-x-2">
              {[colors.primary, colors.secondary, colors.accent].map((color, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2"
                  style={{ background: color, borderColor: colors.bgCard }}
                />
              ))}
            </div>
            <div>
              <div className="font-semibold" style={{ color: colors.textPrimary }}>+500 organizadores</div>
              <div className="text-sm" style={{ color: colors.textMuted }}>já usam o CheckPoint</div>
            </div>
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
              Criar conta grátis
            </h2>
            <p style={{ color: colors.textSecondary }}>
              Comece a gerenciar seus eventos em minutos
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Nome completo
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: colors.bgCard,
                    border: `1px solid ${errors.name ? colors.error : 'rgba(255,255,255,0.05)'}`,
                    color: colors.textPrimary,
                  }}
                  placeholder="Seu nome"
                />
                {errors.name && (
                  <p className="mt-1 text-xs" style={{ color: colors.error }}>{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Empresa <span style={{ color: colors.textMuted }}>(opcional)</span>
                </label>
                <input
                  {...register('companyName')}
                  type="text"
                  className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: colors.bgCard,
                    border: '1px solid rgba(255,255,255,0.05)',
                    color: colors.textPrimary,
                  }}
                  placeholder="Sua empresa"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2"
                style={{
                  background: colors.bgCard,
                  border: `1px solid ${errors.email ? colors.error : 'rgba(255,255,255,0.05)'}`,
                  color: colors.textPrimary,
                }}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: colors.error }}>{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Senha
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: colors.bgCard,
                    border: `1px solid ${errors.password ? colors.error : 'rgba(255,255,255,0.05)'}`,
                    color: colors.textPrimary,
                  }}
                  placeholder="Mín. 8 caracteres"
                />
                {errors.password && (
                  <p className="mt-1 text-xs" style={{ color: colors.error }}>{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Confirmar senha
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: colors.bgCard,
                    border: `1px solid ${errors.confirmPassword ? colors.error : 'rgba(255,255,255,0.05)'}`,
                    color: colors.textPrimary,
                  }}
                  placeholder="Confirme a senha"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs" style={{ color: colors.error }}>{errors.confirmPassword.message}</p>
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
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta grátis
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="font-semibold hover:underline"
                style={{ color: colors.primary }}
              >
                Fazer login
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-8" style={{ color: colors.textMuted }}>
            Ao criar sua conta, você concorda com os{' '}
            <a href="#" className="underline hover:no-underline">Termos de Uso</a>
            {' '}e{' '}
            <a href="#" className="underline hover:no-underline">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
}
