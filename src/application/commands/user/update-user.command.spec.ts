import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserCommand, UpdateUserHandler } from './update-user.handler';
import { DataSource } from 'typeorm';

describe('UpdateUserCommand', () => {
  let updateUserHandler: UpdateUserHandler;
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
        UpdateUserHandler,
        { provide: DataSource, useValue: dataSourceMock },
      ],
    }).compile();

    updateUserHandler = module.get<UpdateUserHandler>(UpdateUserHandler);
  });

  describe('execute', () => {
    it('should update the user', async () => {
      // Arrange
      const model = {
        id: '1',
        username: 'john_doe',
        password: 'password123',
        email: 'john.doe@example.com',
      };
      const updateUserCommand = new UpdateUserCommand(model);

      const result = await updateUserHandler.execute(updateUserCommand);

      expect(dataSourceMock.getRepository).toHaveBeenCalled();
      expect(result.id).toBe(model.id);
      expect(result.username).toBe(model.username);
      expect(result.password).toBe(model.password);
      expect(result.email).toBe(model.email);
    });
  });
});
