#!/bin/bash

echo "=========================================="
echo "   CheckPoint - Iniciando Ambiente Dev   "
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
echo -e "${YELLOW}Verificando Docker...${NC}"
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}Docker não está rodando! Por favor, inicie o Docker Desktop.${NC}"
    exit 1
fi
echo -e "${GREEN}Docker OK!${NC}"

# Start containers
echo -e "${YELLOW}Iniciando containers (PostgreSQL e Redis)...${NC}"
docker compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Aguardando PostgreSQL...${NC}"
until docker exec checkpoint-postgres pg_isready -U checkpoint > /dev/null 2>&1; do
    echo "Aguardando banco de dados..."
    sleep 2
done
echo -e "${GREEN}PostgreSQL pronto!${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências...${NC}"
    pnpm install
fi

# Generate Prisma client
echo -e "${YELLOW}Gerando Prisma client...${NC}"
cd apps/api
pnpm db:generate

# Run migrations
echo -e "${YELLOW}Executando migrations...${NC}"
pnpm db:migrate

# Seed database (optional)
echo -e "${YELLOW}Populando banco com dados de teste...${NC}"
pnpm db:seed 2>/dev/null || echo "Seed já executado ou não disponível"

cd ../..

echo ""
echo -e "${GREEN}=========================================="
echo "   Ambiente configurado com sucesso!      "
echo "==========================================${NC}"
echo ""
echo "Para iniciar os serviços, abra 3 terminais:"
echo ""
echo "Terminal 1 (API):"
echo "  cd apps/api && pnpm dev"
echo ""
echo "Terminal 2 (Mobile):"
echo "  cd apps/mobile && pnpm dev"
echo ""
echo "Terminal 3 (Dashboard):"
echo "  cd apps/dashboard && pnpm dev"
echo ""
echo "URLs:"
echo "  API:       http://localhost:3000"
echo "  Swagger:   http://localhost:3000/api"
echo "  Dashboard: http://localhost:3001"
echo "  pgAdmin:   http://localhost:5050 (use: docker compose --profile dev up pgadmin)"
