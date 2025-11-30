import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  async findAll(): Promise<SafeUser[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map(this.toSafeUser);
  }

  async findById(id: string): Promise<SafeUser> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toSafeUser(user);
  }

  async findByEmail(email: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? this.toSafeUser(user) : null;
  }

  async create(dto: CreateUserDto): Promise<SafeUser> {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(`User with email ${dto.email} already exists`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: dto.role || 'WAITER',
      },
    });

    return this.toSafeUser(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<SafeUser> {
    // Check if user exists
    await this.findById(id);

    // Check if email is being changed to an existing one
    if (dto.email) {
      const existingWithEmail = await prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingWithEmail && existingWithEmail.id !== id) {
        throw new ConflictException(`User with email ${dto.email} already exists`);
      }
    }

    const updateData: any = {};
    if (dto.email) updateData.email = dto.email;
    if (dto.name) updateData.name = dto.name;
    if (dto.role) updateData.role = dto.role;
    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return this.toSafeUser(user);
  }

  async delete(id: string): Promise<void> {
    // Check if user exists
    await this.findById(id);

    await prisma.user.delete({ where: { id } });
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
