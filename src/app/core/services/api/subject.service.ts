// src/app/core/services/subject.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { Subject } from '../../models/subject.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = `${environment.apiUrl}/subjects`;

  constructor(private http: HttpClient) {}

  createSubject(name: string, code: string, idFaculty: number, idUser: number): Observable<ApiResponse<Subject>> {
    return this.http.post<ApiResponse<Subject>>(this.apiUrl, {
      name: name,
      code: code,
      id_faculty: idFaculty,
      id_user: idUser
    });
  }

  getSubjectById(id: number): Observable<ApiResponse<Subject>> {
    return this.http.get<ApiResponse<Subject>>(`${this.apiUrl}/${id}`);
  }

  getSubjects(
    page: number = 1,
    perPage: number = 10,
    name?: string,
    code?: string
  ): Observable<ApiResponse<Subject[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (name) params = params.set('name', name);
    if (code) params = params.set('code', code);

    return this.http.get<ApiResponse<Subject[]>>(this.apiUrl, { params });
  }

  updateSubject(id: number, name: string, code: string, idFaculty: number, idUser: number): Observable<ApiResponse<Subject>> {
    return this.http.put<ApiResponse<Subject>>(`${this.apiUrl}/${id}`, {
      name: name,
      code: code,
      id_faculty: idFaculty,
      id_user: idUser
    });
  }

  deleteSubject(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
