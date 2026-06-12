import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInputDto } from './dto/authInput.dto';
import type { Response, Request } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() authInputDto: AuthInputDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(authInputDto);

    if (!result) {
      throw new UnauthorizedException('Login failed');
    }

    const { accessToken, refreshToken, userId, username } = result;

    // set refresh token as HTTP only cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return { accessToken, userId, username };
  }

  @Post('signup')
  async signup(
    @Body() authInputDto: AuthInputDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signUp(authInputDto);

    if (!result) {
      throw new UnauthorizedException('Login failed');
    }

    const { accessToken, refreshToken, userId, username } = result;

    // set refresh token as HTTP only cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return { accessToken, userId, username };
  }

  @Post('refresh')
  async refresh(@Req() request: Request) {
    const refreshToken = request.cookies['refresh_token'];
    return await this.authService.refresh({ refreshToken });
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    if (refreshToken) {
      await this.authService.logout({ refreshToken });
    }

    response.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }
}
