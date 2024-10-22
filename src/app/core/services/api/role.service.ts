import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';  // Verifica que esté correctamente importado
import { ApiResponse } from '../../models/api-response.model';
import { Role } from '../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // Ajusta la URL para reflejar correctamente el endpoint de roles
  private apiUrl = `${environment.apiUrl}/v1/roles`;  // Verifica que `environment.apiUrl` esté bien configurado

  constructor(private http: HttpClient) {}

  // Obtener todos los roles
  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(this.apiUrl).pipe(
      tap(response => console.log('Roles obtenidos:', response.result)),  // Verificar si los roles se están obteniendo
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
