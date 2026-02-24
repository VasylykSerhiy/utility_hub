# ============================================
# UA: Збірка web (Next.js) через turbo prune. EN: Web build via turbo prune.
# ============================================

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# --- Prepare: turbo prune для web
FROM base AS prepare
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune --scope=web --docker

# --- Builder: install + build
FROM base AS builder
COPY --from=prepare /app/out/json/ ./
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY --from=prepare /app/out/full/ ./
COPY --from=prepare /app/turbo.json ./turbo.json
RUN mkdir -p apps/web/public

# UA: Env для Next.js білду. Файл беремо з prepare (out/full його не містить). EN: Env from prepare stage.
ARG NODE
ENV NODE=${NODE}

COPY apps/web/.env.${NODE}.local apps/web/.env.local

RUN pnpm turbo run build --filter=web...

# --- Runner
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
