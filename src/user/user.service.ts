import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@prisma/prisma.service';
import { genSalt, genSaltSync, hashSync } from 'bcrypt';

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

  findOne(idOrEmail: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }]
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
