import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
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
