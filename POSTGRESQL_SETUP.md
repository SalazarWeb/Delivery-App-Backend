# 🔧 Configuración de PostgreSQL - Solución de Errores

## ⚠️ Error Actual

```
ERROR [TypeOrmModule] Unable to connect to the database
error: password authentication failed for user "postgres"
```

---

## 🎯 Soluciones Posibles

### Solución 1: PostgreSQL no está corriendo

```bash
# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Si no está corriendo, iniciarlo
sudo systemctl start postgresql

# Habilitar para que inicie automáticamente
sudo systemctl enable postgresql
```

### Solución 2: Contraseña incorrecta

La contraseña por defecto de PostgreSQL puede ser diferente en tu sistema.

#### Opción A: Cambiar la contraseña de postgres

```bash
# Conectar como superusuario del sistema
sudo -u postgres psql

# Dentro de psql, cambiar la contraseña:
ALTER USER postgres PASSWORD 'postgres';

# Salir
\q
```

#### Opción B: Crear un nuevo usuario

```bash
# Conectar como superusuario
sudo -u postgres psql

# Crear nuevo usuario
CREATE USER delivery_user WITH PASSWORD 'delivery_pass';

# Dar permisos
ALTER USER delivery_user CREATEDB;

# Salir
\q

# Actualizar .env
DB_USER=delivery_user
DB_PASS=delivery_pass
```

#### Opción C: Usar autenticación peer (sin contraseña)

```bash
# Editar archivo de configuración
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Cambiar la línea:
# local   all   postgres   peer
# a:
# local   all   postgres   md5

# O cambiar:
# host    all   all   127.0.0.1/32   scram-sha-256
# a:
# host    all   all   127.0.0.1/32   trust

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### Solución 3: La base de datos no existe

```bash
# Crear la base de datos
sudo -u postgres psql -c "CREATE DATABASE delivery_db;"

# O con tu usuario
psql -U postgres -c "CREATE DATABASE delivery_db;"
# Ingresar la contraseña cuando te la pida
```

---

## 🧪 Verificación Paso a Paso

### 1. Verificar que PostgreSQL está instalado

```bash
psql --version

# Output esperado:
# psql (PostgreSQL) 14.x
```

Si no está instalado:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql@14
brew services start postgresql@14
```

### 2. Verificar que PostgreSQL está corriendo

```bash
sudo systemctl status postgresql

# Output esperado:
# ● postgresql.service - PostgreSQL RDBMS
#    Active: active (running)
```

Si no está corriendo:

```bash
sudo systemctl start postgresql
```

### 3. Probar conexión sin contraseña (como usuario del sistema)

```bash
sudo -u postgres psql

# Si funciona, estás dentro de PostgreSQL ✅
# Ahora configura la contraseña:
ALTER USER postgres PASSWORD 'postgres';
\q
```

### 4. Probar conexión con contraseña

```bash
psql -h localhost -p 5432 -U postgres -d postgres

# Te pedirá la contraseña
# Si conecta, la configuración es correcta ✅
```

### 5. Crear la base de datos

```bash
# Opción 1: Desde línea de comandos
createdb -U postgres delivery_db

# Opción 2: Desde psql
psql -U postgres
CREATE DATABASE delivery_db;
\l  # Listar bases de datos
\q
```

### 6. Verificar acceso a la base de datos

```bash
psql -h localhost -p 5432 -U postgres -d delivery_db

# Si conecta, todo está listo ✅
```

---

## 🚀 Configuración Rápida (Ubuntu/Debian)

```bash
# 1. Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# 2. Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 3. Configurar contraseña
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# 4. Configurar autenticación
sudo sed -i 's/peer/md5/g' /etc/postgresql/*/main/pg_hba.conf
sudo sed -i 's/scram-sha-256/md5/g' /etc/postgresql/*/main/pg_hba.conf

# 5. Reiniciar PostgreSQL
sudo systemctl restart postgresql

# 6. Crear base de datos
sudo -u postgres psql -c "CREATE DATABASE delivery_db;"

# 7. Verificar
psql -h localhost -p 5432 -U postgres -d delivery_db

# 8. Si funciona, iniciar el servidor NestJS
cd /home/salazar/Code/delivery-app/backend
pnpm start:dev
```

---

## 🍎 Configuración Rápida (macOS)

```bash
# 1. Instalar PostgreSQL
brew install postgresql@14

# 2. Iniciar servicio
brew services start postgresql@14

# 3. Crear usuario postgres (si no existe)
createuser -s postgres

# 4. Configurar contraseña
psql postgres -c "ALTER USER postgres PASSWORD 'postgres';"

# 5. Crear base de datos
createdb -U postgres delivery_db

# 6. Verificar
psql -h localhost -p 5432 -U postgres -d delivery_db

# 7. Si funciona, iniciar el servidor NestJS
cd /home/salazar/Code/delivery-app/backend
pnpm start:dev
```

---

## 🪟 Configuración Rápida (Windows con WSL)

Si estás en Windows con WSL (Ubuntu):

```bash
# 1. Actualizar sistema
sudo apt update
sudo apt upgrade -y

# 2. Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 3. Iniciar servicio
sudo service postgresql start

# 4. Configurar contraseña
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# 5. Editar pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Cambiar:
# local   all   postgres   peer
# a:
# local   all   postgres   md5

# Guardar: Ctrl+O, Enter, Ctrl+X

# 6. Reiniciar servicio
sudo service postgresql restart

# 7. Crear base de datos
sudo -u postgres psql -c "CREATE DATABASE delivery_db;"

# 8. Verificar
psql -h localhost -p 5432 -U postgres -d delivery_db

# 9. Iniciar el servidor NestJS
cd /home/salazar/Code/delivery-app/backend
pnpm start:dev
```

---

## 🐳 Usar Docker (Alternativa Fácil)

Si prefieres no lidiar con la configuración local:

### 1. Crear docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: delivery_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: delivery_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### 2. Iniciar PostgreSQL con Docker

```bash
# En el directorio del backend
docker-compose up -d

# Verificar logs
docker-compose logs -f postgres

# Verificar que está corriendo
docker ps

# Conectar
docker exec -it delivery_postgres psql -U postgres -d delivery_db

# Detener
docker-compose down

# Detener y borrar datos
docker-compose down -v
```

### 3. Iniciar servidor NestJS

```bash
pnpm start:dev
```

---

## 📋 Checklist de Verificación

Marca cada paso que hayas completado:

- [ ] PostgreSQL está instalado (`psql --version`)
- [ ] PostgreSQL está corriendo (`sudo systemctl status postgresql`)
- [ ] Usuario `postgres` existe
- [ ] Contraseña de `postgres` es `postgres` (o actualizada en `.env`)
- [ ] Base de datos `delivery_db` existe (`\l` en psql)
- [ ] Conexión manual funciona (`psql -h localhost -U postgres -d delivery_db`)
- [ ] Archivo `.env` tiene las credenciales correctas
- [ ] Servidor NestJS inicia sin errores (`pnpm start:dev`)

---

## 🎯 Siguiente Paso

Una vez que PostgreSQL esté configurado y el servidor inicie correctamente, deberías ver:

```bash
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] LOG [RoutesResolver] AppController {/api}:
[Nest] LOG [RouterExplorer] Mapped {/api/users, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/businesses, GET} route
[Nest] LOG [NestApplication] Nest application successfully started
🚀 Application is running on: http://localhost:3000
```

Y podrás ejecutar el seed:

```bash
pnpm seed
```

---

**Última actualización:** 31 de octubre de 2025  
**Estado:** ⚠️ Esperando configuración de PostgreSQL
