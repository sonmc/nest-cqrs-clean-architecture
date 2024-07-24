import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtTokenService) {}

  async authentication(token: string): Promise<any> {
    try {
      if (token) {
        token = token.split(' ')[1];
      }
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  authorization(roles: any, request: string, httpMethod: string): boolean {
    let permissons = [];
    roles.forEach((r: any) => {
      permissons = [...permissons, ...r.permissions];
    });
    const isAdmin = AuthService.isAdmin(roles);
    if (isAdmin) {
      return true;
    }
    const module = AuthService.findModule(request);
    let isAccess = false;
    permissons.forEach((perm: any) => {
      if (perm.module === module && perm.method === httpMethod.toLowerCase()) {
        isAccess = true;
      }
    });
    return isAccess;
  }

  private static findModule(urlRequest: string): string {
    const request = urlRequest.replace('/api/', '');
    const module = request.split('/')[0].split('?')[0];
    return module;
  }

  private static isAdmin(roles: any): boolean {
    let isAdmin = false;
    roles.forEach((r: any) => {
      if (r.title === 'Admin' || r.id === 1 || r.access_type == 1) {
        isAdmin = true;
      }
    });
    return isAdmin;
  }
}
