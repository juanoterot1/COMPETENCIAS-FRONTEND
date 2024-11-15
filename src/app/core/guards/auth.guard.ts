// core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(): Observable<boolean> {
    const accessToken = this.cookieService.get('access_token');

    if (accessToken) {
      // Si hay un token de acceso, se permite el acceso
      return of(true);
    } else {
      // Si no hay token de acceso, redirige a login
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}
