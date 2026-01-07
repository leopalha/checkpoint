# 📍 CheckPoint - Social Presence Platform

> **Descubra quem está onde. Conecte-se com intenção.**

CheckPoint é uma plataforma de presença social para eventos com match contextual. O diferencial principal: **o match só é revelado quando AMBOS usuários fazem check-in no evento**.

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- (Opcional) Expo CLI para desenvolvimento mobile

### Setup do Projeto

```bash
# 1. Clonar o repositório
git clone https://github.com/your-org/checkpoint.git
cd checkpoint

# 2. Instalar dependências
pnpm install

# 3. Subir serviços (PostgreSQL + Redis)
docker compose up -d

# 4. Configurar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
# Editar .env com suas credenciais

# 5. Rodar migrations do banco
pnpm --filter @checkpoint/api db:migrate

# 6. Iniciar desenvolvimento
pnpm dev
```

### Acessar os serviços

| Serviço | URL |
|---------|-----|
| Mobile (Expo) | `exp://localhost:8081` |
| API | `http://localhost:3000` |
| API Docs (Swagger) | `http://localhost:3000/api/docs` |
| Dashboard | `http://localhost:3001` |
| pgAdmin | `http://localhost:5050` |

---

## 📁 Estrutura do Projeto

```
checkpoint/
├── apps/
│   ├── mobile/          # React Native + Expo + NativeWind
│   ├── api/             # NestJS + Prisma + PostgreSQL
│   └── dashboard/       # Next.js 14 + shadcn/ui
├── packages/
│   ├── types/           # Tipos TypeScript compartilhados
│   ├── utils/           # Funções utilitárias
│   ├── ui/              # Componentes UI compartilhados
│   └── config/          # Configs ESLint, TypeScript, Prettier
├── docker-compose.yml   # PostgreSQL + Redis
├── turbo.json           # Configuração Turborepo
└── pnpm-workspace.yaml  # Workspace pnpm
```

---

## 🛠️ Comandos Principais

```bash
# Desenvolvimento
pnpm dev              # Iniciar todos os apps
pnpm dev --filter @checkpoint/mobile   # Apenas mobile
pnpm dev --filter @checkpoint/api      # Apenas API
pnpm dev --filter @checkpoint/dashboard # Apenas dashboard

# Build
pnpm build            # Build de todos os apps

# Lint & Format
pnpm lint             # Verificar lint
pnpm lint:fix         # Corrigir lint
pnpm format           # Formatar código

# Testes
pnpm test             # Rodar testes
pnpm test:coverage    # Testes com coverage

# Database
pnpm --filter @checkpoint/api db:migrate     # Rodar migrations
pnpm --filter @checkpoint/api db:generate    # Gerar Prisma client
pnpm --filter @checkpoint/api db:studio      # Abrir Prisma Studio
```

---

## 🎯 Core Features

| Feature | Descrição |
|---------|-----------|
| **Confirmação de Presença** | Confirmar presença em eventos com intenções (🔥 paquera, 🤝 networking, ✋ amizade) |
| **Sistema de Curtidas** | Curtir pessoas no evento com limite diário (10 free, ilimitado premium) |
| **Check-in GPS/QR** | Verificar presença física no evento (raio mínimo 200m) |
| **Match Revelado** | Match só aparece quando AMBOS fazem check-in |
| **Chat com Expiração** | Conversa por 7 dias após match |
| **Temas de Evento** | 10 temas (romantic, professional, party, etc.) com interações customizadas |
| **Dashboard B2B** | Métricas em tempo real para organizadores |

---

## 📱 Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Mobile | React Native, Expo, NativeWind, Zustand |
| Backend | NestJS, Prisma, PostgreSQL + PostGIS |
| Dashboard | Next.js 14, Tailwind CSS, Recharts |
| Real-time | Socket.io |
| Push | Firebase Cloud Messaging |
| Auth | Instagram OAuth + JWT |

---

## 📚 Documentação

Toda documentação do projeto está em `/docs`:

- [PRD - Product Requirements](./docs/PRD-v2.md)
- [Features v2](./docs/FEATURES-v2.md)
- [User Stories](./docs/04-USER-STORIES.md)
- [API Specification](./docs/API-SPECIFICATION.md)
- [Arquitetura](./docs/05-ARQUITETURA-TECNICA.md)
- [Roadmap MVP](./docs/06-ROADMAP-MVP-v2.md)

---

## 🗓️ Sprints

| Sprint | Semanas | Foco |
|--------|---------|------|
| SETUP-1 | 1-2 | Monorepo, config, Docker |
| AUTH-1 | 3-4 | Instagram OAuth, JWT |
| PRESENCE-1 | 5-6 | Eventos, presença, temas |
| INTERACTIONS-1 | 7-8 | Curtidas, limites |
| CHECKIN-1 | 9-10 | GPS, QR code |
| MATCH-1 | 11-14 | Match revelado, WebSocket |
| CHAT-1 | 15-16 | Chat com expiração |
| DASHBOARD-1 | 17-18 | Dashboard B2B |
| POLISH-1 | 19-20 | Bug fixes, performance |

Ver [tasks.md](./tasks.md) para lista completa de tarefas.

---

## 📊 Score Atual

```
╔════════════════════════════════════════════╗
║   SCORE GERAL: 85/100                       ║
║   █████████████████████████████░░░░ 85%    ║
║                                             ║
║   Status: MVP READY                         ║
║   Próximo: Testes E2E e Deploy              ║
╚════════════════════════════════════════════╝
```

---

## 🚂 Deploy no Railway

### 1. Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Conecte este repositório

### 2. Adicionar PostgreSQL

1. No projeto, clique **"+ New"** → **"Database"** → **"PostgreSQL"**
2. O Railway configura `DATABASE_URL` automaticamente

### 3. Configurar Variáveis de Ambiente

No serviço da API, adicione estas variáveis em **Variables**:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=sua-chave-secreta-forte-aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-dashboard.vercel.app,checkpoint://

# Instagram OAuth (obter em developers.facebook.com)
INSTAGRAM_CLIENT_ID=seu-client-id
INSTAGRAM_CLIENT_SECRET=seu-client-secret
INSTAGRAM_REDIRECT_URI=checkpoint://auth/callback

# Firebase (opcional - para push notifications)
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_PRIVATE_KEY=sua-chave
FIREBASE_CLIENT_EMAIL=seu-email
```

### 4. Deploy

O Railway faz deploy automático a cada push na branch main.

### 5. URLs

Após deploy, você terá:
- **API**: `https://seu-projeto.up.railway.app`
- **Swagger**: `https://seu-projeto.up.railway.app/api/docs`

---

## 🤝 Contribuindo

1. Siga as convenções de código (ESLint + Prettier)
2. Commits seguem Conventional Commits
3. PRs devem ter testes quando aplicável
4. Use os tipos compartilhados de `@checkpoint/types`

---

## 📝 License

Proprietary - All rights reserved

---

**CheckPoint** © 2026
