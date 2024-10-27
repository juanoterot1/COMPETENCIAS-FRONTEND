import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = `${environment.apiUrl}`; // URL base desde el environment

  constructor(private http: HttpClient) {}

  getTotalEvaluations(): Observable<string> {
    return this.http.get<{ result: { count: number } }>(`${this.apiUrl}/evaluations/count`).pipe(
      map(response => response.result.count.toString()),
      catchError(error => {
        console.error('Error al obtener el total de evaluaciones:', error);
        throw new Error('Error al obtener el total de evaluaciones.');
      })
    );
  }

  getEvaluationsCountByStatus(): Observable<{[status: string]: number}> {
    return this.http.get<{ result: { [key: string]: number } }>(`${this.apiUrl}/evaluations/status_counts`).pipe(
      map(response => response.result),
      catchError(error => {
        console.error('Error al obtener el conteo de evaluaciones por estado:', error);
        throw new Error('Error al obtener el conteo de evaluaciones por estado.');
      })
    );
  }
}
