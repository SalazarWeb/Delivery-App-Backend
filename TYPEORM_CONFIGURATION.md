# 🗄️ Configuración de TypeORM con PostgreSQL

## 📋 Resumen

TypeORM está configurado para conectarse a PostgreSQL usando variables de entorno del archivo `.env`.

---

## ✅ Estado Actual

### Configuración Implementada

```typescript
// src/config/typeorm.config.ts
{
  type: 'postgres',
  host: DB_HOST,              // default: 'localhost'
  port: DB_PORT,              // default: 5432
  username: DB_USER,          // default: 'postgres'
  password: DB_PASS,          // default: 'postgres'
  database: DB_NAME,          // default: 'delivery_db'
  
  autoLoadEntities: true,     // ✅ Carga automática de entidades
  synchronize: !isProduction, // ✅ true en desarrollo, false en producción
  logging: !isProduction,     // ✅ Logs SQL en desarrollo
  
  ssl: isProduction ? {...} : false,  // SSL en producción
  extra: {
    max: 10,                  // Pool de conexiones
    connectionTimeoutMillis: 10000,
  }
}
```

---

## 🔧 Características Configuradas

### 1. **autoLoadEntities: true** ✅

Carga automáticamente todas las entidades registradas en los módulos de NestJS.

**Ventajas:**
- No necesitas listar manualmente las entidades
- Las entidades se cargan desde los módulos automáticamente
- Reduce el código repetitivo

**Ejemplo:**
```typescript
// En cada módulo
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Business, User])
  ],
  // ...
})
export class ProductsModule {}

// Las entidades se cargan automáticamente en TypeORM
```

### 2. **synchronize: !isProduction** ✅

Sincroniza automáticamente el esquema de la base de datos con tus entidades.

**En Desarrollo (`NODE_ENV=development`):**
```typescript
synchronize: true
```
- ✅ Crea tablas automáticamente
- ✅ Actualiza columnas cuando cambias entidades
- ✅ Añade/elimina relaciones
- ⚠️ **NO USAR EN PRODUCCIÓN** (puede perder datos)

**En Producción (`NODE_ENV=production`):**
```typescript
synchronize: false
```
- ✅ No modifica la estructura de la DB
- ✅ Requiere migraciones manuales
- ✅ Mayor control sobre cambios
- ✅ Sin riesgo de pérdida de datos

### 3. **logging: !isProduction** ✅

Muestra las queries SQL en la consola durante el desarrollo.

**Output en desarrollo:**
```sql
query: SELECT "User"."id" AS "User_id", "User"."email" AS "User_email" FROM "users" "User"
query: INSERT INTO "products"("name", "description", "price") VALUES ($1, $2, $3) RETURNING "id"
```

**Ventajas:**
- 🔍 Debug de queries SQL
- 📊 Performance monitoring
- 🐛 Identificación de N+1 queries

---

## 📦 Variables de Entorno Requeridas

### Archivo `.env`

```bash
# DATABASE CONFIGURATION (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=delivery_db

# ENVIRONMENT
NODE_ENV=development
```

### Valores por Defecto

Si una variable no está definida, se usan estos valores:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | Host de PostgreSQL |
| `DB_PORT` | `5432` | Puerto de PostgreSQL |
| `DB_USER` | `postgres` | Usuario de la DB |
| `DB_PASS` | `postgres` | Contraseña |
| `DB_NAME` | `delivery_db` | Nombre de la DB |

---

## 🚀 Cómo Funciona

### 1. ConfigModule (Global)

```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,      // Disponible en toda la app
  envFilePath: '.env', // Lee variables desde .env
})
```

### 2. TypeOrmModule (Async)

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: getTypeOrmConfig, // Función que retorna la config
})
```

### 3. Función de Configuración

```typescript
// src/config/typeorm.config.ts
export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Lee variables de entorno
  const host = configService.get<string>('DB_HOST', 'localhost');
  const port = configService.get<number>('DB_PORT', 5432);
  
  // Retorna configuración de TypeORM
  return {
    type: 'postgres',
    host,
    port,
    // ...
  };
};
```

---

## 🏗️ Estructura del Proyecto

```
src/
├── config/
│   └── typeorm.config.ts       # ⚙️ Configuración de TypeORM
├── users/
│   └── entities/
│       └── user.entity.ts      # 📦 Entidad User
├── businesses/
│   └── entities/
│       └── business.entity.ts  # 📦 Entidad Business
├── products/
│   └── entities/
│       └── product.entity.ts   # 📦 Entidad Product
├── reactions/
│   └── entities/
│       └── reaction.entity.ts  # 📦 Entidad Reaction
└── app.module.ts               # 🎯 Módulo principal
```

---

## 🧪 Verificación de Conexión

### 1. Iniciar el Servidor

```bash
pnpm start:dev
```

### 2. Output Esperado

```bash
[Nest] INFO [NestApplication] Nest application successfully started
[Nest] INFO [InstanceLoader] ConfigModule dependencies initialized
[Nest] INFO [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] INFO [TypeOrmModule] Connection to database established

# Si logging: true, verás las queries:
query: SELECT version()
query: SELECT * FROM current_schema()
query: SELECT * FROM "information_schema"."tables"
```

### 3. Verificar Tablas Creadas

```bash
# Conectar a PostgreSQL
psql -U postgres -d delivery_db

# Listar tablas
\dt

# Output esperado:
#          List of relations
#  Schema |    Name    | Type  |  Owner
# --------+------------+-------+----------
#  public | users      | table | postgres
#  public | businesses | table | postgres
#  public | products   | table | postgres
#  public | reactions  | table | postgres

# Ver estructura de una tabla
\d users

# Salir
\q
```

---

## 🔄 autoLoadEntities en Acción

### Antes (Sin autoLoadEntities)

```typescript
// Había que listar TODAS las entidades manualmente
TypeOrmModule.forRoot({
  // ...
  entities: [
    User,
    Business,
    Product,
    Reaction,
    // Cada vez que añades una entidad, debes agregarla aquí
  ],
});
```

### Ahora (Con autoLoadEntities) ✅

```typescript
// TypeORM descubre las entidades automáticamente
TypeOrmModule.forRoot({
  // ...
  autoLoadEntities: true, // ✨ Magia
});

// En cada módulo, solo registras las entidades del módulo
@Module({
  imports: [
    TypeOrmModule.forFeature([Product]) // Se carga automáticamente
  ],
})
export class ProductsModule {}
```

---

## 🔄 synchronize en Acción

### En Desarrollo (synchronize: true)

```typescript
// 1. Defines una entidad
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

// 2. Inicias el servidor
pnpm start:dev

// 3. TypeORM crea la tabla automáticamente ✅
CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR NOT NULL
);

// 4. Añades una columna
@Column()
price: number;

// 5. Reinicias el servidor
// 6. TypeORM actualiza la tabla automáticamente ✅
ALTER TABLE "products" ADD COLUMN "price" INTEGER;
```

### En Producción (synchronize: false)

```typescript
// 1. synchronize: false en producción
// 2. Cambios en entidades NO se aplican automáticamente
// 3. Debes crear migraciones manualmente

// Generar migración
pnpm typeorm migration:generate -n AddPriceToProduct

// Ejecutar migración
pnpm typeorm migration:run

// Revertir migración
pnpm typeorm migration:revert
```

---

## 📊 Pool de Conexiones

```typescript
extra: {
  max: 10,                      // Máximo 10 conexiones simultáneas
  connectionTimeoutMillis: 10000, // Timeout de 10 segundos
}
```

### ¿Por qué usar un Pool?

- 🚀 **Performance**: Reutiliza conexiones existentes
- 💾 **Recursos**: Limita el número de conexiones
- ⚡ **Escalabilidad**: Maneja múltiples peticiones concurrentes

### Ajustar según Necesidades

```typescript
// Aplicación pequeña (1-5 usuarios concurrentes)
max: 5

// Aplicación mediana (10-50 usuarios concurrentes)
max: 10

// Aplicación grande (50+ usuarios concurrentes)
max: 20
```

---

## 🔒 SSL en Producción

```typescript
ssl: isProduction
  ? {
      rejectUnauthorized: false, // Ajustar según el proveedor
    }
  : false,
```

### Configuración por Proveedor

#### AWS RDS

```typescript
ssl: {
  rejectUnauthorized: true,
  ca: fs.readFileSync('./rds-combined-ca-bundle.pem').toString(),
}
```

#### Heroku Postgres

```typescript
ssl: {
  rejectUnauthorized: false,
}
```

#### DigitalOcean

```typescript
ssl: {
  rejectUnauthorized: true,
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Verificar variables de entorno
echo $DB_HOST
echo $DB_PORT

# Test de conexión manual
psql -h localhost -p 5432 -U postgres -d delivery_db
```

### Error: "Database does not exist"

```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE delivery_db;"

# Verificar
psql -U postgres -l | grep delivery_db
```

### Error: "SSL connection required"

```typescript
// Añadir SSL en typeorm.config.ts
ssl: {
  rejectUnauthorized: false,
}
```

### Warning: "synchronize option is true"

```bash
# Esto es normal en desarrollo
# Para eliminar el warning, cambiar NODE_ENV
NODE_ENV=production pnpm start

# O desactivar synchronize manualmente
synchronize: false
```

---

## 📚 Comandos Útiles

### Desarrollo

```bash
# Iniciar servidor con hot-reload
pnpm start:dev

# Ver logs SQL
# Ya están habilitados con logging: true

# Ejecutar seed
pnpm seed
```

### Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres -d delivery_db

# Ver todas las tablas
\dt

# Ver estructura de tabla
\d users

# Ver datos
SELECT * FROM users;

# Borrar todos los datos (cuidado!)
TRUNCATE users, businesses, products, reactions CASCADE;

# Borrar y recrear DB
DROP DATABASE delivery_db;
CREATE DATABASE delivery_db;
```

### TypeORM CLI

```bash
# Instalar CLI (si no está)
pnpm add -D typeorm ts-node

# Generar migración
pnpm typeorm migration:generate -n MigrationName

# Ejecutar migraciones
pnpm typeorm migration:run

# Revertir última migración
pnpm typeorm migration:revert

# Ver migraciones ejecutadas
pnpm typeorm migration:show
```

---

## 🎯 Mejores Prácticas

### ✅ Hacer

1. **Usar autoLoadEntities** para evitar listados manuales
2. **synchronize: true** solo en desarrollo
3. **Usar migraciones** en producción
4. **Configurar pool** de conexiones apropiado
5. **Habilitar logging** en desarrollo
6. **Usar SSL** en producción
7. **Validar variables** de entorno al inicio

### ❌ No Hacer

1. **synchronize: true** en producción (pérdida de datos)
2. **Hardcodear** credenciales en el código
3. **Commitear** el archivo `.env`
4. **Pool muy grande** (desperdicia recursos)
5. **logging: true** en producción (performance)
6. **Ignorar warnings** de conexión

---

## 📖 Referencias

- [TypeORM Data Source Options](https://typeorm.io/data-source-options)
- [NestJS TypeORM Integration](https://docs.nestjs.com/techniques/database)
- [PostgreSQL Connection Pool](https://node-postgres.com/features/pooling)
- [TypeORM Migrations](https://typeorm.io/migrations)

---

**Última actualización:** 31 de octubre de 2025  
**Estado:** ✅ Configuración completa y funcional  
**Archivo:** `src/config/typeorm.config.ts`
