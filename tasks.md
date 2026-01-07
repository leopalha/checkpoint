# CHECKPOINT - TASKS & SPRINTS

> **Última Atualização:** 2026-01-07 10:00
> **Versão:** 4.3 (Full MVP Implementation)
> **Metodologia:** MANUS v7.1
> **Nome do App:** CheckPoint

---

## 📊 STATUS GERAL

| Métrica | Valor |
|---------|-------|
| **7D Score Atual** | 85/100 (MVP Completo) |
| **Sprint Atual** | POLISH-1 🟢 |
| **Próximo Sprint** | DEPLOYMENT |
| **Tarefas Totais** | 174 |
| **Tarefas Completas** | 155+ (API + Mobile + Dashboard + Themes + Premium) |
| **Story Points MVP** | ~430 SP |
| **Timeline** | 20 semanas |
| **Blockers P0** | Nenhum |

---

## 🔥 IMPLEMENTAÇÃO CONCLUÍDA (2026-01-07)

### Concluído Hoje (Sessão Completa):

#### Dashboard
- [x] Dashboard Landing Page - Redesign completo para organizadores
- [x] Design System aplicado corretamente
- [x] Preview do dashboard com métricas mockadas
- [x] Hero section profissional
- [x] Features grid com gradientes
- [x] Stats section
- [x] CTA section
- [x] Footer completo

#### Auth Pages
- [x] Redesign Login page (dark theme, gradients, social login)
- [x] Redesign Register page (matching design system)

#### ReMatch Module (API) - NOVO
- [x] Prisma schema: RematchRequest + UserBlock models
- [x] rematch.dto.ts com Swagger decorators
- [x] rematch.service.ts (daily limits 10/day, request handling, blocking)
- [x] rematch.controller.ts (REST endpoints)
- [x] rematch.module.ts (NestJS module)
- [x] Notificações para rematch (request/accepted)

#### ReMatch Module (Mobile) - NOVO
- [x] rematchApi service methods
- [x] ReMatch tab na navegação
- [x] rematch.tsx screen completa (3 tabs: Requests, Available, Connections)
- [x] Send request modal
- [x] Accept/Ignore functionality
- [x] Daily limit display
- [x] WebSocket handlers (rematch_request, rematch_accepted)

#### Settings/LGPD
- [x] Export data endpoint (já implementado)
- [x] Delete account endpoint (já implementado)
- [x] Cancel deletion endpoint (já implementado)
- [x] Settings screen no mobile (já implementado)

#### Mobile UI Improvements
- [x] home.tsx redesign (greeting, "Happening Now" carousel, filter tabs, theme gradients)
- [x] profile.tsx redesign (gradient header, stats cards, intentions, premium card, progress bar)

#### Push Notifications
- [x] useNotifications.ts com rematch notification types
- [x] Navigation handlers para rematch_request e rematch_accepted
- [x] Android notification channels configurados

#### Themes Module (API) - NOVO
- [x] themes.dto.ts com Swagger decorators
- [x] themes.service.ts com seed de 10 temas
- [x] themes.controller.ts (GET /themes, GET /themes/:id)
- [x] themes.module.ts integrado ao app.module

#### Premium Module (API) - NOVO
- [x] premium.dto.ts (status, plans, credits)
- [x] premium.service.ts (daily limits, subscriptions, credits)
- [x] premium.controller.ts (status, plans, subscribe, purchase)
- [x] Planos: Semanal, Mensal, Trimestral
- [x] Pacotes de creditos: 5, 10, 25, 50 curtidas

#### Mobile Components - NOVO
- [x] premium.tsx - Tela completa de Premium com planos e creditos
- [x] EventCard.tsx - Card reutilizavel com gradientes por tema
- [x] UserCard.tsx - Card de usuario com intencoes
- [x] MatchCard.tsx - Card de match com mensagem e badge
- [x] IntentionPicker.tsx - Seletor de intencoes multi-select
- [x] MatchRevealModal.tsx - Modal animado de match revelado

### Próximos Passos:
- [ ] Deploy verificado em produção
- [ ] Testes E2E completos
- [ ] App Store/Play Store submission

---

## 🎯 OBJETIVO MVP (20 SEMANAS)

Entregar MVP funcional com:
- Login Instagram OAuth
- Perfil com intenções (🔥 🤝 ✋ 🍾 💼 🎯 🚗 🎫)
- Sistema de Temas por evento
- Confirmar presença + curtir pessoas
- Check-in GPS + QR code
- **Match revelado no check-in (CORE FEATURE)**
- Chat básico (7 dias)
- Dashboard organizador com insights

---

## ✅ SPRINTS CONCLUÍDOS

### DOCS-ALIGNMENT ✅
- [x] 00-ALINHAMENTO-PRODUTO-v2.md - Documento mestre
- [x] 01-VISAO-GERAL-PRODUTO-v2.md - Visão atualizada
- [x] 02-MODELO-DE-NEGOCIO-v2.md - Monetização
- [x] 03-FEATURES-FUNCIONALIDADES-v2.md - Features + Temas + Interações
- [x] 06-ROADMAP-MVP-v2.md - Timeline 20 semanas
- [x] PERSONAS.md - Personas detalhadas
- [x] .manus/ - Metodologia MANUS v7.1

### DOCS-CLEANUP ✅
- [x] Deletados documentos v1 obsoletos
- [x] Criado _INDEX.md - Índice de navegação
- [x] Criado API-SPECIFICATION.md - Endpoints completos
- [x] Criado MOBILE-APP-SPEC.md - Telas e navegação
- [x] Criado SECURITY-CHECKLIST.md - Segurança e LGPD

### DOCS-AUDIT ✅ (2026-01-06)
- [x] Auditoria completa PRD vs Features vs API
- [x] PRD atualizado com Sistema de Interações (8 tipos)
- [x] PRD atualizado com fluxo de match correto
- [x] API-SPEC: Endpoints LGPD adicionados
- [x] Arquitetura: Schemas de temas adicionados
- [x] User Stories: Epic de Interações e Temas
- [x] ZERO conflitos entre documentos

---

## 🏃 SPRINT 1: SETUP-1 (Semanas 1-2) - ~35 SP

### Objetivo
Setup completo do ambiente de desenvolvimento com estrutura responsiva e otimizada.

---

### FASE 1: MONOREPO E INFRAESTRUTURA (P0)

#### T-SETUP-001: Criar Monorepo Turborepo
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

```bash
# Estrutura esperada:
checkpoint/
├── apps/
│   ├── mobile/          # React Native + Expo
│   ├── api/             # NestJS Backend
│   └── dashboard/       # Next.js 14
├── packages/
│   ├── ui/              # Componentes compartilhados
│   ├── config/          # ESLint, TypeScript configs
│   ├── types/           # Types compartilhados
│   └── utils/           # Funções utilitárias
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

**Critérios de Aceite:**
- [ ] `pnpm install` funciona na raiz
- [ ] `pnpm dev` inicia todos os projetos
- [ ] `pnpm build` builda todos os projetos
- [ ] `pnpm typecheck` passa sem erros

---

#### T-SETUP-002: Configurar ESLint + Prettier Compartilhado
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Arquivo:** `packages/config/eslint-preset.js`
```javascript
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
};
```

**Critérios de Aceite:**
- [ ] ESLint configurado em todos os projetos
- [ ] Prettier configurado
- [ ] Pre-commit hook com Husky
- [ ] `pnpm lint` passa sem erros

---

#### T-SETUP-003: Configurar TypeScript Strict
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 1 | **Status:** [ ]

**Arquivo:** `packages/config/tsconfig.base.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

**Critérios de Aceite:**
- [ ] TypeScript strict em todos os projetos
- [ ] Zero erros de tipo
- [ ] Paths aliases configurados

---

### FASE 2: MOBILE APP (P0)

#### T-SETUP-004: Inicializar Expo Project
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

```bash
cd apps/mobile
npx create-expo-app@latest . --template blank-typescript
```

**Estrutura:**
```
apps/mobile/
├── app/                    # Expo Router (file-based routing)
│   ├── (auth)/            # Rotas de autenticação
│   ├── (tabs)/            # Tab navigation
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── components/
│   ├── ui/                # Componentes base (Button, Input, Card)
│   ├── forms/             # Formulários
│   └── shared/            # Componentes compartilhados
├── features/
│   ├── auth/              # Feature de autenticação
│   ├── events/            # Feature de eventos
│   ├── interactions/      # Feature de curtidas
│   ├── matches/           # Feature de matches
│   └── profile/           # Feature de perfil
├── hooks/                 # Custom hooks
├── services/              # API services
├── stores/                # Zustand stores
├── utils/                 # Utilidades
└── constants/             # Constantes (cores, config)
```

**Critérios de Aceite:**
- [ ] App inicia no simulador/emulador
- [ ] Expo Router funcionando
- [ ] Hot reload funcionando

---

#### T-SETUP-005: Configurar NativeWind (Tailwind para RN)
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

```bash
pnpm add nativewind tailwindcss
```

**Arquivo:** `tailwind.config.js`
```javascript
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Cores do CheckPoint
        primary: {
          DEFAULT: "#7C3AED",
          50: "#F5F3FF",
          500: "#7C3AED",
          600: "#6D28D9",
          700: "#5B21B6"
        },
        // Cores por tema
        romantic: {
          primary: "#FF6B6B",
          secondary: "#FFE66D",
          accent: "#FF85A1"
        },
        professional: {
          primary: "#2D3748",
          secondary: "#4A5568",
          accent: "#3182CE"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"]
      }
    }
  }
};
```

**Critérios de Aceite:**
- [ ] Classes Tailwind funcionando
- [ ] Cores do brand aplicadas
- [ ] Responsividade funcionando

---

#### T-SETUP-006: Configurar Zustand + React Query
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Arquivo:** `stores/authStore.ts`
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null, isAuthenticated: false })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
```

**Critérios de Aceite:**
- [ ] Zustand persistindo no AsyncStorage
- [ ] React Query configurado
- [ ] Axios com interceptors

---

#### T-SETUP-007: Criar Design System Base
**Prioridade:** P0 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Componentes a criar:**
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

// components/ui/Input.tsx
// components/ui/Card.tsx
// components/ui/Avatar.tsx
// components/ui/Badge.tsx
// components/ui/Modal.tsx
// components/ui/Toast.tsx
```

**Critérios de Aceite:**
- [ ] Button com todas as variantes
- [ ] Input com validação visual
- [ ] Card responsivo
- [ ] Avatar com fallback
- [ ] Badge para notificações
- [ ] Modal animado
- [ ] Toast para feedback

---

#### T-SETUP-008: Configurar Navigation Structure
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Arquivo:** `app/_layout.tsx`
```typescript
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../services/api';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="event/[id]" />
        <Stack.Screen name="profile/[id]" />
        <Stack.Screen name="chat/[matchId]" />
      </Stack>
    </QueryClientProvider>
  );
}
```

**Critérios de Aceite:**
- [ ] Tab navigation funcionando
- [ ] Stack navigation para detalhes
- [ ] Deep linking configurado
- [ ] Transições suaves

---

#### T-SETUP-009: Configurar Jest + Testing Library
**Prioridade:** P1 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] `pnpm test` funciona
- [ ] Testes de componentes passando
- [ ] Coverage configurado

---

### FASE 3: BACKEND API (P0)

#### T-SETUP-010: Inicializar NestJS Project
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

```bash
cd apps/api
nest new . --package-manager pnpm --skip-git
```

**Estrutura:**
```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/          # Autenticação Instagram
│   │   ├── users/         # Usuários e perfis
│   │   ├── events/        # Eventos
│   │   ├── presences/     # Confirmações de presença
│   │   ├── interactions/  # Curtidas com intenção
│   │   ├── checkins/      # Check-ins GPS/QR
│   │   ├── matches/       # Matches
│   │   ├── chat/          # Mensagens
│   │   ├── themes/        # Sistema de temas
│   │   └── organizer/     # Dashboard organizador
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── filters/
│   │   └── interceptors/
│   ├── config/
│   └── main.ts
├── prisma/
│   └── schema.prisma
└── test/
```

**Critérios de Aceite:**
- [ ] NestJS rodando na porta 3000
- [ ] Swagger UI acessível em /api
- [ ] Health check endpoint

---

#### T-SETUP-011: Configurar Prisma + PostgreSQL
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Schema completo para todas as entidades
- [ ] Migrations funcionando
- [ ] PostGIS configurado para geo queries

---

#### T-SETUP-012: Configurar Redis + Socket.io
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Redis conectando
- [ ] Cache funcionando
- [ ] WebSocket endpoint /socket.io

---

#### T-SETUP-013: Criar Seed Data
**Prioridade:** P1 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Temas seedados (10 tipos)
- [ ] Tipos de interação seedados (8 tipos)
- [ ] Eventos de teste criados

---

### FASE 4: DASHBOARD (P1)

#### T-SETUP-014: Inicializar Next.js 14 Dashboard
**Prioridade:** P1 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Dashboard rodando na porta 3001
- [ ] App Router funcionando
- [ ] Tailwind configurado

---

#### T-SETUP-015: Configurar shadcn/ui
**Prioridade:** P1 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] shadcn/ui instalado
- [ ] Componentes base disponíveis
- [ ] Tema configurado

---

#### T-SETUP-016: Layout Base Dashboard
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Sidebar responsiva
- [ ] Header com user menu
- [ ] Dark mode toggle

---

### FASE 5: DEVOPS (P0)

#### T-SETUP-017: Docker Compose para Desenvolvimento
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Arquivo:** `docker-compose.yml`
```yaml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:15-3.3
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: checkpoint
      POSTGRES_PASSWORD: checkpoint
      POSTGRES_DB: checkpoint
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

**Critérios de Aceite:**
- [ ] `docker-compose up` inicia todos os serviços
- [ ] PostgreSQL com PostGIS
- [ ] Redis funcionando

---

#### T-SETUP-018: Configurar .env.example
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 1 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Todas as variáveis documentadas
- [ ] .env.example no repositório
- [ ] .env no .gitignore

---

#### T-SETUP-019: Configurar GitHub Actions CI
**Prioridade:** P1 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] CI roda em PRs
- [ ] Lint, typecheck, test passando
- [ ] Badge no README

---

### FASE 6: VALIDAÇÃO (P0)

#### T-SETUP-020: Hello World End-to-End
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Mobile → Backend → Database funcionando
- [ ] Mobile → Backend → Redis funcionando
- [ ] Dashboard → Backend funcionando
- [ ] WebSocket conectando

---

## 🏃 SPRINT 2: AUTH-1 (Semanas 3-4) - ~45 SP

### Objetivo
Usuário pode criar conta via Instagram e gerenciar perfil.

---

#### T-AUTH-001: Configurar Instagram OAuth (backend)
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] App registrado no Instagram Developer
- [ ] Credenciais configuradas no .env
- [ ] Documentação de setup

---

#### T-AUTH-002: Criar endpoint POST /auth/instagram
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Retorna URL de autorização do Instagram
- [ ] Redirect URI configurável
- [ ] Validação de input com Zod

---

#### T-AUTH-003: Criar endpoint POST /auth/instagram/callback
**Prioridade:** P0 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Processa código OAuth do Instagram
- [ ] Busca dados do usuário (nome, foto, bio)
- [ ] Cria ou atualiza usuário no banco
- [ ] Retorna JWT tokens
- [ ] Indica se é novo usuário

---

#### T-AUTH-004: Implementar JWT service (access + refresh)
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Access token (1h expiry)
- [ ] Refresh token (7d expiry)
- [ ] Tokens assinados com secret seguro
- [ ] Payload inclui userId e roles

---

#### T-AUTH-005: Criar endpoint POST /auth/refresh
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Valida refresh token
- [ ] Retorna novo access token
- [ ] Invalida refresh token antigo (opcional)

---

#### T-AUTH-006: Criar endpoint POST /auth/logout
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Invalida tokens
- [ ] Remove do cache Redis
- [ ] Retorna sucesso

---

#### T-AUTH-007: Implementar AuthGuard (NestJS)
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Guard para rotas protegidas
- [ ] Extrai usuário do token
- [ ] Decorador @CurrentUser()

---

#### T-AUTH-008: Criar módulo Users (backend)
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] UsersService com CRUD
- [ ] UsersController com endpoints
- [ ] DTOs com validação

---

#### T-AUTH-009: Criar endpoint GET /users/me
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Retorna perfil completo do usuário autenticado
- [ ] Inclui settings e stats
- [ ] Inclui status premium

---

#### T-AUTH-010: Criar endpoint PATCH /users/me
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Atualiza nome, bio, intenções padrão
- [ ] Validação de campos
- [ ] Retorna usuário atualizado

---

#### T-AUTH-011: GET /users/me/export (LGPD)
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Gera ZIP com todos os dados do usuário
- [ ] Inclui: perfil, checkins, matches, mensagens
- [ ] Link expira em 24h
- [ ] Limite: 1 export por dia

---

#### T-AUTH-012: DELETE /users/me (LGPD)
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Período de graça de 30 dias
- [ ] Agenda exclusão
- [ ] Permite cancelar até 24h antes
- [ ] Dados são anonimizados (não deletados fisicamente)

---

#### T-AUTH-013: POST /users/me/cancel-deletion
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Cancela exclusão agendada
- [ ] Reativa conta
- [ ] Retorna confirmação

---

#### T-AUTH-014: Tela Welcome (mobile)
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Logo CheckPoint
- [ ] Tagline
- [ ] Botão "Entrar com Instagram"
- [ ] Links termos/privacidade

---

#### T-AUTH-015: Tela Instagram OAuth WebView
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] WebView com URL do Instagram
- [ ] Captura callback
- [ ] Loading durante autenticação
- [ ] Tratamento de erros

---

#### T-AUTH-016: Tela CreateProfile (mobile)
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Foto (pré-preenchida do Instagram)
- [ ] Nome (pré-preenchido)
- [ ] Bio (max 150 chars)
- [ ] Seletor de intenções padrão
- [ ] Botão criar perfil

---

#### T-AUTH-017: AuthStore Zustand
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] State: token, user, isAuthenticated
- [ ] Actions: setToken, setUser, logout
- [ ] Persistência no AsyncStorage

---

#### T-AUTH-018: Hook useAuth
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Encapsula lógica de auth
- [ ] Funções: login, logout, refreshToken
- [ ] Gerencia estado de loading/error

---

#### T-AUTH-019: Protected Routes
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Redirect para login se não autenticado
- [ ] Verificação de token válido
- [ ] Loading state durante verificação

---

#### T-AUTH-020: Testes unitários auth
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Testes do AuthService
- [ ] Testes do AuthGuard
- [ ] Testes dos endpoints
- [ ] Coverage > 80%

---

## 🏃 SPRINT 3: PRESENCE-1 (Semanas 5-6) - ~55 SP

### Objetivo
Check-in e confirmação de presença funcionando com sistema de temas.

---

#### T-PRES-001: Criar módulo Events (backend)
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] EventsService com CRUD
- [ ] EventsController com endpoints
- [ ] DTOs com validação

---

#### T-PRES-002: GET /events (com filtros geo)
**Prioridade:** P0 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Filtro por lat/lng/radius
- [ ] Filtro por data
- [ ] Filtro por categoria
- [ ] Paginação
- [ ] Ordenação por distância

---

#### T-PRES-003: GET /events/:id
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Retorna detalhes completos do evento
- [ ] Inclui tema
- [ ] Inclui stats (confirmados, checkins)
- [ ] Inclui minha presença

---

#### T-PRES-004: GET /events/:id/attendees
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista confirmados/presentes
- [ ] Filtro por status (confirmed/checkedin)
- [ ] Filtro por amigos
- [ ] Paginação

---

#### T-PRES-005: Configurar PostGIS
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Extensão PostGIS habilitada
- [ ] Índices geográficos criados
- [ ] Funções de distância funcionando

---

#### T-PRES-006: Criar módulo Presences
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] PresencesService
- [ ] PresencesController
- [ ] DTOs

---

#### T-PRES-007: POST /events/:id/presence
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Confirma presença
- [ ] Define intenções
- [ ] Define status text
- [ ] Valida evento existe

---

#### T-PRES-008: PATCH /events/:id/presence
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Atualiza intenções
- [ ] Atualiza status text

---

#### T-PRES-009: DELETE /events/:id/presence
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Cancela presença
- [ ] Remove da lista de confirmados

---

#### T-PRES-010: Criar módulo Themes
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] ThemesService
- [ ] ThemesController
- [ ] DTOs

---

#### T-PRES-011: GET /themes
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista todos os temas
- [ ] Inclui cores, labels, config

---

#### T-PRES-012: GET /themes/:id
**Prioridade:** P0 | **Estimativa:** 15min | **SP:** 1 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Retorna detalhes do tema

---

#### T-PRES-013: Aplicar tema ao evento
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Evento tem theme_id
- [ ] Retorna tema nos endpoints de evento
- [ ] Valida interações permitidas

---

#### T-PRES-014: Tela Home (eventos) - mobile
**Prioridade:** P0 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista de eventos próximos
- [ ] Filtros (data, categoria)
- [ ] Pull-to-refresh
- [ ] Paginação infinita

---

#### T-PRES-015: EventCard component
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Imagem, nome, data, local
- [ ] Contadores (confirmados, amigos)
- [ ] Tags de categoria
- [ ] Navegação para detalhes

---

#### T-PRES-016: Tela EventDetail
**Prioridade:** P0 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Header com imagem hero
- [ ] Info do evento
- [ ] Status da minha presença
- [ ] Lista de participantes
- [ ] Botão confirmar/check-in

---

#### T-PRES-017: PresenceForm component
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Seletor de intenções
- [ ] Campo de status text
- [ ] Botão confirmar
- [ ] Validação

---

#### T-PRES-018: Tela Attendees
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista de participantes
- [ ] Tabs: Confirmados / No evento
- [ ] Filtros por intenção
- [ ] Botão curtir

---

#### T-PRES-019: UserCard component
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Avatar, nome, username
- [ ] Intenções (ícones)
- [ ] Status text
- [ ] Botão de curtida

---

#### T-PRES-020: IntentionPicker component
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] 8 ícones de intenção
- [ ] Multi-select
- [ ] Visual feedback
- [ ] Respeita bloqueados por tema

---

#### T-PRES-021: ThemeProvider
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Context com tema atual
- [ ] Aplica cores do tema
- [ ] Hook useTheme

---

#### T-PRES-022: useEvents hook
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Fetch de eventos com React Query
- [ ] Filtros e paginação
- [ ] Cache

---

#### T-PRES-023: usePresence hook
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Confirmar presença
- [ ] Atualizar presença
- [ ] Cancelar presença

---

#### T-PRES-024: EventsStore Zustand
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] State: eventos, filtros
- [ ] Actions: setFilters, selectEvent

---

#### T-PRES-025: Testes unitários presence
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Testes de endpoints
- [ ] Testes de hooks
- [ ] Coverage > 70%

---

## 🏃 SPRINT 4: INTERACTIONS-1 (Semanas 7-8) - ~40 SP

### Objetivo
Sistema de curtidas com 8 tipos de intenção.

---

#### T-INT-001: Criar módulo Interactions
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] InteractionsService
- [ ] InteractionsController
- [ ] DTOs

---

#### T-INT-002: POST /events/:id/interactions
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Envia curtida para usuário
- [ ] Define tipo de intenção
- [ ] Valida limite diário
- [ ] Valida intenção permitida pelo tema
- [ ] Verifica se é match mútuo

---

#### T-INT-003: GET /events/:id/interactions
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista curtidas enviadas
- [ ] Contagem de recebidas (sem revelar quem)
- [ ] Curtidas restantes hoje

---

#### T-INT-004: Lógica limite curtidas (10/dia)
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] 10 curtidas/dia para free
- [ ] Ilimitado para premium
- [ ] Reset à meia-noite

---

#### T-INT-005: Validar interações por tema
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Bloqueia interações não permitidas
- [ ] Retorna erro claro
- [ ] Lista interações permitidas

---

#### T-INT-006: Seed InteractionTypes
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] 8 tipos: fire, handshake, highfive, carona, ticket, champagne, briefcase, target
- [ ] Emoji, label, cor para cada

---

#### T-INT-007: Notificação anônima curtida
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Notifica "X pessoas curtiram você"
- [ ] Não revela identidade
- [ ] Agrupa notificações

---

#### T-INT-008: Tela UserProfile (outro)
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Avatar grande
- [ ] Nome, username, bio
- [ ] Intenções
- [ ] Amigos em comum
- [ ] Eventos em comum
- [ ] Botões: Curtir, Ver Instagram

---

#### T-INT-009: Botão curtida + seletor
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Abre seletor de intenção
- [ ] Mostra apenas permitidos pelo tema
- [ ] Feedback visual

---

#### T-INT-010: Modal confirmação curtida
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] "Curtir [Nome] com [Intenção]?"
- [ ] Botões confirmar/cancelar

---

#### T-INT-011: Toast feedback
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] "Curtida enviada! X restantes hoje"
- [ ] Toast de limite atingido
- [ ] Upsell premium

---

#### T-INT-012: Badge "X curtiram você"
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Exibe no perfil
- [ ] Atualiza em tempo real
- [ ] Não revela quem

---

#### T-INT-013: useInteractions hook
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Enviar curtida
- [ ] Buscar interações
- [ ] Gerenciar loading/error

---

#### T-INT-014: InteractionsStore
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] State: interações enviadas
- [ ] Contagem restante

---

#### T-INT-015: Animação curtida
**Prioridade:** P1 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Animação do ícone
- [ ] Feedback visual agradável

---

#### T-INT-016: Testes unitários
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Testes de endpoints
- [ ] Testes de limites
- [ ] Coverage > 70%

---

## 🏃 SPRINT 5: CHECKIN-1 (Semanas 9-10) - ~40 SP

### Objetivo
Check-in GPS + QR Code funcionando.

---

#### T-CHK-001: Criar módulo Checkins
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] CheckinsService
- [ ] CheckinsController
- [ ] DTOs

---

#### T-CHK-002: POST /events/:id/checkin
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Recebe lat/lng ou qr_code
- [ ] Valida localização ou QR
- [ ] Cria check-in
- [ ] Retorna matches revelados
- [ ] Retorna contagem de curtidas recebidas

---

#### T-CHK-003: Validação GPS (raio 200m)
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Calcula distância do evento
- [ ] Raio mínimo 200m (configurável)
- [ ] Margem de erro GPS (+50m)
- [ ] Retorna erro claro se fora

---

#### T-CHK-004: Validação QR Code
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Valida código do evento
- [ ] Códigos únicos e seguros
- [ ] Expira com o evento

---

#### T-CHK-005: DELETE /events/:id/checkin
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Check-out manual
- [ ] Remove da lista de presentes
- [ ] Registra horário de saída

---

#### T-CHK-006: Expiração automática
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Check-in expira quando evento termina
- [ ] Job de limpeza
- [ ] Atualiza status automaticamente

---

#### T-CHK-007: Configurar expo-location
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Permissões configuradas
- [ ] Request de permissão
- [ ] Fallback se negado

---

#### T-CHK-008: GeolocationService
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] getCurrentPosition
- [ ] Accuracy configurável
- [ ] Timeout e retry

---

#### T-CHK-009: Tela/Modal CheckIn
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Mostra evento
- [ ] Indicador de verificação GPS
- [ ] Distância do evento
- [ ] Botão confirmar

---

#### T-CHK-010: QR Scanner component
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Camera scanner
- [ ] Feedback visual
- [ ] Tratamento de erros

---

#### T-CHK-011: Modal validação GPS
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Progress de verificação
- [ ] Mensagem de sucesso/erro
- [ ] Distância atual

---

#### T-CHK-012: Estado "No evento" UI
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Badge "No evento!"
- [ ] Horário de check-in
- [ ] Destaque visual

---

#### T-CHK-013: Botão Check-out
**Prioridade:** P0 | **Estimativa:** 15min | **SP:** 1 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Confirmação antes de sair
- [ ] Feedback de sucesso

---

#### T-CHK-014: useCheckin hook
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Fazer check-in
- [ ] Fazer check-out
- [ ] Status atual

---

#### T-CHK-015: Testes unitários
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Testes de validação GPS
- [ ] Testes de QR
- [ ] Coverage > 70%

---

## 🏃 SPRINT 6: MATCH-1 (Semanas 11-14) - ~65 SP ⭐ CORE FEATURE

### Objetivo
Match revelado quando AMBOS fazem check-in (CORE FEATURE do CheckPoint).

---

#### T-MATCH-001: Criar módulo Matches
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] MatchesService
- [ ] MatchesController
- [ ] DTOs

---

#### T-MATCH-002: Lógica match pendente
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Detecta curtida mútua
- [ ] Cria match com status "pending"
- [ ] Não revela ainda

---

#### T-MATCH-003: Verificar match no checkin
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Quando A faz check-in, verifica matches pendentes
- [ ] Se B já fez check-in, revela match
- [ ] Retorna lista de matches revelados

---

#### T-MATCH-004: Revelar match (AMBOS checkin)
**Prioridade:** P0 | **Estimativa:** 4h | **SP:** 8 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Match só revelado quando AMBOS têm check-in ativo
- [ ] Atualiza status para "revealed"
- [ ] Define chat_expires_at (7 dias)
- [ ] Notifica ambos usuários

---

#### T-MATCH-005: GET /matches
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista todos os matches
- [ ] Inclui info do evento
- [ ] Inclui última mensagem
- [ ] Inclui status do chat

---

#### T-MATCH-006: GET /matches/:id
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Detalhes do match
- [ ] Perfil completo do outro usuário
- [ ] Status do chat

---

#### T-MATCH-007: Mensagem match por tema
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Mensagem personalizada pelo tema
- [ ] "É Match! 💕" (romantic)
- [ ] "Conexão feita! 🤝" (professional)

---

#### T-MATCH-008: Push notification match
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Notificação quando match revelado
- [ ] Deep link para chat
- [ ] Inclui foto e nome

---

#### T-MATCH-009: Firebase Cloud Messaging
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] FCM configurado no backend
- [ ] Envio de push funcionando
- [ ] Tokens gerenciados

---

#### T-MATCH-010: expo-notifications
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Permissões configuradas
- [ ] Recebimento de push
- [ ] Deep links funcionando

---

#### T-MATCH-011: WebSocket gateway
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Gateway Socket.io no NestJS
- [ ] Autenticação via token
- [ ] Rooms por usuário

---

#### T-MATCH-012: Evento match:revealed WS
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Emite evento quando match revelado
- [ ] Inclui dados do match
- [ ] Real-time para ambos

---

#### T-MATCH-013: Tela Matches (tab)
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista de matches
- [ ] Filtros
- [ ] Empty state

---

#### T-MATCH-014: MatchCard component
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Avatar, nome
- [ ] Evento do match
- [ ] Última mensagem
- [ ] Badge não lidas

---

#### T-MATCH-015: Modal MatchRevealed
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Celebração visual
- [ ] Avatar do match
- [ ] Mensagem personalizada por tema
- [ ] Botão "Enviar mensagem"

---

#### T-MATCH-016: Animação match (tema)
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Corações (romantic)
- [ ] Confetes (party)
- [ ] Clean (professional)

---

#### T-MATCH-017: useMatches hook
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Fetch matches
- [ ] Subscrição WebSocket
- [ ] Cache

---

#### T-MATCH-018: MatchesStore
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] State: matches, unread count
- [ ] Actions: addMatch, markRead

---

#### T-MATCH-019: NotificationService
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Gerencia permissões
- [ ] Registra token
- [ ] Handlers de notificação

---

#### T-MATCH-020: Testes unitários
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Testes de lógica de match
- [ ] Testes de revelação
- [ ] Coverage > 80%

---

#### T-MATCH-021: Testes E2E match
**Prioridade:** P1 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Fluxo completo: curtida → check-in → match
- [ ] Testes de notificação
- [ ] Testes de WebSocket

---

## 🏃 SPRINT 7: CHAT-1 (Semanas 15-16) - ~45 SP

### Objetivo
Chat 1:1 entre matches com duração de 7 dias.

---

#### T-CHAT-001: Criar módulo Chat
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] ChatService
- [ ] ChatController
- [ ] DTOs

---

#### T-CHAT-002: GET /matches/:id/messages
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista mensagens
- [ ] Paginação (cursor-based)
- [ ] Marca como lido

---

#### T-CHAT-003: POST /matches/:id/messages
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Envia mensagem
- [ ] Valida chat não expirado
- [ ] Retorna mensagem criada

---

#### T-CHAT-004: Expiração chat (7 dias)
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Chat expira 7 dias após match
- [ ] Bloqueia envio após expirar
- [ ] Aviso de expiração

---

#### T-CHAT-005: WebSocket mensagens
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Real-time messages
- [ ] Rooms por match
- [ ] Reconnect automático

---

#### T-CHAT-006: Eventos WS (new, read, typing)
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] message:new
- [ ] message:read
- [ ] typing:start/stop

---

#### T-CHAT-007: Push nova mensagem
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Push quando recebe mensagem
- [ ] Preview da mensagem
- [ ] Deep link para chat

---

#### T-CHAT-008: Tela Chat
**Prioridade:** P0 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Header com avatar e nome
- [ ] Lista de mensagens
- [ ] Input de texto
- [ ] Scroll automático

---

#### T-CHAT-009: ChatBubble component
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Sent/received styles
- [ ] Timestamp
- [ ] Status (sent, delivered, read)

---

#### T-CHAT-010: ChatInput component
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Text input
- [ ] Botão enviar
- [ ] Desabilitado se expirado

---

#### T-CHAT-011: Indicador "digitando..."
**Prioridade:** P1 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Mostra quando outro está digitando
- [ ] Debounce

---

#### T-CHAT-012: Aviso expiração chat
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Banner quando falta 2 dias
- [ ] Mensagem incentivando trocar contato

---

#### T-CHAT-013: useChatMessages hook
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Fetch mensagens
- [ ] Enviar mensagem
- [ ] Paginação

---

#### T-CHAT-014: useChatSocket hook
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Conexão WebSocket
- [ ] Subscrição de eventos
- [ ] Reconnect

---

#### T-CHAT-015: ChatStore
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] State: mensagens por match
- [ ] Typing status

---

#### T-CHAT-016: Testes unitários
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Testes de endpoints
- [ ] Testes de expiração
- [ ] Coverage > 70%

---

## 🏃 SPRINT 8: DASHBOARD-1 (Semanas 17-18) - ~55 SP

### Objetivo
Dashboard B2B básico para organizadores.

---

#### T-DASH-001: Criar módulo Organizer
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] OrganizerService
- [ ] OrganizerController
- [ ] DTOs

---

#### T-DASH-002: Auth organizador (email)
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Cadastro com email/senha
- [ ] Login separado
- [ ] JWT para organizadores

---

#### T-DASH-003: GET /organizer/events
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista eventos do organizador
- [ ] Inclui stats básicos

---

#### T-DASH-004: POST /organizer/events
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Cria evento
- [ ] Define tema, interações, raio GPS
- [ ] Gera QR code

---

#### T-DASH-005: PUT /organizer/events/:id
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Atualiza evento
- [ ] Valida permissão

---

#### T-DASH-006: GET /organizer/events/:id/dashboard
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Métricas: confirmados, check-ins, matches
- [ ] Breakdown de interesses
- [ ] Timeline de check-ins

---

#### T-DASH-007: GET /organizer/events/:id/qrcode
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Gera QR code do evento
- [ ] Download em alta resolução

---

#### T-DASH-008: Estatísticas anonimizadas
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] % por tipo de interação
- [ ] Nunca revela identidades
- [ ] Agregações úteis

---

#### T-DASH-009: Tela Login organizador
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Form email/senha
- [ ] Link cadastro
- [ ] Tratamento erros

---

#### T-DASH-010: Tela Dashboard overview
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Cards de métricas
- [ ] Lista de eventos
- [ ] Ações rápidas

---

#### T-DASH-011: Tela Lista eventos
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Tabela de eventos
- [ ] Status (ativo, encerrado)
- [ ] Ações (editar, ver dashboard)

---

#### T-DASH-012: Tela Criar/Editar evento
**Prioridade:** P0 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Form completo
- [ ] Upload de imagem
- [ ] Preview

---

#### T-DASH-013: Seletor tema evento
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Lista de temas
- [ ] Preview de cores
- [ ] Interações do tema

---

#### T-DASH-014: Seletor interações
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Checkboxes de interações
- [ ] Baseado no tema

---

#### T-DASH-015: Config raio GPS
**Prioridade:** P0 | **Estimativa:** 15min | **SP:** 1 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Slider 200m-1km
- [ ] Preview no mapa

---

#### T-DASH-016: Gerador QR Code
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Visualização do QR
- [ ] Download PNG/PDF
- [ ] Customização (logo)

---

#### T-DASH-017: Gráficos métricas
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Gráfico de check-ins ao longo do tempo
- [ ] Comparativo confirmados vs presentes

---

#### T-DASH-018: Breakdown interesses
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Pizza chart de interações
- [ ] Números absolutos
- [ ] Anônimo

---

#### T-DASH-019: Timeline check-ins
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Gráfico de linha por hora
- [ ] Pico destacado

---

#### T-DASH-020: Export CSV
**Prioridade:** P1 | **Estimativa:** 30min | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Exporta lista de participantes
- [ ] Dados anonimizados onde necessário

---

#### T-DASH-021: Testes unitários
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Testes de endpoints
- [ ] Coverage > 60%

---

## 🏃 SPRINT 9: POLISH-1 (Semanas 19-20) - ~50 SP

### Objetivo
Pronto para usuários reais.

---

#### T-POL-001: Bug fixes (buffer)
**Prioridade:** P0 | **Estimativa:** 8h | **SP:** 8 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Bugs críticos corrigidos
- [ ] Regressões testadas

---

#### T-POL-002: Performance mobile
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Cold start < 3s
- [ ] 60fps nas animações

---

#### T-POL-003: Performance backend
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] API response < 500ms
- [ ] Cache funcionando

---

#### T-POL-004: Otimizar bundle
**Prioridade:** P1 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] App size < 50MB

---

#### T-POL-005: Otimizar queries
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Queries otimizadas
- [ ] Índices corretos

---

#### T-POL-006: Onboarding refinado
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Fluxo suave
- [ ] Explicações claras

---

#### T-POL-007: Empty states (11)
**Prioridade:** P0 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Sem eventos
- [ ] Sem matches
- [ ] Sem mensagens
- [ ] Etc.

---

#### T-POL-008: Error states
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Sem conexão
- [ ] Erro de API
- [ ] GPS desativado

---

#### T-POL-009: Offline mode básico
**Prioridade:** P1 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Cache de dados básicos
- [ ] Indicador offline
- [ ] Retry automático

---

#### T-POL-010: Loading skeletons
**Prioridade:** P1 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Skeletons para listas
- [ ] Feedback visual

---

#### T-POL-011: Testes E2E completo
**Prioridade:** P0 | **Estimativa:** 3h | **SP:** 5 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Fluxo principal testado
- [ ] Detox/Maestro configurado

---

#### T-POL-012: Coverage 70%+
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] 70%+ coverage
- [ ] Gaps identificados

---

#### T-POL-013: Sentry setup
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Error tracking
- [ ] Sourcemaps

---

#### T-POL-014: Analytics setup
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Mixpanel/Amplitude
- [ ] Eventos principais tracked

---

#### T-POL-015: Landing page
**Prioridade:** P1 | **Estimativa:** 2h | **SP:** 3 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Página simples
- [ ] Links para stores
- [ ] Formulário waitlist

---

#### T-POL-016: Termos de uso
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 1 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Documento legal
- [ ] Acessível no app

---

#### T-POL-017: Política privacidade
**Prioridade:** P0 | **Estimativa:** 30min | **SP:** 1 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] LGPD compliant
- [ ] Acessível no app

---

#### T-POL-018: App Store assets
**Prioridade:** P0 | **Estimativa:** 2h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Screenshots
- [ ] Descrição
- [ ] Keywords

---

#### T-POL-019: TestFlight build
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Build iOS
- [ ] Upload TestFlight
- [ ] Testers convidados

---

#### T-POL-020: Play Store build
**Prioridade:** P0 | **Estimativa:** 1h | **SP:** 2 | **Status:** [ ]

**Critérios de Aceite:**
- [ ] Build Android
- [ ] Internal testing track
- [ ] Testers convidados

---

## 📊 RESUMO DE SPRINTS

| Sprint | Semanas | Story Points | Tarefas |
|--------|---------|--------------|---------|
| SETUP-1 | 1-2 | ~35 | 20 |
| AUTH-1 | 3-4 | ~45 | 20 |
| PRESENCE-1 | 5-6 | ~55 | 25 |
| INTERACTIONS-1 | 7-8 | ~40 | 16 |
| CHECKIN-1 | 9-10 | ~40 | 15 |
| MATCH-1 | 11-14 | ~65 | 21 |
| CHAT-1 | 15-16 | ~45 | 16 |
| DASHBOARD-1 | 17-18 | ~55 | 21 |
| POLISH-1 | 19-20 | ~50 | 20 |
| **TOTAL** | **20 sem** | **~430** | **174** |

---

## 🚨 BLOCKERS (P0)

> Nenhum blocker no momento.

---

## 📝 NOTAS IMPORTANTES

### Stack Tecnológica (DECISÕES FINAIS)
| Componente | Tecnologia |
|------------|------------|
| **Mobile** | React Native + Expo + NativeWind |
| **State** | Zustand + React Query |
| **Backend** | Node.js + NestJS + Prisma |
| **Database** | PostgreSQL + PostGIS |
| **Cache** | Redis |
| **Real-time** | Socket.io |
| **Dashboard** | Next.js 14 + Tailwind + shadcn/ui |

### Core Feature: Match com Suspense
O match SÓ é revelado quando AMBOS fazem check-in. Isso:
1. Cria suspense antes do evento
2. Incentiva comparecimento
3. Garante presença física

### Sistema de Interações (8 tipos)
| Emoji | ID | Label |
|-------|-----|-------|
| 🔥 | fire | Interesse |
| 🤝 | handshake | Networking |
| ✋ | highfive | Amizade |
| 🚗 | carona | Carona |
| 🎫 | ticket | Ingresso |
| 🍾 | champagne | Drinks |
| 💼 | briefcase | Proposta |
| 🎯 | target | Objetivo |

### Sistema de Temas (10 tipos)
| ID | Nome | Interações Padrão |
|----|------|-------------------|
| romantic | Romance | fire, highfive, champagne |
| professional | Profissional | handshake, briefcase, target |
| social | Social | fire, handshake, highfive, champagne |
| party | Festa | fire, highfive, champagne, ticket |
| networking | Networking | handshake, briefcase, highfive |
| fitness | Fitness | highfive, fire, carona |
| tech | Tech/Startup | handshake, briefcase, highfive, fire |
| cultural | Cultural | highfive, fire, champagne |
| outdoor | Outdoor | highfive, carona, fire |
| custom | Customizado | Organizador escolhe |

---

## 📅 HISTÓRICO

| Data | Sprint | Ação |
|------|--------|------|
| 2026-01-07 | THEMES | Módulo de Temas implementado (API) |
| 2026-01-07 | PREMIUM | Módulo Premium/Créditos implementado (API + Mobile) |
| 2026-01-07 | COMPONENTS | Componentes reutilizáveis (EventCard, UserCard, MatchCard, etc.) |
| 2026-01-07 | IMPLEMENTATION | MVP completo - ReMatch, UI redesign, notificações |
| 2026-01-07 | REMATCH | Módulo ReMatch implementado (API + Mobile) |
| 2026-01-07 | UI-POLISH | Redesign home.tsx, profile.tsx, login, register |
| 2026-01-07 | NOTIFICATIONS | Push notifications com tipos rematch |
| 2026-01-06 | TASKS | tasks.md v4.0 COMPLETO - 174 tarefas |
| 2026-01-06 | DOCS-AUDIT | Auditoria completa, zero conflitos |
| 2026-01-06 | DOCS-CLEANUP | API-SPEC, MOBILE-SPEC, SECURITY |
| 2026-01-06 | DOCS-ALIGNMENT | Documentação v2 criada |

---

## 🔗 REFERÊNCIAS

### Documentação do Produto
- [_INDEX.md](docs/_INDEX.md) - **ÍNDICE COMPLETO**
- [00-ALINHAMENTO-PRODUTO-v2.md](docs/00-ALINHAMENTO-PRODUTO-v2.md) - **FONTE DA VERDADE**
- [03-FEATURES-FUNCIONALIDADES-v2.md](docs/03-FEATURES-FUNCIONALIDADES-v2.md) - Features + Temas
- [11-PRD-PRODUCT-REQUIREMENTS.md](docs/11-PRD-PRODUCT-REQUIREMENTS.md) - PRD Completo

### Especificações Técnicas
- [API-SPECIFICATION.md](docs/API-SPECIFICATION.md) - Endpoints e schemas
- [05-ARQUITETURA-TECNICA.md](docs/05-ARQUITETURA-TECNICA.md) - Database schemas
- [MOBILE-APP-SPEC.md](docs/MOBILE-APP-SPEC.md) - Telas e navegação
- [07-WIREFRAMES-FLUXOS.md](docs/07-WIREFRAMES-FLUXOS.md) - Wireframes

### Metodologia MANUS
- [ACTIVATION_PROMPT_v7.1.md](.manus/ACTIVATION_PROMPT_v7.1.md)
- [SCORING_SYSTEM_v7.md](.manus/scoring/SCORING_SYSTEM_v7.md)
- [CURRENT_SCORE.md](.manus/scoring/CURRENT_SCORE.md)

---

**FIM DO TASKS.MD v4.0 - MANUS AUTOPILOT READY - CHECKPOINT**
