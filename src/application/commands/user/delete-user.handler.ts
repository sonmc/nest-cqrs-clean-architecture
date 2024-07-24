import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../../domain/schemas/user.schema';
import { DataSource } from 'typeorm';

export class DeleteUserCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  userRepo;
  constructor(private dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async execute(command: DeleteUserCommand): Promise<any> {
    const result = await this.userRepo.delete(command.id);
    return result;
  }
}
