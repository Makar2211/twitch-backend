import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LogInInput } from './input/login.input';


import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';

@Injectable()
export class SessionService {
  public constructor(private readonly prismaService: PrismaService, private readonly configService: ConfigService) { }

  public async login(req: Request, input: LogInInput) {
    const { login, password } = input;

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: { equals: login } },
          { username: { equals: login } }
        ],
      }
    })

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('User not found');
    }

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.userId = user.id;

      req.session.save((err: Error) => {
        if (err) {
          return reject(new InternalServerErrorException(`Could not save session: ${err?.message ?? err}`));
        }

        resolve(user);
      });
    });
  }


  public async logout(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(new InternalServerErrorException('Could not leave from session'))
        }
        req.res?.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve(true)
      }

      )
    });
  }
}
