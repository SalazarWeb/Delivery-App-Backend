# Módulo de Reacciones

Este módulo gestiona las reacciones de los usuarios a los productos (like, love, dislike).

## Estructura del Módulo

```
src/reactions/
├── dto/
│   └── create-reaction.dto.ts     # DTO para crear reacciones
├── reactions.controller.ts        # Controlador REST
├── reactions.service.ts           # Lógica de negocio
├── reactions.service.spec.ts      # Tests unitarios
├── reactions.module.ts            # Módulo NestJS
└── index.ts                       # Barrel exports
```

## Entidad Reaction

Ubicación: `src/entities/reaction.entity.ts`

```typescript
{
  id: string;              // UUID
  userId: string;          // Relación con User
  productId: string;       // Relación con Product
  type: ReactionType;      // 'like' | 'love' | 'dislike'
  createdAt: Date;         // Fecha de creación
}

// Constraint UNIQUE (userId, productId)
// Un usuario solo puede tener una reacción por producto
```

### Tipos de Reacción

```typescript
enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  DISLIKE = 'dislike',
}
```

## Endpoints

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| POST | `/reactions` | JWT | Crea o actualiza una reacción |
| GET | `/reactions?productId=...` | No | Lista reacciones de un producto |
| GET | `/reactions/my-reactions` | JWT | Lista reacciones del usuario |
| GET | `/reactions/stats?productId=...` | No | Estadísticas de reacciones |
| DELETE | `/reactions?productId=...` | JWT | Elimina una reacción |

## Uso

### Crear/Actualizar Reacción

```bash
curl -X POST http://localhost:3000/reactions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<PRODUCT_ID>",
    "type": "like"
  }'
```

Si el usuario ya tiene una reacción en ese producto, se actualiza el tipo.

### Listar Reacciones de un Producto

```bash
curl http://localhost:3000/reactions?productId=<PRODUCT_ID>
```

### Ver Mis Reacciones

```bash
curl http://localhost:3000/reactions/my-reactions \
  -H "Authorization: Bearer <TOKEN>"
```

### Obtener Estadísticas

```bash
curl http://localhost:3000/reactions/stats?productId=<PRODUCT_ID>
```

Retorna:
```json
{
  "total": 10,
  "likes": 5,
  "loves": 3,
  "dislikes": 2
}
```

### Eliminar Reacción

```bash
curl -X DELETE "http://localhost:3000/reactions?productId=<PRODUCT_ID>" \
  -H "Authorization: Bearer <TOKEN>"
```

## Características Especiales

### Constraint UNIQUE

- La entidad tiene un constraint `UNIQUE(userId, productId)`
- Un usuario solo puede tener **una reacción por producto**
- Si intenta crear otra, el servicio la **actualiza** automáticamente

### Comportamiento de CREATE

```typescript
// Primera vez: Crea la reacción
POST /reactions { productId: "X", type: "like" }
→ Nueva reacción creada

// Segunda vez: Actualiza la reacción
POST /reactions { productId: "X", type: "love" }
→ Reacción actualizada de "like" a "love"
```

## Seguridad

- **Endpoints públicos**: GET (listado y stats)
- **Endpoints protegidos**: POST, DELETE
  - Requieren autenticación JWT
  - El userId se toma del token (no del body)

## Validaciones

### CreateReactionDto
- `productId`: UUID válido, requerido
- `type`: Enum (like, love, dislike), requerido

## Relaciones

- **ManyToOne** con User (onDelete: CASCADE)
- **ManyToOne** con Product (onDelete: CASCADE)

Si se elimina un usuario o producto, se eliminan sus reacciones.

## Tests

```bash
# Ejecutar tests unitarios
npm test -- reactions.service.spec
```

## Notas

- Las reacciones son por usuario y producto
- Útil para sistemas de "me gusta" o calificación
- Las estadísticas son públicas para mostrar popularidad
- Se puede extender con más tipos de reacción

## Documentación Completa

Ver [REACTIONS_MODULE.md](../../REACTIONS_MODULE.md) para documentación detallada.
