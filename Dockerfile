FROM node:18-alpine AS builder

WORKDIR /app

# Copy API files
COPY apps/api/package*.json ./
RUN npm ci

COPY apps/api/ ./

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Environment
ENV NODE_ENV=production

EXPOSE 3000

# Run migrations and start
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/main"]
