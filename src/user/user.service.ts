import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { UserListDto } from './dtos/user-list.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

    async findAll() : Promise<UserListDto[]> {
        const users = await this.userRepository.find();

        return users.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        }));
    }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      username: username,
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      id: id,
    });
  }

  async add(userDto: UserDto): Promise<User> {
    try {
      const user = this.userRepository.create({
        username: userDto.username,
        password: userDto.password,
        name: userDto.name,
        role: userDto.role,
      });

      const saveUser = await this.userRepository.save(user);
      await this.cacheManager.del('users');
      return saveUser;
    } catch (er) {
      throw new Error('Create user failed: ' + er.message);
    }
  }

  async edit(id: string, userDto: UserDto): Promise<User> {
    try {
      const user = await this.findOneById(id);

      if (!user) throw new NotFoundException('User not found');

      user.username = userDto.username;
      user.password = userDto.password;
      user.name = userDto.name;
      user.role = userDto.role;

      const saveUser = await this.userRepository.save(user);
      await this.cacheManager.del('users');
      return saveUser;
    } catch (er) {
      throw new Error('Edit user failed: ' + er.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const user = await this.findOneById(id);

      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.delete(id);
    } catch (error) {
      throw new Error('Delete user failed: ' + error.message);
    }
  }
}
