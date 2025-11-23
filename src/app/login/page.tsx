'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '../../lib/api';
import Cookies from 'js-cookie';

// Definir interfaces localmente
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginFormData {
  username: string;
  password: string;
}

// Servicio de autenticación dentro del mismo archivo
class AuthService {
  static async login(credentials: LoginFormData): Promise<AuthResponse> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Usuarios de prueba
    const mockUsers = [
      {
        id: '1',
        username: 'abogado',
        password: 'password123',
        email: 'abogado@example.com'
      },
      {
        id: '2', 
        username: 'asistente',
        password: 'password123',
        email: 'asistente@example.com'
      }
    ];
    
    const user = mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // Generar token simulado
    const token = btoa(JSON.stringify({
      userId: user.id,
      username: user.username,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    }));

    const userResponse: User = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    return {
      token,
      user: userResponse
    };
  }

  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }
}

// Componente de Login
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');


    // Validación básica
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    try {
    const response = await apiService.login(formData);
    
    console.log('✅ Login exitoso, guardando tokens...');
    
    // 1. Guardar en localStorage (para el frontend)
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // 2. ✅ IMPORTANTE: Guardar en cookies (para el middleware)
    Cookies.set('token', response.token, { 
      expires: 1, // 1 día
      path: '/',
      sameSite: 'lax'
    });

    console.log('🍪 Cookie guardada:', Cookies.get('token') ? 'SÍ' : 'NO');
   // 3. Redirigir al dashboard
    console.log('🔄 Redirigiendo al dashboard...');
    router.push('/dashboard');
    
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
  } finally {
    setLoading(false);
  }
};




  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Legal-Tech Cases
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Gestión de Expedientes
          </p>
        </div>
        
        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ingresa tu usuario"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>

          {/* Credenciales de demo */}
          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Credenciales de prueba:</h3>
              <div className="text-xs text-blue-600 space-y-1">
                <p><strong>Usuario:</strong> abogado1</p>
                <p><strong>Contraseña:</strong> 123</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
