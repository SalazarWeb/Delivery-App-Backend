# ⚙️ Configuración del Archivo .env

## 📋 Variables de Entorno

El archivo `.env` contiene todas las configuraciones necesarias para ejecutar el backend en modo desarrollo.

---

## 🗄️ Database Configuration (PostgreSQL)

### Variables

```bash
DB_HOST=localhost          # Host de PostgreSQL
DB_PORT=5432              # Puerto de PostgreSQL (default: 5432)
DB_USER=postgres          # Usuario de la base de datos
DB_PASS=postgres          # Contraseña del usuario
DB_NAME=delivery_db       # Nombre de la base de datos
```

### Configuración Inicial

```bash
# 1. Instalar PostgreSQL (si no está instalado)
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (con Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Windows
# Descargar desde: https://www.postgresql.org/download/windows/

# 2. Crear la base de datos
psql -U postgres

# En el prompt de PostgreSQL:
CREATE DATABASE delivery_db;

# Verificar
\l

# Salir
\q

# 3. Verificar conexión
psql -U postgres -d delivery_db -c "SELECT version();"
```

### Cambiar Configuración

Si tu PostgreSQL usa credenciales diferentes:

```bash
# Ejemplo con usuario personalizado
DB_HOST=localhost
DB_PORT=5432
DB_USER=mi_usuario
DB_PASS=mi_password_segura
DB_NAME=delivery_db
```

### PostgreSQL en Docker

```bash
# docker-compose.yml (ejemplo)
version: '3.8'
services:
  postgres:
    image: postgres:14
    container_name: delivery_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: delivery_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

# Ejecutar
docker-compose up -d

# Variables .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=delivery_db
```

---

## 🔐 JWT Configuration

### Variables

```bash
JWT_SECRET=delivery-app-jwt-secret-2025-7x9k2m5p8q1w4e6r3t8y1u4i7o0p3s6d9f2g5h8j1k4
JWT_EXPIRATION=7d
```

### Descripción

- **JWT_SECRET**: Clave secreta para firmar los tokens JWT
  - Debe ser una cadena larga y aleatoria
  - ⚠️ **NUNCA** compartir o commitear en producción
  - Longitud recomendada: 64+ caracteres

- **JWT_EXPIRATION**: Tiempo de expiración del token
  - Formato: número + unidad (s, m, h, d)
  - Ejemplos: `60s`, `15m`, `24h`, `7d`
  - Default: `7d` (7 días)

### Generar JWT_SECRET Seguro

```bash
# Opción 1: Node.js (recomendado)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opción 2: OpenSSL
openssl rand -hex 64

# Opción 3: Python
python3 -c "import secrets; print(secrets.token_hex(64))"

# Copiar el resultado y pegarlo en JWT_SECRET
```

### Seguridad en Producción

```bash
# ⚠️ NUNCA usar en producción:
JWT_SECRET=your-secret-key-change-this-in-production
JWT_SECRET=123456
JWT_SECRET=secret

# ✅ Usar en producción:
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# O usar servicios de secrets management:
# - AWS Secrets Manager
# - Google Cloud Secret Manager
# - Azure Key Vault
# - HashiCorp Vault
```

---

## 🌐 Server Configuration

### Variables

```bash
PORT=3000
```

### Descripción

Puerto en el que el servidor escuchará peticiones HTTP.

### Cambiar Puerto

```bash
# Si el puerto 3000 está ocupado
PORT=3001

# O cualquier puerto disponible
PORT=8080
PORT=4000
```

### Verificar Puerto Disponible

```bash
# Linux/Mac
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# Si está ocupado, matar el proceso o usar otro puerto
```

---

## 🔀 CORS Configuration

### Variables

```bash
CORS_ORIGIN=*
```

### Descripción

Controla qué orígenes pueden acceder a la API.

### Configuraciones Según Entorno

#### Desarrollo (Permite Todo)

```bash
# Permite peticiones desde cualquier origen
CORS_ORIGIN=*
```

#### Desarrollo (Específico)

```bash
# Permite solo orígenes específicos (separados por coma)
CORS_ORIGIN=http://localhost:19006,http://localhost:3001,http://192.168.1.100:19000
```

#### Producción (Restrictivo)

```bash
# Solo permite tu dominio de producción
CORS_ORIGIN=https://mi-app.com,https://admin.mi-app.com,https://api.mi-app.com
```

### Expo Development

```bash
# Para desarrollo con Expo en red local
CORS_ORIGIN=http://localhost:19006,http://192.168.1.100:19000,exp://192.168.1.100:19000

# O permitir todo en desarrollo
CORS_ORIGIN=*
```

---

## 🏗️ Environment

### Variables

```bash
NODE_ENV=development
```

### Valores Posibles

- **development**: Modo desarrollo
  - TypeORM `synchronize: true` (crea tablas automáticamente)
  - Logging habilitado
  - CORS más permisivo
  - Stack traces completos en errores

- **production**: Modo producción
  - TypeORM `synchronize: false` (usar migraciones)
  - Logging reducido
  - CORS restrictivo
  - Errores sin stack traces

- **test**: Modo testing
  - Base de datos separada
  - Configuraciones específicas para tests

### Según Entorno

```bash
# Desarrollo Local
NODE_ENV=development

# Staging/QA
NODE_ENV=staging

# Producción
NODE_ENV=production

# Tests
NODE_ENV=test
```

---

## 📝 Archivo .env Completo (Ejemplo)

### Desarrollo Local

```bash
# ═══════════════════════════════════════════════════════════════
# DELIVERY APP - BACKEND CONFIGURATION
# ═══════════════════════════════════════════════════════════════

# ───────────────────────────────────────────────────────────────
# DATABASE CONFIGURATION (PostgreSQL)
# ───────────────────────────────────────────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=delivery_db

# ───────────────────────────────────────────────────────────────
# JWT CONFIGURATION
# ───────────────────────────────────────────────────────────────
JWT_SECRET=delivery-app-jwt-secret-2025-7x9k2m5p8q1w4e6r3t8y1u4i7o0p3s6d9f2g5h8j1k4
JWT_EXPIRATION=7d

# ───────────────────────────────────────────────────────────────
# SERVER CONFIGURATION
# ───────────────────────────────────────────────────────────────
PORT=3000

# ───────────────────────────────────────────────────────────────
# CORS CONFIGURATION
# ───────────────────────────────────────────────────────────────
CORS_ORIGIN=*

# ───────────────────────────────────────────────────────────────
# ENVIRONMENT
# ───────────────────────────────────────────────────────────────
NODE_ENV=development
```

### Producción

```bash
# DATABASE - Usar variables de entorno del servidor o secrets manager
DB_HOST=production-db.example.com
DB_PORT=5432
DB_USER=${DB_USER_PROD}
DB_PASS=${DB_PASS_PROD}
DB_NAME=delivery_db_prod

# JWT - Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=a8f5d2b9c7e4f1a3d6b8c9e2f5a7d9b1c3e5f7a9b2d4e6f8a1c3e5d7f9b1a3c5e7f9b2d4e6
JWT_EXPIRATION=24h

# SERVER
PORT=3000

# CORS - Solo dominios de producción
CORS_ORIGIN=https://app.delivery.com,https://admin.delivery.com

# ENVIRONMENT
NODE_ENV=production
```

---

## 🚀 Inicio Rápido

```bash
# 1. Copiar .env.example a .env
cp .env.example .env

# 2. Editar .env con tus valores
nano .env  # o vim, code, etc.

# 3. Crear base de datos
psql -U postgres -c "CREATE DATABASE delivery_db;"

# 4. Ejecutar seed (opcional)
pnpm seed

# 5. Iniciar servidor
pnpm start:dev
```

---

## ✅ Verificación de Configuración

```bash
# Verificar que el servidor lee las variables correctamente
pnpm start:dev

# Output esperado:
# [Nest] INFO [NestApplication] Nest application successfully started
# [Nest] INFO [InstanceLoader] TypeOrmModule dependencies initialized
# 🚀 Application is running on: http://localhost:3000
```

### Test de Conexión

```bash
# Verificar conexión a la base de datos
psql -h localhost -p 5432 -U postgres -d delivery_db -c "SELECT 1;"

# Verificar API
curl http://localhost:3000/api/businesses

# Login con usuario del seed
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"empresa@seed.com","password":"Empresa123!"}'
```

---

## 🔒 Seguridad

### ⚠️ Nunca Commitear

```bash
# Archivo .gitignore debe incluir:
.env
.env.local
.env.*.local
```

### ✅ Mejores Prácticas

1. **Usar .env.example** para documentar variables necesarias
2. **Generar JWT_SECRET** aleatorio y único por entorno
3. **Rotar secrets** periódicamente en producción
4. **Usar secrets managers** en producción (AWS, GCP, Azure)
5. **Diferentes .env** para cada entorno
6. **Validar variables** al inicio de la aplicación

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql  # Linux
brew services list                # Mac

# Iniciar si está detenido
sudo systemctl start postgresql   # Linux
brew services start postgresql    # Mac

# Verificar credenciales
psql -U postgres -h localhost -p 5432
```

### Error: "Database does not exist"

```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE delivery_db;"

# O usando script SQL
psql -U postgres -f create_database.sql
```

### Error: "Port already in use"

```bash
# Cambiar el puerto en .env
PORT=3001

# O matar el proceso que usa el puerto 3000
lsof -ti:3000 | xargs kill -9  # Mac/Linux
```

### Error: "Invalid JWT secret"

```bash
# Regenerar JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copiar y pegar en .env
```

---

## 📚 Referencias

- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [TypeORM Connection Options](https://typeorm.io/data-source-options)
- [JWT Best Practices](https://jwt.io/introduction)
- [CORS Configuration](https://docs.nestjs.com/security/cors)

---

**Última actualización:** 31 de octubre de 2025  
**Archivo:** `.env`  
**Estado:** ✅ Configurado para desarrollo local
