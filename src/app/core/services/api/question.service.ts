// src/app/core/services/question.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { Question } from '../../models/question.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  createQuestion(question: Partial<Question>, idUser: number): Observable<ApiResponse<Question>> {
    return this.http.post<ApiResponse<Question>>(this.apiUrl, {
      ...question,
      id_user: idUser
    });
  }

  getQuestionById(id: number): Observable<ApiResponse<Question>> {
    return this.http.get<ApiResponse<Question>>(`${this.apiUrl}/${id}`);
  }

  getQuestions(
    page: number = 1,
    perPage: number = 10,
    name?: string
  ): Observable<ApiResponse<Question[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (name) params = params.set('name', name);

    return this.http.get<ApiResponse<Question[]>>(this.apiUrl, { params });
  }

  updateQuestion(id: number, question: Partial<Question>, idUser: number): Observable<ApiResponse<Question>> {
    return this.http.put<ApiResponse<Question>>(`${this.apiUrl}/${id}`, {
      ...question,
      id_user: idUser
    });
  }

  deleteQuestion(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
