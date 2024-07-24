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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Query() param: any): Promise<any> {
    return 'Not implemented yet!';
  }

  @Post()
  async create(@Body() presenter: any): Promise<any> {
    return 'Not implemented yet!';
  }

  @Put()
  async update(@Body() presenter: any): Promise<any> {
    return 'Not implemented yet!';
  }

  @Delete()
  async delete(@Param() id: number): Promise<any> {
    return 'Not implemented yet!';
  }
}
