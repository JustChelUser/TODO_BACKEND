import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/users.entity";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from "./users/users.module";
import { ClientsModule, Transport } from "@nestjs/microservices";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          entities: [User],
          synchronize: true,
          autoLoadEntities:true
        }),
        UsersModule,
        AuthModule,
        ClientsModule.register([
          {
            name: 'FROM_MAIN_TO_USER',
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
              queue: process.env.RABBITMQ_QUEUE_NAME,
              queueOptions: {
                durable: true,
              },
            },
          },
        ]),
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
})
export class AppModule { }