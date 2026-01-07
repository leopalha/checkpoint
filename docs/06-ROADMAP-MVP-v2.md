# Roadmap e MVP - CheckMate v2.0

> **Versão:** 2.0
> **Última Atualização:** 2026-01-06 (Pós-Alinhamento)

---

## 1. Filosofia do MVP

### O Que É MVP Para Nós

> "O menor conjunto de funcionalidades que valida se pessoas querem usar um app de presença social com MATCH CONTEXTUAL em eventos"

### Hipóteses a Validar

| Hipótese | Como Validar | Métrica de Sucesso |
|----------|--------------|-------------------|
| Match com suspense aumenta comparecimento | Comparar check-in com/sem match pendente | >30% mais check-ins se tem match pendente |
| Intenções diferentes (paquera vs network) são úteis | Uso de ícones diferentes | >2 tipos de ícone usados por evento |
| Curtida mútua cria conexões reais | Taxa de match → chat → troca de contato | >25% dos matches trocam contato |
| Organizadores veem valor nos dados | Disposição a pagar | >5 pagam após piloto |
| ReMatch (segunda chance) faz sentido | Uso do ReMatch | >10% usam ReMatch |

---

## 2. Escopo do MVP

### Incluído no MVP ✅

#### 1. Autenticação
- [x] Login com Instagram OAuth
- [x] Criar perfil básico (nome, foto, bio do Instagram)
- [x] Editar perfil (bio, intenções padrão)
- [x] Logout

#### 2. Confirmação de Presença
- [x] Ver eventos disponíveis
- [x] Confirmar presença no evento
- [x] Definir intenções (🔥 🤝 ✋)
- [x] Definir status (texto)
- [x] Ver lista de confirmados

#### 3. Sistema de Curtidas
- [x] Curtir pessoa (escolher ícone de intenção)
- [x] Limite de curtidas por dia (10 free)
- [x] Receber notificação anônima ("X pessoas curtiram você")

#### 4. Check-in
- [x] Check-in com GPS (raio configurável, mín 200m)
- [x] Check-in via QR code (alternativa)
- [x] Ver quem está no evento (com check-in ativo)
- [x] Check-out manual

#### 5. Sistema de Match
- [x] Match revelado quando AMBOS fazem check-in
- [x] Push notification de match
- [x] Curtida no evento (até 3 free, mais = premium)
- [x] Match instantâneo se curtida mútua no evento

#### 6. Chat
- [x] Chat 1:1 após match
- [x] Texto, emojis
- [x] Duração: 7 dias
- [x] Controle de mídia (aceitar ou não fotos)

#### 7. Organizador (Básico)
- [x] Criar conta de organizador
- [x] Criar/editar evento
- [x] Configurar: tema, interações, raio GPS
- [x] Gerar QR code
- [x] Dashboard básico (confirmados, check-ins, matches)
- [x] Ver estatísticas de interesses (anônimo)

#### 8. Integrações
- [x] Instagram OAuth
- [x] Google Maps API (GPS)
- [x] Sympla (importar eventos)
- [x] Push notifications

### Excluído do MVP ❌

- Chat com fotos/áudio (só texto no MVP)
- ReMatch pós-evento (V1.0)
- Chat live do evento (V1.0)
- Stories do evento (V1.0)
- Feed do evento (V1.0)
- Sistema de créditos (V1.0)
- Premium B2C (V1.0)
- IA de moderação (V1.5)
- Analytics avançado (V1.5)
- White-label (V1.5)
- Web completo para usuário (V1.5)

---

## 3. Timeline do MVP

### Visão Geral: 20 Semanas

```
┌────────────────────────────────────────────────────────────────────┐
│                    TIMELINE MVP - 20 SEMANAS                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  FASE 0        FASE 1         FASE 2         FASE 3               │
│  Setup         Auth           Check-in       Discovery            │
│  ██░░░░░░░░    ████░░░░░░     ████████░░     ██████░░░░           │
│  Sem 1-2       Sem 3-4        Sem 5-8        Sem 9-10              │
│                                                                    │
│  FASE 4         FASE 5         FASE 6         FASE 7              │
│  Match          Chat           Organizador    Polish               │
│  ████████░░     ██████░░░░     ████████░░     ████████░░          │
│  Sem 11-14      Sem 15-16      Sem 17-18      Sem 19-20           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### FASE 0: Setup (Semanas 1-2)

**Objetivo:** Infraestrutura pronta

**Tarefas:**
- [ ] Setup repositório monorepo (Turborepo)
- [ ] Estrutura: apps/mobile, apps/backend, apps/dashboard
- [ ] CI/CD básico (GitHub Actions)
- [ ] ESLint + Prettier compartilhado
- [ ] TypeScript strict
- [ ] Database schema inicial (Prisma)
- [ ] Docker Compose para dev local

**Entregável:** Hello World end-to-end

**Critérios de Aceite:**
- `npm install` funciona
- `npm run dev` inicia todos serviços
- `npm run build` passa
- Banco conecta e migrations rodam

---

### FASE 1: Auth & Perfil (Semanas 3-4)

**Objetivo:** Usuário pode criar conta e ter perfil

**Tarefas:**
- [ ] OAuth Instagram funcionando
- [ ] JWT authentication
- [ ] Refresh token flow
- [ ] Criar perfil (puxar dados do Instagram)
- [ ] Tela de perfil (view)
- [ ] Editar perfil (bio, intenções)
- [ ] Logout

**Entregável:** Fluxo completo de onboarding

**User Stories:** US-001 a US-010

---

### FASE 2: Check-in Core (Semanas 5-8)

**Objetivo:** Check-in e confirmação funcionando

**Tarefas:**
- [ ] Listagem de eventos (mock + Sympla)
- [ ] Tela de evento (detalhes)
- [ ] Confirmar presença
- [ ] Definir intenções e status
- [ ] Ver lista de confirmados
- [ ] Check-in com GPS
- [ ] Validação de raio (mín 200m)
- [ ] Check-in via QR code
- [ ] Check-out manual
- [ ] Histórico de check-ins

**Entregável:** Fluxo completo de presença

**User Stories:** US-011 a US-025

---

### FASE 3: Discovery & Curtidas (Semanas 9-10)

**Objetivo:** Ver pessoas e curtir

**Tarefas:**
- [ ] Lista de pessoas no evento
- [ ] Tela de perfil de outro usuário
- [ ] Sistema de curtidas (escolher ícone)
- [ ] Limite de curtidas (10/dia free)
- [ ] Notificação anônima ("X pessoas curtiram você")
- [ ] Curtida no evento (3 free)
- [ ] Filtros básicos (por intenção)

**Entregável:** Discovery e curtidas funcionando

**User Stories:** US-026 a US-035

---

### FASE 4: Match System (Semanas 11-14)

**Objetivo:** Match revelado no check-in

**Tarefas:**
- [ ] Lógica de match pendente
- [ ] Verificar match quando check-in
- [ ] Revelar match quando ambos presentes
- [ ] Push notification de match
- [ ] Match instantâneo (curtida mútua no evento)
- [ ] Lista de matches
- [ ] WebSocket para real-time

**Entregável:** Sistema de match completo

**User Stories:** US-036 a US-045

---

### FASE 5: Chat (Semanas 15-16)

**Objetivo:** Conversa entre matches

**Tarefas:**
- [ ] Chat 1:1 (texto + emoji)
- [ ] WebSocket para mensagens
- [ ] Duração de 7 dias
- [ ] Controle de mídia
- [ ] Notificações de mensagem
- [ ] Histórico de conversas

**Entregável:** Chat básico funcionando

**User Stories:** US-046 a US-055

---

### FASE 6: Organizador (Semanas 17-18)

**Objetivo:** Dashboard B2B básico

**Tarefas:**
- [ ] Cadastro de organizador
- [ ] Login separado (email)
- [ ] Criar/editar evento
- [ ] Configurar: tema, interações, raio
- [ ] Gerar QR code
- [ ] Dashboard: confirmados, check-ins, matches
- [ ] Estatísticas de interesses (anônimo)
- [ ] Integração Sympla (importar eventos)

**Entregável:** Fluxo B2B mínimo

**User Stories:** US-056 a US-070

---

### FASE 7: Polish & Launch (Semanas 19-20)

**Objetivo:** Pronto para usuários reais

**Tarefas:**
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Onboarding refinado
- [ ] Empty states
- [ ] Edge cases
- [ ] Emails transacionais
- [ ] Landing page
- [ ] App Store (TestFlight)
- [ ] Play Store (Internal)
- [ ] Termos de uso e privacidade

**Entregável:** MVP pronto para piloto

---

## 4. Critérios de Sucesso do MVP

### Métricas Quantitativas (após 3 meses)

| Métrica | Meta |
|---------|------|
| Usuários cadastrados | 1.000 |
| Usuários ativos (MAU) | 400 |
| Eventos cadastrados | 30 |
| Check-ins totais | 3.000 |
| Taxa de confirmação → check-in | 60% |
| Curtidas enviadas | 5.000 |
| Matches revelados | 500 |
| Taxa de match | 10% das curtidas |
| Chats iniciados | 400 |
| NPS | > 40 |

### Métricas Qualitativas

- [ ] 15 entrevistas com usuários satisfeitos
- [ ] 10 entrevistas com organizadores interessados
- [ ] 5 organizadores dispostos a pagar
- [ ] Identificar top 3 melhorias pedidas

---

## 5. Roadmap Pós-MVP

### V1.0 (Meses 5-6) - "Engagement"

| Feature | Impacto | Esforço |
|---------|---------|---------|
| ReMatch pós-evento | Alto | Médio |
| Chat com fotos/áudio | Alto | Médio |
| Premium B2C (ver quem curtiu) | Alto | Médio |
| Sistema de créditos | Médio | Baixo |
| Push notifications avançadas | Alto | Baixo |

### V1.5 (Meses 7-9) - "Social"

| Feature | Impacto | Esforço |
|---------|---------|---------|
| Chat live do evento | Alto | Alto |
| Stories do evento | Médio | Médio |
| Feed do evento | Médio | Médio |
| IA de moderação | Alto | Alto |
| Web para usuário | Médio | Alto |

### V2.0 (Meses 10-12) - "Scale"

| Feature | Impacto | Esforço |
|---------|---------|---------|
| Analytics avançado | Alto | Alto |
| White-label | Alto | Alto |
| API pública | Médio | Alto |
| Multi-cidade | Alto | Médio |
| Gamificação | Médio | Médio |

---

## 6. Alocação de Time

### Team Ideal para MVP

| Papel | FTE | Responsabilidade |
|-------|-----|------------------|
| Product Manager | 0.5 | Priorização, validação |
| Designer UI/UX | 0.5 | Telas, fluxos |
| Dev Mobile (RN) | 1.5 | App iOS/Android |
| Dev Backend | 1 | API, database |
| Dev Full-stack | 0.5 | Dashboard web |

**Total:** ~4 pessoas por 5 meses

### Distribuição por Fase

| Fase | Semanas | Esforço |
|------|---------|---------|
| Setup | 2 | 10% |
| Auth | 2 | 10% |
| Check-in | 4 | 20% |
| Discovery | 2 | 10% |
| Match | 4 | 20% |
| Chat | 2 | 10% |
| Organizador | 2 | 10% |
| Polish | 2 | 10% |

---

## 7. Go-to-Market

### Fase Alpha (Semanas 1-2 pós-dev)

- 50 usuários convidados
- 3 eventos de teste
- Foco: bugs e usabilidade

### Fase Beta Fechado (Semanas 3-6)

- 300 usuários via convite
- 10 eventos reais
- Foco: métricas iniciais

### Fase Beta Aberto (Semanas 7-12)

- Cadastro aberto
- 20+ eventos
- Foco: validar hipóteses

### Eventos Piloto Ideais

1. **Meetup de tecnologia** - Early adopters
2. **Evento de startup** - Network-focused
3. **Festa/evento social** - Paquera-focused
4. **Conferência** - Misto

---

## 8. Riscos do MVP

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| Instagram muda API | Média | Alto | Ter backup de email |
| Baixa adoção | Alta | Alto | Começar com eventos parceiros |
| GPS indoor | Média | Médio | QR code como fallback |
| Match não engaja | Média | Alto | Testar suspense com early adopters |
| Organizador não vê valor | Média | Alto | Entrevistas antes de construir |
| Atraso no dev | Alta | Médio | Cortar escopo, não prazo |

---

## 9. Métricas e Analytics

### Eventos a Trackear

```javascript
// Onboarding
track('signup_started');
track('signup_completed');
track('profile_completed');

// Presença
track('event_viewed');
track('presence_confirmed', { intentions: [...] });
track('attendee_list_viewed');

// Curtidas
track('like_sent', { type: 'fire' | 'handshake' | ... });
track('likes_received_notification');

// Check-in
track('checkin_started');
track('checkin_completed', { method: 'gps' | 'qr' });
track('checkout_completed');

// Match
track('match_revealed');
track('chat_started');
track('message_sent');
track('contact_exchanged');

// Organizador
track('event_created');
track('dashboard_viewed');
track('qr_generated');
```

---

## 10. Checklist de Lançamento

### Pré-lançamento
- [ ] Testes em múltiplos devices
- [ ] Performance < 3s load
- [ ] Sem crashes críticos
- [ ] Emails funcionando
- [ ] Termos de uso
- [ ] Landing page
- [ ] App nas lojas (beta)
- [ ] Analytics configurado
- [ ] Error tracking (Sentry)
- [ ] Backup de database

### Dia do Lançamento
- [ ] Verificar serviços
- [ ] Time de plantão
- [ ] Comunicação para early adopters
- [ ] Monitorar métricas

### Pós-lançamento
- [ ] Daily standup para bugs
- [ ] Entrevistas (semana 1)
- [ ] Análise de funil (semana 2)
- [ ] Retrospectiva (semana 3)
- [ ] Decisão próximos passos (semana 4)

---

**Roadmap MVP v2.0 - CheckMate**
*Atualizado após sessão de alinhamento*
