import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptService } from '../common/services/bcrypt.service';
import { DatabaseModule } from '../database/database.module';
import { refreshProviders } from './auth.providers';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  providers: [AuthService, BcryptService, ...refreshProviders],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
