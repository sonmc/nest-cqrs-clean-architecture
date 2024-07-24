import { Injectable } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}
  async hashAsync(hashString: string): Promise<string> {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(hashString, salt);
    return hash;
  }
  async compareAsync(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compareSync(password, hashPassword);
  }

  async verifyAsync(token: string): Promise<any> {
    try {
      const decode = await this.jwtService.verifyAsync(token);
      return decode;
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  async signAsync(
    payload: any,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  decode(token: string): string {
    const decoded: any = this.jwtService.decode(token);
    return decoded;
  }
}
