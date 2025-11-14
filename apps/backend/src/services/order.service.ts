import type { Order, Photo } from '@prisma/client';
import { AppError } from '../types';
import { CONSTANTS } from '../config/constants.js';
import { env } from '../config/env.js';
import prisma from '../config/database.js';
import storageService from './storage.service.js';

export class OrderService {
  private async generateOrderNumber(): Promise<string> {
    let orderNumber: string;
    let exists = true;

    while (exists) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);

      orderNumber = `${CONSTANTS.ORDER_PREFIX}-${randomNum}`;

      const existing = await prisma.order.findUnique({
        where: { orderNumber },
      });

      exists = existing !== null;
    }

    return orderNumber!;
  }

  async createOrder(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<Order & { photos: Photo[] }> {
    this.validateFiles(files);

    const orderNumber = await this.generateOrderNumber();
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + CONSTANTS.ORDER_EXPIRY_DAYS);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          totalSize: BigInt(totalSize),
          photosCount: files.length,
          expiresAt,
        },
      });

      const photoRecords = await Promise.all(
        files.map(async (file) => {
          const storagePath = await storageService.uploadFile(newOrder.id, file);

          return await tx.photo.create({
            data: {
              orderId: newOrder.id,
              filename: file.originalname,
              storagePath,
              mimeType: file.mimetype,
              size: BigInt(file.size),
            },
          });
        }),
      );

      return { ...newOrder, photos: photoRecords };
    });

    return order;
  }

  async getOrderById(orderId: string): Promise<(Order & { photos: Photo[] }) | null> {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: { photos: true },
    });
  }

  async getOrderByNumber(orderNumber: string): Promise<(Order & { photos: Photo[] }) | null> {
    return await prisma.order.findUnique({
      where: { orderNumber },
      include: { photos: true },
    });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { photos: true },
    });
  }

  private validateFiles(files: Express.Multer.File[]): void {
    if (!files || files.length === 0) {
      throw new AppError(400, 'Необходимо загрузить хотя бы один файл');
    }

    for (const file of files) {
      if (file.size > env.MAX_FILE_SIZE) {
        throw new AppError(
          400,
          `Файл "${file.originalname}" превышает максимальный размер ${CONSTANTS.MAX_FILE_SIZE_MB} МБ`,
        );
      }

      if (
        !CONSTANTS.ALLOWED_MIME_TYPES.includes(
          file.mimetype as (typeof CONSTANTS.ALLOWED_MIME_TYPES)[number],
        )
      ) {
        throw new AppError(400, `Файл "${file.originalname}" имеет неподдерживаемый формат`);
      }
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > env.MAX_TOTAL_SIZE) {
      throw new AppError(400, `Общий размер файлов превышает ${CONSTANTS.MAX_TOTAL_SIZE_MB} МБ`);
    }
  }

  async getOrderDownloadUrls(orderId: string): Promise<{ filename: string; url: string }[]> {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new AppError(404, 'Заказ не найден');
    }

    return await Promise.all(
      order.photos.map(async (photo) => ({
        filename: photo.filename,
        url: await storageService.getDownloadUrl(photo.storagePath),
      })),
    );
  }
}

export default new OrderService();
