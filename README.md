# Utility Hub

**Utility Hub** — монопольний веб-застосунок для обліку комунальних послуг (електрика, вода, газ), тарифів та аналітики витрат по об'єктах нерухомості.

**Utility Hub** — a monorepo web application for tracking utilities (electricity, water, gas), tariffs, and spending analytics across properties.

---

## Зміст / Table of Contents

- [Функціонал / Features](#функціонал--features)
- [Технологічний стек / Tech Stack](#технологічний-стек--tech-stack)
- [Структура проєкту / Project Structure](#структура-проєкту--project-structure)
- [Передумови / Prerequisites](#передумови--prerequisites)
- [Встановлення / Installation](#встановлення--installation)
- [Змінні середовища / Environment Variables](#змінні-середовища--environment-variables)
- [Запуск / Running](#запуск--running)
- [Скрипти / Scripts](#скрипти--scripts)
- [Стиль коду / Code Style](#стиль-коду--code-style)
- [API](#api)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Додавання UI-компонентів / Adding UI Components](#додавання-ui-компонентів--adding-ui-components)

---

## Функціонал / Features

| Модуль | Опис / Description |
|--------|--------------------|
| **Авторизація** | Реєстрація, вхід (email + Google OAuth), відновлення пароля, підтвердження email. |
| **Dashboard** | Загальна статистика: витрати за місяць, тренд за 6 місяців, розбивка по категоріях (вода, газ, електрика, фіксовані), витрати по об'єктах. |
| **Об'єкти нерухомості** | CRUD об'єктів, лічильники (одно-/двотарифні), показники, історія місяців, зміна тарифу. |
| **Лічильники** | Створення лічильників, введення показників (день/ніч для двотарифних). |
| **Тарифи** | Перегляд та зміна тарифів по об'єктах. |
| **Інтернаціоналізація** | Українська та англійська мови (i18n). |
| **Теми** | Світла/темна тема (next-themes). |

---

## Технологічний стек / Tech Stack

| Категорія | Технологія |
|-----------|------------|
| **Monorepo** | pnpm workspaces, Turborepo |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Стилі** | Tailwind CSS, shadcn/ui (packages/ui) |
| **Стан та запити** | TanStack Query (React Query), Zustand |
| **Форми та валідація** | React Hook Form, Zod |
| **Backend** | Express 5, Node.js, TypeScript |
| **База даних / Auth** | Supabase (PostgreSQL + Auth) |
| **Лінтер / Форматер** | Biome |
| **Графіки** | Recharts |
| **Анімації** | Framer Motion |

---

## Структура проєкту / Project Structure

```
utility_hub/
├── apps/
│   ├── server/                 # Express API
│   │   ├── src/
│   │   │   ├── app.ts          # Express app, CORS, routes, error handler
│   │   │   ├── main.ts         # HTTP server, port
│   │   │   ├── configs/        # Supabase client
│   │   │   ├── controllers/    # auth, dashboard, property, user
│   │   │   ├── middlewares/    # auth
│   │   │   ├── mappers/        # DB → API DTO
│   │   │   ├── routes/         # /v1/auth, /v1/users, /v1/properties, /v1/dashboard
│   │   │   ├── services/       # business logic, Supabase calls
│   │   │   ├── responses/     # success/error response handlers
│   │   │   └── utils/
│   │   ├── scripts/            # keep-alive.ts (Supabase ping)
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                    # Next.js frontend
│       ├── app/
│       │   ├── (protected)/    # dashboard, property/[slug], property/create
│       │   ├── auth/           # sing-in, sing-up, forgot-password, confirm, update-password
│       │   └── layout.tsx
│       ├── src/
│       │   ├── components/     # forms, layout, modals, tables
│       │   ├── hooks/          # use-dashboard, use-property, use-user, use-tabs
│       │   ├── lib/            # axios, supabase client/server/middleware
│       │   ├── modules/        # dashboard, property (cards, charts, content)
│       │   ├── providers/     # query, modals, language, theme, animate
│       │   ├── services/      # API calls (dashboard, property, user)
│       │   ├── stores/        # modal state (Zustand)
│       │   └── constants/
│       ├── middleware.ts       # redirects, Supabase session
│       └── package.json
│
├── packages/
│   ├── i18n/                   # react-i18next, locales (en, uk)
│   ├── types/                  # dashboard, property, tariff, pagination, stores
│   ├── typescript-config/      # base, nextjs, express, react-library, utils
│   ├── ui/                     # shadcn/ui components (button, card, dialog, table, chart, …)
│   └── utils/                  # Zod schemas, dateFormat, formats, queryClient, translations
│
├── .github/workflows/          # Supabase keep-alive (cron Mon/Thu)
├── docker-compose.yml          # server image
├── pnpm-workspace.yaml
├── turbo.json
├── biome.json
└── package.json
```

---

## Передумови / Prerequisites

- **Node.js** ≥ 20  
- **pnpm** ≥ 10 (рекомендовано: `corepack enable && corepack prepare pnpm@10.4.1 --activate`)  
- Обліковий запис **Supabase** (проєкт + URL + anon key + service role key для backend)

---

## Встановлення / Installation

1. Клонування репозиторію:

   ```bash
   git clone <repository-url>
   cd utility_hub
   ```

2. Встановлення залежностей (з кореня монорепо):

   ```bash
   pnpm install
   ```

3. Налаштування змінних середовища (див. секцію нижче) для `apps/server` та `apps/web`.

---

## Змінні середовища / Environment Variables

### Backend (`apps/server`)

Створіть у `apps/server/` файл `.env.local` (або скопіюйте з `.env.example`, якщо є):

| Змінна | Опис | Обов'язкова |
|--------|------|-------------|
| `PORT` | Порт HTTP-сервера (за замовчуванням 3010) | Ні |
| `SUPABASE_URL` | URL проєкту Supabase | Так |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (секретний ключ для backend) | Так |

Для Docker-білду використовується `.env.development.local` (або відповідний для середовища).

### Frontend (`apps/web`)

У `apps/web/` потрібні файли для середовища, наприклад:

- `.env.development.local` — розробка  
- `.env.production.local` — продакшн  

Типові змінні (назви можуть відрізнятися залежно від коду):

| Змінна | Опис |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Публічний URL Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публічний (anon) ключ Supabase |
| `NEXT_PUBLIC_API_URL` або аналог | Base URL API (наприклад `http://localhost:3010`) для axios/API-клієнта |

Переконайтесь, що в коді клієнта (axios, env) використовуються ті самі імена змінних.

### GitHub Actions (Supabase Keep-Alive)

У репозиторії потрібні секрети:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Запуск / Running

### Усі сервіси (web + server)

З кореня проєкту:

```bash
pnpm dev
```

Запускаються одночасно Next.js (web) та Express (server) через Turborepo.

### Тільки frontend

```bash
pnpm dev:web
```

або з папки додатку:

```bash
pnpm --filter web dev
```

### Тільки backend

```bash
cd apps/server
pnpm dev
```

Сервер за замовчуванням слухає порт **3010** (або значення з `PORT` у `.env.local`).

### Збірка для продакшну

```bash
pnpm build
```

Після збірки:

- **Web:** `pnpm --filter web start`  
- **Server:** `cd apps/server && pnpm start` (запуск `node dist/main.js`)

---

## Скрипти / Scripts

| Скрипт | Дія |
|--------|-----|
| `pnpm dev` | Паралельний dev для web + server (turbo) |
| `pnpm dev:web` | Dev тільки для web |
| `pnpm build` | Збірка всіх пакетів (turbo) |
| `pnpm lint` | Перевірка лінтом (turbo) |
| `pnpm lint:fix` | Автофікс лінту (turbo) |
| `pnpm format` | Форматування коду (Biome) |
| `pnpm check` | Biome check з записом виправлень |
| `pnpm check:unsafe` | Biome check з unsafe-фіксами |

У `apps/server`: `dev`, `build`, `start`, `lint`.  
У `apps/web`: `dev`, `build`, `start`, `lint`, `lint:fix`, `typecheck`.

---

## Стиль коду / Code Style

- **Лінтер і форматер:** Biome (конфіг у `biome.json`).  
- **Правила:** 2 пробіли, одинарні лапки, trailing commas, LF.  
- Перевірка: `pnpm lint`, форматування: `pnpm format`, повна перевірка: `pnpm check`.  
- У проєкті заборонено використання `any`; використовуються типізації TypeScript та пакет `@workspace/types`.

---

## API

Базовий префікс: **`/v1`**.

| Префікс | Опис |
|---------|------|
| `/v1/auth` | Авторизація (OAuth, callback тощо) |
| `/v1/users` | Профіль користувача |
| `/v1/properties` | Об'єкти нерухомості, лічильники, показники, тарифи, місяці |
| `/v1/dashboard` | Агреговані дані для головної сторінки (витрати, тренди, розбивки) |

Захист: маршрути, що потребують авторизації, проходять через middleware з перевіркою JWT/Supabase-сесії.  
Формат відповідей: уніфікований через `success-response-handler` та `error-response-handler` (наприклад, JSON з полями `data` / `error`).

---

## Docker

- **Контекст збірки:** корінь репозиторію.  
- **Dockerfile:** `apps/server/Dockerfile` (multi-stage: builder → installer → runner).  
- **Образ:** збирається для сервісу `server` (наприклад, `ghcr.io/.../server:dev`).  
- **docker-compose.yml:** один сервіс `server`, порт `8080:8080`, env з `apps/server/.env.development.local`.

Запуск:

```bash
docker-compose up --build
```

Сервер у контейнері слухає порт **8080**.

---

## CI/CD

- **GitHub Actions:** workflow `Supabase Keep-Alive (pnpm)` у `.github/workflows/supabase-keep-alive.yml`.  
- **Призначення:** періодичний “пінґ” Supabase (скрипт `apps/server/scripts/keep-alive.ts`), щоб тримати бездіяльний проєкт активним.  
- **Розклад:** cron `0 0 * * 1,4` (Пн та Чт о 00:00 UTC).  
- **Ручний запуск:** `workflow_dispatch`.  
- Потрібні секрети: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

---

## Додавання UI-компонентів / Adding UI Components

Проєкт використовує **shadcn/ui** у пакеті `packages/ui`. Компоненти додаються з кореня монорепо з указанням контексту `apps/web`:

Ініціалізація (якщо ще не виконано):

```bash
pnpm dlx shadcn@latest init
```

Додавання компонента (наприклад, кнопка):

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Компоненти потрапляють у `packages/ui/src/components/`. У Next.js-додатку їх імпортують з воркспейс-пакету, наприклад:

```tsx
import { Button } from '@workspace/ui/components/button';
```

Tailwind і `globals.css` у `packages/ui` вже налаштовані для цих компонентів.

---

## Ліцензія / License

Проєкт приватний (private). Деталі ліцензії — за бажанням додати у репозиторій.

---

**Utility Hub** — облік комунальних послуг та аналітика витрат у одному місці.  
**Utility Hub** — track utilities and spending analytics in one place.
