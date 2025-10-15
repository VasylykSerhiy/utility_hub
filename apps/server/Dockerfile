FROM node:lts AS builder
WORKDIR /app

# Встановлюємо turbo глобально через pnpm
RUN npm install -g turbo
COPY . .

# Виконуємо turbo prune для ізоляції server-пакету
RUN turbo prune --scope=server --docker

# --- Stage 2: Installer ---
FROM node:lts AS installer
WORKDIR /app

# Копіюємо lockfile і package.json із підготовленого білду
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ ./
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Встановлюємо pnpm
RUN npm install -g pnpm

# Встановлюємо залежності з lockfile
RUN pnpm install --frozen-lockfile

# Копіюємо full workspace та turbo.json
COPY --from=builder /app/out/full/ ./
COPY turbo.json turbo.json

ARG NODE
ENV NODE=${NODE}

COPY apps/server/.env.${NODE}.local apps/server/.env.local

# Бідуємо server-пакет
RUN pnpm turbo run build --filter=server...

# --- Stage 3: Runner ---
FROM node:lts AS runner
WORKDIR /app

# Копіюємо готові файли із installer
COPY --from=installer /app ./

WORKDIR /app/apps/server


EXPOSE 8080
CMD ["node", "dist/main.js"]
