# Módulo de Productos

Este módulo gestiona los productos de cada negocio en la plataforma de delivery.

## Estructura del Módulo

```
src/products/
├── dto/
│   ├── create-product.dto.ts    # DTO para crear productos
│   └── update-product.dto.ts    # DTO para actualizar productos
├── products.controller.ts       # Controlador REST
├── products.service.ts          # Lógica de negocio
├── products.service.spec.ts     # Tests unitarios
├── products.module.ts           # Módulo NestJS
└── index.ts                     # Barrel exports
```

## Entidad Product

Ubicación: `src/entities/product.entity.ts`

```typescript
{
  id: string;              // UUID
  businessId: string;      // Relación con Business
  name: string;            // Nombre del producto
  description: string;     // Descripción (opcional)
  weightGrams: number;     // Peso en gramos (opcional)
  quantityUnits: number;   // Cantidad en unidades (opcional)
  price: number;           // Precio decimal(10,2)
  imageUrl: string;        // URL de imagen (opcional)
  isAvailable: boolean;    // Disponibilidad (default: true)
  createdAt: Date;         // Fecha de creación
}
```

## Endpoints

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| GET | `/products` | No | Lista todos los productos (filtrable por businessId) |
| GET | `/products/:id` | No | Obtiene un producto por ID |
| POST | `/products?businessId=...` | JWT + Empresa | Crea un producto |
| PUT | `/products/:id` | JWT + Empresa | Actualiza un producto |
| DELETE | `/products/:id` | JWT + Empresa | Elimina un producto |

## Uso

### Crear un producto

```bash
curl -X POST "http://localhost:3000/products?businessId=<BUSINESS_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margarita",
    "description": "Pizza clásica",
    "weightGrams": 500,
    "price": 8990,
    "isAvailable": true
  }'
```

### Listar productos de un negocio

```bash
curl http://localhost:3000/products?businessId=<BUSINESS_ID>
```

### Actualizar producto

```bash
curl -X PUT http://localhost:3000/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 9990,
    "isAvailable": false
  }'
```

### Eliminar producto

```bash
curl -X DELETE http://localhost:3000/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

## Seguridad

- **Endpoints públicos**: GET (listado y detalle)
- **Endpoints protegidos**: POST, PUT, DELETE
  - Requieren autenticación JWT
  - Solo usuarios tipo "empresa"
  - Verificación de propiedad del negocio

## Tests

```bash
# Ejecutar tests unitarios
npm test -- products.service.spec

# Script de prueba end-to-end
./test-products.sh
```

## Validaciones

### CreateProductDto
- `name`: Requerido, máx 255 caracteres
- `description`: Opcional
- `weightGrams`: Opcional, mínimo 1
- `quantityUnits`: Opcional, mínimo 1
- `price`: Requerido, debe ser positivo
- `imageUrl`: Opcional, URL válida, máx 500 caracteres
- `isAvailable`: Opcional, boolean

### UpdateProductDto
Todos los campos son opcionales (PartialType de CreateProductDto)

## Dependencias

- `BusinessesModule`: Para verificar propiedad del negocio
- `AuthModule`: Para autenticación JWT
- `TypeOrmModule`: Para persistencia

## Notas

- Los productos se eliminan automáticamente si se elimina el negocio (CASCADE)
- Solo el dueño del negocio puede crear/modificar/eliminar sus productos
- Los campos `weightGrams` y `quantityUnits` son opcionales para flexibilidad
- Precios en formato decimal (10,2) para moneda chilena (CLP)

## Documentación Completa

Ver [PRODUCTS_MODULE.md](../../PRODUCTS_MODULE.md) para documentación detallada con ejemplos completos.
