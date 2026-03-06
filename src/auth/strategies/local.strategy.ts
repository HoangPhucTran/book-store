import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import { AuthService } from "../auth.service";
import { User } from "../../user/entities/user.entity";
import { UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStratery extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        // super({
        //     usernameField: 'username',
        //     passwordField: 'password'
        // });
        super();
    }

    async validate(username: string, password: string): Promise<User> {
        const user = await this.authService.authentication(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}