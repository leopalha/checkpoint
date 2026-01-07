'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Users, Check, X, Search, Download } from 'lucide-react';

import { eventsApi } from '@/lib/api';

interface Attendee {
  id: string;
  name: string;
  instagramUsername: string;
  profilePicture: string | null;
  confirmedAt: string;
  checkedInAt: string | null;
  intentions: string[];
  interactions: {
    sent: number;
    received: number;
  };
  matches: number;
}

const INTENTION_INFO: Record<string, { emoji: string; label: string }> = {
  fire: { emoji: '🔥', label: 'Paquera' },
  handshake: { emoji: '🤝', label: 'Networking' },
  highfive: { emoji: '✋', label: 'Amizade' },
  carona: { emoji: '🚗', label: 'Carona' },
  ticket: { emoji: '🎟️', label: 'Ingresso' },
  champagne: { emoji: '🍾', label: 'Rolê' },
  briefcase: { emoji: '💼', label: 'Negócios' },
  target: { emoji: '🎯', label: 'Objetivo' },
};

export default function AttendeesPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'checked_in' | 'confirmed'>('all');

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const fetchAttendees = async () => {
    try {
      const data = await eventsApi.getAttendees(eventId);
      setAttendees(data);
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(search.toLowerCase()) ||
      attendee.instagramUsername.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'checked_in' && attendee.checkedInAt) ||
      (filter === 'confirmed' && !attendee.checkedInAt);

    return matchesSearch && matchesFilter;
  });

  const checkedInCount = attendees.filter((a) => a.checkedInAt).length;

  const exportToCSV = () => {
    const headers = ['Nome', 'Instagram', 'Confirmado em', 'Check-in', 'Intenções', 'Interações Enviadas', 'Interações Recebidas', 'Matches'];
    const rows = attendees.map((a) => [
      a.name,
      `@${a.instagramUsername}`,
      format(new Date(a.confirmedAt), 'dd/MM/yyyy HH:mm'),
      a.checkedInAt ? format(new Date(a.checkedInAt), 'dd/MM/yyyy HH:mm') : 'Não',
      a.intentions.map((i) => INTENTION_INFO[i]?.label || i).join(', '),
      a.interactions.sent,
      a.interactions.received,
      a.matches,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `participantes-${eventId}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/events/${eventId}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Participantes</h1>
            <p className="text-gray-500">
              {attendees.length} confirmado{attendees.length !== 1 ? 's' : ''} · {checkedInCount} check-in{checkedInCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou Instagram..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({attendees.length})
            </button>
            <button
              onClick={() => setFilter('checked_in')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'checked_in'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Check-in ({checkedInCount})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'confirmed'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aguardando ({attendees.length - checkedInCount})
            </button>
          </div>
        </div>
      </div>

      {/* Attendees List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intenções
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Atividade
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAttendees.map((attendee) => (
              <tr key={attendee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {attendee.profilePicture ? (
                      <img
                        src={attendee.profilePicture}
                        alt={attendee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{attendee.name}</p>
                      <p className="text-sm text-gray-500">@{attendee.instagramUsername}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {attendee.checkedInAt ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Check className="w-3 h-3" />
                        Check-in
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(attendee.checkedInAt), "HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      <X className="w-3 h-3" />
                      Aguardando
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {attendee.intentions.map((intention) => (
                      <span key={intention} className="text-lg" title={INTENTION_INFO[intention]?.label}>
                        {INTENTION_INFO[intention]?.emoji || '❓'}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">
                      <span className="font-medium">{attendee.interactions.sent}</span> enviadas
                    </span>
                    <span className="text-gray-600">
                      <span className="font-medium">{attendee.interactions.received}</span> recebidas
                    </span>
                    <span className="text-pink-600">
                      <span className="font-medium">{attendee.matches}</span> matches
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAttendees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum participante encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
