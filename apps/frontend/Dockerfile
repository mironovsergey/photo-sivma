# =============================================================================
# Зависимости
# =============================================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Копирование конфигурационных файлов
COPY package*.json turbo.json ./
COPY apps/frontend/package*.json ./apps/frontend/

# Установка зависимостей
RUN npm ci

# =============================================================================
# Сборка
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Копирование node_modules из deps stage
COPY --from=deps /app/node_modules ./node_modules

# Копирование конфигурационных файлов
COPY package*.json turbo.json ./

# Копирование исходного кода фронтенда
COPY apps/frontend ./apps/frontend

# Build аргументы для передачи env переменных
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app/apps/frontend

# Сборка production бандла
RUN npm run build

# =============================================================================
# Запуск
# =============================================================================
FROM nginx:1.29-alpine AS runner

# Копирование собранных статичных файлов
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Кастомная Nginx конфигурация для SPA
RUN echo 'server { \
  listen 80; \
  server_name _; \
  root /usr/share/nginx/html; \
  index index.html; \
  \
  location / { \
  try_files $uri $uri/ /index.html; \
  } \
  \
  location /assets { \
  expires 1y; \
  add_header Cache-Control "public, immutable"; \
  } \
  \
  gzip on; \
  gzip_vary on; \
  gzip_min_length 1024; \
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml; \
  }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
