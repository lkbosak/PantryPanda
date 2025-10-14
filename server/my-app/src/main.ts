import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Configure CORS explicitly so browser-based requests from the frontend
  // (for example http://localhost:3000) are allowed when calling the API.
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: process.env.CORS_ORIGIN ?? ['http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  } as any;
  app.enableCors(corsOptions);
  const port = Number(process.env.PORT) || 3001;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  // Helpful log for debugging connectivity
  try {
    const url = await app.getUrl();
    // eslint-disable-next-line no-console
    console.log(`Listening on ${url} (bound to ${host})`);
  } catch (e) {
    // fallback
    // eslint-disable-next-line no-console
    console.log(`Listening on http://${host}:${port}`);
  }
}

bootstrap();
