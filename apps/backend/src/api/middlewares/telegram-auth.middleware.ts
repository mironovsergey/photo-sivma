import type { Response, NextFunction } from 'express';
import { AppError, TelegramRequest } from '../../types/index.js';
import { validateTelegramWebAppData, parseTelegramWebAppData } from '../../utils/telegram.js';

export function telegramAuthMiddleware(
  req: TelegramRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    const initData = req.headers['x-telegram-init-data'] as string;

    if (!initData) {
      throw new AppError(401, 'Отсутствуют данные авторизации Telegram');
    }

    const isValid = validateTelegramWebAppData(initData);

    if (!isValid) {
      throw new AppError(401, 'Недействительные данные авторизации Telegram');
    }

    const userData = parseTelegramWebAppData(initData);

    if (!userData) {
      throw new AppError(401, 'Не удалось получить данные пользователя');
    }

    req.telegramUser = userData;

    next();
  } catch (error) {
    next(error);
  }
}
