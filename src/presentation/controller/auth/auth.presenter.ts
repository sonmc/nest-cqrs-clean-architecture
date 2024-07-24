import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { Perm } from '@domain/schemas/perm.schema';
import { Role } from '@domain/schemas/role.schema';

export class LoginPresenter {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class RefreshTokenPresenter {
  @IsNotEmpty()
  accessToken: string;
  @IsNotEmpty()
  refreshToken: string;
}

export class RegisterPresenter {}

export function presentItem(item: any) {
  return {
    username: item.username,
    full_name: item.username,
    roles: item.roles.map((r: Role) => {
      return {
        name: r.title,
        permissions: r.permissions?.map((p: Perm) => {
          return {
            module: p.module,
            action: p.action,
          };
        }),
      };
    }),
  };
}
