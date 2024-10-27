import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = `${environment.apiUrl}/v1`; // Asegúrate de que esta URL es la correcta

  constructor(private http: HttpClient) {}

  getTotalEvaluations(): Observable<string> {
    return this.http.get<{ result: { count: number } }>(`${this.apiUrl}/evaluations/count`).pipe(
      map(response => response.result.count.toString())
    );
  }

  getEvaluationsCountByStatus(): Observable<{[status: string]: number}> {
    return this.http.get<{ result: { [key: string]: number } }>(`${this.apiUrl}/evaluations/status_counts`).pipe(
      map(response => response.result)
    );
}
}
