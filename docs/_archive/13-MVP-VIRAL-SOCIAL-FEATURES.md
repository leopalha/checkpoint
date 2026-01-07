# Check Point - MVP Viral & Social Features

## 🎯 Filosofia Central

> **"As pessoas querem aparecer. Dê a elas a ferramenta perfeita para isso."**

Check Point não é só um app de networking - é uma **ferramenta de status social**.

---

## 1. O Conceito: Check Point como Status

### Por que as pessoas vão QUERER usar:

```
PSICOLOGIA DO USUÁRIO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. FOMO (Fear of Missing Out)
   └── "Todo mundo tá usando, eu também quero"
   
2. STATUS SOCIAL
   └── "Mostrar que estou em eventos legais"
   
3. EXCLUSIVIDADE
   └── "Estou na lista VIP, sou especial"
   
4. VALIDAÇÃO
   └── "Olha quantas conexões eu fiz"
   
5. PERTENCIMENTO
   └── "Faço parte dessa comunidade"

O APP TEM QUE PARECER:
├── Premium (não pode parecer app de cupom)
├── Exclusivo (tipo convite do Clubhouse no início)
├── Cool (algo que influenciadores usariam)
├── Elegante (design impecável)
└── Útil (resolver problema real)
```

---

## 2. Fluxo Completo: Da Lista ao Evento

### 2.1 Jornada do Usuário VIP

```
TIMELINE DO EVENTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 7 DIAS ANTES
│
├── Organizador cria evento no Check Point
├── Ativa "Lista VIP" ou "Lista de Presença"
├── Compartilha link exclusivo
│
▼
📅 5 DIAS ANTES
│
├── Influenciador/VIP recebe link
├── Abre o app → "Confirmar presença"
├── Escolhe tipo: "VIP ⭐" ou "Lista ✓"
├── Personaliza card de compartilhamento
├── Compartilha nos Stories
│   └── "Já confirmei presença no [Evento]"
│
▼
📅 1 DIA ANTES
│
├── Push: "Amanhã! 5 amigos confirmaram"
├── Usuário pode ver quem mais vai
├── "Fulano também confirmou" → FOMO
│
▼
📅 DIA DO EVENTO
│
├── Push: "[Evento] começa em 2 horas!"
├── Ao chegar: "Fazer Check-in de chegada"
├── QR code valida entrada VIP
├── Compartilha: "Cheguei! 🔥"
│
▼
📅 DURANTE O EVENTO
│
├── Ver quem está aqui agora
├── Chat temporário com presentes
├── Encontrar amigos no mapa
├── Descobrir pessoas com interesses
│
▼
📅 APÓS O EVENTO
│
├── Resumo: "Você conheceu 12 pessoas"
├── ReMatch com quem encontrou
├── Compartilha: "Meu Check Point do [Evento]"
│   └── Card com stats bonito (tipo Wrapped)
│
▼
📅 ATÉ 7 DIAS DEPOIS
│
└── Janela de ReMatch aberta
    └── Reconectar com quem conheceu
```

---

## 3. Sistema de Lista de Presença

### 3.1 Tipos de Confirmação

```
NÍVEIS DE PRESENÇA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│                                                     │
│  Como você vai para o evento?                       │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  ⭐ VIP                                       │  │
│  │     Lista exclusiva, entrada prioritária      │  │
│  │     Badge dourado no perfil                   │  │
│  │     [Selecionar]                              │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  ✓ Lista                                      │  │
│  │     Confirmado na lista de presença           │  │
│  │     Badge prata no perfil                     │  │
│  │     [Selecionar]                              │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  👀 Interessado                               │  │
│  │     Talvez eu vá, me avise                    │  │
│  │     Sem badge                                 │  │
│  │     [Selecionar]                              │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

COMPORTAMENTOS:

⭐ VIP:
├── Aparece com destaque na lista
├── Badge dourado ⭐ no evento
├── Pode ter benefícios (desconto, fila preferencial)
├── Stories tem template especial "VIP"
├── Primeiro na ordenação do discovery
└── Organizador pode aprovar/rejeitar

✓ LISTA:
├── Confirmado na lista de presença
├── Badge ✓ no evento
├── Stories tem template "Confirmado"
└── Aparece na lista pública

👀 INTERESSADO:
├── Recebe notificações do evento
├── Não aparece na lista pública
├── Pode mudar para Lista/VIP depois
└── Não gera card de compartilhamento
```

### 3.2 Configuração pelo Organizador

```
DASHBOARD: Configurar Lista
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│  Tech Meetup SP - Configurar Lista                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  TIPOS DE LISTA HABILITADOS                         │
│  ┌─────────────────────────────────────────────┐    │
│  │ ☑ Lista VIP                                 │    │
│  │   Limite: [50] pessoas                      │    │
│  │   Aprovação: [●] Manual  [○] Automática    │    │
│  │   Benefício: [Entrada prioritária       ▼] │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ ☑ Lista Geral                               │    │
│  │   Limite: [200] pessoas                     │    │
│  │   Aprovação: [○] Manual  [●] Automática    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ ☐ Lista de Espera                           │    │
│  │   Quando lista cheia, pessoas entram aqui   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  LINKS DE COMPARTILHAMENTO                          │
│                                                     │
│  Lista VIP (privado):                               │
│  checkpoint.app/e/tech-meetup/vip?invite=Xk9f2     │
│  [Copiar] [QR Code] [Resetar]                       │
│                                                     │
│  Lista Geral (público):                             │
│  checkpoint.app/e/tech-meetup                       │
│  [Copiar] [QR Code] [Embed]                         │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  PERSONALIZAÇÃO DO CARD                             │
│                                                     │
│  [Ver preview] [Customizar cores]                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. Templates de Compartilhamento (Stories)

### 4.1 Filosofia do Design

```
PRINCÍPIOS DOS TEMPLATES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. INSTAGRAM-NATIVE
   ├── Proporção 9:16 (1080x1920)
   ├── Área segura para texto
   ├── Espaço para stickers do Instagram
   └── Cores que funcionam em qualquer fundo

2. PREMIUM, NÃO GENÉRICO
   ├── Sem parecer "feito por app"
   ├── Tipografia elegante
   ├── Animações sutis (para vídeo)
   └── Personalizável mas bonito por padrão

3. MINIMALISTA COM IMPACTO
   ├── Pouca informação, bem destacada
   ├── Foco no que importa: nome, evento, status
   └── Espaço para foto do usuário brilhar

4. COMPARTILHÁVEL
   ├── As pessoas têm que QUERER postar
   ├── Tem que parecer status
   ├── Não pode parecer propaganda
   └── Tem que ser "aesthetic"
```

### 4.2 Template: Confirmei Presença (Pré-evento)

```
TEMPLATE: "Confirmei" (Vertical Story)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│         ┌───────────────┐           │
│         │               │           │
│         │    [FOTO      │           │
│         │   CIRCULAR    │           │
│         │   DO USER]    │           │
│         │               │           │
│         └───────────────┘           │
│               ⭐                    │  ← Badge VIP (dourado, brilha)
│                                     │
│                                     │
│     ─────────────────────────       │
│                                     │
│         CONFIRMADO                  │  ← Tipografia bold, elegante
│                                     │
│     ─────────────────────────       │
│                                     │
│                                     │
│       TECH MEETUP SP                │  ← Nome do evento
│       15 de Janeiro · 19h           │  ← Data/hora
│                                     │
│                                     │
│                                     │
│                                     │
│       ┌─────────────────────┐       │
│       │   📍 checkpoint.app │       │  ← CTA discreto
│       └─────────────────────┘       │
│                                     │
│                                     │
└─────────────────────────────────────┘

VARIAÇÕES DE COR:
├── Dark mode (fundo escuro, texto claro) - PADRÃO
├── Light mode (fundo claro, texto escuro)
├── Gradient (gradiente suave)
├── Event brand (cores do evento)
└── Neon (para festas/baladas)

ELEMENTOS ANIMADOS (se exportar como vídeo):
├── Badge ⭐ pulsa suavemente
├── Texto faz fade in
├── Partículas sutis no fundo
└── Duração: 3-5 segundos loop
```

### 4.3 Template: VIP Status

```
TEMPLATE: "VIP" (Vertical Story)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────┐
│                                     │
│ ✧ · · · · · · · · · · · · · · · ✧  │  ← Borda dourada sutil
│                                     │
│                                     │
│         ┌───────────────┐           │
│         │               │           │
│         │    [FOTO]     │           │
│         │               │           │
│         └───────────────┘           │
│                                     │
│           @username                 │
│                                     │
│                                     │
│     ╔═══════════════════════╗       │
│     ║                       ║       │
│     ║    ⭐ LISTA VIP ⭐    ║       │  ← Dourado, premium
│     ║                       ║       │
│     ╚═══════════════════════╝       │
│                                     │
│                                     │
│       TECH MEETUP SP                │
│       15 Jan · 19h                  │
│                                     │
│                                     │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                     │
│       Você também vai?              │  ← CTA social
│       checkpoint.app/e/xyz          │
│                                     │
│                                     │
│ ✧ · · · · · · · · · · · · · · · ✧  │
│                                     │
└─────────────────────────────────────┘

ELEMENTOS PREMIUM:
├── Borda dourada animada (shimmer effect)
├── Estrelas ⭐ que brilham
├── Tipografia serif elegante
├── Textura sutil de papel/tecido
└── Sensação de "convite exclusivo"
```

### 4.4 Template: Cheguei! (Check-in no evento)

```
TEMPLATE: "Cheguei" (Vertical Story)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│                                     │
│              📍                     │  ← Pin animado (pulsa)
│                                     │
│                                     │
│         CHEGUEI                     │  ← Bold, grande
│                                     │
│                                     │
│     ┌───────────────────────┐       │
│     │                       │       │
│     │   TECH MEETUP SP      │       │
│     │                       │       │
│     │   ┌───┐┌───┐┌───┐     │       │
│     │   │📷││📷││📷│+47  │       │  ← Rostos de quem está lá
│     │   └───┘└───┘└───┘     │       │
│     │                       │       │
│     │   50 pessoas aqui     │       │
│     │                       │       │
│     └───────────────────────┘       │
│                                     │
│                                     │
│        AO VIVO AGORA 🔴             │  ← Indicador de live
│                                     │
│                                     │
│       ┌─────────────────────┐       │
│       │ Faça seu check-in   │       │
│       │ checkpoint.app      │       │
│       └─────────────────────┘       │
│                                     │
│                                     │
└─────────────────────────────────────┘

COMPORTAMENTO:
├── Mostra número de pessoas no evento
├── Mostra fotos de amigos que estão lá
├── Indicador "AO VIVO" pulsa
└── CTA convida outros a fazer check-in
```

### 4.5 Template: Wrap-up (Pós-evento)

```
TEMPLATE: "Meu Check Point" (Wrap-up estilo Spotify)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────┐
│                                     │
│                                     │
│        MEU CHECK POINT              │
│        ─────────────────            │
│        TECH MEETUP SP               │
│                                     │
│                                     │
│     ┌───────────────────────┐       │
│     │                       │       │
│     │        3h 45m         │       │  ← Tempo no evento
│     │     no evento 🎉     │       │
│     │                       │       │
│     └───────────────────────┘       │
│                                     │
│                                     │
│     ┌───────────────────────┐       │
│     │  12                   │       │
│     │  pessoas conhecidas   │       │  ← Novas conexões
│     │  ┌──┐┌──┐┌──┐┌──┐+8  │       │
│     │  │📷││📷││📷││📷│    │       │
│     │  └──┘└──┘└──┘└──┘    │       │
│     └───────────────────────┘       │
│                                     │
│                                     │
│     ┌───────────────────────┐       │
│     │  🔥 Top Connector     │       │  ← Badge conquistado
│     │  Top 10% do evento    │       │
│     └───────────────────────┘       │
│                                     │
│                                     │
│       checkpoint.app                │
│                                     │
│                                     │
└─────────────────────────────────────┘

DADOS INCLUÍDOS:
├── Tempo total no evento
├── Número de pessoas conhecidas
├── Fotos das conexões feitas
├── Badge/conquista do evento
├── Posição no ranking (se top)
└── Convite para outros verem suas stats
```

### 4.6 Fluxo de Personalização

```
TELA: Personalizar Card
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────┐
│  ← Compartilhar                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    [PREVIEW DO CARD]        │    │
│  │    (ao vivo, atualiza)      │    │
│  │                             │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  ESTILO                             │
│  ┌─────┐┌─────┐┌─────┐┌─────┐      │
│  │Dark ││Light││Neon ││Brand│      │
│  │ ●   ││     ││     ││     │      │
│  └─────┘└─────┘└─────┘└─────┘      │
│                                     │
│  MOSTRAR                            │
│  ☑ Minha foto                       │
│  ☑ Meu @username                    │
│  ☑ Badge VIP                        │
│  ☐ Quantas pessoas vão              │
│  ☐ Amigos que vão                   │
│                                     │
│  MENSAGEM (opcional)                │
│  ┌─────────────────────────────┐    │
│  │ Bora? 🔥                    │    │
│  └─────────────────────────────┘    │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  [  📷 Stories  ] [  💬 Direct  ]   │
│                                     │
│  [  📤 Salvar   ] [  🔗 Copiar  ]   │
│                                     │
└─────────────────────────────────────┘

COMPORTAMENTO:
├── Preview atualiza em tempo real
├── Tap no preview: fullscreen
├── "Stories": abre Instagram com imagem
├── "Direct": abre compartilhamento Instagram
├── "Salvar": salva na galeria
└── "Copiar": copia link do evento
```

---

## 5. Gamificação de Status

### 5.1 Sistema de Badges

```
BADGES NO CHECK POINT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BADGES DE PRESENÇA:
┌────────────────────────────────────────────────────┐
│ Badge          │ Critério           │ Visual      │
├────────────────────────────────────────────────────┤
│ ⭐ VIP         │ Lista VIP          │ Dourado     │
│ ✓ Confirmado   │ Lista geral        │ Prata       │
│ 📍 Presente    │ Check-in ativo     │ Verde       │
│ 🏆 Early Bird  │ Primeiro 10%       │ Bronze      │
│ 🔥 Influencer  │ +10 pessoas vieram │ Vermelho    │
│ 🌟 Connector   │ +20 ReMatches      │ Roxo        │
│ 👑 Host        │ Organizador        │ Coroa       │
└────────────────────────────────────────────────────┘

BADGES DE EVENTO (dados pelo organizador):
┌────────────────────────────────────────────────────┐
│ Badge          │ Descrição                         │
├────────────────────────────────────────────────────┤
│ 🎤 Speaker     │ Palestrante do evento             │
│ 🎨 Sponsor     │ Patrocinador                      │
│ 🎯 Staff       │ Equipe do evento                  │
│ 💎 Premium     │ Ingresso premium                  │
│ 🎁 Giveaway    │ Ganhou sorteio                    │
└────────────────────────────────────────────────────┘

BADGES DE CARREIRA (acumulados):
┌────────────────────────────────────────────────────┐
│ Badge          │ Critério                          │
├────────────────────────────────────────────────────┤
│ 🚀 Explorer    │ 10 eventos diferentes             │
│ 🌍 Globetrotter│ Eventos em 3+ cidades             │
│ 🎯 Focused     │ 5 eventos do mesmo tipo           │
│ 💫 Socialite   │ 50+ conexões totais               │
│ 🏅 OG          │ Usuário dos primeiros 1000        │
│ 📈 Rising Star │ +100% conexões no mês             │
└────────────────────────────────────────────────────┘
```

### 5.2 Ranking e Leaderboard

```
LEADERBOARD DO EVENTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────┐
│  🏆 Top Connectors                  │
│  Tech Meetup SP                     │
├─────────────────────────────────────┤
│                                     │
│  1. 👑 Marina Silva                 │
│     ⭐ VIP · 15 conexões            │
│                                     │
│  2. 🥈 João Pedro                   │
│     ✓ Lista · 12 conexões           │
│                                     │
│  3. 🥉 Ana Santos                   │
│     ✓ Lista · 10 conexões           │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  47. Você                           │
│      ⭐ VIP · 3 conexões             │
│      [Ver meu ranking]              │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  👥 Total: 124 participantes        │
│  🤝 289 conexões feitas             │
│                                     │
└─────────────────────────────────────┘

PRIVACIDADE:
├── Opt-in: usuário escolhe participar do ranking
├── Pode aparecer anônimo
└── Ranking público só mostra top 10
```

---

## 6. Chat Temporário (Durante Evento)

### 6.1 Conceito

```
CHAT EFÊMERO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILOSOFIA:
├── Chat EXISTE enquanto ambos têm check-in ativo
├── Mensagens SOMEM quando evento termina
├── Para CONTINUAR conversando: precisa fazer ReMatch
└── Cria URGÊNCIA e naturalidade

COMPORTAMENTO:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  DURANTE O EVENTO:                                  │
│  ├── Chat liberado entre pessoas com check-in      │
│  ├── Mensagens aparecem com timer                  │
│  ├── "Esta conversa expira em 2h" (fim do evento)  │
│  └── Botão: "Fazer ReMatch para continuar"         │
│                                                     │
│  APÓS O EVENTO:                                     │
│  ├── Chat some                                      │
│  ├── Push: "Quer continuar conversando com X?"     │
│  └── Se ReMatch: chat vira permanente              │
│                                                     │
└─────────────────────────────────────────────────────┘

TELA DE CHAT:
┌─────────────────────────────────────┐
│  ← Marina Silva              ⏱ 2h  │  ← Timer até fim
├─────────────────────────────────────┤
│                                     │
│  💬 Esta conversa é temporária      │
│  Faça ReMatch para continuar depois │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│         Oi! Vi que você também      │
│         trabalha com UX 😊          │
│                              14:30  │
│                                     │
│  Oi! Sim! Você é da onde?           │
│  14:32                              │
│                                     │
│         São Paulo, e você?          │
│                              14:33  │
│                                     │
│                                     │
│  ─────────────────────────────────  │
│  [Fazer ReMatch 🤝]                 │  ← CTA persistente
│  ─────────────────────────────────  │
│  ┌─────────────────────────┐ [📤]  │
│  │ Digite uma mensagem...  │       │
│  └─────────────────────────┘       │
└─────────────────────────────────────┘
```

---

## 7. Notificações Estratégicas

### 7.1 Gatilhos de FOMO

```
NOTIFICAÇÕES PARA ENGAJAMENTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRÉ-EVENTO:

📱 "Marina confirmou presença no Tech Meetup"
   Você também vai? [Ver evento]
   
📱 "5 amigos confirmaram no Tech Meetup"
   Você vai ficar de fora? [Confirmar presença]
   
📱 "Tech Meetup está quase lotado!"
   Restam 12 vagas na lista VIP [Garantir vaga]

📱 "Amanhã! Tech Meetup às 19h"
   3 amigos confirmados · [Ver quem vai]


DIA DO EVENTO:

📱 "Tech Meetup começa em 2 horas!"
   Marina e +4 amigos já confirmaram [Ver evento]

📱 "Marina chegou no Tech Meetup"
   Faça seu check-in! [Check-in]

📱 "Você está perto do Tech Meetup"
   47 pessoas já fizeram check-in [Check-in agora]


DURANTE O EVENTO:

📱 "João quer conversar com você"
   Vocês têm 3 conexões em comum [Ver mensagem]

📱 "Você foi um dos mais conectados! 🔥"
   Top 10% do evento [Ver ranking]


PÓS-EVENTO:

📱 "Você conheceu 12 pessoas ontem!"
   Faça ReMatch antes que expire [Ver conexões]

📱 "Marina quer se conectar com você"
   Vocês se viram no Tech Meetup [Ver perfil]

📱 "Última chance! 2 dias para ReMatch"
   8 pessoas do Tech Meetup [Ver]
```

---

## 8. Integração com Instagram (Técnica)

### 8.1 Sharing API

```
INTEGRAÇÃO INSTAGRAM SHARING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÉTODO 1: Custom URL Scheme (Stories)
────────────────────────────────────
instagram-stories://share?
  source_application={app_id}&
  background_image={asset_uri}&
  content_url={deep_link}

FLUXO:
1. App gera imagem do card (PNG/JPG)
2. Salva no cache local
3. Abre Instagram Stories com imagem de fundo
4. Usuário pode adicionar stickers, texto
5. Publica

CÓDIGO EXEMPLO (React Native):
```javascript
const shareToStories = async (imageUri, deepLink) => {
  const shareOptions = {
    backgroundImage: imageUri,
    stickerImage: logoUri, // Logo do Check Point
    contentUrl: deepLink,   // checkpoint.app/e/xyz
    attributionUrl: 'https://checkpoint.app',
  };
  
  await Share.shareToInstagramStory(shareOptions);
};
```

MÉTODO 2: Share Sheet (Feed/Direct)
────────────────────────────────────
- Usa share sheet nativo
- Usuário escolhe destino
- Imagem + link


DEEP LINKS:
────────────────────────────────────
checkpoint.app/e/{event_slug}
  └── Abre: App Store (se não tem) ou App (se tem)
  
checkpoint://event/{id}
  └── Abre direto no app (se instalado)


STICKER INTERATIVO (futuro):
────────────────────────────────────
- Instagram permite stickers custom
- "Também vou! 🎉" clicável
- Abre link do evento
- Requer aprovação da Meta
```

### 8.2 Instagram Graph API

```
IMPORTAR DADOS DO INSTAGRAM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERMISSÕES NECESSÁRIAS:
├── user_profile (básico)
├── user_media (fotos - opcional)
└── instagram_basic (conexão)

O QUE PODEMOS PEGAR:
├── ID do usuário
├── Username (@)
├── Nome completo
├── Foto de perfil
├── Bio
├── Contagem de seguidores (público)
└── Contagem de seguindo (público)

O QUE NÃO PODEMOS PEGAR (API limitada):
├── Lista de seguidores
├── Lista de seguindo
├── Posts/Stories
└── DMs

ALTERNATIVA PARA "AMIGOS EM COMUM":
────────────────────────────────────
Como não temos acesso à lista de seguidores,
usamos conexões DENTRO do Check Point:

1. Usuário A segue @B no Instagram
2. Usuário B também tem Check Point
3. Ambos conectam Instagram
4. Sistema detecta: A e B têm vínculo
5. Mostra como "conexão em comum"

Ou seja: quanto mais pessoas usam, mais conexões aparecem.
```

---

## 9. Widget Embed para Sites

### 9.1 Para Organizadores

```
WIDGET EMBEDDABLE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CÓDIGO PARA EMBED:
```html
<!-- Check Point Widget -->
<div 
  id="checkpoint-widget" 
  data-event="tech-meetup-sp"
  data-theme="dark"
  data-show-count="true"
  data-show-faces="true"
></div>
<script src="https://checkpoint.app/widget.js"></script>
```

PREVIEW DO WIDGET:
┌─────────────────────────────────────┐
│                                     │
│  📍 Tech Meetup SP                  │
│                                     │
│  ┌────┐┌────┐┌────┐┌────┐ +43     │
│  │ 📷 ││ 📷 ││ 📷 ││ 📷 │         │
│  └────┘└────┘└────┘└────┘         │
│                                     │
│  47 pessoas confirmadas             │
│                                     │
│  [  ✓ Confirmar presença  ]         │
│                                     │
│  powered by checkpoint.app          │
│                                     │
└─────────────────────────────────────┘

CUSTOMIZAÇÃO:
├── Tema: dark / light / custom
├── Mostrar contagem: sim / não
├── Mostrar rostos: sim / não
├── Cores customizadas
├── Tamanho: compact / default / large
└── Idioma: pt-BR / en / es

COMPORTAMENTO:
├── Clique "Confirmar": abre popup/modal
├── Se não logado: login rápido
├── Se logado: confirma direto
└── Atualiza em tempo real (WebSocket)
```

---

## 10. Métricas de Viralidade

### 10.1 KPIs de Compartilhamento

```
MÉTRICAS VIRAIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TAXA DE COMPARTILHAMENTO (Share Rate):
├── % de usuários que compartilham após check-in
├── Meta MVP: 30% compartilham
├── Meta V1: 50% compartilham
└── Benchmark: BeReal ~60%

COEFICIENTE VIRAL (K-Factor):
├── K = i × c
├── i = convites por usuário
├── c = taxa de conversão dos convites
├── Meta: K > 1 (crescimento viral)

RASTREAMENTO:
├── Origem de cada signup
│   ├── Orgânico
│   ├── Story share
│   ├── Direct share
│   ├── Widget
│   └── Convite direto
├── Clicks nos deep links
├── Instalações por share
└── Ativação pós-install

EVENTOS ANALYTICS:
```javascript
// Compartilhou card
analytics.track('share_card', {
  event_id: 'xyz',
  card_type: 'vip_confirmation',
  destination: 'instagram_stories',
  template: 'dark_premium'
});

// Signup via share
analytics.track('signup', {
  source: 'instagram_story',
  referrer_user_id: 'abc',
  event_id: 'xyz'
});
```
```

---

## 11. Checklist MVP Viral

```
FEATURES ESSENCIAIS PARA VIRALIDADE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ONBOARDING:
☐ Login com Instagram (1-tap)
☐ Import de foto/nome/bio automático
☐ Buscar amigos que já usam
☐ Tutorial mostrando valor (3 telas)

LISTA DE PRESENÇA:
☐ Confirmar presença pré-evento
☐ Lista VIP com aprovação
☐ Lista geral automática
☐ Mostrar quem mais vai
☐ Notificar quando amigo confirma

TEMPLATES DE COMPARTILHAMENTO:
☐ Template "Confirmei" (elegante)
☐ Template "VIP" (premium/dourado)
☐ Template "Cheguei" (ao vivo)
☐ Template "Wrap-up" (pós-evento)
☐ Personalização (cores, texto)
☐ Export para Stories (1-tap)
☐ Deep link em todos os shares

CHECK-IN:
☐ Check-in por GPS
☐ Check-in por QR Code
☐ Escolher visibilidade
☐ Ver quem está aqui
☐ Badge de presença

DISCOVERY:
☐ Lista de pessoas no evento
☐ Ordenar por conexões em comum
☐ Filtrar: todos/amigos/VIP
☐ Ver perfil completo
☐ Botão ReMatch

CHAT TEMPORÁRIO:
☐ Chat durante evento
☐ Timer mostrando expiração
☐ CTA para ReMatch
☐ Mensagens somem pós-evento

REMATCH:
☐ Solicitações recebidas
☐ Janela de 7 dias
☐ Revelar perfil no match
☐ Conectar Instagram

GAMIFICAÇÃO:
☐ Badges de status (VIP, Presente)
☐ Badges de conquista
☐ Ranking do evento (opt-in)
☐ Stats pós-evento

NOTIFICAÇÕES:
☐ Amigo confirmou presença
☐ Evento quase lotando
☐ Lembrete dia do evento
☐ Amigo chegou
☐ Nova mensagem
☐ Novo ReMatch
☐ Wrap-up pós-evento

ORGANIZADOR:
☐ Criar evento
☐ Configurar lista VIP
☐ Gerar QR Code
☐ Ver participantes tempo real
☐ Código embed para site
☐ Exportar lista CSV
```

---

*Documento: MVP Viral & Social Features v1.0*
*Objetivo: Criar produto que as pessoas QUEIRAM usar e compartilhar*
