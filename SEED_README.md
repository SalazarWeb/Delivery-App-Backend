# 🌱 Seed Script - Quick Start

## ✨ ¿Qué hace este script?

Inserta datos de ejemplo en tu base de datos:
- 👤 1 Usuario empresa (`empresa@seed.com` / `Empresa123!`)
- 🏢 1 Negocio (Pizzería Bella Italia)
- 🍕 3 Productos (pizzas variadas)

## 🚀 Uso

```bash
# 1. Asegúrate de que PostgreSQL está corriendo
sudo systemctl start postgresql  # Linux
# o
brew services start postgresql   # Mac

# 2. Crea la base de datos (si no existe)
psql -U postgres -c "CREATE DATABASE delivery_db;"

# 3. Configura tu archivo .env
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL

# 4. Ejecuta el seed
pnpm seed
```

## 📋 Salida Esperada

```
🌱 Iniciando seed de la base de datos...

📡 Conectando a la base de datos...
✅ Conexión establecida

👤 Creando usuario empresa...
✅ Usuario empresa creado
   - ID: xxx-xxx-xxx
   - Email: empresa@seed.com
   - Password: Empresa123!

🏢 Creando negocio...
✅ Negocio creado
   - Nombre: Pizzería Bella Italia

🍕 Creando productos...
✅ "Pizza Margherita" creado - $12.99
✅ "Pizza Pepperoni" creado - $14.99
✅ "Pizza Cuatro Quesos" creado - $16.99

═══════════════════════════════════════
✅ SEED COMPLETADO CON ÉXITO
═══════════════════════════════════════
```

## 🔑 Credenciales de Prueba

Una vez ejecutado el seed, puedes hacer login con:

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "empresa@seed.com",
  "password": "Empresa123!"
}
```

## 🧪 Probar los Datos

```bash
# 1. Iniciar el servidor
pnpm start:dev

# 2. Ver todos los productos
curl http://localhost:3000/api/products

# 3. Ver todos los negocios
curl http://localhost:3000/api/businesses
```

## 📚 Documentación Completa

Ver [SEED_DOCUMENTATION.md](./SEED_DOCUMENTATION.md) para más detalles.

## 🔄 Ejecutar Múltiples Veces

El script es **idempotente**: si los datos ya existen, los reutiliza en lugar de duplicarlos.

```bash
# Segunda ejecución mostrará:
⚠️  Usuario empresa ya existe, usando el existente
⚠️  Negocio ya existe, usando el existente
⚠️  "Pizza Margherita" ya existe, omitiendo...
```

## 🐛 Solución de Problemas

### Error: "ECONNREFUSED 127.0.0.1:5432"

PostgreSQL no está corriendo.

**Solución:**
```bash
sudo systemctl start postgresql
```

### Error: "database does not exist"

La base de datos no está creada.

**Solución:**
```bash
psql -U postgres -c "CREATE DATABASE delivery_db;"
```

### Error: "password authentication failed"

Credenciales incorrectas en `.env`.

**Solución:**
Verifica y actualiza tu archivo `.env`:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password_real
DB_NAME=delivery_db
```

---

**Archivo:** `src/seed.ts`  
**Comando:** `pnpm seed`  
**Estado:** ✅ Listo para usar
