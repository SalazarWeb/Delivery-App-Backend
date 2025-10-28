# Módulo Users

## Descripción
Módulo para la gestión de usuarios en la aplicación de delivery. Soporta dos tipos de usuarios: **clientes** y **empresas**.

## Entidad User

### Campos
- **id**: `string` (UUID) - Identificador único del usuario
- **type**: `'cliente' | 'empresa'` - Tipo de usuario
- **name**: `string` - Nombre del usuario o empresa
- **phone**: `string` - Teléfono de contacto
- **email**: `string` - Email (único)
- **passwordHash**: `string` - Contraseña hasheada
- **createdAt**: `Date` - Fecha de creación (auto-generada)

## UsersService

### Métodos

#### `create(createUserDto: CreateUserDto): Promise<User>`
Crea un nuevo usuario en la base de datos.

**Parámetros:**
```typescript
{
  type: 'cliente' | 'empresa',
  name: string,
  phone: string,
  email: string,
  passwordHash: string
}
```

**Ejemplo:**
```typescript
const newUser = await usersService.create({
  type: UserType.CLIENTE,
  name: 'Juan Pérez',
  phone: '+56912345678',
  email: 'juan@example.com',
  passwordHash: '$2b$10$...' // Hash generado con bcrypt
});
```

#### `findByEmail(email: string): Promise<User | null>`
Busca un usuario por su email.

**Ejemplo:**
```typescript
const user = await usersService.findByEmail('juan@example.com');
if (user) {
  console.log('Usuario encontrado:', user.name);
}
```

#### `findById(id: string): Promise<User | null>`
Busca un usuario por su ID (UUID).

**Ejemplo:**
```typescript
const user = await usersService.findById('550e8400-e29b-41d4-a716-446655440000');
if (user) {
  console.log('Usuario encontrado:', user.name);
}
```

## API Endpoints

### POST /users
Crea un nuevo usuario.

**Request Body:**
```json
{
  "type": "cliente",
  "name": "Juan Pérez",
  "phone": "+56912345678",
  "email": "juan@example.com",
  "passwordHash": "$2b$10$..."
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "cliente",
  "name": "Juan Pérez",
  "phone": "+56912345678",
  "email": "juan@example.com",
  "passwordHash": "$2b$10$...",
  "createdAt": "2025-10-28T00:00:00.000Z"
}
```

### GET /users/:id
Obtiene un usuario por ID.

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "cliente",
  "name": "Juan Pérez",
  "phone": "+56912345678",
  "email": "juan@example.com",
  "passwordHash": "$2b$10$...",
  "createdAt": "2025-10-28T00:00:00.000Z"
}
```

### GET /users/email/:email
Obtiene un usuario por email.

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "empresa",
  "name": "Restaurante XYZ",
  "phone": "+56987654321",
  "email": "restaurant@example.com",
  "passwordHash": "$2b$10$...",
  "createdAt": "2025-10-28T00:00:00.000Z"
}
```

## Uso en otros módulos

Para usar el `UsersService` en otros módulos:

```typescript
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  // ...
})
export class OtroModule {}
```

Luego inyectar el servicio:

```typescript
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class OtroService {
  constructor(private usersService: UsersService) {}

  async ejemplo() {
    const user = await this.usersService.findById('...');
    // ...
  }
}
```

## Testing

Ejecutar tests del módulo:

```bash
# Tests unitarios
pnpm test users

# Tests con coverage
pnpm test:cov users

# Tests en modo watch
pnpm test:watch users
```

## Notas de Seguridad

⚠️ **IMPORTANTE**: Nunca almacenes contraseñas en texto plano. Siempre usa un hash seguro como bcrypt:

```bash
pnpm add bcrypt
pnpm add -D @types/bcrypt
```

Ejemplo de uso con bcrypt:

```typescript
import * as bcrypt from 'bcrypt';

// Al crear usuario
const saltRounds = 10;
const passwordHash = await bcrypt.hash('password123', saltRounds);

const user = await usersService.create({
  type: UserType.CLIENTE,
  name: 'Juan Pérez',
  phone: '+56912345678',
  email: 'juan@example.com',
  passwordHash,
});

// Al verificar contraseña
const isMatch = await bcrypt.compare('password123', user.passwordHash);
```
