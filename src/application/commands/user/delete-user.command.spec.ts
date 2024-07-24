import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserCommand, DeleteUserHandler } from './delete-user.handler';
import { DataSource } from 'typeorm';
import { User } from '../../../domain/schemas/user.schema';

describe('DeleteUserHandler', () => {
  let deleteUserHandler: DeleteUserHandler;
  let dataSourceMock: Partial<DataSource>;

  beforeEach(async () => {
    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue({
        delete: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserHandler,
        { provide: DataSource, useValue: dataSourceMock },
      ],
    }).compile();

    deleteUserHandler = module.get<DeleteUserHandler>(DeleteUserHandler);
  });

  it('should delete a user', async () => {
    const command = new DeleteUserCommand(1);

    const result = await deleteUserHandler.execute(command);

    expect(dataSourceMock.getRepository(User).delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });
});
