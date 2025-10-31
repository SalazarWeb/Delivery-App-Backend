# 🌱 Script de Seed - Delivery App

## 📋 Descripción

Script para poblar la base de datos con datos de ejemplo:
- ✅ 1 Usuario tipo **empresa**
- ✅ 1 Negocio de ejemplo (**Pizzería Bella Italia**)
- ✅ 3 Productos de ejemplo (pizzas)

## 🚀 Uso Rápido

```bash
# Ejecutar el seed
pnpm seed

# o con npm
npm run seed

# o directamente con ts-node
ts-node -r tsconfig-paths/register src/seed.ts
```

## 📦 Datos Insertados

### 👤 Usuario Empresa

```json
{
  "email": "empresa@seed.com",
  "password": "Empresa123!",
  "name": "Restaurante La Casa del Sabor",
  "type": "empresa",
  "phone": "+1234567890"
}
```

**Credenciales para Login:**
- Email: `empresa@seed.com`
- Password: `Empresa123!`

### 🏢 Negocio

```json
{
  "name": "Pizzería Bella Italia",
  "description": "Las mejores pizzas artesanales de la ciudad. Recetas tradicionales italianas con ingredientes frescos y de primera calidad.",
  "address": "Av. Principal 123, Centro Histórico",
  "whatsappNumber": "+1234567890",
  "openingHours": {
    "lunes": { "open": "12:00", "close": "23:00" },
    "martes": { "open": "12:00", "close": "23:00" },
    "miercoles": { "open": "12:00", "close": "23:00" },
    "jueves": { "open": "12:00", "close": "23:00" },
    "viernes": { "open": "12:00", "close": "00:00" },
    "sabado": { "open": "12:00", "close": "00:00" },
    "domingo": { "open": "12:00", "close": "23:00" }
  }
}
```

### 🍕 Productos

#### 1. Pizza Margherita
```json
{
  "name": "Pizza Margherita",
  "description": "La clásica pizza italiana con salsa de tomate San Marzano, mozzarella di bufala, albahaca fresca y aceite de oliva extra virgen.",
  "weightGrams": 450,
  "quantityUnits": 1,
  "price": 12.99,
  "imageUrl": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
  "isAvailable": true
}
```

#### 2. Pizza Pepperoni
```json
{
  "name": "Pizza Pepperoni",
  "description": "Pizza con abundante pepperoni de primera calidad, queso mozzarella derretido y salsa de tomate especiada. La favorita de todos.",
  "weightGrams": 500,
  "quantityUnits": 1,
  "price": 14.99,
  "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e",
  "isAvailable": true
}
```

#### 3. Pizza Cuatro Quesos
```json
{
  "name": "Pizza Cuatro Quesos",
  "description": "Exquisita combinación de mozzarella, gorgonzola, parmesano y queso de cabra sobre base de crema. Para los amantes del queso.",
  "weightGrams": 480,
  "quantityUnits": 1,
  "price": 16.99,
  "imageUrl": "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f",
  "isAvailable": true
}
```

## 🔧 Configuración

### Variables de Entorno

El script usa las variables de entorno del archivo `.env`:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=delivery_db
```

Si no existen las variables, usa valores por defecto.

### Requisitos

- ✅ PostgreSQL corriendo
- ✅ Base de datos creada
- ✅ ts-node instalado (ya incluido en devDependencies)
- ✅ bcrypt para hashear contraseñas

## 📝 Características

### ✅ Idempotente
- El script verifica si los datos ya existen antes de crearlos
- Puedes ejecutarlo múltiples veces sin duplicar datos
- Muestra advertencias cuando encuentra datos existentes

### ✅ Detallado
- Muestra el progreso paso a paso
- Logs coloridos con emojis
- Resumen al finalizar con estadísticas

### ✅ Manejo de Errores
- Captura y muestra errores claramente
- Cierra la conexión automáticamente
- Exit code apropiado en caso de error

## 🎯 Flujo de Ejecución

```
1. 📡 Conectar a PostgreSQL
2. 👤 Crear usuario empresa (si no existe)
3. 🏢 Crear negocio (si no existe)
4. 🍕 Crear 3 productos (si no existen)
5. ✅ Mostrar resumen
6. 🔌 Cerrar conexión
```

## 📋 Output Ejemplo

```
🌱 Iniciando seed de la base de datos...

📡 Conectando a la base de datos...
✅ Conexión establecida

👤 Creando usuario empresa...
✅ Usuario empresa creado
   - ID: 123e4567-e89b-12d3-a456-426614174000
   - Email: empresa@seed.com
   - Password: Empresa123!

🏢 Creando negocio...
✅ Negocio creado
   - ID: 223e4567-e89b-12d3-a456-426614174000
   - Nombre: Pizzería Bella Italia
   - Dirección: Av. Principal 123, Centro Histórico

🍕 Creando productos...
✅ "Pizza Margherita" creado - $12.99
✅ "Pizza Pepperoni" creado - $14.99
✅ "Pizza Cuatro Quesos" creado - $16.99

═══════════════════════════════════════
✅ SEED COMPLETADO CON ÉXITO
═══════════════════════════════════════
👤 Usuario empresa: empresa@seed.com
🔑 Password: Empresa123!
🏢 Negocio: Pizzería Bella Italia
🍕 Productos creados: 3
═══════════════════════════════════════

📋 PRÓXIMOS PASOS:
1. Iniciar el servidor: pnpm start:dev
2. Login con las credenciales:
   POST http://localhost:3000/api/auth/login
   {
     "email": "empresa@seed.com",
     "password": "Empresa123!"
   }
3. Explorar los productos creados:
   GET http://localhost:3000/api/products

✨ ¡Base de datos lista para usar!

🔌 Conexión cerrada
```

## 🧪 Probar los Datos

### 1. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "empresa@seed.com",
    "password": "Empresa123!"
  }'
```

### 2. Listar Negocios

```bash
curl http://localhost:3000/api/businesses
```

### 3. Listar Productos

```bash
curl http://localhost:3000/api/products
```

### 4. Ver Productos del Negocio

```bash
# Reemplaza BUSINESS_ID con el ID del negocio
curl http://localhost:3000/api/products?businessId=BUSINESS_ID
```

## 🔄 Ejecutar de Nuevo

Si quieres limpiar la base de datos y ejecutar el seed de nuevo:

```bash
# Opción 1: Borrar la base de datos y crearla de nuevo
psql -U postgres -c "DROP DATABASE delivery_db;"
psql -U postgres -c "CREATE DATABASE delivery_db;"
pnpm seed

# Opción 2: El script detecta datos existentes y los reutiliza
pnpm seed
```

## 📁 Estructura del Código

```typescript
// src/seed.ts

1. Imports
   - reflect-metadata (necesario para TypeORM)
   - DataSource de TypeORM
   - bcrypt para hashear passwords
   - Entidades (User, Business, Product)

2. Configuración de DataSource
   - Conexión a PostgreSQL
   - Carga de entidades
   - synchronize: true (crea tablas automáticamente)

3. Función seed()
   - Inicializar conexión
   - Crear usuario empresa
   - Crear negocio
   - Crear productos
   - Mostrar resumen
   - Cerrar conexión

4. Manejo de Errores
   - try/catch para errores
   - finally para cerrar conexión
   - process.exit(1) en caso de error
```

## 🛠️ Personalización

### Cambiar los Datos

Edita `src/seed.ts` y modifica las constantes:

```typescript
// Usuario
const passwordHash = await bcrypt.hash('TuPassword', 10);
empresaUser = userRepository.create({
  type: UserType.EMPRESA,
  name: 'Tu Negocio',
  email: 'tu@email.com',
  // ...
});

// Negocio
business = businessRepository.create({
  name: 'Tu Pizzería',
  description: 'Tu descripción',
  // ...
});

// Productos
const products = [
  {
    name: 'Tu Producto',
    price: 10.99,
    // ...
  },
];
```

### Añadir Más Productos

Simplemente agrega objetos al array `products`:

```typescript
const products = [
  // ... productos existentes
  {
    name: 'Pizza Hawaiana',
    description: 'Pizza con jamón y piña',
    weightGrams: 470,
    quantityUnits: 1,
    price: 13.99,
    imageUrl: 'https://...',
    isAvailable: true,
  },
];
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Solución:**
```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Iniciar PostgreSQL
sudo systemctl start postgresql

# Verificar variables de entorno en .env
cat .env
```

### Error: "Database does not exist"

**Solución:**
```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE delivery_db;"
```

### Error: "Cannot find module 'typeorm'"

**Solución:**
```bash
# Instalar dependencias
pnpm install
```

### Error: "reflect-metadata shim is required"

**Solución:**
El import `import 'reflect-metadata'` ya está incluido al inicio del archivo.

## 📚 Recursos

- [TypeORM DataSource](https://typeorm.io/data-source)
- [TypeORM Repository](https://typeorm.io/repository-api)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [ts-node Documentation](https://typestrong.org/ts-node/)

## ✅ Checklist

- [x] Script de seed creado
- [x] Usuario empresa con password hasheado
- [x] Negocio con horarios de apertura
- [x] 3 productos de ejemplo con imágenes
- [x] Verificación de duplicados (idempotente)
- [x] Manejo de errores robusto
- [x] Logs detallados con progreso
- [x] Resumen final con instrucciones
- [x] Script añadido a package.json
- [x] Documentación completa

---

**Creado:** 31 de octubre de 2025  
**Estado:** ✅ Listo para usar  
**Comando:** `pnpm seed`
