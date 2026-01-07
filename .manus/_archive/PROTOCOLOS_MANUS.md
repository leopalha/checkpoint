# PROTOCOLOS MANUS - 20 REGRAS DE OURO

> **Versão:** 7.0
> **Projeto:** CheckMate - Social Presence Platform
> **Última Atualização:** 2026-01-06

---

## VISÃO GERAL

Os Protocolos MANUS são **20 regras invioláveis** que garantem qualidade, consistência e eficiência no desenvolvimento do projeto CheckMate.

---

## CATEGORIA 1: EXECUÇÃO

### PROTOCOLO 1: AGENT LOOP OBRIGATÓRIO
```
REGRA: Toda tarefa DEVE passar pelas 6 fases do Agent Loop

ANALYZE → PLAN → EXECUTE → OBSERVE → ITERATE → DELIVER

VIOLAÇÃO: Pular qualquer fase
CONSEQUÊNCIA: Retrabalho, bugs, inconsistências
```

### PROTOCOLO 2: NUNCA PIORAR - SEMPRE EVOLUIR
```
REGRA: Código só pode ser modificado se for para MELHORAR

ANTES DE MODIFICAR:
1. LER arquivo atual COMPLETAMENTE
2. AVALIAR: "O atual já está melhor?"
3. SE SIM: INFORMAR e NÃO modificar
4. SE NÃO: EVOLUIR incrementalmente

VIOLAÇÃO: Substituir código bom por inferior
CONSEQUÊNCIA: Rollback obrigatório
```

### PROTOCOLO 3: ZERO DUPLICAÇÃO
```
REGRA: Não deve existir código ou arquivo duplicado

ANTES DE CRIAR:
1. BUSCAR: Arquivo similar existe? (Glob/Grep)
2. SE EXISTE: EDITAR existente
3. NUNCA criar: *-v2, *-new, *-backup, *-old
4. CONSOLIDAR duplicações encontradas

VIOLAÇÃO: Criar arquivo duplicado
CONSEQUÊNCIA: Merge ou delete obrigatório
```

### PROTOCOLO 4: TASKS.MD É FONTE DA VERDADE
```
REGRA: Toda tarefa deve estar documentada em tasks.md

WORKFLOW:
1. LER tasks.md ANTES de trabalhar
2. ATUALIZAR ao iniciar tarefa [->]
3. ATUALIZAR ao completar [x]
4. ADICIONAR novas descobertas

VIOLAÇÃO: Trabalhar sem atualizar tasks.md
CONSEQUÊNCIA: Trabalho pode ser perdido/duplicado
```

### PROTOCOLO 5: EXECUÇÃO HONESTA
```
REGRA: LIA é a ÚNICA entidade que executa código

VERDADE:
- LIA executa código
- Agentes apenas consultam e planejam
- NUNCA fingir que delegação aconteceu
- SEMPRE mostrar código REAL criado

VIOLAÇÃO: Fingir que outro agente executou
CONSEQUÊNCIA: Perda de rastreabilidade
```

---

## CATEGORIA 2: QUALIDADE DE CÓDIGO

### PROTOCOLO 6: TYPESCRIPT STRICT SEMPRE
```
REGRA: TypeScript deve ser configurado em modo strict

OBRIGATÓRIO:
- strict: true em tsconfig
- Sem `any` explícito (use unknown + type guard)
- Interfaces bem definidas
- Generics quando apropriado

VIOLAÇÃO: Usar `any` ou desabilitar strict
CONSEQUÊNCIA: Bugs em runtime, perda de type safety
```

### PROTOCOLO 7: ASYNC/AWAIT SEMPRE
```
REGRA: Usar async/await, NUNCA .then()

❌ PROIBIDO:
fetchData().then(data => {
  process(data);
}).catch(err => {
  handleError(err);
});

✅ OBRIGATÓRIO:
try {
  const data = await fetchData();
  process(data);
} catch (err) {
  handleError(err);
}

VIOLAÇÃO: Usar .then() chains
CONSEQUÊNCIA: Código difícil de manter
```

### PROTOCOLO 8: ZOD PARA VALIDAÇÃO
```
REGRA: Toda entrada de dados deve ser validada com Zod

ONDE USAR:
- APIs: Validar body, query, params
- Forms: Validar inputs de usuário
- External Data: Validar respostas de APIs externas

const Schema = z.object({...});
const validated = Schema.parse(input);

VIOLAÇÃO: Processar dados sem validação
CONSEQUÊNCIA: Vulnerabilidades, bugs
```

### PROTOCOLO 9: COMPONENTES COMPLETOS
```
REGRA: Todo componente deve ter 3 estados

OBRIGATÓRIO:
1. Loading State (skeleton ou spinner)
2. Error State (mensagem + retry)
3. Empty State (ilustração + CTA)

VIOLAÇÃO: Componente sem estados
CONSEQUÊNCIA: UX ruim, usuário perdido
```

### PROTOCOLO 10: ACESSIBILIDADE OBRIGATÓRIA
```
REGRA: Todo componente interativo deve ser acessível

OBRIGATÓRIO:
- ARIA labels em todos botões/inputs
- Navegação por keyboard
- Contrast ratio AA (4.5:1)
- Focus indicators visíveis

VIOLAÇÃO: Componente inacessível
CONSEQUÊNCIA: Exclusão de usuários, compliance
```

---

## CATEGORIA 3: DOCUMENTAÇÃO

### PROTOCOLO 11: DOCUMENTAÇÃO É LEI
```
REGRA: O que está documentado é a verdade oficial

HIERARQUIA:
1. ACTIVATION_PROMPT_v7.1.md
2. tasks.md
3. docs/*.md
4. Código (comentários)

VIOLAÇÃO: Implementar diferente do documentado
CONSEQUÊNCIA: Divergência, confusão
```

### PROTOCOLO 12: SSOT (Single Source of Truth)
```
REGRA: Cada informação deve existir em um único lugar

PROIBIDO:
- Mesma info em múltiplos arquivos
- Constantes duplicadas
- Configurações espalhadas

PERMITIDO:
- Referências a fonte única
- Imports de arquivo central

VIOLAÇÃO: Duplicar informação
CONSEQUÊNCIA: Divergência ao atualizar
```

### PROTOCOLO 13: CHANGELOG SEMPRE
```
REGRA: Mudanças significativas devem ser documentadas

FORMATO:
## [Data] - Descrição
- feat: Nova funcionalidade
- fix: Correção de bug
- refactor: Refatoração
- docs: Documentação

VIOLAÇÃO: Não documentar mudanças
CONSEQUÊNCIA: Histórico perdido
```

---

## CATEGORIA 4: TESTES

### PROTOCOLO 14: COVERAGE MÍNIMO 70%
```
REGRA: Coverage de testes deve ser >= 70%

METAS:
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

VIOLAÇÃO: Entregar com coverage < 70%
CONSEQUÊNCIA: Blocker para deploy
```

### PROTOCOLO 15: E2E PARA FLUXOS CRÍTICOS
```
REGRA: Fluxos críticos devem ter teste E2E

FLUXOS CRÍTICOS CHECKMATE:
- Login completo
- Criar perfil
- Fazer check-in
- Ver pessoas no evento
- Enviar/aceitar ReMatch

VIOLAÇÃO: Fluxo crítico sem E2E
CONSEQUÊNCIA: Regressões não detectadas
```

### PROTOCOLO 16: TESTES DEVEM PASSAR
```
REGRA: NUNCA entregar com testes falhando

ANTES DO DELIVER:
1. npm run typecheck (0 erros)
2. npm test (100% passando)
3. npm run build (sucesso)

VIOLAÇÃO: Merge com testes falhando
CONSEQUÊNCIA: Build quebrado, blocker
```

---

## CATEGORIA 5: SEGURANÇA

### PROTOCOLO 17: AUTH EM ROTAS PROTEGIDAS
```
REGRA: Toda rota que acessa dados deve verificar auth

OBRIGATÓRIO:
- JWT válido
- User ownership check
- Role verification

VIOLAÇÃO: Rota sem auth check
CONSEQUÊNCIA: Vulnerabilidade crítica (P0)
```

### PROTOCOLO 18: SANITIZAÇÃO DE INPUTS
```
REGRA: Todo input de usuário deve ser sanitizado

PROTEÇÕES:
- SQL Injection: Prisma ORM (parameterized)
- XSS: React escaping + DOMPurify
- Path Traversal: Validar paths

VIOLAÇÃO: Processar input raw
CONSEQUÊNCIA: Vulnerabilidade
```

### PROTOCOLO 19: SECRETS SEGUROS
```
REGRA: Secrets nunca devem estar no código

PROIBIDO:
- Senhas no código
- API keys hardcoded
- Tokens em commits

PERMITIDO:
- .env (não commitado)
- Secrets manager
- Variáveis de ambiente

VIOLAÇÃO: Commitar secret
CONSEQUÊNCIA: Rotação obrigatória
```

---

## CATEGORIA 6: PROCESSO

### PROTOCOLO 20: 7D SCORING RIGOROSO
```
REGRA: Todo trabalho deve impactar positivamente o 7D Score

APÓS CADA ENTREGA:
1. Recalcular dimensões afetadas
2. Atualizar CURRENT_SCORE.md
3. Identificar próximos gaps

META: Score >= 80 para deploy
META: Score >= 95 para INVESTOR READY

VIOLAÇÃO: Entregar sem atualizar score
CONSEQUÊNCIA: Qualidade não monitorada
```

---

## MATRIZ DE CONSEQUÊNCIAS

| Protocolo | Severidade | Ação |
|-----------|------------|------|
| 1-5 (Execução) | ALTA | Refazer tarefa |
| 6-10 (Código) | ALTA | Corrigir antes de merge |
| 11-13 (Docs) | MÉDIA | Atualizar docs |
| 14-16 (Testes) | ALTA | Blocker de deploy |
| 17-19 (Security) | CRÍTICA | Fix imediato (P0) |
| 20 (Scoring) | MÉDIA | Atualizar score |

---

## CHECKLIST RÁPIDO

```markdown
## Antes de Iniciar
[ ] Li ACTIVATION_PROMPT_v7.1.md
[ ] Li tasks.md
[ ] Identifiquei arquivos relacionados

## Durante Execução
[ ] TypeScript strict (sem any)
[ ] async/await (sem .then)
[ ] Zod para validação
[ ] Componentes com 3 estados
[ ] Acessibilidade (ARIA)

## Antes de Entregar
[ ] npm run typecheck (0 erros)
[ ] npm test (100% pass)
[ ] npm run build (sucesso)
[ ] Coverage >= 70%
[ ] tasks.md atualizado
[ ] 7D Score atualizado
```

---

## RESUMO DAS 20 REGRAS

```
EXECUÇÃO
1.  Agent Loop Obrigatório (6 fases)
2.  Nunca Piorar - Sempre Evoluir
3.  Zero Duplicação
4.  tasks.md é Fonte da Verdade
5.  Execução Honesta

CÓDIGO
6.  TypeScript Strict Sempre
7.  Async/Await Sempre
8.  Zod para Validação
9.  Componentes Completos (3 estados)
10. Acessibilidade Obrigatória

DOCUMENTAÇÃO
11. Documentação é Lei
12. SSOT (Single Source of Truth)
13. Changelog Sempre

TESTES
14. Coverage Mínimo 70%
15. E2E para Fluxos Críticos
16. Testes Devem Passar

SEGURANÇA
17. Auth em Rotas Protegidas
18. Sanitização de Inputs
19. Secrets Seguros

PROCESSO
20. 7D Scoring Rigoroso
```

---

**FIM DOS PROTOCOLOS MANUS v7**
