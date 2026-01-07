# Mobile App Specification - CheckMate

> **Versao:** 1.0
> **Stack:** React Native + Expo + NativeWind
> **Plataformas:** iOS 14+ / Android 10+

---

## Estrutura de Navegacao

```
┌─────────────────────────────────────────────────────────────┐
│                     NAVEGACAO PRINCIPAL                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Auth Stack]           [Main Stack]                         │
│  ├── Welcome            ├── Tab Navigator                    │
│  ├── InstagramLogin     │   ├── Home (Eventos)               │
│  └── CreateProfile      │   ├── Matches                      │
│                         │   └── Profile                      │
│                         │                                    │
│                         ├── Event Detail                     │
│                         ├── Attendees List                   │
│                         ├── User Profile (outro)             │
│                         ├── Chat                             │
│                         ├── Settings                         │
│                         └── Premium/Credits                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Telas Detalhadas

### 1. Auth Stack

#### 1.1 Welcome Screen
- Logo CheckMate
- Tagline: "Descubra quem esta onde. Conecte-se com intencao."
- Botao: "Entrar com Instagram"
- Footer: Termos de uso e politica de privacidade

#### 1.2 Instagram Login
- WebView com OAuth do Instagram
- Loading durante autenticacao
- Tratamento de erros

#### 1.3 Create Profile (para novos usuarios)
- Foto (importada do Instagram, editavel)
- Nome (pre-preenchido do Instagram)
- Bio (max 150 caracteres)
- Intencoes padrao:
  - [ ] Fire (Paquera)
  - [ ] Handshake (Networking)
  - [ ] HighFive (Amizade)
- Botao: "Criar Perfil"

---

### 2. Home (Eventos)

#### 2.1 Lista de Eventos
**Header:**
- Localizacao atual (clicavel para mudar)
- Filtros (Data, Categoria)

**Lista:**
```
┌──────────────────────────────────────────┐
│ [Imagem do Evento]                       │
│ Tech Meetup SP                           │
│ 15 Jan · 19h · Google Brasil             │
│ 150 confirmados · 5 amigos vao           │
│ [Tag: Tech] [Tag: Networking]            │
└──────────────────────────────────────────┘
```

**FAB:** Buscar eventos

---

### 3. Event Detail

#### 3.1 Header do Evento
- Imagem grande (hero)
- Nome do evento
- Data e horario
- Local (com mapa clicavel)
- Organizador

#### 3.2 Status da Minha Presenca
**Nao confirmado:**
```
┌──────────────────────────────────────────┐
│ Confirmar Presenca                       │
│                                          │
│ Suas intencoes para este evento:         │
│ [Fire] [Handshake] [HighFive]           │
│                                          │
│ Status (opcional):                       │
│ [________________]                       │
│                                          │
│ [   CONFIRMAR PRESENCA   ]               │
└──────────────────────────────────────────┘
```

**Confirmado, nao check-in:**
```
┌──────────────────────────────────────────┐
│ Voce esta confirmado!                    │
│ Intencoes: Fire, Handshake              │
│ Status: "Animado!"                       │
│                                          │
│ [   FAZER CHECK-IN   ]                   │
│ (Disponivel quando estiver no local)     │
└──────────────────────────────────────────┘
```

**Check-in feito:**
```
┌──────────────────────────────────────────┐
│ Voce esta no evento!                     │
│ Check-in: 19:35                          │
│                                          │
│ Matches revelados: 2                     │
│ [Ver matches]                            │
│                                          │
│ [   FAZER CHECK-OUT   ]                  │
└──────────────────────────────────────────┘
```

#### 3.3 Lista de Participantes
- Tabs: "Confirmados" | "No evento agora"
- Filtros: "Todos" | "Amigos" | "Por intencao"
- Cards de usuarios:
```
┌──────────────────────────────────────────┐
│ [Avatar] Maria Santos                    │
│          @mariasantos · 3 amigos em comum│
│          Fire Handshake                 │
│          "Procurando conhecer devs!"     │
│                                    [Fire]│
└──────────────────────────────────────────┘
```

#### 3.4 Interacao (Curtir)
- Botao de curtida com icone de intencao
- Confirmacao: "Curtir Maria com Fire?"
- Feedback: "Curtida enviada! X curtidas restantes hoje"
- Se match mutuo + ambos check-in: Modal de match revelado

---

### 4. User Profile (Outro Usuario)

```
┌──────────────────────────────────────────┐
│ [Avatar Grande]                          │
│                                          │
│ Maria Santos                             │
│ @mariasantos                             │
│                                          │
│ "Desenvolvedora apaixonada por eventos   │
│  e networking. Sempre aberta a novas     │
│  conexoes!"                              │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ Intencoes: Fire Handshake HighFive      │
│                                          │
│ 3 amigos em comum                        │
│ 5 eventos em comum                       │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ [   CURTIR   ]  [   VER INSTAGRAM   ]    │
│                                          │
└──────────────────────────────────────────┘
```

---

### 5. Matches Tab

#### 5.1 Lista de Matches
**Filtros:** "Todos" | "Com chat ativo" | "Por evento"

```
┌──────────────────────────────────────────┐
│ [Avatar] Maria Santos                    │
│          Tech Meetup SP · Fire          │
│          "Oi! Te vi no evento..."        │
│          há 5 min · 2 nao lidas          │
└──────────────────────────────────────────┘
```

**Empty State:**
```
Nenhum match ainda!

Confirme presenca em eventos e curta
pessoas para criar matches.

Lembre-se: o match so e revelado quando
AMBOS fazem check-in no evento!

[Ver eventos proximos]
```

---

### 6. Chat

#### 6.1 Tela de Chat
**Header:**
- Avatar + Nome
- Evento onde deu match
- "Chat expira em 7 dias"

**Corpo:**
- Bolhas de mensagem
- Timestamps
- Indicador de "digitando..."

**Input:**
- Campo de texto
- Botao enviar
- (MVP: so texto, sem midia)

**Aviso de expiracao:**
```
┌──────────────────────────────────────────┐
│ ⚠️ Este chat expira em 2 dias            │
│    Troque contatos se quiser continuar   │
└──────────────────────────────────────────┘
```

---

### 7. Profile Tab

#### 7.1 Meu Perfil
```
┌──────────────────────────────────────────┐
│ [Avatar Grande]                          │
│ [Editar foto]                            │
│                                          │
│ Joao Silva                               │
│ @joaosilva                               │
│                                          │
│ [Editar perfil]                          │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ Estatisticas                             │
│ 15 eventos | 8 matches | 23 check-ins    │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ [Premium]    Upgrade para ver quem curtiu│
│              10 curtidas restantes hoje  │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ [Configuracoes]                          │
│ [Ajuda]                                  │
│ [Sair]                                   │
│                                          │
└──────────────────────────────────────────┘
```

#### 7.2 Editar Perfil
- Foto
- Nome
- Bio
- Intencoes padrao
- Instagram (apenas visualizar, nao editar)

---

### 8. Settings

```
┌──────────────────────────────────────────┐
│ Notificacoes                             │
│ ├── Novos matches             [ON/OFF]   │
│ ├── Mensagens                 [ON/OFF]   │
│ ├── Amigos confirmaram        [ON/OFF]   │
│ └── Lembretes de eventos      [ON/OFF]   │
│                                          │
│ Privacidade                              │
│ ├── Aparecer no discovery     [ON/OFF]   │
│ └── Mostrar intencoes         [ON/OFF]   │
│                                          │
│ Conta                                    │
│ ├── [Termos de uso]                      │
│ ├── [Politica de privacidade]            │
│ ├── [Exportar meus dados]                │
│ └── [Deletar conta]                      │
│                                          │
└──────────────────────────────────────────┘
```

---

### 9. Premium/Credits

#### 9.1 Premium Screen
```
┌──────────────────────────────────────────┐
│ CheckMate Premium                        │
│                                          │
│ Beneficios:                              │
│ ✓ Curtidas ilimitadas                    │
│ ✓ Ver quem te curtiu                     │
│ ✓ Destaque no discovery                  │
│ ✓ 50 creditos/mes                        │
│                                          │
│ R$ 19,90/mes                             │
│                                          │
│ [   ASSINAR PREMIUM   ]                  │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ Ou compre creditos avulsos:              │
│ 10 creditos - R$ 9,90                    │
│ 30 creditos - R$ 24,90                   │
│ 100 creditos - R$ 69,90                  │
│                                          │
└──────────────────────────────────────────┘
```

---

## Modais e Overlays

### Modal: Match Revelado
```
┌──────────────────────────────────────────┐
│                                          │
│              [Avatar Maria]              │
│                                          │
│           E MATCH!                      │
│                                          │
│    Voce e Maria deram match             │
│    no Tech Meetup SP!                    │
│                                          │
│           Fire                          │
│                                          │
│ [   MANDAR MENSAGEM   ]                  │
│                                          │
│        Continuar explorando              │
│                                          │
└──────────────────────────────────────────┘
```

### Modal: Check-in
```
┌──────────────────────────────────────────┐
│                                          │
│ Fazer Check-in                           │
│                                          │
│ Tech Meetup SP                           │
│ Google Brasil                            │
│                                          │
│ Verificando localizacao...               │
│ [====>          ]                        │
│                                          │
│ Voce esta a 150m do evento               │
│                                          │
│ [   CONFIRMAR CHECK-IN   ]               │
│                                          │
│        Cancelar                          │
│                                          │
└──────────────────────────────────────────┘
```

### Toast: Curtida Enviada
```
┌──────────────────────────────────────────┐
│ Curtida enviada! 9 restantes hoje       │
└──────────────────────────────────────────┘
```

### Toast: Limite de Curtidas
```
┌──────────────────────────────────────────┐
│ Limite de curtidas atingido              │
│ [Upgrade para Premium]                   │
└──────────────────────────────────────────┘
```

---

## Componentes Reutilizaveis

### EventCard
- Imagem, nome, data, local
- Contadores (confirmados, amigos)
- Tags de categoria

### UserCard
- Avatar, nome, username
- Intencoes (icones)
- Status text
- Botao de curtida

### MatchCard
- Avatar, nome
- Evento do match
- Ultima mensagem
- Contador de nao lidas

### IntentionPicker
- Icones selecionaveis
- Fire, Handshake, HighFive, etc.
- Multi-select

### ChatBubble
- Texto
- Timestamp
- Sent/Received styles

---

## Estados Especiais

### Loading States
- Skeleton screens para listas
- Spinners para acoes

### Empty States
- Sem eventos proximos
- Sem matches
- Sem mensagens

### Error States
- Sem conexao
- Erro de API
- GPS desativado

### Offline Mode
- Cache de dados basicos
- Indicador de offline
- Retry automatico

---

## Gestos e Interacoes

| Gesto | Acao |
|-------|------|
| Pull-to-refresh | Atualizar lista |
| Swipe left (match) | Arquivar match |
| Long press (mensagem) | Copiar texto |
| Tap avatar | Ver perfil |
| Double tap (evento) | Confirmar presenca |

---

## Deep Links

| Link | Destino |
|------|---------|
| `checkmate://event/:id` | Detalhe do evento |
| `checkmate://match/:id` | Chat do match |
| `checkmate://profile/:id` | Perfil do usuario |
| `checkmate://checkin/:id` | Iniciar check-in |

---

## Permissoes Necessarias

| Permissao | Uso | Quando Solicitar |
|-----------|-----|------------------|
| Localizacao | Check-in GPS | Ao fazer check-in |
| Notificacoes | Push notifications | Apos primeiro match |
| Camera | Escanear QR code | Ao usar QR check-in |

---

## Performance Targets

| Metrica | Target |
|---------|--------|
| Cold start | < 3s |
| Time to interactive | < 5s |
| API response | < 500ms |
| Frame rate | 60fps |
| App size | < 50MB |

---

*Mobile App Specification v1.0 - CheckMate*
