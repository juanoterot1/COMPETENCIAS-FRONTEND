import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = `${environment.apiUrl}`; // Apunta al entorno definido

  constructor(private http: HttpClient) {}

  // Método para obtener el conteo total de evaluaciones
  getTotalEvaluations(): Observable<number> {
    return this.http.get<{ message: string; result: { total_evaluations: number }; status: number; success: boolean }>(
      `${this.apiUrl}/evaluations/count`
    ).pipe(
      map(response => response.result.total_evaluations)
    );
  }

  // Método para obtener el conteo total de asignaturas
  getTotalSubjects(): Observable<number> {
    return this.http.get<{ message: string; result: { total_subjects: number }; status: number; success: boolean }>(
      `${this.apiUrl}/subjects/count`
    ).pipe(
      map(response => response.result.total_subjects)
    );
  }
}
