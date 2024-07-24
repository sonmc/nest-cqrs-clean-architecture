import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { User } from '@domain/schemas/user.schema';
import { DataSource } from 'typeorm';

export class DeleteBlogCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  userRepo;
  constructor(
    private readonly publisher: EventPublisher,
    private dataSource: DataSource,
  ) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async execute(command: DeleteBlogCommand) {
    const user = this.publisher.mergeObjectContext(
      await this.userRepo.delete(command.id),
    );
    user.commit();
  }
}
