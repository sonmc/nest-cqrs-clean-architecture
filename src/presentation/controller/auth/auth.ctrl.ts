import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '@commands/auth/login.command';
import {
  LoginPresenter,
  RefreshTokenPresenter,
  RegisterPresenter,
  presentItem,
} from './auth.presenter';
import { RefreshTokenCommand } from '@commands/auth/refresh-token.command';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  async login(@Body() presenter: LoginPresenter) {
    const result = await this.commandBus.execute(
      new LoginCommand(presenter.username, presenter.password),
    );
    const user = presentItem(result.user);
    return { ...result, user };
  }

  @Post('refresh-token')
  async refreshToken(@Body() presenter: RefreshTokenPresenter) {
    const accessToken = await this.commandBus.execute(
      new RefreshTokenCommand(presenter.accessToken, presenter.refreshToken),
    );
    return accessToken;
  }

  @Post('register')
  async register(@Body() presenter: RegisterPresenter) {
    return 'register';
  }
}
