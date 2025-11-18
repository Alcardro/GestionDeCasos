// src/lib/caseService.ts
import { apiService, type Case, type CaseCreate } from './api';

// Re-exportar interfaces para compatibilidad
export type { Case, CaseCreate };

export interface CaseFormData {
  nombre: string;
  descripcion: string;
  estado: string;
  vencimiento?: string;
  asignado_a?: number;
}

export class CaseService {
  static async getAllCases(): Promise<Case[]> {
    console.log('📋 Obteniendo casos desde la API...');
    try {
      const cases = await apiService.getCases();
      console.log('✅ Casos obtenidos:', cases.length);
      return cases;
    } catch (error) {
      console.error('❌ Error obteniendo casos:', error);
      throw new Error('No se pudieron cargar los casos');
    }
  }

  static async getCaseById(id: string): Promise<Case | null> {
    console.log('🔍 Buscando caso con ID:', id);
    try {
      const cases = await apiService.getCases();
      return cases.find(c => c.id.toString() === id) || null;
    } catch (error) {
      console.error('Error obteniendo caso:', error);
      return null;
    }
  }

  static async createCase(caseData: CaseFormData): Promise<Case> {
    console.log('➕ Creando nuevo caso via API:', caseData);
    
    // Obtener el usuario actual para asignar creado_por
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuario no autenticado');
    }

    const user = JSON.parse(userStr);
    
    const caseCreate: CaseCreate = {
      nombre: caseData.nombre,
      descripcion: caseData.descripcion,
      estado: caseData.estado,
      vencimiento: caseData.vencimiento,
      creado_por: user.id,
      asignado_a: caseData.asignado_a || user.id
    };

    try {
      const result = await apiService.createCase(caseCreate);
      console.log('✅ Caso creado via API:', result);
      
      // Para mantener compatibilidad, devolvemos un objeto similar
      return {
        id: result.id,
        nombre: caseData.nombre,
        descripcion: caseData.descripcion,
        estado: caseData.estado as Case['estado'],
        vencimiento: caseData.vencimiento,
        creado_por: user.id,
        asignado_a: caseData.asignado_a || user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creando caso:', error);
      throw new Error('No se pudo crear el caso');
    }
  }

  static async updateCase(id: string, caseData: CaseFormData): Promise<Case> {
  console.log('✏️ Actualizando caso via API:', id, caseData);
  
  try {
    const result = await apiService.updateCase(parseInt(id), caseData);
    console.log('✅ Caso actualizado via API:', result);
    
    return result; // El backend ahora devuelve el caso completo
    
  } catch (error) {
    console.error('Error actualizando caso:', error);
    throw new Error('No se pudo actualizar el caso');
  }
}

  static async deleteCase(id: string): Promise<void> {
  console.log('🗑️ Eliminando caso via API:', id);
  
  try {
    await apiService.deleteCase(parseInt(id));
    console.log('✅ Caso eliminado via API');
  } catch (error) {
    console.error('Error eliminando caso:', error);
    throw new Error('No se pudo eliminar el caso');
  }
}

  static async getUpcomingCases(): Promise<Case[]> {
    try {
      const cases = await this.getAllCases();
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      return cases.filter(caseItem => {
        if (!caseItem.vencimiento) return false;
        const vencimientoDate = new Date(caseItem.vencimiento);
        return vencimientoDate <= sevenDaysFromNow && vencimientoDate >= now;
      });
    } catch (error) {
      console.error('Error obteniendo casos próximos:', error);
      return [];
    }
  }

  static async getOverdueCases(): Promise<Case[]> {
    try {
      const cases = await this.getAllCases();
      const now = new Date();
      
      return cases.filter(caseItem => {
        if (!caseItem.vencimiento) return false;
        const vencimientoDate = new Date(caseItem.vencimiento);
        return vencimientoDate < now;
      });
    } catch (error) {
      console.error('Error obteniendo casos vencidos:', error);
      return [];
    }
  }

  // Mantener compatibilidad con el frontend existente
  static getUsersForAssignment() {
    return [
      { id: 1, nombre: 'Abogado Principal', rol: 'ABOGADO' },
      { id: 2, nombre: 'Abogado Secundario', rol: 'ABOGADO' },
      { id: 3, nombre: 'Asistente Legal', rol: 'ASISTENTE' }
    ];
  }
}