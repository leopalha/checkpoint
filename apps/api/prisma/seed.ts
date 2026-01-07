import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.presence.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.interactionType.deleteMany();
  await prisma.theme.deleteMany();

  // Create Interaction Types (8 tipos conforme documentação)
  const interactionTypes = await Promise.all([
    prisma.interactionType.create({
      data: {
        id: 'fire',
        name: 'Interesse',
        emoji: '🔥',
        description: 'Interesse romântico forte',
      },
    }),
    prisma.interactionType.create({
      data: {
        id: 'handshake',
        name: 'Networking',
        emoji: '🤝',
        description: 'Interesse profissional/networking',
      },
    }),
    prisma.interactionType.create({
      data: {
        id: 'highfive',
        name: 'Amizade',
        emoji: '✋',
        description: 'Quer ser amigo(a)',
      },
    }),
    prisma.interactionType.create({
      data: {
        id: 'carona',
        name: 'Carona',
        emoji: '🚗',
        description: 'Oferece ou procura carona',
      },
    }),
    prisma.interactionType.create({
      data: {
        id: 'ticket',
        name: 'Ingresso',
        emoji: '🎫',
        description: 'Tem ou procura ingresso',
      },
    }),
    prisma.interactionType.create({
      data: {
        id: 'champagne',
        name: 'Drinks',
        emoji: '🍾',
        description: 'Quer tomar uma bebida junto',
      },
    }),
    prisma.interactionType.create({
      data: {
        id: 'briefcase',
        name: 'Proposta',
        emoji: '💼',
        description: 'Tem uma proposta de negócio',
      },
    }),
    prisma.interactionType.create({
      data: {
        id: 'target',
        name: 'Objetivo',
        emoji: '🎯',
        description: 'Tem um objetivo específico',
      },
    }),
  ]);

  console.log(`Created ${interactionTypes.length} interaction types`);

  // Create Themes
  const themes = await Promise.all([
    prisma.theme.create({
      data: {
        id: 'social',
        name: 'Social',
        description: 'Eventos sociais e festas',
        primaryColor: '#7C3AED',
        secondaryColor: '#A855F7',
        emoji: '🎉',
        defaultInteractions: ['fire', 'handshake', 'highfive'],
        matchMessage: 'Vocês combinam! Hora de se conhecer melhor.',
      },
    }),
    prisma.theme.create({
      data: {
        id: 'party',
        name: 'Festa',
        description: 'Festas e baladas',
        primaryColor: '#EC4899',
        secondaryColor: '#F472B6',
        emoji: '🪩',
        defaultInteractions: ['fire', 'highfive'],
        matchMessage: 'Match! A festa ficou ainda melhor.',
      },
    }),
    prisma.theme.create({
      data: {
        id: 'romantic',
        name: 'Romance',
        description: 'Eventos focados em romance',
        primaryColor: '#EF4444',
        secondaryColor: '#F87171',
        emoji: '💕',
        defaultInteractions: ['fire', 'champagne'],
        matchMessage: 'Faísca mútua! Quem sabe rola?',
      },
    }),
    prisma.theme.create({
      data: {
        id: 'professional',
        name: 'Profissional',
        description: 'Eventos corporativos e de negócios',
        primaryColor: '#3B82F6',
        secondaryColor: '#60A5FA',
        emoji: '💼',
        defaultInteractions: ['handshake'],
        matchMessage: 'Conexão profissional estabelecida!',
      },
    }),
    prisma.theme.create({
      data: {
        id: 'networking',
        name: 'Networking',
        description: 'Eventos de networking',
        primaryColor: '#10B981',
        secondaryColor: '#34D399',
        emoji: '🤝',
        defaultInteractions: ['handshake', 'highfive'],
        matchMessage: 'Nova conexão na rede!',
      },
    }),
    prisma.theme.create({
      data: {
        id: 'tech',
        name: 'Tech',
        description: 'Eventos de tecnologia',
        primaryColor: '#6366F1',
        secondaryColor: '#818CF8',
        emoji: '💻',
        defaultInteractions: ['handshake', 'highfive'],
        matchMessage: 'Parece que vocês falam a mesma linguagem!',
      },
    }),
    prisma.theme.create({
      data: {
        id: 'fitness',
        name: 'Fitness',
        description: 'Eventos esportivos e de fitness',
        primaryColor: '#F59E0B',
        secondaryColor: '#FBBF24',
        emoji: '💪',
        defaultInteractions: ['highfive', 'fire'],
        matchMessage: 'Bora treinar juntos?',
      },
    }),
    prisma.theme.create({
      data: {
        id: 'cultural',
        name: 'Cultural',
        description: 'Eventos culturais e artísticos',
        primaryColor: '#8B5CF6',
        secondaryColor: '#A78BFA',
        emoji: '🎭',
        defaultInteractions: ['highfive', 'champagne'],
        matchMessage: 'Parece que vocês curtem as mesmas coisas!',
      },
    }),
    prisma.theme.create({
      data: {
        id: 'outdoor',
        name: 'Outdoor',
        description: 'Eventos ao ar livre',
        primaryColor: '#059669',
        secondaryColor: '#10B981',
        emoji: '🏕️',
        defaultInteractions: ['highfive', 'fire', 'carona'],
        matchMessage: 'Aventureiros! Bora explorar juntos?',
      },
    }),
    prisma.theme.create({
      data: {
        id: 'music',
        name: 'Música',
        description: 'Shows, festivais e eventos musicais',
        primaryColor: '#DC2626',
        secondaryColor: '#EF4444',
        emoji: '🎵',
        defaultInteractions: ['fire', 'highfive', 'champagne'],
        matchMessage: 'Vocês curtem o mesmo som!',
      },
    }),
  ]);

  console.log(`Created ${themes.length} themes`);

  // Create Organizers
  const passwordHash = await bcrypt.hash('demo123', 10);

  const organizers = await Promise.all([
    prisma.organizer.create({
      data: {
        email: 'demo@checkpoint.app',
        passwordHash,
        name: 'CheckPoint Demo',
        companyName: 'CheckPoint Events',
      },
    }),
    prisma.organizer.create({
      data: {
        email: 'eventos@startup.io',
        passwordHash,
        name: 'Startup Events',
        companyName: 'Startup.io',
      },
    }),
  ]);

  console.log(`Created ${organizers.length} organizers`);

  // Create Events
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const events = await Promise.all([
    // Today/Tomorrow events
    prisma.event.create({
      data: {
        name: 'Happy Hour Tech SP',
        description: 'Encontro informal da comunidade tech de São Paulo. Venha conhecer pessoas incríveis da área!',
        imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
        startDate: new Date(tomorrow.setHours(18, 0, 0, 0)),
        endDate: new Date(tomorrow.setHours(23, 0, 0, 0)),
        locationName: 'Bar Urbano',
        locationAddress: 'Rua Augusta, 1234 - Consolação, São Paulo - SP',
        latitude: -23.5538,
        longitude: -46.6568,
        organizerId: organizers[0].id,
        themeId: 'tech',
        allowedInteractions: ['handshake', 'highfive', 'fire'],
        gpsRadius: 300,
        qrCode: `CHECKPOINT-${Date.now()}-1`,
      },
    }),
    prisma.event.create({
      data: {
        name: 'Festa de Lançamento - Summer Edition',
        description: 'A festa mais aguardada do verão está chegando! DJs convidados e open bar até 00h.',
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        startDate: new Date(tomorrow.setHours(22, 0, 0, 0)),
        endDate: new Date(new Date(tomorrow).setDate(tomorrow.getDate() + 1)),
        locationName: 'Club Vitrine',
        locationAddress: 'Rua Frei Caneca, 569 - Consolação, São Paulo - SP',
        latitude: -23.5534,
        longitude: -46.6528,
        organizerId: organizers[0].id,
        themeId: 'party',
        allowedInteractions: ['fire', 'highfive'],
        gpsRadius: 400,
        qrCode: `CHECKPOINT-${Date.now()}-2`,
      },
    }),

    // Next week events
    prisma.event.create({
      data: {
        name: 'Startup Weekend São Paulo',
        description: '54 horas para transformar sua ideia em startup. Networking, mentoria e muito código!',
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        startDate: new Date(nextWeek.setHours(18, 0, 0, 0)),
        endDate: new Date(new Date(nextWeek).setDate(nextWeek.getDate() + 2)),
        locationName: 'Google for Startups Campus',
        locationAddress: 'Rua Coronel Oscar Porto, 70 - Paraíso, São Paulo - SP',
        latitude: -23.5780,
        longitude: -46.6470,
        organizerId: organizers[1].id,
        themeId: 'networking',
        allowedInteractions: ['handshake', 'highfive'],
        gpsRadius: 500,
        qrCode: `CHECKPOINT-${Date.now()}-3`,
      },
    }),
    prisma.event.create({
      data: {
        name: 'Yoga no Parque Ibirapuera',
        description: 'Sessão gratuita de yoga ao ar livre. Traga seu mat e disposição!',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        startDate: new Date(nextWeek.setHours(7, 0, 0, 0)),
        endDate: new Date(nextWeek.setHours(9, 0, 0, 0)),
        locationName: 'Parque Ibirapuera - Portão 10',
        locationAddress: 'Av. Pedro Álvares Cabral - Moema, São Paulo - SP',
        latitude: -23.5874,
        longitude: -46.6576,
        organizerId: organizers[0].id,
        themeId: 'fitness',
        allowedInteractions: ['highfive', 'fire'],
        gpsRadius: 1000,
        qrCode: `CHECKPOINT-${Date.now()}-4`,
      },
    }),
    prisma.event.create({
      data: {
        name: 'Speed Dating - Singles Night',
        description: 'Encontre sua conexão em uma noite especial de speed dating. 10 encontros de 5 minutos cada.',
        imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800',
        startDate: new Date(nextWeek.setHours(20, 0, 0, 0)),
        endDate: new Date(nextWeek.setHours(23, 0, 0, 0)),
        locationName: 'Restaurante Skye',
        locationAddress: 'Av. Paulista, 2355 - Bela Vista, São Paulo - SP',
        latitude: -23.5558,
        longitude: -46.6620,
        organizerId: organizers[0].id,
        themeId: 'romantic',
        allowedInteractions: ['fire', 'champagne'],
        gpsRadius: 300,
        qrCode: `CHECKPOINT-${Date.now()}-5`,
      },
    }),

    // Next month events
    prisma.event.create({
      data: {
        name: 'Dev Conference BR 2025',
        description: 'A maior conferência de desenvolvedores do Brasil. Palestras, workshops e muito networking.',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        startDate: new Date(nextMonth.setHours(8, 0, 0, 0)),
        endDate: new Date(new Date(nextMonth).setDate(nextMonth.getDate() + 1)),
        locationName: 'Centro de Convenções Frei Caneca',
        locationAddress: 'Rua Frei Caneca, 569 - Consolação, São Paulo - SP',
        latitude: -23.5534,
        longitude: -46.6528,
        organizerId: organizers[1].id,
        themeId: 'tech',
        allowedInteractions: ['handshake', 'highfive'],
        gpsRadius: 800,
        qrCode: `CHECKPOINT-${Date.now()}-6`,
      },
    }),
    prisma.event.create({
      data: {
        name: 'Festival de Jazz ao Vivo',
        description: 'Uma noite de jazz com bandas locais e internacionais. Comida e bebida disponíveis.',
        imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
        startDate: new Date(nextMonth.setHours(19, 0, 0, 0)),
        endDate: new Date(nextMonth.setHours(23, 59, 0, 0)),
        locationName: 'Bourbon Street Music Club',
        locationAddress: 'Rua dos Chanés, 127 - Moema, São Paulo - SP',
        latitude: -23.6014,
        longitude: -46.6693,
        organizerId: organizers[0].id,
        themeId: 'cultural',
        allowedInteractions: ['highfive', 'champagne', 'fire'],
        gpsRadius: 400,
        qrCode: `CHECKPOINT-${Date.now()}-7`,
      },
    }),
    prisma.event.create({
      data: {
        name: 'Trilha Pico do Jaraguá',
        description: 'Trilha guiada até o ponto mais alto de São Paulo. Nível intermediário.',
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
        startDate: new Date(nextMonth.setHours(6, 0, 0, 0)),
        endDate: new Date(nextMonth.setHours(12, 0, 0, 0)),
        locationName: 'Parque Estadual do Jaraguá',
        locationAddress: 'Rua Antonio Cardoso Nogueira, 539 - Jaraguá, São Paulo - SP',
        latitude: -23.4574,
        longitude: -46.7674,
        organizerId: organizers[0].id,
        themeId: 'outdoor',
        allowedInteractions: ['highfive', 'fire'],
        gpsRadius: 2000,
        qrCode: `CHECKPOINT-${Date.now()}-8`,
      },
    }),
  ]);

  console.log(`Created ${events.length} events`);

  // Create Demo Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        instagramId: 'demo_user_1',
        instagramUsername: 'maria_silva',
        name: 'Maria Silva',
        bio: 'Designer apaixonada por UX e café ☕',
        profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
        defaultIntentions: ['fire', 'handshake'],
      },
    }),
    prisma.user.create({
      data: {
        instagramId: 'demo_user_2',
        instagramUsername: 'joao_dev',
        name: 'João Santos',
        bio: 'Full-stack developer | React | Node | Café',
        profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
        defaultIntentions: ['handshake', 'highfive'],
      },
    }),
    prisma.user.create({
      data: {
        instagramId: 'demo_user_3',
        instagramUsername: 'ana_beatriz',
        name: 'Ana Beatriz',
        bio: 'Product Manager | Startup enthusiast',
        profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg',
        defaultIntentions: ['handshake'],
      },
    }),
    prisma.user.create({
      data: {
        instagramId: 'demo_user_4',
        instagramUsername: 'pedro_fitness',
        name: 'Pedro Almeida',
        bio: 'Personal trainer | CrossFit | Corrida',
        profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
        defaultIntentions: ['highfive', 'fire'],
      },
    }),
    prisma.user.create({
      data: {
        instagramId: 'demo_user_5',
        instagramUsername: 'camila_music',
        name: 'Camila Oliveira',
        bio: 'Música | Jazz lover | Sempre com fone',
        profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg',
        defaultIntentions: ['highfive', 'champagne'],
      },
    }),
    prisma.user.create({
      data: {
        instagramId: 'demo_user_6',
        instagramUsername: 'lucas_startup',
        name: 'Lucas Ferreira',
        bio: 'Founder @ StartupX | Building the future',
        profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg',
        defaultIntentions: ['handshake', 'highfive'],
      },
    }),
    prisma.user.create({
      data: {
        instagramId: 'demo_user_7',
        instagramUsername: 'julia_travel',
        name: 'Julia Costa',
        bio: 'Viajante | Fotógrafa amadora | Sempre em movimento',
        profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg',
        defaultIntentions: ['fire', 'highfive'],
      },
    }),
    prisma.user.create({
      data: {
        instagramId: 'demo_user_8',
        instagramUsername: 'rafael_coder',
        name: 'Rafael Mendes',
        bio: 'Backend engineer | Python | Go | AWS',
        profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg',
        defaultIntentions: ['handshake'],
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create Presences (users confirmed at events)
  const presences = await Promise.all([
    // Happy Hour Tech
    prisma.presence.create({
      data: {
        userId: users[0].id,
        eventId: events[0].id,
        intentions: ['handshake', 'highfive'],
        checkedInAt: new Date(),
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[1].id,
        eventId: events[0].id,
        intentions: ['handshake'],
        checkedInAt: new Date(),
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[2].id,
        eventId: events[0].id,
        intentions: ['handshake', 'fire'],
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[7].id,
        eventId: events[0].id,
        intentions: ['handshake'],
        checkedInAt: new Date(),
      },
    }),

    // Festa de Lançamento
    prisma.presence.create({
      data: {
        userId: users[0].id,
        eventId: events[1].id,
        intentions: ['fire', 'highfive'],
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[3].id,
        eventId: events[1].id,
        intentions: ['fire', 'highfive'],
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[6].id,
        eventId: events[1].id,
        intentions: ['fire'],
      },
    }),

    // Startup Weekend
    prisma.presence.create({
      data: {
        userId: users[1].id,
        eventId: events[2].id,
        intentions: ['handshake'],
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[2].id,
        eventId: events[2].id,
        intentions: ['handshake', 'highfive'],
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[5].id,
        eventId: events[2].id,
        intentions: ['handshake'],
      },
    }),

    // Yoga
    prisma.presence.create({
      data: {
        userId: users[3].id,
        eventId: events[3].id,
        intentions: ['highfive'],
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[4].id,
        eventId: events[3].id,
        intentions: ['highfive', 'fire'],
      },
    }),

    // Speed Dating
    prisma.presence.create({
      data: {
        userId: users[0].id,
        eventId: events[4].id,
        intentions: ['fire', 'champagne'],
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[3].id,
        eventId: events[4].id,
        intentions: ['fire'],
      },
    }),
    prisma.presence.create({
      data: {
        userId: users[6].id,
        eventId: events[4].id,
        intentions: ['fire', 'champagne'],
      },
    }),
  ]);

  console.log(`Created ${presences.length} presences`);

  // Create some Interactions and Matches
  const interactions = await Promise.all([
    // Mutual interactions at Happy Hour Tech (will create a match)
    prisma.interaction.create({
      data: {
        fromUserId: users[0].id,
        toUserId: users[1].id,
        eventId: events[0].id,
        type: 'handshake',
      },
    }),
    prisma.interaction.create({
      data: {
        fromUserId: users[1].id,
        toUserId: users[0].id,
        eventId: events[0].id,
        type: 'handshake',
      },
    }),

    // One-sided interactions
    prisma.interaction.create({
      data: {
        fromUserId: users[2].id,
        toUserId: users[7].id,
        eventId: events[0].id,
        type: 'fire',
      },
    }),

    // Festa interactions
    prisma.interaction.create({
      data: {
        fromUserId: users[0].id,
        toUserId: users[3].id,
        eventId: events[1].id,
        type: 'fire',
      },
    }),
    prisma.interaction.create({
      data: {
        fromUserId: users[3].id,
        toUserId: users[0].id,
        eventId: events[1].id,
        type: 'fire',
      },
    }),
  ]);

  console.log(`Created ${interactions.length} interactions`);

  // Create Matches from mutual interactions
  const matches = await Promise.all([
    prisma.match.create({
      data: {
        user1Id: users[0].id,
        user2Id: users[1].id,
        eventId: events[0].id,
        interactionType: 'handshake',
        status: 'revealed',
        revealedAt: new Date(),
      },
    }),
    prisma.match.create({
      data: {
        user1Id: users[0].id,
        user2Id: users[3].id,
        eventId: events[1].id,
        interactionType: 'fire',
        status: 'revealed',
        revealedAt: new Date(),
      },
    }),
  ]);

  console.log(`Created ${matches.length} matches`);

  // Create some Messages
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        matchId: matches[0].id,
        senderId: users[0].id,
        content: 'Oi João! Muito legal te conhecer no happy hour!',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
    }),
    prisma.message.create({
      data: {
        matchId: matches[0].id,
        senderId: users[1].id,
        content: 'Oi Maria! Também gostei de conversar sobre React. Bora tomar um café essa semana?',
        createdAt: new Date(Date.now() - 1800000), // 30 min ago
      },
    }),
    prisma.message.create({
      data: {
        matchId: matches[0].id,
        senderId: users[0].id,
        content: 'Bora sim! Que tal quinta-feira?',
        createdAt: new Date(Date.now() - 900000), // 15 min ago
      },
    }),
    prisma.message.create({
      data: {
        matchId: matches[1].id,
        senderId: users[3].id,
        content: 'Oi! A festa foi incrível né? 🔥',
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
    }),
    prisma.message.create({
      data: {
        matchId: matches[1].id,
        senderId: users[0].id,
        content: 'Demais! Adorei a música. Você vai no próximo evento?',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
    }),
  ]);

  console.log(`Created ${messages.length} messages`);

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📝 Demo accounts:');
  console.log('   Organizer: demo@checkpoint.app / demo123');
  console.log('   Organizer: eventos@startup.io / demo123');
  console.log('\n📱 Demo users (use Instagram mock login):');
  users.forEach((u) => console.log(`   @${u.instagramUsername} - ${u.name}`));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
