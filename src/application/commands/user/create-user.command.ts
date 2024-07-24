import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../../domain/schemas/user.schema';
import { DataSource } from 'typeorm';

export class CreateUserModel {
  id: string;
  username: string;
  password: string;
  email: string;
}

export class CreateUserCommand {
  constructor(public readonly model: CreateUserModel) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  userRepo;
  constructor(private dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async execute(command: CreateUserCommand): Promise<User> {
    const user = await this.userRepo.save(command);
    return user;
  }
}
