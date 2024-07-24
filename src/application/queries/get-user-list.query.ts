import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '@domain/schemas/user.schema';
import { DataSource } from 'typeorm';
import {
  applyPaginationQuery,
  applySearchQuery,
  applySortQuery,
  getPagingFormat,
} from '@domain/util/app.util';

export class GetUserListQuery {
  constructor(public readonly page: number, public readonly limit: number) {}
}

@QueryHandler(GetUserListQuery)
export class GetUserListHandler implements IQueryHandler<GetUserListQuery> {
  private userRepo;
  constructor(private dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async execute(query: GetUserListQuery) {
    const queryBuilder = await this.userRepo.createQueryBuilder('user');
    applyPaginationQuery(query.limit || 10, query.page || 0, queryBuilder);
    applySortQuery('id', 'asc', queryBuilder);
    // applySearchQuery('abc', 'username', queryBuilder);
    const users = await queryBuilder.getMany();
    const total = await queryBuilder.getCount();
    const result = getPagingFormat(
      users,
      query.page || 0,
      query.limit || 10,
      total,
    );
    return result;
  }
}
