'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  email: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Limpiar todo
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
    // Redirigir al login
    router.push('/login');
  };

  const menuItems = [
    { name: '📊 Dashboard', path: '/dashboard', active: true },
    { name: '📋 Casos', path: '/dashboard/cases', active: false },
    { name: '👥 Clientes', path: '/dashboard/clients', active: false },
    { name: '📅 Calendario', path: '/dashboard/calendar', active: false },
    { name: '📈 Reportes', path: '/dashboard/reports', active: false },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* === SIDEBAR IZQUIERDO === */}
      <div className="w-64 bg-white shadow-lg">
        
        {/* Logo y Nombre */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Legal-Tech</h1>
              <p className="text-xs text-gray-500">Sistema Legal</p>
            </div>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Navegación</p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Información del Usuario */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Superior */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex justify-between items-center px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bienvenido de nuevo, {user.username} 👋</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                🏛️ Abogado
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Contenido de la Página */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          {children}
        </main>

      </div>
    </div>
  );
}