'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Case, CaseService, CaseFormData } from '../../lib/caseService';
import Cookies from 'js-cookie';
import CaseForm from '../../components/CaseForm';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCards from '../../components/StatsCards';
import RecentCases from '../../components/RecentCases';
import SearchAndFilters from '../../components/SearchAndFilters';
import UpcomingCases from '../../components/UpcomingCases'; // ✅ NUEVO: Importar componente

interface User {
  id: string;
  username: string;
  email: string;
}

class AuthService {
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

  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  useEffect(() => {
    const token = AuthService.getStoredToken();
    const storedUser = AuthService.getStoredUser();

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    setUser(storedUser);
    loadCases();
    setLoading(false);
  }, [router]);

  const loadCases = async () => {
    try {
      const casesData = await CaseService.getAllCases();
      setAllCases(casesData);
    } catch (error) {
      console.error('❌ Error cargando casos:', error);
      showMessage('error', 'Error al cargar los casos');
    }
  };

  const filteredCases = useMemo(() => {
    let filtered = [...allCases];

    if (searchTerm) {
      filtered = filtered.filter(caseItem =>
        caseItem.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter(caseItem => caseItem.estado === statusFilter);
    }

    return filtered;
  }, [allCases, searchTerm, statusFilter]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveCase = async (caseData: CaseFormData, caseId?: string) => {
    try {
      if (caseId) {
        await CaseService.updateCase(caseId, caseData);
        showMessage('success', '✅ Caso actualizado exitosamente');
      } else {
        await CaseService.createCase(caseData);
        showMessage('success', '✅ Caso creado exitosamente');
      }
      
      await loadCases();
      setShowForm(false);
      setEditingCase(null);
    } catch (error) {
      console.error('Error guardando caso:', error);
      showMessage('error', '❌ Error al guardar el caso');
      throw error;
    }
  };

  const handleEditCase = (caseItem: Case) => {
    setEditingCase(caseItem);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCase(null);
  };

  const handleDeleteCase = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el caso "${nombre}"?`)) {
      return;
    }

    try {
      await CaseService.deleteCase(id);
      await loadCases();
      showMessage('success', '🗑️ Caso eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando caso:', error);
      showMessage('error', '❌ Error al eliminar el caso');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user}>
      
      {/* Mensajes */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Botón para agregar caso */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen General</h1>
          <p className="text-gray-600">Vista completa de tu práctica legal</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          Nuevo Caso
        </button>
      </div>

      {/* Búsqueda y Filtros */}
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        cases={allCases}
      />

      {/* Tarjetas de Estadísticas */}
      <StatsCards cases={filteredCases} />

      {/* Grid de Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Casos Recientes */}
        <div className="lg:col-span-2">
          <RecentCases 
            cases={filteredCases}
            onDeleteCase={handleDeleteCase}
            onEditCase={handleEditCase}
          />
        </div>

        {/* ✅ NUEVO: Próximos Vencimientos */}
        <div className="lg:col-span-1">
          <UpcomingCases 
            cases={allCases} // Mostrar TODOS los casos (sin filtros) para vencimientos
            onEditCase={handleEditCase}
          />
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Actividad Reciente</h3>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-gray-500">Próximamente</p>
            <p className="text-sm text-gray-400 mt-1">Registro de actividades</p>
          </div>
        </div>

      </div>

      {/* Formulario Modal */}
      {showForm && (
        <CaseForm
          onSave={handleSaveCase}
          onCancel={handleCancelForm}
          initialData={editingCase || undefined}
          isEditing={!!editingCase}
        />
      )}
    </DashboardLayout>
  );
}