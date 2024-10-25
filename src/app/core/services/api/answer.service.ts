import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Answer } from '../../models/answer.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = `${environment.apiUrl}/answers`;

  constructor(private http: HttpClient) {}

  // Obtener todas las respuestas
  getAnswers(): Observable<ApiResponse<Answer[]>> {
    return this.http.get<ApiResponse<Answer[]>>(this.apiUrl);
  }

  // Obtener una respuesta por ID
  getAnswerById(id: number): Observable<ApiResponse<Answer>> {
    return this.http.get<ApiResponse<Answer>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva respuesta
  createAnswer(answer: Partial<Answer>): Observable<ApiResponse<Answer>> {
    return this.http.post<ApiResponse<Answer>>(this.apiUrl, answer);
  }

  // Actualizar una respuesta existente
  updateAnswer(id: number, answer: Partial<Answer>): Observable<ApiResponse<Answer>> {
    return this.http.put<ApiResponse<Answer>>(`${this.apiUrl}/${id}`, answer);
  }

  // Eliminar una respuesta
  deleteAnswer(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
