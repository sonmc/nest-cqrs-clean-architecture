import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Role } from '@domain/schemas/role.schema';
import { DataSource } from 'typeorm';

export class DeleteRoleCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  repo;
  constructor(
    private readonly publisher: EventPublisher,
    private dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(Role);
  }

  async execute(command: DeleteRoleCommand) {
    const role = this.publisher.mergeObjectContext(
      await this.repo.delete(command.id),
    );
    role.commit();
  }
}
