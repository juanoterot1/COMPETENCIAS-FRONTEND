import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Role } from '../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  // Obtener todos los roles
  getRoles(role_name?: string): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(this.apiUrl);
  }

  // Obtener un rol por ID
  getRoleById(id: number): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo rol
  createRole(role: Partial<Role>): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(this.apiUrl, role);
  }

  // Actualizar un rol existente
  updateRole(id: number, role: Partial<Role>): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${id}`, role);
  }

  // Eliminar un rol
  deleteRole(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
