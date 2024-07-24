import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Role } from '@domain/schemas/role.schema';
import { DataSource } from 'typeorm';

export class CreateRoleModel {
  id: string;
  username: string;
  password: string;
  email: string;
}

export class CreateRoleCommand {
  constructor(public readonly createModel: CreateRoleModel) {}
}

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  repo;
  constructor(
    private readonly publisher: EventPublisher,
    private dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(Role);
  }

  async execute(command: CreateRoleCommand) {
    const role = this.publisher.mergeObjectContext(
      await this.repo.save(command),
    );
    role.commit();
  }
}
