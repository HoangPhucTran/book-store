import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UserListDto } from './dtos/user-list.dto';
import { UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { AuthenticationGuard } from '../auth/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @UseInterceptors(CacheInterceptor)
    @CacheKey('users')
    @Get()
    async getUsers() : Promise <UserListDto[]> {
        return this.userService.findAll();
    }

  @Get('/me')
  @UseGuards(AuthenticationGuard)
  async getMe(@Req() req) : Promise<any> {
      console.log("request", req);
      const userId = req.user.id;
      return await this.userService.findOneById(userId);
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
