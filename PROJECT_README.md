# 🚀 Delivery App - Backend API

API REST construida con NestJS para una aplicación de delivery con gestión de negocios, productos y reacciones de usuarios.

## 📋 Características

- ✅ **Autenticación JWT** - Registro y login seguro
- ✅ **Gestión de Negocios** - CRUD completo para empresas
- ✅ **Catálogo de Productos** - Productos con imágenes y precios
- ✅ **Sistema de Reacciones** - Like, love y dislike a productos
- ✅ **Validaciones** - Validación de datos con class-validator
- ✅ **TypeORM + PostgreSQL** - ORM robusto con base de datos relacional
- ✅ **CORS Configurado** - Compatible con Expo y desarrollo web
- ✅ **Documentación Completa** - API endpoints documentados

## 🛠️ Stack Tecnológico

- **Framework**: NestJS 11.0.1
- **Lenguaje**: TypeScript 5.7.3
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM 0.3.27
- **Autenticación**: JWT + Passport
- **Validación**: class-validator + class-transformer
- **Seguridad**: bcrypt para passwords
- **Package Manager**: pnpm

## 📦 Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd backend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Crear base de datos
psql -U postgres -c "CREATE DATABASE delivery_db;"

# Ejecutar seed (datos de ejemplo)
pnpm seed
```

## 🚀 Ejecución

```bash
# Desarrollo
pnpm start:dev

# Producción
pnpm build
pnpm start:prod
```

El servidor estará disponible en: **http://localhost:3000**

## 📡 API Endpoints

### 🔐 Authentication

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### 🏢 Businesses

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/businesses` | Crear negocio | ✅ |
| GET | `/api/businesses` | Listar negocios | ❌ |
| GET | `/api/businesses/:id` | Obtener negocio | ❌ |
| GET | `/api/businesses/my/businesses` | Mis negocios | ✅ |
| PATCH | `/api/businesses/:id` | Actualizar negocio | ✅ |
| DELETE | `/api/businesses/:id` | Eliminar negocio | ✅ |

### 🍕 Products

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/products` | Crear producto | ✅ |
| GET | `/api/products` | Listar productos | ❌ |
| GET | `/api/products/:id` | Obtener producto | ❌ |
| PUT | `/api/products/:id` | Actualizar producto | ✅ |
| DELETE | `/api/products/:id` | Eliminar producto | ✅ |

### ❤️ Reactions

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/reactions` | Crear/actualizar reacción | ✅ |
| GET | `/api/reactions/product/:id` | Reacciones de producto | ❌ |
| GET | `/api/reactions/product/:id/stats` | Estadísticas | ❌ |
| GET | `/api/reactions/my` | Mis reacciones | ✅ |
| DELETE | `/api/reactions/product/:id` | Eliminar reacción | ✅ |

## 📚 Documentación Detallada

### 📖 Guías Principales

- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Documentación completa de endpoints con ejemplos curl
- **[API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)** - Referencia rápida de la API
- **[SEED_README.md](./SEED_README.md)** - Guía del script de seed

### 📁 Módulos

- **[Auth Module](./src/auth/README.md)** - Autenticación y registro
- **[Users Module](./src/users/README.md)** - Gestión de usuarios
- **[Businesses Module](./src/businesses/README.md)** - Gestión de negocios
- **[Products Module](./src/products/README.md)** - Catálogo de productos
- **[Reactions Module](./src/reactions/README.md)** - Sistema de reacciones

### 🔧 Configuración

- **[CORS_EXPO_CONFIG.md](./CORS_EXPO_CONFIG.md)** - Configuración CORS para Expo
- **[SEED_DOCUMENTATION.md](./SEED_DOCUMENTATION.md)** - Documentación del seed

## 🧪 Testing

### Archivo .http

Usa el archivo `test-api.http` con la extensión REST Client de VS Code:

```bash
# 1. Instalar extensión "REST Client" en VS Code
# 2. Abrir test-api.http
# 3. Click en "Send Request" sobre cada petición
```

### Scripts de Prueba

```bash
# Ejecutar seed
pnpm seed

# Login con usuario del seed
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"empresa@seed.com","password":"Empresa123!"}'
```

## 🌱 Seed de Datos

El proyecto incluye un script de seed que inserta datos de ejemplo:

```bash
pnpm seed
```

**Datos insertados:**
- 👤 1 Usuario empresa (`empresa@seed.com` / `Empresa123!`)
- 🏢 1 Negocio (Pizzería Bella Italia)
- 🍕 3 Productos (pizzas variadas)

## 📋 Scripts Disponibles

```bash
# Desarrollo
pnpm start:dev          # Iniciar en modo desarrollo
pnpm seed              # Ejecutar seed de datos

# Build
pnpm build             # Compilar proyecto

# Testing
pnpm test              # Tests unitarios
pnpm test:e2e          # Tests end-to-end
pnpm test:cov          # Coverage

# Linting
pnpm lint              # Ejecutar ESLint
pnpm format            # Formatear código con Prettier
```

## 🔐 Variables de Entorno

Archivo `.env`:

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
NODE_ENV=development

# CORS
CORS_ORIGIN=*
```

## 🎯 Ejemplos Rápidos

### Registro
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"cliente@example.com",
    "password":"Password123!",
    "name":"Juan Pérez",
    "phone":"+1234567890",
    "type":"cliente"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"empresa@seed.com",
    "password":"Empresa123!"
  }'
```

### Crear Negocio
```bash
TOKEN="tu_token_aqui"

curl -X POST http://localhost:3000/api/businesses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Mi Pizzería",
    "description":"Las mejores pizzas",
    "address":"Calle Principal 123",
    "whatsappNumber":"+1234567890",
    "openingHours":{"lunes":{"open":"12:00","close":"23:00"}}
  }'
```

### Listar Productos
```bash
curl http://localhost:3000/api/products
```

### Crear Reacción
```bash
TOKEN="tu_token_aqui"

curl -X POST http://localhost:3000/api/reactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId":"PRODUCT_ID",
    "type":"love"
  }'
```

## 📊 Estructura del Proyecto

```
backend/
├── src/
│   ├── auth/                 # Módulo de autenticación
│   │   ├── dto/              # DTOs de auth
│   │   ├── guards/           # Guards JWT y Local
│   │   └── strategies/       # Estrategias Passport
│   ├── users/                # Módulo de usuarios
│   ├── businesses/           # Módulo de negocios
│   ├── products/             # Módulo de productos
│   ├── reactions/            # Módulo de reacciones
│   ├── entities/             # Entidades TypeORM
│   ├── config/               # Configuraciones
│   ├── seed.ts               # Script de seed
│   └── main.ts               # Entry point
├── test/                     # Tests E2E
├── docs/                     # Documentación
├── test-api.http             # Archivo de pruebas REST
├── .env.example              # Variables de entorno ejemplo
└── package.json              # Dependencias
```

## 🔒 Seguridad

- ✅ Passwords hasheados con bcrypt (salt: 10)
- ✅ Autenticación JWT con expiración de 7 días
- ✅ Validación de datos con class-validator
- ✅ CORS configurado para orígenes permitidos
- ✅ Guards para protección de rutas
- ✅ Variables de entorno para secrets

## 🚢 Deployment

### Variables de Entorno en Producción

```bash
NODE_ENV=production
CORS_ORIGIN=https://tu-dominio.com
JWT_SECRET=tu-secret-key-muy-segura
DB_HOST=tu-db-host
# ... otras variables
```

### Consideraciones

- Cambiar `synchronize: false` en TypeORM
- Usar migraciones para cambios en la DB
- Configurar CORS con orígenes específicos
- Usar secrets seguros para JWT
- Configurar rate limiting
- Habilitar HTTPS

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autores

- **Delivery App Team** - Desarrollo inicial

## 📞 Soporte

Para preguntas y soporte:
- 📧 Email: support@deliveryapp.com
- 📖 Documentación: [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/delivery-app/issues)

---

**Versión:** 1.0.0  
**Última actualización:** 31 de octubre de 2025  
**Status:** ✅ Producción
