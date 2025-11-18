'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Servicio de autenticación inline
class AuthService {
  static getStoredUser() {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static getStoredToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }
}

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const token = AuthService.getStoredToken();
    const user = AuthService.getStoredUser();

    if (token && user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando aplicación...</p>
      </div>
    </div>
  );
}