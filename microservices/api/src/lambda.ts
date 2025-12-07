import { NestFactory } from "@nestjs/core";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import awsLambdaFastify from "@fastify/aws-lambda";
import { AppModule } from "./app.module";

let cachedHandler: ReturnType<typeof awsLambdaFastify>;

async function bootstrap() {
    if (cachedHandler) {
        return cachedHandler;
    }

    const fastifyAdapter = new FastifyAdapter({ logger: true });

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        fastifyAdapter,
    );

    app.enableCors({
        origin: "*",
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        credentials: false,
        allowedHeaders: ["*"],
    });

    await app.init();

    const fastifyInstance = fastifyAdapter.getInstance();
    cachedHandler = awsLambdaFastify(fastifyInstance);

    return cachedHandler;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any, context: any): Promise<any> => {
    const lambdaHandler = await bootstrap();
    return lambdaHandler(event, context);
};
