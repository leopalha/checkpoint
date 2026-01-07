# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN cd apps/api && pnpm db:generate

# Build
RUN pnpm turbo build --filter=@checkpoint/api

# Production stage
FROM node:20-alpine AS runner

RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copy built files
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/api

# Expose port
EXPOSE 3000

# Start command
CMD ["sh", "-c", "pnpm db:migrate:prod && node dist/main.js"]
