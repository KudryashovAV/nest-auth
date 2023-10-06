import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { SigninDto, SignupDto } from "./dto";
import { AuthService } from "./auth.service";
import { Tokens } from "./interfaces";
import { Response, Request } from "express";
import { ConfigService } from "@nestjs/config";
import { Cookie, UserAgent } from "@shared/decorators";

const REFRESH_TOKEN = "refreshtoken";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    const user = await this.authService.registration(dto);
    if (!user) {
      throw new BadRequestException(`Couldn't create an user with ${JSON.stringify(dto)}`);
    }
  }

  @Post("signin")
  async signin(@Body() dto: SigninDto, @Res() res: Response, @UserAgent() agent: string) {
    const tokens = await this.authService.login(dto, agent);
    if (!tokens) {
      throw new BadRequestException(`Couldn't find an user with ${JSON.stringify(dto)}`);
    }
    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get("refresh-tokens")
  async refreshTokens(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
    if (!refreshToken || typeof refreshToken != "string") {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.refreshTokens(refreshToken, agent);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.setRefreshTokenToCookies(tokens, res);
  }
  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(tokens.refreshToken.expiredAt),
      secure: this.configService.get("NODE_ENV", "development") === "production",
      path: "/",
    });

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
