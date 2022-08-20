import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.createUser(body);
  }

  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiOkResponse({ type: User, isArray: true })
  @Get()
  async findManyUsers(@Query('name') name?: string): Promise<User[]> {
    return this.usersService.findMany(name);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, body);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DeleteUserDto })
  @ApiNotFoundResponse()
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteUserDto> {
    return this.usersService.deleteUser(id);
  }
}
