# CheckMate - Documentacao

> **Ultima Atualizacao:** 2026-01-06
> **Versao:** 2.1 (Estrutura Reorganizada)

---

## DOCUMENTOS ATIVOS

### Nivel 1: FONTE DA VERDADE

| Doc | Descricao |
|-----|-----------|
| [00-ALINHAMENTO-PRODUTO-v2.md](00-ALINHAMENTO-PRODUTO-v2.md) | **MASTER** - Todas as decisoes de produto |
| [11-PRD-PRODUCT-REQUIREMENTS.md](11-PRD-PRODUCT-REQUIREMENTS.md) | **PRD COMPLETO** - Personas, use cases, requisitos, regras |

### Nivel 2: Produto e Features

| Doc | Descricao |
|-----|-----------|
| [01-VISAO-GERAL-PRODUTO-v2.md](01-VISAO-GERAL-PRODUTO-v2.md) | Visao, proposta de valor, diferencial |
| [02-MODELO-DE-NEGOCIO-v2.md](02-MODELO-DE-NEGOCIO-v2.md) | Monetizacao B2B e B2C, unit economics |
| [03-FEATURES-FUNCIONALIDADES-v2.md](03-FEATURES-FUNCIONALIDADES-v2.md) | Features + Sistema de Temas + Interacoes |
| [04-USER-STORIES.md](04-USER-STORIES.md) | User stories por epic com criterios de aceite |
| [06-ROADMAP-MVP-v2.md](06-ROADMAP-MVP-v2.md) | Timeline 20 semanas, sprints |
| [PERSONAS.md](PERSONAS.md) | 5 personas usuario + 3 organizador |

### Nivel 3: Especificacoes Tecnicas

| Doc | Descricao |
|-----|-----------|
| [05-ARQUITETURA-TECNICA.md](05-ARQUITETURA-TECNICA.md) | Stack, diagramas, decisoes de arquitetura |
| [API-SPECIFICATION.md](API-SPECIFICATION.md) | Endpoints, schemas, WebSocket, auth |
| [MOBILE-APP-SPEC.md](MOBILE-APP-SPEC.md) | Telas, navegacao, componentes |
| [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md) | LGPD, anti-harassment, moderacao |

### Nivel 4: UX e Fluxos

| Doc | Descricao |
|-----|-----------|
| [07-WIREFRAMES-FLUXOS.md](07-WIREFRAMES-FLUXOS.md) | Wireframes ASCII, navegacao |
| [12-USER-FLOW-PARTE1.md](12-USER-FLOW-PARTE1.md) | Jornadas do usuario (parte 1) |
| [12-USER-FLOW-PARTE2.md](12-USER-FLOW-PARTE2.md) | Jornadas do usuario (parte 2) |

### Marca

| Doc | Descricao |
|-----|-----------|
| [BRAND-BOOK.md](BRAND-BOOK.md) | Identidade visual, cores, tipografia |

### Gestao

| Doc | Descricao |
|-----|-----------|
| [../tasks.md](../tasks.md) | Sprints e tarefas atuais |

---

## METODOLOGIA MANUS

| Doc | Descricao |
|-----|-----------|
| [../.manus/ACTIVATION_PROMPT_v7.1.md](../.manus/ACTIVATION_PROMPT_v7.1.md) | Prompt de ativacao |
| [../.manus/KNOWLEDGE_BASE.md](../.manus/KNOWLEDGE_BASE.md) | **INDICE** - Qual doc consultar |
| [../.manus/scoring/SCORING_SYSTEM_v7.md](../.manus/scoring/SCORING_SYSTEM_v7.md) | Sistema de pontuacao 7D |
| [../.manus/scoring/CURRENT_SCORE.md](../.manus/scoring/CURRENT_SCORE.md) | Score atual |
| [../.manus/patterns/AGENT_LOOP_PATTERNS.md](../.manus/patterns/AGENT_LOOP_PATTERNS.md) | Padroes do Agent Loop |
| [../.manus/agents/agent-config.json](../.manus/agents/agent-config.json) | Configuracao dos agentes |

---

## HIERARQUIA

```
                    ┌─────────────────────────┐
                    │  00-ALINHAMENTO-v2.md   │
                    │  11-PRD.md              │
                    │   (FONTE DA VERDADE)    │
                    └───────────┬─────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          v                     v                     v
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  01-VISAO-v2    │   │  02-NEGOCIO-v2  │   │  03-FEATURES-v2 │
│  PERSONAS       │   │                 │   │  04-USER-STORIES│
└─────────────────┘   └─────────────────┘   └─────────────────┘
          │                     │                     │
          v                     v                     v
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  07-WIREFRAMES  │   │  BRAND-BOOK.md  │   │  API-SPEC.md    │
│  12-USER-FLOW   │   │                 │   │  MOBILE-SPEC.md │
│                 │   │                 │   │  SECURITY.md    │
└─────────────────┘   └─────────────────┘   └─────────────────┘
                                │
                                v
                    ┌─────────────────────────┐
                    │    06-ROADMAP-v2.md     │
                    └───────────┬─────────────┘
                                │
                                v
                    ┌─────────────────────────┐
                    │      tasks.md           │
                    └─────────────────────────┘
```

---

## COMO USAR (PARA O MANUS)

| Se Voce Vai... | Consulte |
|----------------|----------|
| Saber O QUE FAZER | [tasks.md](../tasks.md) |
| Implementar feature | [11-PRD](11-PRD-PRODUCT-REQUIREMENTS.md) + [03-FEATURES](03-FEATURES-FUNCIONALIDADES-v2.md) + [04-USER-STORIES](04-USER-STORIES.md) |
| Criar endpoint | [API-SPECIFICATION.md](API-SPECIFICATION.md) |
| Criar tela | [MOBILE-APP-SPEC.md](MOBILE-APP-SPEC.md) + [07-WIREFRAMES](07-WIREFRAMES-FLUXOS.md) |
| Verificar regras | [11-PRD](11-PRD-PRODUCT-REQUIREMENTS.md) + [00-ALINHAMENTO](00-ALINHAMENTO-PRODUTO-v2.md) |
| Criterios de aceite | [04-USER-STORIES.md](04-USER-STORIES.md) |
| Entender fluxo | [12-USER-FLOW-PARTE1](12-USER-FLOW-PARTE1.md) + [PARTE2](12-USER-FLOW-PARTE2.md) |
| Verificar seguranca | [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md) |
| Monetizacao | [02-MODELO-DE-NEGOCIO-v2.md](02-MODELO-DE-NEGOCIO-v2.md) |

---

## ARQUIVO (_archive/)

Documentos de referencia historica movidos para `_archive/`.
Consultar apenas se precisar de contexto adicional.

Conteudo:
- 08-ANALISE-COMPETITIVA.md
- 09-PITCH-DECK.md
- 10-METRICAS-KPIS.md
- 13-MVP-VIRAL-SOCIAL-FEATURES.md
- 14-DESIGN-TEMPLATES-STORIES.md
- 15-MVP-ATUALIZADO-VIRAL.md
- 16-PLANO-ACAO-30-DIAS.md

---

## REGRA DE OURO

> **Para DECISOES de produto: 00-ALINHAMENTO-PRODUTO-v2.md**
> **Para IMPLEMENTACAO detalhada: 11-PRD-PRODUCT-REQUIREMENTS.md**
> **Em caso de conflito, 00-ALINHAMENTO prevalece.**

---

*Indice atualizado - 2026-01-06*
