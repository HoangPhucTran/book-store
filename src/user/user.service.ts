import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll() : Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOneById(id: string) : Promise <User | null> {
        return await this.userRepository.findOneBy({
            id: id
        });
    }

    async add(userDto: UserDto): Promise<User> {
        try {
            const user = this.userRepository.create({
                username: userDto.username,
                password: userDto.password,
                name: userDto.name,
                role: userDto.role
            });

            const saveUser = await this.userRepository.save(user);

            return saveUser;
        } catch (er) {
            throw new Error('Create user failed: ' + er.message);
        }
    }

    async edit(id: string, userDto: UserDto): Promise<User> {
        try {
            const user = await this.findOneById(id);

            if (!user)
                throw new NotFoundException('User not found');

            Object.assign(user, userDto);

            const saveUser = await this.userRepository.save(user);

            return saveUser;
        } catch (er) {
            throw new Error('Edit user failed: ' + er.message);
        }
    }

    async delete(id: string) : Promise<void> {
        try {
            await this.userRepository.delete(id);
        } catch (error) {
            throw new Error('Delete user failed: ' + error.message);
        }
    }
}
