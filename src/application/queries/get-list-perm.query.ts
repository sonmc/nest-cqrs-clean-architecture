import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Perm } from '@domain/schemas/perm.schema';
import { DataSource } from 'typeorm';

export class GetPermListQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetPermListQuery)
export class GetPermListHandler implements IQueryHandler<GetPermListQuery> {
  private permRepo;
  constructor(private dataSource: DataSource) {
    this.permRepo = this.dataSource.getRepository(Perm);
  }
  async execute(query: GetPermListQuery) {
    const perms = await this.permRepo
      .createQueryBuilder('p')
      .leftJoin(
        'roles_perms',
        'rp',
        'p.id = rp.perm_id AND rp.role_id IN (SELECT role_id FROM roles_users WHERE user_id = :userId)',
        { userId: query.userId },
      )
      .where('rp.role_id IS NULL')
      .getMany();

    return perms;
  }
}
