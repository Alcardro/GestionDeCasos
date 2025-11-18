// src/lib/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

// Interfaces para la API
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    nombre: string;
  };
}

export interface Case {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'ARCHIVADO';
  vencimiento?: string;
  creado_por: number;
  asignado_a?: number;
  created_at: string;
  updated_at: string;
}

export interface CaseCreate {
  nombre: string;
  descripcion: string;
  estado: string;
  vencimiento?: string;
  creado_por: number;
  asignado_a?: number;
}

// Servicio de API
class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Cases
  async getCases(): Promise<Case[]> {
    return this.request('/cases');
  }

  async createCase(caseData: CaseCreate): Promise<any> {
    return this.request('/cases', {
      method: 'POST',
      body: JSON.stringify(caseData),
    });
  }

  async updateCase(id: number, caseData: Partial<CaseCreate>): Promise<any> {
    return this.request(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(caseData),
    });
  }

  async deleteCase(id: number): Promise<any> {
    return this.request(`/cases/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();