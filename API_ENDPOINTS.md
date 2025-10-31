# 📡 API Endpoints - Delivery App

## 🌐 Base URL

```
http://localhost:3000/api
```

## 📋 Tabla de Contenidos

1. [Authentication](#authentication)
2. [Businesses](#businesses)
3. [Products](#products)
4. [Reactions](#reactions)
5. [Códigos de Estado](#códigos-de-estado)
6. [Manejo de Errores](#manejo-de-errores)

---

## 🔐 Authentication

### 1. Registro de Usuario

Crea una nueva cuenta de usuario (cliente o empresa).

**Endpoint:** `POST /api/auth/register`

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!",
  "name": "Nombre Completo",
  "phone": "+1234567890",
  "type": "cliente"
}
```

**Campos:**
- `email` (string, requerido): Email único del usuario
- `password` (string, requerido): Contraseña (mínimo 6 caracteres)
- `name` (string, requerido): Nombre del usuario o empresa
- `phone` (string, requerido): Número de teléfono
- `type` (string, requerido): Tipo de usuario (`"cliente"` o `"empresa"`)

**Ejemplo curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "Password123!",
    "name": "Juan Pérez",
    "phone": "+1234567890",
    "type": "cliente"
  }'
```

**Respuesta exitosa (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "cliente@example.com",
    "name": "Juan Pérez",
    "phone": "+1234567890",
    "type": "cliente",
    "createdAt": "2025-10-31T10:30:00.000Z"
  }
}
```

**Errores comunes:**

**409 Conflict - Email ya existe:**
```json
{
  "statusCode": 409,
  "message": "El email ya está registrado",
  "error": "Conflict"
}
```

**400 Bad Request - Validación fallida:**
```json
{
  "statusCode": 400,
  "message": [
    "El email debe ser un email válido",
    "La contraseña debe tener al menos 6 caracteres"
  ],
  "error": "Bad Request"
}
```

---

### 2. Login de Usuario

Inicia sesión y obtiene un token JWT.

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

**Ejemplo curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "empresa@seed.com",
    "password": "Empresa123!"
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImVtcHJlc2FAc2VlZC5jb20iLCJ0eXBlIjoiZW1wcmVzYSIsImlhdCI6MTY5ODc1MTIwMCwiZXhwIjoxNjk5MzU2MDAwfQ.abc123xyz",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "empresa@seed.com",
    "name": "Restaurante La Casa del Sabor",
    "type": "empresa"
  }
}
```

**Errores comunes:**

**401 Unauthorized - Credenciales incorrectas:**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "error": "Unauthorized"
}
```

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": [
    "El email es requerido",
    "La contraseña es requerida"
  ],
  "error": "Bad Request"
}
```

---

## 🏢 Businesses

### 3. Crear Negocio

Crea un nuevo negocio (solo usuarios tipo empresa).

**Endpoint:** `POST /api/businesses`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Pizzería Bella Italia",
  "description": "Las mejores pizzas artesanales de la ciudad",
  "address": "Av. Principal 123, Centro",
  "whatsappNumber": "+1234567890",
  "openingHours": {
    "lunes": { "open": "12:00", "close": "23:00" },
    "martes": { "open": "12:00", "close": "23:00" },
    "miercoles": { "open": "12:00", "close": "23:00" },
    "jueves": { "open": "12:00", "close": "23:00" },
    "viernes": { "open": "12:00", "close": "00:00" },
    "sabado": { "open": "12:00", "close": "00:00" },
    "domingo": { "open": "12:00", "close": "23:00", "closed": false }
  }
}
```

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"

curl -X POST http://localhost:3000/api/businesses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizzería Bella Italia",
    "description": "Las mejores pizzas artesanales de la ciudad",
    "address": "Av. Principal 123, Centro",
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
  }'
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Pizzería Bella Italia",
  "description": "Las mejores pizzas artesanales de la ciudad",
  "address": "Av. Principal 123, Centro",
  "whatsappNumber": "+1234567890",
  "openingHours": {
    "lunes": { "open": "12:00", "close": "23:00" },
    "martes": { "open": "12:00", "close": "23:00" },
    "miercoles": { "open": "12:00", "close": "23:00" },
    "jueves": { "open": "12:00", "close": "23:00" },
    "viernes": { "open": "12:00", "close": "00:00" },
    "sabado": { "open": "12:00", "close": "00:00" },
    "domingo": { "open": "12:00", "close": "23:00" }
  },
  "createdAt": "2025-10-31T10:35:00.000Z"
}
```

**Errores comunes:**

**401 Unauthorized - Sin token:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden - Usuario no es empresa:**
```json
{
  "statusCode": 403,
  "message": "Solo usuarios tipo empresa pueden crear negocios",
  "error": "Forbidden"
}
```

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": [
    "El nombre es requerido",
    "La dirección es requerida"
  ],
  "error": "Bad Request"
}
```

---

### 4. Listar Negocios

Obtiene la lista de todos los negocios (público).

**Endpoint:** `GET /api/businesses`

**Ejemplo curl:**
```bash
curl http://localhost:3000/api/businesses
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Pizzería Bella Italia",
    "description": "Las mejores pizzas artesanales de la ciudad",
    "address": "Av. Principal 123, Centro",
    "whatsappNumber": "+1234567890",
    "openingHours": {
      "lunes": { "open": "12:00", "close": "23:00" },
      "martes": { "open": "12:00", "close": "23:00" },
      "miercoles": { "open": "12:00", "close": "23:00" },
      "jueves": { "open": "12:00", "close": "23:00" },
      "viernes": { "open": "12:00", "close": "00:00" },
      "sabado": { "open": "12:00", "close": "00:00" },
      "domingo": { "open": "12:00", "close": "23:00" }
    },
    "createdAt": "2025-10-31T10:35:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "name": "Sushi Master",
    "description": "Sushi fresco y auténtico",
    "address": "Av. Oriental 321",
    "whatsappNumber": "+1234567891",
    "openingHours": {
      "martes": { "open": "13:00", "close": "22:00" },
      "miercoles": { "open": "13:00", "close": "22:00" },
      "jueves": { "open": "13:00", "close": "22:00" },
      "viernes": { "open": "13:00", "close": "23:00" },
      "sabado": { "open": "13:00", "close": "23:00" },
      "domingo": { "open": "13:00", "close": "22:00" },
      "lunes": { "open": "00:00", "close": "00:00", "closed": true }
    },
    "createdAt": "2025-10-31T11:00:00.000Z"
  }
]
```

---

### 5. Obtener Negocio por ID

Obtiene los detalles de un negocio específico.

**Endpoint:** `GET /api/businesses/:id`

**Ejemplo curl:**
```bash
curl http://localhost:3000/api/businesses/660e8400-e29b-41d4-a716-446655440001
```

**Respuesta exitosa (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Pizzería Bella Italia",
  "description": "Las mejores pizzas artesanales de la ciudad",
  "address": "Av. Principal 123, Centro",
  "whatsappNumber": "+1234567890",
  "openingHours": {
    "lunes": { "open": "12:00", "close": "23:00" },
    "martes": { "open": "12:00", "close": "23:00" },
    "miercoles": { "open": "12:00", "close": "23:00" },
    "jueves": { "open": "12:00", "close": "23:00" },
    "viernes": { "open": "12:00", "close": "00:00" },
    "sabado": { "open": "12:00", "close": "00:00" },
    "domingo": { "open": "12:00", "close": "23:00" }
  },
  "createdAt": "2025-10-31T10:35:00.000Z"
}
```

**Error 404 - No encontrado:**
```json
{
  "statusCode": 404,
  "message": "Negocio con ID 660e8400-e29b-41d4-a716-446655440001 no encontrado",
  "error": "Not Found"
}
```

---

### 6. Listar Mis Negocios

Obtiene los negocios del usuario autenticado.

**Endpoint:** `GET /api/businesses/my/businesses`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"

curl http://localhost:3000/api/businesses/my/businesses \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Pizzería Bella Italia",
    "description": "Las mejores pizzas artesanales de la ciudad",
    "address": "Av. Principal 123, Centro",
    "whatsappNumber": "+1234567890",
    "openingHours": { /* ... */ },
    "createdAt": "2025-10-31T10:35:00.000Z"
  }
]
```

---

### 7. Actualizar Negocio

Actualiza la información de un negocio (solo el propietario).

**Endpoint:** `PATCH /api/businesses/:id`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "description": "Nueva descripción actualizada",
  "whatsappNumber": "+9876543210"
}
```

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"
BUSINESS_ID="660e8400-e29b-41d4-a716-446655440001"

curl -X PATCH http://localhost:3000/api/businesses/$BUSINESS_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Nueva descripción actualizada",
    "whatsappNumber": "+9876543210"
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Pizzería Bella Italia",
  "description": "Nueva descripción actualizada",
  "address": "Av. Principal 123, Centro",
  "whatsappNumber": "+9876543210",
  "openingHours": { /* ... */ },
  "createdAt": "2025-10-31T10:35:00.000Z"
}
```

**Error 403 - No es el propietario:**
```json
{
  "statusCode": 403,
  "message": "No tienes permiso para actualizar este negocio",
  "error": "Forbidden"
}
```

---

### 8. Eliminar Negocio

Elimina un negocio (solo el propietario).

**Endpoint:** `DELETE /api/businesses/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"
BUSINESS_ID="660e8400-e29b-41d4-a716-446655440001"

curl -X DELETE http://localhost:3000/api/businesses/$BUSINESS_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Negocio eliminado exitosamente"
}
```

---

## 🍕 Products

### 9. Crear Producto

Crea un nuevo producto en un negocio.

**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Pizza Margherita",
  "description": "Pizza clásica con tomate, mozzarella y albahaca fresca",
  "weightGrams": 450,
  "quantityUnits": 1,
  "price": 12.99,
  "imageUrl": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
  "isAvailable": true,
  "businessId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Campos:**
- `name` (string, requerido): Nombre del producto (min 3, max 255)
- `description` (string, opcional): Descripción del producto (max 1000)
- `weightGrams` (number, opcional): Peso en gramos (min 1)
- `quantityUnits` (number, opcional): Cantidad en unidades (min 1)
- `price` (number, requerido): Precio (min 0.01)
- `imageUrl` (string, opcional): URL de la imagen (max 500)
- `isAvailable` (boolean, opcional): Disponibilidad (default: true)
- `businessId` (string, requerido): ID del negocio

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"

curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margherita",
    "description": "Pizza clásica con tomate, mozzarella y albahaca fresca",
    "weightGrams": 450,
    "quantityUnits": 1,
    "price": 12.99,
    "imageUrl": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
    "isAvailable": true,
    "businessId": "660e8400-e29b-41d4-a716-446655440001"
  }'
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440003",
  "businessId": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Pizza Margherita",
  "description": "Pizza clásica con tomate, mozzarella y albahaca fresca",
  "weightGrams": 450,
  "quantityUnits": 1,
  "price": 12.99,
  "imageUrl": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
  "isAvailable": true,
  "createdAt": "2025-10-31T11:15:00.000Z"
}
```

**Errores comunes:**

**400 Bad Request - Validación fallida:**
```json
{
  "statusCode": 400,
  "message": [
    "El nombre es requerido",
    "El precio debe ser mayor a 0",
    "La imagen debe ser una URL válida"
  ],
  "error": "Bad Request"
}
```

**403 Forbidden - No es el propietario del negocio:**
```json
{
  "statusCode": 403,
  "message": "No tienes permiso para crear productos en este negocio",
  "error": "Forbidden"
}
```

---

### 10. Listar Productos

Obtiene la lista de todos los productos o filtrados por negocio.

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `businessId` (string, opcional): Filtrar por negocio

**Ejemplo curl - Todos los productos:**
```bash
curl http://localhost:3000/api/products
```

**Ejemplo curl - Productos de un negocio:**
```bash
BUSINESS_ID="660e8400-e29b-41d4-a716-446655440001"

curl "http://localhost:3000/api/products?businessId=$BUSINESS_ID"
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440003",
    "businessId": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Pizza Margherita",
    "description": "Pizza clásica con tomate, mozzarella y albahaca fresca",
    "weightGrams": 450,
    "quantityUnits": 1,
    "price": 12.99,
    "imageUrl": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
    "isAvailable": true,
    "createdAt": "2025-10-31T11:15:00.000Z",
    "business": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzería Bella Italia",
      "address": "Av. Principal 123, Centro"
    }
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440004",
    "businessId": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Pizza Pepperoni",
    "description": "Pizza con abundante pepperoni de primera calidad",
    "weightGrams": 500,
    "quantityUnits": 1,
    "price": 14.99,
    "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    "isAvailable": true,
    "createdAt": "2025-10-31T11:20:00.000Z",
    "business": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzería Bella Italia",
      "address": "Av. Principal 123, Centro"
    }
  }
]
```

---

### 11. Obtener Producto por ID

Obtiene los detalles de un producto específico.

**Endpoint:** `GET /api/products/:id`

**Ejemplo curl:**
```bash
curl http://localhost:3000/api/products/770e8400-e29b-41d4-a716-446655440003
```

**Respuesta exitosa (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440003",
  "businessId": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Pizza Margherita",
  "description": "Pizza clásica con tomate, mozzarella y albahaca fresca",
  "weightGrams": 450,
  "quantityUnits": 1,
  "price": 12.99,
  "imageUrl": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
  "isAvailable": true,
  "createdAt": "2025-10-31T11:15:00.000Z",
  "business": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Pizzería Bella Italia",
    "address": "Av. Principal 123, Centro"
  }
}
```

**Error 404:**
```json
{
  "statusCode": 404,
  "message": "Producto con ID 770e8400-e29b-41d4-a716-446655440003 no encontrado",
  "error": "Not Found"
}
```

---

### 12. Actualizar Producto

Actualiza la información de un producto (solo el propietario del negocio).

**Endpoint:** `PUT /api/products/:id`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "price": 11.99,
  "description": "Ahora con descuento especial",
  "isAvailable": true
}
```

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"
PRODUCT_ID="770e8400-e29b-41d4-a716-446655440003"

curl -X PUT http://localhost:3000/api/products/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 11.99,
    "description": "Ahora con descuento especial",
    "isAvailable": true
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440003",
  "businessId": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Pizza Margherita",
  "description": "Ahora con descuento especial",
  "weightGrams": 450,
  "quantityUnits": 1,
  "price": 11.99,
  "imageUrl": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
  "isAvailable": true,
  "createdAt": "2025-10-31T11:15:00.000Z"
}
```

---

### 13. Eliminar Producto

Elimina un producto (solo el propietario del negocio).

**Endpoint:** `DELETE /api/products/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"
PRODUCT_ID="770e8400-e29b-41d4-a716-446655440003"

curl -X DELETE http://localhost:3000/api/products/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

---

## ❤️ Reactions

### 14. Crear o Actualizar Reacción

Crea una nueva reacción o actualiza una existente a un producto.

**Endpoint:** `POST /api/reactions`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "productId": "770e8400-e29b-41d4-a716-446655440003",
  "type": "love"
}
```

**Tipos de reacción:**
- `"like"` - Me gusta
- `"love"` - Me encanta
- `"dislike"` - No me gusta

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"

curl -X POST http://localhost:3000/api/reactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "770e8400-e29b-41d4-a716-446655440003",
    "type": "love"
  }'
```

**Respuesta exitosa (201 Created) - Nueva reacción:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440005",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "productId": "770e8400-e29b-41d4-a716-446655440003",
  "type": "love",
  "createdAt": "2025-10-31T12:00:00.000Z"
}
```

**Respuesta exitosa (200 OK) - Reacción actualizada:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440005",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "productId": "770e8400-e29b-41d4-a716-446655440003",
  "type": "like",
  "createdAt": "2025-10-31T12:00:00.000Z"
}
```

**Error 404 - Producto no existe:**
```json
{
  "statusCode": 404,
  "message": "Producto no encontrado",
  "error": "Not Found"
}
```

**Error 400 - Tipo inválido:**
```json
{
  "statusCode": 400,
  "message": [
    "type debe ser uno de los siguientes valores: like, love, dislike"
  ],
  "error": "Bad Request"
}
```

---

### 15. Obtener Reacciones de un Producto

Obtiene todas las reacciones de un producto específico.

**Endpoint:** `GET /api/reactions/product/:productId`

**Ejemplo curl:**
```bash
PRODUCT_ID="770e8400-e29b-41d4-a716-446655440003"

curl http://localhost:3000/api/reactions/product/$PRODUCT_ID
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440005",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "productId": "770e8400-e29b-41d4-a716-446655440003",
    "type": "love",
    "createdAt": "2025-10-31T12:00:00.000Z",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Juan Pérez",
      "email": "cliente@example.com"
    }
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440006",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "productId": "770e8400-e29b-41d4-a716-446655440003",
    "type": "like",
    "createdAt": "2025-10-31T12:05:00.000Z",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "María García",
      "email": "maria@example.com"
    }
  }
]
```

---

### 16. Obtener Estadísticas de Reacciones

Obtiene el conteo de reacciones por tipo de un producto.

**Endpoint:** `GET /api/reactions/product/:productId/stats`

**Ejemplo curl:**
```bash
PRODUCT_ID="770e8400-e29b-41d4-a716-446655440003"

curl http://localhost:3000/api/reactions/product/$PRODUCT_ID/stats
```

**Respuesta exitosa (200 OK):**
```json
{
  "productId": "770e8400-e29b-41d4-a716-446655440003",
  "totalReactions": 15,
  "byType": {
    "like": 5,
    "love": 8,
    "dislike": 2
  }
}
```

---

### 17. Obtener Mis Reacciones

Obtiene todas las reacciones del usuario autenticado.

**Endpoint:** `GET /api/reactions/my`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"

curl http://localhost:3000/api/reactions/my \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440005",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "productId": "770e8400-e29b-41d4-a716-446655440003",
    "type": "love",
    "createdAt": "2025-10-31T12:00:00.000Z",
    "product": {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "name": "Pizza Margherita",
      "price": 12.99,
      "imageUrl": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca"
    }
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440007",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "productId": "770e8400-e29b-41d4-a716-446655440004",
    "type": "like",
    "createdAt": "2025-10-31T12:10:00.000Z",
    "product": {
      "id": "770e8400-e29b-41d4-a716-446655440004",
      "name": "Pizza Pepperoni",
      "price": 14.99,
      "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e"
    }
  }
]
```

---

### 18. Eliminar Reacción

Elimina la reacción del usuario a un producto específico.

**Endpoint:** `DELETE /api/reactions/product/:productId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Ejemplo curl:**
```bash
TOKEN="tu_access_token_aqui"
PRODUCT_ID="770e8400-e29b-41d4-a716-446655440003"

curl -X DELETE http://localhost:3000/api/reactions/product/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Reacción eliminada exitosamente"
}
```

**Error 404 - No existe reacción:**
```json
{
  "statusCode": 404,
  "message": "No existe una reacción tuya para este producto",
  "error": "Not Found"
}
```

---

## 📊 Códigos de Estado

| Código | Nombre | Descripción |
|--------|--------|-------------|
| **200** | OK | Petición exitosa |
| **201** | Created | Recurso creado exitosamente |
| **400** | Bad Request | Error de validación en los datos enviados |
| **401** | Unauthorized | Token no válido o ausente |
| **403** | Forbidden | Sin permisos para realizar la acción |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: email duplicado) |
| **500** | Internal Server Error | Error interno del servidor |

---

## ⚠️ Manejo de Errores

### Estructura General de Error

```json
{
  "statusCode": 400,
  "message": "Descripción del error" o ["Lista", "de", "errores"],
  "error": "Nombre del error"
}
```

### Errores de Validación (400)

```json
{
  "statusCode": 400,
  "message": [
    "El nombre es requerido",
    "El precio debe ser mayor a 0",
    "La imagen debe ser una URL válida"
  ],
  "error": "Bad Request"
}
```

### Error de Autenticación (401)

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Error de Autorización (403)

```json
{
  "statusCode": 403,
  "message": "No tienes permiso para realizar esta acción",
  "error": "Forbidden"
}
```

### Error de Recurso No Encontrado (404)

```json
{
  "statusCode": 404,
  "message": "Recurso no encontrado",
  "error": "Not Found"
}
```

### Error de Conflicto (409)

```json
{
  "statusCode": 409,
  "message": "El email ya está registrado",
  "error": "Conflict"
}
```

---

## 🔐 Autenticación

### Token JWT

Todos los endpoints protegidos requieren un token JWT en el header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Obtener Token

1. Registrarse o hacer login
2. Extraer el `access_token` de la respuesta
3. Incluirlo en el header `Authorization` de las siguientes peticiones

**Ejemplo:**
```bash
# 1. Login
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"empresa@seed.com","password":"Empresa123!"}')

# 2. Extraer token (requiere jq)
TOKEN=$(echo $RESPONSE | jq -r '.access_token')

# 3. Usar en peticiones
curl http://localhost:3000/api/businesses/my/businesses \
  -H "Authorization: Bearer $TOKEN"
```

### Duración del Token

El token JWT tiene una duración de **7 días** por defecto. Después de ese tiempo, será necesario hacer login nuevamente.

---

## 🎯 Flujo Completo de Ejemplo

```bash
# 1. Registrar usuario empresa
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "miempresa@example.com",
    "password": "Password123!",
    "name": "Mi Restaurante",
    "phone": "+1234567890",
    "type": "empresa"
  }' | jq '.'

# 2. Login y guardar token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "miempresa@example.com",
    "password": "Password123!"
  }' | jq -r '.access_token')

echo "Token: $TOKEN"

# 3. Crear negocio
BUSINESS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/businesses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Pizzería",
    "description": "Las mejores pizzas",
    "address": "Calle Principal 123",
    "whatsappNumber": "+1234567890",
    "openingHours": {
      "lunes": { "open": "12:00", "close": "23:00" }
    }
  }')

echo $BUSINESS_RESPONSE | jq '.'

# Extraer ID del negocio
BUSINESS_ID=$(echo $BUSINESS_RESPONSE | jq -r '.id')
echo "Business ID: $BUSINESS_ID"

# 4. Crear producto
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Pizza Especial\",
    \"description\": \"Nuestra pizza más vendida\",
    \"price\": 15.99,
    \"isAvailable\": true,
    \"businessId\": \"$BUSINESS_ID\"
  }")

echo $PRODUCT_RESPONSE | jq '.'

# Extraer ID del producto
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.id')
echo "Product ID: $PRODUCT_ID"

# 5. Registrar usuario cliente
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "Password123!",
    "name": "Cliente Test",
    "phone": "+9876543210",
    "type": "cliente"
  }' | jq '.'

# 6. Login como cliente
CLIENT_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "Password123!"
  }' | jq -r '.access_token')

echo "Client Token: $CLIENT_TOKEN"

# 7. Cliente reacciona al producto
curl -X POST http://localhost:3000/api/reactions \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"type\": \"love\"
  }" | jq '.'

# 8. Ver estadísticas de reacciones
curl http://localhost:3000/api/reactions/product/$PRODUCT_ID/stats | jq '.'

# 9. Listar todos los productos
curl http://localhost:3000/api/products | jq '.'
```

---

## 📚 Recursos Adicionales

- **Archivo de pruebas:** `test-api.http`
- **Script de seed:** `pnpm seed`
- **Documentación de validaciones:** `src/products/VALIDATIONS.md`
- **Documentación de seed:** `SEED_README.md`

---

## 💡 Tips y Mejores Prácticas

### 1. Usar Variables de Entorno

```bash
# Guardar en un archivo .env.local
export API_URL="http://localhost:3000/api"
export TOKEN="tu_token_aqui"

# Usar en los comandos
curl $API_URL/businesses -H "Authorization: Bearer $TOKEN"
```

### 2. Formatear Respuestas con jq

```bash
curl http://localhost:3000/api/products | jq '.'
```

### 3. Guardar Tokens Automáticamente

```bash
# Script para login automático
login() {
  TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$1\",\"password\":\"$2\"}" \
    | jq -r '.access_token')
  echo "Token guardado: ${TOKEN:0:20}..."
  export TOKEN
}

# Uso
login "empresa@seed.com" "Empresa123!"
```

### 4. Depuración

```bash
# Ver headers y status code
curl -i http://localhost:3000/api/businesses

# Ver verbose (incluye request completo)
curl -v http://localhost:3000/api/businesses

# Guardar respuesta en archivo
curl http://localhost:3000/api/products > products.json
```

---

**Última actualización:** 31 de octubre de 2025  
**Versión de la API:** 1.0.0  
**Base URL:** http://localhost:3000/api
