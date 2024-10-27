// src/app/core/services/role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { Role } from '../../models/role.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  createRole(roleName: string, idUser: number): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(this.apiUrl, {
      role_name: roleName,
      id_user: idUser
    });
  }

  getRoleById(id: number): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`);
  }

  getRoles(
    page: number = 1,
    perPage: number = 10,
    roleName?: string
  ): Observable<ApiResponse<Role[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (roleName) params = params.set('role_name', roleName);

    return this.http.get<ApiResponse<Role[]>>(this.apiUrl, { params });
  }

  updateRole(id: number, roleName: string, idUser: number): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${id}`, {
      role_name: roleName,
      id_user: idUser
    });
  }

  deleteRole(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
