import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    forwardRef(()=>UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions:{
        expiresIn:'24h'
      }
    })
  ],
  exports:[
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}
