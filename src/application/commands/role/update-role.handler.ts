import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Role } from '@domain/schemas/role.schema';
import { DataSource } from 'typeorm';

export class UpdateRoleModel {
  id: string;
  username: string;
  password: string;
  email: string;
}

export class UpdateRoleCommand {
  constructor(public readonly userModel: UpdateRoleModel) {}
}

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  repo;
  constructor(
    private readonly publisher: EventPublisher,
    private dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(Role);
  }

  async execute(command: UpdateRoleCommand) {
    const role = this.publisher.mergeObjectContext(
      await this.repo.save(command),
    );
    role.commit();
  }
}
