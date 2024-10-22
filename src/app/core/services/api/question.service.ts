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
  private apiUrl = `${environment.apiUrl}/v1/questions`;

  constructor(private http: HttpClient) {}

  getAllQuestions(): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(this.apiUrl);
}

}