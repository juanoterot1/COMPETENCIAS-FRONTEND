// src/app/core/services/api/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`; 
    const body = { username, password };
    return this.http.post(url, body);
  }

  setAccessToken(token: string) {
    // Establece la cookie con el token de acceso
    this.cookieService.set('access_token', token, { path: '/' });
  }

  getAccessToken(): string {
    return this.cookieService.get('access_token');
  }

  logout() {
    // Elimina el token al cerrar sesión
    this.cookieService.delete('access_token', '/');
  }
}
