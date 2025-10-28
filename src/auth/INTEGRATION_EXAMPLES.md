# Ejemplos de Integración - Módulo Auth

## 📱 JavaScript/TypeScript (Frontend)

### Usando Fetch API

```typescript
// auth.service.ts
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';

  async register(data: {
    type: 'cliente' | 'empresa';
    name: string;
    phone: string;
    email: string;
    password: string;
  }) {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el registro');
    }

    const result = await response.json();
    // Guardar el token
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    return result;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Credenciales inválidas');
    }

    const result = await response.json();
    // Guardar el token
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    return result;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Hacer request autenticado
  async authenticatedRequest(url: string, options: RequestInit = {}) {
    const token = this.getToken();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Token inválido o expirado
      this.logout();
      throw new Error('Sesión expirada');
    }

    return response;
  }
}
```

### Usando Axios

```typescript
import axios, { AxiosInstance } from 'axios';

export class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000',
    });

    // Interceptor para agregar el token a todas las requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores 401
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async register(data: {
    type: 'cliente' | 'empresa';
    name: string;
    phone: string;
    email: string;
    password: string;
  }) {
    const response = await this.api.post('/auth/register', data);
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
```

---

## ⚛️ React Ejemplo

```tsx
import React, { useState, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  type: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (data: any) => {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error en el registro');
    }

    const result = await response.json();
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    setUser(result.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Componente de Login
const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirigir al dashboard
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};
```

---

## 🐍 Python Ejemplo

```python
import requests
from typing import Optional, Dict

class AuthService:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.token: Optional[str] = None
        self.user: Optional[Dict] = None

    def register(self, user_type: str, name: str, phone: str, 
                 email: str, password: str) -> Dict:
        """Registra un nuevo usuario"""
        response = requests.post(
            f"{self.base_url}/auth/register",
            json={
                "type": user_type,
                "name": name,
                "phone": phone,
                "email": email,
                "password": password
            }
        )
        
        if response.status_code == 201:
            data = response.json()
            self.token = data["access_token"]
            self.user = data["user"]
            return data
        else:
            raise Exception(f"Error: {response.json()}")

    def login(self, email: str, password: str) -> Dict:
        """Inicia sesión"""
        response = requests.post(
            f"{self.base_url}/auth/login",
            json={
                "email": email,
                "password": password
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            self.token = data["access_token"]
            self.user = data["user"]
            return data
        else:
            raise Exception(f"Error: {response.json()}")

    def get_headers(self) -> Dict[str, str]:
        """Retorna headers con el token"""
        if not self.token:
            raise Exception("No autenticado")
        
        return {
            "Authorization": f"Bearer {self.token}"
        }

    def authenticated_request(self, method: str, url: str, **kwargs) -> requests.Response:
        """Hace una request autenticada"""
        headers = kwargs.get("headers", {})
        headers.update(self.get_headers())
        kwargs["headers"] = headers
        
        return requests.request(method, url, **kwargs)

# Uso
auth = AuthService()

# Registro
result = auth.register(
    user_type="cliente",
    name="Juan Pérez",
    phone="+56912345678",
    email="juan@example.com",
    password="password123"
)
print(f"Token: {result['access_token']}")

# Login
result = auth.login("juan@example.com", "password123")
print(f"Usuario: {result['user']['name']}")

# Request autenticado
response = auth.authenticated_request(
    "GET",
    "http://localhost:3000/users/me"
)
print(response.json())
```

---

## 📱 Flutter/Dart Ejemplo

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final String baseUrl = 'http://localhost:3000/auth';
  String? _token;
  Map<String, dynamic>? _user;

  Future<Map<String, dynamic>> register({
    required String type,
    required String name,
    required String phone,
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'type': type,
        'name': name,
        'phone': phone,
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      _token = data['access_token'];
      _user = data['user'];
      
      // Guardar en preferencias
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', _token!);
      await prefs.setString('user', jsonEncode(_user));
      
      return data;
    } else {
      throw Exception('Error en el registro');
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      _token = data['access_token'];
      _user = data['user'];
      
      // Guardar en preferencias
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', _token!);
      await prefs.setString('user', jsonEncode(_user));
      
      return data;
    } else {
      throw Exception('Credenciales inválidas');
    }
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('user');
  }

  Future<http.Response> authenticatedRequest(
    String method,
    String url, {
    Map<String, dynamic>? body,
  }) async {
    if (_token == null) {
      throw Exception('No autenticado');
    }

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $_token',
    };

    switch (method.toUpperCase()) {
      case 'GET':
        return await http.get(Uri.parse(url), headers: headers);
      case 'POST':
        return await http.post(
          Uri.parse(url),
          headers: headers,
          body: jsonEncode(body),
        );
      default:
        throw Exception('Método no soportado');
    }
  }
}
```

---

**Estos ejemplos muestran cómo integrar el módulo Auth con diferentes tecnologías.**
