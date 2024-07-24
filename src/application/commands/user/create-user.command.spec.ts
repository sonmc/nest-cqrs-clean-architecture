import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUserCommand,
  CreateUserHandler,
  CreateUserModel,
} from './create-user.command';
import { DataSource } from 'typeorm';

describe('CreateUserHandler', () => {
  let createUserHandler: CreateUserHandler;
  let dataSourceMock: Partial<DataSource>;

  beforeEach(async () => {
    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue({
        save: jest.fn().mockResolvedValue({
          id: '1',
          username: 'john_doe',
          password: 'password123',
          email: 'john.doe@example.com',
        }),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        { provide: DataSource, useValue: dataSourceMock },
      ],
    }).compile();

    createUserHandler = module.get<CreateUserHandler>(CreateUserHandler);
  });

  it('should create a new user', async () => {
    const createUserModel: CreateUserModel = {
      id: '1',
      username: 'john_doe',
      password: 'password123',
      email: 'john.doe@example.com',
    };

    const createUserCommand = new CreateUserCommand(createUserModel);

    const result = await createUserHandler.execute(createUserCommand);

    expect(result).toBeDefined();
    expect(result.id).toBe(createUserModel.id);
    expect(result.username).toBe(createUserModel.username);
    expect(result.password).toBe(createUserModel.password);
    expect(result.email).toBe(createUserModel.email);
  });
});
