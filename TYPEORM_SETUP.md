# Configuración de TypeORM con PostgreSQL

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=delivery_db
```

## Configuración

### TypeORM está configurado con:
- ✅ **autoLoadEntities**: `true` - Carga automáticamente las entidades
- ✅ **synchronize**: `true` - Sincroniza automáticamente el esquema de la base de datos (⚠️ solo para desarrollo)
- ✅ **logging**: `true` - Muestra las queries SQL en la consola

### ⚠️ IMPORTANTE
**NUNCA** uses `synchronize: true` en producción. Puede causar pérdida de datos.

## Uso de Entidades

### Ejemplo de Entidad
Ver `src/entities/user.entity.ts` para un ejemplo de entidad.

### Registrar Entidades en Módulos

Para usar una entidad en un módulo:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

### Inyectar Repositorio en un Servicio

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
```

## Prerequisitos

Asegúrate de tener PostgreSQL instalado y ejecutándose:

```bash
# Verificar si PostgreSQL está corriendo
sudo systemctl status postgresql

# Crear la base de datos (si no existe)
sudo -u postgres psql -c "CREATE DATABASE delivery_db;"
```

## Ejecutar la Aplicación

```bash
# Desarrollo
pnpm start:dev

# Producción
pnpm build
pnpm start:prod
```
