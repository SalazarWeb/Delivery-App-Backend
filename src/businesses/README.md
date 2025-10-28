# Módulo Businesses

## 📋 Descripción

Módulo para la gestión de negocios (empresas/restaurantes) en la aplicación de delivery.

---

## 🏢 Entidad Business

### Campos

- **id**: `string` (UUID) - Identificador único
- **ownerId**: `string` (UUID) - ID del propietario (usuario tipo empresa)
- **name**: `string` - Nombre del negocio
- **description**: `string` - Descripción del negocio (opcional)
- **address**: `string` - Dirección física
- **whatsappNumber**: `string` - Número de WhatsApp para contacto
- **openingHours**: `object` - Horarios de atención
- **createdAt**: `Date` - Fecha de creación (auto-generada)

### Estructura de openingHours

```typescript
{
  "lunes": { "open": "09:00", "close": "18:00" },
  "martes": { "open": "09:00", "close": "18:00" },
  "miércoles": { "open": "09:00", "close": "18:00", "closed": false },
  "jueves": { "open": "09:00", "close": "18:00" },
  "viernes": { "open": "09:00", "close": "22:00" },
  "sábado": { "open": "10:00", "close": "22:00" },
  "domingo": { "closed": true }
}
```

---

## 🚀 Endpoints

### 1. GET /businesses

Obtiene todos los negocios (público, no requiere autenticación).

**Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ownerId": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Restaurante El Buen Sabor",
    "description": "Los mejores platos de la ciudad",
    "address": "Av. Principal 123, Santiago",
    "whatsappNumber": "+56987654321",
    "openingHours": {
      "lunes": { "open": "09:00", "close": "18:00" }
    },
    "createdAt": "2025-10-28T00:00:00.000Z",
    "owner": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "email": "restaurant@example.com",
      "name": "Restaurante El Buen Sabor",
      "type": "empresa"
    }
  }
]
```

---

### 2. GET /businesses/:id

Obtiene un negocio específico por ID (público).

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "ownerId": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Restaurante El Buen Sabor",
  "description": "Los mejores platos de la ciudad",
  "address": "Av. Principal 123, Santiago",
  "whatsappNumber": "+56987654321",
  "openingHours": {
    "lunes": { "open": "09:00", "close": "18:00" }
  },
  "createdAt": "2025-10-28T00:00:00.000Z",
  "owner": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "email": "restaurant@example.com",
    "name": "Restaurante El Buen Sabor",
    "type": "empresa"
  }
}
```

**Errores:**
- `404 Not Found` - Negocio no encontrado

---

### 3. POST /businesses

Crea un nuevo negocio (requiere autenticación y ser usuario tipo "empresa").

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Restaurante El Buen Sabor",
  "description": "Los mejores platos de la ciudad",
  "address": "Av. Principal 123, Santiago",
  "whatsappNumber": "+56987654321",
  "openingHours": {
    "lunes": { "open": "09:00", "close": "18:00" },
    "martes": { "open": "09:00", "close": "18:00" },
    "miércoles": { "open": "09:00", "close": "18:00" },
    "jueves": { "open": "09:00", "close": "18:00" },
    "viernes": { "open": "09:00", "close": "22:00" },
    "sábado": { "open": "10:00", "close": "22:00" },
    "domingo": { "closed": true }
  }
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "ownerId": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Restaurante El Buen Sabor",
  "description": "Los mejores platos de la ciudad",
  "address": "Av. Principal 123, Santiago",
  "whatsappNumber": "+56987654321",
  "openingHours": {
    "lunes": { "open": "09:00", "close": "18:00" }
  },
  "createdAt": "2025-10-28T00:00:00.000Z"
}
```

**Errores:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Usuario no es de tipo "empresa"
- `400 Bad Request` - Datos inválidos

---

### 4. PUT /businesses/:id

Actualiza un negocio (requiere autenticación, ser empresa y ser el propietario).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (todos los campos opcionales):**
```json
{
  "name": "Restaurante Actualizado",
  "description": "Nueva descripción",
  "address": "Nueva dirección",
  "whatsappNumber": "+56999999999",
  "openingHours": {
    "lunes": { "open": "10:00", "close": "20:00" }
  }
}
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "ownerId": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Restaurante Actualizado",
  "description": "Nueva descripción",
  "address": "Nueva dirección",
  "whatsappNumber": "+56999999999",
  "openingHours": {
    "lunes": { "open": "10:00", "close": "20:00" }
  },
  "createdAt": "2025-10-28T00:00:00.000Z"
}
```

**Errores:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No eres el propietario o no eres empresa
- `404 Not Found` - Negocio no encontrado

---

### 5. DELETE /businesses/:id

Elimina un negocio (requiere autenticación, ser empresa y ser el propietario).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204 No Content)**

**Errores:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No eres el propietario o no eres empresa
- `404 Not Found` - Negocio no encontrado

---

### 6. GET /businesses/owner/me

Obtiene los negocios del usuario autenticado (requiere autenticación y ser empresa).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Mi Restaurante",
    "description": "Descripción",
    "address": "Dirección",
    "whatsappNumber": "+56987654321",
    "openingHours": {},
    "createdAt": "2025-10-28T00:00:00.000Z"
  }
]
```

---

## 🔐 Seguridad

### Guards Utilizados

1. **JwtAuthGuard**: Verifica que el usuario esté autenticado
2. **BusinessOwnerGuard**: Verifica que el usuario sea de tipo "empresa"

### Rutas Públicas

- `GET /businesses` - Lista todos los negocios
- `GET /businesses/:id` - Obtiene un negocio específico

### Rutas Protegidas (requieren autenticación + ser empresa)

- `POST /businesses` - Crear negocio
- `PUT /businesses/:id` - Actualizar negocio (solo propietario)
- `DELETE /businesses/:id` - Eliminar negocio (solo propietario)
- `GET /businesses/owner/me` - Mis negocios

---

## 📝 Ejemplos con cURL

### Listar todos los negocios (público)

```bash
curl http://localhost:3000/businesses
```

### Obtener un negocio específico (público)

```bash
curl http://localhost:3000/businesses/550e8400-e29b-41d4-a716-446655440000
```

### Crear un negocio (requiere token de empresa)

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/businesses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurante El Buen Sabor",
    "description": "Los mejores platos de la ciudad",
    "address": "Av. Principal 123, Santiago",
    "whatsappNumber": "+56987654321",
    "openingHours": {
      "lunes": { "open": "09:00", "close": "18:00" },
      "martes": { "open": "09:00", "close": "18:00" },
      "miércoles": { "open": "09:00", "close": "18:00" },
      "jueves": { "open": "09:00", "close": "18:00" },
      "viernes": { "open": "09:00", "close": "22:00" },
      "sábado": { "open": "10:00", "close": "22:00" },
      "domingo": { "closed": true }
    }
  }'
```

### Actualizar un negocio

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PUT http://localhost:3000/businesses/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Nombre",
    "description": "Nueva descripción"
  }'
```

### Eliminar un negocio

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X DELETE http://localhost:3000/businesses/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

### Obtener mis negocios

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:3000/businesses/owner/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Testing

```bash
# Ejecutar tests del módulo
pnpm test businesses

# Tests con coverage
pnpm test:cov businesses
```

---

## 💡 Notas Importantes

1. **Solo usuarios tipo "empresa"** pueden crear, actualizar o eliminar negocios
2. **Solo el propietario** puede actualizar o eliminar su negocio
3. Los endpoints GET son **públicos** y no requieren autenticación
4. El campo `openingHours` es **opcional** y flexible
5. La relación con el `owner` se carga automáticamente en las consultas

---

**Generado automáticamente - 28 de octubre de 2025**
