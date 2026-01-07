import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Default themes data
const DEFAULT_THEMES = [
  {
    id: 'romantic',
    name: 'Romance',
    description: 'Para encontros românticos e dates',
    primaryColor: '#FF6B6B',
    secondaryColor: '#FF85A1',
    emoji: '💕',
    defaultInteractions: ['fire', 'highfive', 'champagne'],
    matchMessage: 'É Match! 💕',
  },
  {
    id: 'professional',
    name: 'Profissional',
    description: 'Para networking e conexões de negócios',
    primaryColor: '#2D3748',
    secondaryColor: '#4A5568',
    emoji: '💼',
    defaultInteractions: ['handshake', 'briefcase', 'target'],
    matchMessage: 'Conexão feita! 🤝',
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Para fazer novas amizades e conexões casuais',
    primaryColor: '#6366F1',
    secondaryColor: '#8B5CF6',
    emoji: '🎉',
    defaultInteractions: ['fire', 'handshake', 'highfive', 'champagne'],
    matchMessage: 'Nova conexão! 🎉',
  },
  {
    id: 'party',
    name: 'Festa',
    description: 'Para festas e eventos de celebração',
    primaryColor: '#F59E0B',
    secondaryColor: '#EF4444',
    emoji: '🪩',
    defaultInteractions: ['fire', 'highfive', 'champagne', 'ticket'],
    matchMessage: 'Bora curtir! 🪩',
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Para eventos de networking profissional',
    primaryColor: '#0D9488',
    secondaryColor: '#059669',
    emoji: '🤝',
    defaultInteractions: ['handshake', 'briefcase', 'highfive'],
    matchMessage: 'Vamos conectar! 🤝',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Para eventos esportivos e academia',
    primaryColor: '#EF4444',
    secondaryColor: '#F97316',
    emoji: '💪',
    defaultInteractions: ['highfive', 'fire', 'carona'],
    matchMessage: 'Bora treinar! 💪',
  },
  {
    id: 'tech',
    name: 'Tech/Startup',
    description: 'Para eventos de tecnologia e startups',
    primaryColor: '#3B82F6',
    secondaryColor: '#6366F1',
    emoji: '💻',
    defaultInteractions: ['handshake', 'briefcase', 'highfive', 'fire'],
    matchMessage: 'Let\'s build! 🚀',
  },
  {
    id: 'cultural',
    name: 'Cultural',
    description: 'Para eventos culturais e artísticos',
    primaryColor: '#8B5CF6',
    secondaryColor: '#D946EF',
    emoji: '🎭',
    defaultInteractions: ['highfive', 'fire', 'champagne'],
    matchMessage: 'Arte conecta! 🎭',
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    description: 'Para eventos ao ar livre e aventuras',
    primaryColor: '#22C55E',
    secondaryColor: '#16A34A',
    emoji: '🏕️',
    defaultInteractions: ['highfive', 'carona', 'fire'],
    matchMessage: 'Bora explorar! 🏕️',
  },
  {
    id: 'custom',
    name: 'Customizado',
    description: 'Tema personalizado pelo organizador',
    primaryColor: '#7C3AED',
    secondaryColor: '#D946EF',
    emoji: '✨',
    defaultInteractions: ['fire', 'handshake', 'highfive', 'champagne', 'briefcase', 'target', 'carona', 'ticket'],
    matchMessage: 'Match! ✨',
  },
];

@Injectable()
export class ThemesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedThemes();
  }

  async seedThemes() {
    for (const theme of DEFAULT_THEMES) {
      await this.prisma.theme.upsert({
        where: { id: theme.id },
        update: theme,
        create: theme,
      });
    }
    console.log(`✓ Seeded ${DEFAULT_THEMES.length} themes`);
  }

  async findAll() {
    return this.prisma.theme.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.theme.findUnique({
      where: { id },
    });
  }

  async getDefaultInteractions(themeId: string): Promise<string[]> {
    const theme = await this.findOne(themeId);
    return theme?.defaultInteractions || ['fire', 'handshake', 'highfive'];
  }

  async getMatchMessage(themeId: string): Promise<string> {
    const theme = await this.findOne(themeId);
    return theme?.matchMessage || 'Match! ✨';
  }
}
