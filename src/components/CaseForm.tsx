'use client';

import { useState, useEffect } from 'react';
import { CaseFormData, Case } from '../lib/caseService';

interface CaseFormProps {
  onSave: (caseData: CaseFormData, caseId?: string) => void;
  onCancel: () => void;
  initialData?: Case;
  isEditing?: boolean;
}

export default function CaseForm({ onSave, onCancel, initialData, isEditing = false }: CaseFormProps) {
  const [formData, setFormData] = useState<CaseFormData>({
    nombre: '',
    descripcion: '',
    estado: 'PENDIENTE',
    vencimiento: '' // ✅ NUEVO: Campo de vencimiento
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        descripcion: initialData.descripcion,
        estado: initialData.estado,
        vencimiento: initialData.vencimiento || '' // ✅ NUEVO: Cargar vencimiento si existe
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del caso es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.estado) {
      newErrors.estado = 'El estado es requerido';
    }

    // ✅ NUEVO: Validar que la fecha de vencimiento no sea en el pasado
    if (formData.vencimiento) {
      const vencimientoDate = new Date(formData.vencimiento);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Solo comparar fechas, no horas
      
      if (vencimientoDate < today) {
        newErrors.vencimiento = 'La fecha de vencimiento no puede ser en el pasado';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      if (isEditing && initialData) {
        await onSave(formData, initialData.id);
      } else {
        await onSave(formData);
      }
    } catch (error) {
      console.error('Error guardando caso:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVO: Calcular fecha mínima (hoy)
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? '✏️ Editar Caso' : '➕ Nuevo Caso'}
          </h2>
          {isEditing && initialData && (
            <p className="text-sm text-gray-500 mt-1">
              Editando: {initialData.nombre}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Caso *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Ej: Litigio Laboral XYZ"
              disabled={loading}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Campo Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Describe los detalles del caso..."
              disabled={loading}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
            )}
          </div>

          {/* Campo Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                errors.estado ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="PENDIENTE">⏳ Pendiente</option>
              <option value="EN_PROCESO">🔄 En Proceso</option>
              <option value="COMPLETADO">✅ Completado</option>
              <option value="ARCHIVADO">📁 Archivado</option>
            </select>
            {errors.estado && (
              <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
            )}
          </div>

          {/* ✅ NUEVO: Campo Fecha de Vencimiento */}
          <div>
            <label htmlFor="vencimiento" className="block text-sm font-medium text-gray-700 mb-1">
              📅 Fecha de Vencimiento
            </label>
            <input
              type="date"
              id="vencimiento"
              name="vencimiento"
              value={formData.vencimiento}
              onChange={handleChange}
              min={getTodayDate()} // ✅ No permitir fechas pasadas
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                errors.vencimiento ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.vencimiento ? (
              <p className="text-red-500 text-xs mt-1">{errors.vencimiento}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                Opcional. Fecha límite para este caso.
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Actualizando...' : 'Guardando...'}
                </>
              ) : (
                isEditing ? 'Actualizar Caso' : 'Guardar Caso'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}