# 🏗️ Arquitetura Técnica - CheckMate

## Visão Geral da Arquitetura

---

## 1. Stack Tecnológico Recomendado

### Mobile App (DECISÃO FINAL)
| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Framework | **React Native (Expo)** | Cross-platform, uma codebase, DX excelente |
| State Management | **Zustand + React Query** | Leve, performático, cache automático |
| Navegação | **React Navigation v6** | Padrão da indústria para RN |
| UI | **NativeWind (Tailwind para RN)** | Consistência com dashboard |
| Maps | **react-native-maps + Google Maps SDK** | Melhor cobertura e UX |
| Push | **Firebase Cloud Messaging** | Gratuito, confiável |
| Analytics | **Mixpanel** | Eventos e funis |
| Crash | **Sentry** | Monitoramento de erros |

### Backend (DECISÃO FINAL)
| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Runtime | **Node.js + NestJS** | TypeScript, modular, produtivo |
| API | **REST + WebSocket (Socket.io)** | REST para CRUD, WS para real-time |
| Auth | **Instagram OAuth + JWT** | Validação de perfil real |
| Database | **PostgreSQL + PostGIS** | Relacional, robusto, geo |
| ORM | **Prisma** | Type-safe, migrations |
| Cache | **Redis** | Cache e pub/sub |
| Search | **Elasticsearch** | Busca full-text |
| Queue | **Bull (Redis)** | Jobs assíncronos |
| Storage | **AWS S3 / Cloudinary** | Imagens e arquivos |

### Infraestrutura (DECISÃO FINAL)
| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Cloud | **AWS** | Escalável, confiável |
| Container | **Docker + ECS** | Deploy simplificado |
| CI/CD | **GitHub Actions** | Integração com repo |
| CDN | **CloudFront** | Performance global |
| Monitoring | **Datadog** | Observabilidade |
| Logs | **CloudWatch** | Centralização |

### Dashboard Web - Organizador (DECISÃO FINAL)
| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Framework | **Next.js 14 (App Router)** | SSR, performance, RSC |
| UI | **Tailwind CSS + shadcn/ui** | Produtividade, consistência |
| Charts | **Recharts** | Visualizações |
| Tables | **TanStack Table** | Dados tabulares |
| Auth | **NextAuth.js** | Integração simples |

---

## 2. Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│   │   iOS App   │    │ Android App │    │  Web Admin  │                    │
│   │(React Native│    │(React Native│    │  (Next.js)  │                    │
│   │  or Flutter)│    │  or Flutter)│    │             │                    │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                    │
│          │                  │                  │                            │
└──────────┼──────────────────┼──────────────────┼────────────────────────────┘
           │                  │                  │
           └────────────┬─────┴──────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY                                        │
│                    (AWS API Gateway / Kong)                                  │
│                                                                             │
│   • Rate Limiting      • Authentication      • Request Routing              │
│   • SSL Termination    • API Versioning      • Load Balancing               │
└─────────────────────────────────────────────────────────────────────────────┘
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVICES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   Auth Service  │  │  User Service   │  │  Event Service  │             │
│  │                 │  │                 │  │                 │             │
│  │ • Login/Signup  │  │ • Profile CRUD  │  │ • Event CRUD    │             │
│  │ • OAuth (IG)    │  │ • Preferences   │  │ • Check-in      │             │
│  │ • Token mgmt    │  │ • Connections   │  │ • Discovery     │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Match Service  │  │  Chat Service   │  │ Notification Svc│             │
│  │                 │  │                 │  │                 │             │
│  │ • ReMatch logic │  │ • Messaging     │  │ • Push          │             │
│  │ • Matching algo │  │ • WebSocket     │  │ • Email         │             │
│  │ • Connections   │  │ • History       │  │ • In-app        │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │Analytics Service│  │  Search Service │  │  Media Service  │             │
│  │                 │  │                 │  │                 │             │
│  │ • Events track  │  │ • Full-text     │  │ • Image upload  │             │
│  │ • Dashboards    │  │ • Geo search    │  │ • Resize/crop   │             │
│  │ • Reports       │  │ • Suggestions   │  │ • CDN delivery  │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   PostgreSQL    │  │     Redis       │  │  Elasticsearch  │             │
│  │   (Primary DB)  │  │    (Cache)      │  │    (Search)     │             │
│  │                 │  │                 │  │                 │             │
│  │ • Users         │  │ • Sessions      │  │ • Events index  │             │
│  │ • Events        │  │ • Presence      │  │ • Users index   │             │
│  │ • Check-ins     │  │ • Rate limits   │  │ • Full-text     │             │
│  │ • Connections   │  │ • Pub/Sub       │  │ • Geo queries   │             │
│  │ • Messages      │  │                 │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │    AWS S3       │  │   Message Queue │                                  │
│  │   (Storage)     │  │   (Bull/SQS)    │                                  │
│  │                 │  │                 │                                  │
│  │ • User photos   │  │ • Notifications │                                  │
│  │ • Event images  │  │ • Analytics     │                                  │
│  │ • Exports       │  │ • Email jobs    │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Instagram  │ │ Google Maps │ │   Firebase  │ │   SendGrid  │           │
│  │  Graph API  │ │     API     │ │     FCM     │ │   (Email)   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                           │
│  │   Sympla    │ │   Stripe    │ │   Sentry    │                           │
│  │     API     │ │  (Payments) │ │  (Errors)   │                           │
│  └─────────────┘ └─────────────┘ └─────────────┘                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Modelagem de Dados

### Diagrama ER Simplificado

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      USERS       │       │     EVENTS       │       │     PLACES       │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ email            │       │ organizer_id(FK) │       │ name             │
│ name             │       │ name             │       │ address          │
│ bio              │       │ description      │       │ latitude         │
│ photo_url        │       │ start_time       │       │ longitude        │
│ instagram_handle │       │ end_time         │       │ category         │
│ city             │       │ place_id (FK)    │       │ google_place_id  │
│ created_at       │       │ visibility       │       │ created_at       │
│ settings (JSON)  │       │ checkin_type     │       └────────┬─────────┘
└────────┬─────────┘       │ checkin_radius   │                │
         │                 │ created_at       │                │
         │                 └────────┬─────────┘                │
         │                          │                          │
         │                          │                          │
         ▼                          ▼                          │
┌──────────────────┐       ┌──────────────────┐                │
│    CHECK_INS     │       │   EVENT_RSVPS    │                │
├──────────────────┤       ├──────────────────┤                │
│ id (PK)          │       │ id (PK)          │                │
│ user_id (FK)     │◄──────│ user_id (FK)     │                │
│ event_id (FK)    │──────►│ event_id (FK)    │                │
│ place_id (FK)    │───────┼──────────────────┼────────────────┘
│ checked_in_at    │       │ status           │
│ checked_out_at   │       │ created_at       │
│ visibility       │       └──────────────────┘
│ status_text      │
│ is_verified      │
│ created_at       │
└────────┬─────────┘
         │
         │
         ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  MATCH_REQUESTS  │       │    CONNECTIONS   │       │    MESSAGES      │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ requester_id(FK) │       │ user_a_id (FK)   │       │ connection_id(FK)│
│ target_id (FK)   │       │ user_b_id (FK)   │       │ sender_id (FK)   │
│ event_id (FK)    │──────►│ event_context(FK)│       │ content          │
│ message          │       │ status           │       │ read_at          │
│ status           │       │ created_at       │       │ created_at       │
│ created_at       │       └──────────────────┘       └──────────────────┘
└──────────────────┘
```

### Schemas Detalhados

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- null se OAuth
    name VARCHAR(100) NOT NULL,
    bio VARCHAR(280),
    photo_url VARCHAR(500),
    instagram_id VARCHAR(50),
    instagram_handle VARCHAR(30),
    linkedin_url VARCHAR(200),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    settings JSONB DEFAULT '{}',
    -- settings: {
    --   default_visibility: 'public' | 'friends' | 'private',
    --   allow_rematch_from: 'everyone' | 'friends_of_friends' | 'nobody',
    --   notifications: { checkin: true, rematch: true, ... }
    -- }
    total_points INTEGER DEFAULT 0,
    level VARCHAR(20) DEFAULT 'novato',
    is_verified BOOLEAN DEFAULT false,
    is_organizer BOOLEAN DEFAULT false,
    last_active_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_instagram ON users(instagram_handle);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_location ON users USING GIST (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
```

#### Events Table
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID REFERENCES users(id),
    place_id UUID REFERENCES places(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    visibility VARCHAR(20) DEFAULT 'public', -- public, private, unlisted
    checkin_type VARCHAR(20) DEFAULT 'geo', -- geo, qr, code, open
    checkin_radius INTEGER DEFAULT 200, -- metros
    checkin_code VARCHAR(20),
    allow_early_checkin_hours INTEGER DEFAULT 2,
    allow_rematch BOOLEAN DEFAULT true,
    max_capacity INTEGER,
    category VARCHAR(50),
    tags TEXT[],
    external_url VARCHAR(500),
    sympla_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active', -- active, cancelled, ended
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_start ON events(start_time);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_place ON events(place_id);
CREATE INDEX idx_events_status ON events(status);
```

#### Check-ins Table
```sql
CREATE TABLE check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    event_id UUID REFERENCES events(id),
    place_id UUID REFERENCES places(id),
    checked_in_at TIMESTAMP DEFAULT NOW(),
    checked_out_at TIMESTAMP,
    visibility VARCHAR(20) DEFAULT 'public',
    status_text VARCHAR(280),
    mood VARCHAR(10), -- emoji
    looking_for VARCHAR(50), -- networking, friends, dating, just_here
    is_verified BOOLEAN DEFAULT false,
    verification_method VARCHAR(20), -- geo, qr, code
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT checkin_place_or_event CHECK (
        event_id IS NOT NULL OR place_id IS NOT NULL
    )
);

CREATE INDEX idx_checkins_user ON check_ins(user_id);
CREATE INDEX idx_checkins_event ON check_ins(event_id);
CREATE INDEX idx_checkins_time ON check_ins(checked_in_at);
CREATE INDEX idx_checkins_active ON check_ins(user_id) 
    WHERE checked_out_at IS NULL;
```

#### Connections Table
```sql
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID REFERENCES users(id) NOT NULL,
    user_b_id UUID REFERENCES users(id) NOT NULL,
    event_context_id UUID REFERENCES events(id),
    status VARCHAR(20) DEFAULT 'active', -- active, blocked
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_connection UNIQUE (user_a_id, user_b_id),
    CONSTRAINT ordered_users CHECK (user_a_id < user_b_id)
);

CREATE INDEX idx_connections_user_a ON connections(user_a_id);
CREATE INDEX idx_connections_user_b ON connections(user_b_id);
```

#### Match Requests Table
```sql
CREATE TABLE match_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(id) NOT NULL,
    target_id UUID REFERENCES users(id) NOT NULL,
    event_id UUID REFERENCES events(id) NOT NULL,
    message VARCHAR(280),
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, ignored, blocked
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_request UNIQUE (requester_id, target_id, event_id)
);

CREATE INDEX idx_requests_target ON match_requests(target_id, status);
CREATE INDEX idx_requests_requester ON match_requests(requester_id);
```

#### Themes Table (Sistema de Temas)
```sql
CREATE TABLE themes (
    id VARCHAR(50) PRIMARY KEY,           -- 'romantic', 'professional', etc
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,            -- emoji
    description TEXT,
    colors JSONB NOT NULL,                -- {primary, secondary, accent, gradient}
    labels JSONB NOT NULL,                -- {match_message, presence_label, checkin_label}
    config JSONB NOT NULL,                -- {show_intentions_publicly, allow_anonymous_likes, etc}
    default_interactions VARCHAR(50)[] NOT NULL,
    blocked_interactions VARCHAR(50)[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed inicial de temas
INSERT INTO themes (id, name, icon, default_interactions, colors, labels, config) VALUES
('romantic', 'Romance', '💕', ARRAY['fire', 'highfive', 'champagne'],
 '{"primary": "#FF6B6B", "secondary": "#FFE66D", "accent": "#FF85A1"}',
 '{"match_message": "É Match! 💕", "presence_label": "Confirmado 💕"}',
 '{"show_intentions_publicly": true, "allow_anonymous_likes": true}'),
('professional', 'Profissional', '💼', ARRAY['handshake', 'briefcase', 'target'],
 '{"primary": "#4A90D9", "secondary": "#34495E", "accent": "#2ECC71"}',
 '{"match_message": "Conexão feita! 🤝", "presence_label": "Confirmado"}',
 '{"show_intentions_publicly": false, "allow_anonymous_likes": false}');
```

#### Interaction Types Table
```sql
CREATE TABLE interaction_types (
    id VARCHAR(50) PRIMARY KEY,           -- 'fire', 'handshake', etc
    emoji VARCHAR(10) NOT NULL,
    label VARCHAR(50) NOT NULL,
    description TEXT,
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT true
);

-- Seed inicial de tipos de interação
INSERT INTO interaction_types (id, emoji, label, description) VALUES
('fire', '🔥', 'Interesse', 'Interesse romântico/atração'),
('handshake', '🤝', 'Networking', 'Networking profissional'),
('highfive', '✋', 'Amizade', 'Curtir a vibe/amizade'),
('carona', '🚗', 'Carona', 'Dividir transporte'),
('ticket', '🎫', 'Ingresso', 'Dividir/vender ingresso'),
('champagne', '🍾', 'Drinks', 'Convite para drinks/after'),
('briefcase', '💼', 'Proposta', 'Proposta profissional'),
('target', '🎯', 'Objetivo', 'Objetivo específico do evento');
```

#### Event Interactions Table (Curtidas)
```sql
CREATE TABLE event_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) NOT NULL,
    from_user_id UUID REFERENCES users(id) NOT NULL,
    to_user_id UUID REFERENCES users(id) NOT NULL,
    interaction_type VARCHAR(50) REFERENCES interaction_types(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, matched, expired
    created_at TIMESTAMP DEFAULT NOW(),
    matched_at TIMESTAMP,

    CONSTRAINT unique_interaction UNIQUE (event_id, from_user_id, to_user_id)
);

CREATE INDEX idx_interactions_event ON event_interactions(event_id);
CREATE INDEX idx_interactions_to_user ON event_interactions(to_user_id, status);
CREATE INDEX idx_interactions_from_user ON event_interactions(from_user_id);
```

#### Matches Table (substitui Connections)
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID REFERENCES users(id) NOT NULL,
    user_b_id UUID REFERENCES users(id) NOT NULL,
    event_id UUID REFERENCES events(id) NOT NULL,
    origin_type VARCHAR(20) NOT NULL,     -- 'interaction' ou 'rematch'
    origin_id UUID NOT NULL,              -- ID da interação ou request
    intention VARCHAR(50) REFERENCES interaction_types(id),
    chat_enabled BOOLEAN DEFAULT true,
    chat_expires_at TIMESTAMP,            -- 7 dias após criação
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT unique_match UNIQUE (user_a_id, user_b_id, event_id),
    CONSTRAINT ordered_users CHECK (user_a_id < user_b_id)
);

CREATE INDEX idx_matches_user_a ON matches(user_a_id);
CREATE INDEX idx_matches_user_b ON matches(user_b_id);
CREATE INDEX idx_matches_event ON matches(event_id);
```

---

## 4. APIs Principais

### REST API Endpoints

#### Authentication
```
POST   /auth/instagram         # OAuth com Instagram (único método)
POST   /auth/instagram/callback # Callback do OAuth
POST   /auth/refresh           # Refresh token
POST   /auth/logout            # Logout
```

> **NOTA:** Autenticação é APENAS via Instagram OAuth conforme decisão de produto.

#### Users
```
GET    /users/me               # Meu perfil
PATCH  /users/me               # Atualizar perfil
GET    /users/:id              # Ver perfil de outro
GET    /users/me/matches       # Meus matches
GET    /users/me/checkins      # Meu histórico
PUT    /users/me/settings      # Atualizar configurações
GET    /users/me/export        # Exportar dados (LGPD)
DELETE /users/me               # Deletar conta (LGPD)
POST   /users/me/cancel-deletion # Cancelar exclusão
```

#### Events
```
GET    /events                 # Listar eventos (com filtros)
GET    /events/:id             # Detalhes do evento
GET    /events/:id/checkins    # Quem está/esteve no evento
GET    /events/:id/rsvps       # Quem vai no evento
POST   /events/:id/rsvp        # Marcar que vai
DELETE /events/:id/rsvp        # Desmarcar
GET    /events/nearby          # Eventos próximos
GET    /events/search          # Buscar eventos
```

#### Check-ins
```
POST   /checkins               # Fazer check-in
GET    /checkins/active        # Meu check-in ativo
PUT    /checkins/:id           # Atualizar check-in
DELETE /checkins/:id           # Check-out
GET    /checkins/nearby        # Check-ins próximos
```

#### ReMatch
```
POST   /match-requests         # Enviar request
GET    /match-requests/inbox   # Requests recebidos
GET    /match-requests/sent    # Requests enviados
PUT    /match-requests/:id     # Aceitar/ignorar/bloquear
```

#### Messages
```
GET    /connections/:id/messages  # Histórico de mensagens
POST   /connections/:id/messages  # Enviar mensagem
PUT    /messages/:id/read         # Marcar como lido
```

#### Organizador
```
POST   /organizer/events          # Criar evento
PUT    /organizer/events/:id      # Atualizar evento
GET    /organizer/events/:id/stats # Estatísticas
GET    /organizer/events/:id/export # Exportar CSV
POST   /organizer/events/:id/qr   # Gerar QR code
```

### WebSocket Events

#### Client → Server
```javascript
// Conectar
{ type: 'connect', token: 'jwt_token' }

// Subscribe em um evento (presença)
{ type: 'subscribe_event', event_id: 'uuid' }

// Unsubscribe
{ type: 'unsubscribe_event', event_id: 'uuid' }

// Enviar mensagem
{ type: 'send_message', connection_id: 'uuid', content: 'texto' }

// Typing indicator
{ type: 'typing', connection_id: 'uuid' }
```

#### Server → Client
```javascript
// Novo check-in no evento que está vendo
{ type: 'new_checkin', event_id: 'uuid', user: {...} }

// Check-out
{ type: 'checkout', event_id: 'uuid', user_id: 'uuid' }

// Nova mensagem
{ type: 'new_message', message: {...} }

// Novo match request
{ type: 'match_request', request: {...} }

// Match aceito
{ type: 'match_accepted', connection: {...} }

// Presença atualizada (count)
{ type: 'presence_update', event_id: 'uuid', count: 42 }
```

---

## 5. Fluxos Técnicos Críticos

### Fluxo de Check-in

```
┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐
│  Mobile │          │   API   │          │   DB    │          │  Redis  │
└────┬────┘          └────┬────┘          └────┬────┘          └────┬────┘
     │                    │                    │                    │
     │ POST /checkins     │                    │                    │
     │ {event_id, lat/lng}│                    │                    │
     │───────────────────►│                    │                    │
     │                    │                    │                    │
     │                    │ Validate user      │                    │
     │                    │ auth token         │                    │
     │                    │───────────────────►│                    │
     │                    │                    │                    │
     │                    │ Get event details  │                    │
     │                    │ & checkin rules    │                    │
     │                    │───────────────────►│                    │
     │                    │◄───────────────────│                    │
     │                    │                    │                    │
     │                    │ Validate location  │                    │
     │                    │ (distance calc)    │                    │
     │                    │                    │                    │
     │                    │ Insert check_in    │                    │
     │                    │───────────────────►│                    │
     │                    │◄───────────────────│                    │
     │                    │                    │                    │
     │                    │                    │ Publish to channel │
     │                    │                    │ event:{event_id}   │
     │                    │────────────────────┼───────────────────►│
     │                    │                    │                    │
     │                    │                    │ Update presence    │
     │                    │                    │ count              │
     │                    │────────────────────┼───────────────────►│
     │                    │                    │                    │
     │ 201 Created        │                    │                    │
     │ {checkin}          │                    │                    │
     │◄───────────────────│                    │                    │
     │                    │                    │                    │
```

### Fluxo de ReMatch

```
User A                API                  DB                 Push Service
  │                    │                    │                      │
  │ POST /match-requests                    │                      │
  │ {target_id, event_id, message}          │                      │
  │───────────────────►│                    │                      │
  │                    │                    │                      │
  │                    │ Validate both were │                      │
  │                    │ at same event      │                      │
  │                    │───────────────────►│                      │
  │                    │◄───────────────────│                      │
  │                    │                    │                      │
  │                    │ Check rate limit   │                      │
  │                    │ (max 5/day)        │                      │
  │                    │                    │                      │
  │                    │ Insert request     │                      │
  │                    │───────────────────►│                      │
  │                    │◄───────────────────│                      │
  │                    │                    │                      │
  │                    │ Send push to User B│                      │
  │                    │─────────────────────────────────────────►│
  │                    │                    │                      │
  │ 201 Created        │                    │                      │
  │◄───────────────────│                    │                      │
  │                    │                    │                      │

User B                API                  DB                 WebSocket
  │                    │                    │                      │
  │ PUT /match-requests/:id                 │                      │
  │ {status: 'accepted'}                    │                      │
  │───────────────────►│                    │                      │
  │                    │                    │                      │
  │                    │ Update request     │                      │
  │                    │───────────────────►│                      │
  │                    │                    │                      │
  │                    │ Create connection  │                      │
  │                    │───────────────────►│                      │
  │                    │◄───────────────────│                      │
  │                    │                    │                      │
  │                    │ Notify User A (WS) │                      │
  │                    │─────────────────────────────────────────►│
  │                    │                    │                      │
  │                    │ Send push to User A│                      │
  │                    │─────────────────────────────────────────►│
  │                    │                    │                      │
  │ 200 OK {connection}│                    │                      │
  │◄───────────────────│                    │                      │
```

---

## 6. Considerações de Segurança

### Autenticação
- JWT com refresh tokens
- Tokens expiram em 1h, refresh em 30 dias
- Blacklist de tokens revogados em Redis
- Rate limiting por IP e por usuário

### Autorização
- RBAC: user, organizer, admin
- Verificar ownership em todas operações
- Sanitização de inputs

### Dados Sensíveis
- Senhas com bcrypt (cost 12)
- PII criptografado em repouso
- Logs sem dados sensíveis
- HTTPS everywhere

### Geolocalização
- Validação de coordenadas
- Detecção de spoofing (velocidade impossível)
- Rate limit em queries geo

### Anti-abuse
- Rate limiting progressivo
- CAPTCHA após tentativas falhas
- Shadow ban para abusadores
- Moderação de conteúdo

---

## 7. Escalabilidade

### Horizontal Scaling
- Stateless services (escalar via containers)
- Load balancer com health checks
- Auto-scaling baseado em CPU/requests

### Database
- Read replicas para queries pesadas
- Connection pooling (PgBouncer)
- Particionamento de tabelas grandes (check_ins por mês)
- Índices otimizados

### Cache Strategy
- Cache de perfis públicos (5 min TTL)
- Cache de contagem de presença (30s TTL)
- Cache de eventos ativos (1 min TTL)
- Invalidação inteligente

### Real-time
- WebSocket com sticky sessions
- Redis pub/sub para broadcast
- Fallback para polling se WS falhar

---

## 8. Monitoramento e Observabilidade

### Métricas Chave
- Latência de API (p50, p95, p99)
- Taxa de erro por endpoint
- Check-ins por minuto
- WebSocket connections ativas
- Database query time

### Alertas
- API latency > 500ms
- Error rate > 1%
- Database connections > 80%
- Memory usage > 85%
- Failed login spike

### Logging
- Request ID em todos os logs
- Structured logging (JSON)
- Log levels apropriados
- Retenção: 30 dias

---

## 9. DevOps e CI/CD

### Environments
- **Development**: Local ou cloud dev
- **Staging**: Espelho de produção
- **Production**: Ambiente live

### Pipeline
```
1. Push to branch
2. Run tests (unit + integration)
3. Build Docker image
4. Security scan
5. Deploy to staging
6. E2E tests
7. Manual approval
8. Deploy to production
9. Smoke tests
10. Monitor metrics
```

### Rollback
- Blue-green deployment
- Feature flags para rollout gradual
- Database migrations reversíveis
- Rollback automático se error rate subir

---

*Documento de Arquitetura v1.0 - Para equipe técnica*
