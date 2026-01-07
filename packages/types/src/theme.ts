// Theme Types

import { InteractionType } from './user';

export type ThemeId =
  | 'romantic'
  | 'professional'
  | 'social'
  | 'party'
  | 'networking'
  | 'fitness'
  | 'tech'
  | 'cultural'
  | 'outdoor'
  | 'custom';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  emoji: string;
  defaultInteractions: InteractionType[];
  matchMessage: string;
}

export const THEMES: Record<ThemeId, Theme> = {
  romantic: {
    id: 'romantic',
    name: 'Encontros',
    description: 'Eventos focados em encontros e paquera',
    primaryColor: '#FF6B6B',
    secondaryColor: '#FFE3E3',
    emoji: '💕',
    defaultInteractions: ['fire', 'champagne'],
    matchMessage: 'Vocês combinaram! Que tal um drink?',
  },
  professional: {
    id: 'professional',
    name: 'Profissional',
    description: 'Eventos corporativos e de carreira',
    primaryColor: '#4A90D9',
    secondaryColor: '#E3F2FD',
    emoji: '💼',
    defaultInteractions: ['handshake', 'briefcase'],
    matchMessage: 'Conexão profissional feita! Hora de trocar LinkedIn.',
  },
  social: {
    id: 'social',
    name: 'Social',
    description: 'Encontros casuais e amizades',
    primaryColor: '#66BB6A',
    secondaryColor: '#E8F5E9',
    emoji: '🎉',
    defaultInteractions: ['highfive', 'champagne'],
    matchMessage: 'Nova amizade desbloqueada!',
  },
  party: {
    id: 'party',
    name: 'Festa',
    description: 'Festas e eventos noturnos',
    primaryColor: '#AB47BC',
    secondaryColor: '#F3E5F5',
    emoji: '🎊',
    defaultInteractions: ['fire', 'champagne', 'highfive'],
    matchMessage: 'Match na pista! Bora dançar?',
  },
  networking: {
    id: 'networking',
    name: 'Networking',
    description: 'Eventos de networking e conexões',
    primaryColor: '#5C6BC0',
    secondaryColor: '#E8EAF6',
    emoji: '🤝',
    defaultInteractions: ['handshake', 'briefcase', 'target'],
    matchMessage: 'Networking de sucesso! Hora de conversar.',
  },
  fitness: {
    id: 'fitness',
    name: 'Fitness',
    description: 'Eventos esportivos e de bem-estar',
    primaryColor: '#26A69A',
    secondaryColor: '#E0F2F1',
    emoji: '💪',
    defaultInteractions: ['highfive', 'target'],
    matchMessage: 'Parceiro de treino encontrado!',
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    description: 'Eventos de tecnologia e startups',
    primaryColor: '#42A5F5',
    secondaryColor: '#E3F2FD',
    emoji: '💻',
    defaultInteractions: ['handshake', 'briefcase', 'highfive'],
    matchMessage: 'Dev match! Hora do pair programming?',
  },
  cultural: {
    id: 'cultural',
    name: 'Cultural',
    description: 'Eventos culturais e artísticos',
    primaryColor: '#FFCA28',
    secondaryColor: '#FFF8E1',
    emoji: '🎨',
    defaultInteractions: ['highfive', 'champagne'],
    matchMessage: 'Almas criativas se encontraram!',
  },
  outdoor: {
    id: 'outdoor',
    name: 'Outdoor',
    description: 'Eventos ao ar livre e aventura',
    primaryColor: '#8BC34A',
    secondaryColor: '#F1F8E9',
    emoji: '🏕️',
    defaultInteractions: ['highfive', 'carona'],
    matchMessage: 'Parceiro de aventura encontrado!',
  },
  custom: {
    id: 'custom',
    name: 'Personalizado',
    description: 'Tema customizado pelo organizador',
    primaryColor: '#9E9E9E',
    secondaryColor: '#F5F5F5',
    emoji: '✨',
    defaultInteractions: ['fire', 'handshake', 'highfive'],
    matchMessage: 'É match!',
  },
};
