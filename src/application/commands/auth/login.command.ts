import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../../domain/schemas/user.schema';
import { JwtTokenService } from '../../../infrastructure/services/jwt.service';
import { DataSource } from 'typeorm';

export class LoginCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private userRepo;
  constructor(
    private dataSource: DataSource,
    private readonly jwtService: JwtTokenService,
  ) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async execute(command: LoginCommand) {
    const { username, password } = command;
    const user = await this.userRepo.findOne({
      where: { username: username },
      relations: ['roles'],
    });
    const hashPassword = await this.jwtService.hashAsync(password);
    if (!user || !hashPassword == user.password)
      throw new NotFoundException(400, 'Invalid username or password');

    const payload = {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };

    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRATION_TIME + 's';
    const accessToken = await this.jwtService.signAsync(
      payload,
      secret,
      expiresIn,
    );

    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    const refreshTokenExpiresIn =
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME + 's';
    const refreshToken = await this.jwtService.signAsync(
      payload,
      refreshTokenSecret,
      refreshTokenExpiresIn,
    );

    await this.userRepo.update(
      { username: username },
      { hash_refresh_token: refreshToken, last_login: new Date() },
    );
    return { accessToken, refreshToken, user };
  }
}
