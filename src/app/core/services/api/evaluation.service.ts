// src/app/core/services/evaluation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { Evaluation } from '../../models/evaluation.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = `${environment.apiUrl}/evaluations`;

  constructor(private http: HttpClient) {}

  createEvaluation(evaluation: Partial<Evaluation>, idUser: number): Observable<ApiResponse<Evaluation>> {
    return this.http.post<ApiResponse<Evaluation>>(this.apiUrl, {
      ...evaluation,
      id_user: idUser
    });
  }

  getEvaluationById(id: number): Observable<ApiResponse<Evaluation>> {
    return this.http.get<ApiResponse<Evaluation>>(`${this.apiUrl}/${id}`);
  }

  getEvaluations(
    page: number = 1,
    perPage: number = 10,
    name?: string,
    description?: string
  ): Observable<ApiResponse<Evaluation[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (name) params = params.set('name', name);
    if (description) params = params.set('description', description);

    return this.http.get<ApiResponse<Evaluation[]>>(this.apiUrl, { params });
  }

  updateEvaluation(id: number, evaluation: Partial<Evaluation>, idUser: number): Observable<ApiResponse<Evaluation>> {
    return this.http.put<ApiResponse<Evaluation>>(`${this.apiUrl}/${id}`, {
      ...evaluation,
      id_user: idUser
    });
  }

  deleteEvaluation(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
