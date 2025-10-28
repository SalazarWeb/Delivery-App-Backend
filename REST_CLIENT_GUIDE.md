# REST Client para VS Code - Guía de Uso

## 📦 Instalación

### Opción 1: VS Code Extension
1. Abre VS Code
2. Ve a Extensions (Ctrl+Shift+X)
3. Busca "REST Client"
4. Instala la extensión de **Huachao Mao**

### Opción 2: Desde la línea de comandos
```bash
code --install-extension humao.rest-client
```

---

## 🚀 Uso Básico

### 1. Abrir el archivo de pruebas
```bash
code api-tests.http
```

### 2. Enviar una request
- Coloca el cursor sobre cualquier línea de una request
- Haz clic en "Send Request" que aparece sobre el `###`
- O usa el atajo: `Ctrl+Alt+R` (Windows/Linux) o `Cmd+Alt+R` (Mac)

### 3. Ver la respuesta
- Se abre una nueva pestaña con la respuesta
- Incluye headers, status code y body
- Formato JSON automático con syntax highlighting

---

## 📝 Sintaxis Básica

### Request Simple
```http
### Nombre Descriptivo
GET http://localhost:3000/api/businesses
```

### Request con Headers
```http
### Request con Autenticación
GET http://localhost:3000/api/reactions/my-reactions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Request con Body
```http
### Crear Producto
POST http://localhost:3000/api/products?businessId=123
Content-Type: application/json
Authorization: Bearer token-aqui

{
  "name": "Pizza Margarita",
  "price": 8990
}
```

---

## 🔧 Variables

### Definir Variables
```http
@baseUrl = http://localhost:3000/api
@token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Usar Variables
```http
GET {{baseUrl}}/businesses
Authorization: Bearer {{token}}
```

### Variables de Response
```http
### Login
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}

### Usar el token del login
@authToken = {{login.response.body.access_token}}

GET {{baseUrl}}/businesses/owner/me
Authorization: Bearer {{authToken}}
```

---

## 🎯 Flujo de Trabajo Recomendado

### 1. Configurar Variables Base
```http
@baseUrl = http://localhost:3000/api
@contentType = application/json
```

### 2. Ejecutar Login
```http
### Login
# @name loginEmpresa
POST {{baseUrl}}/auth/login
Content-Type: {{contentType}}

{
  "email": "roma@example.com",
  "password": "Roma123!"
}
```

### 3. Copiar el Token
De la respuesta, copia el `access_token` y actualiza:
```http
@authToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Usar en Requests Protegidas
```http
POST {{baseUrl}}/businesses
Authorization: Bearer {{authToken}}
Content-Type: {{contentType}}

{
  "name": "Mi Negocio"
}
```

---

## 📚 Características Avanzadas

### Comentarios
```http
# Esto es un comentario
// También esto

### Request Description
GET {{baseUrl}}/businesses
```

### Request Name (para reutilizar respuestas)
```http
# @name crearNegocio
POST {{baseUrl}}/businesses
...

# Usar ID del negocio creado
@businessId = {{crearNegocio.response.body.id}}
```

### Variables de Entorno
Crea archivo `.vscode/settings.json`:
```json
{
  "rest-client.environmentVariables": {
    "local": {
      "baseUrl": "http://localhost:3000/api",
      "token": ""
    },
    "production": {
      "baseUrl": "https://api.miapp.com/api",
      "token": ""
    }
  }
}
```

### Request Múltiples
```http
### Request 1
GET {{baseUrl}}/businesses

###

### Request 2
GET {{baseUrl}}/products
```

---

## ⚡ Atajos de Teclado

| Acción | Windows/Linux | Mac |
|--------|---------------|-----|
| Enviar request | `Ctrl+Alt+R` | `Cmd+Alt+R` |
| Cancelar request | `Ctrl+Alt+K` | `Cmd+Alt+K` |
| Cambiar entorno | `Ctrl+Alt+E` | `Cmd+Alt+E` |
| Historial | `Ctrl+Alt+H` | `Cmd+Alt+H` |

---

## 📋 Ejemplos del Proyecto

### Flujo Completo
```http
@baseUrl = http://localhost:3000/api

### 1. Registrar Empresa
# @name registro
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "name": "Pizzería Test",
  "email": "pizza@test.com",
  "password": "Pizza123!",
  "phone": "+56987654321",
  "type": "empresa"
}

### 2. Login
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "pizza@test.com",
  "password": "Pizza123!"
}

### 3. Extraer Token
@token = {{login.response.body.access_token}}

### 4. Crear Negocio
# @name negocio
POST {{baseUrl}}/businesses
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Pizzería Centro",
  "description": "Las mejores pizzas",
  "address": "Av. Principal 123",
  "whatsappNumber": "+56987654321",
  "openingHours": {
    "lunes": { "open": "11:00", "close": "23:00" }
  }
}

### 5. Extraer Business ID
@businessId = {{negocio.response.body.id}}

### 6. Crear Producto
POST {{baseUrl}}/products?businessId={{businessId}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Pizza Margarita",
  "description": "Pizza clásica",
  "price": 8990,
  "isAvailable": true
}
```

---

## 🐛 Troubleshooting

### Error: "Send Request" no aparece
- Verifica que el archivo tenga extensión `.http` o `.rest`
- Reinstala la extensión REST Client

### Error: Variables no se resuelven
- Asegúrate de usar `{{variable}}` con dobles llaves
- Define las variables antes de usarlas

### Error: Response no se muestra
- Verifica que el servidor esté corriendo
- Revisa la consola de salida de REST Client

### Token expirado
- Vuelve a hacer login
- Actualiza el `@authToken` con el nuevo token

---

## 💡 Tips

1. **Organiza por secciones**: Usa `###` para separar requests
2. **Nombra tus requests**: Usa `# @name` para reutilizar respuestas
3. **Variables**: Define variables al inicio del archivo
4. **Comentarios**: Documenta qué hace cada request
5. **Múltiples archivos**: Crea archivos separados por módulo
6. **Versionado**: Incluye los `.http` en git para el equipo

---

## 🔗 Recursos

- [Documentación Oficial](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [Ejemplos en GitHub](https://github.com/Huachao/vscode-restclient)
- [Archivo de pruebas del proyecto](./api-tests.http)

---

## 🎨 Alternativas

Si REST Client no te convence, prueba:

- **Thunder Client**: UI más visual en VS Code
- **Postman**: Cliente independiente con más features
- **Insomnia**: Similar a Postman, más liviano
- **httpie**: CLI para terminal

Pero REST Client es ideal porque:
- ✅ Todo en archivos de texto
- ✅ Versionable en Git
- ✅ Compartible con el equipo
- ✅ Integrado en VS Code
- ✅ Ligero y rápido

---

**Usa `api-tests.http` para empezar ahora mismo! 🚀**
