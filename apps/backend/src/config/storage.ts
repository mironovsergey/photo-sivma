import { Client } from 'minio';
import { CONSTANTS } from './constants';
import { env } from './env';

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ROOT_USER,
  secretKey: env.MINIO_ROOT_PASSWORD,
});

export async function initializeStorage() {
  try {
    const bucketExists = await minioClient.bucketExists(env.MINIO_BUCKET);

    if (!bucketExists) {
      await minioClient.makeBucket(env.MINIO_BUCKET, CONSTANTS.MINIO_REGION);
      console.log(`MinIO бакет '${env.MINIO_BUCKET}' создан`);

      const lifecycleConfig = {
        Rule: [
          {
            ID: 'ExpireOldPhotos',
            Status: 'Enabled',
            Expiration: {
              Days: CONSTANTS.MINIO_LIFECYCLE_EXPIRY_DAYS,
            },
          },
        ],
      };

      await minioClient.setBucketLifecycle(env.MINIO_BUCKET, lifecycleConfig);
      console.log('Политика жизненного цикла MinIO настроена');
    } else {
      console.log(`MinIO бакет '${env.MINIO_BUCKET}' уже существует`);
    }
  } catch (error) {
    console.error('Не удалось инициализировать MinIO:', error);
    throw error;
  }
}
