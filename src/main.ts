import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstraps the NestJS application.
 */
async function bootstrap() {
  // Create a new NestJS application instance using the AppModule.
  const app = await NestFactory.create(AppModule);

  // Enable CORS (Cross-Origin Resource Sharing) with the frontend service.
  // For dev - use the origin host machine's IP address "http://lcalhost:3000"
  // For prod - initially use the service name "http://crypto-frontend-service:3000"
  //            after deploying the frontend service to the cluster, use the frontend service's IP address in origin
  app.enableCors({
    origin: 'http://crypto-frontend-service:3000',
  });

  // Start listening for incoming requests on port 4000.
  await app.listen(4000);
}

// Initialize the application.
bootstrap();
