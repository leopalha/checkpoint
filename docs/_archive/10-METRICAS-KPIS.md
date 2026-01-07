# 📊 Métricas e KPIs - CheckMate

## Framework de Métricas

---

## 1. North Star Metric

### Definição

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ⭐ NORTH STAR METRIC                                  │
│                                                         │
│   "Conexões com Contexto por Semana"                    │
│                                                         │
│   = Número de ReMatches aceitos                         │
│     entre pessoas que estiveram                         │
│     no mesmo evento/local                               │
│                                                         │
│   Meta Ano 1: 500/semana                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Por que essa métrica?

| Critério | Avaliação |
|----------|-----------|
| Reflete valor para usuário? | ✅ Conexão real é o que buscam |
| Reflete valor para negócio? | ✅ Mais conexões = mais engajamento = mais B2B |
| É acionável? | ✅ Podemos melhorar matching, UX, etc |
| É leading indicator? | ✅ Prevê retenção e crescimento |

---

## 2. Framework AARRR (Pirate Metrics)

### Funil Completo

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ACQUISITION (Aquisição)                               │
│   "Como usuários nos descobrem?"                        │
│   └─→ Downloads, Signups, Fonte de tráfego             │
│                                                         │
│            ↓                                            │
│                                                         │
│   ACTIVATION (Ativação)                                 │
│   "Primeira experiência de valor?"                      │
│   └─→ Completou perfil, Primeiro check-in              │
│                                                         │
│            ↓                                            │
│                                                         │
│   RETENTION (Retenção)                                  │
│   "Voltam a usar?"                                      │
│   └─→ Check-ins recorrentes, MAU/DAU                   │
│                                                         │
│            ↓                                            │
│                                                         │
│   REVENUE (Receita)                                     │
│   "Pagam ou geram receita?"                             │
│   └─→ Conversão B2B, MRR, LTV                          │
│                                                         │
│            ↓                                            │
│                                                         │
│   REFERRAL (Indicação)                                  │
│   "Trazem outros usuários?"                             │
│   └─→ Viral coefficient, Referrals                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. KPIs por Área

### 3.1 Aquisição (Acquisition)

| Métrica | Definição | Meta MVP | Meta Ano 1 |
|---------|-----------|----------|------------|
| Downloads | Total de instalações do app | 1.000 | 30.000 |
| Signups | Contas criadas | 500 | 15.000 |
| Signup Rate | Signups / Downloads | 50% | 50% |
| CAC Orgânico | Custo por signup orgânico | R$ 0 | R$ 5 |
| CAC Pago | Custo por signup pago | - | R$ 20 |
| Fonte de Signup | % por canal (orgânico, evento, paid) | - | Trackear |

**Eventos a trackear:**
```javascript
track('app_download', { source, campaign })
track('signup_started', { method: 'instagram' | 'email' })
track('signup_completed', { method, has_photo, source })
```

---

### 3.2 Ativação (Activation)

| Métrica | Definição | Meta MVP | Meta Ano 1 |
|---------|-----------|----------|------------|
| Profile Completion | % que completa perfil | 60% | 75% |
| First Check-in | % que faz 1º check-in | 40% | 60% |
| Time to First Check-in | Tempo médio até 1º check-in | 7 dias | 3 dias |
| Activation Rate | % signup → ativado | 30% | 50% |

**Definição de "Ativado":**
> Usuário que completou perfil E fez pelo menos 1 check-in

**Eventos a trackear:**
```javascript
track('profile_step_completed', { step: 1|2|3 })
track('profile_completed', { time_since_signup })
track('first_checkin', { event_id, source, time_since_signup })
```

---

### 3.3 Retenção (Retention)

| Métrica | Definição | Meta MVP | Meta Ano 1 |
|---------|-----------|----------|------------|
| DAU | Usuários ativos diários | 50 | 1.000 |
| WAU | Usuários ativos semanais | 150 | 4.000 |
| MAU | Usuários ativos mensais | 300 | 10.000 |
| DAU/MAU | Stickiness | 15% | 20% |
| D1 Retention | % volta no dia 1 | 30% | 40% |
| D7 Retention | % volta no dia 7 | 20% | 30% |
| D30 Retention | % volta no dia 30 | 10% | 20% |
| Check-ins/usuário/mês | Frequência de uso | 3 | 5 |

**Cohort Analysis:**
```
Semana    D1    D7    D14   D30
──────────────────────────────────
Jan W1    35%   22%   18%   12%
Jan W2    38%   25%   20%   15%
Jan W3    40%   28%   22%   17%
...
```

---

### 3.4 Engajamento (Engagement)

| Métrica | Definição | Meta MVP | Meta Ano 1 |
|---------|-----------|----------|------------|
| Check-ins totais | Total de check-ins | 1.500 | 50.000 |
| Check-ins/evento | Média por evento | 30 | 50 |
| Penetration Rate | % participantes que fazem check-in | 20% | 35% |
| Discovery Views | Visualizações de "quem está aqui" | - | Trackear |
| Profile Views | Visualizações de perfis | - | Trackear |
| ReMatch Sent | Requests de conexão enviados | 200 | 10.000 |
| ReMatch Accept Rate | % de requests aceitos | 25% | 30% |
| Connections Made | Conexões criadas | 50 | 3.000 |
| Instagram Clicks | Cliques para ver Instagram | - | Trackear |

**Eventos a trackear:**
```javascript
track('checkin_created', { event_id, visibility, verified })
track('checkout', { event_id, duration_minutes })
track('discovery_viewed', { event_id, count_shown })
track('profile_viewed', { user_id, context })
track('rematch_sent', { event_id, has_message })
track('rematch_responded', { response: 'accept'|'ignore'|'block' })
track('instagram_clicked', { context: 'profile'|'match' })
```

---

### 3.5 Receita (Revenue) - B2B

| Métrica | Definição | Meta MVP | Meta Ano 1 |
|---------|-----------|----------|------------|
| Eventos pagos | Eventos que pagaram | 5 | 100 |
| Estabelecimentos | Assinaturas mensais | 3 | 30 |
| MRR | Monthly Recurring Revenue | R$ 5K | R$ 50K |
| ARR | Annual Recurring Revenue | R$ 60K | R$ 600K |
| ARPU (evento) | Receita média por evento | R$ 500 | R$ 700 |
| ARPU (estabelec.) | Receita média mensal | R$ 300 | R$ 350 |
| Churn Rate | % cancelamento mensal | - | < 5% |
| LTV | Lifetime Value | - | R$ 5.000 |
| CAC | Custo aquisição B2B | - | R$ 500 |
| LTV/CAC | Ratio | - | > 10x |

---

### 3.6 Indicação (Referral)

| Métrica | Definição | Meta MVP | Meta Ano 1 |
|---------|-----------|----------|------------|
| Viral Coefficient | Novos users por user existente | 0.3 | 0.5 |
| Share Rate | % que compartilha check-in | 10% | 20% |
| Invite Sent | Convites enviados | - | Trackear |
| Invite Convert | % convites que convertem | - | 15% |
| Organic % | % signups orgânicos | 80% | 60% |
| NPS | Net Promoter Score | 40 | 50 |

---

## 4. Métricas do Organizador (B2B)

### Dashboard Métricas

| Métrica | O que mostra | Valor para organizador |
|---------|--------------|------------------------|
| Total Check-ins | Quantos fizeram check-in | Engajamento real |
| Check-in Rate | % dos participantes | Penetração do app |
| Pico de Presença | Momento com mais gente | Timing do evento |
| Tempo Médio | Quanto ficaram | Retenção no evento |
| ReMatches | Conexões feitas | Networking gerado |
| Top Influencers | Quem trouxe mais gente | Identificar promoters |
| Retention | % que volta em próximo evento | Fidelização |

### Métricas de Sucesso por Vertical

**Eventos de Tech:**
- Meta check-in rate: 40%
- Meta ReMatch rate: 20%
- Meta tempo médio: 2h

**Fitness/Wellness:**
- Meta check-in rate: 50%
- Meta recorrência: 3x/mês
- Meta conexões: 5/mês por user

**Nightlife:**
- Meta check-in rate: 25%
- Meta share rate: 30%
- Meta ReMatch rate: 15%

---

## 5. Dashboard Operacional

### Métricas Diárias

```
┌─────────────────────────────────────────────────────────┐
│  DAILY DASHBOARD                           03 Jan 2026  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📈 HOJE                                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │   127   │ │    23   │ │    45   │ │    12   │       │
│  │Check-ins│ │ Signups │ │  DAU    │ │ReMatches│       │
│  │  +15%   │ │  +8%    │ │  +12%   │ │  +20%   │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│  📊 TENDÊNCIA (7 dias)                                  │
│  [Sparkline charts aqui]                                │
│                                                         │
│  🎯 EVENTOS ATIVOS HOJE                                 │
│  • Tech Meetup SP - 47 check-ins                       │
│  • Yoga no Parque - 23 check-ins                       │
│  • Happy Hour Dev - 15 check-ins                       │
│                                                         │
│  ⚠️ ALERTAS                                             │
│  • Signup rate caiu 10% (investigar)                   │
│  • Error rate 2.3% (acima do normal)                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Métricas Semanais

| Métrica | Semana Atual | Semana Anterior | Δ |
|---------|--------------|-----------------|---|
| WAU | 450 | 420 | +7% |
| Check-ins | 890 | 780 | +14% |
| ReMatches | 89 | 72 | +24% |
| NPS | 47 | 45 | +2 |
| Eventos ativos | 12 | 10 | +2 |

---

## 6. Alertas e Thresholds

### Alertas Críticos 🔴

| Condição | Threshold | Ação |
|----------|-----------|------|
| Error rate API | > 5% | Investigar imediatamente |
| Crash rate app | > 2% | Hotfix |
| Signup completions | < 30% | Revisar onboarding |
| D1 retention | < 20% | Revisar activation |

### Alertas de Atenção 🟡

| Condição | Threshold | Ação |
|----------|-----------|------|
| Check-in rate evento | < 15% | Investigar evento específico |
| ReMatch accept rate | < 15% | Revisar matching/UX |
| Time to first check-in | > 14 dias | Melhorar onboarding |
| NPS | < 30 | Pesquisa qualitativa |

### Indicadores Positivos 🟢

| Condição | Threshold | Significado |
|----------|-----------|-------------|
| Viral coefficient | > 0.5 | Crescimento orgânico forte |
| D30 retention | > 25% | Product-market fit |
| NPS | > 50 | Usuários promotores |
| LTV/CAC | > 5x | Unit economics saudável |

---

## 7. Experimentos e Testes

### Framework de Experimentação

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   1. HIPÓTESE                                           │
│   "Se [mudarmos X], então [métrica Y] vai [aumentar/    │
│   diminuir] porque [razão]"                             │
│                                                         │
│   2. MÉTRICA PRIMÁRIA                                   │
│   Qual número vamos mover?                              │
│                                                         │
│   3. TAMANHO DA AMOSTRA                                 │
│   Quantos usuários precisamos?                          │
│                                                         │
│   4. DURAÇÃO                                            │
│   Quanto tempo rodar?                                   │
│                                                         │
│   5. CRITÉRIO DE SUCESSO                                │
│   Qual lift mínimo para implementar?                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Backlog de Experimentos

| Experimento | Hipótese | Métrica | Status |
|-------------|----------|---------|--------|
| Onboarding simplificado | Menos steps = mais completion | Profile completion rate | Backlog |
| Push de amigo check-in | Notificar = mais check-ins | Check-ins/user | Backlog |
| Sugestões de mensagem ReMatch | Facilitar = mais sends | ReMatch sent rate | Backlog |
| Gamificação básica | Badges = mais engagement | D7 retention | Backlog |

---

## 8. Reporting Cadence

### Daily (Automático)
- Check-ins totais
- Signups
- DAU
- Error rate
- Eventos ativos

### Weekly (Segunda-feira)
- Análise de funil completo
- Cohort analysis
- Top eventos da semana
- Feedback qualitativo

### Monthly (Primeiro dia útil)
- MRR e crescimento
- Retention curves
- NPS e feedback
- Review de experimentos
- OKR progress

### Quarterly
- Deep dive por vertical
- Análise competitiva
- Revisão de metas
- Planejamento próximo quarter

---

## 9. Ferramentas Recomendadas

| Necessidade | Ferramenta | Alternativa |
|-------------|------------|-------------|
| Product Analytics | Mixpanel | Amplitude, PostHog |
| Session Recording | Hotjar | FullStory, LogRocket |
| Crash Reporting | Sentry | Crashlytics |
| A/B Testing | Statsig | LaunchDarkly, Optimizely |
| Dashboards | Metabase | Looker, Mode |
| NPS/Feedback | Typeform | Delighted |
| Data Warehouse | BigQuery | Snowflake |

---

## 10. Glossário de Métricas

| Termo | Definição |
|-------|-----------|
| **DAU** | Daily Active Users - usuários únicos por dia |
| **MAU** | Monthly Active Users - usuários únicos por mês |
| **MRR** | Monthly Recurring Revenue - receita recorrente mensal |
| **ARR** | Annual Recurring Revenue - MRR x 12 |
| **LTV** | Lifetime Value - receita total esperada por cliente |
| **CAC** | Customer Acquisition Cost - custo para adquirir cliente |
| **NPS** | Net Promoter Score - % promotores - % detratores |
| **Churn** | Taxa de cancelamento/abandono |
| **Cohort** | Grupo de usuários por data de signup |
| **Retention** | % de usuários que voltam após X dias |
| **Activation** | Momento que usuário experimenta valor core |
| **Viral Coefficient** | Quantos novos users cada user traz |

---

*Documento de Métricas v1.0 - Revisar mensalmente*
