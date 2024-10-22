import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Evaluation } from '../../models/evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = `${environment.apiUrl}/v1/evaluations`;
  private usersApiUrl = `${environment.apiUrl}/v1/users`;

  constructor(private http: HttpClient) {}

  // Obtener evaluaciones filtradas por id_account_manager o id_programmer y con filtros adicionales
  getEvaluationsByUser(userId: number, params?: any): Observable<ApiResponse<Evaluation[]>> {
    let queryParams = new HttpParams();

    // Añadir todos los filtros al queryParams
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams = queryParams.append(key, params[key]);
        }
      });
    }

    return this.http.get<ApiResponse<Evaluation[]>>(this.apiUrl, { params: queryParams });
  }

  // Obtener una evaluación por ID
  getEvaluationById(id: number): Observable<ApiResponse<Evaluation>> {
    return this.http.get<ApiResponse<Evaluation>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva evaluación
  createEvaluation(evaluation: Evaluation): Observable<ApiResponse<Evaluation>> {
    return this.http.post<ApiResponse<Evaluation>>(this.apiUrl, evaluation);
  }

  // Actualizar una evaluación existente
  updateEvaluation(id: number, data: Partial<Evaluation>): Observable<ApiResponse<Evaluation>> {
    return this.http.put<ApiResponse<Evaluation>>(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar una evaluación
  deleteEvaluation(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Obtener el nombre del gerente de cuenta o programador por su ID
  getUserById(userId: number): Observable<{ name: string }> {
    return this.http.get<{ name: string }>(`${this.usersApiUrl}/${userId}`);
  }
}
