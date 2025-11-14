import { Bot } from 'grammy';
import { env } from './env.js';

export const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

export async function initializeBot() {
  try {
    const me = await bot.api.getMe();

    console.log(`Telegram бота подключен: @${me.username}`);

    await bot.start({
      onStart: () => {
        console.log('Бот запущен...');
      },
    });
  } catch (error) {
    console.error('Не удалось инициализировать бота:', error);
    throw error;
  }
}

export default bot;
