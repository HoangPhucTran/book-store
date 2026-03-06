import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthentionGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthentionGuard)
    @Post('/login')
    async login(@Request() req): Promise<any> {
        return this.authService.login(req.body);
    }
}
