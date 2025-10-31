# Configuración CORS para Expo - Delivery App Backend

## 📋 Descripción

Configuración de CORS (Cross-Origin Resource Sharing) optimizada para desarrollo con Expo, permitiendo peticiones desde aplicaciones móviles y web.

---

## ✅ Configuración Implementada

### 1. CORS Dinámico en `src/main.ts`

```typescript
// Lista de orígenes permitidos
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : [
      'http://localhost:19000', // Expo development server
      'http://localhost:19001', // Expo web
      'http://localhost:19002', // Expo web alternate
      'http://localhost:19006', // Expo web (Metro bundler)
      'http://localhost:8081',  // Metro bundler
      'exp://localhost:8081',   // Expo Go app
    ];

app.enableCors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (mobile apps, postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // En desarrollo, permitir todos los localhost
    if (process.env.NODE_ENV !== 'production') {
      if (origin.includes('localhost') || 
          origin.includes('192.168') || 
          origin.includes('10.0')) {
        return callback(null, true);
      }
    }
    
    // Verificar contra lista permitida
    if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization',
});
```

---

## 🎯 Orígenes Permitidos por Defecto

### Expo Development Server
- `http://localhost:19000` - Puerto principal de Expo
- `http://localhost:19001` - Puerto alternativo
- `http://localhost:19002` - Puerto alternativo
- `http://localhost:19006` - Expo web con Metro bundler

### Metro Bundler
- `http://localhost:8081` - Metro bundler
- `exp://localhost:8081` - Expo Go app

### Desarrollo Adicional
- Cualquier `localhost:*` en modo desarrollo
- IPs locales: `192.168.x.x:*`
- IPs privadas: `10.0.x.x:*`

---

## 🔧 Variables de Entorno

### Archivo `.env`

```bash
# Server Configuration
PORT=3000

# CORS Configuration
CORS_ORIGIN=*

# Node Environment
NODE_ENV=development
```

### Opciones de Configuración

#### Opción 1: Permitir Todos (Desarrollo)
```bash
CORS_ORIGIN=*
```

#### Opción 2: Orígenes Específicos
```bash
CORS_ORIGIN=http://localhost:19006,http://localhost:19000,http://192.168.1.100:19000
```

#### Opción 3: Producción
```bash
NODE_ENV=production
CORS_ORIGIN=https://mi-app.com,https://admin.mi-app.com
```

---

## 📱 Configuración de Expo

### 1. Obtener tu IP Local

**Windows:**
```bash
ipconfig
# Busca "Dirección IPv4" en la red WiFi/Ethernet
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# O
ip addr show | grep "inet "
```

### 2. Configurar `app.json` en tu proyecto Expo

```json
{
  "expo": {
    "name": "Delivery App",
    "slug": "delivery-app",
    "extra": {
      "apiUrl": "http://192.168.1.100:3000/api"
    }
  }
}
```

### 3. Usar en tu código React Native

```typescript
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

// Ejemplo de fetch
const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  return response.json();
};
```

---

## 🚀 Casos de Uso

### Desarrollo Local con Expo Go

1. **Backend corriendo en tu PC:**
   ```bash
   pnpm start:dev
   ```

2. **Encuentra tu IP local:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig | grep "inet "
   ```

3. **Configura tu app Expo:**
   ```typescript
   const API_URL = 'http://192.168.1.100:3000/api';
   ```

4. **El backend acepta la petición automáticamente** gracias a:
   ```typescript
   if (origin.includes('192.168')) {
     return callback(null, true);
   }
   ```

### Desarrollo con Expo Web

1. **Expo web corre en `http://localhost:19006`**

2. **El backend ya permite este origen por defecto**

3. **Usa la URL del backend:**
   ```typescript
   const API_URL = 'http://localhost:3000/api';
   ```

### Testing con Dispositivo Físico

1. **Tu teléfono y PC deben estar en la misma red WiFi**

2. **Usa la IP de tu PC:**
   ```typescript
   const API_URL = 'http://192.168.1.100:3000/api';
   ```

3. **El backend acepta peticiones de IPs locales en desarrollo**

---

## 🔒 Seguridad

### Desarrollo (NODE_ENV=development)
- ✅ Permite todos los `localhost:*`
- ✅ Permite IPs locales (`192.168.x.x`, `10.0.x.x`)
- ✅ Permite requests sin origin (apps móviles)
- ✅ Flexible para testing

### Producción (NODE_ENV=production)
- ⚠️ **SOLO** permite orígenes en `CORS_ORIGIN`
- ⚠️ No permite IPs locales automáticamente
- ⚠️ Más restrictivo para seguridad

**Configuración recomendada para producción:**
```bash
NODE_ENV=production
CORS_ORIGIN=https://mi-app.com,https://api.mi-app.com
```

---

## 🐛 Troubleshooting

### Error: "Network request failed"

**Problema:** La app Expo no puede conectarse al backend.

**Soluciones:**

1. **Verificar que el backend esté corriendo:**
   ```bash
   curl http://localhost:3000/api/businesses
   ```

2. **Verificar la IP correcta:**
   ```bash
   # Asegúrate de usar la IP correcta de tu PC
   ping 192.168.1.100
   ```

3. **Verificar que estén en la misma red:**
   - PC y teléfono en la misma WiFi
   - Sin VPN activa
   - Sin firewall bloqueando el puerto 3000

4. **Verificar CORS_ORIGIN:**
   ```bash
   # .env
   CORS_ORIGIN=*
   NODE_ENV=development
   ```

### Error: "CORS policy blocked"

**Problema:** El navegador bloquea la petición.

**Soluciones:**

1. **Verificar que el origen esté permitido:**
   ```bash
   # Logs del backend
   # Deberías ver el origin en los logs
   ```

2. **En desarrollo, usar CORS_ORIGIN=***
   ```bash
   CORS_ORIGIN=*
   ```

3. **Reiniciar el servidor después de cambiar .env:**
   ```bash
   # Ctrl+C para detener
   pnpm start:dev
   ```

### Error: "Cannot connect to localhost"

**Problema:** En dispositivo físico, `localhost` se refiere al dispositivo, no a tu PC.

**Solución:**
```typescript
// ❌ NO funciona en dispositivo físico
const API_URL = 'http://localhost:3000/api';

// ✅ USA la IP de tu PC
const API_URL = 'http://192.168.1.100:3000/api';
```

---

## 📝 Ejemplo Completo

### Backend (NestJS)

Ya está configurado! Solo asegúrate de que `.env` tenga:
```bash
NODE_ENV=development
CORS_ORIGIN=*
```

### Frontend (Expo)

**1. Instalar dependencias:**
```bash
npm install expo-constants
```

**2. Configurar `app.json`:**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://192.168.1.100:3000/api"
    }
  }
}
```

**3. Crear servicio de API:**
```typescript
// services/api.ts
import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  },
  
  async getBusinesses() {
    const response = await fetch(`${API_URL}/businesses`);
    return response.json();
  },
  
  async getProducts(businessId: string) {
    const response = await fetch(`${API_URL}/products?businessId=${businessId}`);
    return response.json();
  },
};
```

**4. Usar en componentes:**
```typescript
// screens/LoginScreen.tsx
import { api } from '../services/api';

export const LoginScreen = () => {
  const handleLogin = async () => {
    try {
      const result = await api.login('test@example.com', 'password123');
      console.log('Token:', result.access_token);
      console.log('User:', result.user);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  return (
    <Button title="Login" onPress={handleLogin} />
  );
};
```

---

## 💡 Tips Adicionales

### 1. Usar Variables de Entorno en Expo
```bash
# .env
API_URL=http://192.168.1.100:3000/api
```

```typescript
import { API_URL } from '@env';

const response = await fetch(`${API_URL}/businesses`);
```

### 2. Debugging de CORS
Agrega logs en el backend:
```typescript
app.enableCors({
  origin: (origin, callback) => {
    console.log('CORS Request from:', origin);
    // ... resto del código
  }
});
```

### 3. Testing con Postman/Insomnia
No hay problema con CORS en estas herramientas porque no envían el header `Origin`.

### 4. Expo Web vs Expo Go
- **Expo Web**: Corre en navegador, aplican reglas CORS
- **Expo Go**: App nativa, no aplican reglas CORS del navegador

---

## 📚 Referencias

- [Expo Network Debugging](https://docs.expo.dev/guides/troubleshooting-proxies/)
- [NestJS CORS](https://docs.nestjs.com/security/cors)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Fecha de configuración**: 30 de octubre de 2025
**Estado**: ✅ Completado y listo para desarrollo con Expo
