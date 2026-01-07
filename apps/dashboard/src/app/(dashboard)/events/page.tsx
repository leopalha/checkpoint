'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Calendar, MapPin, Users, Zap, Heart } from 'lucide-react';

import { eventsApi } from '@/lib/api';

interface Event {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  locationName: string;
  themeId: string;
  stats: {
    presences: number;
    interactions: number;
    matches: number;
  };
}

const THEME_EMOJIS: Record<string, string> = {
  romantic: '💕',
  professional: '💼',
  social: '🎉',
  party: '🪩',
  networking: '🤝',
  fitness: '💪',
  tech: '💻',
  cultural: '🎭',
  outdoor: '🏕️',
  custom: '✨',
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getMyEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(
    (e) => new Date(e.startDate) > new Date()
  );
  const pastEvents = events.filter(
    (e) => new Date(e.endDate) < new Date()
  );
  const activeEvents = events.filter(
    (e) => new Date(e.startDate) <= new Date() && new Date(e.endDate) >= new Date()
  );

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Eventos</h1>
          <p className="text-gray-600 mt-1">
            {events.length} evento{events.length !== 1 ? 's' : ''} cadastrado{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/events/new"
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          <Plus className="w-5 h-5" />
          Novo Evento
        </Link>
      </div>

      {/* Stats Overview */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                <p className="text-sm text-gray-500">Total de eventos</p>
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
                  {events.reduce((sum, e) => sum + e.stats.presences, 0)}
                </p>
                <p className="text-sm text-gray-500">Presenças confirmadas</p>
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
                  {events.reduce((sum, e) => sum + e.stats.interactions, 0)}
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
                  {events.reduce((sum, e) => sum + e.stats.matches, 0)}
                </p>
                <p className="text-sm text-gray-500">Matches</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Eventos Ativos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEvents.map((event) => (
              <EventCard key={event.id} event={event} active />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Próximos Eventos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Eventos Passados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} past />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">📅</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum evento ainda
          </h3>
          <p className="text-gray-600 mb-6">
            Crie seu primeiro evento e comece a receber participantes
          </p>
          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="w-5 h-5" />
            Criar primeiro evento
          </Link>
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  active,
  past,
}: {
  event: Event;
  active?: boolean;
  past?: boolean;
}) {
  return (
    <Link
      href={`/events/${event.id}`}
      className={`block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition ${
        past ? 'opacity-75' : ''
      }`}
    >
      {/* Image or Theme Emoji */}
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
          <span className="text-6xl">
            {THEME_EMOJIS[event.themeId] || '📅'}
          </span>
        </div>
      )}

      <div className="p-4">
        {active && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full mb-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Ao vivo
          </span>
        )}

        <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
          <Calendar className="w-4 h-4" />
          {format(new Date(event.startDate), "d 'de' MMMM, HH:mm", { locale: ptBR })}
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4" />
          {event.locationName}
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {event.stats.presences}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Zap className="w-4 h-4" />
            {event.stats.interactions}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Heart className="w-4 h-4" />
            {event.stats.matches}
          </div>
        </div>
      </div>
    </Link>
  );
}
