import { HttpInterceptorFn } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';
import { LoadingBarService } from '../api/loading-bar.service';
import { inject } from '@angular/core';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingBarService = inject(LoadingBarService);

  loadingBarService.startLoading();

  return next(req).pipe(
    tap({
      error: () => {
        loadingBarService.stopLoading();
      },
    }),
    finalize(() => {
      loadingBarService.stopLoading();
    })
  );
};