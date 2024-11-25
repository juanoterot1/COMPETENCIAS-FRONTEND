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

  /**
   * Método para enviar múltiples respuestas en una sola petición.
   * @param answers Array de respuestas a enviar al backend.
   * @returns Observable con la respuesta de la API.
   */
  createAnswers(answers: Partial<Answer>[]): Observable<ApiResponse<Answer[]>> {
    return this.http.post<ApiResponse<Answer[]>>(this.apiUrl, answers);
  }

  /**
   * Obtener respuestas con filtros opcionales y paginación.
   * @param page Número de página actual.
   * @param perPage Cantidad de respuestas por página.
   * @param idEvaluation (Opcional) Filtro por ID de evaluación.
   * @param idQuestion (Opcional) Filtro por ID de pregunta.
   * @returns Observable con el listado de respuestas paginadas.
   */
  getAnswers(
    page: number = 1,
    perPage: number = 10,
    idEvaluation?: number,
    idQuestion?: number
  ): Observable<ApiResponse<Answer[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (idEvaluation !== undefined) {
      params = params.set('id_evaluation', idEvaluation.toString());
    }
    if (idQuestion !== undefined) {
      params = params.set('id_question', idQuestion.toString());
    }

    return this.http.get<ApiResponse<Answer[]>>(`${this.apiUrl}`, { params });
  }

  /**
   * Obtener una respuesta específica por su ID.
   * @param id ID de la respuesta a buscar.
   * @returns Observable con la respuesta correspondiente.
   */
  getAnswerById(id: number): Observable<ApiResponse<Answer>> {
    return this.http.get<ApiResponse<Answer>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualizar una respuesta específica.
   * @param id ID de la respuesta a actualizar.
   * @param answer Datos a actualizar de la respuesta.
   * @returns Observable con la respuesta actualizada.
   */
  updateAnswer(id: number, answer: Partial<Answer>): Observable<ApiResponse<Answer>> {
    return this.http.put<ApiResponse<Answer>>(`${this.apiUrl}/${id}`, answer);
  }

  /**
   * Eliminar una respuesta específica por su ID.
   * @param id ID de la respuesta a eliminar.
   * @returns Observable que indica el resultado de la operación.
   */
  deleteAnswer(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
