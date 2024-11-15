import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environment/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);

  const excludedDomains = [
    environment.apiAuthUrl,
  ];

  const requestUrl = new URL(req.url);
  const requestDomain = `${requestUrl.protocol}//${requestUrl.host}`;

  if (excludedDomains.includes(requestDomain)) {
    return next(req);
  }
  const accessToken = cookieService.get('access_token');

  if (accessToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};