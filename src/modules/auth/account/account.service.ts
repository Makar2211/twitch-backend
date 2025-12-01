import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserInput } from './input/create.user.input';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  public constructor(private readonly prismaService: PrismaService) { }

  public async me(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  public async create(input: CreateUserInput) {
    const { username, email, password } = input;
    const isUserExist = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (isUserExist) {
      throw new ConflictException('Username already taken');
    }

    const isEmailExist = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (isEmailExist) {
      throw new ConflictException('Email already registered');
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    await this.prismaService.user.create({
      data: {
        username,
        email,
        password: hash,
        displayName: username,
      },
    });

    return true;

  }
}
