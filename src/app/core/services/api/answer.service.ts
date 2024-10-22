import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment'; 
import { ApiResponse } from '../../models/api-response.model';
import { EvaluationAnswer } from '../../models/evaluation_answer.models';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = `${environment.apiUrl}/v1/answers`;

  constructor(private http: HttpClient) {}
  
  createAnwser(evaluationAswer:EvaluationAnswer): Observable<ApiResponse<EvaluationAnswer[]>> {
    return this.http.post<ApiResponse<EvaluationAnswer[]>>(`${this.apiUrl}`, evaluationAswer);
  }
  
}

