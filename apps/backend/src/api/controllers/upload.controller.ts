import type { Response, NextFunction } from 'express';
import { AppError, type TelegramRequest } from '../../types';
import userService from '../../services/user.service.js';
import orderService from '../../services/order.service.js';
import telegramService from '../../services/telegram.service.js';

export class UploadController {
  async uploadPhotos(req: TelegramRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      const telegramUser = req.telegramUser;

      if (!telegramUser) {
        throw new AppError(401, 'Необходима авторизация');
      }

      if (!files || files.length === 0) {
        throw new AppError(400, 'Необходимо загрузить хотя бы один файл');
      }

      const user = await userService.findOrCreate({
        telegramId: BigInt(telegramUser.id),
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
      });

      if (!user.phoneNumber) {
        throw new AppError(403, 'Необходимо поделиться номером телефона в боте');
      }

      const order = await orderService.createOrder(user.id, files);
      const downloadUrls = await orderService.getOrderDownloadUrls(order.id);

      await telegramService.notifyNewOrder(order, downloadUrls);

      res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          photosCount: order.photosCount,
          totalSize: Number(order.totalSize),
          expiresAt: order.expiresAt,
          createdAt: order.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req: TelegramRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderNumber } = req.params;
      const telegramUser = req.telegramUser;

      if (!telegramUser) {
        throw new AppError(401, 'Необходима авторизация');
      }

      const order = await orderService.getOrderByNumber(orderNumber);

      if (!order) {
        throw new AppError(404, 'Заказ не найден');
      }

      const user = await userService.getByTelegramId(BigInt(telegramUser.id));

      if (!user || order.userId !== user.id) {
        throw new AppError(403, 'Доступ запрещен');
      }

      res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          photosCount: order.photosCount,
          totalSize: Number(order.totalSize),
          expiresAt: order.expiresAt,
          createdAt: order.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadController();
