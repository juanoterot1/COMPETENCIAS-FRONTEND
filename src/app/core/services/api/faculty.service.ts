// src/app/core/services/faculty.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { Faculty } from '../../models/faculty.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiUrl = `${environment.apiUrl}/faculties`;

  constructor(private http: HttpClient) {}

  createFaculty(name: string, idUser: number): Observable<ApiResponse<Faculty>> {
    return this.http.post<ApiResponse<Faculty>>(this.apiUrl, {
      name: name,
      id_user: idUser
    });
  }

  getFacultyById(id: number): Observable<ApiResponse<Faculty>> {
    return this.http.get<ApiResponse<Faculty>>(`${this.apiUrl}/${id}`);
  }

  getFaculties(
    page: number = 1,
    perPage: number = 10,
    name?: string
  ): Observable<ApiResponse<Faculty[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (name) params = params.set('name', name);

    return this.http.get<ApiResponse<Faculty[]>>(this.apiUrl, { params });
  }

  updateFaculty(id: number, name: string, idUser: number): Observable<ApiResponse<Faculty>> {
    return this.http.put<ApiResponse<Faculty>>(`${this.apiUrl}/${id}`, {
      name: name,
      id_user: idUser
    });
  }

  deleteFaculty(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
