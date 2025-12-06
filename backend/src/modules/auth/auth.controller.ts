import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Response,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response as ExpressResponse, Request as ExpressRequest } from 'express';
import { AuthService, SafeUser } from './auth.service';

// Cookie configuration
const isProduction = process.env.NODE_ENV === 'production';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  // Cross-site cookie (frontend domain != backend domain) requires sameSite: 'none' and secure: true
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req: ExpressRequest & { user: SafeUser },
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const { accessToken, user } = await this.authService.login(req.user);

    // Set JWT in httpOnly cookie (legacy support / backup)
    res.cookie('jwt', accessToken, COOKIE_OPTIONS);

    // Return accessToken in body for Bearer auth support
    return { user, accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Response({ passthrough: true }) res: ExpressResponse) {
    // Clear the JWT cookie
    res.clearCookie('jwt', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req: ExpressRequest & { user: SafeUser }) {
    return { user: req.user };
  }
}
