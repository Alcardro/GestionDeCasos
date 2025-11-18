'use client';

import { Case } from '../lib/caseService';

interface StatsCardsProps {
  cases: Case[];
}

export default function StatsCards({ cases }: StatsCardsProps) {
  // Calcular estadísticas
  const totalCases = cases.length;
  const pendingCases = cases.filter(c => c.estado === 'PENDIENTE').length;
  const inProgressCases = cases.filter(c => c.estado === 'EN_PROCESO').length;
  const completedCases = cases.filter(c => c.estado === 'COMPLETADO').length;
  
  // Calcular casos vencidos (más de 30 días)
  const overdueCases = cases.filter(c => {
    const created = new Date(c.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 30 && c.estado !== 'COMPLETADO';
  }).length;

  const stats = [
    {
      title: 'Total de Casos',
      value: totalCases,
      icon: '📋',
      color: 'blue',
      description: 'Todos los casos activos'
    },
    {
      title: 'Pendientes',
      value: pendingCases,
      icon: '⏳',
      color: 'yellow',
      description: 'Esperando acción'
    },
    {
      title: 'En Proceso',
      value: inProgressCases,
      icon: '🔄',
      color: 'blue',
      description: 'En trabajo activo'
    },
    {
      title: 'Completados',
      value: completedCases,
      icon: '✅',
      color: 'green',
      description: 'Casos finalizados'
    },
    {
      title: 'Atrasados',
      value: overdueCases,
      icon: '⚠️',
      color: 'red',
      description: 'Más de 30 días'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'green': return 'bg-green-50 border-green-200 text-green-700';
      case 'red': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`border rounded-xl p-6 ${getColorClasses(stat.color)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs opacity-75 mt-1">{stat.description}</p>
            </div>
            <div className="text-2xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}