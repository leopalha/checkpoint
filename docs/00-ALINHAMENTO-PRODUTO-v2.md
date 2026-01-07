# CHECKMATE - DOCUMENTO DE ALINHAMENTO v2.0

> **Data:** 2026-01-06
> **Status:** APROVADO
> **Sessão de Alinhamento:** Completa

---

## 📋 ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Personas](#2-personas)
3. [Sistema de Match](#3-sistema-de-match)
4. [Sistema de Interações](#4-sistema-de-interações)
5. [Features do Usuário](#5-features-do-usuário)
6. [Features do Organizador](#6-features-do-organizador)
7. [Features Sociais](#7-features-sociais)
8. [Monetização](#8-monetização)
9. [Especificações Técnicas](#9-especificações-técnicas)
10. [Integrações](#10-integrações)
11. [Roadmap MVP](#11-roadmap-mvp)

---

## 1. VISÃO GERAL

### O Que É CheckMate
Uma **plataforma de presença social contextual** que conecta pessoas em eventos através de interações intencionais.

### Problema
- 70% das conexões em eventos são perdidas
- Pessoas querem saber quem estará no evento antes de ir
- Não existe forma de expressar intenção (paquera, network, amizade)
- Organizadores não têm dados sobre interações reais

### Solução
Camada social que permite:
- Confirmar presença e ver quem vai
- Expressar intenção através de interações contextuais
- Match revelado apenas no evento (suspense)
- ReMatch pós-evento (segunda chance)
- Dashboard com insights para organizadores

### Tagline
> "Descubra quem está onde. Conecte-se com intenção."

---

## 2. PERSONAS

### 2.1 Usuário Final (Pessoa)

**Quem é:**
- Pessoas que vão a eventos (shows, festas, conferências, meetups)
- 18-45 anos, urbano, socialmente ativo
- Usa Instagram ativamente

**O que quer:**
- Saber quem vai ao evento
- Conectar com intenção (paquera, network, amizade)
- Não perder conexões feitas em eventos

**Dores:**
- Vai ao evento e não conhece ninguém
- Conhece pessoas mas perde o contato
- Não sabe se alguém tem interesse mútuo

---

### 2.2 Organizador (Produtor/Venue Unificado)

**Quem é:**
- Produtores de eventos
- Donos de estabelecimentos (bares, casas noturnas, coworkings)
- Empresas que fazem eventos corporativos

**O que quer:**
- Aumentar engajamento nos eventos
- Entender o perfil e interesses dos participantes
- Ferramentas para gerenciar e monetizar

**Dores:**
- Não sabe o que os participantes querem
- Dificuldade em criar comunidade
- Pouco dado sobre networking que acontece

---

### 2.3 Admin da Plataforma

**Quem é:**
- Equipe CheckMate

**O que faz:**
- Gerencia organizadores
- Modera conteúdo
- Analisa métricas globais
- Suporte

---

## 3. SISTEMA DE MATCH

### 3.1 Fluxo de Match no Evento (Principal)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE MATCH NO EVENTO                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ANTES DO EVENTO                                                    │
│  ───────────────                                                    │
│  1. Usuário A confirma presença no evento                          │
│  2. A vê lista de outros confirmados                               │
│  3. A curte B (envia interação: 🔥 foguinho, 👍 network, etc.)     │
│  4. B curte A de volta                                             │
│  5. NENHUM dos dois sabe do match ainda (suspense!)                │
│                                                                     │
│  NO EVENTO (CHECK-IN)                                               │
│  ────────────────────                                               │
│  6. A faz check-in (GPS dentro do raio configurado)                │
│  7. B faz check-in                                                 │
│  8. Sistema detecta: ambos com curtida mútua + check-in            │
│  9. MATCH REVELADO! 🎉                                              │
│  10. Push notification para ambos                                  │
│  11. Chat liberado (7 dias de duração)                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Curtida no Evento (Sem Match Prévio)

```
┌─────────────────────────────────────────────────────────────────────┐
│                 CURTIDA NO EVENTO (SEM MATCH PRÉVIO)                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Usuário A faz check-in no evento                               │
│  2. A recebe notificação: "3 pessoas curtiram você" (anônimo)      │
│  3. A pode curtir de volta:                                        │
│     - GRATUITO: até 3 curtidas de volta                            │
│     - PREMIUM/CRÉDITOS: curtidas ilimitadas                        │
│  4. Se curtida mútua acontece → MATCH! Chat liberado               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 ReMatch (Pós-Evento) - Segunda Chance

```
┌─────────────────────────────────────────────────────────────────────┐
│                      REMATCH - SEGUNDA CHANCE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CONCEITO:                                                          │
│  Duas pessoas estiveram no MESMO EVENTO mas NÃO deram match.       │
│  Pode ter rolado olhares, conversa, mas não conectaram no app.     │
│  O algoritmo oferece "segunda chance" de conexão.                  │
│                                                                     │
│  FLUXO:                                                             │
│  1. Evento termina                                                 │
│  2. Sistema identifica: A e B estavam no mesmo evento              │
│  3. A e B não tiveram interação no app                             │
│  4. App sugere: "Pessoas do último evento que você foi"            │
│  5. A pode curtir B → B recebe notificação                         │
│  6. Se B curte de volta → REMATCH! Chat liberado                   │
│                                                                     │
│  JANELA: 7 dias após o evento                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Chat do Match

| Aspecto | Especificação |
|---------|---------------|
| **Duração** | 7 dias após match (expira se não trocar contato) |
| **Conteúdo** | Texto, fotos, áudio, localização |
| **Moderação** | IA para detectar conteúdo abusivo |
| **Mídia** | Usuário pode escolher se aceita receber imagens/vídeos |

---

## 4. SISTEMA DE INTERAÇÕES

### 4.1 Tipos de Interação por Contexto

O CheckMate permite diferentes tipos de interação baseados na **intenção** do usuário.

| Ícone | Nome | Contexto | Descrição |
|-------|------|----------|-----------|
| 🔥 | **Foguinho** | Paquera/Romance | Interesse romântico |
| 🤝 | **Handshake** | Network Profissional | Conexão de negócios |
| ✋ | **High Five** | Amizade | Quer fazer amigos |
| 🚗 | **Carona** | Compartilhar | Dividir transporte |
| 🎫 | **Ingresso** | Compartilhar | Dividir camarote/mesa |
| 🍾 | **Champagne** | Celebrar | Compartilhar experiência VIP |
| 💼 | **Briefcase** | Negócios | Oportunidade de negócio |
| 🎯 | **Alvo** | Objetivo Específico | Definido pelo usuário |

### 4.2 Configuração de Intenções

**Usuário define:**
- Pode selecionar MÚLTIPLAS intenções
- Ex: "Estou aberto a network E paquera"

**Organizador define:**
- Tema geral do evento
- Quais interações estão disponíveis
- Se evento é "networking", pode desabilitar foguinho
- Se evento é "festa", libera todas

### 4.3 Status do Perfil

O usuário pode definir um STATUS para cada evento:

**Opções pré-definidas:**
- 🎉 "Animado para o evento!"
- 🍻 "Querendo conhecer gente nova"
- 💼 "Buscando conexões profissionais"
- 🎵 "Só curtindo a música"
- 👥 "Com amigos, mas aberto a novas amizades"

**Campo customizado:**
- Usuário pode escrever status livre
- Limite de caracteres (ex: 100)

---

## 5. FEATURES DO USUÁRIO

### 5.1 Perfil

| Feature | Descrição |
|---------|-----------|
| Foto | Puxada do Instagram |
| Nome | Puxado do Instagram |
| Bio | Editável no app |
| Intenções | Múltipla seleção |
| Status | Pré-definido ou customizado |
| Instagram | Link para perfil |

### 5.2 Eventos

| Feature | Descrição |
|---------|-----------|
| Descobrir eventos | Lista de eventos disponíveis |
| Confirmar presença | Marca que vai ao evento |
| Ver confirmados | Lista de quem confirmou |
| Curtir confirmados | Enviar interação |
| Check-in | GPS valida presença |
| Ver quem está | Pessoas com check-in ativo |

### 5.3 Matches

| Feature | Descrição |
|---------|-----------|
| Meus matches | Lista de matches ativos |
| Chat | Conversa com match |
| ReMatch sugestões | Pessoas do último evento |
| Histórico | Matches anteriores |

### 5.4 Notificações (Push)

| Tipo | Prioridade |
|------|------------|
| Match revelado | 🔴 Alta |
| Nova mensagem no chat | 🔴 Alta |
| Alguém curtiu você | 🟡 Média |
| Evento começando | 🟡 Média |
| ReMatch sugestão | 🟢 Baixa |

### 5.5 Privacidade

| Feature | Descrição |
|---------|-----------|
| Modo Fantasma | Participa mas não aparece na lista |
| Bloquear usuário | Não recebe interações de X |
| Denunciar | Report de comportamento |

---

## 6. FEATURES DO ORGANIZADOR

### 6.1 Painel do Organizador (Dashboard)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD DO ORGANIZADOR                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  GESTÃO DE EVENTOS                                                  │
│  ─────────────────                                                  │
│  • Criar evento                                                    │
│  • Editar evento                                                   │
│  • Definir tema/vibe                                               │
│  • Configurar interações permitidas                                │
│  • Definir raio de check-in (mínimo 200m)                         │
│  • Gerar QR code para check-in                                    │
│                                                                     │
│  MÉTRICAS EM TEMPO REAL                                            │
│  ──────────────────────                                            │
│  • Confirmações de presença                                        │
│  • Check-ins ativos                                                │
│  • Matches no evento                                               │
│  • Interações por tipo                                             │
│  • Engajamento geral                                               │
│                                                                     │
│  INSIGHTS DE INTERESSES                                            │
│  ──────────────────────                                            │
│  • Estatísticas anonimizadas (40% paquera, 30% network)           │
│  • Dados nominais (se usuário permitiu)                           │
│  • Trending: o que está bombando                                   │
│                                                                     │
│  CHAT LIVE DO EVENTO                                               │
│  ───────────────────                                               │
│  • Habilitar/desabilitar                                           │
│  • Chat geral público                                              │
│  • Chat por tópicos/áreas                                          │
│  • Moderação de mensagens                                          │
│                                                                     │
│  SOCIAL DO EVENTO                                                  │
│  ────────────────                                                  │
│  • Habilitar stories do evento                                     │
│  • Habilitar feed do evento                                        │
│  • Moderar conteúdo                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Chat Live do Evento

| Modo | Descrição |
|------|-----------|
| **Desabilitado** | Sem chat |
| **Chat Geral** | Todos veem e mandam mensagens |
| **Chat Moderado** | Organizador aprova mensagens |
| **Chat por Tópicos** | Sub-chats por área/tema |

---

## 7. FEATURES SOCIAIS

### 7.1 Stories do Evento (Contextuais)

```
CONCEITO:
- Stories NÃO são rede social geral
- Stories existem APENAS no contexto do evento
- Quem confirmou presença vê stories de outros confirmados
- Stories somem 24h APÓS O EVENTO
- Mantém foco no evento, não vira Instagram

REGRAS:
- Organizador habilita/desabilita
- Moderação de conteúdo
- Vinculados ao evento específico
```

### 7.2 Feed do Evento

```
CONCEITO:
- Feed TEMPORÁRIO do evento
- Posts, fotos, textos
- Likes e comentários
- Desaparece após período (7 dias?)

REGRAS:
- Organizador habilita/desabilita
- Moderação de conteúdo
- Não é rede social permanente
```

---

## 8. MONETIZAÇÃO

### 8.1 B2C - Usuário Final

#### Modelo Freemium + Créditos

| Tier | Preço | Features |
|------|-------|----------|
| **Free** | R$ 0 | Confirmar presença, 3 curtidas de volta por evento, chat básico |
| **Premium** | R$ 19,90/mês | Ver quem curtiu, curtidas ilimitadas, boost de visibilidade, filtros avançados, modo fantasma |
| **Créditos** | R$ X avulso | Comprar curtidas extras, boost unitário |

#### Features Premium

| Feature | Free | Premium |
|---------|------|---------|
| Ver quem curtiu você | ❌ Só quantidade | ✅ Nomes e perfis |
| Curtidas de volta no evento | 3 por evento | ✅ Ilimitado |
| Boost de visibilidade | ❌ | ✅ Aparecer primeiro |
| Filtros avançados | ❌ | ✅ Por interesse, idade |
| Modo fantasma | ❌ | ✅ Invisível na lista |

### 8.2 B2B - Organizador

#### Modelo Por Participante

| Aspecto | Especificação |
|---------|---------------|
| **Modelo** | Cobrança por check-in realizado |
| **Preço sugerido** | R$ 0,50 - R$ 2,00 por check-in |
| **Free tier** | Até X check-ins grátis por mês |
| **Features premium** | Analytics avançado, chat live, white-label |

---

## 9. ESPECIFICAÇÕES TÉCNICAS

### 9.0 Stack Tecnológica (DECISÕES FINAIS)

| Componente | Tecnologia |
|------------|------------|
| **Mobile** | React Native + Expo + NativeWind |
| **State** | Zustand + React Query |
| **Backend** | Node.js + NestJS + Prisma |
| **Database** | PostgreSQL + PostGIS |
| **Cache** | Redis |
| **Real-time** | Socket.io |
| **Dashboard** | Next.js 14 + Tailwind + shadcn/ui |
| **Cloud** | AWS (ECS, CloudFront, S3) |
| **CI/CD** | GitHub Actions |

### 9.1 Autenticação

| Aspecto | Especificação |
|---------|---------------|
| **Login** | Apenas Instagram OAuth |
| **Justificativa** | Validação de perfil real, simplicidade |
| **Dados puxados** | Foto, nome, bio, link do perfil |
| **Token** | JWT (1h access, 7d refresh) |

### 9.2 Check-in

| Aspecto | Especificação |
|---------|---------------|
| **Método** | GPS + opcional QR code |
| **Raio** | Configurável pelo organizador (mínimo 200m) |
| **Validação** | Precisa estar dentro do raio |

### 9.3 Plataformas

| Plataforma | Escopo |
|------------|--------|
| **iOS** | App completo |
| **Android** | App completo |
| **Web** | Versão completa para usuários + Dashboard organizador |

### 9.4 Real-time

| Feature | Tecnologia |
|---------|------------|
| Notificações de match | WebSocket |
| Chat | WebSocket |
| Atualizações de check-in | WebSocket |
| Chat live do evento | WebSocket |

### 9.5 Moderação de Conteúdo

| Aspecto | Especificação |
|---------|---------------|
| **Mídia no chat** | Usuário escolhe se aceita fotos/vídeos |
| **IA de moderação** | Detectar conteúdo abusivo/nudez |
| **Report** | Sistema de denúncia |
| **Bloqueio** | Banimento por violação |

---

## 10. INTEGRAÇÕES

### 10.1 MVP (Prioridade)

| Integração | Prioridade | Descrição |
|------------|------------|-----------|
| **Instagram OAuth** | P0 | Login e dados do perfil |
| **Google Maps API** | P0 | Geolocalização e check-in |
| **Sympla** | P1 | Importar eventos, validar ingressos |
| **Eventbrite** | P1 | Importar eventos, validar ingressos |

### 10.2 Pós-MVP

| Integração | Descrição |
|------------|-----------|
| Spotify | Mostrar música que está tocando |
| LinkedIn | Conexão profissional |
| Apple/Google Pay | Pagamentos in-app |

---

## 11. ROADMAP MVP

### Fase 1: Setup (Semanas 1-2)
- Repositório e infraestrutura
- Autenticação Instagram
- Database schema

### Fase 2: Core (Semanas 3-6)
- Perfil de usuário
- Eventos e confirmação
- Sistema de curtidas
- Check-in com GPS

### Fase 3: Match (Semanas 7-10)
- Lógica de match no evento
- Chat entre matches
- Notificações push
- ReMatch pós-evento

### Fase 4: Organizador (Semanas 11-14)
- Dashboard básico
- Métricas em tempo real
- Configuração de eventos
- Integração Sympla

### Fase 5: Social (Semanas 15-16)
- Stories do evento
- Feed do evento
- Chat live

### Fase 6: Premium (Semanas 17-18)
- Sistema de assinatura
- Créditos
- Features premium

### Fase 7: Polish (Semanas 19-20)
- Testes com usuários
- Bug fixes
- Performance
- App Store

---

## ✅ CHECKLIST DE ALINHAMENTO

### Personas
- [x] Usuário Final definido
- [x] Organizador definido
- [x] Admin definido

### Sistema de Match
- [x] Match no evento definido
- [x] Curtida no evento definida
- [x] ReMatch pós-evento definido
- [x] Chat definido

### Interações
- [x] Tipos de interação definidos
- [x] Configuração por usuário
- [x] Configuração por organizador

### Features
- [x] Features do usuário listadas
- [x] Features do organizador listadas
- [x] Features sociais definidas

### Monetização
- [x] B2C Premium definido
- [x] Sistema de créditos
- [x] B2B por participante

### Técnico
- [x] Login só Instagram
- [x] Raio GPS configurável
- [x] Plataformas definidas (iOS, Android, Web)
- [x] Moderação de conteúdo

### Integrações
- [x] Sympla no MVP
- [x] Eventbrite no MVP

---

## 📝 NOTAS DA SESSÃO

1. **Foco:** Não virar rede social genérica, manter foco em EVENTOS
2. **Diferencial:** Match revelado só no evento (suspense)
3. **ReMatch:** Conceito inovador de segunda chance
4. **Contexto:** Interações variam conforme intenção
5. **Organizador:** Muito poder de configuração
6. **Moderação:** IA obrigatória para conteúdo

---

**FIM DO DOCUMENTO DE ALINHAMENTO v2.0**
