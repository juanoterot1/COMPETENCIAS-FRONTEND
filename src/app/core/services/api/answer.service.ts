// src/app/core/services/api/answer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { Answer } from '../../models/answer.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private apiUrl = `${environment.apiUrl}/answers`;

  constructor(private http: HttpClient) {}

  // Método para crear respuestas en batch
  createAnswers(answers: Partial<Answer>[]): Observable<ApiResponse<Answer[]>> {
    return this.http.post<ApiResponse<Answer[]>>(this.apiUrl, answers);
  }

  // Obtener una respuesta por su ID
  getAnswerById(id: number): Observable<ApiResponse<Answer>> {
    return this.http.get<ApiResponse<Answer>>(`${this.apiUrl}/${id}`);
  }

  // Obtener respuestas con paginación y filtros opcionales
  getAnswers(
    page: number = 1,
    perPage: number = 10,
    idEvaluation?: number,
    idQuestion?: number
  ): Observable<ApiResponse<Answer[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (idEvaluation) {
      params = params.set('id_evaluation', idEvaluation.toString());
    }
    if (idQuestion) {
      params = params.set('id_question', idQuestion.toString());
    }

    return this.http.get<ApiResponse<Answer[]>>(`${this.apiUrl}`, { params });
  }

  // Actualizar una respuesta
  updateAnswer(
    id: number,
    answer: Partial<Answer>,
    idUser: number
  ): Observable<ApiResponse<Answer>> {
    return this.http.put<ApiResponse<Answer>>(`${this.apiUrl}/${id}`, {
      ...answer,
      id_user: idUser,
    });
  }

  // Eliminar una respuesta
  deleteAnswer(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
