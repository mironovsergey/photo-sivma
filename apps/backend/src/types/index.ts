import type { Request } from 'express';

export interface TelegramRequest extends Request {
  telegramUser?: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  };
}

export interface CreateOrderDto {
  photos: Express.Multer.File[];
  telegramId: number;
}

export interface OrderResponseDto {
  orderNumber: string;
  photosCount: number;
  totalSize: number;
  expiresAt: Date;
  createdAt: Date;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
