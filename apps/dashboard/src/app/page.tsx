export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">CheckPoint</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-300 hover:text-white transition px-4 py-2">
                Entrar
              </button>
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2.5 rounded-full font-medium hover:opacity-90 transition shadow-lg shadow-purple-500/25">
                Criar conta
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Plataforma de networking para eventos</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Conexoes que
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"> transformam </span>
              eventos
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Descubra quem esta no mesmo evento que voce. Faca check-in, envie interacoes e
              conecte-se com pessoas que compartilham seus interesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-xl">
                Comecar agora
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition backdrop-blur-sm">
                Ver demonstracao
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Usuarios ativos' },
              { value: '500+', label: 'Eventos realizados' },
              { value: '50K+', label: 'Conexoes feitas' },
              { value: '98%', label: 'Satisfacao' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 backdrop-blur-sm border-y border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Tudo que voce precisa para eventos incriveis
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Ferramentas poderosas para organizadores e participantes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m12-3.8a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ),
                  title: 'Match Contextual',
                  description: 'Conecte pessoas com interesses similares automaticamente durante o evento.',
                  color: 'from-pink-500 to-rose-500',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  ),
                  title: 'Check-in por QR Code',
                  description: 'Check-in instantaneo com QR code ou GPS. Simples e sem filas.',
                  color: 'from-purple-500 to-indigo-500',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: 'Analytics em Tempo Real',
                  description: 'Dashboard completo com metricas de engajamento e presenca.',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                  title: 'Chat Privado',
                  description: 'Converse com seus matches de forma segura dentro do app.',
                  color: 'from-emerald-500 to-teal-500',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  ),
                  title: 'Notificacoes Push',
                  description: 'Seja notificado quando alguem demonstrar interesse em voce.',
                  color: 'from-orange-500 to-amber-500',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'Privacidade Total',
                  description: 'Suas intencoes sao secretas ate que haja um match mutuo.',
                  color: 'from-red-500 to-pink-500',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition group"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para revolucionar seus eventos?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Junte-se a milhares de organizadores que ja usam CheckPoint para criar experiencias memoraveis.
            </p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-xl">
              Criar conta gratuita
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-white">CheckPoint</span>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-500">
                <a href="#" className="hover:text-white transition">Termos</a>
                <a href="#" className="hover:text-white transition">Privacidade</a>
                <a href="#" className="hover:text-white transition">Contato</a>
              </div>
              <p className="text-sm text-gray-500">2024 CheckPoint. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
