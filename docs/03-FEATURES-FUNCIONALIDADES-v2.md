# Features e Funcionalidades - CheckMate v2.0

> **Versão:** 2.0
> **Última Atualização:** 2026-01-06 (Pós-Alinhamento)

---

## 1. Arquitetura de Features

### Visão Geral do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CHECKMATE - FEATURE MAP                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐       │
│  │   CONFIRMAR   │    │    CURTIR     │    │   MATCH NO    │       │
│  │   PRESENÇA    │───▶│  (Intenção)   │───▶│    EVENTO     │       │
│  └───────────────┘    └───────────────┘    └───────────────┘       │
│         │                    │                     │                │
│         │                    │                     │                │
│         ▼                    ▼                     ▼                │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐       │
│  │   CHECK-IN    │    │   CURTIDA     │    │     CHAT      │       │
│  │    (GPS)      │    │  NO EVENTO    │    │  (7 dias)     │       │
│  └───────────────┘    └───────────────┘    └───────────────┘       │
│         │                                          │                │
│         │                                          │                │
│         ▼                                          ▼                │
│  ┌───────────────┐                         ┌───────────────┐       │
│  │   REMATCH     │                         │   CONEXÃO     │       │
│  │ (Pós-evento)  │                         │    REAL       │       │
│  └───────────────┘                         └───────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Sistema de Interações (NOVO)

### 2.1 Tipos de Interação por Contexto

O diferencial do CheckMate é permitir expressar **INTENÇÃO** na interação.

| Ícone | ID | Nome | Contexto | Descrição |
|-------|-----|------|----------|-----------|
| 🔥 | `fire` | Foguinho | Paquera | Interesse romântico |
| 🤝 | `handshake` | Handshake | Network | Conexão profissional |
| ✋ | `highfive` | High Five | Amizade | Quer fazer amigos |
| 🚗 | `car` | Carona | Compartilhar | Dividir transporte |
| 🎫 | `ticket` | Ingresso | Compartilhar | Dividir camarote/mesa |
| 🍾 | `champagne` | Champagne | Celebrar | Experiência VIP |
| 💼 | `briefcase` | Briefcase | Negócios | Oportunidade específica |
| 🎯 | `target` | Alvo | Custom | Definido pelo usuário |

### 2.2 Regras de Interação

```typescript
interface Interaction {
  id: string;
  from_user_id: string;
  to_user_id: string;
  event_id: string;
  type: InteractionType; // 'fire' | 'handshake' | etc.
  created_at: Date;
  is_mutual: boolean;
  revealed_at?: Date; // Quando o match foi revelado (no check-in)
}

// Regras:
// 1. Usuário pode enviar múltiplas interações (tipos diferentes)
// 2. Match = interação mútua do MESMO tipo
// 3. Match só é revelado quando AMBOS fazem check-in
// 4. Chat só libera após match revelado
```

### 2.3 Configuração pelo Organizador

O organizador pode definir quais interações estão disponíveis no evento:

| Tipo de Evento | Interações Sugeridas |
|----------------|---------------------|
| Festa/Balada | 🔥 🤝 ✋ 🍾 |
| Conferência | 🤝 💼 ✋ |
| Meetup Tech | 🤝 💼 ✋ 🔥 |
| Evento Fitness | ✋ 🔥 🚗 |
| Coworking | 🤝 💼 ✋ |

---

## 2.4 Sistema de Temas de Evento

O organizador escolhe um **TEMA** para o evento que define a experiência, interações disponíveis e visual do app.

### 2.4.1 Temas Disponíveis

| ID | Nome | Ícone | Descrição | Interações Padrão |
|----|------|-------|-----------|-------------------|
| `romantic` | Romance | 💕 | Eventos de encontro, singles night | 🔥 ✋ 🍾 |
| `professional` | Profissional | 💼 | Conferências, workshops | 🤝 💼 ✋ |
| `social` | Social | 🎉 | Eventos mistos, festas casuais | 🔥 🤝 ✋ 🍾 |
| `party` | Festa | 🎊 | Baladas, shows, festivais | 🔥 ✋ 🍾 🎫 |
| `networking` | Networking | 🔗 | Happy hours, meetups | 🤝 💼 ✋ |
| `fitness` | Fitness | 💪 | Corridas, treinos em grupo | ✋ 🔥 🚗 |
| `tech` | Tech/Startup | 🚀 | Hackathons, demo days | 🤝 💼 ✋ 🔥 |
| `cultural` | Cultural | 🎭 | Shows, teatro, exposições | ✋ 🔥 🍾 |
| `outdoor` | Outdoor | 🏕️ | Trilhas, camping, natureza | ✋ 🚗 🔥 |
| `custom` | Customizado | ⚙️ | Organizador define tudo | Organizador escolhe |

### 2.4.2 O Que o Tema Define

```typescript
interface EventTheme {
  id: ThemeId;
  name: string;
  icon: string;
  description: string;

  // Interações
  default_interactions: InteractionType[]; // Interações habilitadas por padrão
  blocked_interactions?: InteractionType[]; // Interações bloqueadas (não pode habilitar)

  // Visual
  color_primary: string;      // Cor primária do tema
  color_secondary: string;    // Cor secundária
  color_accent: string;       // Cor de destaque
  gradient?: string;          // Gradiente de fundo

  // Comportamento
  match_message: string;      // Mensagem de match (ex: "É Match! 💕")
  presence_label: string;     // Label de presença (ex: "Confirmado 🎉")
  checkin_label: string;      // Label de check-in (ex: "No evento! 🔥")

  // UX
  show_intentions_publicly: boolean; // Mostrar intenções na lista?
  allow_anonymous_likes: boolean;    // Curtidas anônimas?
  enable_chat_live: boolean;         // Chat do evento habilitado?
}
```

### 2.4.3 Configuração de Cores por Tema

| Tema | Primary | Secondary | Accent | Gradient |
|------|---------|-----------|--------|----------|
| romantic | #FF6B6B | #FFE66D | #FF85A1 | #FF6B6B → #FF85A1 |
| professional | #2D3748 | #4A5568 | #3182CE | #2D3748 → #4A5568 |
| social | #6366F1 | #8B5CF6 | #EC4899 | #6366F1 → #EC4899 |
| party | #F59E0B | #EF4444 | #8B5CF6 | #F59E0B → #EF4444 |
| networking | #0D9488 | #059669 | #10B981 | #0D9488 → #10B981 |
| fitness | #EF4444 | #F97316 | #FBBF24 | #EF4444 → #F97316 |
| tech | #3B82F6 | #6366F1 | #8B5CF6 | #3B82F6 → #8B5CF6 |
| cultural | #8B5CF6 | #A855F7 | #D946EF | #8B5CF6 → #D946EF |
| outdoor | #22C55E | #16A34A | #84CC16 | #22C55E → #84CC16 |
| custom | Definido pelo organizador | - | - | - |

### 2.4.4 Fluxo do Organizador

```
1. Organizador cria evento
2. Seleciona TEMA (ou "Customizado")
3. Sistema aplica:
   - Interações padrão do tema
   - Cores e visual
   - Configurações de comportamento
4. Organizador pode ajustar:
   - Habilitar/desabilitar interações (dentro do permitido pelo tema)
   - Configurar raio GPS
   - Habilitar/desabilitar features sociais
5. Evento publicado com tema aplicado
```

### 2.4.5 Experiência do Usuário por Tema

**Tema Romance (💕):**
- Card de evento com borda rosa
- Animação de coração no match
- Mensagem: "É Match! Vocês combinaram 💕"
- Interações focadas em paquera

**Tema Profissional (💼):**
- Visual clean, cores neutras
- Sem animações exageradas
- Mensagem: "Conexão feita! 🤝"
- Interações focadas em network

**Tema Festa (🎊):**
- Visual vibrante, cores quentes
- Confetes no match
- Mensagem: "MATCH! 🎉🔥"
- Todas interações disponíveis

### 2.4.6 API de Temas

```typescript
// GET /themes - Lista todos os temas disponíveis
// GET /themes/:id - Detalhes de um tema
// GET /events/:id/theme - Tema do evento
// PATCH /events/:id/theme - Atualizar tema do evento (organizador)

interface ThemeConfig {
  theme_id: ThemeId;
  enabled_interactions: InteractionType[];
  custom_colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  custom_labels?: {
    match_message?: string;
    presence_label?: string;
    checkin_label?: string;
  };
}
```

### 2.4.7 Database Schema (Temas)

```sql
-- Tabela de temas (referência)
themes (
  id VARCHAR PRIMARY KEY,     -- 'romantic', 'professional', etc.
  name VARCHAR NOT NULL,
  icon VARCHAR NOT NULL,
  description TEXT,
  default_interactions JSONB, -- ['fire', 'highfive', 'champagne']
  blocked_interactions JSONB, -- ['briefcase'] para tema romantic
  colors JSONB,               -- { primary, secondary, accent, gradient }
  labels JSONB,               -- { match_message, presence_label, checkin_label }
  config JSONB,               -- { show_intentions, allow_anonymous, enable_chat }
  created_at TIMESTAMP
)

-- Evento com tema
events (
  ...
  theme_id VARCHAR REFERENCES themes(id) DEFAULT 'social',
  theme_config JSONB,         -- Customizações do organizador
  ...
)
```

---

## 3. Sistema de Match (NOVO - CORE FEATURE)

### 3.1 Fluxo de Match no Evento

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MATCH NO EVENTO - FLUXO COMPLETO                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  FASE 1: PRÉ-EVENTO                                                │
│  ─────────────────                                                  │
│  1. Usuário A confirma presença no evento                          │
│  2. A vê lista de outros confirmados                               │
│  3. A curte B (escolhe ícone: 🔥 ou 🤝 ou ✋)                       │
│  4. B também curte A (mesmo ícone ou diferente)                    │
│  5. Sistema registra: MATCH PENDENTE                                │
│  6. NENHUM dos dois sabe ainda! (SUSPENSE)                         │
│                                                                     │
│  FASE 2: NO EVENTO (CHECK-IN)                                      │
│  ────────────────────────────                                       │
│  7. Usuário A faz check-in (GPS valida localização)                │
│  8. Sistema verifica: A tem matches pendentes?                     │
│  9. Usuário B faz check-in                                         │
│  10. Sistema detecta: AMBOS com check-in + match pendente          │
│  11. MATCH REVELADO! 🎉                                             │
│                                                                     │
│  FASE 3: PÓS-MATCH                                                 │
│  ────────────────                                                   │
│  12. Push notification para AMBOS                                  │
│  13. Chat liberado (duração: 7 dias)                               │
│  14. Podem trocar contatos                                         │
│  15. Após 7 dias, chat expira (a menos que troquem contato)       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Curtida no Evento (Sem Match Prévio)

```
┌─────────────────────────────────────────────────────────────────────┐
│               CURTIDA NO EVENTO (SEM MATCH PRÉVIO)                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Usuário A faz check-in no evento                               │
│  2. A recebe notificação: "X pessoas curtiram você" (ANÔNIMO)      │
│     - Não revela QUEM curtiu                                       │
│     - Só mostra quantidade                                         │
│                                                                     │
│  3. A pode curtir pessoas de volta:                                │
│     - GRATUITO: Até 3 curtidas de volta por evento                │
│     - PREMIUM: Curtidas ilimitadas                                 │
│     - CRÉDITOS: Comprar curtidas avulsas                          │
│                                                                     │
│  4. Se A curte B e B já tinha curtido A:                          │
│     - MATCH INSTANTÂNEO! 🎉                                        │
│     - Chat liberado (7 dias)                                       │
│                                                                     │
│  5. Se A curte B mas B ainda não curtiu:                          │
│     - B recebe notificação anônima                                │
│     - Aguarda B curtir de volta                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 ReMatch (Pós-Evento) - Segunda Chance

```
┌─────────────────────────────────────────────────────────────────────┐
│                   REMATCH - SEGUNDA CHANCE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CONCEITO:                                                          │
│  Duas pessoas estiveram no MESMO EVENTO mas NÃO deram match.       │
│  Pode ter rolado olhares, conversa, mas não conectaram no app.     │
│  O algoritmo oferece "segunda chance" de conexão.                  │
│                                                                     │
│  FLUXO:                                                             │
│  1. Evento termina                                                 │
│  2. Sistema identifica: A e B fizeram check-in no mesmo evento    │
│  3. A e B NÃO tiveram match no evento                             │
│  4. Até 7 dias depois, app mostra:                                │
│     "Pessoas do [Evento X] que você pode conhecer"                │
│  5. A curte B                                                      │
│  6. B recebe notificação: "Alguém do [Evento X] quer conectar"   │
│  7. Se B curte de volta: REMATCH! Chat liberado                   │
│                                                                     │
│  JANELA: 7 dias após o evento                                      │
│  LIMITE: X ReMatch requests por dia (evitar spam)                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Chat do Match

| Aspecto | Especificação |
|---------|---------------|
| **Duração** | 7 dias após match (expira se não trocar contato) |
| **Conteúdo permitido** | Texto, fotos, áudio, localização |
| **Controle de mídia** | Usuário escolhe se aceita receber imagens/vídeos |
| **Moderação** | IA para detectar conteúdo abusivo (nudez, assédio) |
| **Extensão** | Se trocar contato (Instagram, telefone), pode estender |

---

## 4. Sistema de Check-in

### 4.1 Check-in por GPS

```typescript
interface CheckIn {
  id: string;
  user_id: string;
  event_id: string;
  timestamp_start: Date;
  timestamp_end?: Date;
  location: {
    lat: number;
    lng: number;
  };
  validated: boolean;
  validation_method: 'gps' | 'qr_code' | 'manual';
}

// Regras de Validação GPS:
// 1. Raio configurável pelo organizador (mínimo 200m)
// 2. Verificar se usuário está dentro do raio
// 3. Permitir margem de erro de GPS (±50m)
// 4. Fallback: QR code se GPS não funcionar
```

### 4.2 Check-in por QR Code

O organizador pode gerar QR code para validação:

1. Gera QR code único do evento
2. Usuário escaneia no local
3. Valida presença sem depender de GPS
4. Útil para eventos indoor

### 4.3 Regras de Check-in

| Regra | Valor |
|-------|-------|
| Raio mínimo | 200m (configurável) |
| Raio máximo | 1km |
| Check-in antecipado | Não permitido |
| Limite de check-ins ativos | 1 por vez |
| Expiração automática | Quando evento termina |
| Check-out manual | Permitido |

---

## 5. Sistema de Confirmação de Presença

### 5.1 Confirmar Presença (Pré-Evento)

```typescript
interface Presence {
  id: string;
  user_id: string;
  event_id: string;
  status: 'going' | 'interested' | 'maybe';
  visibility: 'public' | 'friends' | 'private';
  intentions: InteractionType[]; // ['fire', 'handshake']
  status_text?: string; // "Animado para o evento!"
  created_at: Date;
}
```

### 5.2 Status do Perfil (por evento)

**Opções pré-definidas:**
- "Animado para o evento!"
- "Querendo conhecer gente nova"
- "Buscando conexões profissionais"
- "Só curtindo a vibe"
- "Com amigos, mas aberto a novos"

**Campo customizado:**
- Texto livre (max 100 caracteres)
- Ex: "Procurando co-founder pra startup de fintech"

---

## 6. Features do Organizador (Dashboard)

### 6.1 Painel Principal

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD DO ORGANIZADOR                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  MÉTRICAS EM TEMPO REAL                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │   847   │ │   234   │ │   156   │ │   67%   │ │   42%   │      │
│  │Confirm. │ │Check-ins│ │ Matches │ │Compar.  │ │🔥 Int.  │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                                     │
│  INTERESSES DO PÚBLICO (Anônimo)                                   │
│  ┌─────────────────────────────────────────────────┐               │
│  │ 🔥 Paquera    ████████████████░░░░  42%         │               │
│  │ 🤝 Network    ██████████░░░░░░░░░░  28%         │               │
│  │ ✋ Amizade    ████████░░░░░░░░░░░░  20%         │               │
│  │ 💼 Negócios   ████░░░░░░░░░░░░░░░░  10%         │               │
│  └─────────────────────────────────────────────────┘               │
│                                                                     │
│  AÇÕES RÁPIDAS                                                     │
│  [Gerar QR Code] [Habilitar Chat Live] [Exportar Dados]           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Configurações do Evento

| Configuração | Opções |
|--------------|--------|
| **Tema/Vibe** | Social, Profissional, Misto |
| **Interações disponíveis** | Selecionar quais ícones habilitar |
| **Raio GPS** | 200m a 1km |
| **Chat Live** | Desabilitado / Público / Moderado / Por tópicos |
| **Stories do evento** | Habilitado / Desabilitado |
| **Feed do evento** | Habilitado / Desabilitado |
| **Visibilidade de dados** | Só anonimizado / Nominal (se usuário permitir) |

### 6.3 Chat Live do Evento

| Modo | Descrição |
|------|-----------|
| **Desabilitado** | Sem chat |
| **Público** | Todos veem e mandam mensagens |
| **Moderado** | Organizador aprova mensagens |
| **Por Tópicos** | Sub-chats por área/tema |

### 6.4 Insights de Interesses

O organizador pode ver:

**Estatísticas anonimizadas (sempre):**
- % de cada tipo de interesse
- Trending: o que está bombando
- Comparativo com eventos anteriores

**Dados nominais (se usuário permitir):**
- Quem tem qual interesse
- Para ações de engajamento personalizadas

---

## 7. Features Sociais do Evento

### 7.1 Stories do Evento (Contextuais)

```
CONCEITO:
- Stories NÃO são rede social geral
- Stories existem APENAS no contexto do EVENTO
- Quem confirmou presença vê stories de outros confirmados
- Stories somem 24h APÓS O EVENTO

REGRAS:
- Organizador habilita/desabilita
- Moderação de conteúdo (IA)
- Vinculados ao evento específico
- Não é feed permanente
```

### 7.2 Feed do Evento

```
CONCEITO:
- Feed TEMPORÁRIO do evento
- Posts, fotos, textos
- Likes e comentários
- Desaparece 7 dias após evento

TIPOS DE POST:
- Texto simples
- Foto com legenda
- "Estou procurando..." (busca de conexões)
- "Alguém quer..." (dividir algo)
```

---

## 8. Features Premium (Monetização B2C)

### 8.1 Tabela de Features

| Feature | FREE | PREMIUM |
|---------|------|---------|
| Confirmar presença | ✅ | ✅ |
| Ver quem confirmou | ✅ | ✅ |
| Curtir pessoas | ✅ 10/dia | ✅ Ilimitado |
| Ver quem curtiu você | ❌ Só quantidade | ✅ Ver perfis |
| Curtir de volta no evento | ✅ 3 por evento | ✅ Ilimitado |
| Boost de visibilidade | ❌ | ✅ |
| Filtros avançados | ❌ | ✅ Por interesse, idade |
| Modo fantasma | ❌ | ✅ Invisível na lista |
| Chat estendido | 7 dias | 30 dias |
| ReMatch ilimitado | ❌ 3/dia | ✅ |

### 8.2 Sistema de Créditos

Além da assinatura, usuário pode comprar créditos avulsos:

| Pacote | Preço | Créditos |
|--------|-------|----------|
| Starter | R$ 9,90 | 10 créditos |
| Popular | R$ 24,90 | 30 créditos |
| Power | R$ 49,90 | 70 créditos |

**Uso de créditos:**
- 1 crédito = 1 curtida extra
- 3 créditos = 1 boost (aparecer primeiro)
- 5 créditos = ver quem curtiu (1x)

---

## 9. Perfil do Usuário

### 9.1 Informações do Perfil

```typescript
interface UserProfile {
  // Básico (do Instagram)
  id: string;
  instagram_handle: string;
  name: string;
  photo_url: string;
  bio: string;

  // CheckMate específico
  intentions: InteractionType[]; // Padrão do usuário
  status_default?: string;

  // Configurações
  visibility: 'public' | 'friends' | 'private';
  accept_media: boolean; // Aceita receber fotos/vídeos no chat
  ghost_mode: boolean; // Modo fantasma (premium)

  // Estatísticas
  total_checkins: number;
  total_matches: number;
  events_attended: number;
  member_since: Date;
}
```

### 9.2 Privacidade

| Configuração | Opções |
|--------------|--------|
| Visibilidade do perfil | Público / Só confirmados / Privado |
| Aceitar mídia no chat | Sim / Não |
| Modo fantasma | Sim (premium) / Não |
| Quem pode curtir | Todos / Só quem confirmou / Ninguém |

---

## 10. Notificações

### 10.1 Push Notifications (Críticas)

| Evento | Notificação | Prioridade |
|--------|-------------|------------|
| Match revelado | "Match! Você e [Nome] combinaram no [Evento]!" | 🔴 Alta |
| Nova mensagem | "[Nome] enviou uma mensagem" | 🔴 Alta |
| Alguém curtiu você | "Alguém no [Evento] curtiu você" | 🟡 Média |
| Evento começando | "[Evento] começa em 1 hora!" | 🟡 Média |
| ReMatch sugestão | "Pessoas do [Evento] que você pode conhecer" | 🟢 Baixa |

### 10.2 WebSocket Events (Real-time)

```typescript
// Eventos em tempo real
socket.on('new_checkin', { event_id, user }); // Nova pessoa chegou
socket.on('match_revealed', { match }); // Match revelado
socket.on('new_message', { chat_id, message }); // Nova mensagem
socket.on('someone_liked_you', { event_id, count }); // Curtida recebida
```

---

## 11. Integrações

### 11.1 MVP (Obrigatório)

| Integração | Uso |
|------------|-----|
| **Instagram OAuth** | Login, foto, nome, bio |
| **Google Maps API** | Geolocalização, validação de check-in |
| **Sympla API** | Importar eventos, validar ingressos |
| **Eventbrite API** | Importar eventos, validar ingressos |

### 11.2 Pós-MVP

| Integração | Uso |
|------------|-----|
| Spotify API | Mostrar música, interesses em comum |
| LinkedIn API | Contexto profissional |
| Apple/Google Pay | Compras in-app |
| Firebase Cloud Messaging | Push notifications |
| AWS SES / SendGrid | Emails transacionais |

---

## 12. Moderação e Segurança

### 12.1 IA de Moderação

```typescript
interface ContentModeration {
  // Tipos de conteúdo moderado
  types: [
    'nudity',       // Nudez/conteúdo sexual
    'harassment',   // Assédio verbal
    'spam',         // Spam/propaganda
    'hate_speech',  // Discurso de ódio
    'violence'      // Violência
  ];

  // Ações
  actions: {
    'flag': 'Marcar para revisão',
    'blur': 'Borrar imagem',
    'block': 'Bloquear envio',
    'ban': 'Banir usuário'
  };
}
```

### 12.2 Controles do Usuário

| Controle | Descrição |
|----------|-----------|
| Bloquear usuário | Não recebe mais interações desta pessoa |
| Denunciar | Reportar comportamento inadequado |
| Controlar mídia | Escolher se aceita fotos/vídeos |
| Modo fantasma | Participar sem aparecer na lista (premium) |

---

## 13. Matriz de Features por Fase

### MVP (Mês 1-4)
| Feature | Prioridade |
|---------|------------|
| ✅ Login Instagram | P0 |
| ✅ Perfil básico | P0 |
| ✅ Confirmar presença | P0 |
| ✅ Sistema de curtidas com intenção | P0 |
| ✅ Check-in GPS | P0 |
| ✅ Match revelado no check-in | P0 |
| ✅ Chat básico (7 dias) | P0 |
| ✅ Dashboard organizador básico | P0 |
| ✅ Integração Sympla | P1 |
| ✅ Push notifications | P1 |

### V1.0 (Mês 5-6)
| Feature | Prioridade |
|---------|------------|
| 🔄 ReMatch pós-evento | P1 |
| 🔄 Chat live do evento | P1 |
| 🔄 Stories do evento | P1 |
| 🔄 Feed do evento | P1 |
| 🔄 Premium B2C | P1 |
| 🔄 Sistema de créditos | P1 |

### V1.5 (Mês 7-9)
| Feature | Prioridade |
|---------|------------|
| 📅 IA de moderação | P2 |
| 📅 Analytics avançado | P2 |
| 📅 White-label | P2 |
| 📅 API pública | P2 |

---

**Documento de Features v2.0 - CheckMate**
*Atualizado após sessão de alinhamento*
