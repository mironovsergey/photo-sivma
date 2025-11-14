import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../types/index.js';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  }

  if (err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      message: `Ошибка загрузки файла: ${err.message}`,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
  });
}
