import { bot } from '../config/bot.js';
import { registerBotHandlers } from './handlers.js';

export async function initializeBot() {
  try {
    registerBotHandlers(bot);

    const me = await bot.api.getMe();

    console.log(`Telegram бот подключен: @${me.username}`);

    bot.start({
      onStart: () => {
        console.log('Бот запущен...');
      },
    });
  } catch (error) {
    console.error('Не удалось инициализировать бота:', error);
    throw error;
  }
}
