import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment'; // Asegúrate de apuntar a tu archivo de entorno correcto
import { Faculty } from '../../models/faculty.models';
import { ApiResponse } from '../../models/api-response.model'; // Suponiendo que tienes un modelo ApiResponse

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiUrl = `${environment.apiUrl}/faculties`; // Ruta a tu API de facultades

  constructor(private http: HttpClient) {}

  // Obtener todas las facultades
  getFaculties(): Observable<ApiResponse<Faculty[]>> {
    return this.http.get<ApiResponse<Faculty[]>>(this.apiUrl);
  }

  // Obtener facultad por ID
  getFacultyById(id: number): Observable<ApiResponse<Faculty>> {
    return this.http.get<ApiResponse<Faculty>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva facultad
  createFaculty(faculty: Faculty): Observable<ApiResponse<Faculty>> {
    return this.http.post<ApiResponse<Faculty>>(this.apiUrl, faculty);
  }

  // Actualizar una facultad existente
  updateFaculty(id: number, faculty: Faculty): Observable<ApiResponse<Faculty>> {
    return this.http.put<ApiResponse<Faculty>>(`${this.apiUrl}/${id}`, faculty);
  }

  // Eliminar una facultad
  deleteFaculty(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
