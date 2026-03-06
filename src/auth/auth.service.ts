import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { AuthPayLoad } from './interface/auth-payload/auth-payload.interface';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(user: User) {
    const payload: AuthPayLoad = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async comparePass(password: string, storedPass: string): Promise<any> {
    return await bcrypt.compare(password, storedPass);
  }

  async authentication(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return null;
    }
    const check = await this.comparePass(password, user.password);

    if (user && check) {
      return user;
    }

    return false;
  }
}
