import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@user/user.module';
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { options } from './config';
import { STRATEGIES } from "./startegies";
import { GUARDS } from "./guards";

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  imports: [PassportModule, JwtModule.registerAsync(options()), UserModule]
})
export class AuthModule {}
