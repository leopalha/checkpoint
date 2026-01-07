'use client';

import Link from 'next/link';
import Image from 'next/image';

// Design Tokens from CheckPoint Design System
const colors = {
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  secondary: '#D946EF',
  accent: '#22D3EE',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  bgDark: '#0F0F1A',
  bgSurface: '#1A1A2E',
  bgCard: '#252542',
  textPrimary: '#F8FAFC',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
};

export default function Home() {
  return (
    <main className="min-h-screen font-sans" style={{ background: colors.bgDark, color: colors.textPrimary }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(15, 15, 26, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
            >
              <Image src="/logo.svg" alt="CheckPoint" width={24} height={24} />
            </div>
            <span className="text-xl font-bold">CheckPoint Dashboard</span>
          </div>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-[150px] opacity-20"
          style={{ background: colors.primary, top: '-300px', left: '-200px' }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-15"
          style={{ background: colors.secondary, top: '40%', right: '-200px' }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-10"
          style={{ background: colors.accent, bottom: '-200px', left: '30%' }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
                style={{ background: 'rgba(124, 58, 237, 0.15)', color: colors.primary, border: `1px solid ${colors.primary}30` }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.success }} />
                Plataforma para Organizadores
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
                Gerencie seus eventos com{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                >
                  inteligência
                </span>
              </h1>

              <p className="text-xl leading-relaxed mb-10" style={{ color: colors.textSecondary }}>
                Acompanhe presenças, check-ins e matches em tempo real.
                Obtenha insights valiosos sobre seu público e maximize o engajamento dos seus eventos.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-2xl font-semibold text-lg text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/30 flex items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    boxShadow: `0 4px 20px rgba(124, 58, 237, 0.4)`
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Criar conta grátis
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-white/5 flex items-center gap-2"
                  style={{ border: `2px solid rgba(255,255,255,0.1)` }}
                >
                  Saiba mais
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-8 mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: colors.success }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Setup em 5 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: colors.success }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: colors.success }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Cancele quando quiser</span>
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div
                className="rounded-3xl p-1 relative"
                style={{ background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}40 100%)` }}
              >
                <div className="rounded-[22px] overflow-hidden" style={{ background: colors.bgSurface }}>
                  {/* Browser Header */}
                  <div className="flex items-center gap-2 px-4 py-3" style={{ background: colors.bgCard, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 rounded-md text-xs" style={{ background: colors.bgSurface, color: colors.textMuted }}>
                        dashboard.checkpoint.app/eventos
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {[
                        { label: 'Check-ins', value: '847', change: '+12%', color: colors.success },
                        { label: 'Confirmados', value: '1,234', change: '+8%', color: colors.primary },
                        { label: 'Matches', value: '156', change: '+24%', color: colors.secondary },
                        { label: 'Interações', value: '2.4K', change: '+18%', color: colors.accent },
                      ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-xl" style={{ background: colors.bgCard }}>
                          <div className="text-xs mb-1" style={{ color: colors.textMuted }}>{stat.label}</div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-xs font-medium" style={{ color: stat.color }}>{stat.change}</div>
                        </div>
                      ))}
                    </div>

                    {/* Chart Area */}
                    <div className="p-4 rounded-xl mb-4" style={{ background: colors.bgCard }}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold">Check-ins por hora</span>
                        <span className="text-xs px-2 py-1 rounded" style={{ background: colors.bgSurface, color: colors.textSecondary }}>Hoje</span>
                      </div>
                      <div className="flex items-end gap-2 h-32">
                        {[40, 65, 45, 80, 95, 100, 85, 70, 90, 75, 60, 50].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t transition-all"
                            style={{
                              height: `${h}%`,
                              background: i === 5 ? `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 100%)` : colors.bgSurface,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs" style={{ color: colors.textMuted }}>
                        <span>18h</span>
                        <span>19h</span>
                        <span>20h</span>
                        <span>21h</span>
                        <span>22h</span>
                        <span>23h</span>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl" style={{ background: colors.bgCard }}>
                        <div className="text-xs mb-3" style={{ color: colors.textMuted }}>Top Intenções</div>
                        <div className="space-y-2">
                          {[
                            { emoji: '🔥', label: 'Interesse', pct: 45 },
                            { emoji: '🤝', label: 'Networking', pct: 30 },
                            { emoji: '✋', label: 'Amizade', pct: 25 },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span>{item.emoji}</span>
                              <div className="flex-1 h-2 rounded-full" style={{ background: colors.bgSurface }}>
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${item.pct}%`,
                                    background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                                  }}
                                />
                              </div>
                              <span className="text-xs" style={{ color: colors.textMuted }}>{item.pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: colors.bgCard }}>
                        <div className="text-xs mb-3" style={{ color: colors.textMuted }}>QR Code do Evento</div>
                        <div className="flex items-center justify-center">
                          <div className="w-24 h-24 rounded-lg flex items-center justify-center" style={{ background: 'white' }}>
                            <div className="grid grid-cols-5 gap-1 p-2">
                              {Array(25).fill(0).map((_, i) => (
                                <div key={i} className="w-3 h-3 rounded-sm" style={{ background: Math.random() > 0.5 ? '#000' : 'transparent' }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div
                className="absolute -right-4 top-20 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
                style={{ background: colors.bgCard, border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.accent} 100%)` }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm">Novo check-in!</div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>Agora mesmo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32" style={{ background: colors.bgSurface }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`, color: colors.secondary }}
            >
              Recursos Poderosos
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
              Tudo que você precisa para{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}>
                eventos incríveis
              </span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
              Ferramentas completas para criar, gerenciar e analisar seus eventos com precisão profissional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'Dashboard em tempo real',
                description: 'Acompanhe check-ins, matches e engajamento enquanto seu evento acontece.',
                gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              },
              {
                icon: '🎫',
                title: 'QR Code de check-in',
                description: 'Gere QR codes únicos para check-in rápido e seguro dos participantes.',
                gradient: `linear-gradient(135deg, ${colors.success} 0%, ${colors.accent} 100%)`,
              },
              {
                icon: '🎨',
                title: 'Temas personalizados',
                description: 'Escolha entre 10 temas que definem as intenções disponíveis no seu evento.',
                gradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.error} 100%)`,
              },
              {
                icon: '📈',
                title: 'Analytics detalhados',
                description: 'Entenda seu público com métricas de engajamento, conversão e retenção.',
                gradient: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
              },
              {
                icon: '🔔',
                title: 'Notificações push',
                description: 'Envie avisos e atualizações diretamente para os participantes do evento.',
                gradient: `linear-gradient(135deg, ${colors.warning} 0%, ${colors.error} 100%)`,
              },
              {
                icon: '📤',
                title: 'Exportar dados',
                description: 'Baixe relatórios em CSV com todos os dados dos participantes e métricas.',
                gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10"
                style={{ background: colors.bgCard, border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform"
                  style={{ background: feature.gradient }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 py-32" style={{ background: colors.bgDark }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
              Comece em{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}>
                3 passos simples
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Crie sua conta',
                description: 'Registre-se gratuitamente em menos de 1 minuto com email e senha.',
              },
              {
                step: '02',
                title: 'Configure seu evento',
                description: 'Adicione nome, data, local, tema e configure as opções de check-in.',
              },
              {
                step: '03',
                title: 'Compartilhe o QR',
                description: 'Imprima ou exiba o QR code e acompanhe tudo em tempo real.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div
                  className="text-8xl font-extrabold mb-6 bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary}30 0%, ${colors.secondary}30 100%)` }}
                >
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
                  {item.description}
                </p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 -right-4 text-4xl" style={{ color: colors.primary }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-24" style={{ background: colors.bgSurface }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Eventos criados' },
              { value: '50K+', label: 'Check-ins realizados' },
              { value: '10K+', label: 'Matches gerados' },
              { value: '98%', label: 'Satisfação' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-5xl lg:text-6xl font-extrabold mb-2 bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                >
                  {stat.value}
                </div>
                <div className="text-lg" style={{ color: colors.textSecondary }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
        />
        <div className="absolute inset-0" style={{ background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            Pronto para transformar seus eventos?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de organizadores que já estão usando o CheckPoint para criar experiências memoráveis.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:-translate-y-1 hover:shadow-xl flex items-center gap-2"
              style={{ background: 'white', color: colors.primary }}
            >
              Começar agora - É grátis
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-white/10"
              style={{ border: '2px solid white' }}
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16" style={{ background: colors.bgDark, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                >
                  <Image src="/logo.svg" alt="CheckPoint" width={24} height={24} />
                </div>
                <span className="text-xl font-bold">CheckPoint</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                A plataforma completa para organizadores de eventos criarem experiências de networking memoráveis.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              © 2026 CheckPoint. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn', 'Instagram', 'GitHub'].map((social, i) => (
                <a key={i} href="#" className="text-sm transition-colors hover:text-white" style={{ color: colors.textSecondary }}>
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
