# --- Stage 1: Base ---
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo

# --- Stage 2: Pruner ---
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=server --docker

# --- Stage 3: Builder ---
FROM base AS builder
WORKDIR /app

# Копіюємо обрізані package.json та lockfile
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Встановлюємо залежності (dev потрібні для tsc)
RUN pnpm install --frozen-lockfile

# Копіюємо обрізаний код
COPY --from=pruner /app/out/full/ ./

# Білдимо TypeScript
WORKDIR /app/apps/server
RUN pnpm build

# --- Stage 4: Runner ---
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 expressjs \
    && adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/node_modules ./node_modules
COPY --from=builder /app/apps/server/package.json ./package.json

CMD ["node", "dist/main.js"]
