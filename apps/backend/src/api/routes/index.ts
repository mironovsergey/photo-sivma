import { Router } from 'express';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.use('/api', uploadRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Сервер запущен',
    timestamp: new Date().toISOString(),
  });
});

export default router;
