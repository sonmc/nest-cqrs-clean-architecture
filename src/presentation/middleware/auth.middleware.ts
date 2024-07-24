import { ACCESS_TOKEN } from '@domain/util/const.variable';
import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/infrastructure/services/auth.service';
import { UserRequestContextService } from 'src/infrastructure/services/user-request-context.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userRequestContextService: UserRequestContextService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken =
      req.cookies[ACCESS_TOKEN] || req.headers['authorization'];

    if (!accessToken) {
      throw new UnauthorizedException('Token invalid !');
    } else {
      const payload = await this.authService.authentication(accessToken);
      if (payload) {
        const isHasPerm = this.authService.authorization(
          payload.roles,
          req.url,
          req.method,
        );
        if (!isHasPerm) {
          throw new ForbiddenException('403 Forbidden !');
        }
        this.userRequestContextService.setUser(payload);
        next();
      }
    }
  }
}
