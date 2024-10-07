import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { AuthModule } from "src/auth/auth.module";
import { UsersController } from "./users.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    ClientsModule.register([
      {
        name: 'FROM_USER_TO_MAIN',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
          queue: process.env.RABBITMQ_QUEUE2_NAME,
          queueOptions: {
            durable: true,
          },
        },
      },
    ])
  ],
  exports: [
    UsersService,
  ]
})
export class UsersModule { }