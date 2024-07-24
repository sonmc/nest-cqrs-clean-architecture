import { Test, TestingModule } from '@nestjs/testing';
import { LoginCommand, LoginHandler } from './login.command';
import { DataSource } from 'typeorm';
import { JwtTokenService } from '@services/jwt.service';
import * as dotenv from 'dotenv';
dotenv.config();

describe('LoginCommand', () => {
  let loginHandler: LoginHandler;
  let dataSourceMock: Partial<DataSource>;
  let jwtServiceMock: Partial<JwtTokenService> & {
    signAsync: jest.Mock;
    hashAsync: jest.Mock;
  };

  beforeEach(async () => {
    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          username: 'test',
          password: 'hashedPassword',
          roles: [],
        }),
        update: jest.fn().mockResolvedValue(undefined),
      }),
    };

    jwtServiceMock = {
      signAsync: jest.fn().mockImplementation((payload, secret, expiresIn) => {
        if (secret === process.env.JWT_SECRET) {
          return 'accessToken';
        }
        return 'refreshToken';
      }),
      hashAsync: jest.fn().mockResolvedValue('hashedPassword'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginHandler,
        { provide: DataSource, useValue: dataSourceMock },
        { provide: JwtTokenService, useValue: jwtServiceMock },
      ],
    }).compile();

    loginHandler = module.get<LoginHandler>(LoginHandler);
  });

  it('should be defined', () => {
    expect(loginHandler).toBeDefined();
  });

  it('should return an object with accessToken, refreshToken, and user', async () => {
    const model = new LoginCommand('test', 'test');
    const result = await loginHandler.execute(model);
    expect(result).toBeDefined();
    expect(result.accessToken).toBe('accessToken');
    expect(result.refreshToken).toBe('refreshToken');
    expect(result.user).toBeDefined();
    expect(result.user.id).toBe(1);
    expect(result.user.username).toBe('test');
  });
});
