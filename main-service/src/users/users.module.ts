import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "src/auth/auth.module";
import { UsersController } from "./users.controller";
import { ProjectsModule } from "src/projects/projects.module";
import { Project } from "src/projects/projects.entity";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [ 
        AuthModule,
        forwardRef(() => ProjectsModule),
        ConfigModule.forRoot({
            envFilePath: `.env`
        }),
        TypeOrmModule.forFeature([Project]),
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
    ]),],
    exports: [
        UsersService,
    ]
})
export class UsersModule { }