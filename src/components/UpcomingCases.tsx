'use client';

import { Case } from '../lib/caseService';

interface UpcomingCasesProps {
  cases: Case[];
  onEditCase: (caseItem: Case) => void;
}

export default function UpcomingCases({ cases, onEditCase }: UpcomingCasesProps) {
  
  // ✅ Función para determinar el estado de vencimiento
  const getDueStatus = (vencimiento: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(vencimiento);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', text: 'VENCIDO', days: Math.abs(diffDays), color: 'bg-red-100 text-red-800 border-red-200' };
    } else if (diffDays === 0) {
      return { status: 'today', text: 'HOY', days: 0, color: 'bg-orange-100 text-orange-800 border-orange-200' };
    } else if (diffDays <= 3) {
      return { status: 'urgent', text: `EN ${diffDays} DÍA${diffDays > 1 ? 'S' : ''}`, days: diffDays, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else {
      return { status: 'upcoming', text: `EN ${diffDays} DÍAS`, days: diffDays, color: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
  };

  // ✅ Formatear fecha en español
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // ✅ Ordenar casos: primero vencidos, luego por proximidad
  const sortedCases = [...cases]
    .filter(caseItem => caseItem.vencimiento) // Solo casos con vencimiento
    .sort((a, b) => {
      if (!a.vencimiento || !b.vencimiento) return 0;
      return new Date(a.vencimiento).getTime() - new Date(b.vencimiento).getTime();
    });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">📅 Próximos Vencimientos</h2>
          <span className="text-sm text-gray-500">
            {sortedCases.length} caso{sortedCases.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {sortedCases.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-gray-500">No hay vencimientos próximos</p>
            <p className="text-sm text-gray-400 mt-1">Los casos con fecha de vencimiento aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCases.map((caseItem) => {
              if (!caseItem.vencimiento) return null;
              
              const dueStatus = getDueStatus(caseItem.vencimiento);
              
              return (
                <div 
                  key={caseItem.id} 
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onEditCase(caseItem)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {caseItem.nombre}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${dueStatus.color}`}>
                      {dueStatus.text}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {caseItem.descripcion}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      📅 {formatDate(caseItem.vencimiento)}
                    </span>
                    <span className={`text-xs font-medium ${
                      dueStatus.status === 'overdue' ? 'text-red-600' :
                      dueStatus.status === 'today' ? 'text-orange-600' :
                      dueStatus.status === 'urgent' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {dueStatus.status === 'overdue' ? `Vencido hace ${dueStatus.days} día${dueStatus.days > 1 ? 's' : ''}` :
                       dueStatus.status === 'today' ? 'Vence hoy' :
                       dueStatus.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}