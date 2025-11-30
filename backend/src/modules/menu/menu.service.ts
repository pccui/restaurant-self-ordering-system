import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';

@Injectable()
export class MenuService {
  async getMenu() {
    const items = await prisma.menuItem.findMany();
    return items;
  }
}
