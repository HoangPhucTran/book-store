import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'default_secret_key',
      signOptions: { expiresIn: '60m' },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {
  constructor() {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
  }
}
