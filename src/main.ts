import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [
        'http://localhost:19000',
        'http://localhost:19001',
        'http://localhost:19002',
        'http://localhost:19006',
        'http://localhost:8081',
        'exp://localhost:8081',   
      ];

  app.enableCors({
    origin: (origin, callback) => {
      
      if (!origin) {
        return callback(null, true);
      }
      
      if (process.env.NODE_ENV !== 'production') {
        if (origin.includes('localhost') || origin.includes('192.168') || origin.includes('10.0')) {
          return callback(null, true);
        }
      }
            
      if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.setGlobalPrefix('api', {
    exclude: ['/', 'health'], 
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
