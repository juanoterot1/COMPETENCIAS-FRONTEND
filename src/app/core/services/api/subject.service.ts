import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Subject } from '../../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = `${environment.apiUrl}/subjects`;

  constructor(private http: HttpClient) {}

  // Obtener todas las materias
  getSubjects(): Observable<ApiResponse<Subject[]>> {
    return this.http.get<ApiResponse<Subject[]>>(this.apiUrl);
  }

  // Obtener una materia por ID
  getSubjectById(id: number): Observable<ApiResponse<Subject>> {
    return this.http.get<ApiResponse<Subject>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva materia
  createSubject(subject: Partial<Subject>): Observable<ApiResponse<Subject>> {
    return this.http.post<ApiResponse<Subject>>(this.apiUrl, subject);
  }

  // Actualizar una materia existente
  updateSubject(id: number, subject: Partial<Subject>): Observable<ApiResponse<Subject>> {
    return this.http.put<ApiResponse<Subject>>(`${this.apiUrl}/${id}`, subject);
  }

  // Eliminar una materia
  deleteSubject(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
