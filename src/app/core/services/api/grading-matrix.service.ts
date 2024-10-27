// src/app/core/services/grading-matrix.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { GradingMatrix } from '../../models/grading-matrix.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class GradingMatrixService {
  private apiUrl = `${environment.apiUrl}/grading_matrices`;

  constructor(private http: HttpClient) {}

  createGradingMatrix(gradingMatrix: Partial<GradingMatrix>, idUser: number): Observable<ApiResponse<GradingMatrix>> {
    return this.http.post<ApiResponse<GradingMatrix>>(this.apiUrl, {
      ...gradingMatrix,
      id_user: idUser
    });
  }

  getGradingMatrixById(id: number): Observable<ApiResponse<GradingMatrix>> {
    return this.http.get<ApiResponse<GradingMatrix>>(`${this.apiUrl}/${id}`);
  }

  getGradingMatrices(
    page: number = 1,
    perPage: number = 10,
    idSubject?: number
  ): Observable<ApiResponse<GradingMatrix[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (idSubject) params = params.set('id_subject', idSubject.toString());

    return this.http.get<ApiResponse<GradingMatrix[]>>(this.apiUrl, { params });
  }

  updateGradingMatrix(id: number, gradingMatrix: Partial<GradingMatrix>, idUser: number): Observable<ApiResponse<GradingMatrix>> {
    return this.http.put<ApiResponse<GradingMatrix>>(`${this.apiUrl}/${id}`, {
      ...gradingMatrix,
      id_user: idUser
    });
  }

  deleteGradingMatrix(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
