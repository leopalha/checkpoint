'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

import { eventsApi } from '@/lib/api';

const THEMES = [
  { id: 'social', emoji: '🎉', name: 'Social' },
  { id: 'party', emoji: '🪩', name: 'Festa' },
  { id: 'romantic', emoji: '💕', name: 'Romântico' },
  { id: 'professional', emoji: '💼', name: 'Profissional' },
  { id: 'networking', emoji: '🤝', name: 'Networking' },
  { id: 'fitness', emoji: '💪', name: 'Fitness' },
  { id: 'tech', emoji: '💻', name: 'Tech' },
  { id: 'cultural', emoji: '🎭', name: 'Cultural' },
  { id: 'outdoor', emoji: '🏕️', name: 'Outdoor' },
];

const INTERACTIONS = [
  { id: 'fire', emoji: '🔥', name: 'Paquera' },
  { id: 'handshake', emoji: '🤝', name: 'Networking' },
  { id: 'highfive', emoji: '✋', name: 'Amizade' },
  { id: 'carona', emoji: '🚗', name: 'Carona' },
  { id: 'ticket', emoji: '🎟️', name: 'Ingresso' },
  { id: 'champagne', emoji: '🍾', name: 'Rolê' },
  { id: 'briefcase', emoji: '💼', name: 'Negócios' },
  { id: 'target', emoji: '🎯', name: 'Objetivo' },
];

const eventSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().min(1, 'Data de fim é obrigatória'),
  locationName: z.string().min(1, 'Nome do local é obrigatório'),
  locationAddress: z.string().min(1, 'Endereço é obrigatório'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  themeId: z.string().default('social'),
  allowedInteractions: z.array(z.string()).min(1, 'Selecione pelo menos uma interação'),
  gpsRadius: z.number().min(200).max(5000).default(500),
});

type EventForm = z.infer<typeof eventSchema>;

export default function NewEventPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      themeId: 'social',
      allowedInteractions: ['fire', 'handshake', 'highfive'],
      gpsRadius: 500,
      latitude: -23.5505,
      longitude: -46.6333,
    },
  });

  const selectedTheme = watch('themeId');
  const selectedInteractions = watch('allowedInteractions') || [];

  const toggleInteraction = (id: string) => {
    const current = selectedInteractions;
    if (current.includes(id)) {
      setValue('allowedInteractions', current.filter((i) => i !== id));
    } else {
      setValue('allowedInteractions', [...current, id]);
    }
  };

  const onSubmit = async (data: EventForm) => {
    setLoading(true);
    setError('');

    try {
      const event = await eventsApi.createEvent({
        ...data,
        imageUrl: data.imageUrl || undefined,
        description: data.description || undefined,
      });
      router.push(`/events/${event.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Novo Evento</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Informações básicas</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do evento
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Festa de Fim de Ano"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Descreva seu evento..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da imagem (opcional)
            </label>
            <input
              {...register('imageUrl')}
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Data e horário</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Início
              </label>
              <input
                {...register('startDate')}
                type="datetime-local"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fim
              </label>
              <input
                {...register('endDate')}
                type="datetime-local"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Local</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do local
            </label>
            <input
              {...register('locationName')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Club XYZ"
            />
            {errors.locationName && (
              <p className="mt-1 text-sm text-red-600">{errors.locationName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço completo
            </label>
            <input
              {...register('locationAddress')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Rua, número, bairro, cidade"
            />
            {errors.locationAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.locationAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                {...register('latitude', { valueAsNumber: true })}
                type="number"
                step="any"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                {...register('longitude', { valueAsNumber: true })}
                type="number"
                step="any"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raio GPS para check-in (metros)
            </label>
            <input
              {...register('gpsRadius', { valueAsNumber: true })}
              type="number"
              min={200}
              max={5000}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">Mínimo: 200m, Máximo: 5000m</p>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Tema do evento</h2>

          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setValue('themeId', theme.id)}
                className={`p-4 rounded-lg border-2 text-center transition ${
                  selectedTheme === theme.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl block mb-1">{theme.emoji}</span>
                <span className="text-sm font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Tipos de interação permitidos</h2>
          <p className="text-sm text-gray-500">
            Selecione quais tipos de interação os participantes podem usar
          </p>

          <div className="grid grid-cols-4 gap-3">
            {INTERACTIONS.map((interaction) => (
              <button
                key={interaction.id}
                type="button"
                onClick={() => toggleInteraction(interaction.id)}
                className={`p-3 rounded-lg border-2 text-center transition ${
                  selectedInteractions.includes(interaction.id)
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl block mb-1">{interaction.emoji}</span>
                <span className="text-xs font-medium">{interaction.name}</span>
              </button>
            ))}
          </div>
          {errors.allowedInteractions && (
            <p className="text-sm text-red-600">{errors.allowedInteractions.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Link
            href="/events"
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-center font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}
