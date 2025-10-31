import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USER', 'postgres'),
    password: configService.get<string>('DB_PASS', 'postgres'),
    database: configService.get<string>('DB_NAME', 'delivery_db'),
    
    // Auto-carga de entidades desde los módulos
    autoLoadEntities: true,
    
    // ⚠️ Sincronización automática de esquema
    // true = Las entidades se sincronizan automáticamente con la DB
    // false = Usar migraciones en producción
    synchronize: !isProduction,
    
    // Logging de queries SQL
    logging: !isProduction,
    
    // Configuración adicional de conexión
    ssl: isProduction
      ? {
          rejectUnauthorized: false, // Ajustar según el proveedor de DB
        }
      : false,
    
    // Pool de conexiones
    extra: {
      max: 10, // Máximo de conexiones
      connectionTimeoutMillis: 10000, // Timeout de conexión
    },
  };
};
