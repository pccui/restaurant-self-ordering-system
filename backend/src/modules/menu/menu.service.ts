import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';

@Injectable()
export class MenuService {
  private cache: any[] | null = null;
  private lastFetch: number = 0;
  private readonly TTL = parseInt(process.env.MENU_CACHE_TTL || '3600000', 10); // Default 1 hour

  async getMenu() {
    const now = Date.now();
    if (this.cache && now - this.lastFetch < this.TTL) {
      return this.cache;
    }

    const items = await prisma.menuItem.findMany();
    this.cache = items;
    this.lastFetch = now;
    return items;
  }
}
