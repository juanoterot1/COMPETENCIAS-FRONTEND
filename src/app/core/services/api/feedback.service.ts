// src/app/core/services/feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../../models/feedback.model';
import { ApiResponse } from '../../models/api-response.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private apiUrl = `${environment.apiUrl}/feedback`;

  constructor(private http: HttpClient) {}

  createFeedback(feedback: Partial<Feedback>, performedBy: string): Observable<ApiResponse<Feedback>> {
    return this.http.post<ApiResponse<Feedback>>(this.apiUrl, {
      ...feedback,
      performed_by: performedBy,
    });
  }

  getFeedbackById(id: number): Observable<ApiResponse<Feedback>> {
    return this.http.get<ApiResponse<Feedback>>(`${this.apiUrl}/${id}`);
  }

  getFeedbacks(
    page: number = 1,
    perPage: number = 10,
    idEvaluation?: number,
    idUser?: number
  ): Observable<ApiResponse<Feedback[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (idEvaluation) params = params.set('id_evaluation', idEvaluation.toString());
    if (idUser) params = params.set('id_user', idUser.toString());

    return this.http.get<ApiResponse<Feedback[]>>(this.apiUrl, { params });
  }

  updateFeedback(id: number, feedback: Partial<Feedback>, performedBy: string): Observable<ApiResponse<Feedback>> {
    return this.http.put<ApiResponse<Feedback>>(`${this.apiUrl}/${id}`, {
      ...feedback,
      performed_by: performedBy,
    });
  }

  deleteFeedback(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
