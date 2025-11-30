import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '../../lib/prisma';
import * as bcrypt from 'bcrypt';

// Role type for Prisma v7+
export type Role = 'ADMIN' | 'WAITER' | 'KITCHEN';

// User type matching Prisma schema
interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return this.toSafeUser(user);
  }

  async login(user: SafeUser): Promise<{ accessToken: string; user: SafeUser }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async getUserById(id: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return null;
    }
    return this.toSafeUser(user);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
