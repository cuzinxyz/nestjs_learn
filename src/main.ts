import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
    transform: true, // Transform payloads to be objects typed according to their DTO classes
    validationError: { target: false }, // Remove target object from error response
    stopAtFirstError: false, // Return all errors, not just the first one
  }));
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  await app.listen(process.env.PORT ?? 3000);

  const server = app.getHttpAdapter().getInstance();
  const router = server.router;

  const availableRoutes: [] = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter((item) => item !== undefined);

  console.log(availableRoutes);
}
bootstrap();

