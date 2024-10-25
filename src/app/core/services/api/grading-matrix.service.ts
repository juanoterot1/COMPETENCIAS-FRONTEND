import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../models/api-response.model';
import { GradingMatrix } from '../../models/grading-matrix.model';

@Injectable({
  providedIn: 'root'
})
export class GradingMatrixService {
  private apiUrl = `${environment.apiUrl}/grading_matrices`;

  constructor(private http: HttpClient) {}

  // Obtener todas las entradas de la tabla grading_matrix
  getGradingMatrices(): Observable<ApiResponse<GradingMatrix[]>> {
    return this.http.get<ApiResponse<GradingMatrix[]>>(this.apiUrl);
  }

  // Obtener una entrada por ID
  getGradingMatrixById(id: number): Observable<ApiResponse<GradingMatrix>> {
    return this.http.get<ApiResponse<GradingMatrix>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva entrada
  createGradingMatrix(matrix: Partial<GradingMatrix>): Observable<ApiResponse<GradingMatrix>> {
    return this.http.post<ApiResponse<GradingMatrix>>(this.apiUrl, matrix);
  }

  // Actualizar una entrada existente
  updateGradingMatrix(id: number, matrix: Partial<GradingMatrix>): Observable<ApiResponse<GradingMatrix>> {
    return this.http.put<ApiResponse<GradingMatrix>>(`${this.apiUrl}/${id}`, matrix);
  }

  // Eliminar una entrada
  deleteGradingMatrix(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
