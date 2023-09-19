import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { Logger } from '@nestjs/common';


@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  create(user: Partial<User>) {
    const hashedPass = this.hashPassword(user.password)

    return this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPass,
        roles: ["USER"]
      }
    })
  }

  findOne(identity: string) {
    Logger.warn('info', identity)
    
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ id: identity }, { email: identity }]
      }
    })
  }

  delete(id: string) {
    return this.prismaService.user.delete({ where: { id } })
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10))
  }
}
