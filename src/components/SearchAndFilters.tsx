'use client';

import { Case } from '../lib/caseService';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  cases: Case[];
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  cases
}: SearchAndFiltersProps) {
  
  // Contar casos por estado para mostrar en los filtros
  const getStatusCount = (estado: string) => {
    return cases.filter(caseItem => caseItem.estado === estado).length;
  };

  // Opciones de filtro por estado
  const statusOptions = [
    { value: 'TODOS', label: 'Todos los Casos', count: cases.length, emoji: '📋' },
    { value: 'PENDIENTE', label: 'Pendientes', count: getStatusCount('PENDIENTE'), emoji: '⏳' },
    { value: 'EN_PROCESO', label: 'En Proceso', count: getStatusCount('EN_PROCESO'), emoji: '🔄' },
    { value: 'COMPLETADO', label: 'Completados', count: getStatusCount('COMPLETADO'), emoji: '✅' },
    { value: 'ARCHIVADO', label: 'Archivados', count: getStatusCount('ARCHIVADO'), emoji: '📁' }
  ];

  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('TODOS');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'TODOS';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      
      {/* Título */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">🔍 Buscar y Filtrar</h2>
        
        {/* Botón para limpiar filtros (solo se muestra si hay filtros activos) */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>🧹</span>
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Barra de Búsqueda */}
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar por nombre
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔎</span>
          </div>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Escribe el nombre del caso..."
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="text-gray-400 hover:text-gray-600">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Filtros por Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por estado
        </label>
        
        {/* Filtros en grid responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusFilterChange(option.value)}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                statusFilter === option.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{option.emoji}</span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                  statusFilter === option.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {option.count}
                </span>
              </div>
              <div className="text-sm font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Información de resultados filtrados */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Filtros activos:</strong>
            {searchTerm && ` Búsqueda: "${searchTerm}"`}
            {statusFilter !== 'TODOS' && ` Estado: ${statusOptions.find(opt => opt.value === statusFilter)?.label}`}
            {` - Mostrando ${cases.length} caso${cases.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      )}
    </div>
  );
}