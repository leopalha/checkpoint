# Modelo de Negócio - CheckMate v2.0

> **Versão:** 2.0
> **Última Atualização:** 2026-01-06 (Pós-Alinhamento)

---

## 1. Visão Geral do Modelo

### Modelo Híbrido: B2B2C

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MODELO DE NEGÓCIO CHECKMATE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐                     ┌─────────────────┐       │
│  │   ORGANIZADOR   │                     │    USUÁRIO      │       │
│  │      (B2B)      │                     │     (B2C)       │       │
│  └────────┬────────┘                     └────────┬────────┘       │
│           │                                       │                 │
│           │ Paga por                              │ Paga por        │
│           │ participante                          │ Premium/        │
│           │                                       │ Créditos        │
│           ▼                                       ▼                 │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │                      CHECKMATE                           │       │
│  │               Plataforma de Presença Social              │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Segmentos de Clientes

### 2.1 Organizadores (B2B) - Pagantes Principais

**Persona Unificada: Produtor/Venue**
- Produtores de eventos (shows, festas, conferências)
- Donos de estabelecimentos (bares, casas noturnas, coworkings)

**Tamanho do Mercado (Brasil):**
- ~50.000 produtores de eventos ativos
- ~200.000 estabelecimentos potenciais
- TAM: R$ 500M/ano

### 2.2 Usuários (B2C) - Pagantes Secundários

**Personas:**
- Networkers (25-35 anos)
- Singles buscando conexões (23-35 anos)
- Profissionais (28-45 anos)

**Tamanho do Mercado:**
- ~30M frequentadores de eventos/ano (Brasil)
- Meta MVP: 10.000 usuários

---

## 3. Proposta de Valor

### Para Organizadores

```
"Aumente o comparecimento em 30% e entenda
o que seu público realmente quer"
```

| Entrega | Valor |
|---------|-------|
| Match com suspense | Pessoas vão ao evento para ver se deu match |
| Insights de interesse | Saber se público quer paquera, network, etc. |
| Engajamento durante evento | Chat live, stories, feed |
| Comunidade | Conexões que duram além do evento |

### Para Usuários

```
"Nunca mais perca conexões e saiba quando
há interesse mútuo ANTES de abordar"
```

| Entrega | Valor |
|---------|-------|
| Match com suspense | Emoção de descobrir no evento |
| Intenção clara | Saber se é paquera ou network |
| Segunda chance | ReMatch pós-evento |
| Sem rejeição | Só sabe se der match mútuo |

---

## 4. Fontes de Receita

### 4.1 B2B: Cobrança por Participante

**Modelo Principal:**

| Faixa | Preço por Check-in | Exemplo |
|-------|-------------------|---------|
| Até 100 | R$ 2,00 | Evento de 100 = R$ 200 |
| 101-500 | R$ 1,50 | Evento de 500 = R$ 750 |
| 501-1000 | R$ 1,00 | Evento de 1000 = R$ 1.000 |
| 1001+ | R$ 0,50 | Evento de 2000 = R$ 1.000 |

**Features Premium (adicional):**

| Feature | Preço |
|---------|-------|
| Chat Live | +R$ 299/evento |
| Analytics Avançado | +R$ 199/evento |
| White-label | +R$ 999/evento |
| Stories/Feed | Incluído no plano base |

**Planos Mensais (para venues):**

| Plano | Preço | Inclui |
|-------|-------|--------|
| Starter | R$ 299/mês | Até 500 check-ins/mês |
| Pro | R$ 699/mês | Até 2.000 check-ins/mês |
| Enterprise | Sob consulta | Ilimitado + white-label |

### 4.2 B2C: Freemium + Créditos

**Assinatura Premium:**

| Plano | Preço | Período |
|-------|-------|---------|
| Mensal | R$ 19,90/mês | 1 mês |
| Trimestral | R$ 49,90/3 meses | 3 meses (17% off) |
| Anual | R$ 149,90/ano | 12 meses (37% off) |

**Features Premium:**
- Ver quem curtiu você (nomes e perfis)
- Curtidas ilimitadas
- Boost de visibilidade
- Filtros avançados
- Modo fantasma
- Chat estendido (30 dias)
- ReMatch ilimitado

**Sistema de Créditos (avulso):**

| Pacote | Preço | Créditos | Preço/Crédito |
|--------|-------|----------|---------------|
| Starter | R$ 9,90 | 10 | R$ 0,99 |
| Popular | R$ 24,90 | 30 | R$ 0,83 |
| Power | R$ 49,90 | 70 | R$ 0,71 |

**Uso de créditos:**
- 1 crédito = 1 curtida extra
- 3 créditos = 1 boost
- 5 créditos = ver quem curtiu (1 vez)

---

## 5. Unit Economics

### 5.1 B2B

**LTV (Lifetime Value):**
```
- Ticket médio por evento: R$ 800
- Eventos por ano por organizador: 6
- Retenção anual: 70%
- LTV = R$ 800 × 6 × (1/(1-0.7)) = R$ 16.000
```

**CAC (Custo de Aquisição):**
```
- Meta CAC: R$ 500
- Canal: Outbound + Parcerias Sympla
- LTV/CAC = 32x (excelente)
```

### 5.2 B2C

**LTV Premium:**
```
- Ticket médio: R$ 19,90/mês
- Retenção mensal: 80%
- Lifetime: 5 meses
- LTV = R$ 100
```

**CAC:**
```
- Meta CAC orgânico: R$ 5 (via eventos)
- Meta CAC pago: R$ 15
- LTV/CAC = 6-20x
```

---

## 6. Projeções Financeiras

### Ano 1 (Validação)

| Métrica | Q1 | Q2 | Q3 | Q4 | Total |
|---------|-----|-----|-----|-----|-------|
| Eventos | 10 | 30 | 60 | 100 | 200 |
| Check-ins totais | 1K | 5K | 15K | 30K | 51K |
| Receita B2B | R$ 10K | R$ 40K | R$ 100K | R$ 180K | R$ 330K |
| Usuários Premium | 50 | 200 | 500 | 1.000 | - |
| Receita B2C | R$ 1K | R$ 4K | R$ 10K | R$ 20K | R$ 35K |
| **Receita Total** | **R$ 11K** | **R$ 44K** | **R$ 110K** | **R$ 200K** | **R$ 365K** |

### Ano 2 (Crescimento)

| Métrica | Valor |
|---------|-------|
| Eventos | 800 |
| Check-ins totais | 200K |
| Receita B2B | R$ 1.5M |
| Usuários Premium | 5.000 |
| Receita B2C | R$ 300K |
| **Receita Total** | **R$ 1.8M** |

### Ano 3 (Escala)

| Métrica | Valor |
|---------|-------|
| Eventos | 3.000 |
| Check-ins totais | 800K |
| Receita B2B | R$ 4M |
| Usuários Premium | 20.000 |
| Receita B2C | R$ 1.2M |
| **Receita Total** | **R$ 5.2M** |

---

## 7. Estrutura de Custos

### Custos Fixos (Mensal)

| Item | Ano 1 | Ano 2 | Ano 3 |
|------|-------|-------|-------|
| Time (salários) | R$ 50K | R$ 120K | R$ 300K |
| Infraestrutura | R$ 3K | R$ 15K | R$ 40K |
| Ferramentas | R$ 2K | R$ 5K | R$ 10K |
| Escritório | R$ 2K | R$ 5K | R$ 10K |
| **Total Fixo** | **R$ 57K** | **R$ 145K** | **R$ 360K** |

### Custos Variáveis

| Item | % da Receita |
|------|--------------|
| APIs terceiros | ~2% |
| Processamento pagamentos | ~3% |
| Marketing performance | ~15% |
| Comissões vendas | ~10% |

### Break-even

- **Ano 1:** Mês 8-10
- **Meta mensal:** R$ 70K receita

---

## 8. Go-to-Market

### Fase 1: Validação (Meses 1-6)

**Foco:** São Paulo, eventos de tecnologia

**Estratégia:**
1. Parcerias com 10 produtores de eventos
2. Integração com Sympla
3. 20 eventos piloto
4. 5.000 usuários

**Pricing:** Desconto agressivo (50% off) para primeiros cases

### Fase 2: Crescimento (Meses 7-12)

**Foco:** Expandir verticais (nightlife, fitness)

**Estratégia:**
1. Playbook replicável
2. Self-service para pequenos eventos
3. Upsell de features premium
4. 50 organizadores pagantes

### Fase 3: Escala (Ano 2+)

**Foco:** Outras cidades, API pública

**Estratégia:**
1. Expansão geográfica
2. Parcerias de distribuição
3. White-label para grandes players
4. API para integrações

---

## 9. Canais de Aquisição

### B2B

| Canal | Custo | Efetividade |
|-------|-------|-------------|
| Outbound direto | Médio | Alta |
| Parceria Sympla | Baixo | Alta |
| Eventos próprios | Alto | Média |
| Content marketing | Baixo | Média |
| Indicação B2B | Zero | Alta |

### B2C

| Canal | Custo | Efetividade |
|-------|-------|-------------|
| Viral (check-in = marketing) | Zero | Alta |
| Dentro dos eventos | Baixo | Alta |
| Instagram ads | Médio | Média |
| Influenciadores | Médio | Média |
| ASO (App Store) | Baixo | Média |

---

## 10. Parcerias Estratégicas

### Tier 1: Críticas

| Parceiro | Tipo | Valor |
|----------|------|-------|
| Sympla | Integração | Acesso a eventos |
| Eventbrite | Integração | Acesso a eventos |
| Instagram | API | Login e identidade |

### Tier 2: Importantes

| Parceiro | Tipo | Valor |
|----------|------|-------|
| Grandes produtoras | Distribuição | Volume |
| Redes de coworking | Canal | Usuários recorrentes |
| Redes de academias | Canal | Comunidade fitness |

---

## 11. Métricas de Sucesso

### Métricas de Negócio

| Métrica | Meta Ano 1 |
|---------|------------|
| MRR | R$ 30K |
| ARR | R$ 365K |
| Churn B2B | <5%/mês |
| LTV/CAC B2B | >10x |
| Conversão Free→Premium | >5% |

### Métricas de Produto

| Métrica | Meta |
|---------|------|
| Check-ins por evento | >30% dos participantes |
| Taxa de match | >10% das curtidas |
| NPS | >50 |
| D7 Retention | >40% |
| D30 Retention | >25% |

---

## 12. Vantagens Competitivas

1. **Match com Suspense** - Único app onde match revela no evento
2. **Intenções Claras** - Diferencia paquera de network
3. **CAC Baixo** - Cada check-in = marketing grátis
4. **Efeito de Rede** - Winner-takes-most por cidade
5. **Dados Únicos** - Presença física + intenção

---

## 13. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Cold start | Alto | Parcerias com eventos fechados |
| Sympla copia | Alto | Velocidade + diferenciação |
| Baixo comparecimento | Alto | Match como incentivo |
| Instagram muda API | Médio | Login alternativo (futuro) |

---

**Modelo de Negócio v2.0 - CheckMate**
*Atualizado após sessão de alinhamento*
