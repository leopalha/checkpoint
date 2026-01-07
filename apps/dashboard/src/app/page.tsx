export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📍</span>
            <h1 className="text-xl font-bold text-gray-900">
              CheckPoint Dashboard
            </h1>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
            Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Gerencie seus eventos com CheckPoint
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Acompanhe presenças, check-ins e matches em tempo real.
            Obtenha insights valiosos sobre seu público.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition">
              Criar conta
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition">
              Saiba mais
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <span className="text-4xl">📊</span>
            <h3 className="text-lg font-semibold mt-4 text-gray-900">
              Dashboard em tempo real
            </h3>
            <p className="text-gray-600 mt-2">
              Veja confirmações, check-ins e matches acontecendo ao vivo.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <span className="text-4xl">🎫</span>
            <h3 className="text-lg font-semibold mt-4 text-gray-900">
              QR Code de check-in
            </h3>
            <p className="text-gray-600 mt-2">
              Gere QR codes únicos para check-in rápido no evento.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <span className="text-4xl">🎨</span>
            <h3 className="text-lg font-semibold mt-4 text-gray-900">
              Temas personalizados
            </h3>
            <p className="text-gray-600 mt-2">
              Escolha o tema ideal para o tipo do seu evento.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>CheckPoint Dashboard v0.1.0</p>
        </div>
      </footer>
    </main>
  );
}
