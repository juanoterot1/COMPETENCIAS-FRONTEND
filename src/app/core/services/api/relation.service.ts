import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:8080/api/v1';


@Injectable({
  providedIn: 'root',
})
export class RelationService {
  constructor(private http: HttpClient) {}

  // Obtener relaciones con filtros opcionales y paginación
  getRelations(
    page: number,
    perPage: number,
    filters?: {
      relationId?: number;
      contract?: number;
      service?: number;
      accountManager?: number;
      programmer?: number;
    }
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    // Añadir filtros si están presentes
    if (filters) {
      if (filters.relationId !== undefined && filters.relationId !== null) {
        params = params.set('id', filters.relationId.toString());
      }
      if (filters.contract !== undefined && filters.contract !== null) {
        params = params.set('contract', filters.contract.toString());
      }
      if (filters.service !== undefined && filters.service !== null) {
        params = params.set('service', filters.service.toString());
      }
      if (filters.accountManager !== undefined && filters.accountManager !== null) {
        params = params.set('account_manager', filters.accountManager.toString());
      }
      if (filters.programmer !== undefined && filters.programmer !== null) {
        params = params.set('programmer', filters.programmer.toString());
      }
    }

    return this.http.get<any>(`${API_BASE_URL}/relations`, { params });
  }

  // Resto de métodos...

  // Obtener ciudades por NIT
  getCitiesByNit(nit: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/contract-services/cities/${nit}`);
  }

  // Obtener contratos por NIT y ciudad
  getContractsByNitAndCity(nit: string, city: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/contract-services/contracts?nit=${nit}&city=${city}`);
  }

  // Obtener servicios por contrato (usando idReg del contrato)
  getServicesByContract(idReg: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/contract-services/services/${idReg}`);
  }

  // Crear relación entre gerente de cuenta y programador
  createRelation(relation: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/relations`, relation);
  }

  // Obtener relación por ID
  getRelationById(id: number): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/relations/${id}`);
  }

  // Obtener relaciones por contrato
  getRelationsByContract(contractId: number): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/relations/contracts/${contractId}`);
  }

  // Obtener relaciones por servicio
  getRelationsByService(serviceId: number): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/relations/services/${serviceId}`);
  }

  // Obtener relaciones por contrato y servicio
  getRelationsByContractAndService(contractId: number, serviceId: number): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/relations?contract=${contractId}&service=${serviceId}`);
  }

  // Actualizar una relación
  updateRelation(id: number, relation: any): Observable<any> {
    return this.http.put<any>(`${API_BASE_URL}/relations/${id}`, relation);
  }

  // Eliminar relación por ID
  deleteRelation(id: number): Observable<any> {
    return this.http.delete<any>(`${API_BASE_URL}/relations/${id}`);
  }

   // Obtener el nombre del cliente por NIT
   getNombreClienteByNit(nit: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/contract-services/nombre-cli/${nit}`);
  }
}
