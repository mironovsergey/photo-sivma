import { createHmac } from 'crypto';
import { env } from '../config/env.js';

export function validateTelegramWebAppData(initData: string): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');

  urlParams.delete('hash');

  if (!hash) {
    return false;
  }

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(env.TELEGRAM_BOT_TOKEN).digest();
  const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return calculatedHash === hash;
}

export function parseTelegramWebAppData(initData: string): any {
  const urlParams = new URLSearchParams(initData);
  const userParam = urlParams.get('user');

  if (!userParam) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(userParam));
  } catch {
    return null;
  }
}
