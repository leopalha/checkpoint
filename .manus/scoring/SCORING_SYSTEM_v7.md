# 7D SCORING SYSTEM - CHECKMATE

> **Versão:** 7.0
> **Projeto:** CheckMate - Social Presence Platform
> **Última Atualização:** 2026-01-06

---

## VISÃO GERAL

O 7D Scoring System é um framework de avaliação de qualidade que mede o projeto em **7 dimensões críticas**. Cada dimensão tem peso específico e critérios claros de avaliação.

### Fórmula Global

```
Score Final = (D1×15%) + (D2×25%) + (D3×20%) + (D4×15%) + (D5×10%) + (D6×10%) + (D7×5%)
```

### Níveis de Maturidade

| Score | Nível | Ação |
|-------|-------|------|
| 95-100 | INVESTOR READY | Deploy produção + Pitch para investidores |
| 90-94 | PRODUCTION READY | Deploy produção |
| 80-89 | MVP READY | Deploy staging para testes |
| 70-79 | MVP BASIC | Não deployar, resolver P1s |
| <70 | CRÍTICO | Parar tudo, resolver P0s |

---

## D1: DOCUMENTAÇÃO (15%)

### Meta: 90+

### Critérios de Avaliação

| Critério | Peso | Descrição |
|----------|------|-----------|
| SSOT (Single Source of Truth) | 30% | Cada info existe em um único lugar |
| Consistência | 25% | Terminologia e formato uniformes |
| Atualização | 25% | Docs refletem código atual |
| Completude | 20% | Todas áreas cobertas |

### Checklist de Documentação

```markdown
## Documentação Técnica
[ ] README.md atualizado
[ ] Arquitetura documentada
[ ] APIs documentadas (OpenAPI/Swagger)
[ ] Database schema documentado
[ ] Setup de desenvolvimento

## Documentação de Produto
[ ] PRD atualizado
[ ] User stories com acceptance criteria
[ ] Wireframes/mockups atualizados
[ ] Fluxos de usuário

## Documentação de Processo
[ ] tasks.md com tarefas atuais
[ ] CHANGELOG.md
[ ] Contributing guidelines
[ ] Code style guide
```

### Cálculo do Score D1

```typescript
D1 = (
  (SSOT_score × 0.30) +
  (Consistencia_score × 0.25) +
  (Atualizacao_score × 0.25) +
  (Completude_score × 0.20)
)
```

---

## D2: CÓDIGO (25%)

### Meta: 85+

### Critérios de Avaliação

| Critério | Peso | Descrição |
|----------|------|-----------|
| Build Success | 30% | Build passa sem erros |
| TypeScript Strict | 25% | Zero erros TS, sem `any` |
| Lint Clean | 20% | ESLint sem warnings |
| Arquitetura | 15% | Padrões consistentes |
| DRY | 10% | Sem duplicação |

### Checklist de Código

```markdown
## TypeScript
[ ] strict: true em tsconfig
[ ] Sem `any` explícito
[ ] Interfaces bem definidas
[ ] Generics quando apropriado

## Padrões
[ ] async/await (nunca .then)
[ ] Error handling consistente
[ ] Naming conventions
[ ] File structure organizada

## Qualidade
[ ] Build sem erros
[ ] ESLint sem warnings
[ ] Sem código morto
[ ] Sem console.log em prod
```

### Cálculo do Score D2

```typescript
D2 = (
  (Build_score × 0.30) +
  (TypeScript_score × 0.25) +
  (Lint_score × 0.20) +
  (Arquitetura_score × 0.15) +
  (DRY_score × 0.10)
)
```

---

## D3: TESTES (20%)

### Meta: 70+

### Critérios de Avaliação

| Critério | Peso | Descrição |
|----------|------|-----------|
| Coverage | 35% | Cobertura de código |
| Unit Tests | 25% | Testes unitários passando |
| Integration | 20% | Testes de integração |
| E2E | 20% | Fluxos críticos testados |

### Metas de Coverage

```yaml
Mobile (React Native):
  - Statements: 70%
  - Branches: 60%
  - Functions: 70%
  - Lines: 70%

Backend (NestJS):
  - Statements: 80%
  - Branches: 70%
  - Functions: 80%
  - Lines: 80%

Dashboard (Next.js):
  - Statements: 70%
  - Branches: 60%
  - Functions: 70%
  - Lines: 70%
```

### Fluxos E2E Obrigatórios

```markdown
## Mobile
[ ] Login com Instagram
[ ] Completar perfil
[ ] Fazer check-in
[ ] Ver pessoas no evento
[ ] Enviar ReMatch request
[ ] Aceitar ReMatch
[ ] Ver histórico de check-ins

## Dashboard B2B
[ ] Login organizador
[ ] Criar evento
[ ] Ver métricas do evento
[ ] Gerar QR code
[ ] Exportar relatório
```

### Cálculo do Score D3

```typescript
D3 = (
  (Coverage_score × 0.35) +
  (Unit_score × 0.25) +
  (Integration_score × 0.20) +
  (E2E_score × 0.20)
)
```

---

## D4: UX/UI (15%)

### Meta: 85+

### Critérios de Avaliação

| Critério | Peso | Descrição |
|----------|------|-----------|
| Design System | 30% | Componentes consistentes |
| Estados UI | 25% | Loading/Error/Empty |
| Responsividade | 20% | Mobile-first |
| Acessibilidade | 15% | ARIA, keyboard |
| Micro-interações | 10% | Animações, feedback |

### Checklist UX/UI

```markdown
## Design System
[ ] Cores do brand aplicadas
[ ] Tipografia consistente
[ ] Spacing system (4px/8px)
[ ] Componentes reutilizáveis

## Estados
[ ] Todos componentes têm loading state
[ ] Error states com retry
[ ] Empty states com CTA
[ ] Skeleton loaders

## Responsividade
[ ] Mobile-first
[ ] Tablet layout
[ ] Safe areas (notch, bottom)

## Acessibilidade
[ ] ARIA labels
[ ] Navegação por keyboard
[ ] Contrast ratio AA
[ ] Focus indicators
```

### Cálculo do Score D4

```typescript
D4 = (
  (DesignSystem_score × 0.30) +
  (Estados_score × 0.25) +
  (Responsivo_score × 0.20) +
  (A11y_score × 0.15) +
  (Micro_score × 0.10)
)
```

---

## D5: SEGURANÇA (10%)

### Meta: 90+

### Critérios de Avaliação

| Critério | Peso | Descrição |
|----------|------|-----------|
| Auth/AuthZ | 35% | Autenticação e autorização |
| Input Validation | 25% | Zod em todas entradas |
| OWASP Top 10 | 20% | Proteções básicas |
| Data Protection | 20% | LGPD compliance |

### Checklist Segurança

```markdown
## Autenticação
[ ] JWT com refresh tokens
[ ] Tokens expiration configurado
[ ] Logout invalida tokens
[ ] Password hashing (bcrypt)

## Autorização
[ ] Roles definidos (user, organizer, admin)
[ ] Guards em todas rotas protegidas
[ ] Verificação de ownership

## Validação
[ ] Zod em todas APIs
[ ] Sanitização de inputs
[ ] File upload validation
[ ] Rate limiting

## OWASP
[ ] SQL Injection: Prisma ORM
[ ] XSS: React escaping
[ ] CSRF: tokens
[ ] Headers de segurança
```

### Cálculo do Score D5

```typescript
D5 = (
  (Auth_score × 0.35) +
  (Validation_score × 0.25) +
  (OWASP_score × 0.20) +
  (DataProtection_score × 0.20)
)
```

---

## D6: PERFORMANCE (10%)

### Meta: 80+

### Critérios de Avaliação

| Critério | Peso | Descrição |
|----------|------|-----------|
| Load Time | 30% | TTI < 3s mobile |
| Bundle Size | 25% | JS < 500KB gzipped |
| API Response | 25% | P95 < 500ms |
| Memory | 20% | Sem memory leaks |

### Metas de Performance

```yaml
Mobile:
  - Cold start: < 3s
  - Screen transition: < 300ms
  - API calls: < 1s (p95)
  - Memory: < 200MB

Backend:
  - API response: < 200ms (p50)
  - API response: < 500ms (p95)
  - Database queries: < 100ms
  - WebSocket latency: < 100ms

Dashboard:
  - Lighthouse Performance: > 80
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1
```

### Cálculo do Score D6

```typescript
D6 = (
  (LoadTime_score × 0.30) +
  (Bundle_score × 0.25) +
  (API_score × 0.25) +
  (Memory_score × 0.20)
)
```

---

## D7: VALIDAÇÃO REAL (5%)

### Meta: 50+

### Critérios de Avaliação

| Critério | Peso | Descrição |
|----------|------|-----------|
| User Testing | 40% | Testes com usuários reais |
| Feedback Loop | 30% | Coleta e análise de feedback |
| Metrics | 30% | Analytics implementado |

### Checklist Validação

```markdown
## User Testing
[ ] 5+ usuários testaram fluxo principal
[ ] Feedback documentado
[ ] Issues identificados
[ ] Melhorias implementadas

## Analytics
[ ] Eventos de tracking definidos
[ ] Mixpanel/Amplitude integrado
[ ] Funnel de conversão
[ ] Error tracking (Sentry)

## Feedback
[ ] In-app feedback
[ ] NPS survey
[ ] Bug report flow
```

### Cálculo do Score D7

```typescript
D7 = (
  (UserTesting_score × 0.40) +
  (Feedback_score × 0.30) +
  (Metrics_score × 0.30)
)
```

---

## CÁLCULO DO SCORE FINAL

### Exemplo

```typescript
// Scores individuais
const D1 = 85;  // Documentação
const D2 = 80;  // Código
const D3 = 70;  // Testes
const D4 = 82;  // UX/UI
const D5 = 90;  // Segurança
const D6 = 75;  // Performance
const D7 = 40;  // Validação Real

// Cálculo final
const score = (
  (D1 × 0.15) +  // 12.75
  (D2 × 0.25) +  // 20.00
  (D3 × 0.20) +  // 14.00
  (D4 × 0.15) +  // 12.30
  (D5 × 0.10) +  //  9.00
  (D6 × 0.10) +  //  7.50
  (D7 × 0.05)    //  2.00
);

// Score = 77.55 → MVP BASIC
```

---

## TEMPLATE DE AVALIAÇÃO

```markdown
# 7D Score Report - [DATA]

## Score Atual: XX.XX

| Dimensão | Score | Meta | Status |
|----------|-------|------|--------|
| D1 Documentação | XX | 90 | ⚠️/✅ |
| D2 Código | XX | 85 | ⚠️/✅ |
| D3 Testes | XX | 70 | ⚠️/✅ |
| D4 UX/UI | XX | 85 | ⚠️/✅ |
| D5 Segurança | XX | 90 | ⚠️/✅ |
| D6 Performance | XX | 80 | ⚠️/✅ |
| D7 Validação | XX | 50 | ⚠️/✅ |

## Nível: [MVP BASIC/MVP READY/PRODUCTION/INVESTOR]

## Gaps Identificados
- [ ] Gap 1 (P0/P1/P2)
- [ ] Gap 2 (P0/P1/P2)

## Próximas Ações
1. Ação 1
2. Ação 2
```

---

## REGRAS DE SCORING

1. **Ser honesto** - Não inflar scores
2. **Evidências** - Cada score precisa de evidência
3. **Atualizar frequentemente** - Após cada sprint
4. **Foco em gaps** - Priorizar dimensões abaixo da meta
5. **P0 primeiro** - Blockers antes de melhorias

---

**FIM DO SCORING SYSTEM v7**
