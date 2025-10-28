# Módulo de Productos - Delivery App

## 📋 Descripción

Módulo completo de gestión de productos para negocios en la aplicación de delivery. Permite crear, listar, actualizar y eliminar productos asociados a un negocio específico.

## 🗃️ Entidad Product

```typescript
{
  id: string;              // UUID generado automáticamente
  businessId: string;      // ID del negocio al que pertenece
  name: string;            // Nombre del producto (máx 255 caracteres)
  description: string;     // Descripción detallada (opcional)
  weightGrams: number;     // Peso en gramos (opcional)
  quantityUnits: number;   // Cantidad en unidades (opcional)
  price: number;           // Precio (decimal 10,2)
  imageUrl: string;        // URL de la imagen (opcional, máx 500 caracteres)
  isAvailable: boolean;    // Disponibilidad (default: true)
  createdAt: Date;         // Fecha de creación (automática)
}
```

### Relaciones
- **ManyToOne** con `Business`: Un producto pertenece a un negocio
- **onDelete: CASCADE**: Si se elimina el negocio, se eliminan sus productos

## 🔐 Endpoints

### 1. **GET /products**
Lista todos los productos, opcionalmente filtrados por negocio.

**Autenticación:** No requerida (público)

**Query Parameters:**
- `businessId` (opcional): UUID del negocio

**Ejemplo sin filtro:**
```bash
curl http://localhost:3000/products
```

**Ejemplo con filtro:**
```bash
curl http://localhost:3000/products?businessId=550e8400-e29b-41d4-a716-446655440000
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "businessId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Pizza Margarita",
    "description": "Pizza clásica con tomate y queso",
    "weightGrams": 500,
    "quantityUnits": 1,
    "price": 8990,
    "imageUrl": "https://example.com/pizza.jpg",
    "isAvailable": true,
    "createdAt": "2025-10-28T10:30:00Z",
    "business": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Pizzería Roma"
    }
  }
]
```

---

### 2. **GET /products/:id**
Obtiene un producto específico por su ID.

**Autenticación:** No requerida (público)

**Ejemplo:**
```bash
curl http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta exitosa (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "businessId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Pizza Margarita",
  "description": "Pizza clásica con tomate y queso",
  "weightGrams": 500,
  "quantityUnits": 1,
  "price": 8990,
  "imageUrl": "https://example.com/pizza.jpg",
  "isAvailable": true,
  "createdAt": "2025-10-28T10:30:00Z",
  "business": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Pizzería Roma",
    "ownerId": "..."
  }
}
```

**Errores:**
- `404 Not Found`: Producto no encontrado

---

### 3. **POST /products**
Crea un nuevo producto.

**Autenticación:** JWT + BusinessOwnerGuard (solo tipo "empresa")

**Query Parameters:**
- `businessId` (requerido): UUID del negocio

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Hamburguesa Clásica",
  "description": "Hamburguesa con carne, lechuga, tomate y queso",
  "weightGrams": 350,
  "quantityUnits": 1,
  "price": 5990,
  "imageUrl": "https://example.com/burger.jpg",
  "isAvailable": true
}
```

**Validaciones:**
- `name`: String, requerido, máximo 255 caracteres
- `description`: String, opcional
- `weightGrams`: Número, opcional, mínimo 1
- `quantityUnits`: Número, opcional, mínimo 1
- `price`: Número, requerido, debe ser positivo
- `imageUrl`: URL válida, opcional, máximo 500 caracteres
- `isAvailable`: Boolean, opcional (default: true)

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/products?businessId=550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hamburguesa Clásica",
    "description": "Hamburguesa con carne, lechuga, tomate y queso",
    "weightGrams": 350,
    "price": 5990,
    "isAvailable": true
  }'
```

**Respuesta exitosa (201):**
```json
{
  "id": "789e4567-e89b-12d3-a456-426614174999",
  "businessId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Hamburguesa Clásica",
  "description": "Hamburguesa con carne, lechuga, tomate y queso",
  "weightGrams": 350,
  "quantityUnits": null,
  "price": 5990,
  "imageUrl": null,
  "isAvailable": true,
  "createdAt": "2025-10-28T11:00:00Z"
}
```

**Errores:**
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Usuario no es tipo "empresa" o no es dueño del negocio
- `400 Bad Request`: Datos de validación incorrectos
- `404 Not Found`: Negocio no encontrado

---

### 4. **PUT /products/:id**
Actualiza un producto existente.

**Autenticación:** JWT + BusinessOwnerGuard (solo tipo "empresa" y dueño del negocio)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:** (todos los campos son opcionales)
```json
{
  "name": "Pizza Margarita Especial",
  "price": 9990,
  "isAvailable": false
}
```

**Ejemplo:**
```bash
curl -X PUT http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margarita Especial",
    "price": 9990
  }'
```

**Respuesta exitosa (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "businessId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Pizza Margarita Especial",
  "description": "Pizza clásica con tomate y queso",
  "weightGrams": 500,
  "price": 9990,
  "isAvailable": true,
  "createdAt": "2025-10-28T10:30:00Z"
}
```

**Errores:**
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Usuario no es tipo "empresa" o no es dueño del negocio
- `404 Not Found`: Producto no encontrado
- `400 Bad Request`: Datos de validación incorrectos

---

### 5. **DELETE /products/:id**
Elimina un producto.

**Autenticación:** JWT + BusinessOwnerGuard (solo tipo "empresa" y dueño del negocio)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Ejemplo:**
```bash
curl -X DELETE http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta exitosa (200):** (sin contenido o confirmación)

**Errores:**
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Usuario no es tipo "empresa" o no es dueño del negocio
- `404 Not Found`: Producto no encontrado

---

## 🔒 Seguridad

### Guards Aplicados

1. **JwtAuthGuard**: Valida el token JWT (POST, PUT, DELETE)
2. **BusinessOwnerGuard**: Verifica que el usuario sea tipo "empresa" (POST, PUT, DELETE)
3. **Verificación de Propiedad**: El servicio valida que el usuario sea dueño del negocio al que pertenece el producto

### Flujo de Autorización

```
POST /products
  → JwtAuthGuard (valida token)
  → BusinessOwnerGuard (verifica user.type === 'empresa')
  → ProductsService.create() (verifica business.ownerId === user.id)

PUT /products/:id
  → JwtAuthGuard
  → BusinessOwnerGuard
  → ProductsService.update() (verifica business.ownerId === user.id)

DELETE /products/:id
  → JwtAuthGuard
  → BusinessOwnerGuard
  → ProductsService.remove() (verifica business.ownerId === user.id)
```

---

## 🧪 Testing

El módulo incluye suite completa de tests unitarios (`products.service.spec.ts`):

```bash
# Ejecutar tests del módulo
npm test -- products.service.spec

# Con cobertura
npm test -- --coverage products.service.spec
```

**Tests incluidos:**
- ✅ Creación de productos
- ✅ Listado completo y filtrado por negocio
- ✅ Búsqueda por ID
- ✅ Actualización de productos
- ✅ Eliminación de productos
- ✅ Verificación de permisos (ForbiddenException)
- ✅ Manejo de productos no encontrados (NotFoundException)

---

## 📦 Dependencias

- `@nestjs/common`: Decoradores y excepciones
- `@nestjs/typeorm`: Integración con TypeORM
- `typeorm`: ORM para PostgreSQL
- `class-validator`: Validación de DTOs
- `class-transformer`: Transformación de datos
- `@nestjs/mapped-types`: PartialType para UpdateDto

---

## 🚀 Uso Típico

### 1. Crear productos para un negocio
```bash
# 1. Autenticarse como empresa
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"restaurant@example.com","password":"password123"}' \
  | jq -r '.access_token')

# 2. Crear producto
curl -X POST "http://localhost:3000/products?businessId=<BUSINESS_ID>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Napolitana",
    "description": "Pizza con albahaca fresca",
    "weightGrams": 550,
    "price": 10990,
    "imageUrl": "https://example.com/napolitana.jpg"
  }'
```

### 2. Listar productos de un negocio
```bash
# Público - sin autenticación
curl http://localhost:3000/products?businessId=<BUSINESS_ID>
```

### 3. Actualizar disponibilidad
```bash
# Marcar como no disponible
curl -X PUT http://localhost:3000/products/<PRODUCT_ID> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isAvailable": false}'
```

---

## 📝 Notas Importantes

1. **Relación Cascada**: Si se elimina un negocio, todos sus productos se eliminan automáticamente
2. **Validación de Propiedad**: Solo el dueño del negocio puede crear/modificar/eliminar productos
3. **Campos Opcionales**: `weightGrams` y `quantityUnits` son opcionales, útil para productos vendidos por peso o por unidad
4. **Imágenes**: `imageUrl` acepta URLs externas, se recomienda usar servicios de almacenamiento como S3
5. **Precios**: Se almacenan como decimal (10,2), ideal para moneda chilena (CLP)

---

## 🔄 Próximas Mejoras Sugeridas

- [ ] Categorías de productos
- [ ] Imágenes múltiples
- [ ] Variantes de productos (tamaños, extras)
- [ ] Stock management
- [ ] Productos destacados/promociones
- [ ] Búsqueda y filtrado avanzado
- [ ] Paginación en listados
- [ ] Ordenamiento personalizado

---

## 📚 Documentación Relacionada

- [AUTH_MODULE_COMPLETE.md](../AUTH_MODULE_COMPLETE.md) - Autenticación JWT
- [BUSINESSES_MODULE_COMPLETE.md](../BUSINESSES_MODULE_COMPLETE.md) - Gestión de negocios
- [TYPEORM_SETUP.md](../TYPEORM_SETUP.md) - Configuración de base de datos
