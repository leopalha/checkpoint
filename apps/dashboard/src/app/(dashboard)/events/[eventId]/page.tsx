'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Zap,
  Heart,
  QrCode,
  Trash2,
  Edit,
  RefreshCw,
  Download,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { eventsApi } from '@/lib/api';

const INTERACTION_COLORS: Record<string, string> = {
  fire: '#EF4444',
  handshake: '#3B82F6',
  highfive: '#10B981',
  carona: '#F59E0B',
  ticket: '#8B5CF6',
  champagne: '#EC4899',
  briefcase: '#6366F1',
  target: '#14B8A6',
};

const INTERACTION_LABELS: Record<string, string> = {
  fire: 'Paquera',
  handshake: 'Networking',
  highfive: 'Amizade',
  carona: 'Carona',
  ticket: 'Ingresso',
  champagne: 'Rolê',
  briefcase: 'Negócios',
  target: 'Objetivo',
};

interface EventStats {
  event: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  counts: {
    confirmed: number;
    checkedIn: number;
    interactions: number;
    matches: number;
    revealedMatches: number;
  };
  interactionsByType: { type: string; count: number }[];
  hourlyCheckIns: { hour: string; count: number }[];
  // Computed metrics
  conversionMetrics?: {
    confirmToCheckin: number;
    interactionToMatch: number;
    matchToReveal: number;
    avgInteractionsPerUser: number;
  };
}

interface Event {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  locationName: string;
  locationAddress: string;
  themeId: string;
  gpsRadius: number;
  qrCode: string | null;
  allowedInteractions: string[];
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, statsData] = await Promise.all([
          eventsApi.getEventById(eventId),
          eventsApi.getEventStats(eventId),
        ]);
        setEvent(eventData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    setDeleting(true);
    try {
      await eventsApi.deleteEvent(eventId);
      router.push('/events');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Erro ao excluir evento');
    } finally {
      setDeleting(false);
    }
  };

  const handleRegenerateQR = async () => {
    setRegenerating(true);
    try {
      const { qrCode } = await eventsApi.regenerateQRCode(eventId);
      setEvent((prev) => prev ? { ...prev, qrCode } : null);
    } catch (error) {
      alert('Erro ao regenerar QR code');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!event || !stats) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Evento não encontrado</p>
        <Link href="/events" className="text-primary-600 hover:underline">
          Voltar para eventos
        </Link>
      </div>
    );
  }

  const isActive =
    new Date(event.startDate) <= new Date() &&
    new Date(event.endDate) >= new Date();
  const isPast = new Date(event.endDate) < new Date();

  const checkInRate = stats.counts.confirmed > 0
    ? Math.round((stats.counts.checkedIn / stats.counts.confirmed) * 100)
    : 0;

  const matchRate = stats.counts.interactions > 0
    ? Math.round((stats.counts.matches / stats.counts.interactions) * 100)
    : 0;

  const revealRate = stats.counts.matches > 0
    ? Math.round((stats.counts.revealedMatches / stats.counts.matches) * 100)
    : 0;

  const avgInteractions = stats.counts.checkedIn > 0
    ? (stats.counts.interactions / stats.counts.checkedIn).toFixed(1)
    : '0';

  const handleExportData = () => {
    const csvData = [
      ['Métrica', 'Valor'],
      ['Confirmados', stats.counts.confirmed],
      ['Check-ins', stats.counts.checkedIn],
      ['Taxa de Check-in', `${checkInRate}%`],
      ['Interações', stats.counts.interactions],
      ['Matches', stats.counts.matches],
      ['Taxa de Match', `${matchRate}%`],
      ['Matches Revelados', stats.counts.revealedMatches],
      ['Taxa de Revelação', `${revealRate}%`],
      ['Média de Interações/Usuário', avgInteractions],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.name.replace(/\s+/g, '_')}_stats.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <Link
            href={`/events/${eventId}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>

      {/* Event Info */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              {isActive && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full mb-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Evento ao vivo
                </span>
              )}
              {isPast && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full mb-2">
                  Encerrado
                </span>
              )}

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {event.name}
              </h1>

              {event.description && (
                <p className="text-gray-600 mb-4">{event.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(event.startDate), "d 'de' MMMM, HH:mm", { locale: ptBR })}
                  {' - '}
                  {format(new Date(event.endDate), "HH:mm", { locale: ptBR })}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.locationName}
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <div className="bg-gray-100 p-4 rounded-lg mb-2">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 font-mono mb-1">
                {event.qrCode?.slice(0, 8)}...
              </p>
              <button
                onClick={handleRegenerateQR}
                disabled={regenerating}
                className="text-xs text-primary-600 hover:underline flex items-center gap-1 mx-auto"
              >
                <RefreshCw className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`} />
                Regenerar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.counts.confirmed}
              </p>
              <p className="text-sm text-gray-500">Confirmados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.counts.checkedIn}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  ({checkInRate}%)
                </span>
              </p>
              <p className="text-sm text-gray-500">Check-ins</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.counts.interactions}
              </p>
              <p className="text-sm text-gray-500">Interações</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.counts.matches}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  ({matchRate}% rate)
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Matches ({stats.counts.revealedMatches} revelados)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          Funil de Conversão
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{checkInRate}%</p>
            <p className="text-sm text-gray-500 mt-1">Confirmação → Check-in</p>
            <p className="text-xs text-gray-400">{stats.counts.checkedIn}/{stats.counts.confirmed}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">{avgInteractions}</p>
            <p className="text-sm text-gray-500 mt-1">Interações por Usuário</p>
            <p className="text-xs text-gray-400">{stats.counts.interactions} total</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-pink-600">{matchRate}%</p>
            <p className="text-sm text-gray-500 mt-1">Taxa de Match</p>
            <p className="text-xs text-gray-400">{stats.counts.matches} matches</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{revealRate}%</p>
            <p className="text-sm text-gray-500 mt-1">Taxa de Revelação</p>
            <p className="text-xs text-gray-400">{stats.counts.revealedMatches} revelados</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Hourly Check-ins */}
        {stats.hourlyCheckIns.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Check-ins por hora
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.hourlyCheckIns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(value) =>
                    format(new Date(value), 'HH:mm')
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    format(new Date(value as string), 'HH:mm')
                  }
                />
                <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Interactions by Type */}
        {stats.interactionsByType.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Interações por tipo
            </h3>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.interactionsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="count"
                  >
                    {stats.interactionsByType.map((entry) => (
                      <Cell
                        key={entry.type}
                        fill={INTERACTION_COLORS[entry.type] || '#9CA3AF'}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {stats.interactionsByType.map((entry) => (
                  <div key={entry.type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          INTERACTION_COLORS[entry.type] || '#9CA3AF',
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      {INTERACTION_LABELS[entry.type] || entry.type}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {entry.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendees Link */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Lista de Participantes</h3>
            <p className="text-sm text-gray-500">
              {stats.counts.confirmed} confirmados, {stats.counts.checkedIn} com check-in
            </p>
          </div>
          <Link
            href={`/events/${eventId}/attendees`}
            className="text-primary-600 hover:underline font-medium"
          >
            Ver todos
          </Link>
        </div>
      </div>
    </div>
  );
}
