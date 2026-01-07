/* eslint-disable @next/next/no-img-element */

// Design Tokens from CheckPoint Design System
const colors = {
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  secondary: '#D946EF',
  accent: '#22D3EE',
  success: '#10B981',
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
      {/* Background Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
          style={{ background: colors.primary, top: '-200px', left: '-200px' }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
          style={{ background: colors.secondary, bottom: '-200px', right: '-200px' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-12">
          <div className="text-center max-w-3xl">
            {/* Logo */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  boxShadow: `0 8px 32px rgba(124, 58, 237, 0.4)`,
                  animation: 'float 3s ease-in-out infinite'
                }}
              >
                <img src="/logo.svg" alt="CheckPoint" width={50} height={50} />
              </div>
              <span
                className="text-5xl font-extrabold bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
              >
                CheckPoint
              </span>
            </div>

            {/* Tagline */}
            <p className="text-xl mb-4" style={{ color: colors.textSecondary }}>
              Encontre. Conecte. Reencontre.
            </p>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Nunca mais perca<br/>
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)` }}
              >
                uma conexao
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl mb-10 leading-relaxed" style={{ color: colors.textSecondary }}>
              Descubra quem esta nos mesmos eventos que voce e reconecte
              com as pessoas que encontrou. Networking que realmente funciona.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                className="px-8 py-4 rounded-2xl font-semibold text-lg text-white transition-all hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  boxShadow: `0 4px 14px rgba(124, 58, 237, 0.4)`
                }}
              >
                📱 Baixar App
              </button>
              <button
                className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-white/10"
                style={{ border: `2px solid ${colors.primary}`, color: colors.primary }}
              >
                Saiba mais
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6" style={{ background: colors.bgSurface }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-4">Como funciona</h2>
            <p className="text-center mb-16" style={{ color: colors.textSecondary }}>
              Tres passos para nunca mais perder uma conexao
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div
                className="p-8 rounded-3xl transition-all hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20"
                style={{ background: colors.bgCard, border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
                  style={{ background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.accent} 100%)` }}
                >
                  📍
                </div>
                <h3 className="text-2xl font-bold mb-3">Check-in Social</h3>
                <p style={{ color: colors.textSecondary }} className="leading-relaxed">
                  Chegou no evento? Faca check-in e mostre que voce esta la.
                  QR Code ou GPS - voce escolhe.
                </p>
              </div>

              {/* Feature 2 */}
              <div
                className="p-8 rounded-3xl transition-all hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20"
                style={{ background: colors.bgCard, border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
                  style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, #3B82F6 100%)` }}
                >
                  👀
                </div>
                <h3 className="text-2xl font-bold mb-3">Discovery</h3>
                <p style={{ color: colors.textSecondary }} className="leading-relaxed">
                  Veja quem esta no mesmo lugar que voce. Encontre conexoes em comum
                  e descubra pessoas interessantes.
                </p>
              </div>

              {/* Feature 3 */}
              <div
                className="p-8 rounded-3xl transition-all hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20"
                style={{ background: colors.bgCard, border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, #EF4444 100%)` }}
                >
                  🤝
                </div>
                <h3 className="text-2xl font-bold mb-3">ReMatch</h3>
                <p style={{ color: colors.textSecondary }} className="leading-relaxed">
                  Conheceu alguem mas nao pegou contato? Reconecte ate 7 dias
                  depois pelo evento em comum.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mockup Section */}
        <section className="py-24 px-6" style={{ background: colors.bgDark }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Content */}
              <div className="flex-1">
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white mb-6"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)` }}
                >
                  ✨ Novo
                </span>
                <h2 className="text-4xl font-extrabold mb-6 leading-tight">
                  Networking que funciona de verdade
                </h2>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.textSecondary }}>
                  70% das conexoes feitas em eventos se perdem. Com o CheckPoint,
                  voce pode reconectar com quem encontrou mesmo sem ter trocado contato na hora.
                </p>
                <ul className="space-y-4">
                  {[
                    'Veja quem esta no evento em tempo real',
                    'Descubra conexoes em comum',
                    'Reconecte ate 7 dias depois',
                    'Integrado com Instagram',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span style={{ color: colors.success }}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phone Mockup */}
              <div className="flex-shrink-0">
                <div
                  className="w-[300px] h-[620px] rounded-[40px] p-3"
                  style={{ background: '#000', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
                >
                  <div
                    className="w-full h-full rounded-[32px] overflow-hidden relative"
                    style={{ background: colors.bgDark }}
                  >
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-[20px] z-10" />

                    {/* Content */}
                    <div className="pt-12 px-5 h-full overflow-auto">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-5">
                        <span
                          className="text-xl font-extrabold bg-clip-text text-transparent"
                          style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                        >
                          CheckPoint
                        </span>
                        <div
                          className="w-9 h-9 rounded-full"
                          style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)` }}
                        />
                      </div>

                      {/* Check-in Card */}
                      <div
                        className="rounded-2xl p-5 mb-5 text-white"
                        style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                      >
                        <div className="text-xs opacity-80 tracking-wide mb-2">📍 VOCE ESTA EM</div>
                        <div className="text-lg font-bold mb-1">Tech Meetup SP</div>
                        <div className="text-sm opacity-80 mb-4">Ha 45 min · 🌐 Publico</div>
                        <div className="flex items-center justify-between">
                          <div className="flex">
                            {[0,1,2,3].map(i => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full border-2 border-white/30"
                                style={{ background: colors.bgCard, marginLeft: i > 0 ? '-8px' : 0 }}
                              />
                            ))}
                          </div>
                          <span className="font-semibold">👥 47 pessoas</span>
                        </div>
                      </div>

                      {/* Section */}
                      <div className="text-sm font-semibold mb-3" style={{ color: colors.textSecondary }}>
                        Acontecendo agora
                      </div>

                      {/* Event Cards */}
                      {[
                        { name: 'Yoga no Parque', distance: '800m', people: 23, gradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)` },
                        { name: 'Happy Hour Dev', distance: '1.2km', people: 15, gradient: `linear-gradient(135deg, ${colors.primary} 0%, #3B82F6 100%)` },
                      ].map((event, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden mb-3" style={{ background: colors.bgCard }}>
                          <div className="h-20" style={{ background: event.gradient }} />
                          <div className="p-3">
                            <div className="font-semibold text-sm">{event.name}</div>
                            <div className="text-xs" style={{ color: colors.textSecondary }}>
                              📍 {event.distance} · 👥 {event.people} pessoas
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 px-6" style={{ background: colors.bgSurface }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-4">Simples assim</h2>
            <p className="text-center mb-16" style={{ color: colors.textSecondary }}>
              Em 4 passos voce esta conectando
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              {[
                { step: 1, title: 'Baixe o app', desc: 'Crie sua conta com Instagram em segundos' },
                { step: 2, title: 'Faca check-in', desc: 'Marque presenca no evento ou local' },
                { step: 3, title: 'Descubra pessoas', desc: 'Veja quem esta la e conexoes em comum' },
                { step: 4, title: 'Conecte', desc: 'ReMatch com quem voce encontrou' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="text-center max-w-[200px]">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold text-white mx-auto mb-4"
                      style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                    >
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>{item.desc}</p>
                  </div>
                  {i < 3 && (
                    <span className="text-3xl hidden md:block" style={{ color: colors.primary }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 px-6" style={{ background: colors.bgDark }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-16">
              {[
                { value: '10K+', label: 'Conexoes feitas' },
                { value: '500+', label: 'Eventos' },
                { value: '95%', label: 'Satisfacao' },
                { value: '4.8', label: 'App Store' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div
                    className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ color: colors.textSecondary }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-24 px-6 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4">
              Pronto para nunca mais perder uma conexao?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Baixe o CheckPoint agora e comece a fazer networking de verdade.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:-translate-y-1"
                style={{
                  background: 'white',
                  color: colors.primary,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                }}
              >
                🍎 App Store
              </button>
              <button
                className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-white/10"
                style={{ border: '2px solid white' }}
              >
                🤖 Google Play
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 text-center" style={{ background: colors.bgSurface }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
            >
              <img src="/logo.svg" alt="CheckPoint" width={24} height={24} />
            </div>
            <span className="text-xl font-bold">CheckPoint</span>
          </div>
          <div className="flex gap-8 justify-center flex-wrap mb-6">
            {['Sobre', 'Para Organizadores', 'Blog', 'Privacidade', 'Termos', 'Contato'].map((link, i) => (
              <a
                key={i}
                href="#"
                className="text-sm transition-colors hover:text-purple-400"
                style={{ color: colors.textSecondary }}
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            © 2024 CheckPoint. Todos os direitos reservados.
          </p>
        </footer>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
}
