import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Evaluation } from '../../models/evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = `${environment.apiUrl}/evaluations`;

  constructor(private http: HttpClient) {}

  // Obtener todas las evaluaciones con filtros opcionales
  getEvaluations(subjectId: number | null = null, facultyId: number | null = null): Observable<ApiResponse<Evaluation[]>> {
    let url = `${this.apiUrl}?`;
    
    if (subjectId !== null) {
      url += `subjectId=${subjectId}&`;
    }
    
    if (facultyId !== null) {
      url += `facultyId=${facultyId}`;
    }

    return this.http.get<ApiResponse<Evaluation[]>>(url);
  }

  // Obtener una evaluación por ID
  getEvaluationById(id: number): Observable<ApiResponse<Evaluation>> {
    return this.http.get<ApiResponse<Evaluation>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva evaluación
  createEvaluation(evaluation: Partial<Evaluation>): Observable<ApiResponse<Evaluation>> {
    return this.http.post<ApiResponse<Evaluation>>(this.apiUrl, evaluation);
  }

  // Actualizar una evaluación existente
  updateEvaluation(id: number, evaluation: Partial<Evaluation>): Observable<ApiResponse<Evaluation>> {
    return this.http.put<ApiResponse<Evaluation>>(`${this.apiUrl}/${id}`, evaluation);
  }

  // Eliminar una evaluación
  deleteEvaluation(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
