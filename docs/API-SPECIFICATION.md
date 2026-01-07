# API Specification - CheckMate

> **Versao:** 1.0
> **Base URL:** `https://api.checkmate.app/v1`
> **Autenticacao:** Bearer Token (JWT)

---

## Autenticacao

### POST /auth/instagram
Inicia fluxo OAuth com Instagram.

**Request:**
```json
{
  "redirect_uri": "checkmate://auth/callback"
}
```

**Response:**
```json
{
  "auth_url": "https://api.instagram.com/oauth/authorize?..."
}
```

### POST /auth/instagram/callback
Processa callback do OAuth.

**Request:**
```json
{
  "code": "instagram_auth_code",
  "redirect_uri": "checkmate://auth/callback"
}
```

**Response:**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "instagram_id": "12345",
    "username": "joao",
    "name": "Joao Silva",
    "avatar_url": "https://...",
    "is_new_user": true
  }
}
```

### POST /auth/refresh
Renova access token.

**Request:**
```json
{
  "refresh_token": "refresh_token"
}
```

### POST /auth/logout
Invalida tokens.

---

## Usuarios

### GET /users/me
Retorna perfil do usuario autenticado.

**Response:**
```json
{
  "id": "uuid",
  "instagram_id": "12345",
  "username": "joao",
  "name": "Joao Silva",
  "avatar_url": "https://...",
  "bio": "Dev apaixonado por eventos",
  "default_intentions": ["fire", "handshake"],
  "settings": {
    "notifications_enabled": true,
    "show_in_discovery": true,
    "allow_messages_from": "matches"
  },
  "stats": {
    "events_attended": 15,
    "matches_count": 8,
    "checkins_count": 23
  },
  "premium": {
    "is_premium": false,
    "credits": 5
  },
  "created_at": "2026-01-01T00:00:00Z"
}
```

### PATCH /users/me
Atualiza perfil.

**Request:**
```json
{
  "name": "Joao Silva",
  "bio": "Nova bio",
  "default_intentions": ["fire", "handshake", "highfive"]
}
```

### GET /users/me/export
Exporta todos os dados do usuario (LGPD Art. 18).

**Response:**
```json
{
  "download_url": "https://api.checkmate.app/exports/user_abc123.zip",
  "expires_at": "2026-01-07T00:00:00Z",
  "includes": ["profile", "checkins", "matches", "messages", "interactions"]
}
```

**Notes:**
- Gera arquivo ZIP com todos os dados do usuario
- Link expira em 24 horas
- Limite: 1 export por dia

---

### DELETE /users/me
Solicita exclusao da conta (LGPD Art. 18).

**Response:**
```json
{
  "status": "scheduled",
  "scheduled_deletion": "2026-02-06T00:00:00Z",
  "can_cancel_until": "2026-02-05T23:59:59Z",
  "message": "Sua conta sera deletada em 30 dias. Voce pode cancelar ate 24h antes."
}
```

**Notes:**
- Periodo de graca de 30 dias antes da exclusao
- Usuario pode cancelar fazendo login novamente
- Dados sao anonimizados, nao deletados fisicamente (para integridade)

### POST /users/me/cancel-deletion
Cancela solicitacao de exclusao.

**Response:**
```json
{
  "status": "cancelled",
  "message": "Exclusao cancelada. Sua conta esta ativa novamente."
}
```

---

### GET /users/:id
Retorna perfil publico de outro usuario.

**Response:**
```json
{
  "id": "uuid",
  "username": "maria",
  "name": "Maria Santos",
  "avatar_url": "https://...",
  "bio": "...",
  "mutual_friends": 3,
  "events_in_common": ["event_id_1", "event_id_2"]
}
```

---

## Temas

### GET /themes
Lista todos os temas disponiveis.

**Response:**
```json
{
  "themes": [
    {
      "id": "romantic",
      "name": "Romance",
      "icon": "💕",
      "description": "Eventos de encontro, singles night",
      "default_interactions": ["fire", "highfive", "champagne"],
      "blocked_interactions": ["briefcase"],
      "colors": {
        "primary": "#FF6B6B",
        "secondary": "#FFE66D",
        "accent": "#FF85A1",
        "gradient": "#FF6B6B → #FF85A1"
      },
      "labels": {
        "match_message": "É Match! Vocês combinaram 💕",
        "presence_label": "Confirmado 💕",
        "checkin_label": "No evento! 🔥"
      },
      "config": {
        "show_intentions_publicly": true,
        "allow_anonymous_likes": true,
        "enable_chat_live": false
      }
    }
  ]
}
```

### GET /themes/:id
Detalhes de um tema especifico.

---

## Eventos

### GET /events
Lista eventos disponiveis.

**Query Params:**
- `lat`: Latitude (required)
- `lng`: Longitude (required)
- `radius`: Raio em metros (default: 50000)
- `date_from`: Data inicial
- `date_to`: Data final
- `category`: Categoria (tech, fitness, nightlife, etc)
- `page`: Pagina (default: 1)
- `limit`: Limite (default: 20)

**Response:**
```json
{
  "events": [
    {
      "id": "uuid",
      "name": "Tech Meetup SP",
      "description": "...",
      "image_url": "https://...",
      "start_date": "2026-01-15T19:00:00Z",
      "end_date": "2026-01-15T22:00:00Z",
      "location": {
        "name": "Google Brasil",
        "address": "Av. Paulista, 1000",
        "lat": -23.5505,
        "lng": -46.6333
      },
      "category": "tech",
      "config": {
        "theme": "romantic",
        "allowed_intentions": ["fire", "handshake"],
        "gps_radius_meters": 200,
        "chat_enabled": true
      },
      "stats": {
        "confirmed_count": 150,
        "checkedin_count": 0,
        "friends_confirmed": 5
      },
      "my_presence": null
    }
  ],
  "total": 45,
  "page": 1,
  "pages": 3
}
```

### GET /events/:id
Detalhes de um evento.

### GET /events/:id/attendees
Lista confirmados/presentes no evento.

**Query Params:**
- `status`: confirmed | checkedin | all
- `filter`: friends | friends_of_friends | all
- `page`: Pagina
- `limit`: Limite

**Response:**
```json
{
  "attendees": [
    {
      "user": {
        "id": "uuid",
        "username": "maria",
        "name": "Maria",
        "avatar_url": "https://..."
      },
      "status": "confirmed",
      "intentions": ["fire", "handshake"],
      "status_text": "Animada!",
      "confirmed_at": "2026-01-10T10:00:00Z",
      "checked_in_at": null,
      "mutual_friends": 2,
      "has_liked_me": false,
      "i_liked": false
    }
  ],
  "total": 150
}
```

---

## Presencas

### POST /events/:id/presence
Confirmar presenca no evento.

**Request:**
```json
{
  "intentions": ["fire", "handshake"],
  "status_text": "Animado pra conhecer gente!"
}
```

**Response:**
```json
{
  "id": "uuid",
  "event_id": "event_uuid",
  "user_id": "user_uuid",
  "status": "confirmed",
  "intentions": ["fire", "handshake"],
  "status_text": "Animado pra conhecer gente!",
  "confirmed_at": "2026-01-10T10:00:00Z"
}
```

### PATCH /events/:id/presence
Atualizar presenca.

### DELETE /events/:id/presence
Cancelar presenca.

---

## Check-in

### POST /events/:id/checkin
Fazer check-in no evento.

**Request:**
```json
{
  "lat": -23.5505,
  "lng": -46.6333,
  "qr_code": "optional_qr_code"
}
```

**Response:**
```json
{
  "success": true,
  "checkin": {
    "id": "uuid",
    "checked_in_at": "2026-01-15T19:30:00Z"
  },
  "matches_revealed": [
    {
      "match_id": "uuid",
      "user": {
        "id": "uuid",
        "username": "maria",
        "name": "Maria",
        "avatar_url": "https://..."
      },
      "intention": "fire",
      "matched_at": "2026-01-15T19:30:00Z"
    }
  ],
  "new_likes_count": 3
}
```

**Errors:**
- `400`: GPS fora do raio permitido
- `400`: QR code invalido
- `409`: Ja fez check-in

### DELETE /events/:id/checkin
Fazer check-out.

---

## Interacoes (Curtidas)

### POST /events/:id/interactions
Enviar curtida para alguem no evento.

**Request:**
```json
{
  "target_user_id": "uuid",
  "intention": "fire"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "pending",
  "is_match": false,
  "remaining_likes_today": 9
}
```

**Se for match mutuo E ambos fizeram check-in:**
```json
{
  "id": "uuid",
  "status": "matched",
  "is_match": true,
  "match": {
    "id": "uuid",
    "user": {...},
    "chat_enabled": true
  },
  "remaining_likes_today": 9
}
```

### GET /events/:id/interactions
Minhas interacoes no evento.

**Response:**
```json
{
  "sent": [
    {
      "id": "uuid",
      "target_user_id": "uuid",
      "intention": "fire",
      "status": "pending",
      "created_at": "..."
    }
  ],
  "received_count": 5,
  "remaining_likes_today": 7
}
```

---

## Matches

### GET /matches
Lista todos os matches.

**Response:**
```json
{
  "matches": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "username": "maria",
        "name": "Maria",
        "avatar_url": "https://..."
      },
      "event": {
        "id": "uuid",
        "name": "Tech Meetup SP"
      },
      "intention": "fire",
      "matched_at": "2026-01-15T19:30:00Z",
      "chat": {
        "enabled": true,
        "expires_at": "2026-01-22T19:30:00Z",
        "last_message": {
          "text": "Oi! Te vi no evento...",
          "sent_at": "2026-01-15T20:00:00Z",
          "is_mine": false
        },
        "unread_count": 1
      }
    }
  ],
  "total": 8
}
```

### GET /matches/:id
Detalhes de um match.

---

## Chat

### GET /matches/:match_id/messages
Lista mensagens do chat.

**Query Params:**
- `before`: Cursor para paginacao
- `limit`: Limite (default: 50)

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "sender_id": "uuid",
      "text": "Oi! Te vi no evento...",
      "created_at": "2026-01-15T20:00:00Z"
    }
  ],
  "has_more": false
}
```

### POST /matches/:match_id/messages
Enviar mensagem.

**Request:**
```json
{
  "text": "Oi! Prazer em conhecer!"
}
```

### WebSocket: /ws/chat
Conexao real-time para mensagens.

**Events:**
- `message:new` - Nova mensagem recebida
- `message:read` - Mensagem lida
- `typing:start` - Usuario digitando
- `typing:stop` - Parou de digitar

---

## Premium/Creditos

### GET /premium/status
Status premium do usuario.

**Response:**
```json
{
  "is_premium": false,
  "plan": null,
  "expires_at": null,
  "credits": 5,
  "features": {
    "daily_likes_limit": 10,
    "can_see_who_liked": false,
    "unlimited_likes": false
  }
}
```

### GET /premium/plans
Lista planos disponiveis.

### POST /premium/subscribe
Assinar premium.

### POST /credits/purchase
Comprar creditos.

---

## Organizador

### GET /organizer/events
Lista eventos do organizador.

### POST /organizer/events
Criar evento.

**Request:**
```json
{
  "name": "Tech Meetup SP",
  "description": "...",
  "image_url": "https://...",
  "start_date": "2026-01-15T19:00:00Z",
  "end_date": "2026-01-15T22:00:00Z",
  "location": {
    "name": "Google Brasil",
    "address": "Av. Paulista, 1000",
    "lat": -23.5505,
    "lng": -46.6333
  },
  "category": "tech",
  "config": {
    "theme": "professional",
    "allowed_intentions": ["handshake", "briefcase"],
    "gps_radius_meters": 300,
    "chat_enabled": true,
    "checkin_mode": "gps_or_qr"
  }
}
```

### GET /organizer/events/:id/dashboard
Dashboard do evento.

**Response:**
```json
{
  "event": {...},
  "stats": {
    "confirmed_total": 150,
    "checkedin_total": 87,
    "checkedin_now": 65,
    "matches_total": 23,
    "interactions_total": 156,
    "avg_time_minutes": 95
  },
  "intentions_breakdown": {
    "fire": 45,
    "handshake": 78,
    "highfive": 33
  },
  "timeline": [
    {"hour": "19:00", "checkins": 12},
    {"hour": "20:00", "checkins": 45},
    {"hour": "21:00", "checkins": 30}
  ],
  "top_connectors": [
    {"user_id": "uuid", "username": "maria", "matches": 5}
  ]
}
```

### GET /organizer/events/:id/qrcode
Gerar QR code do evento.

---

## Notificacoes

### GET /notifications
Lista notificacoes.

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "match_revealed",
      "title": "Novo Match!",
      "body": "Voce e Maria deram match no Tech Meetup!",
      "data": {
        "match_id": "uuid",
        "event_id": "uuid"
      },
      "read": false,
      "created_at": "..."
    }
  ]
}
```

### PATCH /notifications/:id/read
Marcar como lida.

### POST /notifications/device
Registrar device para push.

**Request:**
```json
{
  "token": "fcm_token",
  "platform": "ios" | "android"
}
```

---

## Codigos de Erro

| Codigo | Descricao |
|--------|-----------|
| 400 | Bad Request - Dados invalidos |
| 401 | Unauthorized - Token invalido/expirado |
| 403 | Forbidden - Sem permissao |
| 404 | Not Found - Recurso nao encontrado |
| 409 | Conflict - Conflito (ex: ja existe) |
| 422 | Unprocessable - Validacao falhou |
| 429 | Too Many Requests - Rate limit |
| 500 | Internal Error - Erro interno |

**Formato de Erro:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados invalidos",
    "details": [
      {"field": "email", "message": "Email invalido"}
    ]
  }
}
```

---

## Rate Limits

| Endpoint | Limite |
|----------|--------|
| /auth/* | 10/min |
| /events | 60/min |
| /interactions | 20/min |
| /messages | 30/min |
| Geral | 120/min |

---

## WebSocket Events

### Conexao
```
wss://api.checkmate.app/ws?token=JWT_TOKEN
```

### Eventos Recebidos
- `match:revealed` - Match foi revelado
- `like:received` - Alguem te curtiu (anonimo)
- `message:new` - Nova mensagem
- `checkin:friend` - Amigo fez check-in

### Eventos Enviados
- `message:send` - Enviar mensagem
- `typing:start` - Comecei a digitar
- `presence:update` - Atualizar presenca

---

*API Specification v1.0 - CheckMate*
