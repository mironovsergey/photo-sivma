import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { initializeStorage } from './config/storage.js';
import { initializeBot } from './bot/index.js';
import { errorHandler } from './api/middlewares/error-handler.middleware.js';
import { loggerMiddleware } from './api/middlewares/logger.middleware.js';
import routes from './api/routes/index.js';

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
