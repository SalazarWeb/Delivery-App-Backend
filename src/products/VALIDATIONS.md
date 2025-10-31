# Validaciones de Productos

## 📋 Resumen de Validaciones

Todas las validaciones están implementadas con `class-validator` en los DTOs y generan mensajes de error en español.

---

## CreateProductDto

### ✅ Campos Requeridos

#### `name` (Nombre del Producto)
- **Tipo:** string
- **Requerido:** ✅ Sí
- **Validaciones:**
  - No puede estar vacío
  - Mínimo 3 caracteres
  - Máximo 255 caracteres
  - Debe ser una cadena de texto

**Ejemplos:**
```json
// ✅ VÁLIDO
{ "name": "Pizza Margherita" }

// ❌ INVÁLIDO - vacío
{ "name": "" }
// Error: "El nombre es requerido"

// ❌ INVÁLIDO - muy corto
{ "name": "Pi" }
// Error: "El nombre debe tener al menos 3 caracteres"

// ❌ INVÁLIDO - muy largo (>255 caracteres)
{ "name": "Pizza con..." }
// Error: "El nombre no puede exceder los 255 caracteres"
```

#### `price` (Precio)
- **Tipo:** number
- **Requerido:** ✅ Sí
- **Validaciones:**
  - No puede estar vacío
  - Debe ser un número
  - Debe ser mayor a 0
  - Mínimo 0.01

**Ejemplos:**
```json
// ✅ VÁLIDO
{ "price": 12.99 }
{ "price": 0.50 }
{ "price": 100 }

// ❌ INVÁLIDO - vacío
{ "price": null }
// Error: "El precio es requerido"

// ❌ INVÁLIDO - cero o negativo
{ "price": 0 }
// Error: "El precio debe ser mayor a 0"

{ "price": -5 }
// Error: "El precio debe ser mayor a 0"

// ❌ INVÁLIDO - no es número
{ "price": "12.99" }
// Error: "El precio debe ser un número"
```

---

### 🔧 Campos Opcionales

#### `description` (Descripción)
- **Tipo:** string
- **Requerido:** ❌ No
- **Validaciones:**
  - Máximo 1000 caracteres
  - Debe ser una cadena de texto (si se proporciona)

**Ejemplos:**
```json
// ✅ VÁLIDO - con descripción
{
  "name": "Pizza Pepperoni",
  "price": 14.99,
  "description": "Pizza clásica con abundante pepperoni y queso mozzarella"
}

// ✅ VÁLIDO - sin descripción
{
  "name": "Pizza Pepperoni",
  "price": 14.99
}

// ❌ INVÁLIDO - muy largo (>1000 caracteres)
{
  "description": "Una descripción extremadamente larga..."
}
// Error: "La descripción no puede exceder los 1000 caracteres"
```

#### `weightGrams` (Peso en gramos)
- **Tipo:** number
- **Requerido:** ❌ No
- **Validaciones:**
  - Mínimo 1 gramo
  - Debe ser un número (si se proporciona)

**Ejemplos:**
```json
// ✅ VÁLIDO
{ "weightGrams": 500 }
{ "weightGrams": 1 }

// ✅ VÁLIDO - sin peso
{ "name": "Pizza", "price": 10 }

// ❌ INVÁLIDO - menor a 1
{ "weightGrams": 0 }
// Error: "El peso debe ser al menos 1 gramo"

{ "weightGrams": -100 }
// Error: "El peso debe ser al menos 1 gramo"
```

#### `quantityUnits` (Cantidad en unidades)
- **Tipo:** number
- **Requerido:** ❌ No
- **Validaciones:**
  - Mínimo 1 unidad
  - Debe ser un número (si se proporciona)

**Ejemplos:**
```json
// ✅ VÁLIDO
{ "quantityUnits": 10 }
{ "quantityUnits": 1 }

// ✅ VÁLIDO - sin cantidad
{ "name": "Producto", "price": 5 }

// ❌ INVÁLIDO - menor a 1
{ "quantityUnits": 0 }
// Error: "La cantidad mínima es 1 unidad"
```

#### `imageUrl` (URL de la imagen)
- **Tipo:** string (URL válida)
- **Requerido:** ❌ No
- **Validaciones:**
  - Debe ser una URL válida (http:// o https://)
  - Máximo 500 caracteres

**Ejemplos:**
```json
// ✅ VÁLIDO
{ "imageUrl": "https://example.com/pizza.jpg" }
{ "imageUrl": "http://cdn.restaurant.com/images/producto123.png" }

// ✅ VÁLIDO - sin imagen
{ "name": "Pizza", "price": 10 }

// ❌ INVÁLIDO - no es URL
{ "imageUrl": "imagen.jpg" }
// Error: "La imagen debe ser una URL válida"

{ "imageUrl": "www.example.com/image.jpg" }
// Error: "La imagen debe ser una URL válida"

// ❌ INVÁLIDO - muy largo (>500 caracteres)
{ "imageUrl": "https://example.com/very/long/path/..." }
// Error: "La URL de la imagen no puede exceder los 500 caracteres"
```

#### `isAvailable` (Disponibilidad)
- **Tipo:** boolean
- **Requerido:** ❌ No
- **Default:** true (en la entidad)
- **Validaciones:**
  - Debe ser true o false (si se proporciona)

**Ejemplos:**
```json
// ✅ VÁLIDO
{ "isAvailable": true }
{ "isAvailable": false }

// ✅ VÁLIDO - sin especificar (usará default: true)
{ "name": "Pizza", "price": 10 }

// ❌ INVÁLIDO - no es booleano
{ "isAvailable": "yes" }
// Error: "El campo disponible debe ser verdadero o falso"

{ "isAvailable": 1 }
// Error: "El campo disponible debe ser verdadero o falso"
```

---

## UpdateProductDto

`UpdateProductDto` extiende de `CreateProductDto` usando `PartialType`, lo que significa:
- **Todos los campos son opcionales**
- Mantiene las mismas validaciones cuando se proporcionan
- Puedes actualizar solo los campos que necesites

**Ejemplos:**
```json
// ✅ Actualizar solo el precio
{
  "price": 15.99
}

// ✅ Actualizar precio y disponibilidad
{
  "price": 12.99,
  "isAvailable": false
}

// ✅ Actualizar descripción e imagen
{
  "description": "Nueva descripción mejorada",
  "imageUrl": "https://example.com/new-image.jpg"
}

// ❌ Las validaciones siguen aplicando
{
  "price": -5
}
// Error: "El precio debe ser mayor a 0"
```

---

## 🧪 Ejemplos Completos de Peticiones

### Crear Producto - Mínimo Requerido
```http
POST /api/products?businessId=uuid-del-negocio
Authorization: Bearer token-jwt
Content-Type: application/json

{
  "name": "Pizza Margarita",
  "price": 12.99
}
```

### Crear Producto - Completo
```http
POST /api/products?businessId=uuid-del-negocio
Authorization: Bearer token-jwt
Content-Type: application/json

{
  "name": "Pizza Margarita",
  "description": "Pizza clásica con tomate San Marzano, mozzarella di bufala y albahaca fresca",
  "weightGrams": 500,
  "quantityUnits": 1,
  "price": 12.99,
  "imageUrl": "https://example.com/pizza-margarita.jpg",
  "isAvailable": true
}
```

### Actualizar Producto - Marcar como No Disponible
```http
PUT /api/products/uuid-del-producto
Authorization: Bearer token-jwt
Content-Type: application/json

{
  "isAvailable": false
}
```

### Actualizar Producto - Cambiar Precio
```http
PUT /api/products/uuid-del-producto
Authorization: Bearer token-jwt
Content-Type: application/json

{
  "price": 11.99,
  "description": "Ahora con descuento especial"
}
```

---

## 🚨 Respuestas de Error

Cuando las validaciones fallan, el backend responde con status **400 Bad Request** y un objeto de error:

### Error de Validación Única
```json
{
  "statusCode": 400,
  "message": [
    "El nombre es requerido"
  ],
  "error": "Bad Request"
}
```

### Error de Múltiples Validaciones
```json
{
  "statusCode": 400,
  "message": [
    "El nombre es requerido",
    "El precio es requerido",
    "El precio debe ser mayor a 0"
  ],
  "error": "Bad Request"
}
```

### Ejemplo de Petición Inválida
```http
POST /api/products?businessId=uuid
Authorization: Bearer token
Content-Type: application/json

{
  "name": "",
  "price": -5,
  "imageUrl": "not-a-url",
  "weightGrams": 0
}
```

**Respuesta:**
```json
{
  "statusCode": 400,
  "message": [
    "El nombre es requerido",
    "El nombre debe tener al menos 3 caracteres",
    "El precio debe ser mayor a 0",
    "El precio debe ser al menos 0.01",
    "La imagen debe ser una URL válida",
    "El peso debe ser al menos 1 gramo"
  ],
  "error": "Bad Request"
}
```

---

## 📝 Notas Importantes

1. **ValidationPipe Global**: Las validaciones se aplican automáticamente gracias al `ValidationPipe` configurado en `main.ts`.

2. **Mensajes en Español**: Todos los mensajes de error están en español para mejor UX.

3. **Tipado Estricto**: TypeScript + class-validator aseguran la integridad de los datos.

4. **Campos Opcionales**: Si no se proporciona un campo opcional, simplemente no se incluye en la base de datos (excepto `isAvailable` que tiene default `true`).

5. **Updates Parciales**: Puedes actualizar solo los campos que necesites, el resto permanece sin cambios.

6. **URLs**: Solo se aceptan URLs completas con protocolo (http:// o https://).

7. **Números Decimales**: El campo `price` acepta decimales (ej: 12.99) para representar centavos.

---

## 🔍 Testing de Validaciones

Puedes probar las validaciones usando el archivo `test-api.http` en la raíz del proyecto:

```bash
# Ver sección "7. CASOS DE ERROR (para testing)"
# en el archivo test-api.http
```

O usando curl:

```bash
# Probar error de validación
curl -X POST http://localhost:3000/api/products?businessId=uuid \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "price": -5
  }'
```

---

**Última actualización:** 30 de octubre de 2025
**Estado:** ✅ Validaciones completas con mensajes en español
