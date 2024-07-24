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
  CreateUserCommand,
  CreateUserModel,
} from 'src/application/commands/user/create-user.command';
import { CreateBlogPresenter, UpdateBlogPresenter } from './blog.presenter';
import {
  UpdateBlogCommand,
  UpdateBlogModel,
} from 'src/application/commands/blog/update-blog.handler';
import { DeleteBlogCommand } from 'src/application/commands/blog/delete-blog.handler';
import { mapper } from '@domain/helper/wraper';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Query() param: any): Promise<any> {
    const result = await this.queryBus.execute(
      new GetUserListQuery(param.page, param.limit),
    );
    return result;
  }

  @Post()
  async create(@Body() presenter: CreateBlogPresenter): Promise<any> {
    const model = mapper.map(presenter, CreateBlogPresenter, CreateUserModel);
    const res = await this.commandBus.execute(new CreateUserCommand(model));
    return res;
  }

  @Put()
  async update(@Body() presenter: UpdateBlogPresenter): Promise<any> {
    const model = mapper.map(presenter, UpdateBlogPresenter, UpdateBlogModel);
    const res = await this.commandBus.execute(new UpdateBlogCommand(model));
    return res;
  }

  @Delete()
  async delete(@Param() id: number): Promise<any> {
    const res = await this.commandBus.execute(new DeleteBlogCommand(id));
    return res;
  }
}
