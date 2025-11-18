'use client';

import { Case } from '../lib/caseService';

interface RecentCasesProps {
  cases: Case[];
  onDeleteCase: (id: string, nombre: string) => void;
  onEditCase: (caseItem: Case) => void; // ✅ NUEVO: Función para editar
}

export default function RecentCases({ cases, onDeleteCase, onEditCase }: RecentCasesProps) {
  // Ordenar casos por fecha de creación (más recientes primero)
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5); // Solo mostrar 5 más recientes

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EN_PROCESO': return 'bg-blue-100 text-blue-800';
      case 'COMPLETADO': return 'bg-green-100 text-green-800';
      case 'ARCHIVADO': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return '⏳ Pendiente';
      case 'EN_PROCESO': return '🔄 En Proceso';
      case 'COMPLETADO': return '✅ Completado';
      case 'ARCHIVADO': return '📁 Archivado';
      default: return estado;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">📋 Casos Recientes</h2>
          <span className="text-sm text-gray-500">
            {recentCases.length} de {cases.length} casos
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {recentCases.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-500">No hay casos registrados</p>
            <p className="text-sm text-gray-400 mt-1">Crea tu primer caso para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCases.map((caseItem) => (
              <div 
                key={caseItem.id} 
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {caseItem.nombre}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.estado)}`}>
                      {getStatusText(caseItem.estado)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {caseItem.descripcion}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400">
                      📅 Creado: {formatDate(caseItem.createdAt)}
                    </span>
                    <span className="text-xs text-gray-400">
                      ✏️ Actualizado: {formatDate(caseItem.updatedAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {/* ✅ CAMBIO: Botón editar ahora llama a onEditCase */}
                  <button 
                    onClick={() => onEditCase(caseItem)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar caso"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDeleteCase(caseItem.id, caseItem.nombre)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar caso"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {cases.length > 5 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
              Ver todos los casos ({cases.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}