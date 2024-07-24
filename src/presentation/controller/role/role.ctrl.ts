import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateRolePresenter, UpdateRolePresenter } from './role.presenter';
import {
  CreateRoleCommand,
  CreateRoleModel,
} from 'src/application/commands/role/create-role.command';
import {
  UpdateRoleCommand,
  UpdateRoleModel,
} from 'src/application/commands/role/update-role.handler';
import { DeleteRoleCommand } from 'src/application/commands/role/delete-role.handler';
import { GetRoleListQuery } from 'src/application/queries/get-role-list.query';
import { mapper } from '@domain/helper/wraper';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(): Promise<any> {
    const result = await this.queryBus.execute(new GetRoleListQuery());
    return result;
  }

  @Post()
  async create(@Body() presenter: CreateRolePresenter): Promise<any> {
    const model = mapper.map(presenter, CreateRolePresenter, CreateRoleModel);
    const res = await this.commandBus.execute(new CreateRoleCommand(model));
    return res;
  }

  @Put()
  async update(@Body() presenter: UpdateRolePresenter): Promise<any> {
    const model = mapper.map(presenter, UpdateRolePresenter, UpdateRoleModel);
    const res = await this.commandBus.execute(new UpdateRoleCommand(model));
    return res;
  }

  @Delete()
  async delete(@Param() id: number): Promise<any> {
    const res = await this.commandBus.execute(new DeleteRoleCommand(id));
    return res;
  }
}
