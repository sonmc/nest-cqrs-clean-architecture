import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { User } from '@domain/schemas/user.schema';
import { DataSource } from 'typeorm';

export class UpdateBlogModel {
  id: string;
  username: string;
  password: string;
  email: string;
}

export class UpdateBlogCommand {
  constructor(public readonly model: UpdateBlogModel) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  userRepo;
  constructor(
    private readonly publisher: EventPublisher,
    private dataSource: DataSource,
  ) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async execute(command: UpdateBlogCommand) {
    const user = this.publisher.mergeObjectContext(
      await this.userRepo.save(command),
    );
    user.commit();
  }
}
