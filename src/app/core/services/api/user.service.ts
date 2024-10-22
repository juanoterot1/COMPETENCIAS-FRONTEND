import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';  // Importar HttpParams
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/v1/users`;

  constructor(private http: HttpClient) {}

  // Obtener usuarios con filtros opcionales
  getUsers(username?: string, email?: string, full_name?: string, id_role?: number, phone_number?: string): Observable<ApiResponse<User[]>> {
    let params = new HttpParams();

    if (username && username.trim() !== '') {
      params = params.set('username', username);
    }
    
    if (email && email.trim() !== '') {
      params = params.set('email', email);
    }
    if (full_name && full_name.trim() !== '') {
      params = params.set('full_name', full_name);
    }
    if (id_role !== undefined && id_role !== null) {
      params = params.set('id_role', id_role.toString());
    }
    if (phone_number !== undefined && phone_number !== null) {
      params = params.set('phone_number', phone_number.toString());
    }

    return this.http.get<ApiResponse<User[]>>(this.apiUrl, { params });
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  // Obtener un usuario por email
  getUserByEmail(email: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${email}`);
  }

  // Crear un nuevo usuario
  createUser(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, user);
  }

  // Actualizar un usuario existente
  updateUser(id: number, user: User): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user);
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
