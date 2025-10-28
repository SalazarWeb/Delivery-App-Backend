# Configuración de main.ts y Archivo de Pruebas HTTP

## 📋 Cambios Realizados

### 1. Actualización de `src/main.ts`

Se agregaron las siguientes configuraciones globales:

#### ✅ CORS (Cross-Origin Resource Sharing)
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization',
});
```

**Características:**
- Origen configurable por variable de entorno
- Todos los métodos HTTP habilitados
- Soporte para credenciales (cookies)
- Headers personalizados permitidos

#### ✅ Prefijo Global `/api`
```typescript
app.setGlobalPrefix('api', {
  exclude: ['/', 'health'],
});
```

**Resultado:**
- Todos los endpoints ahora están en `/api/*`
- Ejemplos:
  - `POST /api/auth/register`
  - `GET /api/businesses`
  - `POST /api/products`
  - `POST /api/reactions`

**Rutas excluidas del prefijo:**
- `/` - Ruta raíz
- `/health` - Health check (si se implementa)

#### ✅ ValidationPipe Global (ya existía)
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

**Opciones:**
- `whitelist`: Elimina propiedades no definidas en DTOs
- `forbidNonWhitelisted`: Arroja error si hay campos extra
- `transform`: Convierte tipos automáticamente

#### ✅ Mensaje de Inicio
```typescript
console.log(`🚀 Application is running on: http://localhost:${port}/api`);
```

---

### 2. Archivo `api-tests.http`

Archivo completo de pruebas HTTP con **todos los endpoints** del proyecto.

#### 📁 Estructura

```
1. AUTENTICACIÓN - REGISTRO
   - Registrar usuario empresa
   - Registrar usuario cliente

2. AUTENTICACIÓN - LOGIN
   - Login empresa
   - Login cliente

3. NEGOCIOS
   - Crear negocio
   - Listar negocios (público)
   - Obtener negocio por ID
   - Mis negocios
   - Actualizar negocio
   - Eliminar negocio

4. PRODUCTOS
   - Crear productos (3 ejemplos)
   - Listar todos los productos
   - Listar por negocio
   - Obtener por ID
   - Actualizar producto
   - Actualizar disponibilidad
   - Eliminar producto

5. REACCIONES
   - Crear/actualizar reacciones (like, love, dislike)
   - Listar reacciones de producto
   - Ver mis reacciones
   - Estadísticas
   - Eliminar reacción

6. PRUEBAS DE VALIDACIÓN Y ERRORES
   - Registro sin campos
   - Login incorrecto
   - Crear sin autenticación
   - Precio negativo
   - etc.

7. FLUJO COMPLETO E2E
   - 9 pasos completos desde registro hasta reacciones
```

#### 🔧 Variables Configurables

```http
@baseUrl = http://localhost:3000/api
@contentType = application/json
@authToken = 
@businessId = 
@productId = 
```

#### 📝 Cómo Usar

**Opción 1: VS Code con REST Client**

1. Instala la extensión "REST Client"
2. Abre `api-tests.http`
3. Haz clic en "Send Request" sobre cada `###`
4. Copia tokens/IDs de las respuestas a las variables

**Opción 2: Copiar a Postman/Insomnia**

1. Importa las requests a tu cliente HTTP favorito
2. Configura las variables de entorno
3. Ejecuta las pruebas

**Opción 3: Usar scripts bash existentes**

```bash
./test-auth.sh
./test-products.sh
./test-reactions.sh
```

---

### 3. Variables de Entorno Actualizadas

Archivo `.env.example` actualizado:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=delivery_db

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=7d

# Server
PORT=3000
CORS_ORIGIN=*
```

**Nueva variable:**
- `CORS_ORIGIN`: Controla qué orígenes pueden acceder a la API
  - Desarrollo: `*` (todos)
  - Producción: `https://mi-frontend.com`

---

## 🚀 Uso

### Iniciar el Servidor

```bash
pnpm start:dev
```

**Output esperado:**
```
🚀 Application is running on: http://localhost:3000/api
```

### Probar Endpoints

#### Opción 1: REST Client (VS Code)

```http
### Registrar Usuario
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123!",
  "phone": "+56987654321",
  "type": "empresa"
}
```

#### Opción 2: cURL

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "phone": "+56987654321",
    "type": "empresa"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

#### Opción 3: Scripts Bash

```bash
# Actualizar scripts existentes con /api
sed -i 's|http://localhost:3000/|http://localhost:3000/api/|g' test-auth.sh
sed -i 's|http://localhost:3000/|http://localhost:3000/api/|g' test-products.sh
sed -i 's|http://localhost:3000/|http://localhost:3000/api/|g' test-reactions.sh
```

---

## 📊 Tabla de Endpoints

| Método | Endpoint Original | Endpoint con /api |
|--------|-------------------|-------------------|
| POST | `/auth/register` | `/api/auth/register` |
| POST | `/auth/login` | `/api/auth/login` |
| GET | `/businesses` | `/api/businesses` |
| POST | `/businesses` | `/api/businesses` |
| GET | `/products` | `/api/products` |
| POST | `/products` | `/api/products` |
| POST | `/reactions` | `/api/reactions` |
| GET | `/reactions` | `/api/reactions` |

---

## 🔒 CORS en Producción

Para producción, configura el origen específico:

```bash
# .env (producción)
CORS_ORIGIN=https://mi-app.com
```

O múltiples orígenes:

```typescript
// src/main.ts
app.enableCors({
  origin: [
    'https://mi-app.com',
    'https://admin.mi-app.com',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

---

## 📝 Notas Importantes

1. **Prefijo /api**: Todos los endpoints ahora requieren `/api` como prefijo
2. **CORS habilitado**: Permite peticiones desde cualquier origen en desarrollo
3. **ValidationPipe**: Valida y transforma datos automáticamente
4. **Archivo .http**: Listo para usar con REST Client de VS Code
5. **Scripts bash**: Necesitan actualización para usar `/api`

---

## ✅ Checklist

- [x] CORS configurado con variable de entorno
- [x] Prefijo global `/api` aplicado
- [x] ValidationPipe global (ya existía)
- [x] Mensaje de inicio con URL completa
- [x] Archivo `api-tests.http` creado
- [x] Todas las rutas documentadas
- [x] Ejemplos de autenticación incluidos
- [x] Flujo E2E completo
- [x] Pruebas de errores incluidas
- [x] Variables de entorno actualizadas

---

## 🔄 Migración de URLs

Si tienes código frontend que usa las URLs antiguas:

**Antes:**
```javascript
const API_URL = 'http://localhost:3000';
fetch(`${API_URL}/auth/login`, {...});
```

**Después:**
```javascript
const API_URL = 'http://localhost:3000/api';
fetch(`${API_URL}/auth/login`, {...});
```

---

**Fecha de actualización**: 28 de octubre de 2025
**Estado**: ✅ Completado
