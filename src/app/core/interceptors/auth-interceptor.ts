import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { DefaultResponse } from '../../types/defaultResponse.interface';
import { LoginResponse } from '../../types/auth/loginResponse.interface';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const tokens = authService.getTokens();
  if (tokens && tokens.accessToken) {
    const authReq = req.clone({
      headers: req.headers.set('x-auth', tokens.accessToken),
    });
    return next(authReq).pipe(
      catchError(error => {
        if (
          error.status === 401 &&
          !authReq.url.includes('/login') &&
          !authReq.url.includes('/refresh')
        ) {
          return handle401Error(authReq, next, authService, router);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<any>> {
  return authService.refresh().pipe(
    switchMap((res: DefaultResponse | LoginResponse) => {
      let error: string = '';
      if ((res as DefaultResponse).error !== undefined) {
        error = (res as DefaultResponse).message;
      }
      const refreshResult = res as LoginResponse;
      if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
        error = 'Ошибка обновления токена';
      }
      if (error) {
        return throwError(() => new Error(error));
      }
      authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
      const authReq = req.clone({
        headers: req.headers.set('x-access-token', refreshResult.accessToken),
      });
      return next(authReq);
    }),
    catchError(err => {
      authService.removeTokens();
      router.navigate(['/']);
      return throwError(() => err);
    })
  );
}
