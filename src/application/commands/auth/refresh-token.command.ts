import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../../domain/schemas/user.schema';
import { JwtTokenService } from '../../../infrastructure/services/jwt.service';
import { DataSource } from 'typeorm';

export class RefreshTokenCommand {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  private userRepo;
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtTokenService,
  ) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async execute(command: RefreshTokenCommand): Promise<string> {
    const { accessToken, refreshToken } = command;

    const username = this.jwtService.decode(accessToken)['username'];
    const user = await this.userRepo.findOne({ where: { username: username } });
    if (!user) {
      throw new BadRequestException(400, 'User not found!');
    }
    if (refreshToken != user.hash_refresh_token) {
      throw new BadRequestException(400, 'Token is invalid!');
    }
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRATION_TIME + 's';
    const payload = {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };
    const result = await this.jwtService.signAsync(payload, secret, expiresIn);
    return result;
  }
}
