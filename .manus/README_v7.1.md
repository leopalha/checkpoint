# MANUS v7.1 - Quick Start Guide

> **Projeto:** CheckMate - Social Presence Platform
> **Versão:** 7.1
> **Data:** 2026-01-06

---

## 🚀 O QUE É MANUS?

MANUS é uma **metodologia de desenvolvimento assistido por IA** que combina:

1. **10 Agentes Especializados** - Cada um expert em uma área
2. **Agent Loop (6 Fases)** - Metodologia rigorosa de execução
3. **7D Scoring** - Avaliação de qualidade em 7 dimensões
4. **20 Protocolos** - Regras de ouro invioláveis
5. **Ralph Loop** - Execução autônoma de tarefas

---

## 📁 ESTRUTURA DE ARQUIVOS

```
.manus/
├── ACTIVATION_PROMPT_v7.1.md    # Prompt principal de ativacao
├── KNOWLEDGE_BASE.md            # *** BASE DE CONHECIMENTO COMPLETA ***
├── README_v7.1.md               # Este arquivo
├── scoring/
│   ├── SCORING_SYSTEM_v7.md     # Sistema de 7 dimensoes
│   └── CURRENT_SCORE.md         # Score atual do projeto
├── patterns/
│   └── AGENT_LOOP_PATTERNS.md   # 6 fases do Agent Loop
├── agents/
│   └── agent-config.json        # Configuracao dos 10 agentes
└── _archive/
    └── PROTOCOLOS_MANUS.md      # 20 regras de ouro

docs/                            # Documentacao detalhada (referencia)
├── _INDEX.md                    # Indice de documentos
├── 00-ALINHAMENTO-v2.md         # Decisoes de produto
├── 01-VISAO-v2.md               # Visao geral
├── 02-NEGOCIO-v2.md             # Modelo de negocio
├── 03-FEATURES-v2.md            # Features detalhadas
├── 06-ROADMAP-v2.md             # Timeline
├── API-SPECIFICATION.md         # Endpoints e schemas
├── MOBILE-APP-SPEC.md           # Telas e navegacao
└── SECURITY-CHECKLIST.md        # Seguranca e LGPD

tasks.md                         # Tarefas e sprints do projeto
```

---

## 🎯 COMO USAR

### 1. Ativar o MANUS

Inicie qualquer sessao com:

```
MANUS, leia:
1. .manus/ACTIVATION_PROMPT_v7.1.md
2. .manus/KNOWLEDGE_BASE.md
3. tasks.md

Depois execute a primeira tarefa P0 pendente
seguindo o Agent Loop completo.
```

### 2. Modo Autopilot

Para execução autônoma:

```
MANUS, trabalhe em modo autopilot
```

Ou via terminal:
```bash
bash .claude/ralph_loop.sh "Complete Sprint SETUP-1" 30
```

### 3. Verificar Score

O 7D Score está em `.manus/scoring/CURRENT_SCORE.md`

---

## 🔄 AGENT LOOP (6 FASES)

Toda tarefa DEVE passar por:

```
1. ANALYZE  → Entender contexto
2. PLAN     → Planejar execução
3. EXECUTE  → Implementar código
4. OBSERVE  → Validar (testes, build)
5. ITERATE  → Corrigir problemas
6. DELIVER  → Documentar e entregar
```

---

## 👥 10 AGENTES

| Agente | Especialidade |
|--------|---------------|
| **NEXUS** | Arquitetura |
| **EXECUTOR** | Frontend/Mobile |
| **HELIOS** | Segurança |
| **ATLAS** | UI/UX |
| **THANOS** | Limpeza/Refactoring |
| **ORACLE** | Testes/QA |
| **AETHER** | Performance |
| **THEMIS** | Compliance/LGPD |
| **ARIA** | Chat/UX Conversacional |
| **PROMETHEUS** | DevOps/Infra |

---

## 📊 7D SCORING

| Dimensão | Peso | Meta |
|----------|------|------|
| D1 Documentação | 15% | 90+ |
| D2 Código | 25% | 85+ |
| D3 Testes | 20% | 70+ |
| D4 UX/UI | 15% | 85+ |
| D5 Segurança | 10% | 90+ |
| D6 Performance | 10% | 80+ |
| D7 Validação | 5% | 50+ |

### Níveis
- **95-100:** INVESTOR READY
- **90-94:** PRODUCTION READY
- **80-89:** MVP READY
- **70-79:** MVP BASIC
- **<70:** CRÍTICO

---

## ⚡ COMANDOS RÁPIDOS

```bash
# Verificar tasks
cat tasks.md

# Ver score atual
cat .manus/scoring/CURRENT_SCORE.md

# Iniciar Ralph Loop
bash .claude/ralph_loop.sh "tarefa" 30

# Parar Ralph Loop
bash .claude/ralph_loop.sh --stop

# Status do Ralph Loop
bash .claude/ralph_loop.sh --status
```

---

## 📋 CHECKLIST DIARIO

```markdown
## Inicio do Dia
[ ] Ler ACTIVATION_PROMPT_v7.1.md
[ ] Ler KNOWLEDGE_BASE.md (base de conhecimento)
[ ] Verificar tasks.md
[ ] Identificar proxima tarefa

## Durante Trabalho
[ ] Consultar KNOWLEDGE_BASE.md antes de criar codigo
[ ] Seguir Agent Loop (6 fases)
[ ] TypeScript strict (sem any)
[ ] Testes para novo codigo
[ ] Atualizar tasks.md

## Fim do Dia
[ ] Marcar tarefas completas [x]
[ ] Atualizar CURRENT_SCORE.md
[ ] Documentar blockers
```

---

## 🔗 LINKS UTEIS

### Arquivos MANUS (Obrigatorios)
- [ACTIVATION_PROMPT_v7.1.md](ACTIVATION_PROMPT_v7.1.md) - Prompt de ativacao
- [KNOWLEDGE_BASE.md](KNOWLEDGE_BASE.md) - **BASE DE CONHECIMENTO COMPLETA**
- [Tasks](../tasks.md) - Sprints e tarefas

### Sistema MANUS
- [Scoring System](scoring/SCORING_SYSTEM_v7.md)
- [Agent Loop](patterns/AGENT_LOOP_PATTERNS.md)
- [Agents Config](agents/agent-config.json)
- [Protocolos](_archive/PROTOCOLOS_MANUS.md)

### Docs de Referencia (quando precisar detalhes)
- [docs/_INDEX.md](../docs/_INDEX.md) - Indice completo

---

**MANUS v7.1 - CheckMate Ready!** 🚀
