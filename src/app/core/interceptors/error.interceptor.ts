import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Only react to failures from our own API.
      if (req.url.startsWith(environment.apiUrl)) {
        if (err.status === 401) {
          auth.logout();
          toast.error('Your session has expired. Please log in again.');
        } else if (err.status === 0) {
          toast.error('Cannot reach the server. Check your connection and try again.');
        } else {
          const message = err.error?.message ?? 'Something went wrong. Please try again.';
          toast.error(message);
        }
      }
      return throwError(() => err);
    }),
  );
};
