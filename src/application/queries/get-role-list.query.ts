import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Role } from '@domain/schemas/role.schema';
import { DataSource } from 'typeorm';

export class GetRoleListQuery {}

@QueryHandler(GetRoleListQuery)
export class GetRoleListHandler implements IQueryHandler<GetRoleListQuery> {
  private roleRepo;
  constructor(private dataSource: DataSource) {
    this.roleRepo = this.dataSource.getRepository(Role);
  }

  async execute(query: GetRoleListQuery) {
    const roles = this.roleRepo.find();
    return roles;
  }
}
