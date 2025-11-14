# =============================================================================
# Зависимости
# =============================================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Копирование конфигурационных файлов
COPY package*.json ./
COPY turbo.json ./
COPY apps/backend/package*.json ./apps/backend/

# Установка зависимостей (включая root)
RUN npm ci

# =============================================================================
# Сборка
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Копирование node_modules из deps stage
COPY --from=deps /app/node_modules ./node_modules

# Копирование конфигурационных файлов
COPY package*.json ./
COPY turbo.json ./

# Копирование исходного кода бэкенда
COPY apps/backend ./apps/backend

# Генерация Prisma Client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Компиляция TypeScript
RUN npm run build

# =============================================================================
# Запуск
# =============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Установка только production зависимостей
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

RUN npm ci --omit=dev --workspace=@photo-sivma/backend

# Копирование скомпилированного кода
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

# Генерация Prisma Client в production
WORKDIR /app/apps/backend
RUN npx prisma generate

# Создание non-root пользователя
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nodejs && \
  chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

# Запуск приложения
CMD ["node", "dist/index.js"]
