import Redis from 'ioredis';
import { CONSTANTS } from './constants';
import { env } from './env';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: CONSTANTS.REDIS_MAX_RETRIES,
  retryStrategy(times) {
    const delay = Math.min(
      times * CONSTANTS.REDIS_RETRY_DELAY_MS,
      CONSTANTS.REDIS_MAX_RETRY_DELAY_MS,
    );
    return delay;
  },
});

redis.on('connect', () => {
  console.log('Redis подключен');
});

redis.on('error', (error) => {
  console.error('Ошибка Redis:', error);
});

export default redis;
