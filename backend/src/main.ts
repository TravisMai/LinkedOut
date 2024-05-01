import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { INestApplication, Logger } from '@nestjs/common';
import * as fs from 'fs';

export let app: INestApplication;

// const httpsOptions = {
//   key: fs.readFileSync('./secrets/cert.key'),
//   cert: fs.readFileSync('./secrets/cert.crt'),
// };

async function bootstrap() {
  const logger: Logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',  // Allows all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allowed HTTP methods
    credentials: true,  // Allow sending cookies or HTTP authentication
  });
  app.setGlobalPrefix('/api/v1');
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    logger.verbose(`Server is listening in PORT ${PORT}`);
  });
}
bootstrap();
