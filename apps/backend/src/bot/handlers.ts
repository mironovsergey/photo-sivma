import { Bot, Context } from 'grammy';
import { env } from '../config/env';
import userService from '../services/user.service';

export function registerBotHandlers(bot: Bot) {
  bot.command('start', async (ctx: Context) => {
    const telegramId = BigInt(ctx.from?.id || 0);

    if (!telegramId) {
      return;
    }

    const hasContact = await userService.hasSharedContact(telegramId);

    if (hasContact) {
      await ctx.reply('Добро пожаловать в Photo Sivma!', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Загрузить фото',
                web_app: { url: env.MINI_APP_URL },
              },
            ],
          ],
        },
      });
    } else {
      await ctx.reply(
        'Добро пожаловать в Photo Sivma!\n' +
          'Для начала работы поделитесь номером телефона.\n' +
          'Нажмите кнопку ниже для отправки контакта.',
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: 'Поделиться контактом',
                  request_contact: true,
                },
              ],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        },
      );
    }
  });

  bot.on('message:contact', async (ctx: Context) => {
    const contact = ctx.message?.contact;

    if (!contact) {
      return;
    }

    const telegramId = BigInt(ctx.from?.id || 0);

    if (contact.user_id !== ctx.from?.id) {
      await ctx.reply('Пожалуйста, поделитесь своим контактом.');
      return;
    }

    await userService.findOrCreate({
      telegramId,
      phoneNumber: contact.phone_number,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name,
      username: ctx.from?.username,
    });

    await ctx.reply('Спасибо! Теперь можете загружать фотографии.', {
      reply_markup: {
        remove_keyboard: true,
      },
    });

    await ctx.reply('Нажмите кнопку ниже для загрузки фотографий.', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Загрузить фото',
              web_app: { url: env.MINI_APP_URL },
            },
          ],
        ],
      },
    });
  });

  bot.command('app', async (ctx: Context) => {
    const telegramId = BigInt(ctx.from?.id || 0);
    const hasContact = await userService.hasSharedContact(telegramId);

    if (!hasContact) {
      await ctx.reply('Сначала поделитесь контактом.\n' + 'Используйте /start');
      return;
    }

    await ctx.reply('Загрузка фотографий', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Открыть приложение',
              web_app: { url: env.MINI_APP_URL },
            },
          ],
        ],
      },
    });
  });

  bot.command('help', async (ctx: Context) => {
    await ctx.reply(
      '📖 <b>Помощь - Photo Sivma Bot</b>\n' +
        '🔹 /start - Начать работу\n' +
        '🔹 /app - Открыть приложение\n' +
        '🔹 /help - Показать справку\n' +
        '<b>Как использовать:</b>\n' +
        '1️⃣ Поделитесь контактом (/start)\n' +
        '2️⃣ Откройте приложение (/app)\n' +
        '3️⃣ Загрузите фото (до 200 МБ)\n' +
        '4️⃣ Получите номер заказа\n' +
        '⏰ Фото хранятся 3 дня',
      { parse_mode: 'HTML' },
    );
  });

  bot.on('message', async (ctx: Context) => {
    if (ctx.message?.text?.startsWith('/')) {
      await ctx.reply(
        'Неизвестная команда.\n' + 'Используйте /help для просмотра доступных команд.',
      );
    }
  });

  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Ошибка при обработке update ${ctx.update.update_id}:`);
    console.error(err.error);
  });
}
