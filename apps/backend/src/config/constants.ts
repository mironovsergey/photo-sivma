import { env } from './env';

export const CONSTANTS = {
  ORDER_PREFIX: 'SIV',
  ORDER_EXPIRY_DAYS: 3,

  MAX_PHOTOS_PER_UPLOAD: 10,
  MAX_FILE_SIZE_MB: env.MAX_FILE_SIZE / 1024 / 1024,
  MAX_TOTAL_SIZE_MB: env.MAX_TOTAL_SIZE / 1024 / 1024,

  ALLOWED_MIME_TYPES: ['image/jpg', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.heic', '.heif'],

  REDIS_MAX_RETRIES: 3,
  REDIS_RETRY_DELAY_MS: 50,
  REDIS_MAX_RETRY_DELAY_MS: 2000,

  MINIO_REGION: 'us-east-1',
  MINIO_LIFECYCLE_EXPIRY_DAYS: 3,

  REDIS_KEYS: {
    USER_SESSION: (telegramId: number) => `session:user:${telegramId}`,
    ORDER_LOCK: (orderId: string) => `lock:order:${orderId}`,
  },
} as const;
