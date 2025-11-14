import { Router } from 'express';
import multer from 'multer';
import uploadController from '../controllers/upload.controller.js';
import { telegramAuthMiddleware } from '../middlewares/telegram-auth.middleware.js';
import { CONSTANTS } from '../../config/constants.js';
import { env } from '../../config/env.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: CONSTANTS.MAX_PHOTOS_PER_UPLOAD,
  },
  fileFilter: (req, file, cb) => {
    if (
      CONSTANTS.ALLOWED_MIME_TYPES.includes(
        file.mimetype as (typeof CONSTANTS.ALLOWED_MIME_TYPES)[number],
      )
    ) {
      cb(null, true);
    } else {
      cb(new Error('Неподдерживаемый формат файла'));
    }
  },
});

router.post(
  '/upload',
  telegramAuthMiddleware,
  upload.array('photos', CONSTANTS.MAX_PHOTOS_PER_UPLOAD),
  uploadController.uploadPhotos.bind(uploadController),
);

router.get(
  '/orders/:orderNumber',
  telegramAuthMiddleware,
  uploadController.getOrder.bind(uploadController),
);

export default router;
