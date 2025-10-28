# Módulo de Reacciones - Delivery App

## 📋 Descripción

Módulo completo de gestión de reacciones de usuarios a productos. Permite a los usuarios expresar su opinión sobre productos mediante reacciones (like, love, dislike).

## 🗃️ Entidad Reaction

```typescript
{
  id: string;              // UUID generado automáticamente
  userId: string;          // ID del usuario que reacciona
  productId: string;       // ID del producto
  type: ReactionType;      // Tipo de reacción: 'like' | 'love' | 'dislike'
  createdAt: Date;         // Fecha de creación (automática)
}

// Constraint UNIQUE
@Unique(['userId', 'productId'])
// Un usuario solo puede tener UNA reacción por producto
```

### Enum ReactionType

```typescript
export enum ReactionType {
  LIKE = 'like',       // Me gusta
  LOVE = 'love',       // Me encanta
  DISLIKE = 'dislike', // No me gusta
}
```

### Relaciones
- **ManyToOne** con `User`: Una reacción pertenece a un usuario
- **ManyToOne** con `Product`: Una reacción pertenece a un producto
- **onDelete: CASCADE**: Si se elimina el usuario o producto, se eliminan sus reacciones

---

## 🔐 Endpoints

### 1. **POST /reactions**
Crea o actualiza una reacción del usuario autenticado.

**Autenticación:** JWT requerida

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "productId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "like"
}
```

**Validaciones:**
- `productId`: UUID válido, requerido
- `type`: Debe ser 'like', 'love' o 'dislike'

**Comportamiento:**
- Si el usuario **NO tiene** reacción en ese producto → **Crea nueva**
- Si el usuario **YA tiene** reacción en ese producto → **Actualiza el tipo**

**Ejemplo:**
```bash
# Primera reacción
curl -X POST http://localhost:3000/reactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "like"
  }'
```

**Respuesta exitosa (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-uuid",
  "productId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "like",
  "createdAt": "2025-10-28T12:00:00Z"
}
```

**Cambiar reacción (actualizar):**
```bash
# Cambiar de "like" a "love"
curl -X POST http://localhost:3000/reactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "love"
  }'
```

**Respuesta (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-uuid",
  "productId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "love",
  "createdAt": "2025-10-28T12:00:00Z"
}
```

**Errores:**
- `401 Unauthorized`: No autenticado
- `400 Bad Request`: Datos de validación incorrectos
- `409 Conflict`: Error de constraint (raro, manejado internamente)

---

### 2. **GET /reactions?productId=...**
Lista todas las reacciones de un producto específico.

**Autenticación:** No requerida (público)

**Query Parameters:**
- `productId` (requerido): UUID del producto

**Ejemplo:**
```bash
curl http://localhost:3000/reactions?productId=550e8400-e29b-41d4-a716-446655440000
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-uuid-1",
    "productId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "like",
    "createdAt": "2025-10-28T12:00:00Z",
    "user": {
      "id": "user-uuid-1",
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  },
  {
    "id": "789e4567-e89b-12d3-a456-426614174001",
    "userId": "user-uuid-2",
    "productId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "love",
    "createdAt": "2025-10-28T11:30:00Z",
    "user": {
      "id": "user-uuid-2",
      "name": "María García",
      "email": "maria@example.com"
    }
  }
]
```

**Si no hay productId:**
```bash
curl http://localhost:3000/reactions
# Retorna: []
```

---

### 3. **GET /reactions/my-reactions**
Lista todas las reacciones del usuario autenticado.

**Autenticación:** JWT requerida

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Ejemplo:**
```bash
curl http://localhost:3000/reactions/my-reactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-uuid",
    "productId": "product-uuid-1",
    "type": "like",
    "createdAt": "2025-10-28T12:00:00Z",
    "product": {
      "id": "product-uuid-1",
      "name": "Pizza Margarita",
      "price": 8990
    }
  },
  {
    "id": "456e4567-e89b-12d3-a456-426614174002",
    "userId": "user-uuid",
    "productId": "product-uuid-2",
    "type": "love",
    "createdAt": "2025-10-28T11:00:00Z",
    "product": {
      "id": "product-uuid-2",
      "name": "Hamburguesa Clásica",
      "price": 6990
    }
  }
]
```

**Errores:**
- `401 Unauthorized`: No autenticado

---

### 4. **GET /reactions/stats?productId=...**
Obtiene estadísticas de reacciones de un producto.

**Autenticación:** No requerida (público)

**Query Parameters:**
- `productId` (requerido): UUID del producto

**Ejemplo:**
```bash
curl http://localhost:3000/reactions/stats?productId=550e8400-e29b-41d4-a716-446655440000
```

**Respuesta exitosa (200):**
```json
{
  "total": 10,
  "likes": 5,
  "loves": 3,
  "dislikes": 2
}
```

**Uso típico:**
Mostrar en la UI del producto:
- ❤️ 3 loves
- 👍 5 likes
- 👎 2 dislikes

---

### 5. **DELETE /reactions?productId=...**
Elimina la reacción del usuario autenticado en un producto.

**Autenticación:** JWT requerida

**Query Parameters:**
- `productId` (requerido): UUID del producto

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Ejemplo:**
```bash
curl -X DELETE "http://localhost:3000/reactions?productId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta exitosa (200):** (sin contenido o confirmación)

**Errores:**
- `401 Unauthorized`: No autenticado
- `404 Not Found`: Reacción no encontrada

---

## 🔒 Seguridad

### Guards Aplicados

1. **JwtAuthGuard**: Valida el token JWT (POST, DELETE, GET /my-reactions)
2. **Sin guards**: Endpoints públicos (GET /reactions, GET /stats)

### Protección de Datos

- El `userId` se extrae del token JWT (no del body)
- Un usuario solo puede eliminar sus propias reacciones
- Un usuario no puede crear reacciones en nombre de otros

---

## 🎯 Casos de Uso

### Como Usuario

1. **Dar "like" a un producto**
```bash
POST /reactions
{ "productId": "X", "type": "like" }
```

2. **Cambiar a "love"**
```bash
POST /reactions
{ "productId": "X", "type": "love" }
# Actualiza automáticamente
```

3. **Ver mis reacciones**
```bash
GET /reactions/my-reactions
```

4. **Quitar mi reacción**
```bash
DELETE /reactions?productId=X
```

### Como Visitante (no autenticado)

1. **Ver reacciones de un producto**
```bash
GET /reactions?productId=X
```

2. **Ver estadísticas**
```bash
GET /reactions/stats?productId=X
```

---

## 🔄 Comportamiento del Constraint UNIQUE

### Base de Datos

```sql
CREATE UNIQUE INDEX "IDX_userId_productId" 
ON "reactions" ("userId", "productId");
```

### Lógica del Servicio

```typescript
// 1. Busca si existe reacción
const existing = await find({ userId, productId });

if (existing) {
  // 2. SI EXISTE → Actualiza el tipo
  existing.type = newType;
  return save(existing);
} else {
  // 3. NO EXISTE → Crea nueva
  return save(create({ userId, productId, type }));
}
```

**Resultado:**
- ✅ Un usuario solo tiene **una reacción activa** por producto
- ✅ Puede **cambiar** el tipo de reacción
- ✅ El constraint previene duplicados en caso de race conditions

---

## 🧪 Testing

El módulo incluye suite completa de tests unitarios (`reactions.service.spec.ts`):

```bash
# Ejecutar tests
npm test -- reactions.service.spec

# Con cobertura
npm test -- --coverage reactions.service.spec
```

**Tests incluidos:**
- ✅ Crear nueva reacción
- ✅ Actualizar reacción existente
- ✅ Manejo de constraint UNIQUE (ConflictException)
- ✅ Listar por producto
- ✅ Listar por usuario
- ✅ Buscar reacción específica
- ✅ Eliminar reacción
- ✅ NotFoundException al eliminar inexistente
- ✅ Estadísticas de reacciones
- ✅ Estadísticas con cero reacciones

---

## 📦 Dependencias

- `@nestjs/common`: Decoradores y excepciones
- `@nestjs/typeorm`: Integración con TypeORM
- `typeorm`: ORM para PostgreSQL
- `class-validator`: Validación de DTOs
- `class-transformer`: Transformación de datos

---

## 🚀 Flujo Completo

### 1. Usuario da "like" por primera vez

```
Cliente autenticado
  → POST /reactions { productId: "X", type: "like" }
  → JwtAuthGuard extrae userId del token
  → Service busca reacción existente → NO EXISTE
  → Service crea nueva reacción
  → Retorna reacción creada ✅
```

### 2. Usuario cambia a "love"

```
Cliente autenticado
  → POST /reactions { productId: "X", type: "love" }
  → JwtAuthGuard extrae userId del token
  → Service busca reacción existente → EXISTE
  → Service actualiza type a "love"
  → Retorna reacción actualizada ✅
```

### 3. Visitante ve estadísticas

```
Visitante (sin auth)
  → GET /reactions/stats?productId=X
  → Service cuenta reacciones
  → Retorna { total: 10, likes: 5, loves: 3, dislikes: 2 } ✅
```

---

## 📊 Modelo de Base de Datos

```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "productId" UUID NOT NULL,
  type VARCHAR CHECK (type IN ('like', 'love', 'dislike')),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE,
  
  UNIQUE ("userId", "productId")
);

-- Índice automático por UNIQUE constraint
-- Un usuario solo puede tener una reacción por producto
```

---

## 📝 Notas Importantes

1. **Constraint UNIQUE**: Se aplica a nivel de base de datos mediante decorador `@Unique(['userId', 'productId'])`
2. **Actualización Automática**: Si el usuario reacciona dos veces, se actualiza el tipo en lugar de crear duplicado
3. **Cascade Delete**: Si se elimina un usuario o producto, se eliminan automáticamente sus reacciones
4. **Estadísticas Públicas**: Cualquiera puede ver las stats para mostrar popularidad
5. **userId del Token**: El userId siempre se toma del JWT, no del body (seguridad)

---

## 🔄 Próximas Mejoras Sugeridas

- [ ] Notificaciones al dueño del producto cuando recibe reacciones
- [ ] Filtrar productos por más reaccionados
- [ ] Timeline de reacciones del usuario
- [ ] Exportar reacciones a CSV (para empresas)
- [ ] Reacciones anónimas (opcional)
- [ ] Más tipos de reacción (emoji personalizados)
- [ ] Rate limiting para prevenir spam

---

## 📚 Documentación Relacionada

- [AUTH_MODULE_COMPLETE.md](./AUTH_MODULE_COMPLETE.md) - Autenticación JWT
- [PRODUCTS_MODULE_COMPLETE.md](./PRODUCTS_MODULE_COMPLETE.md) - Gestión de productos
- [USERS_MODULE_SUMMARY.md](./USERS_MODULE_SUMMARY.md) - Gestión de usuarios

---

**Fecha de creación**: 28 de octubre de 2025
**Versión**: 1.0.0
**Estado**: ✅ Completado
