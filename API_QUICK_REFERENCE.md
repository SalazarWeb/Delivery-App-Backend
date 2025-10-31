# 📡 API Endpoints - Quick Reference

## Base URL
```
http://localhost:3000/api
```

## 🔐 Authentication

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/auth/register` | ❌ No | Registrar nuevo usuario |
| POST | `/auth/login` | ❌ No | Iniciar sesión |

## 🏢 Businesses

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/businesses` | ✅ Empresa | Crear negocio |
| GET | `/businesses` | ❌ No | Listar todos los negocios |
| GET | `/businesses/:id` | ❌ No | Obtener negocio por ID |
| GET | `/businesses/my/businesses` | ✅ Empresa | Mis negocios |
| PATCH | `/businesses/:id` | ✅ Propietario | Actualizar negocio |
| DELETE | `/businesses/:id` | ✅ Propietario | Eliminar negocio |

## 🍕 Products

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/products` | ✅ Propietario | Crear producto |
| GET | `/products` | ❌ No | Listar productos |
| GET | `/products/:id` | ❌ No | Obtener producto por ID |
| PUT | `/products/:id` | ✅ Propietario | Actualizar producto |
| DELETE | `/products/:id` | ✅ Propietario | Eliminar producto |

## ❤️ Reactions

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/reactions` | ✅ Sí | Crear/actualizar reacción |
| GET | `/reactions/product/:id` | ❌ No | Reacciones de producto |
| GET | `/reactions/product/:id/stats` | ❌ No | Estadísticas |
| GET | `/reactions/my` | ✅ Sí | Mis reacciones |
| DELETE | `/reactions/product/:id` | ✅ Sí | Eliminar reacción |

## 📊 Códigos de Estado

| Código | Significado |
|--------|-------------|
| 200 | OK - Exitoso |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Error de validación |
| 401 | Unauthorized - Token inválido |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - No encontrado |
| 409 | Conflict - Conflicto (email duplicado) |

## 🚀 Ejemplos Rápidos

### Registro
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!","name":"User","phone":"+123","type":"cliente"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"empresa@seed.com","password":"Empresa123!"}'
```

### Crear Negocio
```bash
curl -X POST http://localhost:3000/api/businesses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mi Negocio","address":"Calle 123","whatsappNumber":"+123","openingHours":{}}'
```

### Listar Productos
```bash
curl http://localhost:3000/api/products
```

### Crear Reacción
```bash
curl -X POST http://localhost:3000/api/reactions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID","type":"love"}'
```

## 📚 Documentación Completa
Ver [API_ENDPOINTS.md](./API_ENDPOINTS.md)
