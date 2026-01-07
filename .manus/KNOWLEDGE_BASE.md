# CHECKMATE - KNOWLEDGE BASE (INDICE DE REFERENCIA)

> **ESTE ARQUIVO E UM INDICE - CONSULTE OS DOCUMENTOS ORIGINAIS**
> **Ultima Atualizacao:** 2026-01-06

---

## COMO USAR ESTE INDICE

O MANUS deve consultar os documentos originais detalhados. Este arquivo serve como guia para saber QUAL documento consultar para CADA tipo de informacao.

---

## HIERARQUIA DE DOCUMENTOS

### NIVEL 1: FONTE DA VERDADE (SEMPRE CONSULTAR)

| Documento | Quando Consultar | Conteudo |
|-----------|------------------|----------|
| **[tasks.md](../tasks.md)** | SEMPRE no inicio | Sprints, tarefas pendentes, prioridades |
| **[00-ALINHAMENTO-PRODUTO-v2.md](../docs/00-ALINHAMENTO-PRODUTO-v2.md)** | Decisoes de produto | Todas decisoes de alinhamento, escopo, visao |

### NIVEL 2: ESPECIFICACOES TECNICAS

| Documento | Quando Consultar | Conteudo |
|-----------|------------------|----------|
| **[11-PRD-PRODUCT-REQUIREMENTS.md](../docs/11-PRD-PRODUCT-REQUIREMENTS.md)** | Features detalhadas, requisitos | PRD completo com personas, use cases, requisitos funcionais, modelos de dados, regras de negocio |
| **[API-SPECIFICATION.md](../docs/API-SPECIFICATION.md)** | Criar endpoints | Endpoints, schemas, WebSocket events |
| **[MOBILE-APP-SPEC.md](../docs/MOBILE-APP-SPEC.md)** | Criar telas | Navegacao, telas, wireframes |
| **[05-ARQUITETURA-TECNICA.md](../docs/05-ARQUITETURA-TECNICA.md)** | Arquitetura, infra | Stack, diagramas, decisoes tecnicas |

### NIVEL 3: FEATURES E UX

| Documento | Quando Consultar | Conteudo |
|-----------|------------------|----------|
| **[03-FEATURES-FUNCIONALIDADES-v2.md](../docs/03-FEATURES-FUNCIONALIDADES-v2.md)** | Implementar features | Sistema de interacoes, match, check-in, dashboard |
| **[04-USER-STORIES.md](../docs/04-USER-STORIES.md)** | Criterios de aceite | User stories por epic, acceptance criteria, story points |
| **[07-WIREFRAMES-FLUXOS.md](../docs/07-WIREFRAMES-FLUXOS.md)** | UI/UX, layout | Wireframes ASCII, fluxos de navegacao |
| **[12-USER-FLOW-PARTE1.md](../docs/12-USER-FLOW-PARTE1.md)** | Fluxos detalhados | Jornadas completas do usuario |
| **[12-USER-FLOW-PARTE2.md](../docs/12-USER-FLOW-PARTE2.md)** | Fluxos detalhados | Continuacao das jornadas |

### NIVEL 4: SUPORTE

| Documento | Quando Consultar | Conteudo |
|-----------|------------------|----------|
| **[SECURITY-CHECKLIST.md](../docs/SECURITY-CHECKLIST.md)** | Seguranca, LGPD | Checklist de seguranca, compliance |
| **[01-VISAO-GERAL-PRODUTO-v2.md](../docs/01-VISAO-GERAL-PRODUTO-v2.md)** | Visao geral | Problema, solucao, tagline |
| **[02-MODELO-DE-NEGOCIO-v2.md](../docs/02-MODELO-DE-NEGOCIO-v2.md)** | Monetizacao | Modelo de negocio, pricing |
| **[06-ROADMAP-MVP-v2.md](../docs/06-ROADMAP-MVP-v2.md)** | Timeline | Roadmap de 20 semanas |
| **[PERSONAS.md](../docs/PERSONAS.md)** | Usuarios-alvo | Personas detalhadas |

---

## RESUMO EXECUTIVO (MEMORIZE ISSO!)

### O Que E CheckMate

**Plataforma de presenca social** que conecta pessoas em eventos atraves de interacoes intencionais.

**Problema:** 70% das conexoes em eventos sao perdidas.

**Solucao:** Camada social com check-in + match revelado apenas no evento.

**Tagline:** "Descubra quem esta onde. Conecte-se com intencao."

### Core Feature: Match com Suspense

```
ANTES DO EVENTO:
1. Usuario A confirma presenca
2. A ve lista de confirmados
3. A curte B (foguinho, handshake, etc)
4. B curte A de volta
5. NENHUM DOS DOIS SABE DO MATCH AINDA (suspense!)

NO EVENTO (CHECK-IN):
6. A faz check-in (GPS dentro do raio)
7. B faz check-in
8. Sistema detecta: curtida mutua + ambos check-in
9. MATCH REVELADO!
10. Push notification para ambos
11. Chat liberado (7 dias)
```

### Sistema de Interacoes

| Icone | ID | Contexto |
|-------|-----|----------|
| 🔥 | fire | Paquera/Romance |
| 🤝 | handshake | Network Profissional |
| ✋ | highfive | Amizade |
| 🚗 | car | Compartilhar transporte |
| 🎫 | ticket | Dividir camarote/mesa |
| 🍾 | champagne | Experiencia VIP |
| 💼 | briefcase | Oportunidade de negocio |

### Sistema de Temas

O organizador escolhe um TEMA para o evento que define interacoes disponiveis e UX:

| Tema ID | Nome | Icone | Interacoes Padrao |
|---------|------|-------|-------------------|
| romantic | Romance | 💕 | 🔥 ✋ 🍾 |
| professional | Profissional | 💼 | 🤝 💼 ✋ |
| social | Social | 🎉 | 🔥 🤝 ✋ 🍾 |
| party | Festa | 🎊 | 🔥 ✋ 🍾 🎫 |
| networking | Networking | 🔗 | 🤝 💼 ✋ |
| fitness | Fitness | 💪 | ✋ 🔥 🚗 |
| tech | Tech/Startup | 🚀 | 🤝 💼 ✋ 🔥 |
| custom | Customizado | ⚙️ | Organizador escolhe |

### Stack Tecnica

```
Mobile: React Native + Expo + NativeWind
Backend: NestJS + Prisma + PostgreSQL + PostGIS
Dashboard: Next.js 14 + shadcn/ui
Real-time: Socket.io
Auth: Instagram OAuth + JWT
```

---

## REGRAS PARA O MANUS

### ORDEM DE LEITURA OBRIGATORIA

1. **SEMPRE** ler tasks.md primeiro (saber o que fazer)
2. **SEMPRE** consultar o documento especifico antes de implementar
3. **NUNCA** criar features que nao estao nos documentos
4. **NUNCA** mudar a logica de match (e o core!)

### QUAL DOCUMENTO CONSULTAR?

| Se Voce Vai... | Consulte |
|----------------|----------|
| Implementar uma feature | 11-PRD + 03-FEATURES + 04-USER-STORIES |
| Criar um endpoint | API-SPECIFICATION.md |
| Criar uma tela | MOBILE-APP-SPEC.md + 07-WIREFRAMES |
| Verificar regras de negocio | 11-PRD + 00-ALINHAMENTO |
| Verificar criterios de aceite | 04-USER-STORIES.md |
| Entender fluxo do usuario | 12-USER-FLOW-PARTE1 + PARTE2 |
| Verificar seguranca | SECURITY-CHECKLIST.md |
| Verificar monetizacao | 02-MODELO-DE-NEGOCIO |

### PADROES DE CODIGO

```typescript
// TypeScript strict (no any)
// Async/await (NUNCA .then())
// Zod para validacao
// NativeWind/Tailwind para UI
// Estados: loading, error, empty

// Componente completo:
[x] Estado loading (skeleton/spinner)
[x] Estado error (ErrorAlert + retry)
[x] Estado empty (ilustracao + CTA)
[x] TypeScript strict (no any)
[x] Testes unitarios
```

---

## LISTA DE DOCUMENTOS

### Ativos (docs/)

- _INDEX.md - Indice de navegacao
- 00-ALINHAMENTO-PRODUTO-v2.md - Fonte da verdade
- 01-VISAO-GERAL-PRODUTO-v2.md - Visao geral
- 02-MODELO-DE-NEGOCIO-v2.md - Monetizacao
- 03-FEATURES-FUNCIONALIDADES-v2.md - Features completas
- 04-USER-STORIES.md - User stories com criterios
- 05-ARQUITETURA-TECNICA.md - Arquitetura
- 06-ROADMAP-MVP-v2.md - Timeline
- 07-WIREFRAMES-FLUXOS.md - Wireframes
- 11-PRD-PRODUCT-REQUIREMENTS.md - PRD completo
- 12-USER-FLOW-PARTE1.md - Fluxos usuario
- 12-USER-FLOW-PARTE2.md - Fluxos usuario (cont.)
- API-SPECIFICATION.md - API endpoints
- MOBILE-APP-SPEC.md - App mobile
- PERSONAS.md - Personas
- SECURITY-CHECKLIST.md - Seguranca

### Arquivo (docs/_archive/) - Referencia Historica

- 08-ANALISE-COMPETITIVA.md
- 09-PITCH-DECK.md
- 10-METRICAS-KPIS.md
- 13-MVP-VIRAL-SOCIAL-FEATURES.md
- 14-DESIGN-TEMPLATES-STORIES.md
- 15-MVP-ATUALIZADO-VIRAL.md
- 16-PLANO-ACAO-30-DIAS.md

---

**FIM DO KNOWLEDGE BASE - CONSULTE OS DOCUMENTOS ORIGINAIS**
