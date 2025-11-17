import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class MenuService {
  async getMenu() {
    const items = await prisma.menuItem.findMany();
    return items;
  }
}
