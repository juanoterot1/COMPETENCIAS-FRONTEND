// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(user: Partial<User>, performedBy: string): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, {
      ...user,
      performed_by: performedBy
    });
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  getUsers(
    page: number = 1,
    perPage: number = 10,
    username?: string,
    fullName?: string,
    mail?: string,
    dni?: string,
    roleId?: number
  ): Observable<ApiResponse<User[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (username) params = params.set('username', username);
    if (fullName) params = params.set('full_name', fullName);
    if (mail) params = params.set('mail', mail);
    if (dni) params = params.set('dni', dni);
    if (roleId) params = params.set('role_id', roleId.toString());

    return this.http.get<ApiResponse<User[]>>(this.apiUrl, { params });
  }

  updateUser(id: number, user: Partial<User>, performedBy: string): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, {
      ...user,
      performed_by: performedBy
    });
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
