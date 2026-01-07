# AGENT LOOP PATTERNS - CHECKMATE

> **Versão:** 7.0
> **Projeto:** CheckMate - Social Presence Platform
> **Última Atualização:** 2026-01-06

---

## VISÃO GERAL

O Agent Loop é uma metodologia de **6 fases obrigatórias** que deve ser seguida em TODA tarefa executada pelo sistema MANUS.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌─────────┐   ┌──────┐   ┌─────────┐   ┌─────────┐          │
│   │ ANALYZE │ → │ PLAN │ → │ EXECUTE │ → │ OBSERVE │          │
│   └─────────┘   └──────┘   └─────────┘   └────┬────┘          │
│        ↑                                      │                │
│        │         ┌─────────┐   ┌─────────┐   │                │
│        └──────── │ DELIVER │ ← │ ITERATE │ ←─┘                │
│                  └─────────┘   └─────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FASE 1: ANALYZE

### Objetivo
Entender completamente o contexto antes de iniciar qualquer trabalho.

### Checklist Obrigatório

```typescript
/**
 * ANALYZE PHASE
 * Tempo estimado: 5-15 minutos
 */

// 1. Ler contexto completo
const contextFiles = [
  '.manus/ACTIVATION_PROMPT_v7.1.md',  // Prompt de ativação
  'tasks.md',                           // Tarefas e sprints
  'docs/PRD.md',                        // Requisitos do produto
  'docs/05-ARQUITETURA-TECNICA.md',     // Arquitetura
];

// 2. Revisar código relacionado
// REGRA: NUNCA modificar arquivo sem ler primeiro
const relatedCode = await glob('**/*.{ts,tsx}', {
  pattern: 'feature-relacionada'
});

// 3. Verificar conformidade
const conformanceCheck = {
  typescript: 'strict: true, sem any',
  asyncAwait: 'NUNCA .then()',
  validation: 'Zod para todos inputs',
  ui: 'NativeWind/Tailwind + componentes'
};

// 4. Decidir consulta a agentes
const taskComplexity = evaluateComplexity(task);
// < 15min → LIA sozinha
// 15-45min → 1 agente
// > 45min → 2-4 agentes paralelo
```

### Output Esperado
```markdown
## Análise Completa

### Contexto
- Task: [descrição]
- Arquivos relacionados: [lista]
- Dependências: [lista]

### Conformidade
- [ ] TypeScript strict
- [ ] Padrões de código
- [ ] Design system

### Decisão de Agentes
- Complexidade: [baixa/média/alta]
- Agentes necessários: [lista ou nenhum]
```

---

## FASE 2: PLAN

### Objetivo
Criar um plano claro e executável antes de escrever código.

### Checklist Obrigatório

```typescript
/**
 * PLAN PHASE
 * Tempo estimado: 5-10 minutos
 */

// 1. Definir escopo claro
const scope = {
  filesToCreate: ['src/features/checkin/CheckinButton.tsx'],
  filesToModify: ['src/navigation/AppNavigator.tsx'],
  dependencies: ['react-native-maps'],
  order: [
    '1. Criar componente base',
    '2. Adicionar lógica de GPS',
    '3. Integrar com API',
    '4. Adicionar ao navigator'
  ]
};

// 2. Consultar agentes se necessário
if (taskComplexity === 'high') {
  await consultAgents([
    'NEXUS',   // Para decisões de arquitetura
    'ATLAS',   // Para design do componente
    'ORACLE'   // Para estratégia de testes
  ]);
}

// 3. Criar checklist de subtarefas
const subtasks = [
  { task: 'Criar interface do componente', milestone: true },
  { task: 'Implementar hook useGeolocation', milestone: false },
  { task: 'Conectar com API de check-in', milestone: true },
  { task: 'Adicionar loading/error states', milestone: false },
  { task: 'Escrever testes unitários', milestone: true }
];

// 4. Atualizar tasks.md
await updateTasksFile({
  status: '[->]', // Em progresso
  task: 'Implementar CheckinButton',
  subtasks
});
```

### Output Esperado
```markdown
## Plano de Execução

### Escopo
- Criar: 3 arquivos
- Modificar: 2 arquivos
- Dependências: react-native-maps

### Subtarefas
1. [ ] Criar interface do componente ⭐
2. [ ] Implementar hook useGeolocation
3. [ ] Conectar com API de check-in ⭐
4. [ ] Adicionar estados de UI
5. [ ] Escrever testes ⭐

### Agentes Consultados
- ATLAS: Recomendou usar skeleton loader
- ORACLE: Sugeriu 3 casos de teste críticos
```

---

## FASE 3: EXECUTE

### Objetivo
Implementar o código seguindo padrões rigorosos.

### Padrões Obrigatórios

```typescript
/**
 * EXECUTE PHASE
 * Tempo: variável por tarefa
 */

// PADRÃO 1: TypeScript Strict
// ❌ ERRADO
const data: any = fetchData();

// ✅ CORRETO
interface CheckinData {
  id: string;
  eventId: string;
  userId: string;
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
  };
}
const data: CheckinData = await fetchData();


// PADRÃO 2: Async/Await
// ❌ ERRADO
fetchCheckins().then(data => {
  setCheckins(data);
}).catch(err => {
  setError(err);
});

// ✅ CORRETO
try {
  const data = await fetchCheckins();
  setCheckins(data);
} catch (err) {
  setError(err instanceof Error ? err : new Error('Unknown error'));
}


// PADRÃO 3: Zod Validation
import { z } from 'zod';

const CheckinSchema = z.object({
  eventId: z.string().uuid(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  })
});

// Validar ANTES de processar
const validatedData = CheckinSchema.parse(rawInput);


// PADRÃO 4: Componentes Completos
const CheckinButton: React.FC<Props> = ({ eventId }) => {
  const { mutate, isPending, error } = useCheckin();

  // ✅ Estado de Loading
  if (isPending) {
    return <ButtonSkeleton />;
  }

  // ✅ Estado de Erro
  if (error) {
    return (
      <ErrorAlert
        message={error.message}
        onRetry={() => mutate(eventId)}
      />
    );
  }

  // ✅ Estado Normal
  return (
    <Button
      onPress={() => mutate(eventId)}
      accessibilityLabel="Fazer check-in no evento"
      accessibilityRole="button"
    >
      Check-in
    </Button>
  );
};


// PADRÃO 5: Ferramentas Corretas
// Use Read para ler arquivos
// Use Edit para modificar (preferir sobre Write)
// Use Write apenas para criar novos
// Use Bash para comandos de terminal
```

### Checklist de Execução

```markdown
## Durante Execução

- [ ] TypeScript sem `any`
- [ ] Interfaces definidas
- [ ] async/await (nunca .then)
- [ ] Zod para validação
- [ ] try/catch para erros
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] ARIA labels
- [ ] Keyboard navigation
```

---

## FASE 4: OBSERVE

### Objetivo
Validar que a implementação está correta e funcional.

### Checklist Obrigatório

```typescript
/**
 * OBSERVE PHASE
 * Tempo estimado: 5-10 minutos
 */

// 1. Validar TypeScript
await bash('npm run typecheck');
// DEVE: 0 erros

// 2. Rodar testes
await bash('npm test -- --coverage');
// DEVE: >70% coverage
// DEVE: Todos passando

// 3. Rodar testes E2E (se aplicável)
await bash('npm run test:e2e -- --grep "checkin"');
// DEVE: Fluxos críticos passando

// 4. Verificar build
await bash('npm run build');
// DEVE: Sem erros
// VERIFICAR: Bundle size

// 5. Teste manual
const manualChecks = [
  'Funcionalidade OK no simulador',
  'UI responsiva',
  'Sem erros no console',
  'Performance aceitável'
];
```

### Output Esperado

```markdown
## Resultados da Observação

### TypeScript
✅ 0 erros

### Testes
✅ 45/45 passando
✅ Coverage: 78%

### Build
✅ Build success
📦 Bundle: 320KB (+15KB)

### Manual
✅ Check-in funciona
✅ Loading state aparece
✅ Erro tratado corretamente
⚠️ Animação poderia ser mais suave
```

---

## FASE 5: ITERATE

### Objetivo
Corrigir problemas e refinar a implementação.

### Quando Iterar

```typescript
/**
 * ITERATE PHASE
 * Executar quando houver problemas identificados
 */

// Cenário 1: Erros de TypeScript
if (typescriptErrors > 0) {
  // Corrigir tipos
  // Voltar para OBSERVE
}

// Cenário 2: Testes falhando
if (failingTests > 0) {
  // Analisar falhas
  // Corrigir código ou teste
  // Voltar para OBSERVE
}

// Cenário 3: Bugs funcionais
if (manualTestFailed) {
  // Debug
  // Corrigir
  // Voltar para OBSERVE
}

// Cenário 4: Feedback de agentes
if (agentSuggestedImprovements) {
  // ORACLE: "Adicione teste para edge case X"
  // HELIOS: "Input Y precisa de sanitização"
  // ATLAS: "Use skeleton em vez de spinner"
  // Implementar sugestões
  // Voltar para OBSERVE
}

// Cenário 5: Refatoração necessária
if (codeQualityIssues) {
  // Eliminar duplicação
  // Melhorar legibilidade
  // Otimizar performance
  // Voltar para OBSERVE
}
```

### Checklist de Iteração

```markdown
## Iteração

### Problemas Identificados
- [ ] Problema 1: [descrição] → [solução]
- [ ] Problema 2: [descrição] → [solução]

### Validação com Agentes
- ORACLE: Revisou testes ✅
- HELIOS: Auditou segurança ✅
- ATLAS: Validou UX ✅

### Loop Status
- Iterações: 2
- Voltar para: [FASE 3/OBSERVE/DELIVER]
```

---

## FASE 6: DELIVER

### Objetivo
Finalizar a tarefa com documentação e comunicação adequadas.

### Checklist Obrigatório

```typescript
/**
 * DELIVER PHASE
 * Tempo estimado: 5-10 minutos
 */

// 1. Atualizar tasks.md
await updateTasksFile({
  status: '[x]', // Completo
  task: 'Implementar CheckinButton',
  completedAt: new Date().toISOString()
});

// 2. Atualizar 7D Score
await updateScore({
  D2: '+2', // Código melhorou
  D3: '+3', // Novos testes
  D4: '+1'  // UI melhorou
});

// 3. Commit (se solicitado)
await bash(`
  git add .
  git commit -m "feat(checkin): implement CheckinButton component

  - Add geolocation hook
  - Integrate with check-in API
  - Add loading/error/empty states
  - Add unit tests (78% coverage)

  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
`);

// 4. Reportar conclusão
const report = {
  filesCreated: [
    'src/features/checkin/CheckinButton.tsx',
    'src/hooks/useGeolocation.ts',
    'src/features/checkin/__tests__/CheckinButton.test.tsx'
  ],
  filesModified: [
    'src/navigation/AppNavigator.tsx'
  ],
  testsAdded: 12,
  coverageChange: '+5%',
  scoreImpact: {
    D2: 80 → 82,
    D3: 68 → 71,
    D4: 80 → 81
  },
  nextSteps: [
    'Implementar tela de histórico de check-ins',
    'Adicionar animação de sucesso',
    'Integrar com push notifications'
  ]
};
```

### Output Esperado

```markdown
## Entrega Completa

### Resumo
✅ CheckinButton implementado com sucesso

### Arquivos
**Criados (3):**
- `src/features/checkin/CheckinButton.tsx`
- `src/hooks/useGeolocation.ts`
- `src/features/checkin/__tests__/CheckinButton.test.tsx`

**Modificados (1):**
- `src/navigation/AppNavigator.tsx`

### Métricas
- Testes adicionados: 12
- Coverage: 68% → 73%
- Bundle: +15KB

### 7D Score Impact
| Dimensão | Antes | Depois |
|----------|-------|--------|
| D2 Código | 80 | 82 |
| D3 Testes | 68 | 71 |
| D4 UX/UI | 80 | 81 |

### Próximos Passos
1. Implementar tela de histórico
2. Adicionar animação de sucesso
3. Integrar com push notifications
```

---

## REGRAS DO AGENT LOOP

### Regra 1: Nunca Pular Fases
```
❌ ERRADO: Pular ANALYZE e ir direto para EXECUTE
✅ CORRETO: Sempre passar pelas 6 fases em ordem
```

### Regra 2: ANALYZE Antes de Modificar
```
❌ ERRADO: Modificar arquivo sem ler
✅ CORRETO: Sempre ler arquivo completo antes de editar
```

### Regra 3: OBSERVE Sempre
```
❌ ERRADO: Entregar sem validar
✅ CORRETO: Rodar typecheck + tests + build antes de DELIVER
```

### Regra 4: Iterar Até Funcionar
```
❌ ERRADO: Ignorar erros de teste
✅ CORRETO: Loop ITERATE → OBSERVE até tudo passar
```

### Regra 5: DELIVER Documenta
```
❌ ERRADO: Terminar sem atualizar tasks.md
✅ CORRETO: Sempre atualizar docs e reportar mudanças
```

---

## EXEMPLOS DE APLICAÇÃO

### Exemplo 1: Bug Fix Simples
```
ANALYZE (2 min): Ler arquivo com bug, entender contexto
PLAN (1 min): Identificar linha, planejar fix
EXECUTE (5 min): Corrigir bug
OBSERVE (3 min): Rodar testes
ITERATE (0 min): Não necessário, passou
DELIVER (2 min): Atualizar tasks.md, reportar
Total: ~13 minutos
```

### Exemplo 2: Feature Nova
```
ANALYZE (15 min): Ler docs, código relacionado, decidir agentes
PLAN (10 min): Consultar NEXUS e ATLAS, criar checklist
EXECUTE (60 min): Implementar feature
OBSERVE (10 min): Testes, build, manual
ITERATE (20 min): Corrigir 3 problemas, refinar UI
DELIVER (10 min): Documentar, commit, reportar
Total: ~2 horas
```

### Exemplo 3: Refatoração
```
ANALYZE (20 min): Mapear código existente, identificar problemas
PLAN (15 min): Consultar THANOS, definir estratégia
EXECUTE (45 min): Refatorar incrementalmente
OBSERVE (15 min): Garantir que nada quebrou
ITERATE (30 min): Ajustes baseados em feedback
DELIVER (10 min): Documentar mudanças, atualizar score
Total: ~2.5 horas
```

---

## MÉTRICAS DO AGENT LOOP

### Qualidade do Loop
```typescript
interface LoopMetrics {
  phasesCompleted: 6;      // Sempre 6
  iterationCount: number;  // Menor = melhor
  testsPassRate: number;   // Meta: 100%
  buildSuccess: boolean;   // Sempre true
  docUpdated: boolean;     // Sempre true
}
```

### KPIs do Loop
```
- Taxa de Loop Completo: 100% (sempre 6 fases)
- Média de Iterações: <3 por tarefa
- Taxa de Build Success: 100%
- Taxa de Tests Pass: 100% no DELIVER
- Taxa de Docs Updated: 100%
```

---

**FIM DO AGENT LOOP PATTERNS v7**
