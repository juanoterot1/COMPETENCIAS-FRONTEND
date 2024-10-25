import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Question } from '../../models/question.models';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  // Obtener todas las preguntas
  getQuestions(): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(this.apiUrl);
  }

  // Obtener una pregunta por ID
  getQuestionById(id: number): Observable<ApiResponse<Question>> {
    return this.http.get<ApiResponse<Question>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva pregunta
  createQuestion(question: Partial<Question>): Observable<ApiResponse<Question>> {
    return this.http.post<ApiResponse<Question>>(this.apiUrl, question);
  }

  // Actualizar una pregunta existente
  updateQuestion(id: number, question: Partial<Question>): Observable<ApiResponse<Question>> {
    return this.http.put<ApiResponse<Question>>(`${this.apiUrl}/${id}`, question);
  }

  // Eliminar una pregunta
  deleteQuestion(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
