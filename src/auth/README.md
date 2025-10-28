# Módulo de Autenticación (Auth)

## 📋 Descripción

Módulo completo de autenticación con:
- ✅ Registro de usuarios con bcrypt
- ✅ Login con JWT
- ✅ Validación de DTOs con class-validator
- ✅ Protección de rutas con guards
- ✅ Estrategia JWT con Passport

---

## 🚀 Endpoints

### POST /auth/register

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "type": "cliente",
  "name": "Juan Pérez",
  "phone": "+56912345678",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "type": "cliente",
    "phone": "+56912345678",
    "createdAt": "2025-10-28T00:00:00.000Z"
  }
}
```

**Errores:**
- `409 Conflict` - El email ya está registrado
- `400 Bad Request` - Datos inválidos

---

### POST /auth/login

Inicia sesión con email y contraseña.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "type": "cliente",
    "phone": "+56912345678",
    "createdAt": "2025-10-28T00:00:00.000Z"
  }
}
```

**Errores:**
- `401 Unauthorized` - Credenciales inválidas
- `400 Bad Request` - Datos inválidos

---

## 🔐 Validaciones de DTOs

### RegisterDto

| Campo    | Tipo              | Validaciones                           |
|----------|-------------------|----------------------------------------|
| type     | 'cliente' \| 'empresa' | Requerido, debe ser enum válido   |
| name     | string            | Requerido, debe ser texto              |
| phone    | string            | Requerido, debe ser texto              |
| email    | string            | Requerido, debe ser email válido       |
| password | string            | Requerido, mínimo 6 caracteres         |

### LoginDto

| Campo    | Tipo   | Validaciones                    |
|----------|--------|---------------------------------|
| email    | string | Requerido, debe ser email válido|
| password | string | Requerido, debe ser texto       |

---

## 🛡️ Proteger Rutas

Para proteger una ruta y requerir autenticación:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return {
      message: 'Usuario autenticado',
      user,
    };
  }
}
```

---

## 📝 Ejemplos de Uso

### Registro de Cliente

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cliente",
    "name": "Juan Pérez",
    "phone": "+56912345678",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Registro de Empresa

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "type": "empresa",
    "name": "Restaurante XYZ",
    "phone": "+56987654321",
    "email": "restaurant@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Acceder a Ruta Protegida

```bash
# Primero obtén el token del login
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Luego úsalo en el header Authorization
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Configuración

### Variables de Entorno (.env)

```env
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=7d
```

**⚠️ IMPORTANTE:** Cambia `JWT_SECRET` en producción por una clave segura.

### Generar una clave secreta segura

```bash
# En Linux/Mac
openssl rand -base64 32

# O con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🏗️ Arquitectura

```
auth/
├── dto/
│   ├── register.dto.ts          # DTO con validaciones para registro
│   └── login.dto.ts             # DTO con validaciones para login
│
├── guards/
│   └── jwt-auth.guard.ts        # Guard para proteger rutas
│
├── strategies/
│   └── jwt.strategy.ts          # Estrategia Passport JWT
│
├── decorators/
│   └── current-user.decorator.ts # Decorador @CurrentUser()
│
├── interfaces/
│   └── auth.interface.ts        # Interfaces de respuesta
│
├── examples/
│   └── protected-route.example.ts # Ejemplo de ruta protegida
│
├── auth.module.ts               # Módulo configurado
├── auth.service.ts              # Lógica de negocio
├── auth.controller.ts           # Endpoints REST
└── auth.service.spec.ts         # Tests unitarios
```

---

## 🔒 Seguridad

### Bcrypt

Las contraseñas se hashean con bcrypt usando 10 salt rounds:

```typescript
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);
```

### JWT

Los tokens JWT contienen:

```typescript
{
  sub: string;    // user id
  email: string;  // user email
  type: string;   // 'cliente' | 'empresa'
  iat: number;    // issued at
  exp: number;    // expiration
}
```

---

## 🧪 Testing

```bash
# Ejecutar tests del módulo auth
pnpm test auth

# Tests con coverage
pnpm test:cov auth

# Tests en watch mode
pnpm test:watch auth
```

---

## 📦 Dependencias

- `@nestjs/jwt` - JWT para NestJS
- `@nestjs/passport` - Passport para NestJS
- `passport-jwt` - Estrategia JWT para Passport
- `bcrypt` - Hash de contraseñas
- `class-validator` - Validación de DTOs
- `class-transformer` - Transformación de DTOs

---

## 🎯 Flujo de Autenticación

### Registro

1. Cliente envía datos de registro
2. Se valida el DTO con class-validator
3. Se verifica que el email no exista
4. Se hashea la contraseña con bcrypt
5. Se crea el usuario en la BD
6. Se genera el token JWT
7. Se retorna `{ access_token, user }`

### Login

1. Cliente envía email y password
2. Se valida el DTO
3. Se busca el usuario por email
4. Se compara la contraseña con bcrypt
5. Se genera el token JWT
6. Se retorna `{ access_token, user }`

### Acceso a Ruta Protegida

1. Cliente envía request con header `Authorization: Bearer <token>`
2. JwtAuthGuard extrae el token
3. JwtStrategy valida el token
4. Se busca el usuario en la BD
5. Se inyecta el usuario en `request.user`
6. El controlador puede acceder al usuario con `@CurrentUser()`

---

## 💡 Consejos

### Uso del Token

El token debe enviarse en el header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Duración del Token

Por defecto, los tokens duran 7 días. Puedes cambiar esto en `.env`:

```env
JWT_EXPIRATION=24h  # 24 horas
JWT_EXPIRATION=30d  # 30 días
JWT_EXPIRATION=1y   # 1 año
```

### Refresh Tokens

Para implementar refresh tokens, considera crear un endpoint adicional:

```typescript
@Post('refresh')
async refresh(@Body() refreshDto: RefreshDto) {
  // Lógica para refrescar el token
}
```

---

## 🆘 Troubleshooting

### Error: "JWT_SECRET is not defined"

Asegúrate de que `.env` contenga `JWT_SECRET`:

```env
JWT_SECRET=your-secret-key-here
```

### Error: "Unauthorized"

- Verifica que el token esté en el header `Authorization`
- Asegúrate de usar el formato `Bearer <token>`
- Verifica que el token no haya expirado

### Error: "ConflictException: El email ya está registrado"

El email ya existe en la base de datos. Usa otro email o implementa login.

---

**Generado automáticamente - 28 de octubre de 2025**
