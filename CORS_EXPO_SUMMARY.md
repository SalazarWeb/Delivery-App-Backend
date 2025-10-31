# ✅ CORS para Expo - Configuración Completada

## 📋 Archivos Modificados

### 1. `src/main.ts`
- ✅ CORS dinámico con soporte para Expo
- ✅ Permite orígenes de localhost automáticamente en desarrollo
- ✅ Permite IPs locales (192.168.x.x, 10.0.x.x)
- ✅ Permite requests sin origin (apps móviles nativas)

### 2. `.env` y `.env.example`
- ✅ Variable `CORS_ORIGIN` (default: *)
- ✅ Variable `NODE_ENV` (default: development)
- ✅ Variable `PORT` (default: 3000)

---

## 🎯 Orígenes Permitidos en Desarrollo

### Automáticos (NODE_ENV=development)
- ✅ `http://localhost:*` (cualquier puerto)
- ✅ `http://192.168.x.x:*` (IPs locales WiFi)
- ✅ `http://10.0.x.x:*` (IPs privadas)
- ✅ Requests sin origin (apps móviles)

### Predefinidos por Defecto
- ✅ `http://localhost:19000` - Expo development server
- ✅ `http://localhost:19001` - Expo web
- ✅ `http://localhost:19002` - Expo web alternate
- ✅ `http://localhost:19006` - Expo web (Metro bundler)
- ✅ `http://localhost:8081` - Metro bundler
- ✅ `exp://localhost:8081` - Expo Go app

---

## 📱 Configuración de Expo

### 1. Encontrar tu IP Local

**Windows:**
```bash
ipconfig
# Busca "Dirección IPv4"
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

### 2. Configurar `app.json`

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://192.168.1.100:3000/api"
    }
  }
}
```

Reemplaza `192.168.1.100` con tu IP local.

### 3. Usar en tu código

```typescript
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
```

---

## 📁 Archivos de Ejemplo Creados

### 1. `expo-api-example.ts`
Servicio completo de API con:
- ✅ Clase `DeliveryAPI` con todos los endpoints
- ✅ Tipos TypeScript
- ✅ Manejo de tokens automático
- ✅ Manejo de errores

### 2. `expo-app-json-example.json`
Ejemplo de configuración de `app.json` con la URL del API

### 3. `expo-components-example.tsx`
Ejemplos de componentes React Native:
- LoginScreen
- RegisterScreen
- BusinessesScreen
- ProductsScreen

### 4. `CORS_EXPO_CONFIG.md`
Documentación completa con:
- Configuración detallada
- Troubleshooting
- Ejemplos de uso
- Tips y mejores prácticas

---

## 🚀 Inicio Rápido

### Backend

1. **Verificar `.env`:**
```bash
NODE_ENV=development
CORS_ORIGIN=*
PORT=3000
```

2. **Iniciar servidor:**
```bash
pnpm start:dev
```

3. **Verificar que corre:**
```
🚀 Application is running on: http://localhost:3000/api
```

### Frontend (Expo)

1. **Instalar dependencias:**
```bash
npx expo install expo-constants
```

2. **Configurar `app.json`:**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://TU_IP_LOCAL:3000/api"
    }
  }
}
```

3. **Copiar el servicio de API:**
```bash
# Copiar expo-api-example.ts a tu proyecto
cp expo-api-example.ts tu-proyecto-expo/services/api.ts
```

4. **Usar en componentes:**
```typescript
import { api } from './services/api';

const handleLogin = async () => {
  try {
    const result = await api.login(email, password);
    console.log('Token:', result.access_token);
  } catch (error) {
    console.error(error);
  }
};
```

---

## 🔍 Testing

### 1. Probar desde tu PC (localhost)
```bash
curl http://localhost:3000/api/businesses
```

### 2. Probar desde tu red local
```bash
# Reemplaza con tu IP
curl http://192.168.1.100:3000/api/businesses
```

### 3. Probar desde Expo
```typescript
import { api, API_URL } from './services/api';

console.log('API URL:', API_URL);

// Test simple
const testAPI = async () => {
  try {
    const businesses = await api.getBusinesses();
    console.log('Negocios:', businesses);
  } catch (error) {
    console.error('Error:', error);
  }
};

testAPI();
```

---

## 🐛 Troubleshooting

### Error: "Network request failed"

**Causas comunes:**
1. Backend no está corriendo
2. IP incorrecta en app.json
3. PC y teléfono en diferentes redes WiFi
4. Firewall bloqueando puerto 3000

**Solución:**
```bash
# 1. Verificar backend
curl http://localhost:3000/api/businesses

# 2. Verificar IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# 3. Verificar conexión
ping TU_IP_LOCAL

# 4. Permitir puerto 3000 en firewall
# Windows: Panel de Control > Firewall > Permitir app
```

### Error: "CORS policy blocked"

**Solución:**
```bash
# .env
NODE_ENV=development
CORS_ORIGIN=*

# Reiniciar servidor
pnpm start:dev
```

### Error: "Cannot connect to localhost"

En dispositivo físico, `localhost` se refiere al dispositivo, no a tu PC.

**Solución:**
```typescript
// ❌ NO funciona en dispositivo físico
apiUrl: "http://localhost:3000/api"

// ✅ USA tu IP local
apiUrl: "http://192.168.1.100:3000/api"
```

---

## 📊 Configuración por Entorno

### Desarrollo
```bash
NODE_ENV=development
CORS_ORIGIN=*
```
- Permite todos los localhost
- Permite IPs locales
- Flexible para testing

### Producción
```bash
NODE_ENV=production
CORS_ORIGIN=https://mi-app.com,https://admin.mi-app.com
```
- Solo permite orígenes específicos
- Mayor seguridad
- Restringe acceso

---

## ✅ Checklist

- [x] CORS configurado en main.ts
- [x] Variables de entorno actualizadas
- [x] Soporte para Expo agregado
- [x] Permite localhost automáticamente
- [x] Permite IPs locales en desarrollo
- [x] Servicio de API ejemplo creado
- [x] Componentes ejemplo creados
- [x] Documentación completa
- [x] Sin errores de compilación

---

## 📚 Recursos

- `CORS_EXPO_CONFIG.md` - Documentación completa
- `expo-api-example.ts` - Servicio de API listo para usar
- `expo-components-example.tsx` - Componentes de ejemplo
- `expo-app-json-example.json` - Configuración de app.json

---

## 💡 Próximos Pasos

1. **Copiar el servicio de API a tu proyecto Expo**
2. **Configurar tu IP en app.json**
3. **Probar login desde la app**
4. **Implementar las pantallas necesarias**

---

**Configuración completada**: 30 de octubre de 2025
**Estado**: ✅ Listo para desarrollo con Expo

🚀 **¡Tu backend ahora acepta peticiones desde Expo!**
