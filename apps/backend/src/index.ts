import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { initializeStorage } from './config/storage';
import { initializeBot } from './bot/index';
import { errorHandler } from './api/middlewares/error-handler.middleware';
import { loggerMiddleware } from './api/middlewares/logger.middleware';
import routes from './api/routes/index';

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggerMiddleware);
  app.use(routes);
  app.use(errorHandler);

  await initializeStorage();
  await initializeBot();

  app.listen(env.BACKEND_PORT, () => {
    console.log(`Бэкенд запущен на порту ${env.BACKEND_PORT}`);
  });
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Необработанное отклонение промиса:', promise, 'причина:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Необработанное исключение:', error);
  process.exit(1);
});

bootstrap().catch((error) => {
  console.error('Не удалось запустить приложение:', error);
  process.exit(1);
});
