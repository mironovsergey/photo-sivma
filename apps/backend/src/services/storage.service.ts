import { nanoid } from 'nanoid';
import { minioClient } from '../config/storage';
import { env } from '../config/env';

export class StorageService {
  async uploadFile(orderId: string, file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const storagePath = `orders/${orderId}/${nanoid()}.${fileExtension}`;

    await minioClient.putObject(env.MINIO_BUCKET, storagePath, file.buffer, file.size, {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Original-Name': encodeURIComponent(file.originalname),
      'X-Amz-Meta-Order-Id': orderId,
    });

    return storagePath;
  }

  async getDownloadUrl(storagePath: string, expirySeconds: number = 24 * 60 * 60): Promise<string> {
    return await minioClient.presignedGetObject(env.MINIO_BUCKET, storagePath, expirySeconds);
  }

  async deleteFile(storagePath: string): Promise<void> {
    await minioClient.removeObject(env.MINIO_BUCKET, storagePath);
  }

  async deleteOrderFiles(orderId: string): Promise<void> {
    const objectsStream = minioClient.listObjects(env.MINIO_BUCKET, `orders/${orderId}/`, true);
    const objectsList: string[] = [];

    for await (const obj of objectsStream) {
      if (obj.name) {
        objectsList.push(obj.name);
      }
    }

    if (objectsList.length > 0) {
      await minioClient.removeObjects(env.MINIO_BUCKET, objectsList);
    }
  }
}

export default new StorageService();
