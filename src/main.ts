import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [
        'http://localhost:19000', // Expo development server
        'http://localhost:19001', // Expo web
        'http://localhost:19002', // Expo web alternate
        'http://localhost:19006', // Expo web (Metro bundler)
        'http://localhost:8081',  // Metro bundler
        'exp://localhost:8081',   // Expo Go app
      ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (mobile apps, postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      // En desarrollo, permitir todos los orígenes de Expo y localhost
      if (process.env.NODE_ENV !== 'production') {
        if (origin.includes('localhost') || origin.includes('192.168') || origin.includes('10.0')) {
          return callback(null, true);
        }
      }
      
      // Verificar origen contra la lista permitida
      if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Prefijo global de API
  app.setGlobalPrefix('api', {
    exclude: ['/', 'health'], // Excluir rutas específicas del prefijo
  });
  
  // Habilitar validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma los tipos automáticamente
    }),
  );
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
