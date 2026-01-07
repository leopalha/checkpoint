#!/bin/bash
#
# RALPH LOOP - Autonomous Execution System
# Projeto: CheckMate - Social Presence Platform
# Versão: 7.0
#
# USO:
#   bash .claude/ralph_loop.sh "Descrição da tarefa" [max_iterations]
#
# EXEMPLOS:
#   bash .claude/ralph_loop.sh "Complete Sprint SETUP-1" 30
#   bash .claude/ralph_loop.sh "Fix all P0 blockers" 20
#   bash .claude/ralph_loop.sh "Implement authentication" 50
#

# ============================================
# CONFIGURAÇÃO
# ============================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_FILE="$PROJECT_ROOT/.claude/ralph_state.json"
TASKS_FILE="$PROJECT_ROOT/tasks.md"
LOG_FILE="$PROJECT_ROOT/.claude/ralph_loop.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ============================================
# FUNÇÕES UTILITÁRIAS
# ============================================

log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${CYAN}[$timestamp]${NC} $1"
    echo "[$timestamp] $1" >> "$LOG_FILE"
}

log_success() {
    log "${GREEN}✅ $1${NC}"
}

log_warning() {
    log "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    log "${RED}❌ $1${NC}"
}

log_info() {
    log "${BLUE}ℹ️  $1${NC}"
}

# ============================================
# GERENCIAMENTO DE ESTADO
# ============================================

init_state() {
    local task_description="$1"
    local max_iterations="$2"

    cat > "$STATE_FILE" << EOF
{
    "version": "7.0",
    "project": "checkmate",
    "taskDescription": "$task_description",
    "maxIterations": $max_iterations,
    "currentIteration": 0,
    "status": "running",
    "startedAt": "$(date -Iseconds)",
    "lastUpdatedAt": "$(date -Iseconds)",
    "completedTasks": [],
    "failedTasks": [],
    "pendingTasks": []
}
EOF
    log_info "Estado inicializado em $STATE_FILE"
}

update_state() {
    local field="$1"
    local value="$2"

    if command -v jq &> /dev/null; then
        local tmp=$(mktemp)
        jq ".$field = $value | .lastUpdatedAt = \"$(date -Iseconds)\"" "$STATE_FILE" > "$tmp"
        mv "$tmp" "$STATE_FILE"
    fi
}

increment_iteration() {
    if command -v jq &> /dev/null; then
        local current=$(jq '.currentIteration' "$STATE_FILE")
        update_state "currentIteration" "$((current + 1))"
    fi
}

get_current_iteration() {
    if command -v jq &> /dev/null; then
        jq '.currentIteration' "$STATE_FILE"
    else
        echo "0"
    fi
}

get_max_iterations() {
    if command -v jq &> /dev/null; then
        jq '.maxIterations' "$STATE_FILE"
    else
        echo "50"
    fi
}

# ============================================
# ANÁLISE DE TASKS
# ============================================

count_pending_tasks() {
    if [ -f "$TASKS_FILE" ]; then
        grep -c "^\[ \]" "$TASKS_FILE" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

count_in_progress_tasks() {
    if [ -f "$TASKS_FILE" ]; then
        grep -c "^\[->]" "$TASKS_FILE" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

count_completed_tasks() {
    if [ -f "$TASKS_FILE" ]; then
        grep -c "^\[x\]" "$TASKS_FILE" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

has_pending_work() {
    local pending=$(count_pending_tasks)
    local in_progress=$(count_in_progress_tasks)
    [ "$pending" -gt 0 ] || [ "$in_progress" -gt 0 ]
}

# ============================================
# VERIFICAÇÕES DE SEGURANÇA
# ============================================

check_stop_conditions() {
    local current=$(get_current_iteration)
    local max=$(get_max_iterations)

    # Condição 1: Max iterations atingido
    if [ "$current" -ge "$max" ]; then
        log_warning "MAX_ITERATIONS ($max) atingido. Parando loop."
        return 1
    fi

    # Condição 2: State file deletado (stop manual)
    if [ ! -f "$STATE_FILE" ]; then
        log_warning "State file deletado. Parando loop."
        return 1
    fi

    # Condição 3: Status alterado para 'stopped'
    if command -v jq &> /dev/null; then
        local status=$(jq -r '.status' "$STATE_FILE")
        if [ "$status" = "stopped" ]; then
            log_warning "Status alterado para 'stopped'. Parando loop."
            return 1
        fi
    fi

    # Condição 4: Não há mais trabalho pendente
    if ! has_pending_work; then
        log_success "Todas as tarefas completadas!"
        return 1
    fi

    return 0
}

# ============================================
# PROMPT INJECTION
# ============================================

generate_continuation_prompt() {
    local task_description="$1"
    local current_iteration=$(get_current_iteration)
    local max_iterations=$(get_max_iterations)
    local pending=$(count_pending_tasks)
    local completed=$(count_completed_tasks)

    cat << EOF
🔄 RALPH LOOP - Iteração $current_iteration/$max_iterations

📊 Status:
- Tarefas pendentes: $pending
- Tarefas completas: $completed

🎯 Objetivo: $task_description

📋 INSTRUÇÕES:
1. Leia tasks.md para identificar próxima tarefa pendente [ ]
2. Execute Agent Loop completo (6 fases) para a tarefa
3. Marque como completa [x] ao finalizar
4. Continue para próxima tarefa se houver

⚠️ REGRAS:
- Siga TODOS os 20 Protocolos MANUS
- Atualize 7D Score após mudanças significativas
- Reporte progresso real (não fingir)

🚀 Continue a execução autônoma...
EOF
}

# ============================================
# MAIN LOOP
# ============================================

main() {
    local task_description="${1:-"Execute all pending tasks"}"
    local max_iterations="${2:-50}"

    # Banner
    echo ""
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}║   🤖 RALPH LOOP - Autonomous Execution System               ║${NC}"
    echo -e "${PURPLE}║   📦 Projeto: CheckMate                                      ║${NC}"
    echo -e "${PURPLE}║   🏷️  Versão: 7.0                                            ║${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    # Verificar dependências
    if ! command -v jq &> /dev/null; then
        log_warning "jq não instalado. Algumas features serão limitadas."
    fi

    # Verificar tasks.md
    if [ ! -f "$TASKS_FILE" ]; then
        log_error "tasks.md não encontrado em $TASKS_FILE"
        log_info "Crie o arquivo tasks.md antes de iniciar o Ralph Loop"
        exit 1
    fi

    # Inicializar estado
    log_info "Iniciando Ralph Loop..."
    log_info "Tarefa: $task_description"
    log_info "Max iterações: $max_iterations"
    init_state "$task_description" "$max_iterations"

    # Status inicial
    echo ""
    log_info "📊 Status Inicial:"
    log_info "   Pendentes: $(count_pending_tasks)"
    log_info "   Em progresso: $(count_in_progress_tasks)"
    log_info "   Completas: $(count_completed_tasks)"
    echo ""

    # Loop principal
    while check_stop_conditions; do
        increment_iteration
        local current=$(get_current_iteration)

        echo ""
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        log_info "🔄 Iteração $current de $max_iterations"
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""

        # Gerar prompt de continuação
        local prompt=$(generate_continuation_prompt "$task_description")
        echo -e "${YELLOW}$prompt${NC}"
        echo ""

        # Aqui o Claude Code receberia o prompt e executaria
        # Em produção, isso seria integrado com o Claude Code CLI
        log_info "Aguardando execução do Claude Code..."
        log_info "(Em produção, o prompt acima seria injetado automaticamente)"

        # Para demonstração, aguardar input
        echo ""
        echo -e "${GREEN}Pressione ENTER para simular próxima iteração, ou CTRL+C para parar${NC}"
        read -r

    done

    # Finalização
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    log_success "Ralph Loop finalizado!"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # Relatório final
    log_info "📊 Relatório Final:"
    log_info "   Total de iterações: $(get_current_iteration)"
    log_info "   Tarefas pendentes: $(count_pending_tasks)"
    log_info "   Tarefas completas: $(count_completed_tasks)"
    echo ""

    # Atualizar status final
    update_state "status" '"completed"'

    log_info "Log salvo em: $LOG_FILE"
    log_info "Estado salvo em: $STATE_FILE"
}

# ============================================
# COMANDOS AUXILIARES
# ============================================

stop_loop() {
    if [ -f "$STATE_FILE" ]; then
        update_state "status" '"stopped"'
        log_warning "Ralph Loop será parado na próxima verificação"
    else
        log_error "Nenhum Ralph Loop ativo"
    fi
}

status_loop() {
    if [ -f "$STATE_FILE" ]; then
        echo ""
        echo -e "${CYAN}📊 Status do Ralph Loop:${NC}"
        echo ""
        if command -v jq &> /dev/null; then
            jq '.' "$STATE_FILE"
        else
            cat "$STATE_FILE"
        fi
        echo ""
    else
        log_info "Nenhum Ralph Loop ativo"
    fi
}

clean_loop() {
    rm -f "$STATE_FILE"
    rm -f "$LOG_FILE"
    log_success "Arquivos do Ralph Loop removidos"
}

# ============================================
# ENTRY POINT
# ============================================

case "${1:-}" in
    --stop)
        stop_loop
        ;;
    --status)
        status_loop
        ;;
    --clean)
        clean_loop
        ;;
    --help|-h)
        echo ""
        echo "RALPH LOOP - Autonomous Execution System"
        echo ""
        echo "USO:"
        echo "  bash ralph_loop.sh \"Descrição da tarefa\" [max_iterations]"
        echo ""
        echo "COMANDOS:"
        echo "  --help, -h    Mostra esta ajuda"
        echo "  --status      Mostra status do loop atual"
        echo "  --stop        Para o loop na próxima iteração"
        echo "  --clean       Remove arquivos de estado e log"
        echo ""
        echo "EXEMPLOS:"
        echo "  bash ralph_loop.sh \"Complete Sprint SETUP-1\" 30"
        echo "  bash ralph_loop.sh \"Fix all P0 blockers\" 20"
        echo "  bash ralph_loop.sh --status"
        echo ""
        ;;
    *)
        main "$@"
        ;;
esac
