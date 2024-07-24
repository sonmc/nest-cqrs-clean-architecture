import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { User } from '@domain/schemas/user.schema';
import { DataSource } from 'typeorm';

export class CreateBlogModel {
  id: string;
  username: string;
  password: string;
  email: string;
}

export class CreateBlogCommand {
  constructor(public readonly model: CreateBlogModel) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  userRepo;
  constructor(
    private readonly publisher: EventPublisher,
    private dataSource: DataSource,
  ) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async execute(command: CreateBlogCommand) {
    const user = this.publisher.mergeObjectContext(
      await this.userRepo.save(command),
    );
    user.commit();
  }
}
