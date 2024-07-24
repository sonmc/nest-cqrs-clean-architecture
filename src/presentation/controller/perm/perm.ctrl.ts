import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetPermListQuery } from 'src/application/queries/get-list-perm.query';
import { UserRequestContextService } from 'src/infrastructure/services/user-request-context.service';
import { presentList } from './perm.presenter';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('perms')
@Controller('perms')
export class PermController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userRequestContextService: UserRequestContextService,
  ) {}

  @Get()
  async list(): Promise<any> {
    const currentUser = this.userRequestContextService.getUser();
    let result = await this.queryBus.execute(
      new GetPermListQuery(currentUser.id),
    );
    result = presentList(result);
    return result;
  }
}
