import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserListQuery } from 'src/application/queries/get-user-list.query';
import {
  CreateUserPresenter,
  MatchingPresenter,
  presentItems,
  UpdateMatchingProfilePresenter,
  UpdateUserPresenter,
} from './user.presenter';
import { DeleteUserCommand } from 'src/application/commands/user/delete-user.handler';
import {
  UpdateUserCommand,
  UpdateUserModel,
} from 'src/application/commands/user/update-user.handler';
import {
  CreateUserCommand,
  CreateUserModel,
} from 'src/application/commands/user/create-user.command';
import { mapper } from '@domain/helper/wraper';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Query() param: any): Promise<any> {
    const result = await this.queryBus.execute(
      new GetUserListQuery(param.page, param.limit),
    );
    const users = presentItems(result.data);
    const response = { ...result, data: users };
    return response;
  }

  @Post()
  async create(@Body() presenter: CreateUserPresenter): Promise<any> {
    const model = mapper.map(presenter, CreateUserPresenter, CreateUserModel);
    const res = await this.commandBus.execute(new CreateUserCommand(model));
    return res;
  }

  @Put()
  async update(@Body() presenter: UpdateUserPresenter): Promise<any> {
    const model = mapper.map(presenter, UpdateUserPresenter, UpdateUserModel);
    const res = await this.commandBus.execute(new UpdateUserCommand(model));
    return res;
  }

  @Delete()
  async delete(@Param() id: number): Promise<any> {
    const res = await this.commandBus.execute(new DeleteUserCommand(id));
    return res;
  }

  @Post('update-matching-profile')
  async updateMatchingProfile(
    @Body() presenter: UpdateMatchingProfilePresenter,
  ): Promise<any> {
    return 'not implemented';
  }

  @Post('matching')
  async matching(@Body() presenter: MatchingPresenter): Promise<any> {
    return 'not implemented';
  }

  @Post('chat-private')
  async chatPrivate(@Body() presenter: any): Promise<any> {
    return 'not implemented';
  }
}
