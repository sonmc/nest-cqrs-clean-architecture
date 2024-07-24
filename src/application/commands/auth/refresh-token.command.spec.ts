import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { JwtTokenService } from '@services/jwt.service';
import * as dotenv from 'dotenv';
import {
  RefreshTokenCommand,
  RefreshTokenHandler,
} from './refresh-token.command';

dotenv.config();

describe('RefreshTokenCommand', () => {
  let commandHandler: RefreshTokenHandler;
  let dataSourceMock: Partial<DataSource>;
  let jwtServiceMock: Partial<JwtTokenService>;

  beforeEach(async () => {
    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          username: 'testUser',
          password: 'hashedPassword',
          roles: [],
          hash_refresh_token: 'refresh_token',
        }),
        update: jest.fn().mockResolvedValue(undefined),
      }),
    };

    jwtServiceMock = {
      signAsync: jest.fn().mockImplementation((payload, secret, expiresIn) => {
        if (secret === process.env.JWT_REFRESH_SECRET) {
          return 'newRefreshToken';
        }
        return 'newAccessToken';
      }),
      verifyAsync: jest
        .fn()
        .mockResolvedValue({ id: 1, username: 'testUser', roles: [] }),
      decode: jest.fn().mockReturnValue({ username: 'testUser' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenHandler,
        { provide: DataSource, useValue: dataSourceMock },
        { provide: JwtTokenService, useValue: jwtServiceMock },
      ],
    }).compile();

    commandHandler = module.get<RefreshTokenHandler>(RefreshTokenHandler);
  });

  it('should refresh the token', async () => {
    // Arrange
    const accessToken = 'access_token';
    const refreshToken = 'refresh_token';
    const command = new RefreshTokenCommand(accessToken, refreshToken);

    // Act
    const result = await commandHandler.execute(command);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual('newAccessToken');
  });
});
