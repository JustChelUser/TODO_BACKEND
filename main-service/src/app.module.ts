import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService} from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ListsModule } from "./lists/lists.module";
import { TasksModule } from "./tasks/tasks.module";
import { ProjectsModule } from "./projects/projects.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";


@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
  }),
  TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    useFactory:(configService: ConfigService)=>({
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: Number(configService.get('POSTGRES_PORT')),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
      entities: [__dirname+'/**/*.entity{.js, .ts}'],
      synchronize: true,
      autoLoadEntities:true
    }),
    inject:[ConfigService],
  }),
    ProjectsModule,
    ListsModule,
    TasksModule,
    AuthModule,
    UsersModule,
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
  ],
})
export class AppModule { }