import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOneById(id);
  }

  @Put(':id')
  async editUser(@Param('id') id: string, @Body() dto: UserDto): Promise<any> {
    return this.userService.edit(id, dto);
  }

  @Post()
  async addUser(@Body() dto: UserDto): Promise<User> {
    return this.userService.add(dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
