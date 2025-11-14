import type { Order, Photo } from '@prisma/client';
import { env } from '../config/env';
import { bot } from '../config/bot';

export class TelegramService {
  async notifyNewOrder(
    order: Order & { photos: Photo[] },
    downloadUrls: { filename: string; url: string }[],
  ): Promise<void> {
    const message = this.formatOrderMessage(order, downloadUrls);

    await bot.api.sendMessage(env.TELEGRAM_CHANNEL_ID, message, {
      parse_mode: 'HTML',
      link_preview_options: {
        is_disabled: true,
      },
    });
  }

  private formatOrderMessage(
    order: Order & { photos: Photo[] },
    downloadUrls: { filename: string; url: string }[],
  ): string {
    const expiresAt = order.expiresAt.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const totalSizeMB = (Number(order.totalSize) / 1024 / 1024).toFixed(2);

    let message = `<b>Новый заказ: ${order.orderNumber}</b>\n\n`;
    message += `Фотографий: ${order.photosCount}\n`;
    message += `Общий размер: ${totalSizeMB} МБ\n`;
    message += `Срок хранения до: ${expiresAt}\n\n`;
    message += `<b>Скачать фотографии:</b>\n`;

    downloadUrls.forEach((item, index) => {
      message += `${index + 1}. <a href="${item.url}">${item.filename}</a>\n`;
    });

    return message;
  }
}

export default new TelegramService();
