import type { User } from '@prisma/client';
import prisma from '../config/database.js';

export class UserService {
  async findOrCreate(data: {
    telegramId: bigint;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
  }): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: data.telegramId },
    });

    if (existingUser) {
      return await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          phoneNumber: data.phoneNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
        },
      });
    }

    return await prisma.user.create({
      data: {
        telegramId: data.telegramId,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      },
    });
  }

  async getByTelegramId(telegramId: bigint): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { telegramId },
    });
  }

  async hasSharedContact(telegramId: bigint): Promise<boolean> {
    const user = await this.getByTelegramId(telegramId);
    return user?.phoneNumber !== null && user?.phoneNumber !== undefined;
  }
}

export default new UserService();
