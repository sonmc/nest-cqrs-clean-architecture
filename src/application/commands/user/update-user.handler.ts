import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../../domain/schemas/user.schema';
import { DataSource } from 'typeorm';

export class UpdateUserModel {
  id: string;
  username: string;
  password: string;
  email: string;
}

export class UpdateUserCommand {
  constructor(public readonly model: UpdateUserModel) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  userRepo;
  constructor(private dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepo.save(command);
    return user;
  }
}
