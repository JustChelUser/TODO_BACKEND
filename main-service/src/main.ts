import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "./pipes/validation.pipe";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";


async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    const microservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://${process.env.RABBITMQ_LOGIN}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
            queue: process.env.RABBITMQ_QUEUE2_NAME,
            queueOptions: {
                durable: true,
            },
        }
    },);
    const config = new DocumentBuilder()
        .setTitle('Микросесрвис основной логики to-do листа')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build()
    const Document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, Document);
    app.useGlobalPipes(new ValidationPipe)
    await app.startAllMicroservices();
    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
start();