# 📦 Módulo Users - Estructura Completa

## 📁 Estructura de Archivos

```
backend/
├── src/
│   ├── entities/
│   │   └── user.entity.ts           # ✅ Entidad User con campos solicitados
│   │
│   └── users/
│       ├── dto/
│       │   └── create-user.dto.ts   # DTO para crear usuarios
│       │
│       ├── users.module.ts          # Módulo configurado con TypeORM
│       ├── users.service.ts         # ✅ Servicio con métodos create, findByEmail, findById
│       ├── users.service.spec.ts    # Tests unitarios del servicio
│       ├── users.controller.ts      # Controlador REST (endpoints)
│       ├── users.examples.ts        # Ejemplos de uso
│       └── README.md                # Documentación completa
│
├── .env                             # Variables de entorno
└── .env.example                     # Ejemplo de variables de entorno
```

## ✅ Checklist Completado

### Entidad User
- [x] Campo `id` - UUID (auto-generado)
- [x] Campo `type` - Enum: 'cliente' | 'empresa'
- [x] Campo `name` - String
- [x] Campo `phone` - String
- [x] Campo `email` - String (único)
- [x] Campo `passwordHash` - String
- [x] Campo `createdAt` - Date (auto-generado)

### UsersService
- [x] Método `create(createUserDto: CreateUserDto): Promise<User>`
- [x] Método `findByEmail(email: string): Promise<User | null>`
- [x] Método `findById(id: string): Promise<User | null>`

### Extras Incluidos
- [x] UsersModule configurado con TypeORM
- [x] UsersController con endpoints REST
- [x] CreateUserDto para validación de datos
- [x] Tests unitarios completos
- [x] Documentación detallada
- [x] Ejemplos de uso prácticos

## 🚀 Cómo Usar

### 1. El módulo ya está registrado automáticamente
NestJS CLI lo registró en `app.module.ts`

### 2. Probar con curl o Postman

**Crear un cliente:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cliente",
    "name": "Juan Pérez",
    "phone": "+56912345678",
    "email": "juan@example.com",
    "passwordHash": "$2b$10$hashedpassword"
  }'
```

**Crear una empresa:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "type": "empresa",
    "name": "Restaurante El Buen Sabor",
    "phone": "+56987654321",
    "email": "restaurante@example.com",
    "passwordHash": "$2b$10$hashedpassword"
  }'
```

**Buscar por ID:**
```bash
curl http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000
```

**Buscar por email:**
```bash
curl http://localhost:3000/users/email/juan@example.com
```

### 3. Usar en otros servicios

```typescript
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    // ... validar password
  }
}
```

## 🧪 Testing

```bash
# Ejecutar tests del módulo users
pnpm test users

# Tests con coverage
pnpm test:cov users

# Tests en modo watch
pnpm test:watch users
```

## 📊 Tabla en la Base de Datos

Al iniciar la aplicación, TypeORM creará automáticamente la tabla `users`:

| Columna      | Tipo      | Constraints        |
|--------------|-----------|-------------------|
| id           | uuid      | PRIMARY KEY       |
| type         | enum      | NOT NULL          |
| name         | varchar   | NOT NULL          |
| phone        | varchar   | NOT NULL          |
| email        | varchar   | UNIQUE, NOT NULL  |
| passwordHash | varchar   | NOT NULL          |
| createdAt    | timestamp | DEFAULT NOW()     |

## 🔐 Seguridad

**IMPORTANTE:** Para producción, instala bcrypt para hashear passwords:

```bash
pnpm add bcrypt
pnpm add -D @types/bcrypt
```

Ver ejemplos de uso en `users.examples.ts`

## 📝 Próximos Pasos Sugeridos

1. Instalar bcrypt para hashear contraseñas
2. Agregar validación con class-validator en el DTO
3. Crear módulo de autenticación (JWT)
4. Agregar más métodos al servicio (update, delete, findAll)
5. Implementar paginación
6. Agregar roles y permisos
